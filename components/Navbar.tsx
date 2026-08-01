"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  brandLogo?: ReactNode;
}

export default function Navbar({ brandLogo }: NavbarProps) {
  return (
    <header className="font-playfair fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
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

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://maps.app.goo.gl/uBNLHePXgTiTciC5A"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/60 hover:bg-white 
                       text-[#1f4b50] text-[13px] font-semibold rounded-full transition-colors 
                       border border-white/80 shadow-sm"
          >
            <svg
              className="w-4 h-4 text-[#1f4b50]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="hidden sm:inline">Directions</span>
          </a>

          <a
            href="tel:+254712633130"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#88b03f] hover:bg-[#769a35] 
                       text-white text-[13px] font-semibold rounded-full transition-all 
                       shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>Call</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
