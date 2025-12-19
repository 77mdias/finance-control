import { config } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

// Carrega variáveis de ambiente do .env para uso direto com npx prisma
config()

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Keep datasource configuration here; Prisma 7 no longer reads it from the schema file.
    url: env('VITE_DATABASE_URL'),
  },
})
