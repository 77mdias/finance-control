---

# 📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Simple Finance Control App (MVP)

---

## 1. Visão Geral do Produto

### Nome do Produto

**Simple Finance Control** (nome provisório)

### Descrição

Aplicação web fullstack para **controle pessoal de finanças**, permitindo registrar ganhos, gastos, cartões personalizados, assinaturas recorrentes e faturas mensais, com foco em **simplicidade, privacidade e controle visual**.

O produto é inicialmente de **uso pessoal**, mas com arquitetura preparada para **uso por pequenos grupos** no futuro.

---

## 2. Objetivo do MVP

* Centralizar o controle financeiro pessoal
* Eliminar dependência de planilhas e apps externos
* Oferecer visão clara de:

  * Saldo mensal
  * Ganhos vs gastos
  * Assinaturas ativas
  * Faturas por cartão
* Garantir **segurança e privacidade** dos dados

---

## 3. Público-Alvo

### Usuário Primário

* Desenvolvedor solo (criador do app)

### Usuários Secundários (futuro)

* Usuários convidados
* Pessoas que querem controle financeiro simples e offline-first

---

## 4. Problema a Ser Resolvido

Ferramentas financeiras existentes:

* São excessivamente complexas
* Coletam dados sensíveis
* Forçam integrações bancárias

**O app resolve:**

* Controle manual, porém organizado
* Dados sob total controle do usuário
* Interface simples e objetiva

---

## 5. Escopo do MVP

### Incluído

* Autenticação local
* Registro de ganhos e gastos
* Controle de saldo
* Cartões personalizados
* Assinaturas recorrentes
* Faturas mensais
* Persistência em banco PostgreSQL
* Criptografia de dados sensíveis
* UI animada simples

### Fora do Escopo (não-MVP)

* Integração bancária
* Pagamentos
* IA / previsões
* Notificações push
* App mobile nativo
* Monetização

---

## 6. Requisitos Funcionais

---

### 6.1 Autenticação

**Descrição**
Sistema de autenticação simples, local.

**Requisitos**

* Login com senha
* Senha armazenada com hash (bcrypt)
* Sessão via cookie httpOnly
* Apenas um usuário no MVP (arquitetura preparada para multi-user)

---

### 6.2 Dashboard Financeiro

**Funcionalidades**

* Saldo atual
* Total de ganhos do mês
* Total de gastos do mês
* Resultado líquido (positivo/negativo)
* Lista resumida de assinaturas

**Critérios**

* Dados filtrados por mês
* Atualização em tempo real após operações

---

### 6.3 Ganhos (Créditos)

**Campos**

* Valor
* Descrição
* Categoria
* Data
* Recorrente (sim/não)

**Regras**

* Atualiza saldo automaticamente
* Editável e removível
* Histórico mensal acessível

---

### 6.4 Gastos (Débitos)

**Campos**

* Valor
* Descrição
* Categoria
* Data
* Cartão associado (opcional)
* Assinatura associada (opcional)

**Regras**

* Atualiza saldo automaticamente
* Pode compor faturas
* Pode ser gerado automaticamente por assinatura

---

### 6.5 Cartões Personalizados

**Conceito**
Cartões são **entidades lógicas**, não cartões bancários reais.

**Campos**

* Nome personalizado (ex: “Spotify Assinatura”)
* Tipo (Crédito / Assinatura)
* Número do cartão (criptografado)
* Últimos 4 dígitos
* Cor ou gradiente
* Ícone

**Regras**

* Número completo nunca é exibido
* Dados sensíveis criptografados antes de salvar
* Cards exibidos com animação

---

### 6.6 Assinaturas

**Campos**

* Nome
* Valor
* Cartão associado
* Dia de cobrança
* Ativa/Inativa

**Regras**

* Gera automaticamente um gasto mensal
* Pode ser pausada
* Aparece em faturas e dashboard

---

### 6.7 Faturas Mensais

**Funcionalidades**

* Visualização por mês/ano
* Lista de gastos associados
* Total da fatura
* Status (Aberta / Fechada)

---

## 7. Requisitos Não Funcionais

### Segurança

* Criptografia AES para números de cartão
* Hash de senha com bcrypt
* Nenhum dado sensível em LocalStorage

### Performance

* Resposta rápida (<200ms em operações comuns)
* Queries otimizadas com índices

### UX/UI

* Mobile-first
* Dark mode
* Interface limpa
* Animações leves (não intrusivas)

---

## 8. Arquitetura Técnica

---

### 8.1 Stack Tecnológica

**Frontend**

* TanStack Start
* React
* TypeScript
* TailwindCSS
* Framer Motion

**Backend**

* TanStack Start (Server Functions)
* Node.js

**Banco de Dados**

* PostgreSQL
* Prisma ORM

---

### 8.2 Infraestrutura

**Desenvolvimento**

* Postgres local ou Neon
* Prisma Migrate

**Produção**

* Neon / Supabase / Railway
* Vercel ou Fly.io

---

## 9. Modelagem de Dados (Resumo)

### User

* id (UUID)
* passwordHash
* createdAt

### Card

* id
* userId
* name
* encryptedNumber
* lastDigits
* color
* type
* createdAt

### Transaction

* id
* userId
* type (CREDIT/DEBIT)
* value
* description
* category
* date
* cardId (opcional)
* createdAt

### Subscription

* id
* userId
* name
* value
* cardId
* billingDay
* active
* createdAt

### Invoice (opcional no MVP)

* id
* userId
* month
* year
* total
* status

---

## 10. Roadmap de Implementação

### Fase 1 – Foundation

* Setup TanStack Start
* Configuração Postgres + Prisma
* Auth simples

### Fase 2 – Core Financeiro

* Ganhos e gastos
* Dashboard
* Saldo

### Fase 3 – Cartões e Assinaturas

* CRUD de cartões
* Assinaturas recorrentes
* Faturas

### Fase 4 – Hardening

* Criptografia
* UX refinado
* Preparação para deploy

---

## 11. Critérios de Sucesso

* Controle financeiro mensal funcional
* Nenhum dado sensível exposto
* UX rápida e clara
* Código limpo e extensível

---

## 12. Riscos e Mitigações

| Risco                  | Mitigação                    |
| ---------------------- | ---------------------------- |
| Complexidade excessiva | Escopo MVP fechado           |
| Falhas de segurança    | Criptografia + boas práticas |
| Abandono do projeto    | Roadmap incremental          |

---

## 13. Próximos Artefatos Técnicos (Recomendado)

1️⃣ **Schema Prisma completo**
2️⃣ **Estrutura de pastas TanStack Start**
3️⃣ **Fluxo de criptografia (implementação real)**
4️⃣ **Design do Card animado**
5️⃣ **Checklist de produção**

---
