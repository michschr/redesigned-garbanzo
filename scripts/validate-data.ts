// Sanity checks on seed data. Run: npm run check:data
import { calendars } from "../src/data/calendars";
import { camps } from "../src/data/camps";
import { toDate, weekdayCount } from "../src/lib/calendar";

const errors: string[] = [];
const ISO = /^\d{4}-\d{2}-\d{2}$/;

function isWeekday(iso: string) {
  const d = toDate(iso).getUTCDay();
  return d !== 0 && d !== 6;
}

for (const cal of calendars) {
  let prevEnd = "";
  for (const b of cal.breaks) {
    const tag = `${cal.id} ${b.label} ${b.start}`;
    if (!ISO.test(b.start) || !ISO.test(b.end)) errors.push(`${tag}: bad ISO date`);
    if (b.start > b.end) errors.push(`${tag}: start after end`);
    if (!isWeekday(b.start)) errors.push(`${tag}: starts on a weekend`);
    if (!isWeekday(b.end)) errors.push(`${tag}: ends on a weekend`);
    if (b.start <= prevEnd) errors.push(`${tag}: overlaps or out of order`);
    if (b.kind === "track-out" && weekdayCount(b.start, b.end) < 10)
      errors.push(`${tag}: track-out shorter than 2 weeks`);
    prevEnd = b.end;
  }
  const inYear = cal.breaks.filter((b) => b.start > cal.firstDay && b.end < cal.lastDay);
  const trackOuts = inYear.filter((b) => b.kind === "track-out").length;
  if (cal.id !== "traditional" && trackOuts < 3)
    errors.push(`${cal.id}: expected at least 3 in-year track-outs, found ${trackOuts}`);
}

const slugs = new Set<string>();
for (const c of camps) {
  const tag = `camp ${c.slug}`;
  if (slugs.has(c.slug)) errors.push(`${tag}: duplicate slug`);
  slugs.add(c.slug);
  if (!/^[a-z0-9-]+$/.test(c.slug)) errors.push(`${tag}: slug must be kebab-case`);
  for (const u of [c.registrationUrl, c.sourceUrl]) {
    try {
      new URL(u);
    } catch {
      errors.push(`${tag}: bad url ${u}`);
    }
  }
  if (c.ageMin !== null && c.ageMax !== null && c.ageMin > c.ageMax) errors.push(`${tag}: ageMin > ageMax`);
  const ids = new Set<string>();
  for (const s of c.sessions) {
    if (ids.has(s.id)) errors.push(`${tag}: duplicate session id ${s.id}`);
    ids.add(s.id);
    if (!ISO.test(s.start) || !ISO.test(s.end) || s.start > s.end) errors.push(`${tag}: bad session ${s.id}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`ok: ${calendars.length} calendars, ${camps.length} camps`);
