import type { Metadata } from "next";
import { Smartphone, Trophy, Users, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import TournamentRegistration from "@/components/tournament/TournamentRegistration";
import { TOURNAMENT_NAME } from "@/lib/tournament";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `${TOURNAMENT_NAME}: U10, U15 and Adults, register your team`,
  description:
    "Register your academy or club for the K-Arena football tournament in Nairobi, off Ngong Road: youth (U10 and U15) and adults. Limited places in each category, first come first served. Pay by M-Pesa.",
  path: "/tournament",
});

export default function TournamentPage() {
  return (
    <div className="camp-page min-h-screen bg-[#f8f5f2] font-playfair text-[#2c2825]">
      <Navbar />

      <main>
        <div className="relative isolate overflow-hidden bg-[#1f4b50] px-4 pb-16 pt-20 text-white sm:px-6 sm:pb-20 sm:pt-24 lg:pt-28">
          <div className="mx-auto max-w-5xl">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/20 px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-[#88b03f]" aria-hidden="true" />
              Team registration
            </p>

            <h1 className="mt-3 max-w-2xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
              {TOURNAMENT_NAME}
              <span className="mt-1 block font-vibes text-2xl font-normal leading-none text-[#c4e08a] [word-spacing:0.18em] sm:text-3xl lg:text-4xl">
                Youth &amp; Adults
              </span>
            </h1>

            <p className="mt-2.5 max-w-lg font-sans text-xs leading-relaxed text-white/75 sm:text-[13px]">
              Enter your academy or club in the youth categories (U10 and U15), the adults, or several. Places are
              limited in each category and go to whoever registers first. Pay securely with M-Pesa.
            </p>

            <ul className="mt-4 flex flex-wrap gap-1.5 font-sans text-[11px] font-medium text-white/90 sm:gap-2 sm:text-xs">
              <li className="inline-flex items-center gap-1.5 rounded-lg bg-white/8 px-2.5 py-1 ring-1 ring-white/12">
                <Trophy className="h-3.5 w-3.5 text-[#88b03f]" aria-hidden="true" /> U10, U15 and Adults
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-lg bg-white/8 px-2.5 py-1 ring-1 ring-white/12">
                <Users className="h-3.5 w-3.5 text-[#88b03f]" aria-hidden="true" /> Limited places
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-lg bg-white/8 px-2.5 py-1 ring-1 ring-white/12">
                <Zap className="h-3.5 w-3.5 text-[#88b03f]" aria-hidden="true" /> First come, first place
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-lg bg-white/8 px-2.5 py-1 ring-1 ring-white/12">
                <Smartphone className="h-3.5 w-3.5 text-[#88b03f]" aria-hidden="true" /> Pay by M-Pesa
              </li>
            </ul>
          </div>
        </div>

        <div className="relative z-10 -mt-8 pb-12 font-sans sm:-mt-10 sm:pb-16">
          <TournamentRegistration />
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
