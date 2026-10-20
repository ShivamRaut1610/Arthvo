# ARTHVO — Complete Technical Architecture
> Master Document 2 of 4
> Feed this to Cline or any AI coding tool before every build session.

---

## TECH STACK — FINAL DECISIONS

| Layer | Tool | Why |
|---|---|---|
| Frontend | Next.js 14 App Router | SSR, PWA, performance on slow 4G |
| Language | TypeScript | Type safety, better AI assistance |
| Styling | TailwindCSS | Fast, mobile-first, utility classes |
| Animation | Framer Motion | Avatar transitions, emotional feel |
| Charts | Recharts | Corpus growth, report visualizations |
| i18n | next-intl | 6 language support |
| Database | Supabase PostgreSQL | Free tier, Mumbai region, realtime |
| Auth | Supabase Auth | Email only, no Aadhaar, no phone |
| Realtime | Supabase Realtime | Leaderboard live updates |
| Storage | Supabase Storage | Avatar illustrations |
| AI Primary | OpenRouter API | All models, one key, cost control |
| AI Model (fast) | claude-haiku-4-5-20251001 | Scene coach, quest gen — cheap |
| AI Model (deep) | claude-sonnet-4-20250514 | Reports, deep chat — powerful |
| Translation | Bhashini API | Government of India, free, 22 languages |
| Voice Output | Sarvam AI | Indian accents, Indic languages |
| Voice Input | Web Speech API | Free, browser-native, no API needed |
| Email | Resend | 3,000/month free |
| Push Notifications | OneSignal | Free forever |
| Hosting | Vercel | Free tier, auto-deploy from GitHub |
| Domain | arthvo.in | Already owned |
| Version Control | GitHub | Free, Vercel integration |

---

## PROJECT STRUCTURE — COMPLETE

