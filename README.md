# BARBER HOUSE — MVP

Sistema de presença digital + agendamento para barbearia, com painel
administrativo completo. Construído como base limpa e profissional sobre a
qual um SaaS multi-barbearia pode evoluir.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS 4 + shadcn/ui (componentes em `src/components/ui/`)
- Lucide React (ícones)
- Zustand (estado do fluxo de agendamento e da sessão admin, com persistência em `localStorage`)
- Prisma 6 + PostgreSQL-ready schema (`prisma/schema.prisma`)
- Fontes: Bebas Neue (display), Inter (corpo), Playfair Display (serif)

## Como executar

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # checagem de qualidade
```

## Áreas da aplicação

### Site público

- `/` — Home com Hero, Serviços, Barbeiros, Ambiente, Avaliações, Localização, CTA
- `/agendar` — Fluxo de agendamento em 6 etapas (serviço → barbeiro → data → horário → dados → confirmação)

### Painel administrativo

- `/admin/login` — Tela de login (mock: qualquer e-mail/senha funciona)
- `/admin/dashboard` — KPIs do dia, próximos agendamentos, resumo por barbeiro
- `/admin/appointments` — Lista com filtros (data, barbeiro, status) — tabela no desktop, cards no mobile
- `/admin/clients` — Lista de clientes com busca e filtro de status
- `/admin/clients/[id]` — Detalhe do cliente com contato, stats e histórico de atendimentos
- `/admin/barbers` — Grid de barbeiros com dialog de adicionar/editar
- `/admin/services` — Grid de serviços com dialog de adicionar/editar
- `/admin/settings` — Configurações em tabs: Barbearia, Horários, Agendamento, WhatsApp

Todas as telas admin são mobile-first com sidebar fixa no desktop e drawer no mobile.

## Estrutura

```
src/
├─ app/
│  ├─ layout.tsx              # metadata global, fontes, SEO
│  ├─ page.tsx                # Home (pública)
│  ├─ agendar/                # Fluxo de agendamento (público)
│  ├─ admin/
│  │  ├─ layout.tsx           # metadata admin (noindex)
│  │  ├─ page.tsx             # redirect → /admin/dashboard
│  │  ├─ login/page.tsx       # tela de login (standalone, sem shell)
│  │  └─ (panel)/             # route group com auth guard + AdminShell
│  │     ├─ layout.tsx        # auth guard (mock) + AdminShell
│  │     ├─ dashboard/
│  │     ├─ appointments/
│  │     ├─ clients/
│  │     │  └─ [id]/
│  │     ├─ barbers/
│  │     ├─ services/
│  │     └─ settings/
│  ├─ globals.css             # Design system (paleta dark premium + utilitários)
│  └─ sitemap.ts
├─ components/
│  ├─ layout/                 # Header, Footer, SiteShell (site público)
│  ├─ home/                   # Hero, Services, Barbers, Gallery, etc.
│  ├─ booking/                # BookingStepper, *Selector, BookingSummary, etc.
│  ├─ admin/                  # AdminShell, AdminSidebar, AdminHeader, DashboardStats, StatusBadge, PageHeader, EmptyState
│  └─ ui/                     # shadcn/ui
├─ data/                      # FONTE ÚNICA DA VERDADE — fácil de trocar por db.*
│  ├─ business.ts             # dados da barbearia (endereço, horários, contato)
│  ├─ services.ts
│  ├─ barbers.ts
│  ├─ testimonials.ts
│  ├─ gallery.ts
│  ├─ availability.ts         # SEAM: geração de slots (mock hoje, db amanhã)
│  └─ admin/
│     ├─ users.ts             # mock admin user
│     ├─ clients.ts           # mock clients
│     ├─ appointments.ts      # mock appointments (gerados relativos a "hoje")
│     ├─ stats.ts             # dashboard stats derivadas dos appointments
│     └─ settings.ts          # valores iniciais do formulário de settings
├─ lib/
│  ├─ booking-store.ts        # Zustand store do fluxo de agendamento
│  ├─ admin-auth-store.ts     # Zustand store da sessão admin (mock)
│  ├─ format.ts               # formatadores BRL, data, links WhatsApp/Calendar/Maps
│  └─ utils.ts                # cn()
├─ hooks/
│  ├─ use-is-client.ts        # SSR-safe client detection
│  ├─ use-mobile.ts
│  └─ use-toast.ts
└─ types/
   ├─ index.ts                # tipos do domínio público (Service, Barber, BookingState, etc.)
   └─ admin.ts                # tipos do domínio admin (AdminUser, Client, Appointment, AdminSettings)
```

## Arquitetura de dados

```
Barbershop (tenant root)
   │
   ├── Users (AdminUser)      # acesso ao painel (ADMIN | BARBER)
   ├── Barbers                # profissionais que atendem
   ├── Services               # catálogo de serviços
   ├── Clients                # clientes finais (NÃO confundir com Users)
   ├── Appointments           # agendamentos (liga Client + Barber + Service)
   ├── BusinessHours          # horários de funcionamento
   └── TimeBlocks             # bloqueios (almoço, folga, férias)
```

O schema Prisma já tem todos esses models com `barbershopId` em cada um,
pronto para multi-tenancy real.

## Onde trocar mocks por dados reais

1. **`src/data/availability.ts → getTimeSlots()`** — query em `appointments`
   onde `barbershopId`, `barberId` (se não "any") e `startAt` entre o
   intervalo do dia; marque slots sobrepostos como `available: false`.
2. **`src/data/admin/*`** — substitua cada export por `db.<model>.findMany(...)`.
3. **`src/app/agendar/page.tsx → handleConfirm()`** — chame `POST /api/appointments`
   para persistir o agendamento. O store já tem todos os campos prontos.
4. **`src/lib/admin-auth-store.ts`** — substitua por `useSession()` do NextAuth.
5. **`src/app/admin/(panel)/layout.tsx`** — troque o guard client-side por
   middleware NextAuth server-side.

## Pontos a evoluir (fora do escopo atual)

- PostgreSQL real (mudar `provider` no `schema.prisma` de `sqlite` para `postgresql`)
- NextAuth com credentials provider (autenticação real)
- Multi-tenancy real (middleware para extrair `barbershopId` do subdomínio/path)
- Persistência real de agendamentos via `POST /api/appointments`
- Bloqueio de horários, lista de espera, cancelamentos, recorrências
- WhatsApp Business Platform oficial (hoje usamos deep link `wa.me`)
- Notificações por e-mail/SMS/WhatsApp
- Relatórios e gráficos avançados no dashboard
- Painel do barbeiro (role BARBER) com sua agenda e seus clientes
- Reativação automática de clientes inativos

## Identidade visual

- Paleta: charcoal quente (#0c0a09) + dourado antigo (#c9a227) como destaque
- Tipografia: Bebas Neue para títulos, Playfair Display para itálicos editoriais, Inter para corpo/UI
- Princípios: dark-first, sem gradientes, sem sombras pesadas, animações sutis
- Mobile-first: botões de 44-48px de altura, áreas de toque adequadas
- Admin prioriza densidade de informação e usabilidade sobre estética editorial
