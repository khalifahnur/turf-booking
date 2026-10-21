"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarDays, Check, Smartphone } from "lucide-react";
import { usePaymentWebSocket } from "@/hook/usePaymentWebsocket";
import { formatKes, type CampWeek } from "@/lib/camp";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

interface PaymentFlowProps {
  reference: string;
  childName: string;
  programLabel: string;
  weeks: CampWeek[];
  lunch: boolean;
  total: number;
  phoneLabel: string;
  /** Back to the plan step, with everything the parent entered still in place. */
  onBackToPlan: () => void;
  onRegisterAnother: () => void;
}

/**
 * Follows one payment. It is rendered with key={reference}, so every attempt
 * starts with fresh state and can never flash the outcome of an earlier one.
 */
export default function PaymentFlow(props: PaymentFlowProps) {
  const { status } = usePaymentWebSocket(props.reference);
  const outcome = status === "Completed" ? "success" : status === "Failed" ? "failed" : "waiting";
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Tell keyboard and screen-reader users the screen has changed.
  useEffect(() => {
    headingRef.current?.focus();
  }, [outcome]);

  if (outcome === "success") return <Success {...props} headingRef={headingRef} />;
  if (outcome === "failed") return <Failed {...props} headingRef={headingRef} />;
  return <Awaiting {...props} headingRef={headingRef} />;
}

type PanelProps = PaymentFlowProps & { headingRef: React.RefObject<HTMLHeadingElement | null> };

function Awaiting({ total, phoneLabel, childName, onBackToPlan, headingRef }: PanelProps) {
  return (
    <div className="camp-step-in py-4 text-center sm:py-8">
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
        <span aria-hidden="true" className="camp-ring absolute inset-0 rounded-full bg-[#88b03f]/30" />
        <span aria-hidden="true" className="camp-ring camp-ring-late absolute inset-0 rounded-full bg-[#88b03f]/30" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#1f4b50] text-white shadow-lg">
          <Smartphone className="h-9 w-9" aria-hidden="true" />
        </span>
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-7 font-playfair text-2xl font-semibold text-[#121e34] outline-none sm:text-3xl"
      >
        Check your phone
      </h2>
      <p className="mx-auto mt-3 max-w-md break-words text-sm leading-relaxed text-[#121e34]/75 sm:text-[15px]">
        We&rsquo;ve sent an M-Pesa prompt for <strong className="text-[#121e34]">{formatKes(total)}</strong> to{" "}
        <strong className="whitespace-nowrap text-[#121e34]">{phoneLabel}</strong>. Enter your M-Pesa PIN to finish
        registering {childName.trim().split(" ")[0] || "your child"}.
      </p>

      <p
        role="status"
        className="mx-auto mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#f8f5f2] px-4 py-2 text-[13px] font-semibold text-[#1f4b50]"
      >
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1f4b50]/25 border-t-[#1f4b50]" aria-hidden="true" />
        Waiting for confirmation…
      </p>

      <div className="mt-8">
        <button
          type="button"
          onClick={onBackToPlan}
          className="min-h-11 rounded-full px-5 text-sm font-semibold text-[#1f4b50] transition-colors hover:bg-[#1f4b50]/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4b50]"
        >
          Change plan or number
        </button>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-[#121e34]/70">
          This does <strong className="font-semibold">not</strong> cancel the prompt already on your phone. If you
          enter your PIN, we&rsquo;ll still register your child and confirm by SMS, so there&rsquo;s no need to wait here.
          To start again, wait about 2 minutes first.
        </p>
      </div>
    </div>
  );
}

function Success({ childName, programLabel, weeks, lunch, total, phoneLabel, onRegisterAnother, headingRef }: PanelProps) {
  return (
    <div className="camp-step-in py-4 text-center sm:py-8">
      <div className="camp-pop mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#88b03f] text-[#121e34] shadow-[0_14px_32px_-8px_rgba(136,176,63,0.7)]">
        <Check className="h-12 w-12" strokeWidth={3} aria-hidden="true" />
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-7 font-playfair text-2xl font-semibold text-[#121e34] outline-none sm:text-3xl"
      >
        You&rsquo;re registered!
      </h2>
      <p className="mx-auto mt-3 max-w-md break-words text-sm leading-relaxed text-[#121e34]/75 sm:text-[15px]">
        Payment received. <strong className="text-[#121e34]">{childName.trim()}</strong> has a place at the K-Arena
        Holiday Football Camp. A confirmation SMS is on its way to {phoneLabel}.
      </p>

      <dl className="mx-auto mt-7 max-w-md space-y-3 rounded-2xl border border-[#121e34]/10 bg-[#f8f5f2] p-5 text-left text-[13px]">
        <div className="flex justify-between gap-4">
          <dt className="text-[#121e34]/70">Programme</dt>
          <dd className="font-semibold text-[#121e34]">{programLabel}{lunch ? " + lunch" : ""}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="flex items-center gap-1.5 text-[#121e34]/70">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> Weeks
          </dt>
          <dd className="text-right font-semibold text-[#121e34]">
            {weeks.map((w) => (
              <span key={w.start} className="block">Week {w.index} · {w.label}</span>
            ))}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-dashed border-[#121e34]/15 pt-3">
          <dt className="font-semibold text-[#121e34]/75">Paid</dt>
          <dd className="font-bold tabular-nums text-[#121e34]">{formatKes(total)}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#88b03f] px-7 text-sm font-bold text-[#121e34] shadow-md transition-colors hover:bg-[#769a35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4b50] focus-visible:ring-offset-2 sm:w-auto"
        >
          Back to home <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={onRegisterAnother}
          className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#1f4b50]/25 px-7 text-sm font-semibold text-[#1f4b50] transition-colors hover:bg-[#1f4b50]/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4b50] sm:w-auto"
        >
          Register another child
        </button>
      </div>
    </div>
  );
}

function Failed({ onBackToPlan, headingRef }: PanelProps) {
  return (
    <div className="camp-step-in py-4 text-center sm:py-8">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/60">
        <AlertTriangle className="h-11 w-11" aria-hidden="true" />
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-7 font-playfair text-2xl font-semibold text-[#121e34] outline-none sm:text-3xl"
      >
        We couldn&rsquo;t confirm your payment
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#121e34]/75 sm:text-[15px]">
        The prompt may have been cancelled or timed out, the PIN may have been wrong, or the balance may have been
        too low.
      </p>
      <p className="mx-auto mt-3 max-w-md rounded-2xl bg-[#fed107]/15 p-3.5 text-[13px] leading-relaxed text-[#121e34]/80">
        <strong className="text-[#121e34]">Already paid?</strong> Don&rsquo;t pay again. Once your payment is
        confirmed we&rsquo;ll register your child and send an SMS. If you hear nothing, call{" "}
        <a href={PHONE_TEL} className="font-semibold text-[#1f4b50] underline">{PHONE_DISPLAY}</a>.
      </p>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={onBackToPlan}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#88b03f] px-8 text-sm font-bold text-[#121e34] shadow-md transition-colors hover:bg-[#769a35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4b50] focus-visible:ring-offset-2 sm:w-auto"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
