import type { Break, Camp, CampSession } from "@/lib/types";
import { overlapWeekdays, weekdayCount } from "@/lib/calendar";

export interface SessionMatch {
  session: CampSession;
  overlap: number;
}

export interface CampMatch {
  camp: Camp;
  /** Weekdays of the window covered by at least one session */
  coverage: number;
  windowWeekdays: number;
  sessions: SessionMatch[];
  /** No session dates on file, but operator runs track-out camps */
  unlisted: boolean;
}

export function matchCampsToWindow(camps: Camp[], window: Break): CampMatch[] {
  const windowWeekdays = weekdayCount(window.start, window.end);
  const out: CampMatch[] = [];
  for (const camp of camps) {
    const sessions = camp.sessions
      .map((session) => ({ session, overlap: overlapWeekdays(session, window) }))
      .filter((m) => m.overlap > 0)
      .sort((a, b) => a.session.start.localeCompare(b.session.start));
    if (sessions.length > 0) {
      const days = new Set<string>();
      for (const { session } of sessions) {
        const s = session.start > window.start ? session.start : window.start;
        const e = session.end < window.end ? session.end : window.end;
        const d = new Date(s);
        const end = new Date(e);
        while (d <= end) {
          const day = d.getUTCDay();
          if (day !== 0 && day !== 6) days.add(d.toISOString().slice(0, 10));
          d.setUTCDate(d.getUTCDate() + 1);
        }
      }
      out.push({ camp, coverage: days.size, windowWeekdays, sessions, unlisted: false });
      continue;
    }
    const relevant = window.kind === "summer" ? camp.summerOffered : camp.trackOutOffered;
    if (relevant && camp.sessions.length === 0) {
      out.push({ camp, coverage: 0, windowWeekdays, sessions: [], unlisted: true });
    }
  }
  return out.sort((a, b) => b.coverage - a.coverage || a.camp.name.localeCompare(b.camp.name));
}

export interface CampFilters {
  age?: number;
  category?: string;
  area?: string;
  q?: string;
  extendedCare?: boolean;
}

export function filterCamps(camps: Camp[], f: CampFilters): Camp[] {
  const q = f.q?.trim().toLowerCase();
  return camps.filter((c) => {
    if (f.age !== undefined) {
      if (c.ageMin !== null && f.age < c.ageMin) return false;
      if (c.ageMax !== null && f.age > c.ageMax) return false;
    }
    if (f.category && c.category !== f.category) return false;
    if (f.area && c.area !== f.area) return false;
    if (f.extendedCare && c.extendedCare !== true) return false;
    if (q) {
      const hay = `${c.name} ${c.operator} ${c.description} ${c.area ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
