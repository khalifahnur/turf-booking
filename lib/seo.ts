import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export function pageMetadata({
  title,
  description,
  path,
  absolute = false,
  sharedImage = true,
}: {
  title: string;
  description: string;
  path: string;
  absolute?: boolean;
  /**
   * Name the site-wide share card explicitly (a page's own openGraph replaces the
   * one inherited from the layout, image included). Pass false for a page that
   * has its own opengraph-image/twitter-image files, which then supply the card.
   */
  sharedImage?: boolean;
}): Metadata {
  const fullTitle = absolute ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_KE",
      url: path,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      ...(sharedImage ? { images: ["/opengraph-image"] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(sharedImage ? { images: ["/twitter-image"] } : {}),
    },
  };
}
