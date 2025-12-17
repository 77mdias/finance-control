import { neon } from '@neondatabase/serverless'

let client: ReturnType<typeof neon>

export async function getClient() {
  const url = process.env.VITE_DATABASE_URL
  if (url == null || url === '') return undefined

  // `client` is lazily initialized; disable the unnecessary-condition rule here
  // because the type system doesn't model this runtime laziness precisely.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!client) {
    client = await neon(url)
  }

  return client
}
