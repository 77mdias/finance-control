# Task Completion Checklist
- Run npm run check (format:check + lint) and npm test when changes affect code.
- If Prisma schema changes: run npm run db:generate and db:push (or db:migrate for migration-based changes).
- Update docs/development/TASKS entries when work is completed; archive tasks with npm run archive-task if needed.
- Add/adjust tests under tests/unit or tests/integration to cover behavior changes.
