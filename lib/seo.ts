import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

/**
 * Per-page metadata with its own canonical URL and og:url. `title` is what goes
 * before " | K-Arena" in the tab (pass `absolute: true` to use it verbatim).
 */
export function pageMetadata({
  title,
  description,
  path,
  absolute = false,
}: {
  title: string;
  description: string;
  path: string;
  absolute?: boolean;
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
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
