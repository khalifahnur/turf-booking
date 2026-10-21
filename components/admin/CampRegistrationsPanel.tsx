"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCampRegistrationsAdmin } from "@/lib/api";
import { BRAND, KSH } from "@/lib/booking";
import { CAMP_WEEKS, formatPhone, type CampRegistrationRecord } from "@/lib/camp";

type StatusFilter = "Paid" | "Pending" | "all";

const weekIndex = new Map(CAMP_WEEKS.map((w) => [w.start, w]));

function phoneLabel(raw: string): string {
  return raw.startsWith("254") && raw.length === 12 ? formatPhone(raw.slice(3)) : raw;
}

function when(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

/**
 * Spreadsheet programs run any cell that starts with = + - or @ as a formula,
 * and these cells hold text typed by members of the public. A leading quote
 * makes them plain text.
 */
function csvCell(value: string | number | boolean): string {
  let text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/** "254 712 345 678": plain digits, so no leading "+" for the formula guard to trip on. */
function csvPhone(raw: string): string {
  return raw.length === 12 ? `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6, 9)} ${raw.slice(9)}` : raw;
}

function toCsv(rows: CampRegistrationRecord[]): string {
  const header = ["Child", "Parent / guardian", "Phone", "Email", "Programme", "Lunch", "Weeks", "Amount (KES)", "Status", "Paid at", "Registered at"];
  const lines = rows.map((r) =>
    [
      r.childName,
      r.parentName,
      csvPhone(r.phoneNumber),
      r.email,
      r.programLabel,
      r.lunch ? "Yes" : "No",
      r.weeks.map((w) => `Wk ${weekIndex.get(w)?.index ?? "?"} (${weekIndex.get(w)?.label ?? w})`).join("; "),
      r.amount,
      r.status,
      r.paidAt ?? "",
      r.createdAt,
    ]
      .map(csvCell)
      .join(","),
  );
  // The BOM makes Excel read the file as UTF-8, so accented names survive.
  return "﻿" + [header.map(csvCell).join(","), ...lines].join("\r\n");
}

function downloadCsv(rows: CampRegistrationRecord[]) {
  const url = URL.createObjectURL(new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `camp-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Stat({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="flex flex-col gap-1 border-r border-b border-[#121e34]/10 px-6 py-5 last:border-r-0 sm:border-b-0">
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1f4b50]/70">{label}</span>
      <span className="text-2xl font-extrabold leading-none tracking-tight" style={{ color: accent ?? "#121e34" }}>
        {value}
      </span>
      {sub && <span className="text-[11px] font-medium text-[#1f4b50]/60">{sub}</span>}
    </div>
  );
}

export default function CampRegistrationsPanel() {
  const { font } = BRAND;
  const [status, setStatus] = useState<StatusFilter>("Paid");
  const [week, setWeek] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, dataUpdatedAt } = useQuery({
    queryKey: ["admin-camp"],
    queryFn: fetchCampRegistrationsAdmin,
    refetchInterval: 15_000,
  });
  const records = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const paid = useMemo(() => records.filter((r) => r.status === "Paid"), [records]);

  const stats = useMemo(() => {
    const children = new Set(paid.map((r) => `${r.childName.toLowerCase()}|${r.phoneNumber}`));
    return {
      registrations: paid.length,
      children: children.size,
      revenue: paid.reduce((sum, r) => sum + r.amount, 0),
      pending: records.filter((r) => r.status === "Pending").length,
    };
  }, [paid, records]);

  // Who is coming each week, and how many lunches to prepare.
  const headcount = useMemo(
    () =>
      CAMP_WEEKS.map((w) => {
        const here = paid.filter((r) => r.weeks.includes(w.start));
        return {
          week: w,
          children: here.length,
          fullDay: here.filter((r) => r.program === "fullDay").length,
          halfDay: here.filter((r) => r.program === "halfDay").length,
          lunches: here.filter((r) => r.lunch).length,
        };
      }),
    [paid],
  );

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (week !== "all" && !r.weeks.includes(week)) return false;
      if (!q) return true;
      return [r.childName, r.parentName, r.phoneNumber, r.email].some((v) => v.toLowerCase().includes(q));
    });
  }, [records, status, week, search]);

  const updatedLabel = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  const FILTERS: { key: StatusFilter; label: string }[] = [
    { key: "Paid", label: "Paid" },
    { key: "Pending", label: "Awaiting payment" },
    { key: "all", label: "All" },
  ];

  return (
    <div style={{ fontFamily: font }}>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-[#121e34]">Holiday camp</h1>
          <p className="mt-1 text-sm font-medium text-[#1f4b50]/70">
            Registrations and payments{updatedLabel && <> · Updated {updatedLabel}</>}
          </p>
        </div>
        <button
          type="button"
          onClick={() => downloadCsv(rows)}
          disabled={rows.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#88b03f] px-4 py-2.5 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-[#769a35] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
          </svg>
          Export {rows.length} {rows.length === 1 ? "row" : "rows"} (CSV)
        </button>
      </div>

      {isError && (
        <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Couldn&rsquo;t load camp registrations. Check that the API is reachable and ADMIN_API_KEY matches on both servers.
        </p>
      )}

      <div className="mb-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-[#121e34]/10 bg-white shadow-sm sm:grid-cols-4">
        <Stat label="Paid" value={stats.registrations} sub="registrations" accent="#00a64F" />
        <Stat label="Children" value={stats.children} sub="with a paid place" />
        <Stat label="Collected" value={KSH(stats.revenue)} sub="from paid registrations" />
        <Stat label="Awaiting" value={stats.pending} sub="M-Pesa prompt sent" accent="#d9b300" />
      </div>

      <section aria-labelledby="camp-headcount" className="mb-8">
        <h2 id="camp-headcount" className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1f4b50]/70">
          Headcount by week (paid)
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {headcount.map(({ week: w, children, fullDay, halfDay, lunches }) => (
            <li key={w.start}>
              <button
                type="button"
                onClick={() => setWeek((cur) => (cur === w.start ? "all" : w.start))}
                aria-pressed={week === w.start}
                className={`w-full rounded-2xl border p-3.5 text-left transition-colors ${
                  week === w.start ? "border-[#88b03f] bg-[#88b03f]/10" : "border-[#121e34]/10 bg-white hover:border-[#88b03f]/50"
                }`}
              >
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#1f4b50]/70">Week {w.index}</span>
                <span className="block text-[12px] font-semibold text-[#121e34]">{w.label}</span>
                <span className="mt-2 block text-2xl font-extrabold leading-none tabular-nums text-[#121e34]">{children}</span>
                <span className="mt-1 block text-[11px] leading-tight text-[#1f4b50]/65">
                  {fullDay} full · {halfDay} half
                  <br />
                  {lunches} lunch{lunches === 1 ? "" : "es"}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] text-[#1f4b50]/55">Select a week to list only its children.</p>
      </section>

      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1.5 rounded-xl border border-[#121e34]/10 bg-white p-1 shadow-sm">
          {FILTERS.map(({ key, label }) => {
            const active = status === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setStatus(key)}
                aria-pressed={active}
                className="rounded-lg px-4 py-1.5 text-[12px] font-bold transition-all"
                style={{ backgroundColor: active ? "#88b03f" : "transparent", color: active ? "#ffffff" : "#1f4b50" }}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <label className="sr-only" htmlFor="camp-week-filter">Filter by week</label>
          <select
            id="camp-week-filter"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            className="rounded-xl border border-[#121e34]/10 bg-white px-3 py-2.5 text-[13px] font-medium text-[#121e34] shadow-sm"
          >
            <option value="all">All weeks</option>
            {CAMP_WEEKS.map((w) => (
              <option key={w.start} value={w.start}>
                Week {w.index} · {w.label}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="camp-search">Search registrations</label>
          <input
            id="camp-search"
            type="search"
            placeholder="Search child, parent, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#121e34]/10 bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#121e34] shadow-sm placeholder-[#1f4b50]/40 sm:w-64"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#121e34]/10 bg-white shadow-sm">
        <div className="overflow-x-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(18,30,52,0.1) transparent" }}>
          <table className="w-full border-collapse text-left" style={{ minWidth: 960 }}>
            <caption className="sr-only">Holiday camp registrations</caption>
            <thead>
              <tr className="border-b border-[#121e34]/10 bg-[#F8F5F2]">
                {["Child", "Parent / guardian", "Contact", "Programme", "Weeks", "Amount", "Paid", "Status"].map((h) => (
                  <th key={h} scope="col" className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1f4b50]/70">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-sm font-semibold text-[#1f4b50]/60">
                    Loading registrations…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-sm font-bold text-[#1f4b50]/60">
                    {search || week !== "all" || status !== "all" ? "No registrations match your filters." : "No registrations yet."}
                  </td>
                </tr>
              ) : (
                rows.map((r, idx) => (
                  <tr
                    key={r.id}
                    className="transition-colors hover:bg-[#F8F5F2]"
                    style={{ borderBottom: idx === rows.length - 1 ? "none" : "1px solid rgba(18,30,52,0.05)" }}
                  >
                    <td className="px-5 py-4">
                      <span className="block text-[13px] font-bold text-[#121e34]">{r.childName}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="block text-[13px] font-semibold text-[#121e34]">{r.parentName}</span>
                    </td>
                    <td className="px-5 py-4">
                      <a href={`tel:+${r.phoneNumber}`} className="block font-mono text-[12px] font-semibold text-[#1f4b50] hover:underline">
                        {phoneLabel(r.phoneNumber)}
                      </a>
                      <span className="block max-w-[200px] truncate text-[11px] text-[#1f4b50]/60">{r.email}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-block rounded-md px-2.5 py-1 text-[11px] font-bold"
                        style={{
                          backgroundColor: r.program === "fullDay" ? "rgba(31,75,80,0.1)" : "rgba(136,176,63,0.15)",
                          color: r.program === "fullDay" ? "#1f4b50" : "#5f7f26",
                        }}
                      >
                        {r.programLabel}
                      </span>
                      {r.lunch && (
                        <span className="ml-1.5 inline-block rounded-md bg-[#fed107]/25 px-2 py-1 text-[11px] font-bold text-[#8a6d00]">
                          + lunch
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex max-w-[210px] flex-wrap gap-1">
                        {r.weeks.map((w) => (
                          <span
                            key={w}
                            title={weekIndex.get(w)?.label ?? w}
                            className="rounded bg-[#1f4b50]/8 px-1.5 py-0.5 text-[11px] font-bold text-[#1f4b50]"
                          >
                            W{weekIndex.get(w)?.index ?? "?"}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[13px] font-bold tabular-nums text-[#121e34]">{KSH(r.amount)}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-[12px] font-medium text-[#1f4b50]/80">{when(r.paidAt)}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                          r.status === "Paid"
                            ? "border-[#00a64F]/20 bg-[#00a64F]/10 text-[#00a64F]"
                            : "border-[#fed107]/30 bg-[#fed107]/10 text-[#b09100]"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${r.status === "Paid" ? "bg-[#00a64F]" : "bg-[#fed107]"}`} />
                        {r.status === "Paid" ? "Paid" : "Awaiting"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && rows.length > 0 && (
          <div className="flex items-center justify-between border-t border-[#121e34]/10 bg-[#F8F5F2] px-6 py-3.5">
            <span className="text-[11px] font-bold text-[#1f4b50]/60">
              {rows.length === records.length ? `${rows.length} registrations` : `${rows.length} of ${records.length} registrations`}
            </span>
            <span className="text-[11px] font-semibold text-[#1f4b50]/50">Auto-refreshes every 15s</span>
          </div>
        )}
      </div>
    </div>
  );
}
