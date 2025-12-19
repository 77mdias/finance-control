# Alinhamento de Tema para a Página de Autenticação

Objetivo: mapear a paleta/estilo da “Página de Autenticação Financeira” para o design system do app TanStack Start, garantindo consistência e sem quebrar o restante do tema global.

## 1) Tema atual do app (src/styles.css)

- Variáveis base (claro/escuro) com primário em oklch (~slate/indigo neutro), radius 10px (0.625rem), sidebar tokens.
- Font family default: system stack.

## 2) Paleta e tokens da tela de autenticação (origem)

- Primário/gradiente: Indigo 500 → Violet 600 (`#6366f1` → `#8b5cf6`/`#a855f7`), brand badge usa essa faixa.
- Fundo dark: preto absoluto com camadas blur/noise + imagem de fundo; texto branco; inputs em `white/5`.
- Fundo light: `slate-50`/`#f8fafc`; texto `slate-900`; inputs `white` com borda `slate-200`.
- Muted: `slate-400/500/600`; selection: `indigo-500/30`.
- Botões: dark → `bg-white text-black`; light → `bg-slate-900 text-white`.
- Tipografia: headings com Poppins, corpo Inter; números opcionais Space Mono (pouco usado).
- Visual CardStream: partículas/scan em paleta azul/roxo; ASCII bg/text cores no tema light/dark (já declaradas no componente).

## 3) Proposta de mapeamento (overrides locais de rota)

Não alterar o tema global; criar overrides específicos para a rota `/auth` (e alias `/login`) via classe contêiner. Exemplo de tokens dedicados:

- `--auth-bg-dark: #020617` (slate-950) / `--auth-bg-light: #f8fafc`
- `--auth-surface-dark: rgba(0,0,0,0.18)` / `--auth-surface-light: rgba(255,255,255,0.6)`
- `--auth-primary: #6366f1` / `--auth-primary-strong: #8b5cf6`
- `--auth-text: #e2e8f0` (dark) / `#0f172a` (light)
- `--auth-muted: #94a3b8` (dark) / `#475569` (light)
- `--auth-border: rgba(255,255,255,0.1)` (dark) / `#e2e8f0` (light)
- `--auth-selection: rgba(99,102,241,0.35)`
- `--auth-radius: 24px`
- `--auth-bg-image: url(/media/auth-bg.jpg)` (local já baixada)

Gradientes sugeridos:

- Brand/icon: `linear-gradient(135deg, #6366f1, #8b5cf6)`
- Headline span: `linear-gradient(90deg, #6366f1, #a855f7)`
- Background overlay: dark `linear-gradient(180deg, rgba(0,0,0,0.8), #000)`; light `linear-gradient(180deg, rgba(248,250,252,0.8), #f8fafc)`

## 4) Como aplicar (rota /auth)

1. Criar `src/routes/auth/auth-theme.css` com os tokens acima em uma classe `.auth-shell` (e variante `.auth-shell.light`/`.dark`), mais utilitários (selection color, backdrop, etc.).
2. No componente da rota `/auth`, envolver a página com `<div className={cn('auth-shell', isDark ? 'dark' : 'light')}>`.
3. Importar `auth-theme.css` no arquivo da rota (ou no `head` via `links`).
4. Atualizar componentes para usar as variáveis quando fizer sentido (ex.: `style={{ backgroundImage: 'var(--auth-bg-image)' }}` ou classes utilitárias custom com `var(--auth-primary)`).

## 5) Tipografia

- Manter Inter/Poppins via Google Fonts CDN (já definido no bundle original). Se precisar self-host, baixar e adicionar em `public/fonts` e criar `@font-face` em `auth-theme.css`.

## 6) Compatibilidade com tema global

- Não sobrescrever `:root`/`.dark` globais; limitar-se à classe `.auth-shell` para não afetar outras rotas.
- Se quiser reusar tokens globais: mapear `--primary` atual para botões/links secundários e reservar `--auth-primary` para hero/brand.

## 7) Fallback SSR/No-JS

- `CardStream` deve renderizar um estado estático usando `--auth-bg-image` + gradiente + blur/noise; efeitos client-only quando `isClient && !prefersReducedMotion`.

## 8) Itens a validar com design system

- Confirmar se o gradiente Indigo/Violet está OK com a identidade do produto.
- Confirmar raio (24px) versus radius global (10px). Podemos parametrizar com `--auth-radius` separado.
- Confirmar contraste em light mode (inputs e texto `slate-500`).
