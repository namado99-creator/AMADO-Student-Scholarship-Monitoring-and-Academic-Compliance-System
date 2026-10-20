# ScholarTrack

**Student Scholarship Monitoring and Academic Compliance System**

ScholarTrack is a web-based system designed to help scholars submit academic records and help scholarship staff review academic compliance.

## Technology
- HTML
- CSS
- JavaScript
- Supabase Authentication and PostgreSQL
- GitHub Pages for static hosting

## Main Features
- Sign in and scholar account registration
- Role-based access for scholars and staff
- Dashboard with academic submission summaries
- Scholarship program listing
- Academic record submission and status tracking
- Staff review of submission status and compliance
- Audit history for staff actions

## Supabase Configuration
The application connects to the configured Supabase project using its project URL and publishable key. A publishable key is intended for browser use. Never place a Supabase service-role or secret key in frontend code.

The application expects the following tables and fields:

- `profiles`: `id`, `full_name`, `student_id`, `role`
- `scholarship_programs`: `id` and a program name field such as `name`, `program_name`, or `title`
- `academic_submissions`: `scholar_id`, `student_id`, `scholar_name`, `program_id`, `academic_year`, `semester`, `gwa`, `units`, `failed_subjects`, `incomplete_subjects`, `dropped_subjects`, `evidence`, `status`, `compliance_result`, `renewal_decision`, `staff_notes`, `reviewed_by`, `updated_at`, `created_at`
- `audit_logs`: `actor_id`, `submission_id`, `action`, `details`, `created_at`

## Account Roles
- **Scholar:** Can register an account and submit academic records.
- **Staff:** Can review submissions and record compliance decisions. Staff access must be assigned by an authorized administrator in Supabase.

New scholar registration relies on the Supabase Auth trigger to create a matching `profiles` row. If email confirmation is enabled, users must confirm their email before signing in.

## Security Notes
- Keep Row Level Security (RLS) enabled and maintain appropriate policies for each table.
- Do not use a service-role or secret key in browser-side code.
- Do not disable database security policies to work around application errors.
- The evidence field stores a document URL; it does not upload files to Supabase Storage.

## Run and Deploy
This is a static HTML application and does not require a Vite build or a `src` folder.

1. Place `index.html` in the root of the repository.
2. Commit and push the files to GitHub.
3. In the repository, open **Settings → Pages**.
4. Under the build and deployment settings, select **Deploy from a branch**.
5. Select the `main` branch and the `/(root)` folder, then save.
6. After deployment completes, open the published URL and test sign-in, program loading, scholar submission, and staff review.

## Notes
The application is based on the current database schema details. If the actual Supabase table or column names differ, the relevant JavaScript queries may need to be adjusted. Test all database operations with scholar and staff accounts before relying on the system.
