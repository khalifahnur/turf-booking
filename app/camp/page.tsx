import type { Metadata } from "next";
import { CalendarDays, Clock, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import CampRegistration from "@/components/camp/CampRegistration";
import { CAMP_DATES_LABEL, CAMP_NAME, CAMP_PROGRAMS, todayInNairobi } from "@/lib/camp";
import { pageMetadata } from "@/lib/seo";
import { campJsonLd, jsonLdScript } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: `${CAMP_NAME} 2026: Register Online`,
  description: `Register your child for the K-Arena ${CAMP_NAME}, ${CAMP_DATES_LABEL}, off Ngong Road in Nairobi. Football skills training, matches and coaching, full or half day. Pay by M-Pesa.`,
  path: "/camp",
});

// The form needs today's date (to close weeks that have ended), so this page is
// drawn per request rather than frozen at build time.
export const dynamic = "force-dynamic";

export default function CampPage() {
  return (
    <div className="camp-page min-h-screen bg-[#f8f5f2] font-playfair text-[#2c2825]">
      <Navbar />

      <header className="relative isolate overflow-hidden rounded-b-[40px] bg-[#1f4b50] px-6 pb-28 pt-28 text-white lg:rounded-b-[60px] lg:pb-28 lg:pt-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-24 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(136,176,63,0.42),rgba(136,176,63,0)_68%)]" />
          <div className="absolute -bottom-40 -left-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(35,62,149,0.4),rgba(35,62,149,0)_68%)]" />
        </div>

        <div className="mx-auto max-w-6xl lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-[#88b03f]" aria-hidden="true" />
            Registration open
          </p>

          <h1 className="mt-4 max-w-3xl text-[2.2rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            {CAMP_NAME}
            <span className="mt-2 block font-vibes text-[2.8rem] font-normal leading-[1.1] text-[#88b03f] [word-spacing:0.22em] sm:text-6xl lg:text-[4.2rem]">
              {CAMP_DATES_LABEL}
            </span>
          </h1>

          <p className="mt-4 max-w-xl font-sans text-[15px] leading-relaxed text-white/80 sm:text-base">
            Seven weeks of football skills, matches and new friendships with professional coaches. Register your child in
            two quick steps and pay securely with M-Pesa.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2.5 font-sans text-[13px] font-semibold">
            <li className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 ring-1 ring-white/15">
              <CalendarDays className="h-4 w-4 text-[#88b03f]" aria-hidden="true" /> Monday to Friday
            </li>
            {CAMP_PROGRAMS.map((p) => (
              <li key={p.id} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 ring-1 ring-white/15">
                <Clock className="h-4 w-4 text-[#88b03f]" aria-hidden="true" /> {p.label} {p.hours}
              </li>
            ))}
            <li className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 ring-1 ring-white/15">
              <Users className="h-4 w-4 text-[#88b03f]" aria-hidden="true" /> Safe &amp; supportive
            </li>
          </ul>
        </div>
      </header>

      <main className="relative z-10 -mt-16 pb-16 font-sans lg:-mt-24 lg:pb-24">
        <CampRegistration today={todayInNairobi()} />
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(campJsonLd()) }} />
      <FooterSection />
    </div>
  );
}
