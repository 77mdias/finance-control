# Development

Este diretório concentra documentação voltada para desenvolvimento: processos, convenções e templates.

## Objetivo

- Padronizar como escrevemos tarefas e fases
- Facilitar planejamento incremental (MVP → fases)
- Manter histórico e rastreabilidade sem “bagunçar” o repositório

## Estrutura

- `docs/development/CHANGELOG.md`: mudanças na documentação/processo de development
- `docs/development/TASKS/`: tarefas ativas e templates
- `docs/references/`: documentos arquivados/“somente leitura” (ex.: fases concluídas)

## Convenções (alinhadas ao histórico da Fase 1)

O documento arquivado [docs/references/PHASE-1.md](../references/PHASE-1.md) é a referência de formato (ID, prioridade, estimativa, dependências, checklist). Para trabalho atual, crie novos arquivos em `docs/development/TASKS/` usando os templates.

### Campos recomendados por task

- **ID**: prefixo por área (ex.: `BKD-`, `FE-`, `DEVOPS-`, `TEST-`) e número sequencial
- **Título**: frase curta, acionável
- **Checklist**: critérios de aceite verificáveis
- **Prioridade**: 🔴 Crítica / 🟡 Alta / 🟢 Média
- **Estimativa**: tempo aproximado
- **Dependências**: IDs de tasks que precisam vir antes
- **Arquivos/Rotas** (opcional): onde a mudança deve acontecer

## Como usar

1. Crie/atualize a fase ativa em `docs/development/TASKS/` (ou um arquivo de sprint)
2. Para novas tasks, copie o template em `docs/development/TASKS/TEMPLATE.task.md`
3. Para uma fase inteira (lista de tasks), copie `docs/development/TASKS/TEMPLATE.phase.md`

## Regras rápidas

- Evite editar documentos arquivados em `docs/references/`.
- Prefira tasks pequenas (≤ 1 dia), com checklist claro.
- Ao concluir, marque `[x]` e registre decisão relevante (1–3 bullets) dentro da própria task.

## CI/CD rápido

- Workflow GitHub Actions em `.github/workflows/ci.yml` roda `npm ci`, `npm run lint`, `npm test` e `npm run build` em Node 20.
- Variáveis mínimas já setadas para build/test (`VITE_DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`); ajuste se precisar de integrações reais (Neon, Better Auth).