```
arthvo/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   └── page.tsx                 ← Landing page, no login required
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (app)/
│   │   │   ├── layout.tsx               ← Environment provider, auth check
│   │   │   ├── onboarding/page.tsx      ← 5-question personalization flow
│   │   │   ├── home/page.tsx            ← Dashboard: avatar, XP, quests
│   │   │   ├── quests/page.tsx          ← Daily quest system
│   │   │   ├── simulator/page.tsx       ← Full retirement simulator
│   │   │   ├── chat/page.tsx            ← BhavishyaMitra deep chat
│   │   │   ├── leaderboard/page.tsx     ← All leaderboard types
│   │   │   ├── report/page.tsx          ← Monthly Bhavishya Score
│   │   │   ├── badges/page.tsx          ← Badge collection
│   │   │   └── profile/page.tsx         ← User settings + environment
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   └── page.tsx                 ← Admin dashboard (password protected)
│   │   └── api/
│   │       ├── auth/
│   │       │   └── admin/route.ts       ← Admin login, sets httpOnly cookie
│   │       ├── ai/
│   │       │   ├── coach/route.ts       ← Scene coach streaming response
│   │       │   ├── chat/route.ts        ← Deep chat with history
│   │       │   └── report/route.ts      ← Monthly report generation
│   │       ├── quests/
│   │       │   ├── generate/route.ts    ← AI quest generation
│   │       │   └── submit/route.ts      ← Submit answer, award XP
│   │       ├── events/route.ts          ← Behavioral event tracker
│   │       ├── simulator/route.ts       ← Corpus calculation + logging
│   │       └── user/
│   │           ├── profile/route.ts
│   │           └── environment/route.ts
│   │
│   ├── components/
│   │   ├── avatar/
│   │   │   ├── AvatarScene.tsx          ← Main avatar component
│   │   │   ├── SceneThriving.tsx        ← 5 scene illustrations
│   │   │   ├── SceneStable.tsx
│   │   │   ├── SceneStruggling.tsx
│   │   │   ├── SceneCritical.tsx
│   │   │   └── SceneZero.tsx
│   │   ├── simulator/
│   │   │   ├── Simulator.tsx            ← Main simulator
│   │   │   ├── SliderInput.tsx          ← Reusable slider with label
│   │   │   ├── CorpusDisplay.tsx        ← Big corpus number
│   │   │   └── ScenarioCompare.tsx      ← 3 scenario comparison
│   │   ├── coach/
│   │   │   ├── BhavishyaMitra.tsx       ← Coach bubble + chat
│   │   │   ├── CoachBubble.tsx          ← Scene mode bubble
│   │   │   ├── ChatInterface.tsx        ← Deep chat UI
│   │   │   └── VoiceButton.tsx          ← Web Speech API
│   │   ├── quests/
│   │   │   ├── QuestCard.tsx
│   │   │   ├── AnswerOptions.tsx
│   │   │   ├── HintSystem.tsx
│   │   │   ├── QuestTimer.tsx
│   │   │   └── XPReward.tsx
│   │   ├── gamification/
│   │   │   ├── XPBar.tsx
│   │   │   ├── LevelBadge.tsx
│   │   │   ├── StreakCounter.tsx
│   │   │   ├── BadgeUnlock.tsx          ← Unlock animation
│   │   │   ├── BadgeGrid.tsx
│   │   │   └── Leaderboard.tsx
│   │   ├── report/
│   │   │   ├── BhavishyaScore.tsx       ← IQ score display
│   │   │   ├── ReportCard.tsx           ← Full report layout
│   │   │   └── ShareCard.tsx            ← Shareable image card
│   │   ├── onboarding/
│   │   │   ├── LanguageStep.tsx
│   │   │   ├── PersonalityStep.tsx
│   │   │   ├── ThemeStep.tsx
│   │   │   ├── CharacterStep.tsx
│   │   │   └── TerminologyStep.tsx
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx            ← Mobile bottom navigation
│   │   │   ├── TopBar.tsx               ← XP, streak, level
│   │   │   └── LanguageSwitcher.tsx
│   │   └── ui/                          ← Design system components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── Slider.tsx
│   │       ├── Modal.tsx
│   │       └── ProgressBar.tsx
│   │
│   ├── lib/
│   │   ├── supabase.ts                  ← Supabase client (browser)
│   │   ├── supabase-server.ts           ← Supabase client (server)
│   │   ├── openrouter.ts                ← OpenRouter API client
│   │   ├── bhashini.ts                  ← Bhashini translation
│   │   ├── sarvam.ts                    ← Sarvam AI voice
│   │   ├── calculator.ts                ← Corpus math formulas
│   │   ├── events.ts                    ← Behavioral event tracker
│   │   ├── prompts.ts                   ← All AI prompt builders
│   │   ├── environment.ts               ← User environment helpers
│   │   └── utils.ts                     ← Shared utilities
│   │
│   ├── contexts/
│   │   ├── EnvironmentContext.tsx       ← Theme, language, personality
│   │   └── UserContext.tsx              ← Auth, XP, level, avatar state
│   │
│   ├── hooks/
│   │   ├── useEnvironment.ts
│   │   ├── useUser.ts
│   │   ├── useSimulator.ts
│   │   └── useBehaviorTracker.ts
│   │
│   ├── types/
│   │   ├── user.ts
│   │   ├── environment.ts
│   │   ├── quest.ts
│   │   ├── report.ts
│   │   └── events.ts
│   │
│   └── locales/
│       ├── hi/ (Hindi — primary)
│       │   ├── common.json
│       │   ├── simple.json
│       │   ├── standard.json
│       │   └── expert.json
│       ├── en/
│       ├── ta/ (Tamil)
│       ├── te/ (Telugu)
│       ├── bn/ (Bengali)
│       └── mr/ (Marathi)
│
├── public/
│   ├── manifest.json                    ← PWA manifest
│   ├── sw.js                            ← Service worker
│   ├── avatars/
│   │   ├── arjun/
│   │   │   ├── thriving.svg
│   │   │   ├── stable.svg
│   │   │   ├── struggling.svg
│   │   │   ├── critical.svg
│   │   │   └── zero.svg
│   │   ├── priya/
│   │   ├── raza/
│   │   └── meera/
│   └── icons/                           ← PWA icons all sizes
│       ├── 72.png
│       ├── 144.png
│       ├── 192.png
│       └── 512.png
│
├── styles/
│   └── themes/
│       ├── dhoop.css
│       ├── raat.css
│       ├── jungle.css
│       ├── shahar.css
│       └── mela.css
│
├── .env.local                           ← Never commit this
├── .env.example                         ← Commit this (no values)
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## ENVIRONMENT VARIABLES

### .env.local (never commit)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
OPENROUTER_API_KEY=

# Indian APIs
BHASHINI_API_KEY=
SARVAM_API_KEY=

# Admin
ADMIN_PASSWORD=
ADMIN_SECRET=

# App
NEXT_PUBLIC_APP_URL=https://arthvo.in
```

