import type { Metadata } from "next";
import Container from "@/components/GridContainer";
import { pageMetadata } from "@/lib/seo";
import { homepageJsonLd, jsonLdScript } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "K-Arena | 5-a-side & 8-a-side Football Pitch Booking in Nairobi",
  description:
    "Book 5-a-side and 8-a-side football pitches in Nairobi at K-Arena, off Ngong Road. Pick a 1 or 2 hour session and pay instantly with M-Pesa.",
  path: "/",
  absolute: true,
});

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(homepageJsonLd()) }}
      />
      <Container />
    </>
  );
}
