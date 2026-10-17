"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Goal } from "lucide-react";
import { DIRECTIONS_URL, PHONE_TEL, TRYOUTS_HREF } from "@/lib/site";

interface NavbarProps {
  brandLogo?: ReactNode;
}

export default function Navbar({ brandLogo }: NavbarProps) {
  return (
    // right-scroll-bar-position: while the booking sheet is open the page's
    // scrollbar disappears and the viewport widens. Radix pads the body to
    // compensate but cannot reach fixed elements, so without this class the
    // navbar would jump sideways just as the sheet starts sliding in.
    <header className="site-nav right-scroll-bar-position font-playfair fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className="pointer-events-auto flex items-center justify-between w-full max-w-4xl px-4 py-3
                   bg-white/70 backdrop-blur-xl backdrop-saturate-150 border border-white/50
                   shadow-[0_8px_32px_0_rgba(18,30,52,0.08)] rounded-full transition-all"
        aria-label="Main navigation"
      >
        <div className="flex-shrink-0 flex items-center">
          {brandLogo ?? (
            <Link href="/" className="relative flex items-center group">
              <div className="relative w-10 h-10 overflow-hidden rounded-full border border-white/60 shadow-sm transition-transform group-hover:scale-105">
                <Image
                  src="/assets/icon.png"
                  alt="K-Arena Logo"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <span className="ml-3 font-bold text-[#121e34] tracking-wide hidden sm:block uppercase">
                K-Arena
              </span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href={TRYOUTS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-[#121e34] hover:bg-[#1f4b50]
                       text-white text-[13px] font-semibold rounded-full transition-all duration-300
                       shadow-md hover:shadow-lg hover:-translate-y-0.5
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88b03f] focus-visible:ring-offset-2"
          >
            <Goal className="w-4 h-4 text-[#88b03f] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" aria-hidden="true" />
            <span>Tryouts</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5" aria-hidden="true">
              <span className="tryouts-ping absolute inline-flex h-full w-full rounded-full bg-[#88b03f] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#88b03f]" />
            </span>
          </a>

          <DirectionsCall />
        </div>
      </nav>
    </header>
  );
}

/**
 * Directions and Call as one gooey, figure-8 shaped control.
 *
 * The two coloured circles live in a layer that an SVG "goo" filter blurs and
 * then thresholds, which is what fuses them into a single droplet with a
 * bridging neck (and blends the two colours across it). The links, icons and
 * labels sit in a separate layer on top, so they stay crisp and clickable. On
 * hover the lobes pull apart and the neck thins out like a stretching droplet.
 * Without filter support you simply get two touching circles.
 */
function DirectionsCall() {
  return (
    <div className="goo-pair">
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          {/* Blur, then snap the alpha to a hard edge: the blurred overlap becomes
              a solid neck whose colour blends from teal to lime. Deliberately no
              feComposite of the sharp originals on top, which would redraw each
              circle's edge inside the overlap and undo the merge. */}
          <filter id="nav-goo" x="-30%" y="-60%" width="160%" height="220%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" />
            <feColorMatrix
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
            />
          </filter>
        </defs>
      </svg>

      <div className="goo-shapes" aria-hidden="true">
        <span className="goo-lobe goo-a bg-[#1f4b50]" />
        <span className="goo-lobe goo-b bg-[#88b03f]" />
      </div>

      <a
        href={DIRECTIONS_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get directions to K-Arena"
        className="goo-link goo-a"
      >
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="goo-tip" aria-hidden="true">Directions</span>
      </a>

      <a href={PHONE_TEL} aria-label="Call K-Arena" className="goo-link goo-b">
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span className="goo-tip" aria-hidden="true">Call</span>
      </a>
    </div>
  );
}
