"use client";

import type { ReactNode } from "react";
import { DefaultHeroSubtitle, DefaultHeroTitle, DefaultHeroExtra } from "./Herodefaults";

interface HeroSectionProps {
  navbar: ReactNode;
  bookingCard: ReactNode;
  heroTitle?: ReactNode;
  heroSubtitle?: ReactNode;
  heroExtra?: ReactNode;
}

export default function HeroSection({
  navbar,
  bookingCard,
  heroTitle,
  heroSubtitle,
  heroExtra,
}: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative w-full lg:h-[75vh] lg:min-h-[600px] xl:min-h-[650px] bg-[#1f4b50] overflow-hidden flex flex-col "
      aria-label="Hero — pitch booking"
    >
      <div 
        className="hidden lg:block absolute top-0 right-0 w-[62%] h-full z-0 overflow-hidden"
        style={{ 
          WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='-115 10 375 280' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 119 10 C 134 145 -113 28 40 290 L 259 290 L 260 10 Z' fill='black' /%3E%3C/svg%3E")`,
          maskImage: `url("data:image/svg+xml,%3Csvg viewBox='-115 10 375 280' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 119 10 C 134 145 -113 28 40 290 L 259 290 L 260 10 Z' fill='black' /%3E%3C/svg%3E")`,
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskPosition: 'left top',
          maskPosition: 'left top',    
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      >
        <img 
          src="https://images.unsplash.com/photo-1584120075590-9876c53cb48c?q=80&w=1470&auto=format&fit=crop" 
          alt="Hero background" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#121e34] via-[#121e34]/80 to-[#1f4b50]/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-t from-[#121e34] to-transparent opacity-80 lg:hidden" />
      </div>
      <div className="relative z-50">
        {navbar}
      </div>
      <div className="relative z-10 flex-1 w-full max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-16 flex flex-col lg:flex-row pt-20 mt-10 lg:pt-20 pb-10">
        <div className="w-full lg:w-[48%] flex flex-col justify-center h-full relative z-20">
          <div className="text-[#F8F5F2]">
            {heroTitle ?? <DefaultHeroTitle />}
          </div>
          <div className="mt-4 lg:mt-5 text-white/80">
            {heroSubtitle ?? <DefaultHeroSubtitle />}
          </div>
          
          <div className="mt-8">
            {heroExtra ?? <DefaultHeroExtra />}
          </div>
        </div>
       <div className="w-full lg:w-[52%] relative flex items-center lg:items-end justify-center lg:justify-end pb-4 lg:pb-24 xl:pb-32 mt-12 lg:mt-0 lg:pr-8 xl:pr-12 h-full">
  <div className="w-full max-w-[400px] xl:max-w-[420px] relative z-30">
    <div className="absolute -inset-4 bg-linear-to-r from-[#88b03f]/20 to-[#1f4b50]/40 blur-2xl rounded-[3rem] -z-10" />
    
    {bookingCard}
  </div>
</div>
      </div>
    </section>
  );
}