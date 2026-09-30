import Link from "next/link";
import type { Metadata } from "next";
import { CampCard } from "@/components/CampCard";
import {
  formatRange,
  getCalendar,
  isCalendarId,
  upcomingWindows,
  weekdayCount,
} from "@/lib/calendar";
import { filterCamps, matchCampsToWindow } from "@/lib/match";
import { CATEGORIES, getAreas, getCamps } from "@/lib/repo";
import type { Break, CalendarId } from "@/lib/types";

export const metadata: Metadata = { title: "Camps" };

const CAL_OPTIONS: { id: CalendarId; label: string }[] = [
  { id: "traditional", label: "Traditional" },
  { id: "track1", label: "Track 1" },
  { id: "track2", label: "Track 2" },
  { id: "track3", label: "Track 3" },
  { id: "track4", label: "Track 4" },
];

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function CampsPage(props: PageProps<"/camps">) {
  const sp = await props.searchParams;
  const calId = first(sp.cal);
  const cal = isCalendarId(calId) ? getCalendar(calId) : undefined;
  const windows: Break[] = cal ? upcomingWindows(cal) : [];
  const windowStart = first(sp.window);
  const window = windows.find((w) => w.start === windowStart) ?? (cal ? windows[0] : undefined);

  const ageRaw = first(sp.age);
  const age = ageRaw ? Number(ageRaw) : undefined;
  const filters = {
    age: age !== undefined && Number.isFinite(age) ? age : undefined,
    category: first(sp.category) || undefined,
    area: first(sp.area) || undefined,
    q: first(sp.q) || undefined,
    extendedCare: first(sp.ec) === "1",
  };

  const [allCamps, areas] = await Promise.all([getCamps(), getAreas()]);
  const camps = filterCamps(allCamps, filters);
  const matches = window ? matchCampsToWindow(camps, window) : null;
  const listed = matches?.filter((m) => !m.unlisted) ?? [];
  const unlisted = matches?.filter((m) => m.unlisted) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Camps</h1>
        {cal && window ? (
          <p className="text-muted">
            {cal.shortName} · {window.label} · {formatRange(window.start, window.end)} ·{" "}
            {weekdayCount(window.start, window.end)} weekdays
            {window.estimated ? " (end date projected)" : ""}
          </p>
        ) : (
          <p className="text-muted">Pick a calendar to match camps to your break dates.</p>
        )}
      </div>

      <form className="grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-3 lg:grid-cols-6">
        <label className="flex flex-col gap-1 text-xs text-muted">
          Calendar
          <select name="cal" defaultValue={cal?.id ?? ""} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground">
            <option value="">Any</option>
            {CAL_OPTIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Break
          <select name="window" defaultValue={window?.start ?? ""} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground" disabled={!cal}>
            {windows.map((w) => (
              <option key={w.start} value={w.start}>
                {w.label} · {formatRange(w.start, w.end)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Child&apos;s age
          <input name="age" type="number" min={3} max={18} defaultValue={filters.age ?? ""} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground" />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Type
          <select name="category" defaultValue={filters.category ?? ""} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground">
            <option value="">Any</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Area
          <select name="area" defaultValue={filters.area ?? ""} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground">
            <option value="">Anywhere</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-col justify-end gap-2">
          <label className="flex items-center gap-2 text-xs text-muted">
            <input type="checkbox" name="ec" value="1" defaultChecked={filters.extendedCare} />
            Extended care
          </label>
          <button type="submit" className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white">
            Apply
          </button>
        </div>
        <input type="hidden" name="q" value={filters.q ?? ""} />
      </form>

      {matches && window ? (
        <>
          <section className="flex flex-col gap-3">
            <h2 className="font-semibold">
              {listed.length} camp{listed.length === 1 ? "" : "s"} with sessions during this break
            </h2>
            {listed.length === 0 && (
              <p className="text-sm text-muted">
                No listed sessions overlap these dates yet. Check the operators below, which run
                track-out camps but haven&apos;t published dates we&apos;ve captured.
              </p>
            )}
            <ul className="grid gap-3 md:grid-cols-2">
              {listed.map((m) => (
                <li key={m.camp.slug}>
                  <CampCard
                    camp={m.camp}
                    badge={
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                          m.coverage >= m.windowWeekdays
                            ? "bg-accent-soft text-accent"
                            : "bg-warn-soft text-warn"
                        }`}
                      >
                        {m.coverage}/{m.windowWeekdays} days
                      </span>
                    }
                  >
                    <ul className="mt-1 flex flex-col gap-0.5 text-xs text-muted">
                      {m.sessions.map(({ session }) => (
                        <li key={session.id}>
                          {formatRange(session.start, session.end)}
                          {session.label ? ` · ${session.label}` : ""}
                          {session.priceText ? ` · ${session.priceText}` : ""}
                        </li>
                      ))}
                    </ul>
                  </CampCard>
                </li>
              ))}
            </ul>
          </section>
          {unlisted.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="font-semibold">
                {unlisted.length} more run {window.kind === "summer" ? "summer" : "track-out"} camps
                (dates not yet listed)
              </h2>
              <ul className="grid gap-3 md:grid-cols-2">
                {unlisted.map((m) => (
                  <li key={m.camp.slug}>
                    <CampCard camp={m.camp} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      ) : (
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold">
            {camps.length} camp{camps.length === 1 ? "" : "s"}
          </h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {camps.map((c) => (
              <li key={c.slug}>
                <CampCard camp={c} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-muted">
        Missing a camp?{" "}
        <Link href="/" className="text-accent hover:underline">
          Operator submissions are coming.
        </Link>
      </p>
    </div>
  );
}
