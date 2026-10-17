import { ImageResponse } from "next/og";
import { PITCH_OPTIONS, PRICES_KES, SESSION_LENGTHS } from "@/lib/booking";
import { SITE_NAME } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "K-Arena: 5-a-side and 8-a-side football pitch booking in Nairobi";

const fromPrice = Math.min(
  ...PITCH_OPTIONS.flatMap((p) => SESSION_LENGTHS.map((l) => PRICES_KES[p.type][l.minutes])),
);

/** The link-preview card shown when the site is shared on WhatsApp, X, Facebook, etc. */
export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          color: "white",
          backgroundColor: "#1f4b50",
          backgroundImage:
            "radial-gradient(circle at 88% 8%, rgba(136,176,63,0.55), rgba(136,176,63,0) 45%), radial-gradient(circle at 0% 100%, rgba(35,62,149,0.55), rgba(35,62,149,0) 50%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, letterSpacing: 4, textTransform: "uppercase", opacity: 0.85 }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, backgroundColor: "#88b03f" }} />
          Ngong Road, Nairobi
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 168, fontWeight: 800, lineHeight: 1, letterSpacing: -4 }}>{SITE_NAME.toUpperCase()}</div>
          <div style={{ fontSize: 44, marginTop: 20, opacity: 0.92 }}>5-a-side &amp; 8-a-side football pitches</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 700,
              padding: "16px 34px",
              borderRadius: 999,
              backgroundColor: "#88b03f",
              color: "#121e34",
            }}
          >
            Book in minutes with M-Pesa
          </div>
          <div style={{ display: "flex", fontSize: 30, opacity: 0.85 }}>
            From Ksh. {fromPrice.toLocaleString("en-KE")}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
