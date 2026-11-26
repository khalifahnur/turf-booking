"use client";

import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Mail, Phone } from "lucide-react";
import { Field } from "@/components/Field";
import { REGISTRATION_FAILED, RegistrationApiError, fetchTournamentInfo, registerTournament } from "@/lib/api";
import { cleanName, formatKes, formatPhone, normalizePhoneInput, phoneError } from "@/lib/camp";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";
import {
  DEFAULT_CATEGORIES,
  TOURNAMENT_RULES_VERSION,
  academyNameError,
  playersError,
  tournamentRules,
  type TournamentCategoryId,
  type TournamentSlot,
} from "@/lib/tournament";
import PaymentFlow from "./PaymentFlow";

// What the API enforces today, used only until it has answered (and if it never
// does, in which case registering fails anyway).
const FALLBACK = { fee: 2_000, minPlayers: 5, maxPlayers: 40, holdMinutes: 3, categories: DEFAULT_CATEGORIES };
const CATEGORY_ORDER: { id: TournamentCategoryId; label: string }[] = [
  { id: "u10", label: "U10" },
  { id: "u15", label: "U15" },
  { id: "adults", label: "Adults" },
];

interface Errors {
  academyName?: string;
  players?: string;
  categories?: string;
  phone?: string;
  acceptedRules?: string;
}

