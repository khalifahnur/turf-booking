import type { Metadata } from "next";
import { Playfair_Display, Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.yourdomain.com"), 

  title: {
    default: "K-Arena | Premium Pitch Booking",
    template: "%s | St. Sebastian Sports Academy",
  },
  description: "Book premium 5-a-side and 8-a-side football pitches at K-Arena. Located off Ngong Road, Nairobi. Secure your session instantly.",
  keywords: [
    "football pitch booking",
    "5 aside football Nairobi",
    "8 aside football",
    "St. Sebastian Sports Academy",
    "Ngong road sports",
    "turf booking",
    "k-arena "
  ],
  authors: [{ name: "K-Arena " }],
  creator: "St. Sebastian Sports Academy",
  publisher: "St. Sebastian Sports Academy",
  
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://www.yourdomain.com",
    title: "K-Arena | Pitch Booking",
    description: "Book premium 5-a-side and 8-a-side football pitches instantly via M-Pesa.",
    siteName: "K-Arena ",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "K-Arena Football Pitch",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "K-Arena | Premium Pitch Booking",
    description: "Book premium 5-a-side and 8-a-side football pitches instantly via M-Pesa.",
    images: ["/og-image.jpg"], 
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
    <html lang="en">
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