---

## DATABASE SCHEMA — COMPLETE

```sql
-- =============================================
-- CORE USER TABLES
-- =============================================

create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  age integer,
  city text,
  occupation_type text,     -- student/salaried/gig/self_employed
  income_range text,         -- <10k/10-25k/25-50k/50k+
  nps_status text default 'none',  -- none/aware/enrolled
  risk_profile text default 'moderate',
  retirement_age integer default 60,
  profile_completion integer default 0,
  xp_points integer default 0,
  level integer default 1,
  avatar_state text default 'zero',
  role text default 'user',  -- user/admin
  created_at timestamptz default now(),
  last_active timestamptz default now()
);

-- User personalization environment
create table user_environments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) unique,
  language text default 'hi',
  script text default 'devanagari',
  terminology text default 'simple',
  theme text default 'dhoop',
  coach_personality text default 'dost',
  avatar_character text default 'arjun',
  notification_style text default 'motivational',
  voice_enabled boolean default true,
  currency_display text default 'lakhs',
  updated_at timestamptz default now()
);

-- =============================================
-- BEHAVIORAL INTELLIGENCE TABLES
-- =============================================

-- Every micro-interaction logged here
create table behavioral_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  session_id uuid,
  event_type text not null,
  event_data jsonb,
  screen text,
  language_used text,
  time_spent_ms integer,
  device_type text,
  timestamp timestamptz default now()
);

-- Rich quest behavioral data
create table quest_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  quest_id text,
  topic text,
  difficulty text,
  language text,
  started_at timestamptz,
  completed_at timestamptz,
  abandoned boolean default false,
  answer_given integer,
  correct boolean,
  hints_used integer default 0,
  time_taken_ms integer,
  hesitation_count integer default 0,
  xp_earned integer default 0
);

-- Every slider movement logged
create table simulator_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  session_start timestamptz default now(),
  session_end timestamptz,
  slider_movements jsonb,
  max_contribution integer,
  min_contribution integer,
  final_contribution integer,
  final_corpus bigint,
  avatar_state_start text,
  avatar_state_end text,
  coach_interactions integer default 0,
  scenarios_compared integer default 0
);

-- =============================================
-- GAMIFICATION TABLES
-- =============================================

create table xp_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  action text,
  xp_delta integer,
  balance_after integer,
  metadata jsonb,
  timestamp timestamptz default now()
);

create table streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) unique,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_active date,
  grace_used boolean default false,
  updated_at timestamptz default now()
);

create table badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  badge_id text,
  badge_name text,
  badge_category text,
  unlocked_at timestamptz default now()
);

create table leaderboard (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) unique,
  total_xp integer default 0,
  national_rank integer,
  city text,
  city_rank integer,
  age_group text,
  age_group_rank integer,
  updated_at timestamptz default now()
);

create table referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references users(id),
  referred_id uuid references users(id),
  source text,   -- whatsapp/instagram/linkedin/direct
  joined_at timestamptz default now(),
  xp_awarded boolean default false
);

-- =============================================
-- AI & REPORTS TABLES
-- =============================================

create table ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  session_id uuid,
  mode text,           -- scene/deep/report
  role text,           -- user/assistant
  message text,
  language text,
  personality_used text,
  tokens_used integer,
  timestamp timestamptz default now()
);

create table user_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  month integer,
  year integer,
  pension_iq_score integer,
  report_data jsonb,
  generated_at timestamptz default now()
);

create table cohort_reports (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid,
  institution_name text,
  month integer,
  year integer,
  total_users integer,
  active_users integer,
  avg_pension_iq integer,
  report_data jsonb,
  generated_at timestamptz default now()
);

create table avatar_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  state text,
  corpus_value bigint,
  trigger_event text,
  timestamp timestamptz default now()
);

-- =============================================
-- ADMIN CONFIG TABLE
-- =============================================

create table app_config (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text not null,
  updated_by uuid references users(id),
  updated_at timestamptz default now()
);

-- Default config values
insert into app_config (key, value) values
  ('scene_model', 'anthropic/claude-haiku-4-5-20251001'),
  ('chat_model', 'anthropic/claude-sonnet-4-20250514'),
  ('report_model', 'anthropic/claude-sonnet-4-20250514'),
  ('quest_model', 'anthropic/claude-haiku-4-5-20251001'),
  ('scene_max_tokens', '150'),
  ('chat_max_tokens', '500'),
  ('report_max_tokens', '1000'),
  ('monthly_budget_usd', '20'),
  ('coach_debounce_ms', '3000');

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

alter table users enable row level security;
alter table user_environments enable row level security;
alter table behavioral_events enable row level security;
alter table quest_sessions enable row level security;
alter table simulator_sessions enable row level security;
alter table xp_ledger enable row level security;
alter table streaks enable row level security;
alter table badges enable row level security;
alter table ai_conversations enable row level security;
alter table user_reports enable row level security;

create policy "Users see own data" on users
  for all using (auth.uid() = id);

create policy "Users see own environment" on user_environments
  for all using (auth.uid() = user_id);

create policy "Users see own events" on behavioral_events
  for all using (auth.uid() = user_id);

create policy "Users see own quests" on quest_sessions
  for all using (auth.uid() = user_id);

create policy "Users see own XP" on xp_ledger
  for all using (auth.uid() = user_id);

create policy "Leaderboard is public" on leaderboard
  for select using (true);
```

