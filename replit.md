# HealthAdvisor Workspace

## Overview

pnpm workspace monorepo using TypeScript. Health Diagnosis Advisory System for Nigerian and underserved communities.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **Auth**: express-session + bcryptjs (SESSION_SECRET env var required)
- **AI**: OpenAI GPT-5.2 via Replit AI Integrations (`@workspace/integrations-openai-ai-server`)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Architecture

### Diagnosis Flow
1. User selects symptoms in the frontend (`/check` page)
2. POST `/api/diagnosis/analyze` is called with symptoms + patient profile
3. **Rule-based engine** (`diagnosticEngine.ts`) runs first — 12 Nigerian conditions, fast, no API cost
4. **GPT-5.2 enhancement** takes the rule results + full patient context and generates richer, more contextual diagnosis
5. AI falls back to rule-based result if OpenAI call fails
6. Session saved to PostgreSQL if user is logged in

### AI Prompt Design
- System prompt is focused on Nigerian/West African health context
- Instructs the model to: prioritise endemic conditions, use plain language, give actionable self-care, consider seasonal patterns and limited healthcare access
- Returns structured JSON (same schema as rule-based engine)
- Safety rule: if rule-based flags `emergency`, AI cannot downgrade it

### Environment Variables
- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — express-session secret
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — auto-set by Replit AI Integrations
- `AI_INTEGRATIONS_OPENAI_API_KEY` — auto-set by Replit AI Integrations

## Key Files

- `artifacts/health-advisor/src/` — React frontend
- `artifacts/api-server/src/routes/diagnosis.ts` — AI-enhanced diagnosis endpoint
- `artifacts/api-server/src/lib/diagnosticEngine.ts` — Rule-based engine (12 conditions)
- `lib/db/src/schema/` — Drizzle ORM schemas
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for codegen)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
