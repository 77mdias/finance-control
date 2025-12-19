import { createFileRoute } from '@tanstack/react-router'
import { ensureDocsAccess } from '@/lib/openapi'

function buildHtml(specUrl: string) {
  const safeSpecUrl = JSON.stringify(specUrl)

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Finance Control — API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css" />
  <style>
    body { margin: 0; padding: 0; background: #0f172a; color: #e2e8f0; }
    .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js" crossorigin="anonymous"></script>
  <script>
    const specUrl = ${safeSpecUrl};
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: specUrl,
        dom_id: '#swagger-ui',
        docExpansion: 'list',
        layout: 'BaseLayout',
        presets: [SwaggerUIBundle.presets.apis],
      });
    };
  </script>
</body>
</html>`
}

export const Route = createFileRoute('/docs')({
  loader: async ({ request }) => {
    const config = await ensureDocsAccess(request)
    const url = new URL(request.url)
    const specUrl = new URL('/docs/openapi.json', url.origin).toString()

    return new Response(buildHtml(specUrl), {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-Docs-Mode': config.mode,
      },
    })
  },
})
