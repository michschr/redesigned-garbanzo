import type { CalendarId } from "@/lib/types";

// Source: https://www.wcpss.net/enrollment-resources/~board/enrollment-resources/post/view-wcpss-year-round-schools
export type TrackType = "multi-track" | "track-4-only" | "single-track";

export interface School {
  name: string;
  level: "elementary" | "middle" | "high";
  trackType: TrackType;
}

export const yearRoundSchools: School[] = [
  { name: "Adams", level: "elementary", trackType: "multi-track" },
  { name: "Alston Ridge", level: "elementary", trackType: "multi-track" },
  { name: "Alston Ridge", level: "middle", trackType: "multi-track" },
  { name: "Ballentine", level: "elementary", trackType: "multi-track" },
  { name: "Banks Road", level: "elementary", trackType: "track-4-only" },
  { name: "Barwell Road", level: "elementary", trackType: "track-4-only" },
  { name: "Brassfield", level: "elementary", trackType: "multi-track" },
  { name: "Brier Creek", level: "elementary", trackType: "multi-track" },
  { name: "Carpenter", level: "elementary", trackType: "multi-track" },
  { name: "Durant Road", level: "elementary", trackType: "track-4-only" },
  { name: "Durant Road", level: "middle", trackType: "track-4-only" },
  { name: "Harris Creek", level: "elementary", trackType: "multi-track" },
  { name: "Herbert Akins Road", level: "elementary", trackType: "multi-track" },
  { name: "Herbert Akins Road", level: "middle", trackType: "multi-track" },
  { name: "Heritage", level: "elementary", trackType: "multi-track" },
  { name: "Heritage", level: "middle", trackType: "multi-track" },
  { name: "Hodge Road Magnet", level: "elementary", trackType: "track-4-only" },
  { name: "Holly Grove", level: "elementary", trackType: "multi-track" },
  { name: "Holly Grove", level: "middle", trackType: "multi-track" },
  { name: "Holly Springs", level: "elementary", trackType: "multi-track" },
  { name: "Jones Dairy", level: "elementary", trackType: "multi-track" },
  { name: "Lake Myra", level: "elementary", trackType: "track-4-only" },
  { name: "Laurel Park", level: "elementary", trackType: "multi-track" },
  { name: "Lockhart", level: "elementary", trackType: "track-4-only" },
  { name: "Lufkin Road", level: "middle", trackType: "multi-track" },
  { name: "Middle Creek", level: "elementary", trackType: "track-4-only" },
  { name: "Morrisville", level: "elementary", trackType: "multi-track" },
  { name: "North Forest Pines", level: "elementary", trackType: "track-4-only" },
  { name: "North Garner", level: "middle", trackType: "track-4-only" },
  { name: "Oak Grove", level: "elementary", trackType: "multi-track" },
  { name: "Olive Chapel", level: "elementary", trackType: "multi-track" },
  { name: "Parkside", level: "elementary", trackType: "multi-track" },
  { name: "Pleasant Grove", level: "elementary", trackType: "multi-track" },
  { name: "Pleasant Plains", level: "elementary", trackType: "multi-track" },
  { name: "Pleasant Union", level: "elementary", trackType: "track-4-only" },
  { name: "Rand Road", level: "elementary", trackType: "track-4-only" },
  { name: "Rex Road", level: "elementary", trackType: "multi-track" },
  { name: "Salem", level: "elementary", trackType: "multi-track" },
  { name: "Salem", level: "middle", trackType: "multi-track" },
  { name: "Sanford Creek", level: "elementary", trackType: "multi-track" },
  { name: "Sycamore Creek", level: "elementary", trackType: "multi-track" },
  { name: "Timber Drive", level: "elementary", trackType: "track-4-only" },
  { name: "Turner Creek", level: "elementary", trackType: "multi-track" },
  { name: "Vance", level: "elementary", trackType: "track-4-only" },
  { name: "Walnut Creek", level: "elementary", trackType: "track-4-only" },
  { name: "West Lake", level: "elementary", trackType: "track-4-only" },
  { name: "West Lake", level: "middle", trackType: "track-4-only" },
  { name: "Wilburn", level: "elementary", trackType: "track-4-only" },
  { name: "Willow Springs", level: "elementary", trackType: "multi-track" },
  { name: "Woods Creek", level: "elementary", trackType: "multi-track" },
];

export const levelLabel: Record<School["level"], string> = {
  elementary: "Elementary",
  middle: "Middle",
  high: "High",
};

export function schoolKey(s: School): string {
  return `${s.name}|${s.level}`;
}

export function schoolDisplayName(s: School): string {
  return `${s.name} ${levelLabel[s.level]}`;
}

/** Calendars a school can be on. */
export function calendarsForSchool(s: School): CalendarId[] {
  if (s.trackType === "track-4-only") return ["track4"];
  if (s.trackType === "multi-track") return ["track1", "track2", "track3", "track4"];
  return ["traditional"];
}
