"use client";

import type { ReactNode } from "react";
import { DefaultHeroSubtitle, DefaultHeroTitle, DefaultMembershipWidget } from "./Herodefaults";


interface HeroSectionProps {
  navbar: ReactNode;
  bookingCard: ReactNode;
  heroTitle?: ReactNode;
  heroSubtitle?: ReactNode;
  heroExtra?: ReactNode;
  membershipWidget?: ReactNode;
  slideIndicator?: ReactNode;
}

export default function HeroSection({
  navbar,
  bookingCard,
  heroTitle,
  heroSubtitle,
  heroExtra,
  membershipWidget,
  slideIndicator,
}: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col"
      aria-label="Hero — pitch booking"
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1584120075590-9876c53cb48c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        {/* <div className="absolute inset-0 bg-linear-to-r from-black/93 via-black/72 to-black/28" />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" /> */}
      </div>
      {navbar}

      <div className="relative z-10 flex-1 flex flex-col">

        <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start max-w-360 mx-auto w-full px-6 sm:px-8 lg:px-12 xl:px-16 pt-10 lg:pt-16 pb-6 gap-10 lg:gap-12 xl:gap-20">
          <div className="flex-1 flex flex-col text-center lg:text-left lg:min-h-120 lg:justify-between lg:py-4">
            <div>
              {heroTitle ?? <DefaultHeroTitle />}

              <div className="mt-5 sm:mt-6">
                {heroSubtitle ?? <DefaultHeroSubtitle />}
              </div>
              {heroExtra && (
                <div className="mt-7">{heroExtra}</div>
              )}
            </div>
            {/* <div className="mt-12 lg:mt-0 flex justify-center lg:justify-start">
              {membershipWidget ?? <DefaultMembershipWidget />}
            </div> */}
          </div>

          <div className="w-full lg:w-110 xl:w-120 shrink-0">
            {bookingCard}
          </div>
        </div>
      </div>
    </section>
  );
}