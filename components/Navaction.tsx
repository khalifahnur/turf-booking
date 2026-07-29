"use client";

import Link from "next/link";
import { useState } from "react";

const bubbleBaseClasses =
  "relative overflow-hidden inline-flex items-center rounded-full cursor-pointer tap-highlight-transparent select-none text-decoration-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:shadow-lg active:scale-95 active:translate-y-0.5 active:duration-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-2";

const glassBefore =
  "before:content-[''] before:absolute before:inset-0 before:rounded-inherit before:bg-gradient-to-b before:from-white/25 before:via-white/5 before:to-transparent before:pointer-events-none before:z-0 before:transition-opacity before:duration-220 hover:before:opacity-100";

const glassAfter =
  "after:content-[''] after:absolute after:top-[8%] after:left-[9%] after:w-[36%] after:h-[40%] after:border-radius-[50%] after:bg-[radial-gradient(ellipse_at_35%_30%,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0.10)_45%,rgba(255,255,255,0)_100%)] after:blur-[3.5px] after:pointer-events-none after:z-0";

const orbBaseClasses =
  "relative rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-inner-gloss border border-white/10 transition-transform duration-300 group-active:scale-90";
const orbGlossClasses =
  "absolute top-[7%] left-[13%] w-[58%] h-[44%] rounded-full bg-[radial-gradient(ellipse_at_35%_35%,rgba(255,255,255,0.48)_0%,rgba(255,255,255,0.10)_55%,rgba(255,255,255,0)_100%)] blur-[1.8px] pointer-events-none z-10";

export default function NavActions() {
  const [isCalling, setIsCalling] = useState(false);
  const phoneNumber = "+254700000000";

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
      <Link
        href="https://www.google.com/maps/dir/?api=1&destination=Lycan+international+limited,+Kabarnet+road,+off+Ngong+Rd"
        target="_blank"
        rel="noopener noreferrer"
        className={`${bubbleBaseClasses} ${glassBefore} ${glassAfter} group gap-1.5 xl:gap-2 p-1.5 xl:pl-5 xl:pr-5 xl:py-2.5 text-xs xl:text-[13.5px] font-medium tracking-tight text-white/90 bg-white/5 border border-white/15 shadow-bubble hover:bg-white/10 hover:border-white/25 hidden xl:inline-flex`}
        aria-label="Get directions to St. Sebastian Sports Academy"
      >
        <div
          className={`${orbBaseClasses} group-active:scale-95 size-7 xl:size-8`}
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(148deg, #475569 0%, #1e293b 55%, #0f172a 100%)",
            boxShadow:
              "inset 0 1.5px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 1px 3px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className={`${orbGlossClasses}`} />
          <svg
            aria-hidden="true"
            className="relative z-10 size-3.5 xl:size-4 text-white/80"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <span className="hidden xl:inline pr-1">Get Directions</span>
      </Link>

      <Link
        href="tel:+254712633130"
        className={`${bubbleBaseClasses} ${glassBefore} ${glassAfter} group gap-2 sm:gap-2.5 p-1.5 sm:pl-5 sm:pr-2 sm:py-2 text-white bg-white/10 border border-white/20 shadow-bubble-strong hover:bg-white/15 hover:border-white/30 text-xs sm:text-[13.5px] font-bold`}
        aria-label="Contact St. Sebastian Sports Academy"
      >
        <span className="pl-1 sm:pl-0">
          {isCalling ? "Connecting..." : "Contact"}
        </span>
        <div
          className={`${orbBaseClasses} size-7 sm:size-8`}
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(148deg, #4ade80 0%, #16a34a 55%, #14532d 100%)",
            boxShadow:
              "inset 0 1.5px 0 rgba(255, 255, 255, 0.40), inset 0 -1px 0 rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.14), 0 3px 10px rgba(22, 163, 74, 0.50), 0 1px 3px rgba(0, 0, 0, 0.22)",
          }}
        >
          <div className={`${orbGlossClasses}`} />
          {isCalling ? (
            <div className="relative z-10 size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg
              className="relative z-10 size-3.5 sm:size-4"
              fill="white"
              viewBox="0 0 24 24"
            >
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.01L6.62 10.79z" />
            </svg>
          )}
        </div>
      </Link>
    </div>
  );
}
