-- Starter schema and RLS policies. Review/test before using real student data.
create table if not exists public.scholarship_programs (
 program_id bigint generated always as identity primary key, program_name text unique not null,
 max_gwa numeric(3,2) not null check(max_gwa between 1 and 5), min_units integer not null check(min_units>=0),
 allowed_failed integer not null default 0 check(allowed_failed>=0),
 allowed_incomplete integer not null default 0 check(allowed_incomplete>=0),
 allowed_dropped integer not null default 0 check(allowed_dropped>=0), deadline timestamptz not null
);
create table if not exists public.user_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade, student_id text unique,
 full_name text not null, role text not null check(role in('scholar','staff'))
);
create table if not exists public.scholar_assignments (
 assignment_id bigint generated always as identity primary key,
 scholar_id uuid not null unique references public.user_profiles(user_id),
 program_id bigint not null references public.scholarship_programs(program_id), assigned_at timestamptz not null default now()
);
create table if not exists public.semester_submissions (
 submission_id bigint generated always as identity primary key,
 assignment_id bigint not null references public.scholar_assignments(assignment_id),
 academic_year text not null, semester text not null, gwa numeric(3,2) not null check(gwa between 1 and 5),
 enrolled_units integer not null check(enrolled_units>=0), failed_count integer not null default 0 check(failed_count>=0),
 incomplete_count integer not null default 0 check(incomplete_count>=0), dropped_count integer not null default 0 check(dropped_count>=0),
 evidence_reference text not null check(length(trim(evidence_reference))>0), submitted_at timestamptz not null default now(),
 is_late boolean not null default false, verification_status text not null default 'Pending' check(verification_status in('Pending','Verified','Returned')),
 compliance_result text check(compliance_result in('Compliant','With Deficiency')), renewal_decision text check(renewal_decision in('Approved','Held')),
 staff_notes text, unique(assignment_id,academic_year,semester),
 check(renewal_decision is distinct from 'Approved' or compliance_result='Compliant')
);
create table if not exists public.verification_history (
 verification_id bigint generated always as identity primary key, submission_id bigint not null references public.semester_submissions(submission_id),
 staff_user_id uuid not null references public.user_profiles(user_id), action text not null check(action in('Verified','Returned')),
 reason text, action_at timestamptz not null default now()
);
create table if not exists public.evaluation_history (
 evaluation_id bigint generated always as identity primary key, submission_id bigint not null references public.semester_submissions(submission_id),
 staff_user_id uuid not null references public.user_profiles(user_id), result text not null check(result in('Compliant','With Deficiency')),
 deficiency_reasons text, evaluated_at timestamptz not null default now()
);
create table if not exists public.renewal_history (
 renewal_id bigint generated always as identity primary key, submission_id bigint not null references public.semester_submissions(submission_id),
 staff_user_id uuid not null references public.user_profiles(user_id), decision text not null check(decision in('Approved','Held')),
 decision_notes text not null, decided_at timestamptz not null default now()
);
insert into public.scholarship_programs(program_name,max_gwa,min_units,allowed_failed,allowed_incomplete,allowed_dropped,deadline) values
('Merit Scholar',1.75,18,0,0,0,'2026-10-30 17:00:00+08'),
('Community Scholar',2.25,15,0,0,1,'2026-10-30 17:00:00+08')
on conflict(program_name) do update set max_gwa=excluded.max_gwa,min_units=excluded.min_units,allowed_failed=excluded.allowed_failed,allowed_incomplete=excluded.allowed_incomplete,allowed_dropped=excluded.allowed_dropped,deadline=excluded.deadline;
alter table public.scholarship_programs enable row level security;
alter table public.user_profiles enable row level security;
alter table public.scholar_assignments enable row level security;
alter table public.semester_submissions enable row level security;
alter table public.verification_history enable row level security;
alter table public.evaluation_history enable row level security;
alter table public.renewal_history enable row level security;
create or replace function public.is_staff() returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.user_profiles where user_id=(select auth.uid()) and role='staff');
$$;
revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to authenticated;
drop policy if exists programs_read on public.scholarship_programs;
create policy programs_read on public.scholarship_programs for select to authenticated using(true);
drop policy if exists programs_staff on public.scholarship_programs;
create policy programs_staff on public.scholarship_programs for all to authenticated using(public.is_staff()) with check(public.is_staff());
drop policy if exists profiles_read on public.user_profiles;
create policy profiles_read on public.user_profiles for select to authenticated using(user_id=(select auth.uid()) or public.is_staff());
drop policy if exists profiles_staff on public.user_profiles;
create policy profiles_staff on public.user_profiles for all to authenticated using(public.is_staff()) with check(public.is_staff());
drop policy if exists assignments_read on public.scholar_assignments;
create policy assignments_read on public.scholar_assignments for select to authenticated using(scholar_id=(select auth.uid()) or public.is_staff());
drop policy if exists assignments_staff on public.scholar_assignments;
create policy assignments_staff on public.scholar_assignments for all to authenticated using(public.is_staff()) with check(public.is_staff());
drop policy if exists submissions_read on public.semester_submissions;
create policy submissions_read on public.semester_submissions for select to authenticated using(public.is_staff() or exists(select 1 from public.scholar_assignments a where a.assignment_id=semester_submissions.assignment_id and a.scholar_id=(select auth.uid())));
drop policy if exists submissions_insert_own on public.semester_submissions;
create policy submissions_insert_own on public.semester_submissions for insert to authenticated with check(verification_status='Pending' and compliance_result is null and renewal_decision is null and exists(select 1 from public.scholar_assignments a where a.assignment_id=semester_submissions.assignment_id and a.scholar_id=(select auth.uid())));
drop policy if exists submissions_staff_update on public.semester_submissions;
create policy submissions_staff_update on public.semester_submissions for update to authenticated using(public.is_staff()) with check(public.is_staff());
drop policy if exists submissions_returned_update on public.semester_submissions;
create policy submissions_returned_update on public.semester_submissions for update to authenticated using(verification_status='Returned' and exists(select 1 from public.scholar_assignments a where a.assignment_id=semester_submissions.assignment_id and a.scholar_id=(select auth.uid()))) with check(verification_status='Pending' and compliance_result is null and renewal_decision is null and exists(select 1 from public.scholar_assignments a where a.assignment_id=semester_submissions.assignment_id and a.scholar_id=(select auth.uid())));
drop policy if exists verification_staff_read on public.verification_history;
create policy verification_staff_read on public.verification_history for select to authenticated using(public.is_staff());
drop policy if exists verification_staff_insert on public.verification_history;
create policy verification_staff_insert on public.verification_history for insert to authenticated with check(public.is_staff() and staff_user_id=(select auth.uid()));
drop policy if exists evaluation_staff_read on public.evaluation_history;
create policy evaluation_staff_read on public.evaluation_history for select to authenticated using(public.is_staff());
drop policy if exists evaluation_staff_insert on public.evaluation_history;
create policy evaluation_staff_insert on public.evaluation_history for insert to authenticated with check(public.is_staff() and staff_user_id=(select auth.uid()));
drop policy if exists renewal_staff_read on public.renewal_history;
create policy renewal_staff_read on public.renewal_history for select to authenticated using(public.is_staff());
drop policy if exists renewal_staff_insert on public.renewal_history;
create policy renewal_staff_insert on public.renewal_history for insert to authenticated with check(public.is_staff() and staff_user_id=(select auth.uid()));
