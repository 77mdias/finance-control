# Style and Conventions
- Formatting: Prettier with no semicolons, single quotes, trailing commas (all), print width 100, endOfLine lf.
- Linting: ESLint with @tanstack/eslint-config and eslint-config-prettier (flat config).
- TypeScript: strict settings noted in project docs (noUnusedLocals/Parameters, etc.).
- Imports: use @/ alias for src/ (configured in tsconfig + vite-tsconfig-paths).
- Routing: file-based; route filenames reflect URL intent; __root.tsx is the shared layout.
- Tests: name files *.test.ts or *.test.tsx.
