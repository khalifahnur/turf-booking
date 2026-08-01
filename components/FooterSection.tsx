"use client";

export default function FooterSection() {
  return (
    <footer style={{ backgroundColor: "#1f4b50" }} className="w-full flex flex-col justify-between min-h-[100svh] pt-10 lg:pt-15" aria-label="Site footer">
      <div className="max-w-360 mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 flex-1 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.9fr_1fr_1fr_1fr] gap-10 xl:gap-14">
          <div>
            <h3
              className="font-playfair font-semibold text-white mb-2.5 leading-tight"
              style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)" }}
            >
              Get Exclusive Updates <br />
              <span className="font-vibes text-[#88b03f] font-normal text-[2.5rem] leading-[0.5] relative top-1 lowercase">and offers</span>
            </h3>
            <p className="font-playfair text-white/50 text-sm mb-7 mt-3 max-w-xs leading-relaxed">
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
                className="font-playfair flex-1 min-w-0 bg-transparent text-white placeholder-white/40 text-sm focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-base shrink-0 hover:scale-105 transition-transform"
                style={{ backgroundColor: "#88b03f" }}
              >
                →
              </button>
            </form>
          </div>

          <div className="pt-1">
            <p className="font-playfair text-white/45 text-sm mb-1">Have a question or feedback?</p>
            <p className="font-playfair text-white font-semibold text-[15px] mb-7 break-all">
              hello@stsebastian.com
            </p>
            <p className="font-playfair text-white/45 text-sm mb-1">Give us a call</p>
            <p className="font-playfair text-white font-extrabold text-xl tracking-tight">
              +254712633130
            </p>
          </div>

          <div>
            <h4 className="font-playfair text-white font-extrabold text-xs uppercase tracking-[0.14em] mb-5">
              Facilities
            </h4>
            <ul className="space-y-3">
              {[
                "Football Pitch",
              ].map((link) => (
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

          <div>
            <h4 className="font-playfair text-white font-extrabold text-xs uppercase tracking-[0.14em] mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {["FAQ's", "Contact Us", "Help Center"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-playfair text-white/48 text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="font-playfair mt-8 sm:mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-white/32 pb-8 sm:pb-10">
          <p>
            K-Arena &copy; {new Date().getFullYear()} All rights
            reserved
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="hover:text-white/65 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white/65 transition-colors">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center select-none px-4 pb-6 sm:pb-8 lg:-pb-20" aria-hidden="true">
        <h1 
          className="font-playfair font-extrabold text-[15vw] lg:text-[12vw] xl:text-[12vw] leading-tight tracking-tighter uppercase pb-2 lg:-pb-20 bg-clip-text text-transparent"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1584120075590-9876c53cb48c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          K-ARENA
        </h1>
      </div>
    </footer>
  );
}