import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ageText } from "@/components/CampCard";
import { allCalendars, formatRange, upcomingWindows } from "@/lib/calendar";
import { matchCampsToWindow } from "@/lib/match";
import { categoryLabel, getCamp, getCamps } from "@/lib/repo";

export async function generateStaticParams() {
  return (await getCamps()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/camps/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const camp = await getCamp(slug);
  return { title: camp ? camp.name : "Camp" };
}

export default async function CampPage(props: PageProps<"/camps/[slug]">) {
  const { slug } = await props.params;
  const camp = await getCamp(slug);
  if (!camp) notFound();

  const coverage = allCalendars()
    .map((cal) => ({
      cal,
      windows: upcomingWindows(cal)
        .map((w) => ({ w, m: matchCampsToWindow([camp], w)[0] }))
        .filter((x) => x.m && !x.m.unlisted),
    }))
    .filter((x) => x.windows.length > 0);

  const facts: [string, string | null][] = [
    ["Ages", ageText(camp)],
    ["Price", camp.priceText],
    ["Hours", camp.hours],
    ["Extended care", camp.extendedCare === null ? null : camp.extendedCare ? "Yes" : "No"],
    ["Location", camp.address ?? camp.area],
    ["Type", categoryLabel[camp.category]],
  ];

  return (
    <article className="flex max-w-3xl flex-col gap-6">
      <div>
        <Link href="/camps" className="text-sm text-accent hover:underline">
          ← All camps
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{camp.name}</h1>
        <p className="text-muted">{camp.operator}</p>
      </div>

      <p>{camp.description}</p>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        {facts
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
      </dl>

      <a
        href={camp.registrationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-fit rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
      >
        Register on operator site ↗
      </a>

      {camp.sessions.length > 0 && (
        <section>
          <h2 className="font-semibold">Sessions</h2>
          <ul className="mt-2 flex flex-col gap-1 text-sm">
            {camp.sessions.map((s) => (
              <li key={s.id} className="flex flex-wrap gap-x-3">
                <span>{formatRange(s.start, s.end)}</span>
                {s.label && <span className="text-muted">{s.label}</span>}
                {s.hours && <span className="text-muted">{s.hours}</span>}
                {s.priceText && <span className="text-muted">{s.priceText}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {coverage.length > 0 && (
        <section>
          <h2 className="font-semibold">Covers these breaks</h2>
          <ul className="mt-2 flex flex-col gap-2 text-sm">
            {coverage.map(({ cal, windows }) => (
              <li key={cal.id}>
                <span className="font-medium">{cal.shortName}:</span>{" "}
                {windows.map(({ w, m }, i) => (
                  <span key={w.start}>
                    {i > 0 && ", "}
                    <Link href={`/camps?cal=${cal.id}&window=${w.start}`} className="text-accent hover:underline">
                      {w.label}
                    </Link>{" "}
                    <span className="text-muted">
                      ({m.coverage}/{m.windowWeekdays} days)
                    </span>
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </section>
      )}

      {camp.notes && <p className="text-sm text-muted">{camp.notes}</p>}
      <p className="text-xs text-muted">
        Source:{" "}
        <a href={camp.sourceUrl} className="hover:underline" target="_blank" rel="noopener noreferrer">
          {new URL(camp.sourceUrl).hostname}
        </a>
      </p>
    </article>
  );
}
