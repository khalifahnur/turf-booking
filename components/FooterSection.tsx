"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, SOCIAL_LINKS } from "@/lib/site";

/**
 * Each layer moves in its own slice of the reveal (see `.fx` in globals.css):
 * `start` is how far the footer must be uncovered before the layer begins, and
 * `span` how much further it takes to settle. The footer is uncovered from the
 * bottom up, so the wordmark goes first and the columns last.
 */
const fx = (start: number, span: number): CSSProperties =>
  ({ "--start": start, "--span": span }) as CSSProperties;

export default function FooterSection() {
  return (
    <footer
      style={{ backgroundColor: "#1f4b50" }}
      className="relative isolate w-full flex flex-col justify-between min-h-[100svh] overflow-hidden pt-10 lg:pt-15"
      aria-label="Site footer"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="fx-glow fx-glow-a" />
        <div className="fx-glow fx-glow-b" />
      </div>

      <div className="max-w-360 mx-auto w-full px-6 sm:px-8 lg:px-12 xl:px-16 flex-1 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.9fr_1fr_1fr_1fr] gap-7 sm:gap-10 xl:gap-14">
          <div className="fx fx-rise" style={fx(0.25, 0.45)}>
            <h3
              className="font-playfair font-semibold text-white mb-2.5 leading-tight"
              style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)" }}
            >
              Get Exclusive Updates <br />
              <span className="font-vibes text-[#88b03f] font-normal text-[2.5rem] leading-[0.5] relative top-1 lowercase">
                and offers
              </span>
            </h3>
            <p className="font-playfair text-white/50 text-sm mb-5 sm:mb-7 mt-3 max-w-xs leading-relaxed">
              Be the first to know about upcoming training sessions, special
              events,
            </p>

            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map(({ name, src: componentSrc, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform duration-300 hover:-translate-y-1 hover:scale-110 cursor-pointer group"
                  aria-label={`Follow us on ${name}`}
                >
                  <Image
                    src={componentSrc}
                    alt={`${name} icon`}
                    width={16}
                    height={16}
                    className="w-6 h-6"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="fx fx-rise pt-1" style={fx(0.32, 0.45)}>
            <p className="font-playfair text-white/45 text-sm mb-1">
              Have a question or feedback?
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="block font-playfair text-white font-semibold text-[15px] mb-5 sm:mb-7 break-all hover:text-[#88b03f] transition-colors"
            >
              {EMAIL}
            </a>
            <p className="font-playfair text-white/45 text-sm mb-1">
              Give us a call
            </p>
            <a
              href={PHONE_TEL}
              className="block font-playfair text-white font-extrabold text-xl tracking-tight hover:text-[#88b03f] transition-colors"
            >
              {PHONE_DISPLAY}
            </a>
          </div>

          <div className="fx fx-rise" style={fx(0.39, 0.45)}>
            <h4 className="font-playfair text-white font-extrabold text-xs uppercase tracking-[0.14em] mb-3 sm:mb-5">
              Facilities
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Football Pitch", href: "#" },
                { label: "Holiday Camp", href: "/camp" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-playfair text-white/48 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="fx fx-rise" style={fx(0.46, 0.45)}>
            <h4 className="font-playfair text-white font-extrabold text-xs uppercase tracking-[0.14em] mb-3 sm:mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {["FAQ's", "Contact Us", "Help Center"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-playfair text-white/48 text-sm hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="fx fx-rise font-playfair mt-6 sm:mt-14 pt-5 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[13px] text-white/32 pb-4 sm:pb-10"
          style={fx(0.1, 0.4)}
        >
          <p>
            K-Arena &copy; {new Date().getFullYear()} All rights reserved
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="hover:text-white/65 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white/65 transition-colors">
              Terms &amp; Conditions
            </a>
            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                })
              }
              aria-label="Back to top"
              className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#88b03f] hover:bg-[#88b03f] hover:text-white"
            >
              <svg className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className="w-full flex justify-center select-none overflow-hidden pb-2 sm:pb-6 lg:pb-0"
        aria-hidden="true"
      >
        <div className="fx fx-wordmark" style={fx(0, 0.6)}>
          <p
            className="font-playfair font-extrabold leading-none tracking-tighter uppercase text-center bg-clip-text text-transparent pb-2 sm:pb-4"
            style={{
              fontSize: "clamp(3.5rem, min(16vw, 22svh), 13rem)",
              // The photo fills the letters. The gradient underneath only shows
              // if the photo fails to load (blocked, offline), so the name never
              // goes invisible as text-transparent otherwise would.
              backgroundImage: `url("https://images.unsplash.com/photo-1584120075590-9876c53cb48c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"), linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.12) 100%)`,
              backgroundSize: "cover, cover",
              backgroundPosition: "center, center",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            K-ARENA
          </p>
        </div>
      </div>

      <div aria-hidden="true" className="fx-dim pointer-events-none absolute inset-0 bg-[#0b1a1d]" />
    </footer>
  );
}