---

## KEY FORMULAS

### Corpus Calculation
```typescript
export function calculateCorpus({
  currentAge,
  retirementAge,
  monthlyContribution,
  annualReturn = 10
}: CorpusParams): number {
  const months = (retirementAge - currentAge) * 12
  const r = annualReturn / 12 / 100
  if (r === 0) return monthlyContribution * months
  const corpus = monthlyContribution *
    (((Math.pow(1 + r, months)) - 1) / r) *
    (1 + r)
  return Math.round(corpus)
}

export function getCostOfDelay({
  currentAge,
  retirementAge,
  monthlyContribution,
  delayYears = 5
}: CostOfDelayParams): number {
  const withoutDelay = calculateCorpus({ currentAge, retirementAge, monthlyContribution })
  const withDelay = calculateCorpus({ currentAge: currentAge + delayYears, retirementAge, monthlyContribution })
  return withoutDelay - withDelay
}
```

### Avatar State
```typescript
export function getAvatarState(corpus: number, currentAge: number): AvatarState {
  const target = (60 - currentAge) * 12 * 5000
  const ratio = corpus / target
  if (ratio >= 1.0) return 'thriving'
  if (ratio >= 0.7) return 'stable'
  if (ratio >= 0.4) return 'struggling'
  if (ratio >= 0.1) return 'critical'
  return 'zero'
}
```

### Format Corpus Display
```typescript
export function formatCorpus(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Crore`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} Lakh`
  return `₹${amount.toLocaleString('en-IN')}`
}
```

---

## API ROUTES — COMPLETE LIST

```
Authentication
POST /api/auth/admin/login     ← Admin password check, sets httpOnly cookie

User
GET  /api/user/profile         ← Fetch profile + environment
PUT  /api/user/profile         ← Update profile
PUT  /api/user/environment     ← Update environment settings

AI
POST /api/ai/coach             ← Scene coach (streaming, debounced)
POST /api/ai/chat              ← Deep chat with history
POST /api/ai/report            ← Generate monthly report

Quests
POST /api/quests/generate      ← AI generates quest
POST /api/quests/submit        ← Submit answer, award XP, check badges

Simulator
POST /api/simulator/log        ← Log simulator session

Events
POST /api/events               ← Log behavioral event (batch)
```

---

## OPENROUTER INTEGRATION

```typescript
// src/lib/openrouter.ts

export async function callAI({
  prompt,
  systemPrompt,
  model,
  maxTokens = 500,
  stream = false
}: OpenRouterParams) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://arthvo.in',
      'X-Title': 'Arthvo'
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      stream,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]
    })
  })

  if (stream) return response  // return stream directly
  const data = await response.json()
  return data.choices[0].message.content
}
```

