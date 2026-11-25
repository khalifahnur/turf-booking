"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Check, Smartphone } from "lucide-react";
import { usePaymentWebSocket } from "@/hook/usePaymentWebsocket";
import { formatKes } from "@/lib/camp";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

interface PaymentFlowProps {
  reference: string;
  /** Who is being registered, e.g. the academy's name. */
  name: string;
  total: number;
  phoneLabel: string;
  /** What the team has booked, one line each ("U10", "U15"), shown once paid. */
  places: string[];
  /** How long the team's place is held while it pays. */
  holdMinutes: number;
  onTryAgain: () => void;
  onRegisterAnother: () => void;
}

/** Waits for the M-Pesa payment and says how it went. Mirrors the camp's flow. */
export default function PaymentFlow(props: PaymentFlowProps) {
  // Wait a little longer than the place is held, so that when this says the payment
  // failed the place is free again and the team can register at once.
  const { status } = usePaymentWebSocket(props.reference, (props.holdMinutes * 60 + 15) * 1000);
  const outcome = status === "Completed" ? "success" : status === "Failed" ? "failed" : "waiting";
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [outcome]);

  if (outcome === "success") return <Success {...props} headingRef={headingRef} />;
  if (outcome === "failed") return <Failed {...props} headingRef={headingRef} />;
  return <Awaiting {...props} headingRef={headingRef} />;
}

type PanelProps = PaymentFlowProps & { headingRef: React.RefObject<HTMLHeadingElement | null> };

function Awaiting({ total, phoneLabel, name, holdMinutes, onTryAgain, headingRef }: PanelProps) {
  return (
    <div className="camp-step-in py-3 text-center sm:py-5">
      <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
        <span aria-hidden="true" className="camp-ring absolute inset-0 rounded-full bg-[#88b03f]/25" />
        <span aria-hidden="true" className="camp-ring camp-ring-late absolute inset-0 rounded-full bg-[#88b03f]/25" />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#1f4b50] text-white shadow-sm">
          <Smartphone className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 font-playfair text-lg font-semibold text-[#121e34] outline-none sm:text-xl"
      >
        Check your phone
      </h2>
      <p className="mx-auto mt-1.5 max-w-sm break-words text-xs leading-relaxed text-[#121e34]/75 sm:text-[13px]">
        We&rsquo;ve sent an M-Pesa prompt for <strong className="text-[#121e34]">{formatKes(total)}</strong> to{" "}
        <strong className="whitespace-nowrap text-[#121e34]">{phoneLabel}</strong>. Enter your M-Pesa PIN to confirm{" "}
        {name.trim() ? <strong className="text-[#121e34]">{name.trim()}</strong> : "your team"}&rsquo;s place. We&rsquo;re
        holding it for you for {holdMinutes} minutes.
      </p>

      <p
        role="status"
        className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-[#f8f5f2] px-3 py-1.5 text-xs font-semibold text-[#1f4b50]"
      >
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#1f4b50]/25 border-t-[#1f4b50]" aria-hidden="true" />
        Waiting for confirmation…
      </p>

      <div className="mt-5">
        <button
          type="button"
          onClick={onTryAgain}
          className="h-8 rounded-full px-3.5 text-xs font-semibold text-[#1f4b50] transition-colors hover:bg-[#1f4b50]/8 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1f4b50]"
        >
          Change details or number
        </button>
        <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-relaxed text-[#121e34]/65">
          This does <strong className="font-semibold">not</strong> cancel the prompt on your phone. If you enter your
          PIN, we&rsquo;ll still confirm the place and send an SMS.
        </p>
      </div>
    </div>
  );
}

function Success({ name, places, total, phoneLabel, onRegisterAnother, headingRef }: PanelProps) {
  return (
    <div className="camp-step-in py-3 text-center sm:py-5">
      <div className="camp-pop mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#88b03f] text-[#121e34] shadow-sm">
        <Check className="h-6 w-6" strokeWidth={3} aria-hidden="true" />
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 font-playfair text-lg font-semibold text-[#121e34] outline-none sm:text-xl"
      >
        You&rsquo;re in!
      </h2>
      <p className="mx-auto mt-1.5 max-w-sm break-words text-xs leading-relaxed text-[#121e34]/75 sm:text-[13px]">
        Payment received. <strong className="text-[#121e34]">{name.trim()}</strong> has a place in the K-Arena
        Tournament. Confirmation SMS sent to {phoneLabel}. We&rsquo;ll share the fixtures on this number.
      </p>

      <dl className="mx-auto mt-4 max-w-sm space-y-2 rounded-xl border border-[#121e34]/10 bg-[#f8f5f2] p-3.5 text-left text-xs">
        <div className="flex justify-between gap-3">
          <dt className="text-[#121e34]/65">{places.length === 1 ? "Category" : "Categories"}</dt>
          <dd className="font-semibold text-[#121e34]">{places.join(" and ")}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-dashed border-[#121e34]/15 pt-2">
          <dt className="font-semibold text-[#121e34]/75">Paid</dt>
          <dd className="font-bold tabular-nums text-[#121e34]">{formatKes(total)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-[#88b03f] px-5 text-xs font-bold text-[#121e34] shadow-2xs transition-colors hover:bg-[#769a35] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1f4b50] focus-visible:ring-offset-2 sm:w-auto"
        >
          Back to home <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={onRegisterAnother}
          className="inline-flex h-9 w-full items-center justify-center rounded-full border border-[#1f4b50]/25 px-5 text-xs font-semibold text-[#1f4b50] transition-colors hover:bg-[#1f4b50]/8 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1f4b50] sm:w-auto"
        >
          Register another team
        </button>
      </div>
    </div>
  );
}

function Failed({ onTryAgain, headingRef }: PanelProps) {
  return (
    <div className="camp-step-in py-3 text-center sm:py-5">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 ring-4 ring-red-50/50">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 font-playfair text-lg font-semibold text-[#121e34] outline-none sm:text-xl"
      >
        We couldn&rsquo;t confirm your payment
      </h2>
      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-[#121e34]/75 sm:text-[13px]">
        The prompt may have timed out or been cancelled, the PIN may have been wrong, or the balance was too low. Your
        place has been released, so please try again soon: places go quickly.
      </p>
      <p className="mx-auto mt-3 max-w-sm rounded-xl bg-[#fed107]/15 p-3 text-xs leading-relaxed text-[#121e34]/80">
        <strong className="text-[#121e34]">Already paid?</strong> Don&rsquo;t pay again. Once confirmed we&rsquo;ll
        register your team and send an SMS. Need help? Call{" "}
        <a href={PHONE_TEL} className="font-semibold text-[#1f4b50] underline">{PHONE_DISPLAY}</a>.
      </p>

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={onTryAgain}
          className="inline-flex h-9 w-full items-center justify-center rounded-full bg-[#88b03f] px-6 text-xs font-bold text-[#121e34] shadow-2xs transition-colors hover:bg-[#769a35] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1f4b50] focus-visible:ring-offset-2 sm:w-auto"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