export default function TournamentRegistration() {
  const queryClient = useQueryClient();
  const cardRef = useRef<HTMLDivElement>(null);

  const { data: info, isError: infoFailed } = useQuery({
    queryKey: ["tournament-info"],
    queryFn: fetchTournamentInfo,
    // Places go quickly: keep the board close to what a team will be told.
    refetchInterval: 10_000,
    retry: 2,
  });

  const [academyName, setAcademyName] = useState("");
  const [players, setPlayers] = useState("");
  const [categories, setCategories] = useState<TournamentCategoryId[]>([]);
  const [phone, setPhone] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [charged, setCharged] = useState<number | null>(null);
  // What was registered, kept for the confirmation after the form is cleared.
  const [placed, setPlaced] = useState<{ name: string; categories: TournamentCategoryId[] } | null>(null);

  const limits = info ?? FALLBACK;
  const rules = useMemo(() => tournamentRules(limits), [limits]);
  const slots = useMemo(() => {
    const byId = new Map<string, TournamentSlot>((info?.categories ?? []).map((c) => [c.id, c]));
    // `slot` is what the API says; `shape` is what to draw until it has.
    return CATEGORY_ORDER.map((c) => ({
      ...c,
      slot: byId.get(c.id),
      shape: byId.get(c.id) ?? DEFAULT_CATEGORIES.find((d) => d.id === c.id)!,
    }));
  }, [info]);

  const mutation = useMutation({
    mutationFn: registerTournament,
    onSuccess: (data) => {
      setCharged(data.total);
      setReference(data.reference);
      void queryClient.invalidateQueries({ queryKey: ["tournament-info"] });
    },
    onError: (err) => {
      setSubmitError(err instanceof RegistrationApiError ? err.message : REGISTRATION_FAILED);
      // Most refusals are "that category filled up": show how things stand now.
      void queryClient.invalidateQueries({ queryKey: ["tournament-info"] });
    },
  });

  // A category that has filled up cannot be taken, so it is never counted as chosen
  // even if the team ticked it before it filled.
  const full = new Set(slots.filter((s) => s.slot && s.slot.left === 0).map((s) => s.id));
  const selected = CATEGORY_ORDER.filter((c) => categories.includes(c.id) && !full.has(c.id));

  const phoneLabel = formatPhone(phone);
  const fee = limits.fee;
  const chosenLabels = selected.map((c) => c.label);

  const toggle = (id: TournamentCategoryId) => {
    setCategories((cur) => (cur.includes(id) ? cur.filter((c) => c !== id) : [...cur, id]));
    setErrors((e) => ({ ...e, categories: undefined }));
    setSubmitError(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mutation.isPending) return;
    const found: Errors = {
      academyName: academyNameError(academyName),
      players: playersError(players, limits.minPlayers, limits.maxPlayers),
      categories:
        categories.length === 0
          ? "Choose at least one category"
          : selected.length === 0
            ? `${CATEGORY_ORDER.filter((c) => categories.includes(c.id)).map((c) => c.label).join(" and ")} ${categories.length === 1 ? "is" : "are"} full. Choose a category that still has places.`
            : undefined,
      phone: phoneError(phone),
      acceptedRules: accepted ? undefined : "Please tick the box to accept the tournament rules",
    };
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      requestAnimationFrame(() => cardRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setSubmitError(null);
    const name = cleanName(academyName);
    const ids = selected.map((c) => c.id);
    setPlaced({ name, categories: ids });
    mutation.mutate({
      academyName: name,
      players: Number(players),
      categories: ids,
      phoneNumber: `254${phone}`,
      acceptedRules: true,
      rulesVersion: TOURNAMENT_RULES_VERSION,
    });
  };

  const backToForm = () => {
    mutation.reset();
    setSubmitError(null);
    setReference(null);
    setCharged(null);
    void queryClient.invalidateQueries({ queryKey: ["tournament-info"] });
  };

  const registerAnother = () => {
    backToForm();
    setAcademyName("");
    setPlayers("");
    setCategories([]);
    setAccepted(false);
    setErrors({});
    setPlaced(null);
  };

  return (
    <div className="mx-auto max-w-3xl px-3.5 sm:px-6">
      <div ref={cardRef} className="rounded-xl border border-[#121e34]/10 bg-white p-4 shadow-xs sm:rounded-2xl sm:p-6">
        {reference && placed ? (
          <PaymentFlow
            key={reference}
            reference={reference}
            name={placed.name}
            total={charged ?? fee}
            phoneLabel={phoneLabel}
            places={placed.categories.map((id) => CATEGORY_ORDER.find((c) => c.id === id)?.label ?? id)}
            holdMinutes={limits.holdMinutes}
            onTryAgain={backToForm}
            onRegisterAnother={registerAnother}
          />
        ) : (
          <form noValidate onSubmit={submit} className="camp-step-in">
            <h2 className="font-playfair text-lg font-semibold leading-tight text-[#121e34] sm:text-xl">
              Register your team
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[#121e34]/70 sm:text-[13px]">
              Places are limited in each category and go to whoever registers first. Pay{" "}
              <strong className="text-[#121e34]">{formatKes(fee)}</strong> by M-Pesa to take yours.
            </p>

            <PlacesBoard slots={slots} failed={infoFailed && !info} />

            <div className="mt-5 grid gap-x-3.5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field
                  label="Name of your academy or club"
                  name="academyName"
                  autoComplete="organization"
                  value={academyName}
                  onChange={(v) => {
                    setAcademyName(v);
                    setErrors((er) => ({ ...er, academyName: undefined }));
                  }}
                  placeholder="e.g. Kibera Stars Academy"
                  error={errors.academyName}
                />
              </div>
              <Field
                label="Total number of players"
                name="players"
                inputMode="numeric"
                maxLength={2}
                value={players}
                onChange={(v) => {
                  setPlayers(v.replace(/\D/g, "").slice(0, 2));
                  setErrors((er) => ({ ...er, players: undefined }));
                }}
                placeholder={`${limits.minPlayers} to ${limits.maxPlayers}`}
                error={errors.players}
              />
              <div>
                <Field
                  label="Phone number"
                  name="phone"
                  type="tel"
                  autoComplete="tel-national"
                  prefix="+254"
                  value={phone}
                  onChange={(v) => {
                    setPhone(normalizePhoneInput(v));
                    setErrors((er) => ({ ...er, phone: undefined }));
                  }}
                  placeholder="7XXXXXXXX"
                  error={errors.phone}
                />
              </div>
              <p className="-mt-3 mb-3.5 ml-1 text-[11px] text-[#121e34]/65 sm:col-span-2">
                The M-Pesa prompt, your confirmation and the fixtures all go to this number.
              </p>
            </div>

            <fieldset className="mt-1" aria-describedby={errors.categories ? "tournament-categories-error" : undefined}>
              <legend className="mb-1.5 ml-1 text-[11px] font-semibold uppercase tracking-widest text-[#2c2825]/70">
                Categories playing
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {slots.map(({ id, label }) => {
                  const on = selected.some((c) => c.id === id);
                  const isFull = full.has(id);
                  return (
                    <label key={id} className={`relative ${isFull ? "cursor-not-allowed" : "cursor-pointer"}`}>
                      <input
                        type="checkbox"
                        name="categories"
                        value={id}
                        checked={on}
                        disabled={isFull}
                        aria-invalid={errors.categories ? true : undefined}
                        onChange={() => toggle(id)}
                        className="peer sr-only"
                      />
                      <span className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#121e34]/15 bg-white px-4 text-[13px] font-bold text-[#1f4b50] transition-colors peer-checked:border-[#1f4b50] peer-checked:bg-[#1f4b50] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#1f4b50] peer-disabled:bg-[#f8f5f2] peer-disabled:text-[#121e34]/45">
                        <Check className={`h-3.5 w-3.5 ${on ? "" : "opacity-0"}`} strokeWidth={3} aria-hidden="true" />
                        {label}
                        {isFull && <span className="text-[11px] font-semibold">· Full</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
              <p className="ml-1 mt-1.5 text-[11px] text-[#121e34]/65">
                Entering more than one category is fine: one registration, one fee, a place in each.
              </p>
              {errors.categories && (
                <span id="tournament-categories-error" role="alert" className="mt-1.5 ml-1 block text-[12px] font-medium text-red-700">
                  {errors.categories}
                </span>
              )}
            </fieldset>

            <div className="mt-5">
              <h3 id="tournament-rules-title" className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#121e34]/65">
                Tournament rules
              </h3>
              <div
                role="region"
                aria-labelledby="tournament-rules-title"
                tabIndex={0}
                data-lenis-prevent
                className="mt-1.5 max-h-44 overflow-y-auto overscroll-contain rounded-xl border border-[#121e34]/10 bg-[#f8f5f2] p-3 text-xs leading-relaxed text-[#121e34]/80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1f4b50]"
              >
                <ol className="space-y-2.5 [overflow-wrap:anywhere]">
                  {rules.map((r, i) => (
                    <li key={r.title}>
                      <p className="font-semibold text-[#121e34]">
                        {i + 1}. {r.title}
                      </p>
                      <p className="mt-0.5">{r.body}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-[#121e34]/85">
                <input
                  type="checkbox"
                  checked={accepted}
                  aria-invalid={errors.acceptedRules ? true : undefined}
                  aria-describedby={errors.acceptedRules ? "tournament-rules-error" : undefined}
                  onChange={(e) => {
                    setAccepted(e.target.checked);
                    setErrors((er) => ({ ...er, acceptedRules: undefined }));
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#1f4b50]"
                />
                <span>I have read and accept the tournament rules on behalf of my academy or club.</span>
              </label>
              {errors.acceptedRules && (
                <span id="tournament-rules-error" role="alert" className="mt-1.5 ml-6 block text-[12px] font-medium text-red-700">
                  {errors.acceptedRules}
                </span>
              )}
            </div>

            {submitError && (
              <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium leading-relaxed text-red-700">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#88b03f] px-6 text-[13px] font-bold text-[#121e34] shadow-2xs transition-colors hover:bg-[#769a35] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1f4b50] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {mutation.isPending
                ? "Sending the M-Pesa prompt…"
                : `Pay ${formatKes(fee)} and take ${chosenLabels.length === 1 ? "the place" : chosenLabels.length > 1 ? "the places" : "a place"}`}
            </button>
          </form>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-[#121e34]/10 bg-white p-4 text-xs text-[#121e34]/70">
        <p className="font-playfair text-sm font-semibold text-[#121e34]">Questions?</p>
        <p className="mt-0.5 leading-relaxed">We&rsquo;re happy to help before you register.</p>
        <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
          <li>
            <a href={PHONE_TEL} className="inline-flex items-center gap-1.5 font-semibold text-[#1f4b50] hover:underline">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {PHONE_DISPLAY}
            </a>
          </li>
          <li>
            <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-1.5 break-all font-semibold text-[#1f4b50] hover:underline">
              <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {EMAIL}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

type BoardSlot = { id: TournamentCategoryId; label: string; slot?: TournamentSlot; shape: TournamentSlot };

/** How many of each category's places are taken, as dots and as words, youth first and then adults. */
function PlacesBoard({ slots, failed }: { slots: BoardSlot[]; failed: boolean }) {
  const groups = [
    { name: "Youth", items: slots.filter((s) => s.shape.group === "youth") },
    { name: "Adults", items: slots.filter((s) => s.shape.group === "adults") },
  ].filter((g) => g.items.length > 0);
  const reserved = slots.filter((s) => s.shape.reserved > 0);

  return (
    <div className="mt-4 space-y-3" aria-live="polite">
      {groups.map((g) => (
        <div key={g.name}>
          <p className="mb-1.5 ml-1 text-[11px] font-semibold uppercase tracking-widest text-[#2c2825]/70">{g.name}</p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {g.items.map(({ id, label, slot, shape }) => {
              const words = !slot
                ? failed
                  ? "Places left unavailable"
                  : "Checking places…"
                : slot.left === 0
                  ? `Full${slot.held > 0 ? ": some teams are still paying" : ""}`
                  : `${slot.left} ${slot.left === 1 ? "place" : "places"} left`;
              return (
                <div key={id} className="rounded-xl border border-[#121e34]/10 bg-[#f8f5f2] px-3.5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-playfair text-sm font-semibold text-[#121e34]">{label}</span>
                    <span className={`text-[11px] font-semibold ${slot && slot.left === 0 ? "text-red-700" : "text-[#1f4b50]"}`}>
                      {words}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-1.5" aria-hidden="true">
                    {Array.from({ length: shape.capacity }, (_, i) => {
                      const paid = slot?.paid ?? 0;
                      const held = slot?.held ?? 0;
                      const state =
                        i < shape.reserved
                          ? "reserved"
                          : i < shape.reserved + paid
                            ? "paid"
                            : i < shape.reserved + paid + held
                              ? "held"
                              : "free";
                      return (
                        <span
                          key={i}
                          className={`h-2.5 flex-1 rounded-full ${
                            state === "reserved"
                              ? "bg-[#88b03f]"
                              : state === "paid"
                                ? "bg-[#1f4b50]"
                                : state === "held"
                                  ? "bg-[#fed107]"
                                  : "bg-[#121e34]/12"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p className="sr-only">
                    {slot
                      ? `${slot.reserved} taken by the academy, ${slot.paid} teams confirmed, ${slot.held} paying, ${slot.left} places left.`
                      : words}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {reserved.length > 0 && (
        <p className="ml-1 flex items-center gap-2 text-[11px] text-[#121e34]/70">
          <span aria-hidden="true" className="h-2.5 w-5 shrink-0 rounded-full bg-[#88b03f]" />
          St. Sebastian Sports Academy has already taken {reserved.length === 1 ? "a place" : "one place"} in{" "}
          {reserved.map((r) => r.label).join(" and ")}.
        </p>
      )}
    </div>
  );
}
