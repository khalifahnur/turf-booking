import { CAMP_OG_ALT, OG_SIZE, renderCampOgImage } from "@/lib/og";

export const alt = CAMP_OG_ALT;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function CampTwitterImage() {
  return renderCampOgImage();
}
