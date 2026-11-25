"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTournamentAdmin } from "@/lib/api";
import { BRAND } from "@/lib/booking";
import { formatKes, formatPhone } from "@/lib/camp";
import type { TournamentRegistrationRecord } from "@/lib/tournament";

function phoneLabel(raw: string): string {
  return raw.startsWith("254") && raw.length === 12 ? formatPhone(raw.slice(3)) : raw;
}

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function Stat({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="flex flex-col gap-1 border-r border-b border-[#121e34]/10 px-6 py-5 last:border-r-0 sm:border-b-0">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#1f4b50]/80">{label}</span>
      <span className="text-2xl font-extrabold leading-none tracking-tight" style={{ color: accent ?? "#121e34" }}>
        {value}
      </span>
      {sub && <span className="text-xs font-medium text-[#1f4b50]/80">{sub}</span>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const paid = status === "Paid";
  const pending = status === "Pending";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
        paid
          ? "border-[#00a64F]/25 bg-[#00a64F]/10 text-[#05632f]"
          : pending
            ? "border-[#fed107]/40 bg-[#fed107]/15 text-[#7a6300]"
            : "border-[#121e34]/10 bg-[#121e34]/5 text-[#1f4b50]"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${paid ? "bg-[#00a64F]" : pending ? "bg-[#fed107]" : "bg-[#1f4b50]/40"}`} />
      {paid ? "Paid" : pending ? "Paying" : status}
    </span>
  );
}

export default function TournamentPanel() {
  const { font } = BRAND;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "u10" | "u15">("all");

  const { data, isError, dataUpdatedAt } = useQuery({
    queryKey: ["admin-tournament"],
    queryFn: fetchTournamentAdmin,
    refetchInterval: 15_000,
  });
  const unknown = !data;
  const regs = useMemo(() => data?.registrations ?? [], [data]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    let digits = q.replace(/\D/g, "");
    if (digits.startsWith("0")) digits = `254${digits.slice(1)}`;
    return regs.filter((r) => {
      if (filter !== "all" && !r.categories.includes(filter)) return false;
      if (!q) return true;
      return r.academyName.toLowerCase().includes(q) || (digits.length > 0 && r.phoneNumber.includes(digits));
    });
  }, [regs, search, filter]);

  const stats = useMemo(() => {
    const paid = regs.filter((r) => r.status === "Paid");
    return {
      paid: paid.length,
      pending: regs.filter((r) => r.status === "Pending").length,
      revenue: paid.reduce((sum, r) => sum + r.amount, 0),
      players: paid.reduce((sum, r) => sum + r.players, 0),
      refunds: regs.filter((r) => r.overflow.length > 0),
    };
  }, [regs]);

  const updatedLabel = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  const FILTERS: { key: typeof filter; label: string }[] = [
    { key: "all", label: "All teams" },
    ...(data?.categories ?? []).map((c) => ({ key: c.id, label: c.label })),
  ];

  return (
    <div style={{ fontFamily: font }}>
      <div className="mb-8">
        <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-[#121e34]">Tournament</h1>
        <p className="mt-1 max-w-2xl text-sm font-medium text-[#1f4b50]/80">
          Teams registered for the U10 and U15 tournament, first come first place.
          {data && <> {formatKes(data.fee)} per registration, {data.teamsPerCategory} teams in each category.</>}
          {updatedLabel && <> · Updated {updatedLabel}</>}
        </p>
      </div>

      {isError && (
        <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Couldn&rsquo;t load the tournament registrations. Try again in a moment. If it keeps happening, sign out and back
          in, and check that the booking API is running and its ADMIN_API_KEY matches.
        </p>
      )}

      {stats.refunds.length > 0 && (
        <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          <p className="font-bold">
            {stats.refunds.length === 1 ? "1 payment needs refunding" : `${stats.refunds.length} payments need refunding`}
          </p>
          <p className="mt-1">
            These teams paid after the category had already filled up, so they have no place. Refund them in Paystack and
            let them know:{" "}
            {stats.refunds.map((r, i) => (
              <span key={r.id}>
                {i > 0 && ", "}
                <strong>{r.academyName}</strong> ({phoneLabel(r.phoneNumber)})
              </span>
            ))}
            .
          </p>
        </div>
      )}

      <section aria-label="Places taken" className="mb-8 grid gap-4 sm:grid-cols-2">
        {(data?.categories ?? []).map((c) => (
          <div key={c.id} className="rounded-2xl border border-[#121e34]/10 bg-white p-5 shadow-sm">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-extrabold text-[#121e34]">{c.label}</h2>
              <p className={`text-sm font-bold ${c.left === 0 ? "text-red-700" : "text-[#1f4b50]"}`}>
                {c.left === 0 ? "Full" : `${c.left} ${c.left === 1 ? "place" : "places"} left`}
              </p>
            </div>
            <div className="mt-3 flex gap-1.5" aria-hidden="true">
              {Array.from({ length: c.capacity }, (_, i) => (
                <span
                  key={i}
                  className={`h-3 flex-1 rounded-full ${
                    i < c.paid ? "bg-[#1f4b50]" : i < c.paid + c.held ? "bg-[#fed107]" : "bg-[#121e34]/12"
                  }`}
                />
              ))}
            </div>
            <p className="mt-2.5 text-xs font-medium text-[#1f4b50]/90">
              {c.paid > c.capacity ? (
                <span className="font-bold text-red-700">
                  {c.paid} paid: {c.paid - c.capacity} over capacity, refund
                </span>
              ) : (
                <>
                  {c.paid} of {c.capacity} confirmed
                </>
              )}
              {c.held > 0 && <> · {c.held} paying now (held for {data?.holdMinutes ?? 3} minutes)</>}
            </p>
          </div>
        ))}
        {unknown && !isError && (
          <p role="status" className="text-sm font-semibold text-[#1f4b50]/80 sm:col-span-2">
            Loading places…
          </p>
        )}
      </section>

      <div className="mb-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-[#121e34]/10 bg-white shadow-sm sm:grid-cols-4">
        <Stat label="Teams paid" value={unknown ? "–" : stats.paid} sub="registrations confirmed" accent="#007a3a" />
        <Stat label="Paying now" value={unknown ? "–" : stats.pending} sub="awaiting M-Pesa" accent="#7a6300" />
        <Stat label="Players" value={unknown ? "–" : stats.players} sub="in paid squads" />
        <Stat label="Collected" value={unknown ? "–" : formatKes(stats.revenue)} sub="from paid teams" />
      </div>

      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div role="group" aria-label="Show category" className="flex items-center gap-1.5 rounded-xl border border-[#121e34]/10 bg-white p-1 shadow-sm">
          {FILTERS.map(({ key, label }) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(key)}
                className="rounded-lg px-4 py-1.5 text-[12px] font-bold transition-colors"
                style={{ backgroundColor: active ? "#88b03f" : "transparent", color: active ? "#ffffff" : "#1f4b50" }}
              >
                {label}
              </button>
            );
          })}
        </div>
        <label className="sr-only" htmlFor="tournament-search">
          Search teams
        </label>
        <input
          id="tournament-search"
          type="search"
          placeholder="Search academy or number…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#121e34]/10 bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#121e34] shadow-sm placeholder-[#6b7280] sm:w-64"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#121e34]/10 bg-white shadow-sm">
        {unknown || rows.length === 0 ? (
          <p role="status" className="px-6 py-16 text-center text-sm font-semibold text-[#1f4b50]/80">
            {unknown
              ? isError
                ? "Registrations could not be loaded."
                : "Loading registrations…"
              : regs.length === 0
                ? "No teams have registered yet."
                : "No teams match your search."}
          </p>
        ) : (
          <div className="relative overflow-x-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(18,30,52,0.1) transparent" }}>
            <table className="w-full border-collapse text-left" style={{ minWidth: 760 }}>
              <caption className="sr-only">Tournament registrations</caption>
              <thead>
                <tr className="border-b border-[#121e34]/10 bg-[#F8F5F2]">
                  {["Academy", "Players", "Categories", "Phone", "Status", "Registered"].map((h) => (
                    <th key={h} scope="col" className="px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#1f4b50]/80">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r: TournamentRegistrationRecord, idx) => (
                  <tr
                    key={r.id}
                    className="transition-colors hover:bg-[#F8F5F2]"
                    style={{ borderBottom: idx === rows.length - 1 ? "none" : "1px solid rgba(18,30,52,0.05)" }}
                  >
                    <td className="max-w-[240px] px-5 py-4">
                      <span className="block break-words text-[13px] font-bold text-[#121e34]">{r.academyName}</span>
                    </td>
                    <td className="px-5 py-4 text-[13px] font-semibold tabular-nums text-[#121e34]">{r.players}</td>
                    <td className="px-5 py-4">
                      <span className="flex gap-1.5">
                        {r.categories.map((c) => (
                          <span
                            key={c}
                            className="rounded-md bg-[#1f4b50]/10 px-2.5 py-1 text-[11px] font-bold uppercase text-[#1f4b50]"
                          >
                            {c}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <a href={`tel:+${r.phoneNumber}`} className="font-mono text-[12px] font-semibold text-[#1f4b50] hover:underline">
                        {phoneLabel(r.phoneNumber)}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={r.status} />
                      {r.overflow.length > 0 && (
                        <span className="mt-1.5 block text-[11px] font-bold text-red-700">
                          No place in {r.overflow.map((o) => o.toUpperCase()).join(" and ")}: refund
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-[#1f4b50]/90">{when(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!unknown && rows.length > 0 && (
          <div className="flex items-center justify-between border-t border-[#121e34]/10 bg-[#F8F5F2] px-6 py-3.5">
            <span className="text-xs font-bold text-[#1f4b50]/80">
              {rows.length === regs.length ? `${rows.length} registrations` : `${rows.length} of ${regs.length} registrations`}
            </span>
            <span className="text-xs font-semibold text-[#1f4b50]/80">Auto-refreshes every 15s</span>
          </div>
        )}
      </div>
    </div>
  );
}
