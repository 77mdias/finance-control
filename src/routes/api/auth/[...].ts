// Catch-all handler for authentication endpoints.
// This file delegates requests to the Better Auth handler.
// Adjust exports based on the server runtime (Node, Cloudflare, Next.js, etc.).
import { auth } from '../../lib/auth'
// `toNodeHandler` is a placeholder helper name; adapt to the real utility exported
// by the Better Auth package for your runtime.
import { toNodeHandler } from 'better-auth/node'

const handler = toNodeHandler(auth)

export default handler
