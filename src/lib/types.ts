export type CalendarId = "traditional" | "track1" | "track2" | "track3" | "track4";

export type BreakKind = "track-out" | "summer" | "winter" | "spring" | "thanksgiving" | "holiday" | "workday";

export interface Break {
  /** ISO date, first weekday out of school */
  start: string;
  /** ISO date, last weekday out of school (inclusive) */
  end: string;
  kind: BreakKind;
  label: string;
  /** True when the end date is a projection past the published calendar */
  estimated?: boolean;
}

export interface SchoolCalendar {
  id: CalendarId;
  name: string;
  shortName: string;
  schoolYear: string;
  firstDay: string;
  lastDay: string;
  sourceUrl: string;
  breaks: Break[];
}

export type CampCategory = "sports" | "stem" | "arts" | "nature" | "general" | "academic" | "theatre";

export interface CampSession {
  id: string;
  start: string;
  end: string;
  /** e.g. "9:00am-4:00pm" */
  hours?: string;
  priceText?: string;
  label?: string;
}

export interface Camp {
  slug: string;
  name: string;
  operator: string;
  category: CampCategory;
  description: string;
  ageMin: number | null;
  ageMax: number | null;
  priceText: string | null;
  hours: string | null;
  extendedCare: boolean | null;
  address: string | null;
  area: string | null;
  registrationUrl: string;
  sourceUrl: string;
  trackOutOffered: boolean;
  summerOffered: boolean;
  notes: string | null;
  sessions: CampSession[];
}
