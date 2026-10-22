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
              {/* <span className="ml-3 font-bold text-[#121e34] tracking-wide hidden sm:block uppercase">
                K-Arena
              </span> */}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <DirectionsCall />
        </div>
      </nav>
    </header>
  );
}

function DirectionsCall() {
  return (
    <div className="goo-pair">
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
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
