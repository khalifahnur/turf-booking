"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAcademyAdmin } from "@/lib/api";
import { BRAND } from "@/lib/booking";
import { formatKes, formatPhone, todayInNairobi } from "@/lib/camp";
import { ageOn } from "@/lib/tournament";

function phoneLabel(raw: string): string {
  return raw.startsWith("254") && raw.length === 12 ? formatPhone(raw.slice(3)) : raw;
}

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function born(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return date;
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
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

export default function AcademyPanel() {
  const { font } = BRAND;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "Paid" | "Pending">("all");

  const { data, isError, dataUpdatedAt } = useQuery({
    queryKey: ["admin-academy"],
    queryFn: fetchAcademyAdmin,
    refetchInterval: 15_000,
  });
  const unknown = !data;
  const regs = useMemo(() => data?.registrations ?? [], [data]);
  const today = todayInNairobi();

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    let digits = q.replace(/\D/g, "");
    if (digits.startsWith("0")) digits = `254${digits.slice(1)}`;
    return regs.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (!q) return true;
      return (
        r.playerName.toLowerCase().includes(q) ||
        r.guardianName.toLowerCase().includes(q) ||
        (digits.length > 0 && r.phoneNumber.includes(digits))
      );
    });
  }, [regs, search, status]);

  const stats = useMemo(() => {
    const paid = regs.filter((r) => r.status === "Paid");
    return {
      paid: paid.length,
      pending: regs.filter((r) => r.status === "Pending").length,
      revenue: paid.reduce((sum, r) => sum + r.amount, 0),
    };
  }, [regs]);

  const updatedLabel = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  const FILTERS: { key: typeof status; label: string }[] = [
    { key: "all", label: "All" },
    { key: "Paid", label: "Paid" },
    { key: "Pending", label: "Paying" },
  ];

  return (
    <div style={{ fontFamily: font }}>
      <div className="mb-8">
        <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-[#121e34]">Academy registrations</h1>
        <p className="mt-1 max-w-2xl text-sm font-medium text-[#1f4b50]/80">
          Players registered at the St. Sebastian Sports Academy through its website.
          {data && <> {formatKes(data.fee)} per player.</>}
          {updatedLabel && <> · Updated {updatedLabel}</>}
        </p>
      </div>

      {isError && (
        <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Couldn&rsquo;t load the academy registrations. Try again in a moment. If it keeps happening, sign out and back in,
          and check that the booking API is running and its ADMIN_API_KEY matches.
        </p>
      )}

      <div className="mb-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-[#121e34]/10 bg-white shadow-sm sm:grid-cols-3">
        <Stat label="Registered" value={unknown ? "–" : stats.paid} sub="players paid" accent="#007a3a" />
        <Stat label="Paying now" value={unknown ? "–" : stats.pending} sub="awaiting M-Pesa" accent="#7a6300" />
        <Stat label="Collected" value={unknown ? "–" : formatKes(stats.revenue)} sub="from paid players" />
      </div>

      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div role="group" aria-label="Show status" className="flex items-center gap-1.5 rounded-xl border border-[#121e34]/10 bg-white p-1 shadow-sm">
          {FILTERS.map(({ key, label }) => {
            const active = status === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setStatus(key)}
                className="rounded-lg px-4 py-1.5 text-[12px] font-bold transition-colors"
                style={{ backgroundColor: active ? "#88b03f" : "transparent", color: active ? "#ffffff" : "#1f4b50" }}
              >
                {label}
              </button>
            );
          })}
        </div>
        <label className="sr-only" htmlFor="academy-search">
          Search players
        </label>
        <input
          id="academy-search"
          type="search"
          placeholder="Search player, parent or number…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#121e34]/10 bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#121e34] shadow-sm placeholder-[#6b7280] sm:w-72"
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
                ? "No players have registered yet."
                : "No players match your search."}
          </p>
        ) : (
          <div className="relative overflow-x-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(18,30,52,0.1) transparent" }}>
            <table className="w-full border-collapse text-left" style={{ minWidth: 820 }}>
              <caption className="sr-only">Academy registrations</caption>
              <thead>
                <tr className="border-b border-[#121e34]/10 bg-[#F8F5F2]">
                  {["Player", "Date of birth", "Parent / guardian", "Phone", "Status", "Registered"].map((h) => (
                    <th key={h} scope="col" className="px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#1f4b50]/80">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => {
                  const age = ageOn(r.dateOfBirth, today);
                  const paid = r.status === "Paid";
                  return (
                    <tr
                      key={r.id}
                      className="transition-colors hover:bg-[#F8F5F2]"
                      style={{ borderBottom: idx === rows.length - 1 ? "none" : "1px solid rgba(18,30,52,0.05)" }}
                    >
                      <td className="max-w-[220px] px-5 py-4">
                        <span className="block break-words text-[13px] font-bold text-[#121e34]">{r.playerName}</span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-[#1f4b50]/90">
                        {born(r.dateOfBirth)}
                        {age !== null && <span className="block font-semibold text-[#121e34]">{age} years</span>}
                      </td>
                      <td className="max-w-[200px] px-5 py-4 text-[13px] font-semibold text-[#121e34]">
                        <span className="block break-words">{r.guardianName}</span>
                      </td>
                      <td className="px-5 py-4">
                        <a href={`tel:+${r.phoneNumber}`} className="font-mono text-[12px] font-semibold text-[#1f4b50] hover:underline">
                          {phoneLabel(r.phoneNumber)}
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                            paid
                              ? "border-[#00a64F]/25 bg-[#00a64F]/10 text-[#05632f]"
                              : "border-[#fed107]/40 bg-[#fed107]/15 text-[#7a6300]"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${paid ? "bg-[#00a64F]" : "bg-[#fed107]"}`} />
                          {paid ? "Paid" : "Paying"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-[#1f4b50]/90">{when(r.createdAt)}</td>
                    </tr>
                  );
                })}
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
