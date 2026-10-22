import type { Metadata } from "next";
import { CalendarDays, Clock, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import CampRegistration from "@/components/camp/CampRegistration";
import { CAMP_DATES_LABEL, CAMP_NAME, CAMP_PROGRAMS, CAMP_WEEKS, isWeekOpen, todayInNairobi } from "@/lib/camp";
import { pageMetadata } from "@/lib/seo";
import { campJsonLd, jsonLdScript } from "@/lib/structured-data";

function campClosed(): boolean {
  const today = todayInNairobi();
  return CAMP_WEEKS.every((w) => !isWeekOpen(w, today));
}

export function generateMetadata(): Metadata {
  const closed = campClosed();
  return pageMetadata({
    title: closed ? `${CAMP_NAME} 2026` : `${CAMP_NAME} 2026: Register Online`,
    description: closed
      ? `The K-Arena ${CAMP_NAME}, ${CAMP_DATES_LABEL}, off Ngong Road in Nairobi, has finished. Call us to hear about the next one.`
      : `Register your child for the K-Arena ${CAMP_NAME}, ${CAMP_DATES_LABEL}, off Ngong Road in Nairobi. Football skills training, matches and coaching, full or half day. Pay by M-Pesa.`,
    path: "/camp",
    sharedImage: false,
  });
}

export const dynamic = "force-dynamic";

export default function CampPage() {
  const today = todayInNairobi();
  const closed = campClosed();

  return (
    <div className="camp-page min-h-screen bg-[#f8f5f2] font-playfair text-[#2c2825]">
      <Navbar />

      <main>
        <div className="relative isolate overflow-hidden bg-[#1f4b50] px-4 pb-16 pt-20 text-white sm:px-6 sm:pb-20 sm:pt-24 lg:pt-28">
          <div className="mx-auto max-w-5xl">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/20 px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90">
              <span
                className={`h-1.5 w-1.5 rounded-full ${closed ? "bg-white/50" : "bg-[#88b03f]"}`}
                aria-hidden="true"
              />
              {closed ? "Registration closed" : "Registration open"}
            </p>

            <h1 className="mt-3 max-w-2xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
              {CAMP_NAME}
              <span className="mt-1 block font-vibes text-2xl font-normal leading-none text-[#c4e08a] [word-spacing:0.18em] sm:text-3xl lg:text-4xl">
                {CAMP_DATES_LABEL}
              </span>
            </h1>

            <p className="mt-2.5 max-w-lg font-sans text-xs leading-relaxed text-white/75 sm:text-[13px]">
              {closed
                ? "Seven weeks of football skills, matches and new friendships with professional coaches. This year's camp has finished."
                : "Seven weeks of football skills, matches and new friendships with professional coaches. Register your child in two quick steps and pay securely with M-Pesa."}
            </p>

            <ul className="mt-4 flex flex-wrap gap-1.5 font-sans text-[11px] font-medium text-white/90 sm:gap-2 sm:text-xs">
              <li className="inline-flex items-center gap-1.5 rounded-lg bg-white/8 px-2.5 py-1 ring-1 ring-white/12">
                <CalendarDays className="h-3.5 w-3.5 text-[#88b03f]" aria-hidden="true" /> Mon–Fri
              </li>
              {CAMP_PROGRAMS.map((p) => (
                <li key={p.id} className="inline-flex items-center gap-1.5 rounded-lg bg-white/8 px-2.5 py-1 ring-1 ring-white/12">
                  <Clock className="h-3.5 w-3.5 text-[#88b03f]" aria-hidden="true" /> {p.label} ({p.hours})
                </li>
              ))}
              <li className="inline-flex items-center gap-1.5 rounded-lg bg-white/8 px-2.5 py-1 ring-1 ring-white/12">
                <Users className="h-3.5 w-3.5 text-[#88b03f]" aria-hidden="true" /> Safe &amp; coached
              </li>
            </ul>
          </div>
        </div>

        <div className="relative z-10 -mt-8 pb-12 font-sans sm:-mt-10 sm:pb-16">
          <CampRegistration today={today} />
        </div>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(campJsonLd({ closed })) }} />
      <FooterSection />
    </div>
  );
}