import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CALENDAR_IDS, formatDate, formatRange, getCalendar, isCalendarId, todayIso, weekdayCount } from "@/lib/calendar";

export const revalidate = 3600;

export function generateStaticParams() {
  return CALENDAR_IDS.map((id) => ({ id }));
}

export async function generateMetadata(props: PageProps<"/tracks/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  return { title: isCalendarId(id) ? getCalendar(id).name : "Calendar" };
}

export default async function TrackPage(props: PageProps<"/tracks/[id]">) {
  const { id } = await props.params;
  if (!isCalendarId(id)) notFound();
  const cal = getCalendar(id);
  const today = todayIso();

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <nav className="flex flex-wrap gap-2 text-sm">
        {CALENDAR_IDS.map((c) => (
          <Link
            key={c}
            href={`/tracks/${c}`}
            className={`rounded-full border px-3 py-1 ${
              c === id ? "border-accent bg-accent-soft text-accent" : "border-border hover:border-accent"
            }`}
          >
            {getCalendar(c).shortName}
          </Link>
        ))}
      </nav>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{cal.name}</h1>
        <p className="text-muted">
          {cal.schoolYear} · First day {formatDate(cal.firstDay, true)} · Last day{" "}
          {formatDate(cal.lastDay, true)}
        </p>
      </div>

      <table className="w-full text-sm">
        <thead className="text-left text-xs text-muted">
          <tr>
            <th className="py-1 pr-3 font-medium">Break</th>
            <th className="py-1 pr-3 font-medium">Dates</th>
            <th className="py-1 pr-3 font-medium">Weekdays</th>
            <th className="py-1 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {cal.breaks.map((b) => {
            const days = weekdayCount(b.start, b.end);
            const past = b.end < today;
            return (
              <tr key={b.start} className={`border-t border-border ${past ? "text-muted" : ""}`}>
                <td className="py-2 pr-3">
                  {b.label}
                  {b.estimated && <span className="ml-1 text-xs text-warn">est.</span>}
                </td>
                <td className="py-2 pr-3">{formatRange(b.start, b.end)}</td>
                <td className="py-2 pr-3">{days}</td>
                <td className="py-2 text-right">
                  {!past && days >= 3 && (
                    <Link href={`/camps?cal=${id}&window=${b.start}`} className="text-accent hover:underline">
                      Camps
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="text-xs text-muted">
        Source:{" "}
        <a href={cal.sourceUrl} className="hover:underline" target="_blank" rel="noopener noreferrer">
          wcpss.net/calendars
        </a>
        . Summer end dates marked &ldquo;est.&rdquo; are projected until WCPSS publishes 2027-28.
      </p>
    </div>
  );
}
