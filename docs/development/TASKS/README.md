# TASKS (Development)

Este diretório guarda **tarefas ativas** e **templates** de trabalho.

## Referência de formato

A [docs/references/PHASE-1.md](../../references/PHASE-1.md) é um documento **arquivado** e serve como referência histórica do padrão de escrita (IDs, prioridades, estimativas, dependências e checklist detalhado). Não edite arquivos em `docs/references/`.

## Organização sugerida

- Para fases/sprints ativas:
  - `PHASE-<N>-<TEMA>.md` (ex.: `PHASE-2-FORUM.md`)
  - ou `SPRINT-YYYY-MM-DD.md` se preferir ciclos curtos
- Para templates:
  - `TEMPLATE.task.md`
  - `TEMPLATE.phase.md`

## Padrão de task (resumo)

Uma task deve:

- Ter um **ID** único (ex.: `BKD-012`)
- Declarar **Prioridade**, **Estimativa** e **Dependências**
- Ter um checklist de **critérios verificáveis**
- Apontar arquivos/rotas afetadas quando fizer sentido

## Status e checklist

- Use `- [ ]` para pendente e `- [x]` para concluída.
- Se precisar sinalizar “parcial”, prefira:
  - quebrar a task em subtasks menores, ou
  - manter a task principal e adicionar subtasks com `[ ]`.

## Templates

- Nova task: copie `TEMPLATE.task.md`
- Nova fase: copie `TEMPLATE.phase.md`
