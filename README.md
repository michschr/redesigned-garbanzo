# Track Out Raleigh

Find day camps in Raleigh and Wake County that match a kid's track-out weeks, breaks, and summer.

Wake County Public Schools runs a traditional calendar plus four staggered year-round tracks. Each track is out of school for roughly three weeks, four times a year, on different dates. This app maps those windows to camps that cover them.

Working name. Discovery MVP: no accounts, no booking, no payments. Registration links out to each operator.

## Stack

- Next.js (App Router, TypeScript), Tailwind v4
- Data: typed seed files in `src/data/`, behind `src/lib/repo.ts`. Swap for Supabase when operator submissions land.
- Deploy target: Vercel

## Run

```sh
npm install
npm run dev        # http://localhost:3000
npm run check      # typecheck + lint + seed data validation
npm run build
```

## Layout

| Path | Purpose |
| --- | --- |
| `src/data/calendars.ts` | WCPSS 2026-27 break windows per calendar (traditional, tracks 1 to 4) |
| `src/data/schools.ts` | Year-round school list with multi-track vs Track-4-only |
| `src/data/camps.ts` | Camp directory seed |
| `src/lib/calendar.ts` | Date helpers, upcoming-window logic |
| `src/lib/match.ts` | Session-to-window overlap and coverage scoring, filters |
| `src/lib/repo.ts` | Data access boundary |
| `src/app/` | Routes: `/`, `/camps`, `/camps/[slug]`, `/tracks/[id]` |
| `scripts/validate-data.ts` | Seed data sanity checks |

## Data sources

- Calendars: WCPSS board-approved 2026-27 PDFs, one per track, linked from wcpss.net/calendars. Summer end dates are projections until 2027-28 calendars publish.
- Year-round school list: wcpss.net enrollment resources.
- Camps: each operator's public site. `sourceUrl` on every record. Sessions are only recorded when the operator published dates.

## Next

- Operator submission form and Supabase persistence
- Session date scraping or operator feeds for the big providers
- Saved calendar per family (cookie), multiple kids
- Distance filter from a home address
