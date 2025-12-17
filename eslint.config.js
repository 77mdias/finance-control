//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
// Use the flat entrypoint for eslint-config-prettier
import prettierConfig from 'eslint-config-prettier'

export default [
  // base configs from TanStack (already in flat format)
  ...tanstackConfig,
  // include Prettier config object to disable formatting rules that conflict with Prettier
  prettierConfig,
  // Project-specific config: use `ignores` (flat config replacement for .eslintignore)
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.vite/**',
      '.tanstack/**',
      'coverage/**',
      'prisma/client/**',
      'public/**',
      '**/*.min.js',
      // Ignore project config files that are not part of the TypeScript project
      'eslint.config.js',
      'prettier.config.js',
      'scripts/**',
    ],
    rules: {},
  },
]
