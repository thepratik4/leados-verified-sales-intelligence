# LeadOS: Verified B2B Sales Intelligence & Prospecting Platform

LeadOS is an executive-grade B2B sales intelligence and account prospecting platform designed to eliminate synthetic data and hallucinations in outbound pipeline workflows. It combines regulatory filings (SEC EDGAR), verified career portals, primary corporate disclosures, and grounded AI models to deliver source-backed company profiles, intent signals, and high-conversion outreach messaging.

---

## Key Features

- **Authoritative Data Provenance**: Every company metric (revenue, headcount, growth, filings, tech stack) is linked directly to an official source with verification status, evidence excerpts, and retrieval timestamps.
- **Data Integrity Guard**: Built-in verification engine ensures unverified or speculative claims cannot contaminate lead scoring, dossiers, or exports.
- **Automated 8-Point Integrity Test Suite**: Ensures zero hallucinated evidence IDs, strict provenance enforcement, safe fallback states, and verified-only search filtering.
- **Executive Lead Dossiers**: In-depth deep-dives featuring financial health indicators, headcount expansion trajectories, technology footprints, and verified trigger events.
- **AI-Powered Outreach Generator**: Leverages Google Gemini models strictly grounded on verified facts to generate tailored executive emails, pain point analyses, and objection handling strategies.
- **Cohort & List Management**: Group accounts by target tier, ICP score, hiring surges, or technology adoption.
- **Flexible Data Export**: Export qualified prospect lists in CSV or JSON formats with full evidence citations.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS, Lucide Icons, Motion
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Testing**: Automated Data Integrity Test Suite (`tsx`)

---

## Project Structure

```
├── app/
│   ├── api/gemini/              # API routes for AI search, dossier analysis, and outreach
│   ├── globals.css              # Global styles & theme tokens
│   ├── layout.tsx               # Root layout & font configurations
│   └── page.tsx                 # Main LeadOS operational dashboard
├── components/
│   ├── ActivityLogView.tsx      # Real-time data sync & verification audit trail
│   ├── AddToListModal.tsx       # Cohort assignment modal
│   ├── AnalyzingModal.tsx       # Interactive AI analysis modal
│   ├── CompanyLogo.tsx          # Resilient company logo renderer
│   ├── DiscoverView.tsx         # ICP filter & company discovery grid
│   ├── ExportModal.tsx          # CSV/JSON grounded exporter
│   ├── Header.tsx               # Application header with quick search trigger
│   ├── LeadDossierView.tsx      # Full account dossier with verified provenance cards
│   ├── ListsView.tsx            # Custom account cohorts and saved segments
│   ├── OutreachModal.tsx        # Grounded multi-channel outreach generator
│   ├── QuickSearchModal.tsx     # Global fuzzy & domain spotlight search
│   ├── ResultsView.tsx          # Tabular prospecting view with multi-select actions
│   ├── SavedSearchesView.tsx    # Saved filters & search presets
│   ├── SettingsView.tsx         # Workspace settings & API key status
│   └── Sidebar.tsx              # Primary navigation & cohort counters
├── hooks/
│   └── use-mobile.ts            # Responsive viewport hook
├── lib/
│   ├── __tests__/               # Automated verification & integrity tests
│   ├── providers/               # SEC EDGAR, Career Portal, & Enrichment providers
│   ├── gemini.ts                # Grounded Gemini client with fallback handling
│   ├── initial-data.ts          # Verified enterprise account seed records
│   ├── integrity-guard.ts       # Anti-hallucination validation and scoring engine
│   ├── provenance-utils.ts      # Fact formatting & citation utilities
│   ├── types.ts                 # Full type definitions for leads, facts, & evidence
│   └── utils.ts                 # Common UI and formatting helpers
├── public/                      # Static assets
└── scripts/
    └── test-integrity.ts        # CLI runner for the data integrity test suite
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.17+ or v20+ recommended
- **npm** (or `pnpm` / `yarn`)

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/thepratik4/leados-verified-sales-intelligence.git
cd leados-verified-sales-intelligence
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your API key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Optional: Required for real-time AI dossier & outreach synthesis
GEMINI_API_KEY=your_gemini_api_key_here
```

*(Note: If `GEMINI_API_KEY` is not set, LeadOS gracefully falls back to local verified heuristics.)*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

---

## Verification & Integrity Tests

LeadOS includes an automated data integrity suite validating that:
1. Unsupported company fields cannot be flagged as verified.
2. AI claims lacking direct evidence IDs are rejected.
3. Hallucinated or invalid evidence IDs are discarded.
4. Unknown fields remain `null` or `unknown` rather than fabricated.
5. Lead scoring algorithms strictly penalize unverified assertions.
6. Exports omit fabricated or synthetic data points.
7. Search results never return ungrounded entities as verified.
8. Outreach templates cannot reference unsupported facts.

To run the verification test suite:

```bash
npm run test:integrity
```

---

## License

This project is private and proprietary.
