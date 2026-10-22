"use client";

import type { RefObject } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Field } from "@/components/Field";
import { CAMP_TERMS, normalizePhoneInput } from "@/lib/camp";

export interface DetailsValues {
  childName: string;
  parentName: string;
  email: string;
  phone: string;
  acceptedTerms: boolean;
}

export type DetailsErrors = Partial<Record<keyof DetailsValues, string>>;

interface DetailsStepProps {
  values: DetailsValues;
  errors: DetailsErrors;
  onChange: <K extends keyof DetailsValues>(key: K, value: DetailsValues[K]) => void;
  onNext: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}

export default function DetailsStep({ values, errors, onChange, onNext, headingRef }: DetailsStepProps) {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="camp-step-in"
    >
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-playfair text-lg font-semibold leading-tight text-[#121e34] outline-none sm:text-xl"
      >
        Tell us about your family
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-[#121e34]/70 sm:text-[13px]">
        We&rsquo;ll send the M-Pesa prompt and confirmation SMS to your phone, and use your email for camp updates. Read how we{" "}
        <Link
          href="/privacy"
          target="_blank"
          rel="noopener"
          className="font-semibold text-[#1f4b50] underline underline-offset-2 hover:text-[#121e34]"
        >
          use your details
        </Link>
        <span className="sr-only"> (opens in a new tab)</span>.
      </p>

      <div className="mt-4 grid gap-x-3.5 sm:grid-cols-2">
        <Field
          label="Child's full name"
          name="childName"
          autoComplete="off"
          value={values.childName}
          onChange={(v) => onChange("childName", v)}
          placeholder="full name"
          error={errors.childName}
        />
        <Field
          label="Parent / guardian's name"
          name="parentName"
          autoComplete="name"
          value={values.parentName}
          onChange={(v) => onChange("parentName", v)}
          placeholder="full name"
          error={errors.parentName}
        />
        <div className="sm:col-span-2">
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(v) => onChange("email", v)}
            placeholder="parent@example.com"
            error={errors.email}
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="Phone Number"
            name="phone"
            type="tel"
            autoComplete="tel-national"
            prefix="+254"
            value={values.phone}
            onChange={(v) => onChange("phone", normalizePhoneInput(v))}
            placeholder="7XXXXXXXX"
            error={errors.phone}
          />
          <p className="-mt-3 mb-3.5 ml-1 text-[11px] text-[#121e34]/65">
            The payment prompt will be sent to this number.
          </p>
        </div>
      </div>

      <div className="mt-1">
        <h3 id="camp-terms-title" className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#121e34]/65">
          Terms &amp; conditions
        </h3>

        <div className="relative mt-1.5">
          <div
            role="region"
            aria-labelledby="camp-terms-title"
            tabIndex={0}
            data-lenis-prevent
            className="max-h-36 overflow-y-auto overscroll-contain rounded-xl border border-[#121e34]/10 bg-[#f8f5f2] p-3 text-xs leading-relaxed text-[#121e34]/80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1f4b50]"
          >
            <ol className="space-y-2.5 [overflow-wrap:anywhere]">
              {CAMP_TERMS.map((t, i) => (
                <li key={t.title}>
                  <p className="font-semibold text-[#121e34]">
                    {i + 1}. {t.title}
                  </p>
                  <p className="mt-0.5">{t.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-px bottom-px h-6 rounded-b-xl bg-linear-to-t from-[#f8f5f2] to-transparent"
          />
        </div>

        <label
          className={`relative mt-2.5 flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-[#1f4b50] has-focus-visible:ring-offset-1 has-focus-visible:outline-hidden ${
            errors.acceptedTerms ? "border-red-500 bg-red-50/60" : "border-[#121e34]/12 bg-white hover:border-[#88b03f]"
          }`}
        >
          <input
            type="checkbox"
            name="acceptedTerms"
            checked={values.acceptedTerms}
            onChange={(e) => onChange("acceptedTerms", e.target.checked)}
            aria-invalid={errors.acceptedTerms ? true : undefined}
            aria-describedby={errors.acceptedTerms ? "camp-terms-error" : undefined}
            className="peer absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none opacity-0"
          />
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[#1f4b50]/60 bg-white text-white transition-colors peer-checked:border-[#1f4b50] peer-checked:bg-[#1f4b50] [&>svg]:scale-50 [&>svg]:opacity-0 [&>svg]:transition peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:opacity-100"
          >
            <Check className="h-3 w-3" strokeWidth={3.5} />
          </span>
          <span className="text-xs leading-snug text-[#121e34]/85">
            I am this child&rsquo;s parent or guardian. I have read and agree to the terms and conditions above,
            including that K-Arena is{" "}
            <strong className="font-semibold text-[#121e34]">not responsible if my child is hurt or hurts themselves</strong>{" "}
            (clauses 1 and 2).
          </span>
        </label>
        {errors.acceptedTerms && (
          <p id="camp-terms-error" role="alert" className="mt-1.5 ml-1 text-[11px] font-medium text-red-700">
            {errors.acceptedTerms}
          </p>
        )}
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          className="group inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-[#88b03f] pl-5 pr-1.5 text-xs font-semibold text-[#121e34] shadow-2xs transition-all hover:bg-[#769a35] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1f4b50] focus-visible:ring-offset-2 active:scale-[0.99] sm:h-10 sm:w-auto sm:min-w-40 sm:text-[13px]"
        >
          Continue
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#121e34] transition-transform group-hover:translate-x-0.5 sm:h-7 sm:w-7">
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </button>
      </div>
    </form>
  );
}