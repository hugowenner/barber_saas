# BARBER HOUSE — Documentação Técnica do Projeto

> **Fotografia técnica do estado atual do código.**
> Documento de handoff para o próximo desenvolvedor/IA continuar o projeto.
>
> Última atualização: 06/09/2026
> Versão do projeto: 0.2.1 (package.json)
> Lint status: ✅ 0 erros, 0 warnings (`bun run lint`)

---

## Sumário

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Stack Completa](#2-stack-completa)
3. [Estrutura Completa de Diretórios](#3-estrutura-completa-de-diretórios)
4. [Arquitetura da Aplicação](#4-arquitetura-da-aplicação)
5. [Rotas](#5-rotas)
6. [Home Page](#6-home-page)
7. [Sistema de Agendamento](#7-sistema-de-agendamento)
8. [Estado / Zustand](#8-estado--zustand)
9. [Dados Mockados](#9-dados-mockados)
10. [Modelo de Dados](#10-modelo-de-dados)
11. [Multi-Tenancy](#11-multi-tenancy)
12. [Admin](#12-admin)
13. [Clientes](#13-clientes)
14. [Barbeiros](#14-barbeiros)
15. [Serviços](#15-serviços)
16. [Autenticação](#16-autenticação)
17. [Roles e Permissões](#17-roles-e-permissões)
18. [Design System](#18-design-system)
19. [Responsividade](#19-responsividade)
20. [Acessibilidade](#20-acessibilidade)
21. [SEO](#21-seo)
22. [WhatsApp](#22-whatsapp)
23. [Calendário / Maps](#23-calendário--maps)
24. [Validações e Erros](#24-validações-e-erros)
25. [Dependências](#25-dependências)
26. [Configuração / ENV](#26-configuração--env)
27. [Comandos](#27-comandos)
28. [Deploy](#28-deploy)
29. [Segurança](#29-segurança)
30. [O Que Já Está Pronto](#30-o-que-já-está-pronto)
31. [O Que Está Parcial](#31-o-que-está-parcial)
32. [Roadmap Recomendado](#32-roadmap-recomendado)
33. [Continuing Development](#33-continuing-development)
34. [Decisões Arquiteturais](#34-decisões-arquiteturais)
35. [Mapa de Dependências](#35-mapa-de-dependências)
36. [Checklist Final](#36-checklist-final)

---

## 1. Visão Geral do Projeto

### Nome

**BARBER HOUSE** — Sistema de presença digital + agendamento para barbearia, com painel administrativo.

### Objetivo

Construir uma base de código profissional, limpa e extensível que sirva simultaneamente como:

1. **Site público** de uma barbearia (landing + fluxo de agendamento).
2. **Painel administrativo** para o dono/funcionário gerenciar agbearia, clientes, barbeiros, serviços e configurações.
3. **Fundações arquiteturais** para que o produto evolua, em etapas futuras, para um SaaS multi-barbearia.

### Problema que resolve

Barbearias precisam de presença digital profissional e de um canal de agendamento que não dependa exclusivamente de WhatsApp/Instagram (que são fricção alta para o cliente e gestão caótica para o barbeiro). O produto oferece:

- **Para o cliente final**: uma forma rápida de descobrir a barbearia e agendar em poucos toques, sem cadastro.
- **Para o dono da barbearia**: visibilidade da agenda, base de clientes, catálogo de serviços e configurações centralizadas.

### Público-alvo

- **Cliente final**: homem adulto, urbano, que busca barbearia premium e usa smartphone para agendar.
- **Dono / gestor da barbearia**: usuário do painel admin, precisa de informação densa e navegação rápida.

### Escopo atual (MVP entregue)

| Camada | Estado |
|---|---|
| Home pública com 7 seções | ✅ Real |
| Fluxo de agendamento `/agendar` (6 etapas) | ✅ Real, dados mock |
| Painel admin `/admin/*` (8 telas) | ✅ Real, dados mock |
| Schema Prisma multi-tenant | ✅ Preparado, **não conectado** |
| Autenticação | 🟡 Mock (qualquer login funciona) |
| Persistência de agendamentos | 🔴 Não implementada |
| Multi-tenancy | 🟡 Preparado no schema, **não implementado** em runtime |
| WhatsApp | 🟡 Deep link `wa.me` apenas |
| Próxima etapa (PostgreSQL + NextAuth) | 🔴 Não iniciada |

### O que já está funcionando (REAL)

- Site público navegável de ponta a ponta.
- Fluxo completo de agendamento: Serviço → Barbeiro → Data → Horário → Dados → Confirmação → Tela de sucesso com links de WhatsApp e Google Calendar.
- Painel admin com login (mock), dashboard com KPIs, listagem de agendamentos com filtros, listagem + detalhe de clientes, CRUD visual de barbeiros e serviços, tela de configurações com 4 tabs.
- Responsividade mobile-first testada em 375px / 768px / 1440px.
- Acessibilidade básica (semântica HTML, ARIA, focus rings, reduced motion).
- SEO básico (metadata, Open Graph, sitemap, robots.txt).

### O que é mock (MOCK)

- **Toda a camada de dados** em `src/data/*` é estática em memória. Não há banco.
- **Auth admin** (`src/lib/admin-auth-store.ts`): qualquer e-mail + senha loga como `MOCK_ADMIN_USER`.
- **Disponibilidade de horários** (`src/data/availability.ts`): slots gerados deterministicamente, ~30% marcados como ocupados via hash.
- **Clientes** (`src/data/admin/clients.ts`): 10 clientes fictícios fixos.
- **Agendamentos** (`src/data/admin/appointments.ts`): ~25 agendamentos gerados relativos a "hoje".
- **Estatísticas do dashboard** (`src/data/admin/stats.ts`): derivadas dos mock appointments.
- **Settings** (`src/data/admin/settings.ts`): valores iniciais derivados do `SITE_CONFIG` estático; salvar apenas mostra toast.
- **Barbeiros/Serviços no admin**: adicionar/editar atualiza estado local React, não persiste.

### O que está fora do escopo atual (NÃO INICIADO)

- PostgreSQL real em runtime (schema existe, provider é SQLite, **Prisma Client não é chamado em nenhuma rota**).
- NextAuth real.
- Sessões server-side.
- Autorização (RBAC) efetiva.
- Multi-tenancy em runtime (não há middleware que extraia `barbershopId`).
- API de agendamentos (`POST /api/appointments`).
- WhatsApp Business Platform.
- Notificações (e-mail, SMS, WhatsApp automático).
- Cancelamentos, lista de espera, recorrências.
- Relatórios / gráficos avançados.
- Painel do barbeiro (role BARBER).
- Upload de imagens (URLs manuais).

### Evolução planejada

```
Estado atual do MVP (este documento)
        │
        │  Fase 1: PostgreSQL real
        │  Fase 2: API de agendamentos
        │  Fase 3: NextAuth
        │  Fase 4: RBAC
        │  Fase 5: Admin funcional com persistência
        │  Fase 6: Disponibilidade real
        │  Fase 7: WhatsApp Business
        │  Fase 8: Multi-tenancy runtime
        ▼
Próxima etapa (SaaS single-tenant funcional)
        │
        │  Fase 9: Onboarding de barbearias
        │  Fase 10: Billing
        │  Fase 11: Subdomínio / domínio próprio por tenant
        ▼
Produto/SaaS futuro (multi-barbearia)
```

---

## 2. Stack Completa

Versões exatas em `package.json`. Lista abaixo apenas das tecnologias realmente presentes no código.

### Essenciais (não substituíveis sem refazer partes do produto)

| Tecnologia | Versão | Para que é utilizada | Onde |
|---|---|---|---|
| **Next.js** | `^16.1.1` | Framework React fullstack, App Router, SSR/SSG, file-based routing, Image optimization, metadata API | Toda a aplicação |
| **React** | `^19.0.0` | Biblioteca UI | Todos os componentes |
| **TypeScript** | `^5` | Tipagem estática, strict mode | Todo o código-fonte |
| **Tailwind CSS** | `^4` | Styling utility-first | `src/app/globals.css` + todos os componentes |
| **shadcn/ui** (Nova York) | — | Componentes base (Button, Input, Dialog, Select, Tabs, Sheet, etc.) | `src/components/ui/*` |
| **Lucide React** | `^0.525.0` | Ícones | Header, Sidebar, Botões, Badges, etc. |
| **Zustand** | `^5.0.6` | Estado global do fluxo de agendamento e da sessão admin | `src/lib/booking-store.ts`, `src/lib/admin-auth-store.ts` |
| **Prisma** | `^6.11.1` | ORM — **schema pronto mas NÃO conectado em runtime** | `prisma/schema.prisma`, `src/lib/db.ts` (não utilizado) |

### Essenciais para shadcn/ui (transitivas)

Estas bibliotecas são pré-requisito dos componentes shadcn/ui em uso:

- `@radix-ui/react-*` (30+ pacotes) — primitives de acessibilidade.
- `class-variance-authority` — variantes tipadas de componentes.
- `clsx` + `tailwind-merge` — composição de classes (`cn()` em `src/lib/utils.ts`).
- `cmdk` — Command palette (usado indiretamente por `Select`/`Combobox`).
- `vaul` — Drawer (usado por `Sheet` no menu mobile admin).
- `embla-carousel-react` — Carousel (componente disponível, **não utilizado** no produto).
- `react-day-picker` — Calendar (componente disponível, **não utilizado**).
- `react-resizable-panels` — Resizable (componente disponível, **não utilizado**).

### Instaladas mas NÃO utilizadas no código do produto

> Identificadas por inspeção do `package.json` cruzado com `grep` nos fontes.

| Pacote | Status | Observação |
|---|---|---|
| `next-auth` (`^4.24.11`) | Instalado, **não importado em nenhum arquivo** | Reservado para a Fase 3. |
| `next-themes` | Instalado, **não importado** | Produto é dark-only por design. |
| `next-intl` | Instalado, **não importado** | Produto é pt-BR only. |
| `@tanstack/react-query` | Instalado, **não utilizado** | Reservado para quando houver API real. |
| `@tanstack/react-table` | Instalado, **não utilizado** | Tabelas admin são feitas com `<table>` puro. |
| `react-hook-form` + `@hookform/resolvers` + `zod` | Instalados, **não utilizados** | Formulários usam `useState` puro. |
| `recharts` | Instalado, **não utilizado** | Dashboard não tem gráficos. |
| `framer-motion` | Instalado, **não utilizado** | Animações feitas com CSS puro. |
| `date-fns` | Instalado, **não utilizado** | Datas formatadas com `Intl.DateTimeFormat`. |
| `@dnd-kit/*` | Instalado, **não utilizado** | Sem drag-and-drop no produto. |
| `@mdxeditor/editor` | Instalado, **não utilizado** | |
| `react-markdown` + `react-syntax-highlighter` | Instalados, **não utilizados** | |
| `@reactuses/core` | Instalado, **não utilizado** | |
| `input-otp` | Instalado, **não utilizado** | |
| `uuid` | Instalado, **não utilizado** | IDs gerados via `cuid()` (Prisma) ou `Date.now()`. |
| `sonner` | Instalado, **não utilizado** (toast usa `@radix-ui/react-toast` via `src/hooks/use-toast.ts`) | |
| `z-ai-web-dev-sdk` | Instalado, **não utilizado no produto** | SDK específico do sandbox, **remover antes de baixar o projeto**. |
| `sharp` | Instalado, **não utilizado diretamente** | Otimização de imagens feita pelo Next.js internamente. |

### Dev dependencies relevantes

| Pacote | Para que |
|---|---|
| `eslint` + `eslint-config-next` | Lint |
| `@tailwindcss/postcss` | PostCSS plugin do Tailwind 4 |
| `tw-animate-css` | Animações utilitárias para Tailwind 4 (substitui `tailwindcss-animate`) |
| `tailwindcss-animate` | Plugin legado (ainda no `tailwind.config.ts`) |
| `bun-types` | Tipos para Bun (runtime do sandbox) |

### Notas importantes

- **`z-ai-web-dev-sdk`**: dependência específica do sandbox de desenvolvimento. **Remover antes de baixar o projeto** com `npm uninstall z-ai-web-dev-sdk`.
- **`bun.lock` + `bun-types`**: o sandbox usa Bun como runtime, mas o produto é compatível com `npm`. O `package.json` usa scripts compatíveis com ambos.
- O `tailwind.config.ts` está em formato legado (Tailwind 3). O projeto na verdade usa Tailwind 4 via `@import "tailwindcss"` em `globals.css`. O `tailwind.config.ts` é parcialmente redundante — apenas o `darkMode: "class"` e o plugin `tailwindcss-animate` são relevantes. **AVISO**: há um leve descompasso entre as cores HSL do `tailwind.config.ts` e as cores OKLCH do `globals.css`. Em runtime, o `globals.css` vence.

---

## 3. Estrutura Completa de Diretórios

```
/home/z/my-project/
├── .env                              # DATABASE_URL (SQLite file path)
├── Caddyfile                         # Gateway do sandbox (irrelevante para dev local)
├── README.md                         # Resumo do projeto
├── bun.lock                          # Lockfile do sandbox
├── components.json                   # Config shadcn/ui (style: new-york)
├── eslint.config.mjs                 # ESLint flat config
├── next.config.ts                    # Next.js config (standalone output, Unsplash images)
├── next-env.d.ts                     # Tipos do Next
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts                # Config Tailwind (legado, parcialmente override por globals.css)
├── tsconfig.json                     # TS strict, paths @/* → ./src/*
├── prisma/
│   └── schema.prisma                 # Schema Prisma (SQLite, pronto para PostgreSQL)
├── public/
│   ├── favicon.svg                   # Favicon SVG (logo "BH" em dourado)
│   ├── og.svg                        # Open Graph image SVG
│   └── robots.txt                    # Disallow /admin e /api
├── docs/
│   └── PROJECT-DOCUMENTATION.md      # ESTE ARQUIVO
└── src/
    ├── app/                          # Rotas Next.js (App Router)
    ├── components/                   # Componentes React
    ├── data/                         # Camada de dados (mock hoje)
    ├── hooks/                        # Hooks customizados
    ├── lib/                          # Stores, utils, formatadores, db client
    └── types/                        # Tipos TypeScript de domínio
```

### `src/app/` — Rotas

```
src/app/
├── layout.tsx                         # Root layout: fontes, metadata global, <Toaster/>
├── page.tsx                           # Home pública
├── globals.css                        # Design system completo
├── sitemap.ts                         # sitemap.xml (rotas / e /agendar)
├── api/
│   └── route.ts                       # GET /api → health check
├── agendar/
│   ├── layout.tsx                     # Metadata específica de /agendar
│   └── page.tsx                       # Fluxo de agendamento (client component)
└── admin/
    ├── layout.tsx                     # Metadata admin (noindex)
    ├── page.tsx                       # redirect → /admin/dashboard
    ├── login/
    │   └── page.tsx                   # Tela de login (standalone, sem AdminShell)
    └── (panel)/                       # Route group com auth guard + AdminShell
        ├── layout.tsx                 # Auth guard client-side + <AdminShell>
        ├── dashboard/page.tsx         # Server Component
        ├── appointments/page.tsx      # Client Component (filtros)
        ├── clients/
        │   ├── page.tsx               # Client Component (busca)
        │   └── [id]/page.tsx          # Server Component (detalhe)
        ├── barbers/page.tsx           # Client Component (CRUD visual)
        ├── services/page.tsx          # Client Component (CRUD visual)
        └── settings/page.tsx          # Client Component (4 tabs)
```

> **Route group `(panel)`**: agrupa rotas que compartilham o `AdminShell` e o auth guard sem afetar a URL. A rota `/admin/dashboard` (não `/admin/(panel)/dashboard`) é o que aparece no browser.

### `src/components/` — Componentes

```
src/components/
├── ui/                                # shadcn/ui (40+ componentes pré-instalados)
├── layout/                            # Layout do site público
│   ├── Header.tsx                     # Sticky, mobile menu, CTA "Agendar"
│   ├── Footer.tsx                     # Endereço, horários, contato, nav
│   └── SiteShell.tsx                  # Wrapper flex min-h-screen (sticky footer)
├── home/                              # Seções da Home
│   ├── Hero.tsx                       # Hero com bg image + CTAs
│   ├── SectionHeading.tsx             # "01 / Serviços" reutilizável
│   ├── ServiceCard.tsx                # Card de serviço (display ou seleção)
│   ├── ServicesSection.tsx
│   ├── BarberCard.tsx                 # Card de barbeiro (display ou seleção)
│   ├── BarbersSection.tsx
│   ├── GallerySection.tsx             # Galeria 5 imagens (1 hero + 4)
│   ├── TestimonialCard.tsx
│   ├── TestimonialsSection.tsx
│   ├── LocationSection.tsx            # Mapa Google embed + info cards
│   └── FinalCta.tsx                   # CTA "Pronto para o próximo corte?"
├── booking/                           # Fluxo de agendamento
│   ├── BookingStepper.tsx             # 6 etapas (desktop horizontal / mobile compacto)
│   ├── StepNavigation.tsx             # Botões Voltar/Continuar
│   ├── ServiceSelector.tsx
│   ├── BarberSelector.tsx             # Inclui "Qualquer barbeiro"
│   ├── DateSelector.tsx               # Carousel horizontal de dias
│   ├── TimeSelector.tsx               # Grid de slots
│   ├── CustomerForm.tsx               # Nome + WhatsApp (máscara BR)
│   ├── BookingSummary.tsx             # Resumo + Confirmar
│   └── BookingConfirmation.tsx        # Tela de sucesso + Calendar/WhatsApp
└── admin/                             # Admin
    ├── AdminShell.tsx                 # Sidebar fixa (desktop) + Drawer (mobile) + Header
    ├── AdminSidebar.tsx               # Navegação lateral com 6 itens + "Voltar ao site"
    ├── AdminHeader.tsx                # Header sticky: title, "Ver site", perfil, logout
    ├── DashboardStats.tsx             # KPI cards + Upcoming list + Barber summary
    ├── StatusBadge.tsx                # Badge com 5 variantes de status
    ├── PageHeader.tsx                 # Cabeçalho reutilizável (título + descrição + actions)
    └── EmptyState.tsx                 # Estado vazio reutilizável
```

### `src/data/` — Camada de dados (mock)

```
src/data/
├── business.ts                        # SITE_CONFIG: nome, endereço, contato, horários
├── services.ts                        # SERVICES[] (4 serviços) + getServiceById()
├── barbers.ts                         # BARBERS[] (3 barbeiros) + getBarberById()
├── testimonials.ts                    # TESTIMONIALS[] (3 depoimentos)
├── gallery.ts                         # GALLERY[] (5 imagens Unsplash)
├── availability.ts                    # getOpenDays() + getTimeSlots() (mock determinístico)
└── admin/
    ├── users.ts                       # MOCK_ADMIN_USER
    ├── clients.ts                     # MOCK_CLIENTS[] (10 clientes) + getClientById()
    ├── appointments.ts                # MOCK_APPOINTMENTS[] + helpers de query
    ├── stats.ts                       # getDashboardStats() (derivado de appointments)
    └── settings.ts                    # getInitialSettings() (derivado de SITE_CONFIG)
```

### `src/lib/` — Stores, utils, db

```
src/lib/
├── utils.ts                           # cn() — clsx + tailwind-merge
├── format.ts                          # formatBRL, formatDuration, formatLongDate, buildWhatsAppLink, buildGoogleCalendarLink, buildMapsLink
├── booking-store.ts                   # Zustand store do fluxo de agendamento (persistido)
├── admin-auth-store.ts                # Zustand store da sessão admin (persistido, MOCK)
└── db.ts                              # Prisma Client singleton (NÃO UTILIZADO em runtime)
```

### `src/hooks/`

```
src/hooks/
├── use-is-client.ts                   # Hook SSR-safe (useSyncExternalStore) para detectar hidratação
├── use-mobile.ts                      # Hook shadcn para detectar mobile (< 768px)
└── use-toast.ts                       # Hook shadcn para toast notifications
```

### `src/types/`

```
src/types/
├── index.ts                           # Tipos do domínio público: Service, Barber, Testimonial, GalleryImage, BusinessAddress, BusinessHours, SiteConfig, BookingStep, BookingState, TimeSlot
└── admin.ts                           # Tipos do domínio admin: AdminRole, AdminUser, AppointmentStatus, Appointment, ClientStatus, Client, BarberSummary, DashboardStats, AdminSettings
```

---

## 4. Arquitetura da Aplicação

### Arquitetura atual (MVP)

```
Browser (client)
   │
   │  HTTP request
   ▼
Next.js (App Router, Node runtime)
   │
   │  Server Components (default) → render HTML
   │  Client Components ("use client") → hydrate + interatividade
   │
   │  Para dados:
   │    - Import direto de src/data/* (estático, em memória)
   │    - Zustand stores no client (booking-store, admin-auth-store)
   │
   ▼
Mock data (src/data/*)
   │
   │  Funções puras: getServiceById(), getOpenDays(), getTimeSlots(),
   │  getDashboardStats(), getAppointmentsByClient(), etc.
   │
   ▼
React components (UI)
```

**Características da arquitetura atual:**

- **Sem API intermediária**: as páginas server components importam diretamente os dados de `src/data/*`. As páginas client components usam `useEffect`/`useMemo` sobre os mesmos dados.
- **Sem persistência**: tudo é estado em memória. Zustand persiste apenas `localStorage` para o fluxo de agendamento em andamento e a sessão admin mock.
- **Sem fetch**: não há `fetch()` para `/api/*` em nenhum lugar do código de produto. A única rota API é `/api` (health check).

### Divisão Server vs Client Components

| Tipo | Arquivos |
|---|---|
| **Server Components** (default, sem `"use client"`) | `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/sitemap.ts`, `src/app/agendar/layout.tsx`, `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`, `src/app/admin/(panel)/dashboard/page.tsx`, `src/app/admin/(panel)/clients/[id]/page.tsx`, `src/app/api/route.ts`, mais a maioria dos componentes `home/` e `layout/` |
| **Client Components** (`"use client"`) | `src/app/agendar/page.tsx` (estado do fluxo), `src/app/admin/login/page.tsx` (form), `src/app/admin/(panel)/layout.tsx` (auth guard), `src/app/admin/(panel)/appointments/page.tsx` (filtros), `src/app/admin/(panel)/clients/page.tsx` (busca), `src/app/admin/(panel)/barbers/page.tsx` (CRUD visual), `src/app/admin/(panel)/services/page.tsx` (CRUD visual), `src/app/admin/(panel)/settings/page.tsx` (form), mais `Header.tsx`, `AdminShell.tsx`, `AdminSidebar.tsx`, `AdminHeader.tsx`, todos os componentes `booking/`, `ServiceCard.tsx`, `BarberCard.tsx` |

**Regra de ouro aplicada**: Server Components por default; Client Components apenas quando há estado, eventos, ou uso de hooks/browser APIs.

### Hooks customizados

| Hook | Arquivo | Para que |
|---|---|---|
| `useIsClient()` | `src/hooks/use-is-client.ts` | Retorna `false` durante SSR e primeira renderização client, `true` após hidratação. Implementado via `useSyncExternalStore` para evitar o anti-pattern `setState`-in-`useEffect`. **Usado em**: `DateSelector` (datas dependem de `new Date()`), `AgendarPage` (verifica `booking.confirmed` reidratado), `PanelLayout` (auth guard). |
| `useIsMobile()` | `src/hooks/use-mobile.ts` | shadcn padrão. **NÃO utilizado em nenhum componente do produto** (responsividade feita com classes Tailwind). |
| `useToast()` | `src/hooks/use-toast.ts` | shadcn padrão. **Usado em**: `SettingsPage` (toast "Configurações salvas"). |

### Stores Zustand

| Store | Arquivo | Persistência | Para que |
|---|---|---|---|
| `useBookingStore` | `src/lib/booking-store.ts` | `localStorage` key `barber-house-booking` | Estado do fluxo de agendamento. Permite retomar fluxo após refresh. |
| `useAdminAuthStore` | `src/lib/admin-auth-store.ts` | `localStorage` key `barber-house-admin-auth` | Sessão admin mock. |

### Arquitetura alvo (próximas fases)

```
Browser (client)
   │
   │  HTTP / fetch / Server Actions
   ▼
Next.js (App Router)
   │
   │  Server Components → chamam Prisma diretamente (server-only)
   │  Client Components → chamam /api/* ou Server Actions
   │
   ▼
API Routes / Server Actions (src/app/api/*, "use server")
   │
   │  Prisma Client (src/lib/db.ts)
   ▼
PostgreSQL
```

**Pontos de troca (seam points)** já preparados no código:

1. **`src/data/availability.ts → getTimeSlots()`** — hoje gera slots determinísticos. Para PostgreSQL, substitua por query em `appointments` onde `barbershopId`, `barberId` (se não "any") e `startAt` entre o intervalo do dia; marque slots sobrepostos como `available: false`. **Assinatura não precisa mudar** (`(date: Date, barber: Barber | null) => TimeSlot[]` ou versão async).

2. **`src/data/*`** — cada export pode ser substituído por `db.<model>.findMany(...)`. Os tipos em `src/types/*` já espelham os models Prisma.

3. **`src/app/agendar/page.tsx → handleConfirm()`** — hoje só faz `booking.confirm()` (seta flag `confirmed: true` no store). Para persistir, chame `POST /api/appointments` ou um Server Action, depois `booking.confirm()`. O store já tem todos os campos prontos.

4. **`src/lib/admin-auth-store.ts`** — substituir por `useSession()` do NextAuth. O `PanelLayout` (`src/app/admin/(panel)/layout.tsx`) que faz o guard client-side deve passar a usar middleware NextAuth server-side.

5. **`src/lib/db.ts`** — Prisma Client singleton já existe, **não é importado em nenhum arquivo de produto**. Importar quando começar a persistir.

---

## 5. Rotas

Lista completa de rotas realmente existentes no código.

### Rotas públicas

#### `GET /`

- **Propósito**: Home da barbearia.
- **Tipo**: Pública, Server Component.
- **Componentes**: `SiteShell` → `Hero`, `ServicesSection`, `BarbersSection`, `GallerySection`, `TestimonialsSection`, `LocationSection`, `FinalCta`.
- **Dados**: `SITE_CONFIG`, `SERVICES`, `BARBERS`, `GALLERY`, `TESTIMONIALS`.
- **Estado**: Stateless.
- **Comportamento**: Renderiza 7 seções com scroll suave entre âncoras (`#servicos`, `#barbeiros`, `#ambiente`, `#avaliacoes`, `#localizacao`, `#contato`).
- **Limitações**: Nenhuma.

#### `GET /agendar`

- **Propósito**: Fluxo de agendamento em 6 etapas.
- **Tipo**: Pública, **Client Component** (precisa de estado).
- **Componentes**: `SiteShell` + `BookingStepper` + `StepNavigation` + 6 seletores (`ServiceSelector`, `BarberSelector`, `DateSelector`, `TimeSelector`, `CustomerForm`, `BookingSummary`/`BookingConfirmation`).
- **Dados**: `SERVICES`, `BARBERS`, `getOpenDays()`, `getTimeSlots()`, `SITE_CONFIG`.
- **Estado**: `useBookingStore` (Zustand persistido em localStorage key `barber-house-booking`).
- **Comportamento**: Ver detalhes na seção [7. Sistema de Agendamento](#7-sistema-de-agendamento).
- **Limitações**: 
  - Persistência só em localStorage (não há backend).
  - Disponibilidade é mock determinístico.
  - Refresh da página mantém o estado do fluxo, mas **não persiste** o agendamento confirmado em nenhum banco.

#### `GET /api`

- **Propósito**: Health check.
- **Tipo**: Pública, Route Handler.
- **Resposta**: `{ status: "ok", service: "barber-house", time: ISOString }`.
- **Limitações**: Único endpoint API do produto. Não há endpoints de domínio ainda.

### Rotas administrativas

#### `GET /admin`

- **Propósito**: Redirect para `/admin/dashboard`.
- **Tipo**: Server Component.
- **Implementação**: `redirect("/admin/dashboard")` (server-side).

#### `GET /admin/login`

- **Propósito**: Tela de login (mock).
- **Tipo**: Client Component, **standalone** (não usa `AdminShell`).
- **Componentes**: `Button`, `Input`, `Label`, `useAdminAuthStore`.
- **Dados**: `SITE_CONFIG` (para o nome no header).
- **Estado**: local (`email`, `password`, `loading`); chama `useAdminAuthStore.login()` que seta `MOCK_ADMIN_USER`.
- **Comportamento**: Submit → `setTimeout(400ms)` simulando async → `login(email, password)` → `router.push("/admin/dashboard")`.
- **Limitações**: **MOCK** — qualquer e-mail + senha não vazios logam. Não há validação de credenciais.

#### `GET /admin/dashboard`

- **Propósito**: Dashboard com KPIs do dia.
- **Tipo**: Server Component (dentro de `(panel)/layout.tsx` que é client).
- **Componentes**: `PageHeader`, `DashboardStats`, `UpcomingAppointments`, `BarberSummary`.
- **Dados**: `getDashboardStats()` (derivado de `MOCK_APPOINTMENTS`).
- **Estado**: Nenhum (stateless).
- **Comportamento**: Mostra 4 KPI cards (Total, Confirmados, Aguardando, Faturamento), lista de próximos agendamentos de hoje, ranking de barbeiros por atendimentos hoje.
- **Limitações**: Dados mock relativos a "hoje". Não há gráficos.

#### `GET /admin/appointments`

- **Propósito**: Lista de agendamentos com filtros.
- **Tipo**: Client Component.
- **Componentes**: `PageHeader`, `Select`, `Input` (date), `StatusBadge`, `EmptyState`.
- **Dados**: `MOCK_APPOINTMENTS`, `BARBERS`, `STATUS_OPTIONS`.
- **Estado**: local (`date` default hoje, `barberFilter`, `statusFilter`).
- **Comportamento**: 
  - Filtros: data (input date), barbeiro (select), status (select).
  - Desktop (≥ 768px): tabela com 6 colunas.
  - Mobile: cards empilhados.
  - Empty state quando não há resultados.
- **Limitações**: **Sem ações** (não é possível confirmar/cancelar/concluir agendamentos — apenas visualização).

#### `GET /admin/clients`

- **Propósito**: Lista de clientes com busca.
- **Tipo**: Client Component.
- **Componentes**: `PageHeader`, `Input` (search), `Select` (status filter), `EmptyState`.
- **Dados**: `MOCK_CLIENTS`.
- **Estado**: local (`search`, `statusFilter`).
- **Comportamento**: 
  - Busca por nome ou telefone (normaliza dígitos).
  - Filtro de status: Todos / Ativos / Inativos.
  - Desktop: tabela com 5 colunas (Nome, WhatsApp, Último atendimento, Total, Status).
  - Mobile: cards clicáveis.
  - Click em cliente → navega para `/admin/clients/[id]`.
- **Limitações**: Somente leitura. Não é possível criar/editar/desativar clientes (eles são criados implicitamente quando um agendamento é confirmado — **ainda não implementado**).

#### `GET /admin/clients/[id]`

- **Propósito**: Detalhe do cliente com histórico.
- **Tipo**: **Server Component** (usa `params` async + `generateStaticParams` + `generateMetadata`).
- **Componentes**: `PageHeader`, `Card`/`CardContent`/`CardHeader`/`CardTitle`, `StatusBadge`, `EmptyState`.
- **Dados**: `getClientById(id)`, `getAppointmentsByClient(id)`, `getBarberById()`, `getServiceById()`.
- **Estado**: Nenhum.
- **Comportamento**: 
  - Mostra card de contato (WhatsApp, e-mail, cliente desde, observações, serviço preferido).
  - Grid de 4 stats (último atendimento, total de atendimentos, total gasto, barbeiro preferido).
  - Tabela (desktop) / cards (mobile) com histórico de atendimentos ordenados por data desc.
  - `notFound()` se `id` não existe.
- **Limitações**: Somente leitura. Sem ações sobre o cliente ou sobre os agendamentos do histórico.

#### `GET /admin/barbers`

- **Propósito**: CRUD visual de barbeiros.
- **Tipo**: Client Component.
- **Componentes**: `PageHeader`, `Button`, `Dialog` (form de adicionar/editar), `Input`, `Label`, `Textarea`, `Checkbox`, `EmptyState`, `BarberAdminCard` (interno).
- **Dados**: `BARBERS` (estado local inicial), `SERVICES` (checkboxes).
- **Estado**: local (`barbers` array, `dialogOpen`, `editing`).
- **Comportamento**: 
  - Grid de cards (3 cols desktop, 2 cols tablet, 1 col mobile).
  - Botão "Adicionar barbeiro" abre dialog.
  - Cada card tem "Editar" e toggle de status (placeholder).
  - Dialog com campos: nome, especialidade, descrição, URL da foto, serviços oferecidos (checkboxes).
  - Salvar atualiza estado local **não persiste**.
- **Limitações**: 
  - **Não persiste** — reload volta ao estado `BARBERS` do mock.
  - Toggle de status é placeholder (`handleToggleActive` é no-op real).
  - Checkbox de serviços oferecidos é coletado mas **não enviado** no save (campo `offeredServices` não está no tipo `Barber`).
  - Não há upload de imagem — só URL.

#### `GET /admin/services`

- **Propósito**: CRUD visual de serviços.
- **Tipo**: Client Component.
- **Componentes**: `PageHeader`, `Button`, `Dialog`, `Input`, `Label`, `Textarea`, `EmptyState`, `ServiceAdminCard` (interno).
- **Dados**: `SERVICES` (estado local inicial).
- **Estado**: local (`services` array, `dialogOpen`, `editing`).
- **Comportamento**: 
  - Grid de cards (3 cols desktop).
  - Botão "Adicionar serviço" abre dialog.
  - Dialog com campos: nome, descrição, duração (min), preço (R$).
  - Salvar atualiza estado local **não persiste**.
- **Limitações**: 
  - **Não persiste** — reload volta ao estado `SERVICES` do mock.
  - Não há toggle de ativo/inativo real (todos aparecem como "Ativo").
  - Switch do dialog está importado mas **não usado** no formulário.

#### `GET /admin/settings`

- **Propósito**: Configurações da barbearia em 4 tabs.
- **Tipo**: Client Component.
- **Componentes**: `PageHeader`, `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`, `Input`, `Label`, `Textarea`, `Switch`, `Button`, `useToast`.
- **Dados**: `getInitialSettings()` (derivado de `SITE_CONFIG`).
- **Estado**: local (`settings` — objeto grande com 4 seções).
- **Comportamento**: 
  - **Tab Barbearia**: nome, descrição, telefone, e-mail, endereço completo.
  - **Tab Horários**: switch por dia + inputs de abertura/fechamento.
  - **Tab Agendamento**: antecedência mínima, duração padrão, permitir cancelamento (+ antecedência).
  - **Tab WhatsApp**: habilitar confirmações, número, status da API (sempre "não conectada").
  - Botão "Salvar alterações" em cada tab → mostra toast **não persiste**.
- **Limitações**: 
  - **Não persiste** — reload volta ao `getInitialSettings()`.
  - Tab WhatsApp tem botão "Conectar" desabilitado (API não implementada).

### Rotas que NÃO existem (importante para o próximo dev)

- `/admin/clients/new` — não há criação manual de cliente.
- `/admin/barbers/[id]` — não há página de detalhe de barbeiro.
- `/admin/services/[id]` — não há página de detalhe de serviço.
- `/admin/appointments/[id]` — não há página de detalhe de agendamento.
- `/api/appointments` — não há API de agendamentos.
- `/api/clients` — não há API de clientes.
- `/admin/reports` — não há relatórios.
- Qualquer rota de barra logada com role BARBER — não implementada.

---

## 6. Home Page

Arquivo: `src/app/page.tsx` (Server Component, sem `"use client"`).

```tsx
import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/home/Hero";
import { ServicesSection } from "@/components/home/ServicesSection";
import { BarbersSection } from "@/components/home/BarbersSection";
import { GallerySection } from "@/components/home/GallerySection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { LocationSection } from "@/components/home/LocationSection";
import { FinalCta } from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <ServicesSection />
      <BarbersSection />
      <GallerySection />
      <TestimonialsSection />
      <LocationSection />
      <FinalCta />
    </SiteShell>
  );
}
```

A página é uma composição server-side de 7 seções. Sem estado. Sem fetch. Tudo vem de `src/data/*`.

### 6.1 Header

- **Arquivo**: `src/components/layout/Header.tsx` (Client Component).
- **Componente**: `Header`.
- **Dados**: `SITE_CONFIG.name`, `NAV_ITEMS` (const local).
- **Comportamento**:
  - Sticky no topo com `z-50`.
  - Background transparente no topo; ao rolar 8px, ganha `border-b` + `backdrop-blur`.
  - Desktop (≥ 768px): nav horizontal com 5 itens + CTA "Agendar".
  - Mobile: botão hambúrguer que abre menu dropdown full-width.
  - `body.overflow = "hidden"` quando menu mobile aberto.
- **Responsividade**: quebra em `md:` (768px).
- **Acessibilidade**: `aria-label`, `aria-expanded`, `aria-controls` no botão de menu.
- **Dependências**: `lucide-react` (Menu, X, Calendar), `Button`, `cn`.

### 6.2 Hero

- **Arquivo**: `src/components/home/Hero.tsx`.
- **Componente**: `Hero`.
- **Dados**: `SITE_CONFIG` (name, address.city).
- **Comportamento**:
  - Background image (Unsplash) com scrim `bg-background/80` + gradient para `from-background`.
  - Altura mínima 88vh mobile / 80vh desktop.
  - Eyebrow "Barbearia · São Paulo" + headline `BARBER HOUSE` (Bebas Neue 6xl-8xl) + subtítulo Playfair itálico + parágrafo + 2 CTAs + trust row (5 estrelas + "10 anos de ofício").
  - CTAs: "Agendar horário" (primário, `/agendar`) + "Conheça a barbearia" (outline, `#ambiente`).
- **Animações**: `animate-fade-in-up` no wrapper.
- **Responsividade**: tamanhos de fonte escalam com `sm:`/`md:`.
- **Limitações**: imagem hardcoded via `style.backgroundImage` (não usa `next/image`).

### 6.3 ServicesSection

- **Arquivo**: `src/components/home/ServicesSection.tsx`.
- **Componentes**: `SectionHeading`, `ServiceCard`.
- **Dados**: `SERVICES` (4 serviços).
- **Comportamento**: grid 1 col mobile / 2 cols tablet / 4 cols desktop. Cada card mostra nome, preço (Bebas Neue), descrição, duração (ícone Clock).
- **Limitações**: cards da home são **display-only** (não clicáveis). A versão clicável está em `src/components/home/ServiceCard.tsx` com prop `onSelect`, usada no fluxo de agendamento.

### 6.4 BarbersSection

- **Arquivo**: `src/components/home/BarbersSection.tsx`.
- **Componentes**: `SectionHeading`, `BarberCard`.
- **Dados**: `BARBERS` (3 barbeiros com fotos Unsplash).
- **Comportamento**: grid 1 col mobile / 2 cols tablet / 3 cols desktop. Cada card mostra foto (aspect 4/5), nome, especialidade (uppercase gold), bio.
- **Imagens**: `next/image` com `fill` + `sizes`. Remote patterns configurados em `next.config.ts` para `images.unsplash.com`.

### 6.5 GallerySection

- **Arquivo**: `src/components/home/GallerySection.tsx`.
- **Dados**: `GALLERY` (5 imagens).
- **Comportamento**: grid `auto-rows-[180px]` mobile / `[220px]` desktop, 2 cols mobile / 4 cols desktop. Primeira imagem ocupa 2x2 (`col-span-2 row-span-2`).
- **Imagens**: `next/image` com `fill`.

### 6.6 TestimonialsSection

- **Arquivo**: `src/components/home/TestimonialsSection.tsx`.
- **Componentes**: `SectionHeading`, `TestimonialCard`.
- **Dados**: `TESTIMONIALS` (3 depoimentos).
- **Comportamento**: grid 1 col mobile / 3 cols desktop. Cada card mostra ícone Quote, citação, autor, contexto, 5 estrelas.

### 6.7 LocationSection

- **Arquivo**: `src/components/home/LocationSection.tsx`.
- **Dados**: `SITE_CONFIG` (address, hours, phone, whatsapp, mapsQuery).
- **Comportamento**:
  - Grid 1 col mobile / 2 cols desktop.
  - Esquerda: iframe Google Maps embed com filtro CSS `invert(0.92) hue-rotate(180deg) contrast(0.95)` para combinar com o tema dark.
  - Direita: 3 cards (Endereço + "Abrir no mapa", Horários, Contato + "Falar no WhatsApp").
- **Links externos**: `buildMapsLink(mapsQuery)`, `buildWhatsAppLink(whatsapp, msg)`.
- **Limitações**: iframe pode não renderizar em alguns headless browsers (funciona em browser real).

### 6.8 FinalCta

- **Arquivo**: `src/components/home/FinalCta.tsx`.
- **Comportamento**: seção centralizada com eyebrow "Pronto?", headline "Pronto para o próximo corte?" (5xl-7xl), parágrafo, botão "Agendar horário" → `/agendar`. Background com scrim secundário + linha dourada superior.

### 6.9 Footer

- **Arquivo**: `src/components/layout/Footer.tsx`.
- **Dados**: `SITE_CONFIG`.
- **Comportamento**:
  - Grid 3 cols: Brand + Instagram, Contato (telefone, WhatsApp, endereço), Horários.
  - Hairline dourado + linha de copyright + nav rodapé.
  - `id="contato"` para âncora do header.
- **Acessibilidade**: `<h2 className="sr-only">Rodapé</h2>`, `<nav aria-label="Navegação do rodapé">`.

---

## 7. Sistema de Agendamento

Esta é a parte mais complexa do produto. Documentação profunda abaixo.

### Visão geral

- **Rota**: `/agendar`
- **Arquivo**: `src/app/agendar/page.tsx` (Client Component).
- **Estado global**: `useBookingStore` (Zustand persistido em `localStorage`).
- **Estado local**: `userStep` (qual etapa está visível).
- **6 etapas**: `service` → `barber` → `date` → `time` → `customer` → `confirmation`.

### Estado: `useBookingStore`

Definido em `src/lib/booking-store.ts`. Persistido em `localStorage` com key `barber-house-booking`.

```typescript
interface BookingState {
  service: Service | null;
  barber: Barber | null;       // null também quando "any barber"
  anyBarber: boolean;
  date: string | null;          // ISO yyyy-mm-dd
  time: string | null;          // "HH:mm"
  customerName: string;
  customerPhone: string;        // formatado "(11) 91234-5678"
  confirmed: boolean;
}

interface BookingActions {
  setService: (service: Service | null) => void;
  setBarber: (barber: Barber | null) => void;
  setAnyBarber: (any: boolean) => void;  // limpa barber se true
  setDate: (iso: string | null) => void; // reseta time ao mudar data
  setTime: (time: string | null) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  confirm: () => void;          // seta confirmed = true
  reset: () => void;            // volta para INITIAL
}
```

**Comportamento especial**:
- `setDate()` sempre reseta `time` para `null` (não faz sentido manter horário ao mudar data).
- `setAnyBarber(true)` limpa `barber` para `null`.
- `partialize()` garante que apenas dados (não funções) são persistidos.

### Lógica de navegação entre etapas

```typescript
const STEP_ORDER: BookingStep[] = [
  "service", "barber", "date", "time", "customer", "confirmation",
];

const [userStep, setUserStep] = useState<BookingStep>("service");

// Derived step: se há booking confirmado reidratado do localStorage,
// pula direto para a tela de confirmação.
const step: BookingStep =
  isClient && booking.confirmed ? "confirmation" : userStep;
```

**Validação por etapa** (`canAdvance`):

| Etapa | Pode avançar se... |
|---|---|
| `service` | `booking.service` não é null |
| `barber` | `booking.barber` não é null OU `booking.anyBarber` é true |
| `date` | `booking.date` não é null |
| `time` | `booking.time` não é null |
| `customer` | `customerName.trim().length >= 2` E `customerPhone` dígitos ≥ 10 |
| `confirmation` | botão "Continuar" escondido nesta etapa |

**Auto-advance**: ao selecionar serviço, barbeiro ou "qualquer barbeiro", a página automaticamente avança para a próxima etapa após 180ms (para reduzir fricção no mobile). Implementado via `setTimeout(() => setUserStep(...), 180)`.

### Etapa 1 — Serviço (`ServiceSelector`)

- **Componente**: `src/components/booking/ServiceSelector.tsx`.
- **UI**: grid 1 col mobile / 2 cols desktop de `ServiceCard` com prop `onSelect`.
- **Dados**: `SERVICES` (4 serviços).
- **Seleção**: click → `booking.setService(service)` → auto-advance para `barber`.

### Etapa 2 — Barbeiro (`BarberSelector`)

- **Componente**: `src/components/booking/BarberSelector.tsx`.
- **UI**: 
  - Botão grande "Qualquer barbeiro" no topo (ícone Users).
  - Grid de `BarberCard` (3 barbeiros) com foto, nome, especialidade.
- **Dados**: `BARBERS`.
- **Seleção**:
  - Click em barbeiro → `setAnyBarber(false)` + `setBarber(b)` → auto-advance.
  - Click em "Qualquer" → `setAnyBarber(true)` → auto-advance.

### Etapa 3 — Data (`DateSelector`)

- **Componente**: `src/components/booking/DateSelector.tsx`.
- **UI**: carousel horizontal de 6 dias abertos (scrollable), com setas esquerda/direita no desktop.
- **Dados**: `getOpenDays(6)` de `src/data/availability.ts`.
- **SSR-safety**: usa `useIsClient()` para renderizar skeleton durante SSR (datas dependem de `new Date()` que difere entre server e client).
- **Seleção**: click → `booking.setDate(iso)` (formato `yyyy-mm-dd`).
- **Limitações**: 
  - Sempre mostra os próximos 6 dias abertos (sem navegação para o mês seguinte).
  - Hoje é incluído apenas se ainda estiver dentro do horário de funcionamento.

### Etapa 4 — Horário (`TimeSelector`)

- **Componente**: `src/components/booking/TimeSelector.tsx`.
- **UI**: grid 3 cols mobile / 4 cols tablet / 5 cols desktop de botões de horário.
- **Dados**: `getTimeSlots(date, barber)` de `src/data/availability.ts`.
- **Comportamento**:
  - Slots disponíveis: clicáveis, destacam o selecionado.
  - Slots indisponíveis: `disabled`, `line-through`, opacidade reduzida.
  - Se 0 slots disponíveis: mostra mensagem "Sem horários disponíveis para esta data".
- **Seleção**: click → `booking.setTime(time)` (formato "HH:mm").

### Etapa 5 — Dados do cliente (`CustomerForm`)

- **Componente**: `src/components/booking/CustomerForm.tsx`.
- **UI**: 2 inputs (Nome, WhatsApp) em grid 1 col mobile / 2 cols desktop.
- **Máscara de telefone**: função `maskPhone()` aplica formato `(11) 91234-5678` em tempo real, limitando a 11 dígitos.
- **Validação**:
  - Nome: `trim().length >= 2` (validado on blur).
  - WhatsApp: dígitos ≥ 10 (validado on blur).
  - Mensagens: "Informe seu nome." / "Telefone inválido. Inclua DDD."
- **Acessibilidade**: `aria-invalid`, `aria-describedby` ligando input ao erro.

### Etapa 6 — Confirmação

Há duas sub-etapas controladas por `booking.confirmed`:

#### 6a. Resumo (`BookingSummary`)

- **Componente**: `src/components/booking/BookingSummary.tsx`.
- **UI**: lista vertical com 6 linhas (Serviço, Barbeiro, Data, Horário, Cliente, WhatsApp) + total (Bebas Neue gold) + duração.
- **Ação**: botão "Confirmar agendamento" → `booking.confirm()` (seta `confirmed: true`).

#### 6b. Tela de sucesso (`BookingConfirmation`)

- **Componente**: `src/components/booking/BookingConfirmation.tsx`.
- **UI**: 
  - Ícone `CheckCircle2` em círculo dourado.
  - Eyebrow "Agendamento confirmado" + headline "Tá marcado".
  - Mensagem personalizada com nome + telefone.
  - Mini-resumo (Serviço, Quando, Barbeiro).
  - 2 botões: "Adicionar ao calendário" (Google Calendar link) + "Enviar confirmação pelo WhatsApp" (wa.me link).
  - Ações secundárias: "Novo agendamento" (reset) + "Voltar ao início" (`/`).
- **Limitações**: **Não persiste o agendamento** — apenas seta `confirmed: true` no localStorage. Em um refresh, o usuário continua vendo a tela de sucesso (estado persistido), mas **o agendamento não existe em nenhum banco**.

### Geração de horários — `src/data/availability.ts`

```typescript
export const SLOT_INTERVAL_MIN = 30; // minutos

export function getOpenDays(count = 6, from: Date = new Date()): Date[] {
  // Retorna os próximos `count` dias abertos, pulando dias fechados.
  // Hoje é incluído apenas se ainda não passou do horário de fechamento.
  // Safety cap: 14 dias escaneados no máximo.
}

export function getTimeSlots(date: Date, barber: Barber | null): TimeSlot[] {
  // 1. Determina o weekday (0-6) e busca horários em SITE_CONFIG.hours.
  // 2. Se não há horário (dia fechado), retorna [].
  // 3. Gera slots de SLOT_INTERVAL_MIN em SLOT_INTERVAL_MIN entre open e close.
  // 4. Para cada slot:
  //    - isPast: se for hoje e o horário já passou → available: false
  //    - isMockBooked: hash determinístico de (date|time|barberId) → ~30% ocupado
  //    - available: !isPast && !isMockBooked
  // 5. Para o último slot: para sempre terminar SLOT_INTERVAL_MIN antes do close.
}
```

**Mock determinístico**: `isMockBooked` usa um hash simples da string `${date}|${time}|${barberId}`. Mesma entrada = mesma saída, então a UI é estável entre renders. ~30% dos slots aparecem como ocupados.

### Confirmação — integrações externas

#### Google Calendar

- **Função**: `buildGoogleCalendarLink()` em `src/lib/format.ts`.
- **URL**: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&details=...&location=...&dates=YYYYMMDDTHHMMSS/YYYYMMDDTHHMMSS`
- **Dados enviados**: título (`BARBER HOUSE — {serviço}`), descrição (nome do cliente + serviço + barbeiro), localização (endereço), datas (start + end em UTC).
- **Comportamento**: abre em nova aba; o usuário decide se adiciona ao calendário.

#### WhatsApp

- **Função**: `buildWhatsAppLink()` em `src/lib/format.ts`.
- **URL**: `https://wa.me/{phoneE164}?text={encodedMessage}`
- **Destinatário**: o número da **barbearia** (`SITE_CONFIG.whatsapp`), não do cliente.
- **Mensagem pré-preenchida**:
  ```
  Olá, {nome}! Confirmando seu agendamento na BARBER HOUSE.
  
  Serviço: {serviço}
  Barbeiro: {barbeiro ou "Qualquer barbeiro"}
  Data: {data longa pt-BR}
  Horário: {HH:mm}
  Valor: R$ {preço}
  
  Te esperamos!
  ```
- **Limitação**: hoje é só deep link. Não envia nada automaticamente. O cliente precisa abrir o WhatsApp e tocar em enviar.

### Como substituir o mock por banco real

Esta é a sequência recomendada para o próximo desenvolvedor:

1. **Conectar PostgreSQL**:
   - Mudar `provider` em `prisma/schema.prisma` de `"sqlite"` para `"postgresql"`.
   - Atualizar `DATABASE_URL` no `.env` para uma connection string PostgreSQL.
   - Rodar `npx prisma db push` para criar as tabelas.

2. **Criar o endpoint** `POST /api/appointments`:
   - Em `src/app/api/appointments/route.ts`.
   - Validar body com zod (já instalado).
   - Inserir em `db.appointment.create({ data: { ... } })`.
   - Também criar/atualizar o `Client` (upsert por `(barbershopId, phone)`).

3. **Modificar `handleConfirm` em `src/app/agendar/page.tsx`**:
   ```typescript
   const handleConfirm = async () => {
     setLoading(true);
     try {
       const res = await fetch("/api/appointments", {
         method: "POST",
         body: JSON.stringify({
           serviceId: booking.service!.id,
           barberId: booking.anyBarber ? null : booking.barber!.id,
           anyBarber: booking.anyBarber,
           startAt: new Date(`${booking.date}T${booking.time}:00`).toISOString(),
           customerName: booking.customerName,
           customerPhone: booking.customerPhone,
         }),
       });
       if (!res.ok) throw new Error();
       booking.confirm();
     } catch {
       // mostrar erro
     } finally {
       setLoading(false);
     }
   };
   ```

4. **Substituir `src/data/availability.ts → getTimeSlots()`**:
   - Tornar async: `async function getTimeSlots(date, barber): Promise<TimeSlot[]>`.
   - Query: `db.appointment.findMany({ where: { barbershopId, startAt: { gte: dayStart, lt: dayEnd }, barberId: barber?.id ?? undefined, status: { not: "CANCELLED" } } })`.
   - Para cada slot gerado, marcar `available: false` se colide com algum appointment retornado.

5. **Atualizar `DateSelector` e `AgendarPage`** para usar a versão async (loading state).

---

## 8. Estado / Zustand

O projeto tem **2 stores Zustand**, ambos persistidos em `localStorage`.

### Store 1: `useBookingStore` — fluxo de agendamento

- **Arquivo**: `src/lib/booking-store.ts`.
- **Persistência**: `localStorage` key `"barber-house-booking"`.
- **Partialize**: apenas dados (não funções) são persistidos.

#### Estado inicial

```typescript
const INITIAL: BookingState = {
  service: null,
  barber: null,
  anyBarber: false,
  date: null,
  time: null,
  customerName: "",
  customerPhone: "",
  confirmed: false,
};
```

#### Quando o estado é atualizado

| Action | Quando é chamada | Efeito colateral |
|---|---|---|
| `setService` | Click em card de serviço na etapa 1 | — |
| `setBarber` | Click em card de barbeiro na etapa 2 | — |
| `setAnyBarber` | Click em "Qualquer barbeiro" na etapa 2 | Se `true`, limpa `barber` |
| `setDate` | Click em dia na etapa 3 | **Reseta `time` para null** |
| `setTime` | Click em slot na etapa 4 | — |
| `setCustomerName` | onChange do input nome | — |
| `setCustomerPhone` | onChange do input WhatsApp (já mascarado) | — |
| `confirm` | Click em "Confirmar agendamento" na etapa 6a | Seta `confirmed: true` |
| `reset` | Click em "Novo agendamento" na tela de sucesso | Volta para `INITIAL` |

#### Problemas a considerar na migração para persistência real

1. **`confirmed: true` sem backend**: hoje, ao confirmar, apenas setamos `confirmed: true` no localStorage. Se o usuário refresh, continua vendo a tela de sucesso, mas **o agendamento não existe em nenhum banco**. Ao migrar, `confirm()` deve chamar a API primeiro e só setar `confirmed` se a API retornar sucesso. Em caso de falha, manter o usuário na etapa de resumo com mensagem de erro.

2. **Conflito de horário**: hoje não há race condition porque tudo é mock. Com banco real, dois usuários podem tentar agendar o mesmo slot simultaneamente. Solução: constraint unique no Postgres `(barbershopId, barberId, startAt)` ou transação com lock.

3. **Stale state**: se o usuário abrir o fluxo em uma aba, deixar parado, e o barbeiro cancelar o horário no admin em outra aba, o usuário ainda verá o slot como disponível. Solução: re-validar disponibilidade no `handleConfirm` antes de persistir.

4. **Telas obsoletas**: se o schema do `Service` ou `Barber` mudar no backend, o `localStorage` pode ter dados incompatíveis. Considerar versionar o store (`name: "barber-house-booking-v1"`) e fazer migrate.

5. **Limpeza**: não há TTL. Um `confirmed: true` fica para sempre no localStorage. Considerar limpar após X dias ou ao iniciar novo fluxo.

### Store 2: `useAdminAuthStore` — sessão admin mock

- **Arquivo**: `src/lib/admin-auth-store.ts`.
- **Persistência**: `localStorage` key `"barber-house-admin-auth"`.

#### Estado

```typescript
interface AdminAuthState {
  user: AdminUser | null;
  login: (email: string, password: _password: string) => boolean;  // sempre true
  logout: () => void;
}
```

#### Comportamento

- `login(email, password)` ignora ambos os argumentos e seta `user: MOCK_ADMIN_USER`. Retorna `true`.
- `logout()` seta `user: null`.
- O `PanelLayout` lê `user` e redireciona para `/admin/login` se null.

#### Problemas a considerar

1. **Sem validação**: qualquer e-mail + senha não vazios logam. **CRÍTICO** para produção.
2. **Sem expiração**: a sessão fica para sempre no localStorage.
3. **Sem role check**: o `MOCK_ADMIN_USER` tem `role: "ADMIN"`, mas nenhuma rota verifica a role.
4. **Client-side only**: o guard é client-side. Um usuário pode acessar o HTML server-rendered do painel antes do redirect. Para dados sensíveis, **precisa de middleware NextAuth server-side**.

---

## 9. Dados Mockados

Lista exaustiva de todos os arquivos com dados mockados.

### `src/data/business.ts`

- **Dados**: `SITE_CONFIG` — nome, tagline, descrição, telefone, whatsapp, e-mail, instagram, endereço completo, `mapsQuery`, horários de funcionamento (Seg-Sáb, sem domingo).
- **Quem consome**: `layout.tsx` (metadata), `Header`, `Footer`, `Hero`, `LocationSection`, `BookingConfirmation`, `AdminSidebar`, `AdminHeader`, `settings.ts` (deriva valores iniciais).
- **Como substituir**: criar um `Barbershop` no banco (table `barbershops`) e carregar via `db.barbershop.findUnique({ where: { slug } })` em um server component ou middleware. Hoje o `barbershopId` é hardcoded como `"barbershop-1"` em `MOCK_ADMIN_USER` e em `MOCK_APPOINTMENTS`.
- **Model Prisma**: `Barbershop` (+ campos de endereço diretamente no model).

### `src/data/services.ts`

- **Dados**: `SERVICES` (4 serviços: Corte, Barba, Corte + Barba, Sobrancelha) + `getServiceById()`.
- **Quem consome**: `ServicesSection`, `ServiceSelector`, `BookingSummary`, `ServiceAdminCard` (admin), `barbers/page.tsx` (checkboxes), `appointments.ts` (mock appointments), `clients/[id]/page.tsx`.
- **Como substituir**: `db.service.findMany({ where: { barbershopId, isActive: true }, orderBy: { sortOrder: "asc" } })`.
- **Model Prisma**: `Service`.
- **Mapeamento de campos**:
  - TS: `priceBRL: number` (40.00) → Prisma: `priceCents: Int` (4000). **Conversão necessária**.
  - TS: `durationMin: number` → Prisma: `durationMin: Int`. Direto.
  - TS: `id: "corte"` (string slug) → Prisma: `id: cuid()`. Pode manter um campo `slug` separado se quiser URLs amigáveis.

### `src/data/barbers.ts`

- **Dados**: `BARBERS` (3 barbeiros: João Silva, Carlos Mendes, Rafael Costa) com fotos Unsplash + `getBarberById()`.
- **Quem consome**: `BarbersSection`, `BarberSelector`, `BarbersPage` (admin), `DashboardStats` (barber summary), `appointments.ts` (mock appointments), `clients/[id]/page.tsx`.
- **Como substituir**: `db.barber.findMany({ where: { barbershopId, isActive: true }, orderBy: { sortOrder: "asc" } })`.
- **Model Prisma**: `Barber`.
- **Mapeamento**: direto, exceto que o Prisma tem `isActive: Boolean` que não está no tipo TS público (está apenas no admin).

### `src/data/testimonials.ts`

- **Dados**: `TESTIMONIALS` (3 depoimentos com rating 5).
- **Quem consome**: `TestimonialsSection`.
- **Como substituir**: `db.testimonial.findMany({ where: { barbershopId, isPublic: true }, orderBy: { createdAt: "desc" }, take: 3 })`.
- **Model Prisma**: `Testimonial`.

### `src/data/gallery.ts`

- **Dados**: `GALLERY` (5 imagens Unsplash com alt text).
- **Quem consome**: `GallerySection`.
- **Como substituir**: não há model Prisma para gallery. **Criar** `model GalleryImage { id, barbershopId, url, alt, sortOrder }` quando migrar. Ou usar um campo JSON no `Barbershop`.
- **Status**: UNKNOWN / NEEDS VERIFICATION — não há model correspondente no schema atual.

### `src/data/availability.ts`

- **Dados**: nenhum dado estático; funções que geram slots determinísticos.
- **Quem consome**: `DateSelector` (via `getOpenDays`), `AgendarPage` (via `getTimeSlots`).
- **Como substituir**: ver seção [7. Sistema de Agendamento → Como substituir o mock por banco real](#como-substituir-o-mock-por-banco-real).
- **Models Prisma envolvidos**: `Appointment` (slots ocupados), `BusinessHour` (horários da barbearia/barbeiro), `TimeBlock` (bloqueios especiais).

### `src/data/admin/users.ts`

- **Dados**: `MOCK_ADMIN_USER` — `{ id: "admin-1", name: "Administrador", email: "admin@barberhouse.com.br", role: "ADMIN", barbershopId: "barbershop-1" }`.
- **Quem consome**: `admin-auth-store.ts` (login).
- **Como substituir**: query via NextAuth credentials provider em `db.admin.findUnique({ where: { email } })`.
- **Model Prisma**: `Admin`.

### `src/data/admin/clients.ts`

- **Dados**: `MOCK_CLIENTS` — 10 clientes com stats desnormalizadas (`lastVisitAt`, `totalAppointments`, `totalSpentBRL`, `preferredBarberId`, `preferredServiceId`).
- **Quem consome**: `ClientsPage`, `ClientDetailPage`, `appointments.ts` (mock appointments referenciam clientes por ID).
- **Como substituir**: `db.client.findMany({ where: { barbershopId }, orderBy: { name: "asc" } })`. As stats desnormalizadas devem ser mantidas em sync via trigger ou escrita no app-layer quando um appointment é criado/atualizado.
- **Model Prisma**: `Client`.
- **Mapeamento**:
  - TS: `totalSpentBRL: number` → Prisma: `totalSpentCents: Int`. **Conversão**.
  - TS: `phone: "(31) 99999-1111"` (formatado) → Prisma: `phone: String` (decidir se normaliza ou mantém formatado). A unique constraint é em `(barbershopId, phone)` — **normalizar para dígitos** antes de salvar.

### `src/data/admin/appointments.ts`

- **Dados**: `MOCK_APPOINTMENTS` — ~25 appointments gerados a partir de templates fixos (client/barber/service/status/dayOffset/startMin), ancorados na data atual.
- **Quem consome**: `AppointmentsPage`, `DashboardPage` (via `stats.ts`), `ClientDetailPage` (via `getAppointmentsByClient`).
- **Como substituir**: `db.appointment.findMany({ where: { barbershopId, startAt: { gte:..., lt:... } }, include: { service: true, barber: true, client: true }, orderBy: { startAt: "asc" } })`.
- **Model Prisma**: `Appointment`.
- **Mapeamento**:
  - TS: `priceBRL: number` → Prisma: `priceCents: Int`. **Conversão**.
  - TS: `serviceName`, `barberName`, `clientName`, `clientPhone` (desnormalizados) → Prisma: estão em `Service.name`, `Barber.name`, `Client.name`, `Client.phone` (via relations). Manter os snapshots no `Appointment` para histórico mesmo se o client for deletado.

### `src/data/admin/stats.ts`

- **Dados**: nenhum estático; `getDashboardStats()` deriva de `MOCK_APPOINTMENTS`.
- **Quem consome**: `DashboardPage`.
- **Como substituir**: query SQL única com `count(*)` + `sum(priceCents)` + `group by barberId`.
- **Models Prisma**: `Appointment` (com `where: { barbershopId, startAt: { gte: today, lt: tomorrow } }`).

### `src/data/admin/settings.ts`

- **Dados**: `getInitialSettings()` deriva de `SITE_CONFIG` + hardcoded defaults para booking e whatsapp.
- **Quem consome**: `SettingsPage` (estado inicial).
- **Como substituir**: 
  - Tab Barbearia: `db.barbershop.findUnique()`.
  - Tab Horários: `db.businessHour.findMany({ where: { barbershopId } })`.
  - Tab Agendamento: **não há model correspondente**. Criar `model BookingSettings { barbershopId, minLeadHours, defaultDurationMin, allowCancellation, cancellationLeadHours }`.
  - Tab WhatsApp: **não há model correspondente**. Adicionar campos em `Barbershop` ou criar `model WhatsAppIntegration`.
- **Status**: parcialmente UNKNOWN / NEEDS VERIFICATION para tabs Agendamento e WhatsApp.

---

## 10. Modelo de Dados

Schema em `prisma/schema.prisma`. **Provider: SQLite** (não PostgreSQL).

### Configuração do datasource

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"   // ← TROCAR para "postgresql" na Fase 1
  url      = env("DATABASE_URL")
}
```

### Models existentes

#### `Barbershop`

Tenant root. Uma barbearia = um tenant.

| Campo | Tipo | Obrigatório | Notas |
|---|---|---|---|
| `id` | `String @id @default(cuid())` | sim | |
| `name` | `String` | sim | |
| `slug` | `String @unique` | sim | Para URLs multi-tenant futuras |
| `tagline` | `String?` | não | |
| `phone` | `String?` | não | |
| `whatsapp` | `String?` | não | |
| `email` | `String?` | não | |
| `instagram` | `String?` | não | |
| `street`, `number`, `district`, `city`, `state`, `zip` | `String?` | não | Endereço |
| `mapsQuery` | `String?` | não | Query string para Google Maps |
| `isActive` | `Boolean @default(true)` | sim | |
| `createdAt` | `DateTime @default(now())` | sim | |
| `updatedAt` | `DateTime @updatedAt` | sim | |

**Relations (1:N)**: `barbers`, `services`, `appointments`, `testimonials`, `admins`, `hours`, `blocks`.

#### `Admin`

Usuário com acesso ao painel. **Não confundir com `Client`**.

| Campo | Tipo | Obrigatório | Notas |
|---|---|---|---|
| `id` | `String @id @default(cuid())` | sim | |
| `email` | `String @unique` | sim | |
| `name` | `String?` | não | |
| `passwordHash` | `String?` | não | `?` para suportar OAuth futuro |
| `role` | `AdminRole @default(MANAGER)` | sim | Enum |
| `barbershopId` | `String?` | não | `?` para SUPER_ADMIN global |
| `createdAt` / `updatedAt` | `DateTime` | sim | |

**Relation**: `barbershop` (N:1 com `Barbershop`, cascade delete).

#### `enum AdminRole`

```prisma
enum AdminRole {
  SUPER_ADMIN   // global, não atrelado a barbearia
  OWNER         // dono da barbearia
  MANAGER       // gerente
  BARBER        // barbeiro com acesso ao painel
}
```

> **Discrepância**: o tipo TS `AdminRole` em `src/types/admin.ts` define apenas `"ADMIN" | "BARBER"`. O enum Prisma tem 4 valores. **Alinhar na Fase 4** (RBAC).

#### `Service`

Catálogo de serviços da barbearia.

| Campo | Tipo | Obrigatório | Notas |
|---|---|---|---|
| `id` | `String @id @default(cuid())` | sim | |
| `barbershopId` | `String` | sim | |
| `name` | `String` | sim | |
| `description` | `String?` | não | |
| `durationMin` | `Int` | sim | |
| `priceCents` | `Int` | sim | **Sempre inteiro, nunca float** |
| `isActive` | `Boolean @default(true)` | sim | |
| `sortOrder` | `Int @default(0)` | sim | |
| `createdAt` / `updatedAt` | `DateTime` | sim | |

**Relations**: `barbershop` (N:1), `appointments` (1:N).
**Indexes**: `@@index([barbershopId, isActive])`.

#### `Barber`

Profissional que atende. **Não confundir com `Admin`** (um barbeiro pode ou não ter acesso ao painel).

| Campo | Tipo | Obrigatório | Notas |
|---|---|---|---|
| `id` | `String @id @default(cuid())` | sim | |
| `barbershopId` | `String` | sim | |
| `name` | `String` | sim | |
| `specialty` | `String?` | não | |
| `bio` | `String?` | não | |
| `imageUrl` | `String?` | não | |
| `isActive` | `Boolean @default(true)` | sim | |
| `sortOrder` | `Int @default(0)` | sim | |
| `createdAt` / `updatedAt` | `DateTime` | sim | |

**Relations**: `barbershop` (N:1), `appointments` (1:N), `hours` (1:N — horários específicos do barbeiro), `blocks` (1:N — bloqueios específicos).
**Indexes**: `@@index([barbershopId, isActive])`.

#### `BusinessHour`

Horário de funcionamento. Pode ser da barbearia toda (`barberId` null) ou de um barbeiro específico.

| Campo | Tipo | Obrigatório | Notas |
|---|---|---|---|
| `id` | `String @id @default(cuid())` | sim | |
| `barbershopId` | `String` | sim | |
| `barberId` | `String?` | não | Null = vale para toda a barbearia |
| `weekday` | `Int` | sim | 0 = domingo … 6 = sábado |
| `openMin` | `Int` | sim | Minutos desde meia-noite (540 = 09:00) |
| `closeMin` | `Int` | sim | |

**Relations**: `barbershop` (N:1), `barber` (N:1, cascade delete).

> **Discrepância**: o `SITE_CONFIG.hours` em `src/data/business.ts` usa strings `"09:00"` / `"20:00"`. O Prisma usa minutos desde meia-noite. **Conversão necessária** ao migrar.

#### `TimeBlock`

Bloqueio de agenda (almoço, folga, férias, feriado).

| Campo | Tipo | Obrigatório | Notas |
|---|---|---|---|
| `id` | `String @id @default(cuid())` | sim | |
| `barbershopId` | `String` | sim | |
| `barberId` | `String?` | não | Null = vale para toda a barbearia |
| `start` | `DateTime` | sim | |
| `end` | `DateTime` | sim | |
| `reason` | `String?` | não | "Almoço", "Folga", etc. |
| `createdAt` | `DateTime @default(now())` | sim | |

**Relations**: `barbershop` (N:1), `barber` (N:1, cascade delete).

#### `Appointment`

Agendamento. Liga `Client` + `Barber` (opcional) + `Service`.

| Campo | Tipo | Obrigatório | Notas |
|---|---|---|---|
| `id` | `String @id @default(cuid())` | sim | |
| `barbershopId` | `String` | sim | |
| `serviceId` | `String` | sim | |
| `barberId` | `String?` | não | Null = "qualquer barbeiro" |
| `anyBarber` | `Boolean @default(false)` | sim | True = atribuído na chegada |
| `clientId` | `String?` | não | Null = walk-in ou cliente deletado |
| `startAt` | `DateTime` | sim | |
| `endAt` | `DateTime` | sim | |
| `customerName` | `String` | sim | Snapshot denormalizado |
| `customerPhone` | `String` | sim | Snapshot denormalizado |
| `status` | `AppointmentStatus @default(PENDING)` | sim | Enum |
| `priceCents` | `Int` | sim | Snapshot do preço no momento do booking |
| `notes` | `String?` | não | |
| `createdAt` / `updatedAt` | `DateTime` | sim | |

**Relations**: `barbershop` (N:1, cascade), `service` (N:1, restrict delete), `barber` (N:1, set null on delete), `client` (N:1, set null on delete).
**Indexes**: `@@index([barbershopId, startAt])`, `@@index([barberId, startAt])`, `@@index([clientId, startAt])`, `@@index([status])`.

> **Faltando**: constraint unique em `(barbershopId, barberId, startAt)` para evitar double-booking. **Adicionar na Fase 2**.

#### `enum AppointmentStatus`

```prisma
enum AppointmentStatus {
  PENDING     // aguardando confirmação
  CONFIRMED   // confirmado
  COMPLETED   // concluído
  CANCELLED   // cancelado
  NO_SHOW     // cliente não apareceu
}
```

#### `Client`

Cliente final. **Não confundir com `Admin`**.

| Campo | Tipo | Obrigatório | Notas |
|---|---|---|---|
| `id` | `String @id @default(cuid())` | sim | |
| `barbershopId` | `String` | sim | |
| `name` | `String` | sim | |
| `phone` | `String` | sim | |
| `email` | `String?` | não | |
| `lastVisitAt` | `DateTime?` | não | Stats desnormalizada |
| `totalAppointments` | `Int @default(0)` | sim | Stats desnormalizada |
| `totalSpentCents` | `Int @default(0)` | sim | Stats desnormalizada |
| `preferredBarberId` | `String?` | não | Stats desnormalizada |
| `preferredServiceId` | `String?` | não | Stats desnormalizada |
| `notes` | `String?` | não | |
| `isActive` | `Boolean @default(true)` | sim | |
| `createdAt` / `updatedAt` | `DateTime` | sim | |

**Relations**: `barbershop` (N:1, cascade), `appointments` (1:N).
**Constraints**: `@@unique([barbershopId, phone])` — um cliente por telefone por barbearia.
**Indexes**: `@@index([barbershopId, isActive])`, `@@index([barbershopId, name])`.

#### `Testimonial`

Depoimento público.

| Campo | Tipo | Obrigatório | Notas |
|---|---|---|---|
| `id` | `String @id @default(cuid())` | sim | |
| `barbershopId` | `String` | sim | |
| `author` | `String` | sim | |
| `context` | `String?` | não | "Cliente há 2 anos" |
| `quote` | `String` | sim | |
| `rating` | `Int @db.SmallInt` | sim | 1-5 |
| `isPublic` | `Boolean @default(true)` | sim | |
| `createdAt` | `DateTime @default(now())` | sim | |

> **Nota**: `@db.SmallInt` é específico do PostgreSQL. **Não funciona em SQLite**. Será efetivo quando migrar de provider.

### Representação conceitual das relações

```
Barbershop (tenant root)
 │
 ├── Admin[]           (N:1)  — usuários do painel
 ├── Barber[]          (N:1)  — profissionais
 ├── Service[]         (N:1)  — catálogo
 ├── Client[]          (N:1)  — base de clientes
 ├── Appointment[]     (N:1)  — agendamentos
 ├── Testimonial[]     (N:1)  — depoimentos
 ├── BusinessHour[]    (N:1)  — horários (barbershop ou barber específico)
 └── TimeBlock[]       (N:1)  — bloqueios de agenda

Barber
 ├── Barbershop        (N:1)
 ├── Appointment[]     (N:1)  — agendamentos do barbeiro
 ├── BusinessHour[]    (N:1)  — horários específicos
 └── TimeBlock[]       (N:1)  — bloqueios específicos

Service
 ├── Barbershop        (N:1)
 └── Appointment[]     (N:1)  — agendamentos deste serviço

Client
 ├── Barbershop        (N:1)
 └── Appointment[]     (N:1)  — histórico do cliente

Appointment
 ├── Barbershop        (N:1, cascade)
 ├── Service           (N:1, restrict delete)
 ├── Barber?           (N:1, set null)
 └── Client?           (N:1, set null)
```

### Sobre SQLite vs PostgreSQL

**Status atual**: SQLite (`provider = "sqlite"`, `DATABASE_URL = file:/home/z/my-project/db/custom.db`).

**O que precisa mudar para PostgreSQL**:

1. Trocar `provider = "sqlite"` por `provider = "postgresql"` em `prisma/schema.prisma`.
2. Atualizar `.env`: `DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"`.
3. Rodar `npx prisma db push` (ou `npx prisma migrate dev` para criar migration).
4. O campo `rating Int @db.SmallInt` em `Testimonial` já está pronto para Postgres (não funcionava em SQLite).
5. **Considerar** adicionar constraint unique em `Appointment(barbershopId, barberId, startAt)` para evitar double-booking.
6. **Considerar** trocar enums (`AdminRole`, `AppointmentStatus`) por lookup tables se quiser auditar mudanças — mas enums são mais simples e performáticos.

**O Prisma Client singleton** (`src/lib/db.ts`) já está pronto e não precisa mudar. **Mas não é importado em nenhum arquivo de produto** hoje.

---

## 11. Multi-Tenancy

### Status: PREPARADO no schema, NÃO IMPLEMENTADO em runtime.

### O que já está preparado

1. **Todos os models de domínio** (`Service`, `Barber`, `Client`, `Appointment`, `Testimonial`, `BusinessHour`, `TimeBlock`) têm `barbershopId: String` como campo obrigatório + relação N:1 com `Barbershop`.
2. **`Admin`** tem `barbershopId?` (opcional, para SUPER_ADMIN global).
3. **`Barbershop`** tem `slug @unique` para futura resolução por subdomínio ou path.
4. **`MOCK_ADMIN_USER`** e **`MOCK_APPOINTMENTS`** já usam `barbershopId: "barbershop-1"` hardcoded.
5. **Tipos TS** (`AdminUser`, `Appointment`, `Client`) incluem `barbershopId`.

### O que NÃO está implementado

1. **Middleware**: não há `src/middleware.ts` que extraia `barbershopId` do subdomínio/path/JWT.
2. **Resolver tenant**: nenhuma query filtra por `barbershopId` (porque não há queries ainda).
3. **Onboarding de barbearia**: não há fluxo de signup que crie um novo `Barbershop`.
4. **Isolamento**: como tudo é mock e o `barbershopId` é hardcoded, qualquer usuário vê os mesmos dados.
5. **Domínio próprio**: não há suporte a `minhabarbearia.barberhouse.com` ou `barberhouse.com/minhabarbearia`.

### Como evoluir para multi-tenancy real

1. **Fase 8 do roadmap**.
2. **Estratégia recomendada**: subdomínio (`{slug}.barberhouse.com`).
3. **Implementação**:
   - Criar `src/middleware.ts` que extrai `slug` do `Host` header e injeta em header/cookie.
   - Criar helper `getCurrentBarbershopId()` server-side.
   - Todas as queries Prisma: `where: { barbershopId: getCurrentBarbershopId() }`.
   - Todas as Server Actions: validar `barbershopId` no body contra o do JWT/session.
4. **Auth**: o `Admin.barbershopId` deve bater com o `barbershopId` do tenant resolvido pelo middleware. SUPER_ADMIN bypass.
5. **Seed**: criar um `Barbershop` default com slug `barberhouse` e os dados atuais do `SITE_CONFIG`.

> **NÃO chamar o produto de "multi-tenant"** enquanto o middleware não existir. Hoje é single-tenant com `barbershopId` preparado no schema.

---

## 12. Admin

Painel administrativo completo. Todas as rotas sob `/admin/*`.

### 12.1 `/admin` (redirect)

- **Arquivo**: `src/app/admin/page.tsx`.
- **Comportamento**: `redirect("/admin/dashboard")` server-side.

### 12.2 `/admin/login`

Ver seção [5. Rotas → `/admin/login`](#get-adminlogin).

### 12.3 Layout do painel — `(panel)` route group

- **Arquivo**: `src/app/admin/(panel)/layout.tsx` (Client Component).
- **Auth guard**: client-side. Se `useAdminAuthStore.user` é null, redireciona para `/admin/login` via `router.replace()`. Mostra spinner enquanto redireciona.
- **Shell**: renderiza `<AdminShell>` com sidebar fixa (desktop) + drawer (mobile) + header sticky.

### 12.4 `/admin/dashboard`

- **Arquivo**: `src/app/admin/(panel)/dashboard/page.tsx` (Server Component).
- **Componentes**: `PageHeader`, `DashboardStats` (KPI cards), `UpcomingAppointments` (lista), `BarberSummary` (ranking com barras).
- **Dados**: `getDashboardStats()`.
- **Saudação**: dinâmica por horário ("Bom dia/tarde/noite, Administrador").
- **Mobile**: KPIs em grid 2 cols, listas empilhadas, barber summary abaixo.
- **Limitações**: sem gráficos. Sem seletor de período (sempre "hoje").

### 12.5 `/admin/appointments`

- **Arquivo**: `src/app/admin/(panel)/appointments/page.tsx` (Client Component).
- **Filtros**: data (input date, default hoje), barbeiro (select), status (select). Cada mudança re-filtra via `useMemo`.
- **Layout**: 
  - Desktop (≥ 768px): tabela 6 colunas (Horário, Cliente, Serviço, Barbeiro, Status, Valor).
  - Mobile: cards empilhados com layout compacto.
- **Estados**: empty state quando sem resultados.
- **Limitações**: 
  - **Somente leitura** — não há ações (confirmar, cancelar, marcar concluído/no-show).
  - Sem paginação (mostra todos os filtros aplicados; aceitável porque o mock é pequeno).
  - Sem exportar.

### 12.6 `/admin/clients` e `/admin/clients/[id]`

Ver seções [5. Rotas](#get-adminclients) e [13. Clientes](#13-clientes).

### 12.7 `/admin/barbers`

- **Arquivo**: `src/app/admin/(panel)/barbers/page.tsx` (Client Component).
- **UI**: grid de cards com foto + nome + especialidade + bio + botões Editar / Toggle status.
- **Dialog**: formulário com nome, especialidade, bio, URL da foto, checkboxes de serviços oferecidos.
- **Estado**: local. `setBarbers` atualiza array em memória.
- **Ações**: 
  - Adicionar: abre dialog vazio, on save adiciona ao array.
  - Editar: abre dialog preenchido, on save substitui no array.
  - Toggle status: **placeholder** — `handleToggleActive` é no-op (só re-spread o mesmo objeto).
- **Limitações**:
  - **Não persiste** — reload volta ao `BARBERS` do mock.
  - Checkbox de serviços é coletado mas não enviado no save.
  - Não há confirmação antes de deletar (na verdade não há delete).
  - Não há upload de imagem.

### 12.8 `/admin/services`

- **Arquivo**: `src/app/admin/(panel)/services/page.tsx` (Client Component).
- **UI**: grid de cards com nome + preço + duração + status + botão Editar.
- **Dialog**: formulário com nome, descrição, duração (min), preço (R$).
- **Estado**: local. `setServices` atualiza array em memória.
- **Ações**: adicionar + editar. Sem delete. Sem toggle de ativo.
- **Limitações**: **Não persiste**.

### 12.9 `/admin/settings`

- **Arquivo**: `src/app/admin/(panel)/settings/page.tsx` (Client Component).
- **Tabs**: Barbearia / Horários / Agendamento / WhatsApp.
- **Estado**: local (`settings` objeto). Botão "Salvar alterações" em cada tab mostra toast mas **não persiste**.
- **Limitações**:
  - Tab WhatsApp tem botão "Conectar" desabilitado (placeholder para API futura).
  - Tab Horários inclui domingo como desabilitado por padrão.

### O que é apenas UI nesta versão

Todas as telas admin são **visualmente funcionais** mas **sem persistência**:

- ❌ Adicionar/editar barbeiro → só atualiza estado React local.
- ❌ Adicionar/editar serviço → só atualiza estado React local.
- ❌ Salvar configurações → só mostra toast.
- ❌ Login → aceita qualquer credencial.
- ❌ Logout → só limpa localStorage (não invalida sessão server-side porque não há).
- ❌ Confirmar/cancelar agendamento → não há botão de ação.
- ❌ Criar/editar cliente → não há (clientes são implícitos via agendamento).

---

## 13. Clientes

### Listagem — `/admin/clients`

Ver seção [5. Rotas → `/admin/clients`](#get-adminclients).

**Dados mostrados na tabela desktop**:
- Nome
- WhatsApp (formatado)
- Último atendimento (dd/mm/aaaa)
- Total de atendimentos (número)
- Status (Ativo/Inativo com ícone)

**Busca**: por nome (case-insensitive) ou telefone (normaliza dígitos, busca contains).

**Filtro**: Todos / Ativos / Inativos.

### Detalhe — `/admin/clients/[id]`

Server Component com `generateStaticParams` (pre-renderiza os 10 clientes mock) e `generateMetadata` (title = nome do cliente).

**Seções**:
1. **Card de contato**: WhatsApp, e-mail (se houver), cliente desde, observações, serviço preferido.
2. **Grid de stats** (4 cards): último atendimento, total de atendimentos, total gasto, barbeiro preferido.
3. **Histórico**: tabela (desktop) / cards (mobile) com todos os agendamentos do cliente, ordenados por data desc. Cada linha: data, serviço, barbeiro, status, valor.

### Relacionamento com appointments

No schema Prisma: `Client 1:N Appointment` com `onDelete: SetNull` (se o cliente for deletado, o appointment mantém os snapshots `customerName` e `customerPhone`).

No mock: `MOCK_APPOINTMENTS` referenciam `clientId` dos `MOCK_CLIENTS`. `getAppointmentsByClient(clientId)` filtra e ordena.

### Dados armazenados (no schema futuro)

| Campo | Origem | Como manter atualizado |
|---|---|---|
| `name`, `phone`, `email`, `notes` | Input direto | Update manual do admin ou no momento do agendamento |
| `isActive` | Default `true` | Toggle manual (não implementado) ou automático após X dias sem visita |
| `lastVisitAt` | Denormalizado | Atualizar quando um appointment virar `COMPLETED` |
| `totalAppointments` | Denormalizado | Incrementar quando criar appointment, decrementar quando cancelar |
| `totalSpentCents` | Denormalizado | Somar quando `COMPLETED`, subtrair se `CANCELLED`/`NO_SHOW` |
| `preferredBarberId` | Denormalizado | Recalcular via query (barbeiro com mais appointments) |
| `preferredServiceId` | Denormalizado | Recalcular via query |

### Como criar/atualizar cliente quando o banco estiver implementado

**No fluxo de agendamento público** (`POST /api/appointments`):

```typescript
// 1. Upsert por (barbershopId, phone normalizado)
const client = await db.client.upsert({
  where: { barbershopId_phone: { barbershopId, phone: normalizePhone(phone) } },
  create: { barbershopId, name, phone: normalizePhone(phone), email: null },
  update: { name }, // atualiza o nome se mudou
});

// 2. Criar o appointment com clientId
const appointment = await db.appointment.create({
  data: { ..., clientId: client.id, customerName: client.name, customerPhone: client.phone },
});

// 3. Atualizar stats do client (em transaction)
await db.client.update({
  where: { id: client.id },
  data: {
    totalAppointments: { increment: 1 },
    // lastVisitAt, totalSpentCents, preferredBarberId só atualizar quando status virar COMPLETED
  },
});
```

### Funcionalidades futuras planejadas

- Histórico completo (já implementado visualmente).
- Total gasto (já no schema e na UI).
- Última visita (já no schema e na UI).
- Barbeiro preferido (já no schema e na UI).
- Serviço mais utilizado (já no schema, mostrado na UI).
- Cliente ativo/inativo (já no schema, **sem toggle na UI**).
- Reativação de clientes inativos (não implementado).
- Busca avançada (por data da última visita, total gasto, etc.) — não implementado.
- Exportar clientes para CSV — não implementado.

---

## 14. Barbeiros

### Conceito: `Barber` vs `User` (Admin)

**São conceitos diferentes** e **não devem ser misturados**:

| | `Barber` | `Admin` (User) |
|---|---|---|
| **O que é** | Profissional que atende clientes | Pessoa com acesso ao painel |
| **Acesso ao painel** | Não (por default) | Sim |
| **Aparece no site público** | Sim (seção Barbeiros + fluxo de agendamento) | Não |
| **Pode ter agendamentos** | Sim (1:N) | Não |
| **Model Prisma** | `Barber` | `Admin` |
| **Tipo TS** | `Barber` em `src/types/index.ts` | `AdminUser` em `src/types/admin.ts` |
| **ID field** | `barbershopId` (obrigatório) | `barbershopId` (opcional, para SUPER_ADMIN) |

**Por que separar?**
- Nem todo barbeiro deve ter acesso ao painel (pode ser apenas um profissional que atende).
- Nem todo usuário do painel é um barbeiro (o dono/gerente não atende).
- No futuro, um `Barber` pode ser **ligado** a um `Admin` via campo `adminId` (não existe hoje) para dar acesso ao painel com role `BARBER`.

### Listagem — `/admin/barbers`

Grid de cards com foto + nome + especialidade + bio + botões.

### Cadastro / edição

Via dialog com campos:
- Nome (obrigatório)
- Especialidade (obrigatório)
- Descrição (opcional)
- URL da foto (opcional — se vazia, mostra avatar com iniciais)
- Serviços oferecidos (checkboxes — coletado mas **não persistido** ainda)

### Ativação / desativação

- **UI**: botão com ícone `UserCheck` em cada card.
- **Implementação atual**: `handleToggleActive` é **no-op** (só re-spread o mesmo objeto).
- **Schema Prisma**: `Barber.isActive: Boolean @default(true)`.
- **Para implementar real**: 
  ```typescript
  await db.barber.update({ where: { id }, data: { isActive: !isActive } });
  ```
  E ocultar barbeiros inativos do site público (`where: { isActive: true }`).

### Imagem

- **Atual**: campo URL no formulário. Sem upload.
- **Futuro**: integrar com storage (S3, Vercel Blob, etc.) quando necessário.

### Disponibilidade

- **Schema Prisma**: `Barber 1:N BusinessHour` (horários específicos) + `Barber 1:N TimeBlock` (bloqueios).
- **Implementação atual**: **não usada**. A disponibilidade do fluxo de agendamento usa apenas `SITE_CONFIG.hours` (horários da barbearia, não por barbeiro).
- **Para implementar real**: `getTimeSlots()` deve considerar `BusinessHour` do barbeiro específico + `TimeBlock` do barbeiro + appointments existentes.

### Relacionamento com appointments

- `Barber 1:N Appointment` com `onDelete: SetNull`.
- Se um barbeiro for deletado, os appointments dele ficam com `barberId: null` (mas mantêm `barberName` se houvesse snapshot — **não há no schema atual**, considere adicionar).
- `Barber.isActive: false` deve ocultar o barbeiro do fluxo de agendamento público, mas manter o histórico.

---

## 15. Serviços

### Listagem — `/admin/services`

Grid de cards com nome + preço (Bebas Neue gold) + duração + status "Ativo" + botão Editar.

### Cadastro / edição

Via dialog com campos:
- Nome (obrigatório)
- Descrição (opcional)
- Duração em minutos (obrigatório, min 5, step 5)
- Preço em R$ (obrigatório, input decimal — aceita vírgula)

### Status ativo/inativo

- **UI**: todos os cards mostram "Ativo". Não há toggle real.
- **Schema Prisma**: `Service.isActive: Boolean @default(true)`.
- **Para implementar**: adicionar Switch no card + `db.service.update({ data: { isActive } })`.

### Relacionamento com agendamento

- `Service 1:N Appointment` com `onDelete: Restrict` (não pode deletar serviço que tem appointments).
- `Appointment.priceCents` é **snapshot** do `Service.priceCents` no momento do booking — se o preço do serviço mudar depois, o appointment mantém o preço original.

### Relação com barbeiros

- **Schema atual**: **não há relação direta** entre `Barber` e `Service`.
- **UI atual**: o dialog de barbeiro tem checkboxes de serviços oferecidos, mas **não persiste**.
- **Para implementar real**: criar tabela de junção `BarberService { barberId, serviceId }` (N:N) ou campo `serviceIds String[]` no `Barber` (Postgres array). Filtrar serviços disponíveis no fluxo de agendamento conforme o barbeiro selecionado.

### Como funciona no banco

```sql
-- Criar serviço
INSERT INTO "Service" (id, barbershopId, name, description, durationMin, priceCents, isActive, sortOrder, createdAt, updatedAt)
VALUES (cuid(), 'barbershop-1', 'Corte', '...', 30, 4000, true, 0, now(), now());

-- Listar serviços ativos
SELECT * FROM "Service" WHERE barbershopId = ? AND isActive = true ORDER BY sortOrder ASC;
```

---

## 16. Autenticação

```
AUTHENTICATION STATUS:
MOCK / NOT IMPLEMENTED
```

### O que existe

- **`src/lib/admin-auth-store.ts`**: Zustand store persistido em `localStorage` key `barber-house-admin-auth`.
- **`src/data/admin/users.ts`**: `MOCK_ADMIN_USER` hardcoded.
- **`src/app/admin/login/page.tsx`**: formulário visual que chama `login(email, password)`.
- **`src/app/admin/(panel)/layout.tsx`**: auth guard client-side que redireciona para `/admin/login` se `user` é null.

### O que NÃO existe

- ❌ NextAuth **instalado mas não configurado** (`next-auth` está no `package.json` mas **não é importado em nenhum arquivo**).
- ❌ Sessão server-side.
- ❌ Middleware de autenticação.
- ❌ Hash de senha (o campo `passwordHash` existe no schema Prisma mas nada lê ou escreve nele).
- ❌ JWT/cookies httpOnly.
- ❌ Logout server-side (o logout atual só limpa localStorage).
- ❌ Recuperação de senha.
- ❌ Confirmação de e-mail.
- ❌ 2FA.
- ❌ OAuth (Google, etc.).

### Próximos passos para implementar NextAuth

1. Criar `src/app/api/auth/[...nextauth]/route.ts` com `NextAuth({ providers: [Credentials({ ... })], ... })`.
2. Em `authorize`, fazer `db.admin.findUnique({ where: { email } })` e comparar `bcrypt.compare(password, admin.passwordHash)`.
3. No `jwt` callback, incluir `id`, `role`, `barbershopId` no token.
4. No `session` callback, expor esses campos em `session.user`.
5. Criar `src/middleware.ts` para proteger `/admin/*` (menos `/admin/login`) server-side.
6. Substituir `useAdminAuthStore` por `useSession()` do `next-auth/react`.
7. Substituir `PanelLayout` auth guard por middleware.
8. **Remover** `src/lib/admin-auth-store.ts` e `src/data/admin/users.ts` quando NextAuth estiver 100% funcional.

### Proteção de rotas

- **Atual**: client-side apenas. `PanelLayout` lê `useAdminAuthStore.user` e redireciona se null. **Vulnerável**: o HTML server-rendered do painel é enviado ao browser antes do redirect, então dados podem ser vistos via "View Source". Não é problema hoje porque tudo é mock, mas **será problema crítico** com dados reais.
- **Alvo**: middleware NextAuth que bloqueia `/admin/*` no server antes de renderizar qualquer coisa.

### Sessões

- **Atual**: localStorage sem expiração.
- **Alvo**: cookie httpOnly + JWT com expiração (default 30 dias no NextAuth).

### Logout

- **Atual**: `useAdminAuthStore.logout()` limpa o localStorage. O botão "Sair" no `AdminHeader` faz `<Link href="/admin/login" onClick={logout}>`.
- **Alvo**: `signOut()` do NextAuth, que invalida o cookie server-side.

### Segurança

- **CRÍTICO**: auth mock aceita qualquer credencial.
- **CRÍTICO**: sem isolamento server-side.
- Ver seção [29. Segurança](#29-segurança) para auditoria completa.

---

## 17. Roles e Permissões

### Status: PREPARADO no schema e nos tipos, NÃO IMPLEMENTADO em runtime.

### Roles planejadas

#### `ADMIN` (Prisma: `OWNER` / `MANAGER`)

**Permissões esperadas**:
- Ver tudo da barbearia.
- Gerenciar clientes (criar, editar, desativar).
- Gerenciar barbeiros (CRUD completo).
- Gerenciar serviços (CRUD completo).
- Gerenciar horários de funcionamento.
- Gerenciar configurações da barbearia.
- Ver todos os agendamentos.
- Alterar status de qualquer agendamento.
- Ver relatórios.

#### `BARBER` (Prisma: `BARBER`)

**Permissões esperadas**:
- Ver sua própria agenda.
- Ver seus próprios atendimentos.
- Ver seus próprios clientes (apenas os que ele atendeu).
- Atualizar status dos seus atendimentos (CONFIRMED → COMPLETED, NO_SHOW, etc.).
- **Não** pode gerenciar outros barbeiros.
- **Não** pode gerenciar serviços.
- **Não** pode ver configurações da barbearia.
- **Não** pode ver faturamento total.

### Discrepância entre tipos TS e enum Prisma

| Tipo TS (`src/types/admin.ts`) | Enum Prisma (`schema.prisma`) |
|---|---|
| `"ADMIN" \| "BARBER"` | `SUPER_ADMIN \| OWNER \| MANAGER \| BARBER` |

**Recomendação**: alinhar na Fase 4 (RBAC). Sugestão: usar o enum Prisma como source of truth e atualizar o tipo TS.

### O que já está preparado

- Campo `role` no schema Prisma (`AdminRole` enum).
- Campo `role` no tipo TS `AdminUser`.
- `MOCK_ADMIN_USER.role = "ADMIN"`.
- `AdminHeader` mostra "Administrador" ou "Barbeiro" conforme a role.

### O que NÃO está implementado

- ❌ Qualquer verificação de role em qualquer rota.
- ❌ Painel do barbeiro (rotas `/admin/my-agenda`, `/admin/my-clients`, etc.).
- ❌ Botões de ação differentes por role.
- ❌ Filtros de query por barbeiro logado.

---

## 18. Design System

### Identidade visual

Premium barbearia moderna: masculino, urbano, artesanal, escuro, com dourado antigo como destaque.

### Cores

Definidas em `src/app/globals.css` usando OKLCH. **Dark-first** — não há light theme.

| Token | Valor OKLCH | Hex aproximado | Uso |
|---|---|---|---|
| `--background` | `oklch(0.16 0.004 60)` | `#0c0a09` | Charcoal quente — fundo principal |
| `--foreground` | `oklch(0.96 0.012 75)` | `#f5f0e8` | Off-white quente — texto principal |
| `--card` | `oklch(0.21 0.005 60)` | `#1a1614` | Um tom acima do bg — cards |
| `--popover` | `oklch(0.19 0.005 60)` | `#161310` | Dropdowns, popovers |
| `--primary` | `oklch(0.78 0.13 75)` | `#c9a227` | Dourado antigo — CTAs, destaques |
| `--primary-foreground` | `oklch(0.16 0.004 60)` | `#0c0a09` | Texto sobre primary |
| `--secondary` | `oklch(0.26 0.006 60)` | `#241f1c` | Superfícies secundárias |
| `--muted` | `oklch(0.24 0.005 60)` | `#221e1b` | Backgrounds muted |
| `--muted-foreground` | `oklch(0.66 0.012 70)` | `#8a7f72` | Texto secundário |
| `--accent` | `oklch(0.78 0.13 75)` | `#c9a227` | Igual ao primary |
| `--destructive` | `oklch(0.6 0.18 25)` | `#a83a3a` | Erros, cancelamentos |
| `--border` | `oklch(0.30 0.006 60)` | `#2e2823` | Bordas |
| `--input` | `oklch(0.26 0.006 60)` | `#241f1c` | Background de inputs |
| `--ring` | `oklch(0.78 0.13 75)` | `#c9a227` | Focus ring |

**Cores semânticas adicionais** (usadas via classes Tailwind diretas em `StatusBadge.tsx`):
- Amber (PENDING): `amber-500/30`, `amber-500/10`, `amber-400`
- Emerald (CONFIRMED): `emerald-500/30`, `emerald-500/10`, `emerald-400`
- Orange (NO_SHOW): `orange-500/30`, `orange-500/10`, `orange-400`

### Tipografia

3 fontes carregadas via `next/font/google` em `src/app/layout.tsx`:

| Fonte | Variável CSS | Uso |
|---|---|---|
| **Bebas Neue** | `--font-bebas` | Títulos display (H1, H2 de seção, números grandes, "BARBER HOUSE"). Condensada, uppercase, alta legibilidade. Aplicada via classe `.font-display`. |
| **Inter** | `--font-inter` | Corpo de texto, UI, labels, inputs. Aplicada via `--font-sans` (default do Tailwind). |
| **Playfair Display** | `--font-playfair` | Itálicos editoriais (ex: subtítulo do hero "Seu estilo começa na cadeira."). Aplicada via classe `.font-serif`. |

### Componentes

#### shadcn/ui (40+ em `src/components/ui/`)

Pré-instalados. Principais em uso:

- `Button` — 6 variants (default, outline, ghost, secondary, destructive, link), 4 sizes.
- `Input` — com foco-ring dourado.
- `Label` — Radix Label.
- `Textarea` — multiline.
- `Select` — Radix Select (filtros admin).
- `Dialog` — Radix Dialog (forms de barbeiro/serviço).
- `Sheet` — Radix Dialog side-left (drawer mobile admin).
- `Tabs` — Radix Tabs (settings).
- `Switch` — Radix Switch (toggles em settings).
- `Checkbox` — Radix Checkbox (serviços oferecidos).
- `Avatar` + `AvatarFallback` — perfil no header admin.
- `Card` + `CardContent` + `CardHeader` + `CardTitle` — card de contato no detalhe do cliente.
- `Toaster` + `Toast` — notificações (toast de "salvar configurações").

#### Componentes customizados

- `SectionHeading` — "01 / Serviços" com eyebrow dourado.
- `ServiceCard` / `BarberCard` / `TestimonialCard` — cards do site público.
- `BookingStepper` — 6 etapas (horizontal desktop, compacto mobile).
- `StepNavigation` — botões Voltar/Continuar.
- `BookingSummary` / `BookingConfirmation` — resumo + tela de sucesso.
- `AdminShell` / `AdminSidebar` / `AdminHeader` — layout admin.
- `DashboardStats` / `UpcomingAppointments` / `BarberSummary` — dashboard.
- `StatusBadge` — badge com 5 variantes de status de agendamento.
- `PageHeader` — cabeçalho reutilizável admin.
- `EmptyState` — estado vazio reutilizável admin.

### Classes utilitárias customizadas (em `globals.css`)

| Classe | Para que |
|---|---|
| `.font-display` | Aplica Bebas Neue + letter-spacing 0.02em |
| `.font-serif` | Aplica Playfair Display |
| `.container-section` | `mx-auto w-full max-w-6xl px-5 sm:px-8` — container do site público |
| `.eyebrow` | Bebas Neue uppercase tracking-[0.25em] text-muted-foreground — "HOJE", "PRÓXIMOS AGENDAMENTOS" |
| `.hairline-gold` | Divisor 1px com gradiente dourado transparente→gold→transparente |
| `.focus-ring` | `outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring` |
| `.animate-fade-in-up` | Animação 0.5s fade + translateY 12px |
| `.animate-fade-in` | Animação 0.4s fade |
| `.step-enter` | Animação 0.35s fade-up para transições entre etapas do agendamento |

### Princípios

- **Dark-first**: não há light theme. `:root` define o tema dark. A regra `@custom-variant dark` existe mas não é usada.
- **Sem gradientes** (exceção: scrim do hero e `hairline-gold` que é um gradiente sutil).
- **Sombras discretas**: `shadow-xs` e `shadow-sm` apenas. Sem `shadow-lg`+.
- **Animações sutis**: fade-in-up (0.5s), fade-in (0.4s), hover transitions (0.2s). Nada de bounce, parallax, ou animação contínua.
- **Hierarquia visual**: títulos Bebas Neue (display), corpo Inter, ênfases Playfair itálico. Tamanhos escalonados 6xl→8xl para hero.
- **Touch targets**: botões 44-48px de altura (`h-10` a `h-12`), áreas de toque adequadas.
- **Tipografia tabular**: números em `tabular-nums` para alinhamento em tabelas.

---

## 19. Responsividade

### Breakpoints (Tailwind 4 defaults)

| Prefixo | Min-width | Uso no projeto |
|---|---|---|
| (default) | 0px | Mobile-first base |
| `sm:` | 640px | Phones grandes, tablets pequenos |
| `md:` | 768px | Tablets (quebra do menu mobile, tabela admin aparece) |
| `lg:` | 1024px | Desktop pequeno (grids 3-4 cols) |
| `xl:` | 1280px | Desktop (não usado explicitamente) |

### Comportamento por viewport

#### Mobile (375px - 767px)

- **Header público**: logo + CTA "Agendar" + hambúrguer. Menu abre dropdown full-width.
- **Home**: todas as seções em 1 coluna. Hero com fonte 6xl. Gallery 2 cols.
- **Agendamento**: stepper compacto ("Etapa 1 de 6" + barra de progresso). Seletores em 1-2 cols. Auto-advance ao selecionar.
- **Admin**: sidebar vira drawer (Sheet). Tabelas viram cards empilhados. KPIs em 2 cols.
- **Filtros admin**: empilhados verticalmente.

#### Tablet (768px - 1023px)

- **Header público**: nav horizontal completo + CTA.
- **Home**: services 2 cols, barbers 2 cols, gallery 4 cols.
- **Agendamento**: stepper horizontal com labels.
- **Admin**: sidebar fixa visível. Tabelas aparecem. KPIs 4 cols.

#### Desktop (1024px+)

- **Home**: services 4 cols, barbers 3 cols, gallery 4 cols com primeira imagem 2x2.
- **Admin**: sidebar 256px fixa + content max-w-6xl.
- **Forms admin**: dialog max-w-lg.

### Componentes especiais para mobile

| Componente | Adaptação mobile |
|---|---|
| `Header` (público) | Menu hambúrguer com dropdown |
| `BookingStepper` | Versão compacta com barra de progresso |
| `DateSelector` | Carousel horizontal com scroll (sem setas), skeleton durante SSR |
| `TimeSelector` | Grid 3 cols (vs 4-5 no desktop) |
| `AdminShell` | Sidebar vira Sheet (drawer) via `@radix-ui/react-dialog` |
| `AdminHeader` | Botão hambúrguer + label "Ver site" escondido (só ícone) |
| Tabelas admin | Viram `<ul>` de cards via classes `hidden md:block` / `md:hidden` |

### Pontos que ainda precisam de teste manual

- **320px** (iPhone SE 1st gen): não testado explicitamente. Pode haver overflow em alguma tabela residual.
- **414px / 430px** (iPhone Plus/Pro Max): não testados. Deve funcionar dado o padrão 375px.
- **Landscape em mobile**: não testado. Pode haver problemas com altura do hero (88vh).
- **Tablet landscape** (1024px): não testado. Deve funcionar dado o padrão desktop.
- **Foldables**: não testados.

### Armadilhas conhecidas

- `DateSelector` usa `useIsClient()` para evitar hydration mismatch. Se o JS estiver desabilitado, o usuário vê skeleton permanente.
- Tabelas admin usam `hidden md:block` e `md:hidden` para alternar entre tabela e cards. **Há duplicação de markup** — manter em sync ao editar.
- `AdminShell` usa `md:pl-64` para compensar a sidebar fixa de 256px (w-64). Se mudar a largura da sidebar, atualizar o `pl-`.

---

## 20. Acessibilidade

### Semântica HTML

- `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`, `<aside>` usados corretamente.
- `<h1>` uma vez por página (hero da home, "Agendamento" em /agendar, "Dashboard"/"Agendamentos"/etc. no admin).
- `<h2>` para seções dentro de cada página.
- `<dl>`, `<dt>`, `<dd>` usados em `BookingSummary` e `BookingConfirmation` (resumo de dados).
- `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` nas tabelas admin.

### Labels e ARIA

- Todos os inputs têm `<Label htmlFor>` associado.
- `aria-label` em botões de ícone-only (ex: "Abrir menu", "Sair", "Alternar status").
- `aria-expanded`, `aria-controls` no botão de menu mobile.
- `aria-current="page"` no link ativo da sidebar admin.
- `aria-current="step"` na etapa atual do `BookingStepper`.
- `role="radiogroup"` + `role="radio"` + `aria-checked` em `DateSelector` e `TimeSelector`.
- `aria-pressed` no botão "Qualquer barbeiro" e em toggles.
- `aria-invalid` + `aria-describedby` em inputs com erro no `CustomerForm`.
- `aria-labelledby` em seções com heading.
- `sr-only` em `SheetTitle` do drawer admin e no heading "Rodapé" do footer.

### Keyboard navigation

- Todos os interativos são focusable por padrão (button, a, input, select, textarea).
- `focus-ring` classe aplicada em elementos customizados (links, botões de seleção).
- `Tab` navegação na ordem visual.
- `Enter` / `Space` ativam botões.
- `Esc` fecha Dialog e Sheet (default do Radix).
- **Não implementado**: trap de foco em dialogs além do default do Radix (que já é bom).

### Focus

- `outline-none` + `focus-visible:ring-2` + `focus-visible:ring-ring` em todos os interativos.
- `ring-offset-2` + `ring-offset-background` para garantir visibilidade no dark theme.
- **Pendência**: alguns botões de seleção (ServiceCard, BarberCard) usam `focus-ring` mas o ring pode ser sutil demais. Testar com leitor de tela.

### Contraste

- Texto principal (`foreground` em `background`): ~15:1 (WCAG AAA).
- Texto muted (`muted-foreground` em `background`): ~5:1 (WCAG AA).
- Texto muted em `card`: ~4.5:1 (WCAG AA).
- Dourado (`primary`) em `background`: ~7:1 (WCAG AAA).
- **Pendência**: `StatusBadge` NO_SHOW (orange-400 em orange-500/10) pode estar abaixo de AA. Verificar.

### Touch targets

- Botões: `h-9` (36px) a `h-12` (48px). Alguns `size-icon` são `size-9` (36px) — abaixo do recomendado 44px da Apple, mas dentro do 24px da WCAG.
- Links na nav: padding `py-2.5` (10px) — área total ~36px.
- **Pendência**: botões `size-icon` no admin (Editar, Toggle) têm 36px. Considerar aumentar para 44px em mobile.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Desativa todas as animações e scroll suave para usuários que pedem reduced motion no SO.

### Pendências de acessibilidade

- ❌ Não há testes automatizados (axe, jest-axe) no projeto.
- ❌ Skip link "Pular para o conteúdo" não implementado.
- ❌ Live regions para toasts não marcadas (usam `role="status"` default do Radix).
- ❌ Breadcrumbs não usados (não há hierarquia profunda, mas poderia ajudar no admin).
- ❌ Lang attribute dinâmico para partes em outro idioma (não há, mas vale registrar).

---

## 21. SEO

### Metadata global (`src/app/layout.tsx`)

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://barberhouse.example.com"),
  title: {
    default: "BARBER HOUSE — Barbearia premium em São Paulo",
    template: "%s · BARBER HOUSE",
  },
  description: "Barbearia premium em São Paulo. Cortes masculinos, barba...",
  keywords: ["barbearia", "barbearia premium", "barbearia São Paulo", "barbearia perto de mim", "corte masculino", "barba", "corte e barba", "agendamento barbearia", "BARBER HOUSE"],
  authors: [{ name: "BARBER HOUSE" }],
  creator: "BARBER HOUSE",
  publisher: "BARBER HOUSE",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "BARBER HOUSE",
    title: "BARBER HOUSE — Seu estilo começa na cadeira.",
    description: "...",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "BARBER HOUSE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "...",
    description: "...",
    images: ["/og.svg"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "beauty",
};

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};
```

### Metadata por rota

| Rota | Metadata |
|---|---|
| `/` (layout) | Default global |
| `/agendar` (layout) | `title: "Agendar horário"`, `description` específica, `canonical: /agendar` |
| `/admin` (layout) | `title: { default: "Admin · BARBER HOUSE", template: "%s · Admin" }`, **`robots: { index: false, follow: false }`** |
| `/admin/dashboard` | `title: "Dashboard"` (vira "Dashboard · Admin") |
| `/admin/clients/[id]` | `title: {client.name}` via `generateMetadata` |

### Sitemap

- **Arquivo**: `src/app/sitemap.ts`.
- **URLs**: `/` (priority 1, weekly) + `/agendar` (priority 0.9, monthly).
- **Disponível em**: `/sitemap.xml` (gerado por Next.js).
- **URL base**: `https://barberhouse.example.com` (hardcoded — **trocar pelo domínio real em produção**).

### Robots

- **Arquivo**: `public/robots.txt`.
- **Conteúdo**:
  ```
  User-agent: *
  Allow: /
  Disallow: /admin
  Disallow: /api

  Sitemap: https://barberhouse.example.com/sitemap.xml
  ```

### Estrutura semântica

- `<html lang="pt-BR">` no root.
- Uma `<h1>` por página.
- Headings hierárquicos (h1 → h2 → h3).
- `<main>` envolvendo conteúdo principal.
- `<nav>` com `aria-label` para navegações.
- `<section>` com `aria-labelledby` para seções da home.

### URLs

- URLs amigáveis: `/`, `/agendar`, `/admin/dashboard`, `/admin/clients`, `/admin/clients/{id}`.
- **Pendência**: IDs de cliente são `c-1`, `c-2`, etc. (mock). Em produção serão `cuid()` que não são amigáveis. Considerar manter assim (admin-only) ou adicionar slug.

### O que já está pronto

- ✅ Title + description + keywords.
- ✅ Open Graph + Twitter Card.
- ✅ Favicon SVG.
- ✅ OG image SVG.
- ✅ Sitemap.xml dinâmico.
- ✅ Robots.txt.
- ✅ Canonical URLs.
- ✅ `noindex` no admin.
- ✅ `lang="pt-BR"`.
- ✅ Theme color.
- ✅ Estrutura semântica.

### O que pode ser melhorado

- ❌ **Schema.org JSON-LD** para `LocalBusiness` / `HairSalon` (endereço, horários, telefone, preço). **Importante** para SEO local.
- ❌ Imagens otimizadas com `next/image` em vez de `backgroundImage` no hero.
- ❌ Sitemap não inclui rotas admin (correto, mas poderia ter sitemap separado para admin se fizer sentido).
- ❌ URL base hardcoded como `barberhouse.example.com` — precisa do domínio real.
- ❌ Não há `hreflang` (produto é pt-BR only hoje).
- ❌ Não há meta tags dinâmicas por cidade/barbeiro (futuro SaaS multi-cidade).

---

## 22. WhatsApp

### Status: MOCK (deep link apenas)

### Onde é utilizado

| Local | Arquivo | Contexto |
|---|---|---|
| Tela de sucesso do agendamento | `src/components/booking/BookingConfirmation.tsx` | Botão "Enviar confirmação pelo WhatsApp" |
| Footer do site | `src/components/layout/Footer.tsx` | Link "WhatsApp" na seção Contato |
| Seção de localização | `src/components/home/LocationSection.tsx` | Botão "Falar no WhatsApp" |
| (Preparado) Settings admin | `src/app/admin/(panel)/settings/page.tsx` | Tab WhatsApp — **não funcional**, só UI |

### Como a mensagem é construída

Função `buildWhatsAppLink()` em `src/lib/format.ts`:

```typescript
export function buildWhatsAppLink(phoneE164: string, message: string): string {
  return `https://wa.me/${phoneE164}?text=${encodeURIComponent(message)}`;
}
```

**Destinatário**: o número da **barbearia** (`SITE_CONFIG.whatsapp = "5511940001234"`), não do cliente.

### Mensagem da tela de sucesso do agendamento

Construída em `BookingConfirmation.tsx`:

```
Olá, {customerName}! Confirmando seu agendamento na BARBER HOUSE.

Serviço: {service.name}
Barbeiro: {barber.name ou "Qualquer barbeiro"}
Data: {formatLongDate(date)}  // ex: "segunda-feira, 07 de setembro"
Horário: {time}  // "09:30"
Valor: R$ {service.priceBRL}

Te esperamos!
```

### Dados enviados

- Nome do cliente (do `booking-store`).
- Nome do serviço (do `booking.service`).
- Nome do barbeiro ou "Qualquer barbeiro".
- Data formatada em pt-BR.
- Horário.
- Preço em BRL.

### O que NÃO existe

- ❌ Envio automático via API.
- ❌ WhatsApp Business Platform.
- ❌ Templates de mensagem aprovados.
- ❌ Webhooks de status de entrega.
- ❌ Resposta automática a mensagens recebidas.
- ❌ Integração com o painel admin (mensagens recebidas não aparecem no admin).
- ❌ Número do cliente no link (o link abre conversa com a barbearia, o cliente precisa anexar/se identificar).

### Como evoluir para WhatsApp Business Platform

1. Criar conta no [WhatsApp Business Platform](https://business.whatsapp.com/).
2. Verificar o número da barbearia.
3. Aprovar templates de mensagem (confirmação de agendamento, lembrete, etc.).
4. Criar endpoint `POST /api/whatsapp/send` no Next.js que chama a API Cloud do WhatsApp:
   ```typescript
   await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
     method: "POST",
     headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
     body: JSON.stringify({
       messaging_product: "whatsapp",
       to: customerPhoneE164,
       type: "template",
       template: { name: "appointment_confirmation", language: { code: "pt_BR" }, components: [...] },
     }),
   });
   ```
5. Chamar este endpoint no `handleConfirm` do agendamento (server-side, após persistir o appointment).
6. Configurar webhook para receber status de entrega (sent, delivered, read, failed).
7. Implementar a Tab WhatsApp do settings admin com o botão "Conectar" real (OAuth ou input de token).

**Variáveis de ambiente necessárias** (Fase 7):
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_BUSINESS_ACCOUNT_ID`
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`

---

## 23. Calendário / Maps

### Google Calendar

**Status**: deep link apenas (sem API).

- **Função**: `buildGoogleCalendarLink()` em `src/lib/format.ts`.
- **Onde**: `src/components/booking/BookingConfirmation.tsx` (botão "Adicionar ao calendário").
- **URL**: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&details=...&location=...&dates=YYYYMMDDTHHMMSS/YYYYMMDDTHHMMSS`
- **Dados enviados**:
  - `text`: `"BARBER HOUSE — {service.name}"`
  - `details`: `"Agendamento para {customerName}. Serviço: {service.name}. Barbeiro: {barber.name ou "Qualquer"}."`
  - `location`: `"{street}, {number} — {city}/{state}"`
  - `dates`: `{startUTC}/{endUTC}` no formato `YYYYMMDDTHHMMSSZ` (UTC).
- **Comportamento**: abre em nova aba. O usuário decide se adiciona ao calendário Google.
- **Limitação**: não funciona para usuários de Outlook/Apple Calendar. Para isso, gerar arquivo `.ics` (não implementado).

### Google Maps

**Status**: embed via iframe + deep link.

- **Embed**: `src/components/home/LocationSection.tsx` usa iframe com `https://www.google.com/maps?q={encodedQuery}&output=embed`.
- **Filtro CSS**: `invert(0.92) hue-rotate(180deg) contrast(0.95)` para combinar com o tema dark (inverte cores do mapa, que é claro por padrão).
- **Deep link**: `buildMapsLink()` em `src/lib/format.ts`:
  ```typescript
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  ```
- **Onde**: botão "Abrir no mapa" na `LocationSection`.
- **Query**: `SITE_CONFIG.mapsQuery = "Barber House, Rua Augusta 1500, Consolação, São Paulo"`.
- **Limitação**: o embed não requer API key (usa o endpoint público). Para funcionalidades avançadas (geocoding, autocomplete, place details), seria necessária Google Maps API key.

### Outros links externos

- **Instagram**: `https://instagram.com/{instagram}` no Footer (`SITE_CONFIG.instagram = "barberhouse"`).
- **Telefone**: `tel:{phoneDigitsOnly}` no Footer e no `ClientDetailPage` (admin).

---

## 24. Validações e Erros

### Validações existentes

#### Fluxo de agendamento (`/agendar`)

| Etapa | Validação | Mensagem | Implementação |
|---|---|---|---|
| Serviço | Obrigatório | — (botão Continuar desabilitado) | `canAdvance.service = Boolean(booking.service)` |
| Barbeiro | Obrigatório (barbeiro OU qualquer) | — | `canAdvance.barber = Boolean(booking.barber) \|\| booking.anyBarber` |
| Data | Obrigatória | — | `canAdvance.date = Boolean(booking.date)` |
| Horário | Obrigatório | — | `canAdvance.time = Boolean(booking.time)` |
| Nome | Mínimo 2 chars | "Informe seu nome." | `CustomerForm` on blur |
| WhatsApp | Mínimo 10 dígitos | "Telefone inválido. Inclua DDD." | `CustomerForm` on blur |
| Confirmação | Todos os campos preenchidos | — (botão Confirmar sempre habilitado se chegou aqui) | Implícito pelas validações anteriores |

**Máscara de telefone**: `maskPhone()` em `CustomerForm.tsx` aplica `(11) 91234-5678` em tempo real, limita a 11 dígitos.

#### Admin

| Local | Validação | Implementação |
|---|---|---|
| Login | E-mail + senha não vazios | Botão "Entrar" `disabled={!email \|\| !password}` |
| Form barbeiro | Nome + especialidade não vazios | Botão "Adicionar/Salvar" `disabled={!name.trim() \|\| !specialty.trim()}` |
| Form serviço | Nome não vazio + duração parseInt + preço parseFloat | `handleSubmit` checa antes de salvar |
| Settings | Nenhuma (form sempre pode salvar) | — |

### Estados vazios

- **`EmptyState`** component reutilizável em `src/components/admin/EmptyState.tsx`.
- Usado em:
  - `/admin/appointments` quando filtros não retornam nada.
  - `/admin/clients` quando busca não retorna nada.
  - `/admin/clients/[id]` quando cliente não tem histórico.
  - `/admin/barbers` quando não há barbeiros (estado impossível hoje, mas preparado).
  - `/admin/services` quando não há serviços (idem).
- **Mensagens**: específicas por contexto ("Nenhum agendamento encontrado", "Nenhum cliente encontrado", etc.).

### Loading states

| Local | Implementação |
|---|---|
| Login admin | Spinner `Loader2` no botão + texto "Entrando..." por 400ms (mock async) |
| PanelLayout (auth guard) | Spinner `Loader2` centralizado enquanto verifica sessão |
| DateSelector (SSR) | Skeleton com 6 retângulos pulsantes (`animate-pulse`) durante SSR/hidratação |
| Admin pages | **Nenhum loading state** (dados são síncronos do mock) |

### Fallback

- `BookingConfirmation` retorna `null` se `!service || !date || !time` (não deveria acontecer, mas defensivo).
- `BookingSummary` idem.
- `getClientById` retorna `undefined` → `ClientDetailPage` chama `notFound()` do Next.js (404).
- `generateStaticParams` em `ClientDetailPage` pre-renderiza os 10 clientes mock. IDs não existentes caem em 404 dinâmico.

### Tratamento de erros

- **Não há `error.tsx`** no App Router (Next.js error boundary). Erros não tratados crasham a página.
- **Não há `loading.tsx`** no App Router. Loading é só via `useEffect` + `useState`.
- **Não há `not-found.tsx`** custom. 404 usa o default do Next.js.
- **Não há try/catch** em nenhuma chamada de dados (porque não há chamadas async ainda). Quando houver API real, **precisará adicionar**.

### Pontos frágeis identificados

1. **Sem error boundary**: um erro em qualquer componente derruba a página inteira. Adicionar `src/app/error.tsx` e `src/app/admin/(panel)/error.tsx`.
2. **Sem loading nos admin pages**: quando migrar para Prisma, as Server Components vão esperar a query. Adicionar `loading.tsx` ou Suspense.
3. **Sem validação server-side**: o endpoint `POST /api/appointments` (quando criado) precisa validar com zod, não confiar no client.
4. **Sem retry**: se uma chamada API falhar, o usuário não tem como tentar de novo facilmente (precisa refresh).
5. **Sem optimistic UI**: hoje todas as atualizações são síncronas. Com API real, considerar optimistic updates para melhor UX.
6. **Telefone não normalizado**: o `CustomerForm` máscara visualmente, mas o `booking-store` guarda a string formatada. Ao persistir, normalizar para dígitos antes de salvar.
7. **Sem debounce na busca de clientes**: cada keystroke re-filtra via `useMemo`. Para 10 clientes é fine; para 10.000 precisaria de debounce + virtualização.

---

## 25. Dependências

Análise do `package.json`.

### Essenciais (não remover)

| Pacote | Por quê |
|---|---|
| `next`, `react`, `react-dom` | Framework + UI runtime. |
| `typescript`, `@types/react`, `@types/react-dom` | Tipagem. |
| `tailwindcss`, `@tailwindcss/postcss`, `tw-animate-css` | Styling. |
| `lucide-react` | Ícones. |
| `zustand` | Estado global. |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Base do shadcn/ui. |
| `@radix-ui/react-*` (todos os 28+) | Primitives de acessibilidade do shadcn/ui. |
| `cmdk` | Dependency do `Select`/`Combobox`. |
| `vaul` | Dependency do `Sheet`/`Drawer` (menu mobile admin). |
| `input-otp` | Dependency do `InputOTP` (não usado no produto, mas pré-instalado). |
| `react-resizable-panels` | Dependency do `Resizable` (não usado). |
| `react-day-picker` | Dependency do `Calendar` (não usado). |
| `embla-carousel-react` | Dependency do `Carousel` (não usado). |
| `prisma`, `@prisma/client` | ORM. |
| `sharp` | Otimização de imagens pelo Next.js. |

### Essenciais mas ainda não utilizadas (reservadas para próximas fases)

| Pacote | Status | Quando usar |
|---|---|---|
| `next-auth` | Instalado, não importado | Fase 3 — Autenticação |
| `@hookform/resolvers`, `react-hook-form`, `zod` | Instalados, não usados | Fase 2 — validação server-side do `POST /api/appointments` |
| `@tanstack/react-query` | Instalado, não usado | Fase 2 — fetch de dados client-side com cache |
| `@tanstack/react-table` | Instalado, não usado | Se tabelas admin precisarem de sorting/pagination/filters avançados |
| `recharts` | Instalado, não usado | Se dashboard precisar de gráficos |
| `framer-motion` | Instalado, não usado | Se precisar de animações complexas (hoje CSS basta) |
| `date-fns` | Instalado, não usado | Se precisar de manipulação de datas além do `Intl` (hoje não precisa) |
| `sonner` | Instalado, não usado | Alternativa ao `@radix-ui/react-toast` (hoje usamos o Radix) |

### Podem ser removidas (instaladas mas não usadas em produto)

| Pacote | Por quê |
|---|---|
| `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | Sem drag-and-drop no produto. |
| `@mdxeditor/editor` | Sem editor MDX. |
| `react-markdown`, `react-syntax-highlighter` | Sem render de markdown. |
| `@reactuses/core` | Sem uso dos hooks. |
| `uuid` | IDs gerados via `cuid()` (Prisma) ou `Date.now()`. |
| `next-intl` | Produto é pt-BR only. |
| `next-themes` | Produto é dark-only. |
| `bun-types` | Só relevante no sandbox. Em dev local com Node, pode remover. |
| `tailwindcss-animate` | Substituído por `tw-animate-css` (legado no `tailwind.config.ts`). |

### **REMOVER ANTES DE BAIXAR O PROJETO**

| Pacote | Por quê |
|---|---|
| `z-ai-web-dev-sdk` | SDK específico do sandbox Z.ai. **Inútil** em dev local. Pode conter referências a serviços internos. |

**Comando**:
```bash
npm uninstall z-ai-web-dev-sdk @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @mdxeditor/editor react-markdown react-syntax-highlighter @reactuses/core uuid next-intl next-themes tailwindcss-animate bun-types
```

### Scripts disponíveis

```json
{
  "dev": "next dev -p 3000 2>&1 | tee dev.log",
  "build": "next build && cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/",
  "start": "NODE_ENV=production bun .next/standalone/server.js 2>&1 | tee server.log",
  "lint": "eslint .",
  "db:push": "prisma db push --accept-data-loss",
  "db:generate": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "db:reset": "prisma migrate reset"
}
```

> **Nota sobre `dev`**: o `2>&1 | tee dev.log` é específico do sandbox. Em dev local, pode trocar por `"dev": "next dev -p 3000"` ou manter (o `tee` cria um log útil).
> 
> **Nota sobre `start`**: usa `bun` para rodar o standalone. Em dev local com Node, trocar por `node .next/standalone/server.js`.

---

## 26. Configuração / ENV

### `.env` atual

```
DATABASE_URL=file:/home/z/my-project/db/custom.db
```

**Apenas uma variável**. É uma connection string SQLite (file:).

> **NUNCA commitar secrets reais.** O `.env` atual não tem secrets — só um path de arquivo SQLite local.

### `.env.example` (recomendado criar)

**Não existe** `.env.example` no projeto. **Recomendado criar** para o próximo desenvolvedor:

```env
# Database
# SQLite (MVP atual):
DATABASE_URL=file:./dev.db
# PostgreSQL (Fase 1):
# DATABASE_URL=postgresql://user:password@localhost:5432/barberhouse?schema=public

# NextAuth (Fase 3 — não implementado)
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# WhatsApp Business Platform (Fase 7 — não implementado)
# WHATSAPP_PHONE_NUMBER_ID=
# WHATSAPP_ACCESS_TOKEN=
# WHATSAPP_BUSINESS_ACCOUNT_ID=
# WHATSAPP_WEBHOOK_VERIFY_TOKEN=

# App
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Variáveis planejadas (Futuro)

| Variável | Para que | Fase |
|---|---|---|
| `DATABASE_URL` | Connection string do banco. Hoje SQLite, depois PostgreSQL. | Atual + Fase 1 |
| `NEXTAUTH_URL` | URL canônica da aplicação para callbacks NextAuth. | Fase 3 |
| `NEXTAUTH_SECRET` | Secret para assinar JWTs. Gerar com `openssl rand -base64 32`. | Fase 3 |
| `WHATSAPP_PHONE_NUMBER_ID` | ID do número verificado no WhatsApp Business. | Fase 7 |
| `WHATSAPP_ACCESS_TOKEN` | Token de acesso à API Cloud do WhatsApp. | Fase 7 |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | ID da conta business. | Fase 7 |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Token para verificar webhooks recebidos. | Fase 7 |
| `NEXT_PUBLIC_APP_URL` | URL pública da aplicação (para metadata, sitemap, links absolutos). | Produção |

### Segurança dos secrets

- ✅ `.env` não deve ser commitado (verificar `.gitignore`).
- ❌ **Não há `.gitignore` verificado neste projeto** — o sandbox pode ter um default. **Criar/confirgir antes de commitar**:
  ```
  .env
  .env.local
  .env.production
  node_modules/
  .next/
  dev.log
  server.log
  /db/*.db
  ```

---

## 27. Comandos

### Setup inicial

```bash
# Clonar o projeto
git clone <repo-url>
cd barber-house

# Instalar dependências (npm ou bun)
npm install
# ou
bun install

# Remover dependências do sandbox que não são necessárias
npm uninstall z-ai-web-dev-sdk @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @mdxeditor/editor react-markdown react-syntax-highlighter @reactuses/core uuid next-intl next-themes tailwindcss-animate bun-types
```

### Desenvolvimento

```bash
npm run dev
# Acessar http://localhost:3000
```

Inicia o Next.js em modo dev na porta 3000 com Hot Reload.

### Build de produção

```bash
npm run build
```

Faz `next build` + copia `.next/static` e `public/` para `.next/standalone/`. O output é standalone (auto-contido, pode rodar sem `node_modules`).

> **Atenção**: o `next.config.ts` tem `output: "standalone"`. Isso gera um servidor Node auto-contido em `.next/standalone/`. Em dev local, isso é irrelevante (usa `next dev`). Em deploy, é útil para imagens Docker pequenas.

### Start produção

```bash
npm run start
# Acessar http://localhost:3000
```

Roda o servidor standalone com `bun`. **Em dev local com Node, trocar para `node .next/standalone/server.js`**.

### Lint

```bash
npm run lint
```

Roda ESLint com config flat (`eslint.config.mjs`). **Status atual: 0 erros, 0 warnings.**

> **Atenção**: o `eslint.config.mjs` tem MUITAS regras desativadas (`@typescript-eslint/no-explicit-any: off`, `react-hooks/exhaustive-deps: off`, etc.). Isso foi necessário por causa das regras estritas do Next.js 16 + React 19. **Recomendado reativar gradualmente** quando o projeto for baixado.

### Prisma

```bash
# Gerar o client (após mudar schema.prisma)
npm run db:generate

# Sincronizar schema com banco (sem migration)
npm run db:push

# Criar migration
npm run db:migrate

# Resetar banco (CUIDADO: apaga tudo)
npm run db:reset
```

> **Hoje nenhum desses comandos é necessário** porque o produto não usa Prisma em runtime. Só precisa rodar `db:generate` + `db:push` quando começar a Fase 1.

---

## 28. Deploy

### O que já está preparado

1. **`output: "standalone"`** em `next.config.ts` — gera um servidor Node auto-contido.
2. **`sharp`** instalado para otimização de imagens.
3. **`images.remotePatterns`** configurado para `images.unsplash.com`.
4. **Metadata** com `metadataBase` (precisa trocar pela URL real).
5. **Sitemap + robots** (precisa trocar a URL base).
6. **Favicon + OG** em SVG.

### O que NÃO está preparado

1. **Banco de dados em produção** — hoje SQLite local. Para deploy, precisa PostgreSQL gerenciado (Neon, Supabase, Vercel Postgres, Railway, etc.).
2. **Variáveis de ambiente** — só há `DATABASE_URL`. Falta `NEXTAUTH_SECRET`, etc.
3. **Domínio próprio** — `barberhouse.example.com` é placeholder.
4. **HTTPS** — depende do hosting (Vercel, Railway, etc. fornecem por padrão).
5. **CDN para imagens** — hoje usa `next/image` com Unsplash direto. Para volume alto, considerar CDN próprio.
6. **Monitoramento** — sem Sentry, sem logs estruturados, sem APM.
7. **CI/CD** — sem GitHub Actions, sem pipeline de deploy.

### Fluxo de deploy recomendado (Fase 1+)

1. **Hosting**: Vercel (mais simples para Next.js) ou Railway.
2. **Banco**: Neon ou Supabase (PostgreSQL gerenciado com free tier).
3. **Variáveis de ambiente** no painel do hosting:
   - `DATABASE_URL` → connection string do Neon/Supabase.
   - `NEXTAUTH_SECRET` → `openssl rand -base64 32`.
   - `NEXTAUTH_URL` → URL de produção.
4. **Comando de build**: `npm run build` (Vercel detecta Next.js automaticamente).
5. **Comando de start**: não necessário na Vercel (ela roda o build automaticamente).
6. **Domínio**: configurar DNS apontando para o hosting. HTTPS é automático na Vercel.
7. **Migrations**: rodar `npx prisma migrate deploy` no build (configurar em `package.json` script `postinstall` ou no painel).

### Limitações atuais para deploy

- ❌ Sem auth real → não pode ir para produção com dados sensíveis.
- ❌ Sem persistência real → agendamentos do público não são salvos.
- ❌ `z-ai-web-dev-sdk` no `package.json` pode falhar no build de produção fora do sandbox. **Remover antes**.
- ❌ `bun-types` no `package.json` pode causar conflito de tipos em ambientes Node. **Remover antes**.
- ❌ O `dev.log` no `npm run dev` pode crescer indefinidamente. **Remover o `tee` em produção**.

---

## 29. Segurança

### Auditoria do estado atual

#### CRÍTICO

1. **Auth mock aceita qualquer credencial**. Qualquer e-mail + senha não vazios logam como ADMIN. Qualquer pessoa pode acessar o painel admin em produção se o `/admin/login` estiver exposto.
2. **Auth guard client-side apenas**. O HTML server-rendered do painel admin é enviado ao browser antes do redirect client-side. Hoje não vaza dados sensíveis (tudo é mock), mas **será crítico** com dados reais de clientes e faturamento.
3. **Sem isolamento de tenant**. `barbershopId` é hardcoded como `"barbershop-1"`. Quando houver multi-tenant, qualquer usuário poderá ver dados de outra barbearia se o middleware não for implementado.

#### ALTO

4. **Sem validação server-side**. Quando `POST /api/appointments` for criado, se não usar zod + Prisma constraints, há risco de injection / dados inválidos.
5. **Sem rate limiting**. O endpoint público `POST /api/appointments` (quando criado) poderá ser abusado para floodar o banco com agendamentos falsos.
6. **Sem CSRF protection**. Next.js Server Actions têm proteção por padrão, mas Route Handlers não. Adicionar CSRF token ou usar Server Actions.
7. **Secrets no `.env`**. Hoje só há `DATABASE_URL` (não sensível em dev). Quando `NEXTAUTH_SECRET` e tokens WhatsApp forem adicionados, garantir que `.env` está no `.gitignore`.

#### MÉDIO

8. **Telefone não normalizado**. O `booking-store` guarda a string formatada `(11) 91234-5678`. Ao persistir, normalizar para dígitos para evitar duplicação de clientes.
9. **Sem sanitização de input em notes**. Se exibir `client.notes` no admin com `dangerouslySetInnerHTML` (não faz hoje), há risco de XSS. Hoje usa `{notes}` (React escapa por padrão), **OK**.
10. **Logs do Prisma**. `src/lib/db.ts` tem `log: ['query']` que vai logar todas as queries no console. Em produção, isso pode vazar dados. Trocar para `log: ['error']` ou remover.
11. **Error messages verbosas**. Em dev, erros do Next.js mostram stack trace. Em produção, configurar `env: 'production'` para mostrar páginas de erro genéricas.
12. **Headers de segurança**. Não há `next.config.ts` com `headers()` configurando CSP, HSTS, X-Frame-Options, etc. Adicionar na Fase de deploy.

#### BAIXO

13. **Imagens externas (Unsplash)**. Dependência de um serviço terceiro. Se Unsplash cair, as imagens quebram. Considerar self-host das imagens críticas.
14. **Google Maps embed**. Iframe de terceiros. Pode rastrear usuários (Google Analytics no embed). Aceitável para MVP.
15. **`reactStrictMode: false`** em `next.config.ts`. Em dev, o React Strict Mode ajuda a detectar efeitos colaterais. Considerar reativar (pode quebrar algo em React 19, daí o `false`).

### Recomendações imediatas (antes de produção)

1. **Implementar NextAuth** (Fase 3) — resolve CRÍTICO 1, 2, 3.
2. **Adicionar middleware server-side** para `/admin/*` (Fase 3).
3. **Validar todos os inputs server-side** com zod (Fase 2).
4. **Adicionar rate limiting** no endpoint público de agendamentos (Fase 2) — usar `@upstash/ratelimit` ou middleware custom.
5. **Configurar headers de segurança** no `next.config.ts` (Fase de deploy).
6. **Trocar `log: ['query']`** por `log: ['error']` em produção.
7. **Reativar React Strict Mode** e corrigir quaisquer side effects.

---

## 30. O Que Já Está Pronto

Checklist do que **realmente está implementado e funcional**:

### Site público

- [x] Home page com 7 seções (Hero, Services, Barbers, Gallery, Testimonials, Location, Final CTA)
- [x] Header sticky com menu mobile
- [x] Footer com contato, horários, navegação
- [x] SEO básico (metadata, OG, sitemap, robots, favicon)
- [x] Responsividade mobile-first
- [x] Acessibilidade básica (semântica, ARIA, focus rings, reduced motion)

### Fluxo de agendamento

- [x] 6 etapas funcionais (Serviço → Barbeiro → Data → Horário → Dados → Confirmação)
- [x] Stepper visual (desktop horizontal, mobile compacto)
- [x] Estado persistido em localStorage (Zustand)
- [x] Validação por etapa (botão Continuar desabilitado)
- [x] Validação de nome e WhatsApp com mensagens de erro
- [x] Máscara de telefone BR em tempo real
- [x] Auto-advance ao selecionar serviço/barbeiro
- [x] Carousel horizontal de datas com skeleton SSR-safe
- [x] Grid de horários com slots disponíveis/indisponíveis
- [x] Opção "Qualquer barbeiro"
- [x] Tela de sucesso com resumo
- [x] Link de Google Calendar pré-preenchido
- [x] Link de WhatsApp com mensagem pré-preenchida
- [x] Reset de fluxo ("Novo agendamento")
- [x] Retomar fluxo após refresh

### Admin

- [x] Tela de login (mock — qualquer credencial funciona)
- [x] Auth guard client-side (redirect para login se não logado)
- [x] Layout com sidebar fixa (desktop) + drawer (mobile)
- [x] Header admin sticky com perfil e logout
- [x] Dashboard com 4 KPIs (Total, Confirmados, Aguardando, Faturamento)
- [x] Lista de próximos agendamentos
- [x] Ranking de barbeiros com barras de progresso
- [x] Página de agendamentos com filtros (data, barbeiro, status)
- [x] Tabela desktop + cards mobile
- [x] Lista de clientes com busca e filtro de status
- [x] Detalhe do cliente com histórico de agendamentos
- [x] CRUD visual de barbeiros (dialog com form)
- [x] CRUD visual de serviços (dialog com form)
- [x] Settings com 4 tabs (Barbearia, Horários, Agendamento, WhatsApp)
- [x] Badges de status com 5 variantes semânticas

### Arquitetura

- [x] Tipos TypeScript espelhando models Prisma
- [x] Camada de dados separada em `src/data/*`
- [x] Stores Zustand isolados em `src/lib/`
- [x] Componentização clara (layout, home, booking, admin, ui)
- [x] Server Components por default, Client Components quando necessário
- [x] Hook customizado `useIsClient` para evitar hydration mismatch
- [x] Lint 100% limpo (0 erros, 0 warnings)
- [x] Schema Prisma multi-tenant pronto (8 models + 2 enums)

---

## 31. O Que Está Parcial

### Não iniciado

- [ ] **PostgreSQL em runtime** — schema Prisma usa SQLite, Prisma Client não é importado em nenhum arquivo de produto.
- [ ] **NextAuth** — instalado mas não configurado.
- [ ] **Sessões server-side**.
- [ ] **Middleware de auth**.
- [ ] **RBAC** (verificação de role em qualquer rota).
- [ ] **API de agendamentos** (`POST /api/appointments`).
- [ ] **API de clientes**.
- [ ] **Multi-tenancy em runtime** (sem middleware, sem resolução de tenant).
- [ ] **WhatsApp Business Platform**.
- [ ] **Notificações** (e-mail, SMS, WhatsApp automático).
- [ ] **Cancelamento de agendamentos pelo cliente**.
- [ ] **Lista de espera**.
- [ ] **Recorrências**.
- [ ] **Relatórios / gráficos**.
- [ ] **Painel do barbeiro** (role BARBER).
- [ ] **Upload de imagem** para barbeiros.
- [ ] **Exportar dados** (CSV, PDF).
- [ ] **Pagamentos online**.
- [ ] **2FA**.
- [ ] **OAuth** (Google, etc.).
- [ ] **Recuperação de senha**.
- [ ] **Testes automatizados** (jest, vitest, playwright).

### Parcialmente implementado

- [ ] **Schema Prisma** — completo mas não conectado. Falta `BarberService` (N:N entre barbeiros e serviços), constraint unique em `Appointment` para evitar double-booking, e `BookingSettings` model para a tab Agendamento do settings.
- [ ] **Multi-tenancy** — `barbershopId` está em todos os models, mas não há middleware resolvendo o tenant em runtime.
- [ ] **Roles** — enum `AdminRole` existe no schema, tipo `AdminRole` existe em TS, mas nenhuma verificação é feita.
- [ ] **Settings admin** — UI completa mas **não persiste** (só mostra toast).
- [ ] **CRUD de barbeiros/serviços** — UI completa mas **não persiste** (só atualiza estado local).
- [ ] **Acessibilidade** — semântica + ARIA + focus rings OK, mas **sem testes automatizados**, sem skip link, sem live regions explícitas.

### Mock (funcional mas não realista para produção)

- [ ] **Auth admin** — qualquer e-mail + senha loga.
- [ ] **Disponibilidade de horários** — gerada deterministicamente (~30% ocupados via hash).
- [ ] **Clientes** — 10 clientes fictícios fixos.
- [ ] **Agendamentos** — ~25 agendamentos ancorados em "hoje".
- [ ] **Stats do dashboard** — derivadas dos mock appointments.
- [ ] **Settings iniciais** — derivados do `SITE_CONFIG` estático.
- [ ] **`SITE_CONFIG`** — nome, endereço, telefone todos fictícios.
- [ ] **Serviços** — 4 serviços com preços fictícios.
- [ ] **Barbeiros** — 3 barbeiros fictícios.
- [ ] **Depoimentos** — 3 depoimentos fictícios.
- [ ] **Galeria** — 5 imagens Unsplash.
- [ ] **Agendamento confirmado** — só seta flag no localStorage, **não persiste**.

### Preparado (schema/types prontos, sem implementação runtime)

- [ ] **`Client` model** — existe no schema, tipo existe em TS, mock data existe, mas nenhum `Client` é criado quando um agendamento é confirmado (porque não há persistência).
- [ ] **`TimeBlock` model** — existe no schema, mas `getTimeSlots()` não o considera.
- [ ] **`BusinessHour` model por barbeiro** — existe no schema (`barberId` opcional), mas `getTimeSlots()` só usa `SITE_CONFIG.hours` (da barbearia).
- [ ] **`AdminRole.BARBER`** — existe no enum, mas não há painel do barbeiro.
- [ ] **`AppointmentStatus`** — 5 valores no enum, mas não há ação para mudar status (apenas exibidos).
- [ ] **`Testimonial` model** — existe no schema, mas depoimentos são mock estático.

---

## 32. Roadmap Recomendado

Sequência recomendada para o próximo desenvolvedor. Cada fase depende das anteriores.

### Fase 1 — Banco de dados

**Objetivo**: Trocar SQLite por PostgreSQL e conectar Prisma Client.

**Tasks**:
1. Criar conta em Neon/Supabase/Vercel Postgres.
2. Trocar `provider` em `prisma/schema.prisma` de `"sqlite"` para `"postgresql"`.
3. Atualizar `DATABASE_URL` no `.env`.
4. Adicionar constraint unique em `Appointment`: `@@unique([barbershopId, barberId, startAt])`.
5. Criar model `BarberService` (N:N entre `Barber` e `Service`).
6. Criar model `BookingSettings` (para a tab Agendamento do settings).
7. Adicionar campos em `Barbershop` para WhatsApp integration (`whatsappEnabled`, `whatsappApiConnected`).
8. Rodar `npx prisma db push`.
9. Criar seed `prisma/seed.ts` com os dados atuais do mock (`SITE_CONFIG`, `SERVICES`, `BARBERS`, etc.).
10. Rodar seed.

**Dependências**: Nenhuma.
**Bloqueia**: Fases 2, 3, 5, 6, 7, 8.

### Fase 2 — Agendamentos reais

**Objetivo**: Persistir agendamentos do fluxo público no banco.

**Tasks**:
1. Criar `src/app/api/appointments/route.ts` com `POST` handler.
2. Validar body com zod schema.
3. Upsert `Client` por `(barbershopId, phone normalizado)`.
4. Criar `Appointment` com status `PENDING`.
5. Atualizar `Client.totalAppointments` (+1).
6. Modificar `handleConfirm` em `src/app/agendar/page.tsx` para chamar a API.
7. Substituir `src/data/availability.ts → getTimeSlots()` por query em `appointments`.
8. Adicionar error boundary + loading state.
9. Adicionar rate limiting (ex: `@upstash/ratelimit`).

**Dependências**: Fase 1.
**Bloqueia**: Fases 5, 6.

### Fase 3 — Autenticação

**Objetivo**: NextAuth real com credentials provider.

**Tasks**:
1. Criar `src/app/api/auth/[...nextauth]/route.ts`.
2. Configurar `Credentials` provider com `db.admin.findUnique` + bcrypt.
3. Configurar callbacks `jwt` e `session` para incluir `id`, `role`, `barbershopId`.
4. Criar `src/middleware.ts` para proteger `/admin/*` (menos `/admin/login`).
5. Substituir `useAdminAuthStore` por `useSession()`.
6. Substituir `PanelLayout` auth guard por middleware.
7. Atualizar `AdminHeader` para usar `session.user`.
8. Hash de senha: usar `bcrypt` no seed para criar admin inicial.
9. Adicionar `NEXTAUTH_SECRET` e `NEXTAUTH_URL` no `.env`.

**Dependências**: Fase 1.
**Bloqueia**: Fases 4, 8.

### Fase 4 — Autorização / RBAC

**Objetivo**: Diferenciar permissões por role.

**Tasks**:
1. Alinhar tipo TS `AdminRole` com enum Prisma (`SUPER_ADMIN | OWNER | MANAGER | BARBER`).
2. Criar helper `requireRole(role)` para Server Actions.
3. No middleware, bloquear rotas admin conforme role (ex: `/admin/settings` só OWNER/SUPER_ADMIN).
4. Criar painel do barbeiro: `/admin/my-agenda`, `/admin/my-clients`.
5. Filtrar queries do barbeiro por `barberId = session.user.barberId`.
6. Adicionar botões de ação em appointments (confirmar, cancelar, concluir, no-show) — só ADMIN e BARBER (dono do appointment).

**Dependências**: Fase 3.
**Bloqueia**: Fase 5.

### Fase 5 — Admin funcional

**Objetivo**: Tornar todas as telas admin persistentes e com ações.

**Tasks**:
1. Substituir `MOCK_CLIENTS` por `db.client.findMany` em `ClientsPage`.
2. Substituir `MOCK_APPOINTMENTS` por `db.appointment.findMany` em `AppointmentsPage`.
3. Substituir `getDashboardStats()` por query SQL única.
4. CRUD real de barbeiros (`db.barber.create/update/delete`).
5. CRUD real de serviços (`db.service.create/update/delete`).
6. Settings real (`db.barbershop.update` + `db.businessHour` upsert + `db.bookingSettings` upsert).
7. Adicionar ação de mudar status de appointment (Server Action).
8. Adicionar toggle de `isActive` em clientes e barbeiros.
9. Adicionar delete (soft delete via `isActive: false`).

**Dependências**: Fases 1, 2, 4.
**Bloqueia**: Fase 7.

### Fase 6 — Disponibilidade real

**Objetivo**: `getTimeSlots()` considera `BusinessHour` por barbeiro + `TimeBlock` + appointments existentes.

**Tasks**:
1. Migrar `getTimeSlots` para query Prisma.
2. Considerar `BusinessHour` do barbeiro específico (se `barberId` selecionado).
3. Considerar `TimeBlock` (almoço, folga, férias).
4. Considerar appointments existentes (não-cancelados).
5. Considerar `BookingSettings.minLeadHours` (antecedência mínima).
6. Tornar async + adicionar loading no `DateSelector` e `TimeSelector`.
7. Adicionar cache (Redis ou in-memory) para slots do dia.

**Dependências**: Fases 1, 2.
**Bloqueia**: nada (mas melhora UX).

### Fase 7 — WhatsApp

**Objetivo**: Enviar confirmações automaticamente via WhatsApp Business Platform.

**Tasks**:
1. Criar conta no WhatsApp Business Platform.
2. Verificar número da barbearia.
3. Aprovar templates de mensagem (confirmação, lembrete 1h antes, etc.).
4. Criar `src/lib/whatsapp.ts` com `sendTemplateMessage(to, template, components)`.
5. Chamar no `POST /api/appointments` após persistir.
6. Criar endpoint `POST /api/webhooks/whatsapp` para receber status de entrega.
7. Atualizar tab WhatsApp do settings com botão "Conectar" real (OAuth ou input de token).
8. Adicionar `whatsappApiConnected: true` no `Barbershop` quando conectado.
9. Adicionar variáveis de ambiente.

**Dependências**: Fase 2 (para ter appointment IDs), Fase 5 (para settings real).
**Bloqueia**: nada.

### Fase 8 — Multi-tenancy

**Objetivo**: Múltiplas barbearias no mesmo deployment.

**Tasks**:
1. Criar `src/middleware.ts` que extrai `slug` do subdomínio (`{slug}.barberhouse.com`).
2. Resolver `Barbershop` por slug e injetar `barbershopId` no request.
3. Criar helper `getCurrentBarbershopId()` server-side.
4. Todas as queries Prisma: `where: { barbershopId: getCurrentBarbershopId() }`.
5. Todas as Server Actions: validar `barbershopId` no body contra JWT/session.
6. Fluxo de onboarding: signup cria novo `Barbershop` + `Admin` OWNER.
7. Isolamento de dados: garantir que uma barbearia não veja dados de outra.
8. Custom domains: `{slug}.barberhouse.com` ou domínio próprio (`minhabarbearia.com.br`).

**Dependências**: Fases 1, 3, 5.
**Bloqueia**: Fase 9.

### Fase 9 — SaaS

**Objetivo**: Produto comercializável para múltiplas barbearias.

**Tasks**:
1. Billing (Stripe ou similar): planos free/pro/enterprise.
2. Limites por plano (número de barbeiros, agendamentos/mês, etc.).
3. Trial period.
4. Onboarding wizard (criar barbearia, configurar horários, adicionar barbeiros, etc.).
5. Dashboard SaaS admin (`saas.barberhouse.com/admin`) para gerenciar tenants.
6. Email transacional (Resend, SendGrid) para confirmações, lembretes, recuperação de senha.
7. Notificações in-app.
8. Relatórios avançados por barbearia.
9. Mobile app (opcional, futuro distante).

**Dependências**: Fase 8.

### Dependências entre fases

```
Fase 1 (Banco)
  ├── Fase 2 (Agendamentos reais)
  │     ├── Fase 5 (Admin funcional) ← também depende de Fase 4
  │     ├── Fase 6 (Disponibilidade real)
  │     └── Fase 7 (WhatsApp) ← também depende de Fase 5
  └── Fase 3 (Auth)
        ├── Fase 4 (RBAC)
        │     └── Fase 5 (Admin funcional)
        └── Fase 8 (Multi-tenancy) ← também depende de Fase 5
              └── Fase 9 (SaaS)
```

---

## 33. Continuing Development

Guia para o próximo desenvolvedor. **Leia isto antes de tocar no código.**

### Por onde começar

1. **Rode o projeto localmente**:
   ```bash
   npm install
   npm uninstall z-ai-web-dev-sdk bun-types  # remover deps do sandbox
   npm run dev
   ```
   Acesse `http://localhost:3000`. Navegue pela home, faça um agendamento, faça login no admin (`/admin/login` com qualquer e-mail + senha), explore todas as telas admin.

2. **Leia este documento inteiro**. Ele é a fonte da verdade do estado atual.

3. **Leia o `README.md`** para um resumo mais curto.

4. ** rode `npm run lint`** para confirmar que está limpo.

5. **Inicie pela Fase 1 do roadmap** (PostgreSQL). Sem banco, nada do resto faz sentido.

### Arquivos importantes (não quebrar)

Estes arquivos são fundamentais para a arquitetura. **Pense duas vezes antes de refactorar**:

| Arquivo | Por que é importante |
|---|---|
| `src/types/index.ts` | Tipos do domínio público. Espelham models Prisma. Mudar aqui quebra tudo. |
| `src/types/admin.ts` | Tipos do domínio admin. Idem. |
| `prisma/schema.prisma` | Schema do banco. Mudar requer migration. |
| `src/lib/booking-store.ts` | Estado do fluxo de agendamento. Persistido em localStorage. Mudar a estrutura quebra fluxos em andamento dos usuários. |
| `src/lib/format.ts` | Formatadores e builders de link (WhatsApp, Calendar, Maps). Usados em muitos lugares. |
| `src/data/availability.ts` | Seam entre mock e banco. **Não mudar a assinatura** de `getTimeSlots` sem atualizar `AgendarPage`. |
| `src/app/layout.tsx` | Fontes + metadata global. Quebrar aqui afeta todas as páginas. |
| `src/app/globals.css` | Design system inteiro. Cores, fontes, utilitários. |
| `src/hooks/use-is-client.ts` | Padrão para evitar hydration mismatch. Usado em `DateSelector` e `PanelLayout`. |

### Decisões arquiteturais que NÃO devem ser quebradas

1. **Server Components por default**. Só usar `"use client"` quando estritamente necessário (estado, eventos, browser APIs).
2. **`src/data/*` é a fonte única da verdade** para dados mock. Não espalhar dados hardcoded pelos componentes.
3. **Tipos em `src/types/*` espelham models Prisma**. Manter alinhado ao evoluir o schema.
4. **Mobile-first**. Toda nova UI deve funcionar em 375px antes de 1440px.
5. **Dark-only**. Não há light theme. Não adicionar `next-themes` toggle.
6. **`barbershopId` em todas as queries** quando houver banco. Mesmo no single-tenant, preparar para multi-tenant.
7. **Cliente vs AdminUser**: nunca misturar. Cliente agenda, AdminUser acessa painel.
8. **`barber-house-booking` e `barber-house-admin-auth` são as chaves de localStorage**. Não renomear sem migrate.
9. **Não usar JavaScript puro onde TypeScript resolve**. Todo arquivo `.ts`/`.tsx` com tipos.
10. **Lint deve continuar 0 erros 0 warnings**. Reativar regras gradualmente, não desativar mais.

### Mocks que precisam ser substituídos (em ordem)

1. `src/data/admin/users.ts` → NextAuth + `db.admin.findUnique` (Fase 3)
2. `src/lib/admin-auth-store.ts` → `useSession()` do NextAuth (Fase 3)
3. `src/data/admin/appointments.ts` → `db.appointment.findMany` (Fase 5)
4. `src/data/admin/clients.ts` → `db.client.findMany` (Fase 5)
5. `src/data/admin/stats.ts` → query SQL agregada (Fase 5)
6. `src/data/admin/settings.ts` → `db.barbershop.findUnique` + `db.businessHour.findMany` + `db.bookingSettings.findUnique` (Fase 5)
7. `src/data/availability.ts` → query em `appointments` + `businessHours` + `timeBlocks` (Fase 6)
8. `src/data/business.ts` → `db.barbershop.findUnique` (Fase 8 — multi-tenancy)
9. `src/data/services.ts` → `db.service.findMany` (Fase 5)
10. `src/data/barbers.ts` → `db.barber.findMany` (Fase 5)
11. `src/data/testimonials.ts` → `db.testimonial.findMany` (Fase 5)
12. `src/data/gallery.ts` → criar model `GalleryImage` ou campo JSON em `Barbershop` (Fase 5)

### Ordem recomendada de implementação

```
1. Fase 1: Banco (Postgres + Prisma Client + seed)
2. Fase 3: Auth (NextAuth + middleware)
3. Fase 2: API de agendamentos + handleConfirm real
4. Fase 6: Disponibilidade real
5. Fase 4: RBAC (pode ser parcial — só ADMIN por enquanto)
6. Fase 5: Admin funcional (substituir mocks por queries)
7. Fase 7: WhatsApp
8. Fase 8: Multi-tenancy
9. Fase 9: SaaS
```

### Armadilhas conhecidas

1. **`setState` em `useEffect`**: o ESLint do Next.js 16 + React 19 bloqueia isso (`react-hooks/set-state-in-effect`). Use `useSyncExternalStore` (via `useIsClient`) ou derive o estado.
2. **Datas SSR/CSR**: `new Date()` dá valores diferentes no server e client. Use `useIsClient()` e renderize skeleton durante SSR.
3. **`react-hooks/exhaustive-deps`**: desativado no ESLint. Se reativar, vai quebrar vários `useEffect` e `useMemo`. Adicionar deps explicitamente.
4. **`@typescript-eslint/no-explicit-any`**: desativado. Evitar `any` em código novo, mas não refatorar tudo de uma vez.
5. **`tailwind.config.ts` vs `globals.css`**: o config está em formato Tailwind 3 (HSL), o `globals.css` em Tailwind 4 (OKLCH). Em runtime, `globals.css` vence. Não confundir.
6. **`z-ai-web-dev-sdk`**: remover antes de qualquer coisa. É inútil fora do sandbox.
7. **`bun-types`**: pode causar conflito de tipos com `@types/node` em dev local. Remover.
8. **`output: "standalone"`** em `next.config.ts`: útil para deploy, mas pode confundir em dev. Não remover.
9. **`reactStrictMode: false`**: desativado por causa de bugs em React 19. Reativar com cuidado.
10. **`@radix-ui/react-*`**: 28+ pacotes. Não remover individualmente — são deps do shadcn/ui. Se precisar limpar, remover o componente shadcn correspondente inteiro.
11. **Route group `(panel)`**: não afeta URL mas afeta layout. Não mover páginas para fora sem ajustar o auth guard.
12. **`MOCK_APPOINTMENTS` é gerado relativamente a "hoje"**: mudar a data do sistema muda os agendamentos visíveis no dashboard. Em teste, usar datas fixas.
13. **`Intl.DateTimeFormat` é sensível ao timezone**: o servidor e o cliente podem estar em TZs diferentes. Para datas de agendamento, sempre parsear como local (append `T12:00:00` para evitar shift de dia).

---

## 34. Decisões Arquiteturais

### Decisão 1: Next.js 16 com App Router

- **Contexto**: Escolha do framework fullstack.
- **Motivo**: Next.js é o padrão da indústria para React fullstack. App Router é o futuro (Pages Router está em maintenance). Server Components reduzem JS no client.
- **Impacto**: Toda a estrutura de rotas em `src/app/`. Server Components por default.
- **Futuro**: Manter. Não há motivo para migrar.

### Decisão 2: TypeScript strict

- **Contexto**: Tipagem estática.
- **Motivo**: Evita bugs em runtime. Facilita refactoring. Documentação viva.
- **Impacto**: Todo código é `.ts`/`.tsx`. `tsconfig.json` com `strict: true`.
- **Futuro**: Manter. Considerar reativar `noImplicitAny` (hoje `false`).

### Decisão 3: Tailwind CSS 4 + shadcn/ui

- **Contexto**: Styling.
- **Motivo**: Tailwind é o padrão para utility-first. shadcn/ui dá componentes acessíveis (Radix) sem lock-in (código vive no projeto).
- **Impacto**: 40+ componentes em `src/components/ui/`. Customização via `globals.css` e variantes CVA.
- **Futuro**: Manter. shadcn/ui permite adicionar/remover componentes sob demanda.

### Decisão 4: Zustand em vez de Redux/Context

- **Contexto**: Estado global.
- **Motivo**: Zustand é mais simples que Redux, menos boilerplate. Mais performático que Context para estados que mudam frequentemente (não re-renderiza toda a árvore).
- **Impacto**: 2 stores (`booking-store`, `admin-auth-store`), ambos persistidos.
- **Futuro**: Manter para estado client-side. Para estado server-side (dados do banco), usar TanStack Query quando houver API.

### Decisão 5: Mock data em `src/data/*` em vez de JSON files

- **Contexto**: Dados para o MVP.
- **Motivo**: Functions TypeScript permitem lógica (ex: `getServiceById`, `getTimeSlots` com mock determinístico). JSON é estático. Tipagem integrada.
- **Impacto**: Camada de dados é código, não arquivo. Seam claro para substituir por Prisma.
- **Futuro**: Quando migrar para Prisma, as funções em `src/data/*` viram wrappers async para `db.*`. Tipos já espelham models.

### Decisão 6: `barbershopId` em todos os models

- **Contexto**: Preparação para multi-tenancy.
- **Motivo**: Mesmo no MVP single-tenant, ter `barbershopId` no schema evita migration dolorosa depois.
- **Impacto**: Todo model de domínio tem `barbershopId`. Tipos TS também. Mock data usa `"barbershop-1"` hardcoded.
- **Futuro**: Middleware vai resolver o tenant em runtime (Fase 8). Hoje é preparação.

### Decisão 7: Componentes separados por domínio (layout, home, booking, admin)

- **Contexto**: Organização de componentes.
- **Motivo**: Facilita encontrar componentes. Separa preocupações. Evita pasta `components/` gigante.
- **Impacto**: 4 pastas em `src/components/`. Componentes reutilizáveis cruzam pastas (ex: `ServiceCard` em `home/` é usado em `booking/`).
- **Futuro**: Manter. Se surgir domínio novo (ex: `billing/`), criar pasta.

### Decisão 8: Mobile-first

- **Contexto**: Estratégia de responsividade.
- **Motivo**: A maioria dos clientes da barbearia vem de Instagram/Google/WhatsApp no celular. O fluxo de agendamento precisa ser confortável em 375px.
- **Impacto**: Todo CSS começa mobile. Breakpoints `sm:`/`md:`/`lg:` adicionam complexidade. Tabelas admin viram cards no mobile.
- **Futuro**: Manter.

### Decisão 9: Admin separado do site público

- **Contexto**: Layouts diferentes para audiências diferentes.
- **Motivo**: Site público é editorial (hero, galeria, depoimentos). Admin é funcional (densidade de informação, tabelas, forms). Misturar gera compromissos ruins.
- **Impacto**: `SiteShell` para público, `AdminShell` para admin. Route group `(panel)` isola o admin. Auth guard só no admin.
- **Futuro**: Manter.

### Decisão 10: Dark-first sem light theme

- **Contexto**: Identidade visual.
- **Motivo**: Barbearia premium = estética escura. Light theme seria genérico. `next-themes` instalado mas não usado.
- **Impacto**: `globals.css` define apenas `:root` (dark). Sem `@media (prefers-color-scheme)`.
- **Futuro**: Manter. Se cliente pedir light theme, adicionar mas não é prioridade.

### Decisão 11: Route group `(panel)` em vez de layout aninhado

- **Contexto**: Como aplicar auth guard + AdminShell a todas as rotas admin menos `/admin/login`.
- **Motivo**: Route group não afeta URL. Permite layout diferente para login (standalone) vs. panel (com shell).
- **Impacto**: `/admin/login` é standalone. `/admin/dashboard`, `/admin/appointments`, etc. usam `(panel)/layout.tsx`.
- **Futuro**: Manter. Se surgir outro grupo de rotas com layout diferente (ex: `/admin/barber/*` para painel do barbeiro), criar outro route group.

### Decisão 12: `useSyncExternalStore` para `useIsClient`

- **Contexto**: Evitar hydration mismatch em datas e localStorage.
- **Motivo**: `setState` em `useEffect` é anti-pattern bloqueado pelo ESLint do Next.js 16. `useSyncExternalStore` é a forma idiomática.
- **Impacto**: `src/hooks/use-is-client.ts` com 3 linhas. Usado em `DateSelector` e `PanelLayout`.
- **Futuro**: Manter.

### Decisão 13: SQLite agora, PostgreSQL depois

- **Contexto**: Banco de dados para o MVP.
- **Motivo**: SQLite é zero-config. PostgreSQL requer infra. Para MVP sem persistência real, SQLite basta.
- **Impacto**: `DATABASE_URL=file:...`. Schema usa `@db.SmallInt` (que não funciona em SQLite — fica como `Int`).
- **Futuro**: Trocar para PostgreSQL na Fase 1. Schema já pronto.

### Decisão 14: Não usar react-hook-form nem zod (ainda)

- **Contexto**: Formulários.
- **Motivo**: Para MVP com poucos forms simples, `useState` é suficiente. react-hook-form + zod adiciona complexidade.
- **Impacto**: Forms usam `useState` + validação manual. Bibliotecas instaladas mas não usadas.
- **Futuro**: Adotar na Fase 2 (validação server-side do `POST /api/appointments`).

### Decisão 15: Não usar framer-motion

- **Contexto**: Animações.
- **Motivo**: CSS puro (`animate-fade-in-up`, `step-enter`, transitions Tailwind) é suficiente. framer-motion adiciona ~30KB.
- **Impacto**: Animações definidas em `globals.css`. Biblioteca instalada mas não usada.
- **Futuro**: Manter CSS. Se precisar de animações complexas (ex: layout animations), reconsiderar.

---

## 35. Mapa de Dependências

```
Home (src/app/page.tsx)
 ├── SiteShell
 │    ├── Header
 │    └── Footer
 ├── Hero
 │    └── SITE_CONFIG (src/data/business.ts)
 ├── ServicesSection
 │    ├── SectionHeading
 │    ├── ServiceCard
 │    └── SERVICES (src/data/services.ts)
 ├── BarbersSection
 │    ├── SectionHeading
 │    ├── BarberCard
 │    └── BARBERS (src/data/barbers.ts)
 ├── GallerySection
 │    ├── SectionHeading
 │    └── GALLERY (src/data/gallery.ts)
 ├── TestimonialsSection
 │    ├── SectionHeading
 │    ├── TestimonialCard
 │    └── TESTIMONIALS (src/data/testimonials.ts)
 ├── LocationSection
 │    ├── SectionHeading
 │    ├── SITE_CONFIG
 │    ├── buildMapsLink (src/lib/format.ts)
 │    └── buildWhatsAppLink (src/lib/format.ts)
 └── FinalCta

Booking (src/app/agendar/page.tsx)
 ├── SiteShell
 ├── useBookingStore (src/lib/booking-store.ts) — persistido em localStorage
 ├── useIsClient (src/hooks/use-is-client.ts)
 ├── BookingStepper
 ├── StepNavigation
 ├── ServiceSelector
 │    ├── ServiceCard
 │    └── SERVICES
 ├── BarberSelector
 │    ├── BarberCard
 │    ├── BARBERS
 │    └── "Qualquer barbeiro" option
 ├── DateSelector
 │    ├── useIsClient (skeleton SSR)
 │    └── getOpenDays (src/data/availability.ts)
 │         └── SITE_CONFIG.hours
 ├── TimeSelector
 │    └── getTimeSlots (src/data/availability.ts)
 │         └── SITE_CONFIG.hours
 ├── CustomerForm
 │    └── maskPhone (local)
 ├── BookingSummary
 │    ├── formatBRL, formatDuration, formatLongDate (src/lib/format.ts)
 │    └── booking-store
 └── BookingConfirmation
      ├── SITE_CONFIG
      ├── buildGoogleCalendarLink (src/lib/format.ts)
      ├── buildWhatsAppLink (src/lib/format.ts)
      └── formatLongDate

Admin (src/app/admin/*)
 ├── AdminRootLayout (src/app/admin/layout.tsx) — metadata noindex
 ├── AdminIndexPage (src/app/admin/page.tsx) — redirect
 ├── AdminLoginPage (src/app/admin/login/page.tsx)
 │    ├── useAdminAuthStore (src/lib/admin-auth-store.ts)
 │    └── MOCK_ADMIN_USER (src/data/admin/users.ts)
 └── PanelLayout (src/app/admin/(panel)/layout.tsx)
      ├── useAdminAuthStore
      ├── useIsClient
      └── AdminShell
           ├── AdminSidebar
           │    └── SITE_CONFIG
           └── AdminHeader
                └── useAdminAuthStore

Dashboard (src/app/admin/(panel)/dashboard/page.tsx)
 ├── PageHeader
 ├── DashboardStats (src/components/admin/DashboardStats.tsx)
 │    ├── UpcomingAppointments
 │    └── BarberSummary
 └── getDashboardStats (src/data/admin/stats.ts)
      └── getTodaysAppointments (src/data/admin/appointments.ts)
           └── MOCK_APPOINTMENTS

Appointments (src/app/admin/(panel)/appointments/page.tsx)
 ├── PageHeader
 ├── StatusBadge + STATUS_OPTIONS
 ├── EmptyState
 ├── Select, Input (shadcn/ui)
 ├── MOCK_APPOINTMENTS
 └── BARBERS

Clients list (src/app/admin/(panel)/clients/page.tsx)
 ├── PageHeader
 ├── EmptyState
 ├── Input, Select (shadcn/ui)
 └── MOCK_CLIENTS (src/data/admin/clients.ts)

Client detail (src/app/admin/(panel)/clients/[id]/page.tsx)
 ├── PageHeader
 ├── StatusBadge
 ├── EmptyState
 ├── Card (shadcn/ui)
 ├── getClientById (src/data/admin/clients.ts)
 ├── getAppointmentsByClient (src/data/admin/appointments.ts)
 ├── getBarberById (src/data/barbers.ts)
 ├── getServiceById (src/data/services.ts)
 └── formatBRL (src/lib/format.ts)

Barbers (src/app/admin/(panel)/barbers/page.tsx)
 ├── PageHeader
 ├── EmptyState
 ├── Dialog, Input, Label, Textarea, Checkbox (shadcn/ui)
 ├── Image (next/image)
 ├── BARBERS (estado local)
 └── SERVICES (checkboxes)

Services (src/app/admin/(panel)/services/page.tsx)
 ├── PageHeader
 ├── EmptyState
 ├── Dialog, Input, Label, Textarea (shadcn/ui)
 ├── formatBRL, formatDuration (src/lib/format.ts)
 └── SERVICES (estado local)

Settings (src/app/admin/(panel)/settings/page.tsx)
 ├── PageHeader
 ├── Tabs, Input, Label, Textarea, Switch, Button (shadcn/ui)
 ├── useToast (src/hooks/use-toast.ts)
 ├── getInitialSettings (src/data/admin/settings.ts)
 │    └── SITE_CONFIG
 └── AdminSettings type (src/types/admin.ts)

Prisma Schema (prisma/schema.prisma) — NÃO CONECTADO EM RUNTIME
 ├── Barbershop
 ├── Admin (role: SUPER_ADMIN | OWNER | MANAGER | BARBER)
 ├── Service
 ├── Barber
 ├── BusinessHour
 ├── TimeBlock
 ├── Appointment (status: PENDING | CONFIRMED | COMPLETED | CANCELLED | NO_SHOW)
 ├── Client
 └── Testimonial
```

---

## 36. Checklist Final

Conforme solicitado, verificação feita antes de finalizar:

1. ✅ Li o `package.json` — seção [2. Stack Completa](#2-stack-completa) e [25. Dependências](#25-dependências).
2. ✅ Li o `prisma/schema.prisma` — seção [10. Modelo de Dados](#10-modelo-de-dados).
3. ✅ Inspecionei `src/app` — seção [3. Estrutura](#3-estrutura-completa-de-diretórios) e [5. Rotas](#5-rotas).
4. ✅ Inspecionei `src/components` — seção [3. Estrutura](#3-estrutura-completa-de-diretórios) e [6. Home Page](#6-home-page), [7. Agendamento](#7-sistema-de-agendamento), [12. Admin](#12-admin).
5. ✅ Inspecionei `src/data` — seção [9. Dados Mockados](#9-dados-mockados).
6. ✅ Inspecionei `src/lib` — seção [8. Estado / Zustand](#8-estado--zustand) e [4. Arquitetura](#4-arquitetura-da-aplicação).
7. ✅ Inspecionei `src/types` — seção [10. Modelo de Dados](#10-modelo-de-dados) e [3. Estrutura](#3-estrutura-completa-de-diretórios).
8. ✅ Verifiquei todas as rotas — seção [5. Rotas](#5-rotas). Não liste rotas que não existem.
9. ✅ Verifiquei o fluxo de agendamento — seção [7. Sistema de Agendamento](#7-sistema-de-agendamento).
10. ✅ Verifiquei o Admin — seção [12. Admin](#12-admin).
11. ✅ Verifiquei responsividade — seção [19. Responsividade](#19-responsividade). Testada em 375px e 1440px via Agent Browser.
12. ✅ Executei `npm run lint` — `bun run lint` retornou 0 erros, 0 warnings.
13. ✅ Documentei erros encontrados — seções [24. Validações e Erros](#24-validações-e-erros) e [29. Segurança](#29-segurança).
14. ✅ Não inventei funcionalidades — tudo marcado como REAL / MOCK / PREPARADO / FUTURO conforme apropriado.
15. ✅ Não coloquei secrets — seção [26. Configuração / ENV](#26-configuração--env) só documenta variáveis planejadas, sem valores reais.
16. ✅ Diferenciei claramente REAL vs MOCK vs PREPARADO vs FUTURO — seções [30](#30-o-que-já-está-pronto), [31](#31-o-que-está-parcial), e tags inline em todas as seções.

### Itens marcados como UNKNOWN / NEEDS VERIFICATION

- **Galeria no schema**: não há model `GalleryImage`. Status: UNKNOWN se será campo JSON em `Barbershop` ou table separada. Ver seção [9. Dados Mockados → gallery.ts](#srcdatagalleryts).
- **Tab Agendamento do settings**: não há model `BookingSettings`. Status: UNKNOWN. Ver seção [9. Dados Mockados → settings.ts](#srcdataadminsettingsts).
- **Tab WhatsApp do settings**: não há model para integration. Status: UNKNOWN. Idem.
- **Snapshot de `barberName` em `Appointment`**: o schema tem `customerName` e `customerPhone` mas não `barberName` ou `serviceName`. Status: UNKNOWN se adicionar. Hoje resolve via `include: { barber: true, service: true }`.
- **`@db.SmallInt` em `Testimonial.rating`**: não funciona em SQLite, só em PostgreSQL. Status: PREPARADO para Fase 1.

---

**Fim do documento.**

Este documento é uma fotografia do estado do projeto em 06/09/2026. Para dúvidas sobre decisões específicas, consultar o código-fonte diretamente — ele é a fonte da verdade final.
