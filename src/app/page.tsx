import Link from "next/link";
import { CalendarPicker } from "@/components/CalendarPicker";
import { allCalendars, formatRange, nextWindow, weekdayCount } from "@/lib/calendar";

export const revalidate = 3600;

export default function Home() {
  const cals = allCalendars();
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Camps for the weeks your kid is out of school.
          </h1>
          <p className="mt-3 text-muted">
            Wake County runs four year-round tracks plus the traditional calendar. Pick yours and see
            only the Raleigh-area camps that cover your track-out dates.
          </p>
        </div>
        <CalendarPicker />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Next break, by calendar</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cals.map((cal) => {
            const w = nextWindow(cal);
            return (
              <li key={cal.id} className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-medium">{cal.shortName}</h3>
                  <Link href={`/tracks/${cal.id}`} className="text-xs text-accent hover:underline">
                    Full calendar
                  </Link>
                </div>
                {w ? (
                  <>
                    <p className="mt-2 text-sm">{w.label}</p>
                    <p className="text-sm text-muted">
                      {formatRange(w.start, w.end)} · {weekdayCount(w.start, w.end)} weekdays
                    </p>
                    <Link
                      href={`/camps?cal=${cal.id}&window=${w.start}`}
                      className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
                    >
                      Camps for this break →
                    </Link>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-muted">No upcoming breaks on file.</p>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
