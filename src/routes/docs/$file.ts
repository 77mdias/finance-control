import { createFileRoute } from '@tanstack/react-router'
import { buildOpenApiDocument, ensureDocsAccess } from '@/lib/openapi'

export const Route = createFileRoute('/docs/$file')({
  loader: async ({ request, params }) => {
    if (params.file !== 'openapi.json') {
      return new Response('Not Found', { status: 404 })
    }

    const config = await ensureDocsAccess(request)
    const { origin } = new URL(request.url)
    const document = buildOpenApiDocument(origin)

    return new Response(JSON.stringify(document, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
        'X-Docs-Mode': config.mode,
      },
    })
  },
})
