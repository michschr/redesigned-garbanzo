import type { Break, CalendarId, SchoolCalendar } from "@/lib/types";
import { calendarById, calendars } from "@/data/calendars";

export const CALENDAR_IDS: CalendarId[] = ["traditional", "track1", "track2", "track3", "track4"];

export function isCalendarId(v: unknown): v is CalendarId {
  return typeof v === "string" && (CALENDAR_IDS as string[]).includes(v);
}

export function getCalendar(id: CalendarId): SchoolCalendar {
  return calendarById[id];
}

export function allCalendars(): SchoolCalendar[] {
  return calendars;
}

/** Parse "YYYY-MM-DD" as a UTC date to avoid timezone drift. */
export function toDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function todayIso(): string {
  return toIso(new Date());
}

/** Count weekdays (Mon-Fri) in an inclusive ISO date range. */
export function weekdayCount(start: string, end: string): number {
  let n = 0;
  const d = toDate(start);
  const e = toDate(end);
  while (d <= e) {
    const day = d.getUTCDay();
    if (day !== 0 && day !== 6) n++;
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return n;
}

/** Weekdays where both ranges overlap, or 0. */
export function overlapWeekdays(
  a: { start: string; end: string },
  b: { start: string; end: string },
): number {
  const start = a.start > b.start ? a.start : b.start;
  const end = a.end < b.end ? a.end : b.end;
  if (start > end) return 0;
  return weekdayCount(start, end);
}

/** Breaks a parent needs childcare for: multi-day spans only. */
export function careWindows(cal: SchoolCalendar, minWeekdays = 3): Break[] {
  return cal.breaks.filter((b) => weekdayCount(b.start, b.end) >= minWeekdays);
}

/** Care windows that end on or after `from` (default today). */
export function upcomingWindows(cal: SchoolCalendar, from = todayIso(), minWeekdays = 3): Break[] {
  return careWindows(cal, minWeekdays).filter((b) => b.end >= from);
}

export function nextWindow(cal: SchoolCalendar, from = todayIso()): Break | undefined {
  return upcomingWindows(cal, from)[0];
}

const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const fmtYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string, withYear = false): string {
  return (withYear ? fmtYear : fmt).format(toDate(iso));
}

export function formatRange(start: string, end: string): string {
  if (start === end) return formatDate(start, true);
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  return sameYear
    ? `${formatDate(start)} – ${formatDate(end, true)}`
    : `${formatDate(start, true)} – ${formatDate(end, true)}`;
}
