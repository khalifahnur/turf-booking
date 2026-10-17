import type { Metadata, Viewport } from "next";
import { Playfair_Display, Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
import { ORG_NAME, SITE_NAME, SITE_URL } from "@/lib/site";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const vibes = Great_Vibes({
  variable: "--font-vibes",
  weight: "400",
  subsets: ["latin"],
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const DESCRIPTION =
  "Book 5-a-side and 8-a-side football pitches in Nairobi at K-Arena, off Ngong Road. Pick a 1 or 2 hour session and pay instantly with M-Pesa.";

export const viewport: Viewport = {
  themeColor: "#1f4b50",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "K-Arena | 5-a-side & 8-a-side Football Pitch Booking in Nairobi",
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "football pitch booking Nairobi",
    "5 aside football Nairobi",
    "8 aside football Nairobi",
    "book a turf Nairobi",
    "astro turf Ngong Road",
    "football pitch hire Kenya",
    "K-Arena",
    ORG_NAME,
  ],
  authors: [{ name: SITE_NAME }],
  creator: ORG_NAME,
  publisher: ORG_NAME,
  category: "sports",
  openGraph: {
    type: "website",
    locale: "en_KE",
    title: "K-Arena | Football Pitch Booking in Nairobi",
    description: DESCRIPTION,
    siteName: SITE_NAME,
  },

  twitter: {
    card: "summary_large_image",
    title: "K-Arena | Football Pitch Booking in Nairobi",
    description: DESCRIPTION,
  },
  verification: {
    google: "KuCcuv4fgoA4fbpmb_Qkxe1wOk83-wgyysABjo7rZxg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-KE">
      <body
        className={`${sans.variable} ${playfair.variable} ${vibes.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <Providers>
            {children}
            <Toaster position="top-center" reverseOrder={false} />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
