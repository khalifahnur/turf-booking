import { OPENING_HOURS, PITCH_OPTIONS, PRICES_KES, SESSION_LENGTHS } from "@/lib/booking";
import {
  ADDRESS,
  DIRECTIONS_URL,
  EMAIL,
  ORG_NAME,
  PHONE_DISPLAY,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from "@/lib/site";

const hhmm = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

/**
 * schema.org description of the venue, so search engines can show it as a local
 * business with its hours, price range and contact details. Everything here is
 * derived from the same constants the site itself uses (prices, hours, phone),
 * so it cannot drift out of date on its own.
 */
export function homepageJsonLd() {
  const prices = PITCH_OPTIONS.flatMap((p) =>
    SESSION_LENGTHS.map((l) => PRICES_KES[p.type][l.minutes]),
  );
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["SportsActivityLocation", "LocalBusiness"],
        "@id": `${SITE_URL}/#venue`,
        name: SITE_NAME,
        alternateName: `${SITE_NAME} by ${ORG_NAME}`,
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image`,
        logo: `${SITE_URL}/icon.png`,
        description:
          "5-a-side and 8-a-side football pitches in Nairobi, bookable in 1 or 2 hour sessions with instant M-Pesa payment.",
        telephone: PHONE_DISPLAY,
        email: EMAIL,
        address: {
          "@type": "PostalAddress",
          streetAddress: ADDRESS.street,
          addressLocality: ADDRESS.locality,
          addressCountry: ADDRESS.country,
        },
        hasMap: DIRECTIONS_URL,
        currenciesAccepted: "KES",
        paymentAccepted: "M-Pesa",
        priceRange: `KSh ${lowest.toLocaleString("en-KE")} - KSh ${highest.toLocaleString("en-KE")}`,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: hhmm(OPENING_HOURS.weekday.open),
            closes: hhmm(OPENING_HOURS.weekday.close),
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Saturday", "Sunday"],
            opens: hhmm(OPENING_HOURS.weekend.open),
            closes: hhmm(OPENING_HOURS.weekend.close),
          },
        ],
        // Only real public profiles: skip placeholder "#" links and admin URLs.
        sameAs: SOCIAL_LINKS.map((s) => s.url).filter(
          (url) => url.startsWith("https://") && !url.includes("/admin"),
        ),
        makesOffer: PITCH_OPTIONS.flatMap((pitch) =>
          SESSION_LENGTHS.map((length) => ({
            "@type": "Offer",
            name: `${pitch.label} pitch, ${length.short}`,
            price: PRICES_KES[pitch.type][length.minutes],
            priceCurrency: "KES",
            availability: "https://schema.org/InStock",
            url: SITE_URL,
          })),
        ),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "en-KE",
        publisher: { "@id": `${SITE_URL}/#venue` },
      },
    ],
  };
}

/** Serialises for an inline <script>, escaping "<" so data can never close the tag. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
