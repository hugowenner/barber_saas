# BARBER HOUSE — MVP

Sistema de presença digital + agendamento para barbearia. Construído como base
limpa e profissional sobre a qual um SaaS multi-barbearia pode evoluir.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS 4 + shadcn/ui (componentes em `src/components/ui/`)
- Lucide React (ícones)
- Zustand (estado do fluxo de agendamento, com persistência em `localStorage`)
- Prisma 6 + PostgreSQL-ready schema (`prisma/schema.prisma`)
- Fontes: Bebas Neue (display), Inter (corpo), Playfair Display (serif)

## Como executar

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # checagem de qualidade
```

## Estrutura

```
src/
├─ app/
│  ├─ layout.tsx           # metadata global, fontes, SEO
│  ├─ page.tsx             # Home
│  ├─ agendar/
│  │  ├─ layout.tsx        # metadata da rota /agendar
│  │  └─ page.tsx          # Fluxo de agendamento (6 etapas)
│  ├─ globals.css          # Design system (paleta dark premium + utilitários)
│  └─ sitemap.ts
├─ components/
│  ├─ layout/              # Header, Footer, SiteShell
│  ├─ home/                # Hero, Services, Barbers, Gallery, Testimonials, Location, FinalCta
│  ├─ booking/             # BookingStepper, *Selector, BookingSummary, BookingConfirmation
│  └─ ui/                  # shadcn/ui
├─ data/                   # FONTE ÚNICA DA VERDADE — fácil de trocar por db.*
│  ├─ business.ts          # dados da barbearia (endereco, horarios, contato)
│  ├─ services.ts
│  ├─ barbers.ts
│  ├─ testimonials.ts
│  ├─ gallery.ts
│  └─ availability.ts      # SEAM: geração de slots (mock hoje, db amanhã)
├─ lib/
│  ├─ booking-store.ts     # Zustand store persistido
│  ├─ format.ts            # formatadores BRL, data, links WhatsApp/Calendar/Maps
│  └─ utils.ts             # cn()
└─ types/                  # tipos de domínio (espelham models Prisma)
```

## Onde trocar mocks por dados reais

1. **`src/data/availability.ts → getTimeSlots()`** — atualmente gera slots
   determinísticos com base nos horários da barbearia. Para PostgreSQL, faça
   query em `appointments` onde `barbershopId`, `barberId` (se não "any") e
   `startAt` entre o intervalo do dia; marque slots sobrepostos como
   `available: false`.
2. **`src/data/*`** — substitua cada export por `db.<model>.findMany(...)`.
3. **`src/app/agendar/page.tsx → handleConfirm()`** — chame um Server Action
   ou Route Handler `POST /api/appointments` para persistir o agendamento.
   O store já tem todos os campos prontos.

## Pontos a evoluir (fora do escopo do MVP)

- Painel admin em `/admin/*` (autenticação via NextAuth, já disponível no `package.json`)
- Persistência em PostgreSQL (provider no `schema.prisma` é `sqlite` só para o MVP)
- Multi-tenancy real (campo `barbershopId` já existe em todos os models)
- Bloqueio de horários, lista de espera, cancelamentos, recorrencias
- WhatsApp Business Platform oficial (hoje usamos deep link `wa.me`)
- Notificações por e-mail/SMS/WhatsApp
- Relatórios

## Identidade visual

- Paleta: charcoal quente (#0c0a09) + dourado antigo (#c9a227) como destaque
- Tipografia: Bebas Neue para títulos, Playfair Display para itálicos editoriais, Inter para corpo/UI
- Princípios: dark-first, sem gradientes, sem sombras pesadas, animações sutis
- Mobile-first: botões de 48px de altura, áreas de toque adequadas, fluxo de agendamento otimizado
