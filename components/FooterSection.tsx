"use client";

export default function FooterSection() {
  return (
    <footer style={{ backgroundColor: "#1f4b50" }} aria-label="Site footer">
      <div className="max-w-360 mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.9fr_1fr_1fr_1fr] gap-10 xl:gap-14">
          <div>
            <h3
              className="font-extrabold text-white mb-2.5 leading-tight"
              style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)" }}
            >
              Get Exclusive Updates Offers
            </h3>
            <p className="text-white/50 text-sm mb-7 max-w-xs leading-relaxed">
              Be the first to know about upcoming training sessions, special events,
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center max-w-[320px] border border-white/15 rounded-full pl-5 pr-1.5 py-1.5 focus-within:border-white/35 transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
            >
              <input
                type="email"
                placeholder="Enter your email Address..."
                aria-label="Email address for newsletter"
                className="flex-1 min-w-0 bg-transparent text-white placeholder-white/40 text-sm focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="w-10 h-10 rounded-full flex items-center justify-center text-black font-extrabold text-base shrink-0 hover:scale-105 transition-transform"
                style={{ backgroundColor: "#c6ff00" }}
              >
                →
              </button>
            </form>
          </div>

          <div className="pt-1">
            <p className="text-white/45 text-sm mb-1">Have a question or feedback?</p>
            <p className="text-white font-semibold text-[15px] mb-7 break-all">
              hello@stsebastian.com
            </p>
            <p className="text-white/45 text-sm mb-1">Give us a call</p>
            <p className="text-white font-extrabold text-xl tracking-tight">
              +254712633130
            </p>
          </div>

          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-[0.14em] mb-5">
              Facilities
            </h4>
            <ul className="space-y-3">
              {[
                "Football Pitch",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/48 text-sm hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-[0.14em] mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {["FAQ's", "Contact Us", "Help Center"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/48 text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-white/32">
          <p>
            St. Sebastian Sports Academy &copy; {new Date().getFullYear()} All rights
            reserved
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white/65 transition-colors">
              Privacy &amp; Policy
            </a>
            <a href="#" className="hover:text-white/65 transition-colors">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>

      <div className="overflow-hidden py-4" aria-hidden="true">
  <p
    className="text-center font-extrabold uppercase whitespace-nowrap select-none text-[#88b03f] leading-none tracking-widest text-4xl sm:text-6xl md:text-8xl lg:text-[170px]"
  >
    ST. SEBASTIAN
  </p>
</div>
    </footer>
  );
}