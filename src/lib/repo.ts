// Data access boundary. Today this reads typed seed files; swap the
// implementation for Supabase when operator submissions arrive.
import type { Camp, CampCategory } from "@/lib/types";
import { camps } from "@/data/camps";

export const CATEGORIES: { id: CampCategory; label: string }[] = [
  { id: "general", label: "General day camp" },
  { id: "sports", label: "Sports" },
  { id: "stem", label: "STEM & coding" },
  { id: "arts", label: "Arts & crafts" },
  { id: "theatre", label: "Theatre & music" },
  { id: "nature", label: "Nature & science" },
  { id: "academic", label: "Academic" },
];

export const categoryLabel = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label])) as Record<
  CampCategory,
  string
>;

export async function getCamps(): Promise<Camp[]> {
  return camps;
}

export async function getCamp(slug: string): Promise<Camp | undefined> {
  return camps.find((c) => c.slug === slug);
}

export async function getAreas(): Promise<string[]> {
  return [...new Set(camps.map((c) => c.area).filter((a): a is string => !!a))].sort();
}
