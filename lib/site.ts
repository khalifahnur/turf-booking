// Facts about the venue that more than one part of the site needs. Change them
// here and the navbar, footer, SEO metadata and structured data all follow.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://karena.stsebastiansportsacademy.com"
).replace(/\/$/, "");

export const SITE_NAME = "K-Arena";
export const ORG_NAME = "St. Sebastian Sports Academy";

export const PHONE_DISPLAY = "+254712633130";
export const PHONE_TEL = "tel:+254712633130";
export const EMAIL = "karena@stsebastiansportsacademy.com";

export const DIRECTIONS_URL = "https://maps.app.goo.gl/XjfyKBvQyhBifDBCA?g_st=ac";

export const ADDRESS = {
  street: "Kabarnet Road, off Ngong Road",
  locality: "Nairobi",
  country: "KE",
} as const;

// Where the header "Tryouts" button leads. It opens a WhatsApp chat to the
// venue with the enquiry already typed. Swap in a registration form or a
// dedicated page here whenever one exists; nothing else needs to change.
export const TRYOUTS_HREF = `https://wa.me/254712633130?text=${encodeURIComponent(
  "Hi K-Arena, I'd like to know about tryouts."
)}`;

export const SOCIAL_LINKS = [
  { name: "Instagram", src: "/assets/ig.png", url: "https://www.instagram.com/k_arena_hq/" },
  { name: "Facebook", src: "/assets/fb.png", url: "#" },
  { name: "TikTok", src: "/assets/tiktok.png", url: "https://www.tiktok.com/@k_arena_hq" },
  { name: "X", src: "/assets/x.png", url: "https://x.com/k_arena_hq" },
  {
    name: "Linkedin",
    src: "/assets/linkedin.png",
    url: "https://www.linkedin.com/services/page/7149a834580724b119/admin/",
  },
  { name: "Threads", src: "/assets/threads.png", url: "https://www.threads.com/@k_arena_hq" },
  { name: "Youtube", src: "/assets/youtube.png", url: "https://www.youtube.com/@K-ArenaTurfGrounds" },
] as const;
