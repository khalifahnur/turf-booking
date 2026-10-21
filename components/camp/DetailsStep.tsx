"use client";

import type { RefObject } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Field } from "@/components/Field";
import { CAMP_TERMS, normalizePhoneInput } from "@/lib/camp";

export interface DetailsValues {
  childName: string;
  parentName: string;
  email: string;
  phone: string; // the 9 digits after +254
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
        className="font-playfair text-2xl font-semibold leading-tight text-[#121e34] outline-none sm:text-[1.7rem]"
      >
        Tell us about your family
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#121e34]/65">
        We&rsquo;ll send the M-Pesa prompt and your confirmation to these details.
      </p>

      <div className="mt-7 grid gap-x-5 sm:grid-cols-2">
        <Field
          label="Child's full name"
          name="childName"
          autoComplete="off"
          value={values.childName}
          onChange={(v) => onChange("childName", v)}
          placeholder="e.g. Amani Otieno"
          error={errors.childName}
        />
        <Field
          label="Parent / guardian's name"
          name="parentName"
          autoComplete="name"
          value={values.parentName}
          onChange={(v) => onChange("parentName", v)}
          placeholder="e.g. Grace Otieno"
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
            label="M-Pesa number"
            name="phone"
            type="tel"
            autoComplete="tel-national"
            prefix="+254"
            value={values.phone}
            onChange={(v) => onChange("phone", normalizePhoneInput(v))}
            placeholder="7XXXXXXXX"
            error={errors.phone}
          />
          <p className="-mt-3 mb-5 ml-1 text-xs text-[#121e34]/55">
            The payment prompt will be sent to this number.
          </p>
        </div>
      </div>

      <section aria-labelledby="camp-terms-title" className="mt-2">
        <h3 id="camp-terms-title" className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#121e34]/70">
          Terms &amp; conditions
        </h3>

        <div className="relative mt-2.5">
          <div
            role="region"
            aria-labelledby="camp-terms-title"
            tabIndex={0}
            // Smooth-scroll libraries (Lenis) would otherwise hijack the wheel
            // and scroll the page instead of this box.
            data-lenis-prevent
            className="max-h-56 overflow-y-auto overscroll-contain rounded-2xl border border-[#121e34]/10 bg-[#f8f5f2] p-4 text-[13px] leading-relaxed text-[#121e34]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4b50]"
          >
            <ol className="space-y-3.5">
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
            className="pointer-events-none absolute inset-x-px bottom-px h-8 rounded-b-2xl bg-linear-to-t from-[#f8f5f2] to-transparent"
          />
        </div>

        <label
          className={`relative mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-[#1f4b50] has-focus-visible:ring-offset-2 ${
            errors.acceptedTerms ? "border-red-400 bg-red-50/60" : "border-[#121e34]/10 bg-white hover:border-[#88b03f]/60"
          }`}
        >
          <input
            type="checkbox"
            name="acceptedTerms"
            checked={values.acceptedTerms}
            onChange={(e) => onChange("acceptedTerms", e.target.checked)}
            aria-invalid={errors.acceptedTerms ? true : undefined}
            aria-describedby={errors.acceptedTerms ? "camp-terms-error" : undefined}
            // Stretched over the whole row so focus scrolls all of it into view.
            className="peer absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none opacity-0"
          />
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-[#1f4b50]/40 bg-white text-white transition-colors peer-checked:border-[#88b03f] peer-checked:bg-[#88b03f] [&>svg]:scale-50 [&>svg]:opacity-0 [&>svg]:transition peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:opacity-100"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
          </span>
          <span className="text-[13px] leading-snug text-[#121e34]/85">
            I have read and agree to the terms and conditions above, including that K-Arena is{" "}
            <strong className="font-semibold text-[#121e34]">not responsible if my child is hurt or hurts themselves</strong>{" "}
            while playing.
          </span>
        </label>
        {errors.acceptedTerms && (
          <p id="camp-terms-error" role="alert" className="mt-2 ml-1 text-[12px] font-medium text-red-500">
            {errors.acceptedTerms}
          </p>
        )}
      </section>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="group inline-flex h-12 w-full items-center justify-center gap-3 rounded-full bg-[#88b03f] pl-7 pr-2.5 text-[14px] font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#769a35] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4b50] focus-visible:ring-offset-2 active:scale-[0.98] sm:w-auto sm:min-w-56"
        >
          Continue
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#88b03f] transition-transform duration-300 group-hover:translate-x-0.5">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </button>
      </div>
    </form>
  );
}
