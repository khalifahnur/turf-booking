"use client";

export function DefaultHeroTitle() {
  return (
    <>
      <h1 className="font-playfair text-[#F8F5F2] leading-[1.05] text-[3rem] sm:text-[3.5rem] lg:text-[3.8rem] xl:text-[4.2rem] tracking-tight">
        Your best <br />
        pitch, <span className="font-vibes text-[#88b03f] text-[3.5rem] sm:text-[4.2rem] lg:text-[4.8rem] xl:text-[5.2rem] font-normal leading-[0.3] relative top-1 ml-1">every day.</span>
      </h1>
    </>
  );
}

export function DefaultHeroSubtitle() {
  return (
    <p className="text-white/80 text-sm md:text-[15px] leading-relaxed max-w-[380px] font-medium">
      From casual 5Aside matches to 8Aside, we bring out the most passionate player in you.
    </p>
  );
}

export function DefaultHeroExtra() {
  return (
    <div className="mt-5 lg:mt-8 flex flex-col gap-6 lg:gap-8">
      
      <div className="flex flex-wrap items-center gap-5">
        <button className="bg-[#88b03f] text-white pl-6 pr-2.5 py-2 rounded-full text-xs md:text-[13px] font-medium hover:bg-[#769a35] transition-colors flex items-center gap-3 shadow-sm">
          Book Your Pitch
          <div className="w-7 h-7 bg-white text-[#88b03f] rounded-full flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </button>
        <button className="flex items-center gap-2.5 text-[#F8F5F2] text-xs md:text-[13px] font-semibold hover:text-white transition-colors">
          <div className="w-9 h-9 rounded-full border border-[#F8F5F2] flex items-center justify-center">
            <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
          Watch Our Turf
        </button>
      </div>
      {/* <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] lg:rounded-[24px] p-3.5 lg:p-4 shadow-lg max-w-[400px]">
        <div className="grid grid-cols-3 divide-x divide-white/20">
          
          <div className="flex flex-col items-center justify-center px-1">
            <div className="text-[#fed107] mb-1.5">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div className="text-sm md:text-base font-bold text-white mb-0.5">500+</div>
            <div className="text-[9px] text-white/70 font-medium text-center leading-tight">Happy<br/>Teams</div>
          </div>
          
          <div className="flex flex-col items-center justify-center px-1">
            <div className="text-[#fed107] mb-1.5">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className="text-sm md:text-base font-bold text-white mb-0.5">15+</div>
            <div className="text-[9px] text-white/70 font-medium text-center leading-tight">Expert<br/>Referees</div>
          </div>
          
          <div className="flex flex-col items-center justify-center px-1">
            <div className="text-[#fed107] mb-1.5">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="text-sm md:text-base font-bold text-white mb-0.5">8+</div>
            <div className="text-[9px] text-white/70 font-medium text-center leading-tight">Years of<br/>Excellence</div>
          </div>

        </div>
      </div> */}
      <div className="bg-[#1f4b50] rounded-[20px] lg:rounded-full py-2.5 px-4 md:px-5 flex flex-wrap justify-between items-center text-white text-[9px] md:text-[10px] font-medium max-w-[480px] shadow-lg gap-y-2 border border-white/10">
        <div className="flex items-center gap-1.5">
          <svg className="text-[#88b03f]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          Premium Turf
        </div>
        <div className="w-px h-2.5 bg-white/30 hidden sm:block"></div>
        <div className="flex items-center gap-1.5">
          <svg className="text-[#88b03f]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          On-Time
        </div>
        <div className="w-px h-2.5 bg-white/30 hidden sm:block"></div>
        <div className="flex items-center gap-1.5">
          <svg className="text-[#88b03f]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Changing Room
        </div>
        <div className="w-px h-2.5 bg-white/30 hidden md:block"></div>
        <div className="flex items-center gap-1.5">
          <svg className="text-[#88b03f]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          Hygienic
        </div>
      </div>

    </div>
  );
}

export function DefaultMembershipWidget() {
  return null;
}

export function DefaultSlideIndicator() {
  return null;
}