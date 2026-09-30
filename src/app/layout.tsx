import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Track Out Raleigh", template: "%s · Track Out Raleigh" },
  description:
    "Find day camps in Raleigh and Wake County that match your kid's track-out weeks, breaks, and summer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border bg-surface">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-semibold tracking-tight">
              Track Out <span className="text-accent">Raleigh</span>
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/camps" className="hover:text-accent">
                Camps
              </Link>
              <Link href="/tracks/track1" className="hover:text-accent">
                Calendars
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-muted">
            Calendar dates from WCPSS 2026-27 board-approved calendars. Camp details come from each
            operator&apos;s site and can change. Confirm dates and prices before registering.
          </div>
        </footer>
      </body>
    </html>
  );
}
