"use client";

// ── Default hero content components ───────────────────────────────────────────
// Each is a standalone component so it can be tree-shaken when overridden
// via the corresponding PitchBookingSlots prop.

export function DefaultHeroTitle() {
  return (
    <h1
      className="font-extrabold leading-[1.04] tracking-tight text-white"
      style={{ fontSize: "clamp(2.6rem, 7.5vw, 5.4rem)" }}
    >
      Choose Your Turf
      <br />
      Play Your Game.
    </h1>
  );
}

export function DefaultHeroSubtitle() {
  return (
    <p className="text-base sm:text-lg text-white/65 max-w-md font-medium leading-relaxed">
      Book premium football pitches for 5-Aside &amp; 8-Aside sessions across
      Nairobi and pay instantly with M-Pesa.
    </p>
  );
}

export function DefaultMembershipWidget() {
  return (
    <div className="inline-flex items-center gap-4 bg-white/8 backdrop-blur-sm border border-white/10 px-5 py-3.5 rounded-2xl w-max">
      <div className="flex -space-x-3">
        {[11, 12, 13].map((n) => (
          <img
            key={n}
            src={`https://i.pravatar.cc/80?img=${n}`}
            alt=""
            aria-hidden="true"
            className="w-10 h-10 rounded-full border-2 border-black object-cover"
            loading="lazy"
          />
        ))}
      </div>
      <div>
        <p className="text-sm font-bold text-white leading-tight">12k + Memberships</p>
        <p className="text-xs text-white/55 mt-0.5">Enjoy our facilities</p>
      </div>
    </div>
  );
}

export function DefaultSlideIndicator() {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-white/45">1/2 Baseline Grounds</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous"
          className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center text-white/55 hover:border-white/55 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next"
          className="w-9 h-9 rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
          style={{ backgroundColor: "#c6ff00" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}