"use client";

import type { ReactNode } from "react";
import NavActions from "./Navaction";
import Link from "next/link";
import Image from "next/image";
export const NAV_LINKS = ["Home", "About", "Service", "Court", "Shop"] as const;

interface NavbarProps {
  brandLogo?: ReactNode;
  navActions?: ReactNode;
}

export default function Navbar({ brandLogo, navActions }: NavbarProps) {
  return (
    <header className="relative z-20 w-full shrink-0">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-6">
        <nav
          className="flex items-center justify-between gap-4 lg:gap-8"
          aria-label="Main navigation"
        >
          {brandLogo ?? (
            <Link href="/" className="shrink-0 group block">
              <div className="relative flex items-center justify-center w-24 sm:w-32 md:w-40 lg:w-48 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/assets/logo.png"
                  alt="Muranga Seals"
                  width={1000}
                  height={800}
                  priority // Adding priority is highly recommended for logos above the fold
                  className="w-full h-auto object-contain"
                />
              </div>
            </Link>
          )}

          {navActions ?? <NavActions />}
        </nav>
      </div>
    </header>
  );
}
