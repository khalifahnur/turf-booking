"use client";

import { RefObject, useEffect, useRef, useState } from "react";

// Hide the navbar once the footer is nearly all uncovered, and bring it back
// only after scrolling clearly back up, so it doesn't flicker at the edge.
const HIDE_NAV_ABOVE = 0.82;
const SHOW_NAV_BELOW = 0.72;

/**
 * Drives the footer's parallax.
 *
 * The footer sits fixed underneath the page and is uncovered as the page's
 * bottom edge lifts away. This measures how much of it is uncovered (0 = still
 * hidden, 1 = fully visible) and writes it to `--reveal` on `layer`. Layers
 * inside the footer read that variable in CSS to move and fade at different
 * speeds.
 *
 * It writes a CSS variable instead of React state so a scroll never re-renders
 * anything, and only transform/opacity depend on it so the browser can animate
 * on the compositor. It listens to the scroll event rather than reading
 * scrollY, so it works the same with native scrolling and with smooth-scroll
 * libraries that drive the real scroll position.
 *
 * `canReveal` is false when the footer's content is taller than the screen
 * (small phones, landscape): a fixed layer would clip it, so the caller should
 * lay the footer out as an ordinary block instead.
 */
export function useFooterReveal(
  page: RefObject<HTMLElement | null>,
  layer: RefObject<HTMLElement | null>,
) {
  const [canReveal, setCanReveal] = useState(true);
  const canRevealRef = useRef(true);

  useEffect(() => {
    const pageEl = page.current;
    const layerEl = layer.current;
    if (!pageEl || !layerEl) return;

    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = -1;
    let navHidden = false;

    const update = () => {
      frame = 0;
      const animate = canRevealRef.current && !reduceMotion.matches;
      const uncovered = animate
        ? 1 - pageEl.getBoundingClientRect().bottom / window.innerHeight
        : 1;
      const progress = Math.min(1, Math.max(0, uncovered));

      if (Math.abs(progress - last) >= 0.001) {
        last = progress;
        layerEl.style.setProperty("--reveal", progress.toFixed(3));
      }

      const shouldHide = animate && (navHidden ? progress > SHOW_NAV_BELOW : progress > HIDE_NAV_ABOVE);
      if (shouldHide !== navHidden) {
        navHidden = shouldHide;
        root.dataset.footerRevealed = String(shouldHide);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // The footer element is the layer's content wrapper's child; this works for
    // a custom `footer` prop too, as long as it renders one root element.
    const footerEl = layerEl.firstElementChild?.firstElementChild as HTMLElement | null;
    const measure = () => {
      const fits = !footerEl || footerEl.offsetHeight <= window.innerHeight + 1;
      if (fits !== canRevealRef.current) {
        canRevealRef.current = fits;
        setCanReveal(fits);
      }
      schedule();
    };

    const observer = footerEl ? new ResizeObserver(measure) : null;
    if (footerEl) observer?.observe(footerEl);
    else schedule();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    reduceMotion.addEventListener("change", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      reduceMotion.removeEventListener("change", schedule);
      delete root.dataset.footerRevealed;
    };
  }, [page, layer]);

  return { canReveal };
}
