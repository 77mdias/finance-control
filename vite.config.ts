import path from 'node:path'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import neon from './neon-vite-plugin.ts'

export default defineConfig(({ ssrBuild }) => {
  const isServer = ssrBuild === true

  return {
    resolve: {
      alias: isServer
        ? {}
        : {
            '@/db': path.resolve(__dirname, 'src/db.browser.ts'),
          },
    },
    plugins: [
      devtools(),
      nitro(),
      neon,
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],
  }
})
