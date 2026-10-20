ScholarTrack — Scholarship Monitoring System
System Overview
ScholarTrack is a web-based Scholarship Monitoring System that allows scholars to submit and monitor their academic records while scholarship staff review submissions, evaluate compliance with scholarship program requirements, and record renewal decisions. The system keeps a history of important actions for accountability.
Flow of the System
1. Account Access
   - A scholar creates an account or signs in using an existing account.
   - The system loads the user's profile and role.
   - The available pages and actions depend on whether the user is a scholar or scholarship staff member.
2. Scholar Dashboard
   - Scholars see their own submission summaries and recent academic records.
   - Staff see submission summaries for the records they are permitted to access.
3. Scholarship Program Selection
   - The system displays available scholarship programs and their academic policy limits.
   - Program policies include maximum GWA, minimum units, and limits for failed, incomplete, and dropped subjects.
4. Academic Record Submission
   - A scholar selects a scholarship program and provides the academic year, semester, GWA, enrolled units, subject counts, and optional evidence URL.
   - The system validates required fields and numeric values.
   - Each scholar should have only one submission for the same academic year and semester. The database uniqueness rule is expected to enforce this restriction.
5. Staff Verification and Compliance Evaluation
   - Scholarship staff open submitted records and review the submission details and evidence reference.
   - The system compares the academic values with the selected program's policy limits and presents a compliance result to support the review.
   - Staff record the verification status, compliance result, notes, and renewal decision.
6. Return for Correction and Resubmission
   - If a record needs correction, staff return it with a reason.
   - The scholar sees the returned status, edits the record, and resubmits it.
   - The resubmitted record returns to the review process.
7. Renewal Decision
   - Staff record a renewal decision as pending, approved, or denied.
   - Notes can document the decision or explain why a record was returned or denied.
8. Decision and Audit History
   - Important actions, such as submission creation, review, correction/resubmission, and program maintenance, are recorded in the audit log when the relevant database permissions allow the operation.
   - Authorized staff can view the recorded history.
9. Sign Out
   - The user signs out to end the authenticated session.
Main User Roles
Scholar
- Register and sign in.
- View scholarship programs and their policy limits.
- Submit academic records.
- View the status and compliance result of their own submissions.
- Correct and resubmit records returned by staff.
Scholarship Staff
- View and search submissions available to staff.
- Verify submitted academic records and evidence references.
- Evaluate compliance with scholarship program policies.
- Return records for correction.
- Record renewal decisions and staff notes.
- Maintain scholarship program information.
- View decision and audit history.
Database Structure
The HTML application connects to these Supabase tables:
- profiles — stores profile information, student ID, and role associated with an authenticated account.
- scholarship_programs — stores program names, descriptions, active status, and academic policy limits.
- academic_submissions — stores scholar identity, program, academic year and semester, GWA, units, subject counts, evidence reference, verification status, compliance result, staff notes, and renewal decision.
- audit_logs — stores logged actions, actor, related submission, details, and creation timestamp.
The database diagram may also include relationships to Supabase authentication users. Those relationships must be configured in the database.
Typical Submission Lifecycle
Sign in → Select program → Submit academic record → Validate input → Staff verifies evidence → Evaluate compliance → Record decision

If correction is required:

Return for correction → Scholar edits and resubmits → Staff reviews again → Record renewal decision
Important Notes
- The application is delivered as a single HTML file with embedded CSS and JavaScript and uses the Supabase JavaScript client.
- The application interface does not replace database security. Supabase Row Level Security (RLS) policies must restrict scholars to their own records and allow staff only the actions permitted for their role.
- Account registration requires the corresponding profiles record to be created, either through a database trigger or another trusted server-side process.
- The database should enforce the unique submission rule for scholar, academic year, and semester.
- Audit history depends on successful audit-log writes and appropriate database permissions.
- The system's policy check supports staff evaluation; final verification and renewal decisions are recorded by staff.
