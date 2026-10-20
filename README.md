# ScholarTrack — Student Scholarship Monitoring and Academic Compliance System

## Run in Visual Studio Code
1. Extract this ZIP.
2. Open the extracted `student-scholarship-monitoring-system` folder in VS Code.
3. Choose **Terminal → New Terminal**.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open the local URL shown in the terminal, usually `http://localhost:5173`.

## Included
- Responsive dashboard, sidebar, summary cards
- Submission table, search and filters
- Academic record submission form with basic validation and duplicate check
- Staff verification, return-for-correction, compliance evaluation, renewal decisions
- Merit Scholar and Community Scholar policy views
- Audit-history screen and browser persistence
- Supabase schema and starter RLS policies in `supabase/schema.sql`

## Important
This is a runnable starter based on the scholarship requirements discussed, not an exact copy of your private Lovable project. I cannot inspect the project design from its URL alone; send screenshots or export its source code if you need a closer match.

The UI currently uses browser `localStorage` demo data. The Supabase schema is included but the React UI is not yet connected to Supabase authentication or database CRUD. The role switcher is a demo only, not secure access control. Do not use real student records until authentication, RLS, and workflows are connected and tested.

## Optional Supabase setup
1. Copy `.env.example` to `.env`.
2. Add your Supabase project URL and public anon/publishable key.
3. Review `supabase/schema.sql`, then run it in Supabase SQL Editor.
4. Create Auth users and matching profile/assignment records through an authorized setup process.
Never put a service-role key in frontend code or commit secrets to GitHub.

## Push to GitHub
Create a repository named `student-scholarship-monitoring-system`, then use the VS Code terminal:
```bash
git init
git add .
git commit -m "Initial ScholarTrack application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/student-scholarship-monitoring-system.git
git push -u origin main
```
Replace `YOUR_USERNAME` with your GitHub username. This ZIP does not automatically create or connect a GitHub repository.
