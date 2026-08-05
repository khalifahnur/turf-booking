"use client";

import Image from "next/image";

const socialLinksData = [
  {
    name: "Instagram",
    src: "/assets/ig.png",
    url: "https://www.instagram.com/k_arena_hq/",
  },
  {
    name: "Facebook",
    src: "/assets/fb.png",
    url: "#",
  },
  {
    name: "TikTok",
    src: "/assets/tiktok.png",
    url: "https://www.tiktok.com/@k_arena_hq",
  },
  {
    name: "X",
    src: "/assets/x.png",
    url: "https://x.com/k_arena_hq",
  },
  {
    name: "Linkedin",
    src: "/assets/linkedin.png",
    url: "https://www.linkedin.com/services/page/7149a834580724b119/admin/",
  },
  {
    name: "Threads",
    src: "/assets/threads.png",
    url: "https://www.threads.com/@k_arena_hq",
  },
  {
    name: "Youtube",
    src: "/assets/youtube.png",
    url: "https://www.youtube.com/@K-ArenaTurfGrounds",
  },
];

export default function FooterSection() {
  return (
    <footer
      style={{ backgroundColor: "#1f4b50" }}
      className="w-full flex flex-col justify-between min-h-[100svh] pt-10 lg:pt-15"
      aria-label="Site footer"
    >
      <div className="max-w-360 mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 flex-1 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.9fr_1fr_1fr_1fr] gap-10 xl:gap-14">
          <div>
            <h3
              className="font-playfair font-semibold text-white mb-2.5 leading-tight"
              style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)" }}
            >
              Get Exclusive Updates <br />
              <span className="font-vibes text-[#88b03f] font-normal text-[2.5rem] leading-[0.5] relative top-1 lowercase">
                and offers
              </span>
            </h3>
            <p className="font-playfair text-white/50 text-sm mb-7 mt-3 max-w-xs leading-relaxed">
              Be the first to know about upcoming training sessions, special
              events,
            </p>

            <div className="flex gap-3">
              {socialLinksData.map(({ name, src: componentSrc, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-colors hover:bg-teal cursor-pointer group"
                  aria-label={`Follow us on ${name}`}
                >
                  <Image
                    src={componentSrc}
                    alt={`${name} icon`}
                    width={16}
                    height={16}
                    className="w-6 h-6 
                    filter brightness(0.7)  
                    transition-all duration-300 
                    group-hover:brightness(1) "
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="pt-1">
            <p className="font-playfair text-white/45 text-sm mb-1">
              Have a question or feedback?
            </p>
            <p className="font-playfair text-white font-semibold text-[15px] mb-7 break-all">
              karena@stsebastiansportsacademy.com
            </p>
            <p className="font-playfair text-white/45 text-sm mb-1">
              Give us a call
            </p>
            <p className="font-playfair text-white font-extrabold text-xl tracking-tight">
              +254712633130
            </p>
          </div>

          <div>
            <h4 className="font-playfair text-white font-extrabold text-xs uppercase tracking-[0.14em] mb-5">
              Facilities
            </h4>
            <ul className="space-y-3">
              {["Football Pitch"].map((link) => (
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

        <div className="font-playfair mt-8 sm:mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-white/32 pb-8 sm:pb-10">
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
          </div>
        </div>
      </div>

     <div
        className="w-full flex justify-center select-none pb-4 sm:pb-8 lg:pb-0"
        aria-hidden="true"
      >
        <h1
          className="font-playfair font-extrabold leading-none tracking-tighter uppercase text-center bg-clip-text text-transparent pb-2 sm:pb-4"
          style={{
            fontSize: "clamp(4rem, 16vw, 13rem)",
            backgroundImage: `url("https://images.unsplash.com/photo-1584120075590-9876c53cb48c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          K-ARENA
        </h1>
      </div>
    </footer>
  );
}