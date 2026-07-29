import type { ReactNode } from "react";

/**
 * All optional. Pass a node to override any default section.
 * Leave undefined to keep the built-in SSA-branded content.
 *
 * Usage:
 *   <PitchBooking
 *     heroTitle={<h1>Your headline</h1>}
 *     footer={<YourFooter />}
 *   />
 */
export interface PitchBookingSlots {
  /** Large headline in the hero left column */
  heroTitle?: ReactNode;
  /** Supporting paragraph below the headline */
  heroSubtitle?: ReactNode;
  /** Optional extra below subtitle — CTA button, promo badge, etc. */
  heroExtra?: ReactNode;
  /** Bottom-left social proof / membership widget */
  membershipWidget?: ReactNode;
  /** Navbar brand / logo */
  brandLogo?: ReactNode;
  /** Navbar right-side (search bar + contact CTA) */
  navActions?: ReactNode;
  /** Bottom-right slide counter & arrows */
  slideIndicator?: ReactNode;
  /** Full testimonials section — replaces default carousel */
  testimonials?: ReactNode;
  /** Full footer section — replaces default footer */
  footer?: ReactNode;
}