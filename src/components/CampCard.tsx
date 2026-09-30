import Link from "next/link";
import type { Camp } from "@/lib/types";
import { categoryLabel } from "@/lib/repo";

export function ageText(c: Camp): string | null {
  if (c.ageMin === null && c.ageMax === null) return null;
  if (c.ageMin !== null && c.ageMax !== null) return `Ages ${c.ageMin}–${c.ageMax}`;
  if (c.ageMin !== null) return `Ages ${c.ageMin}+`;
  return `Up to age ${c.ageMax}`;
}

export function CampCard({
  camp,
  badge,
  children,
}: {
  camp: Camp;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const meta = [ageText(camp), camp.priceText, camp.area].filter(Boolean).join(" · ");
  return (
    <article className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold leading-tight">
            <Link href={`/camps/${camp.slug}`} className="hover:text-accent">
              {camp.name}
            </Link>
          </h3>
          <p className="text-sm text-muted">{camp.operator}</p>
        </div>
        {badge}
      </div>
      <p className="text-sm">{camp.description}</p>
      <p className="text-xs text-muted">
        {categoryLabel[camp.category]}
        {meta ? ` · ${meta}` : ""}
        {camp.extendedCare ? " · Extended care" : ""}
      </p>
      {children}
    </article>
  );
}
