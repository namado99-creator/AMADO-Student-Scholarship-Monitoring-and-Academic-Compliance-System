# ScholarTrack Static GitHub Pages Version

This ZIP is a separate static HTML/CSS/JavaScript version for testing. It does not change your existing submitted repository or live deployment.

## Files
- `index.html` — complete single-file frontend; no Vite build or `src` folder required.
- Uses the Supabase JavaScript v2 CDN.

## Supabase configuration
The file is configured for the existing Supabase project URL and publishable key. A publishable key is intended for browser use; never put a service-role/secret key in client-side code.

This expects these tables and columns from the current SQL:
- `profiles`: `id`, `full_name`, `student_id`, `role`
- `scholarship_programs`: `id` plus a program name field such as `name`, `program_name`, or `title`
- `academic_submissions`: `scholar_id`, `student_id`, `scholar_name`, `program_id`, `academic_year`, `semester`, `gwa`, `units`, `failed_subjects`, `incomplete_subjects`, `dropped_subjects`, `evidence`, `status`, `compliance_result`, `renewal_decision`, `staff_notes`, `reviewed_by`, `updated_at`, `created_at`
- `audit_logs`: `actor_id`, `submission_id`, `action`, `details`, `created_at`

## Important limitations / checks
- Your existing Supabase SQL policies (RLS) remain the security boundary. Do not disable RLS to make the UI work.
- Sign-up creates a scholar account only. Staff must be assigned the staff role in Supabase by an authorized admin.
- The auth trigger must create a `profiles` row for new users.
- The evidence field stores a URL; it does not upload files.
- This version is based on the schema details provided so far. If the real table has different column names, Supabase will return a clear error that needs a small adjustment.
- This ZIP does not change the existing live site. Keep your submitted repository untouched while testing.

## Deploy separately
1. Unzip the folder.
2. Create a separate test GitHub repository.
3. Upload `index.html` and this README to the repository root.
4. Go to Settings → Pages → Deploy from a branch → `main` → `/(root)`.
5. Test sign-in, program loading, scholar submission, and staff review. Do not replace your submitted site unless you decide to after testing.
