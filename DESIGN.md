# Personal CRM — Design

Goals, in priority order:
1. Painless entry — capturing a person/note takes seconds, from anywhere
2. Minimal-touch updates — the system keeps itself current; you don't groom records
3. Any device — phone, laptop, whatever, no install friction

## Core insight

The failure mode of every personal CRM is manual data entry. People stop
filling in forms within two weeks. So the design principle is: **you never
fill in a form**. You either (a) say something in natural language, or
(b) the system infers updates from data you already generate (email,
calendar).

## Recommended architecture

**Airtable base as the datastore + UI, Claude as the entry/update layer.**

Why Airtable over a custom app (Supabase + Vercel PWA):
- Any-device UI is free: native mobile apps + web, offline-tolerant, zero code to maintain
- Claude already has read/write access via the Airtable connector — natural-language entry works day one
- Forms, views (e.g. "haven't talked to in 90 days"), and automations built in
- A custom PWA is weeks of work to reach parity, and it's one more thing to maintain

Tradeoffs accepted: data lives in Airtable (export is easy, CSV anytime);
free tier caps at 1,000 records per base (fine for a personal network for
years; paid tier if outgrown).

## Schema (keep it small)

**Contacts** — one row per person
- Name, Email(s), Phone, Company, Role, Location
- How we met, Tags (multi-select: friend / work / investor / etc.)
- Cadence (optional: how often you want to touch base)
- Last touch (date — maintained automatically, see below)
- Next step (short text, cleared when done)

**Interactions** — append-only log, linked to Contact
- Date, Channel (met / call / email / text), Note

That's it. No pipeline stages, no lead scores. Anything else gets added
only after the basics prove sticky.

## Painless entry

- **Talk to Claude, any device**: "Met Sarah Kim at the supply-chain
  conference, she's VP ops at Flexport, follow up in 2 weeks about the
  Miami thing." Claude creates the contact + interaction + next step.
  This works from the Claude mobile app, so capture-in-the-moment is a
  voice memo away.
- **Airtable form** as fallback for quick manual adds (share-sheet on phone).
- **Bulk import**: seed the base from Google Contacts / LinkedIn export
  CSV once, dedupe by email.

## Minimal-touch updates

- **Weekly sweep (scheduled Claude session)**: scan Gmail sent mail and
  Calendar events for the week, match participants against Contacts by
  email, and auto-update "Last touch" + append Interaction rows. New
  people you emailed/met more than once get proposed as new contacts
  (you approve, not enter).
- **Nudge digest**: same weekly run flags contacts past their cadence
  ("you wanted quarterly with Alex — last touch was in May") and open
  Next steps. One short message; you act or ignore.
- Nothing requires opening the CRM to keep it accurate.

## Any device

- Read/browse: Airtable mobile app or web.
- Write: talk to Claude (mobile/web/desktop) or the Airtable form.
- No syncing, no local database, no app to build.

## Build plan (when approved)

1. Create Airtable base with the two tables above + core views
   (All, By tag, Stale > cadence, Open next steps)
2. Seed from existing contacts export (needs a CSV or Google Contacts access)
3. Set up the weekly Gmail/Calendar sweep + digest as a scheduled routine
4. Iterate on the schema only after 2–3 weeks of real use

## Alternative considered

Supabase + Vercel PWA: full control, own your stack, nicer custom UX.
Rejected for now — it optimizes the part that doesn't matter (the UI you
rarely open) at the cost of weeks before the entry/update loop exists.
The schema above ports cleanly to Postgres later if Airtable is outgrown.
