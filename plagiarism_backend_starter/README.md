# Plagiarism Backend Starter (TypeScript + Express + Prisma)

This starter project is the first step converting your PHP plagiarism project into a modern TypeScript backend.
It includes:
- Express + TypeScript server
- Prisma schema (PostgreSQL)
- Simple endpoints for students & submissions
- A very basic plagiarism check using Jaccard token similarity

## Quick start

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to your Postgres connection.
2. Install dependencies:
   ```
   npm install
   ```
3. Generate Prisma client and run migrations (you can also introspect your existing DB):
   ```
   npx prisma generate
   npx prisma migrate dev --name init
   ```
   *If you already have the MySQL .sql file from your PHP project, consider importing it into Postgres or use `prisma db pull` after creating an empty Postgres DB and then adjust schema.*

4. Run dev server:
   ```
   npm run dev
   ```

## Endpoints

- `GET /health` - health check
- `GET /api/students` - list students
- `POST /api/students` - create student
- `POST /api/submissions/upload` - upload text content or a .txt file with `studentId`
- `POST /api/submissions/compare` - POST `{ aId, bId }` to compare two submissions

## Next steps (for learning)
- Replace the Jaccard similarity with shingling + winnowing fingerprints
- Add authentication for lecturers/admins
- Support `.docx` and PDF extraction
- Add React frontend with shadcn/ui + React Query

If you're ready, I'll walk you through each file and help you run and test the backend step-by-step.
