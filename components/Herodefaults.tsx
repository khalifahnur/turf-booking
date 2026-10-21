"use client";

import { useState } from "react";

export function DefaultHeroTitle() {
  return (
    <>
      <h1 className="font-playfair text-[#F8F5F2] leading-[1.05] text-[2rem] sm:text-[2rem] lg:text-[2.5rem] xl:text-[3rem] tracking-tight">
        Your pitch. Your people.<br />
        <span className="font-vibes text-[#88b03f] text-[3.5rem] sm:text-[4.2rem] lg:text-[4.8rem] xl:text-[5.2rem] font-normal leading-[0.3] relative top-1 ml-5">
          Your game
        </span>
      </h1>
    </>
  );
}

export function DefaultHeroSubtitle() {
  return (
    <p className="text-white/80 text-sm md:text-[15px] leading-relaxed max-w-[380px] font-medium mt-5">
      Bring your five-a-side crew, rally your workmates, or get the team together for training. Book your slot at K-Arena and let the football begin.
    </p>
  );
}

export function DefaultHeroExtra() {
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const TRYOUTS_FORM_URL = "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=ayHaDsgfk0iDUzegbnKX_ue2WRxk7GJHo8WysPdwzdpUNUw4SlM4V01DUllNMkFLQVJVRjVXTVZXQi4u";
  const HOLIDAY_CAMPS_FORM_URL = "#";

  const scrollToCalendar = () => {
    const calendarSection = document.getElementById("booking-calendar");
    if (calendarSection) {
      calendarSection.scrollIntoView({ behavior: "smooth", block: "center" });

      setIsHighlighting(true);
      setTimeout(() => setIsHighlighting(false), 1500);
    }
  };

  return (
    <div className="mt-5 lg:mt-8 flex flex-col gap-6 lg:gap-8 z-999">
      <div className="flex flex-wrap items-center gap-5">
        <button
          onClick={scrollToCalendar}
          className="bg-[#88b03f] text-white pl-6 pr-2.5 py-2 rounded-full text-xs md:text-[13px] font-medium hover:bg-[#769a35] transition-colors flex items-center gap-3 shadow-sm"
        >
          Book Your Pitch
          <div className="w-7 h-7 bg-white text-[#88b03f] rounded-full flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#88b03f] text-white pl-6 pr-2.5 py-2 rounded-full text-xs md:text-[13px] font-medium hover:bg-[#769a35] transition-colors flex items-center gap-3 shadow-sm"
        >
          Register
          <div className="w-7 h-7 bg-white text-[#88b03f] rounded-full flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      <div className="bg-[#1f4b50] rounded-[20px] lg:rounded-full py-2.5 px-4 md:px-5 flex flex-wrap justify-between items-center text-white text-[9px] md:text-[10px] font-medium max-w-[480px] shadow-lg gap-y-2 border border-white/10">
        <div className="flex items-center gap-1.5">
          <svg className="text-[#88b03f]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Premium Turf
        </div>
        <div className="w-px h-2.5 bg-white/30 hidden sm:block"></div>
        <div className="flex items-center gap-1.5">
          <svg className="text-[#88b03f]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          On-Time
        </div>
        <div className="w-px h-2.5 bg-white/30 hidden sm:block"></div>
        <div className="flex items-center gap-1.5">
          <svg className="text-[#88b03f]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Changing Room
        </div>
        <div className="w-px h-2.5 bg-white/30 hidden md:block"></div>
        <div className="flex items-center gap-1.5">
          <svg className="text-[#88b03f]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          Hygienic
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#1f4b50] border border-white/15 rounded-[24px] p-6 sm:p-8 max-w-sm w-full shadow-2xl relative text-[#F8F5F2]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="font-playfair text-xl sm:text-2xl text-[#F8F5F2] mb-2">
              Choose Registration
            </h2>
            <p className="text-white/75 text-xs sm:text-sm mb-6 leading-relaxed">
              Select a program below to complete your registration form.
            </p>

            <div className="flex flex-col gap-3.5">
              <a
                href={TRYOUTS_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsModalOpen(false)}
                className="bg-[#88b03f] hover:bg-[#769a35] text-white pl-5 pr-3 py-3 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center justify-between shadow-md"
              >
                <span>Register for Tryouts</span>
                <div className="w-7 h-7 bg-white text-[#88b03f] rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </a>

              <a
                href={HOLIDAY_CAMPS_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsModalOpen(false)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white pl-5 pr-3 py-3 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center justify-between shadow-md"
              >
                <span>Holiday Camps</span>
                <div className="w-7 h-7 bg-[#88b03f] text-white rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function DefaultMembershipWidget() {
  return null;
}

export function DefaultSlideIndicator() {
  return null;
}