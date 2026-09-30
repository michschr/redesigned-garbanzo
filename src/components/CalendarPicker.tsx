"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CalendarId } from "@/lib/types";
import {
  calendarsForSchool,
  schoolDisplayName,
  schoolKey,
  yearRoundSchools,
} from "@/data/schools";

const CAL_LABELS: Record<CalendarId, string> = {
  traditional: "Traditional",
  track1: "Track 1",
  track2: "Track 2",
  track3: "Track 3",
  track4: "Track 4",
};

const TRADITIONAL = "__traditional";

export function CalendarPicker({ initial }: { initial?: CalendarId }) {
  const router = useRouter();
  const [school, setSchool] = useState<string>(initial === "traditional" ? TRADITIONAL : "");
  const [cal, setCal] = useState<CalendarId | "">(initial ?? "");

  const options = useMemo<CalendarId[]>(() => {
    if (school === TRADITIONAL) return ["traditional"];
    const s = yearRoundSchools.find((x) => schoolKey(x) === school);
    if (!s) return ["traditional", "track1", "track2", "track3", "track4"];
    return calendarsForSchool(s);
  }, [school]);

  function onSchool(v: string) {
    setSchool(v);
    if (v === TRADITIONAL) setCal("traditional");
    else {
      const s = yearRoundSchools.find((x) => schoolKey(x) === v);
      const cals = s ? calendarsForSchool(s) : [];
      setCal(cals.length === 1 ? cals[0] : "");
    }
  }

  return (
    <form
      className="grid gap-3 sm:grid-cols-[1fr_auto_auto]"
      onSubmit={(e) => {
        e.preventDefault();
        if (cal) router.push(`/camps?cal=${cal}`);
      }}
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Your school</span>
        <select
          className="rounded-md border border-border bg-surface px-3 py-2"
          value={school}
          onChange={(e) => onSchool(e.target.value)}
        >
          <option value="">Pick a school (optional)</option>
          <option value={TRADITIONAL}>Traditional-calendar school</option>
          <optgroup label="Year-round schools">
            {yearRoundSchools.map((s) => (
              <option key={schoolKey(s)} value={schoolKey(s)}>
                {schoolDisplayName(s)}
                {s.trackType === "track-4-only" ? " (Track 4 only)" : ""}
              </option>
            ))}
          </optgroup>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Calendar</span>
        <select
          className="rounded-md border border-border bg-surface px-3 py-2"
          value={cal}
          onChange={(e) => setCal(e.target.value as CalendarId)}
          required
        >
          <option value="">Choose</option>
          {options.map((id) => (
            <option key={id} value={id}>
              {CAL_LABELS[id]}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="self-end rounded-md bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        disabled={!cal}
      >
        Find camps
      </button>
    </form>
  );
}