---

## BEHAVIORAL EVENT TRACKER

```typescript
// src/lib/events.ts

export type EventType =
  | 'simulator_slider_moved'
  | 'simulator_session_start'
  | 'simulator_session_end'
  | 'quest_started'
  | 'quest_completed'
  | 'quest_abandoned'
  | 'quest_hint_taken'
  | 'avatar_viewed'
  | 'avatar_state_changed'
  | 'coach_message_sent'
  | 'coach_voice_played'
  | 'badge_unlocked'
  | 'badge_shared'
  | 'leaderboard_viewed'
  | 'report_opened'
  | 'environment_changed'
  | 'language_switched'
  | 'theme_changed'
  | 'session_start'
  | 'session_end'

export async function track(
  userId: string,
  eventType: EventType,
  data: Record<string, unknown>,
  sessionId: string
) {
  await supabase.from('behavioral_events').insert({
    user_id: userId,
    session_id: sessionId,
    event_type: eventType,
    event_data: data,
    timestamp: new Date().toISOString()
  })
}
```

---

## THEME SYSTEM

```css
/* One line swaps entire visual world */
/* document.documentElement.setAttribute('data-theme', theme) */

[data-theme="dhoop"] {
  --bg-primary: #FFF8F0;
  --bg-secondary: #FFF0DC;
  --accent-primary: #F5A623;
  --accent-secondary: #C4622D;
  --text-primary: #1A1A1A;
  --text-secondary: #5C4033;
}

[data-theme="raat"] {
  --bg-primary: #0D1117;
  --bg-secondary: #161B22;
  --accent-primary: #F5C842;
  --accent-secondary: #E8963C;
  --text-primary: #F0F0F0;
  --text-secondary: #8B949E;
}

[data-theme="jungle"] {
  --bg-primary: #F0F7EE;
  --bg-secondary: #E1F0DC;
  --accent-primary: #2D6A4F;
  --accent-secondary: #74C69D;
  --text-primary: #1B2F1A;
  --text-secondary: #40724F;
}

[data-theme="shahar"] {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F7FA;
  --accent-primary: #2563EB;
  --accent-secondary: #7C3AED;
  --text-primary: #111827;
  --text-secondary: #6B7280;
}

[data-theme="mela"] {
  --bg-primary: #FFF5F9;
  --bg-secondary: #FFE8F2;
  --accent-primary: #E91E8C;
  --accent-secondary: #FF6B35;
  --text-primary: #1A0A10;
  --text-secondary: #8B2252;
}
```

---

## PWA SETUP

### public/manifest.json
```json
{
  "name": "Arthvo",
  "short_name": "Arthvo",
  "description": "Kya tu Arthvo hai?",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#FFF8F0",
  "theme_color": "#F5A623",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## SECURITY

- Supabase Auth handles all authentication
- Row Level Security on every user table
- Admin panel checks password server-side only — never in frontend
- Admin password stored in Vercel environment variables
- No Aadhaar, no PAN, no sensitive documents stored
- DPDP Act 2023 compliant
- TLS on all API communications

---

## DEPLOYMENT PIPELINE

```
Code written in VS Code
        ↓
git add . && git commit -m "feature"
        ↓
git push origin main
        ↓
Vercel auto-detects push
        ↓
Vercel builds Next.js app
        ↓
Deployed to arthvo.in automatically
        ↓
Total time: ~2 minutes
```

---

## COST BREAKDOWN

```
Vercel free tier          ₹0/month
Supabase free tier        ₹0/month
Bhashini API              ₹0/month (government, free)
OneSignal                 ₹0/month
Resend (3k emails)        ₹0/month
GitHub                    ₹0/month

OpenRouter (1,000 users):
  Scene coach responses   ~₹300/month
  Quest generation        ~₹100/month
  Report generation       ~₹250/month
  Deep chat               ~₹200/month
  Total AI               ~₹850/month

Total at 1,000 users: ~₹850/month
Total at MVP stage:    effectively ₹0
```

---

*Last updated: Building v2 from scratch. arthvo.in*
