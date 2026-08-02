"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import { fetchBookings, fetchBookingsAdmin } from "@/lib/api";
import { BRAND } from "@/lib/booking";
import Link from "next/link";
import Image from "next/image";

function formatDate(raw: string) {
  try {
    const d = new Date(raw);
    return d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  } catch {
    return raw;
  }
}

function formatKSH(n: number) {
  return `KSH ${n.toLocaleString("en-KE")}`;
}

const STATUS: Record<
  string,
  { label: string; dot: string; text: string; bg: string; border: string }
> = {
  Confirmed: {
    label: "Confirmed",
    dot: "bg-[#00a64F]",
    text: "text-[#00a64F]",
    bg: "bg-[#00a64F]/10",
    border: "border-[#00a64F]/20",
  },
  Booked: {
    label: "Confirmed",
    dot: "bg-[#00a64F]",
    text: "text-[#00a64F]",
    bg: "bg-[#00a64F]/10",
    border: "border-[#00a64F]/20",
  },
  Pending: {
    label: "Pending",
    dot: "bg-[#fed107]",
    text: "text-[#b09100]", 
    bg: "bg-[#fed107]/10",
    border: "border-[#fed107]/30",
  },
  Failed: {
    label: "Failed",
    dot: "bg-[#E10600]",
    text: "text-[#E10600]",
    bg: "bg-[#E10600]/10",
    border: "border-[#E10600]/20",
  },
};

function getStatus(raw: string) {
  return (
    STATUS[raw] ?? {
      label: raw ?? "Unknown",
      dot: "bg-[#1f4b50]/30",
      text: "text-[#1f4b50]/50",
      bg: "bg-[#1f4b50]/5",
      border: "border-[#1f4b50]/10",
    }
  );
}

function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      style={{ width: size, height: size }}
      className="animate-spin text-current opacity-60"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-80"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="flex flex-col gap-1 px-6 py-5 border-r border-[#121e34]/10 last:border-r-0">
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1f4b50]/70">
        {label}
      </span>
      <span
        className="text-2xl font-extrabold tracking-tight leading-none"
        style={{ color: accent ?? "#121e34" }}
      >
        {value}
      </span>
      {sub && (
        <span className="text-[11px] font-medium text-[#1f4b50]/60">
          {sub}
        </span>
      )}
    </div>
  );
}

function LoginScreen({
  font,
  onSubmit,
  password,
  setPassword,
  isLoggingIn,
}: {
  font: string;
  onSubmit: (e: React.FormEvent) => void;
  password: string;
  setPassword: (v: string) => void;
  isLoggingIn: boolean;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-[#F8F5F2]"
      style={{ fontFamily: font }}
    >
      <style>{`
        @keyframes ssa-up { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .ssa-login-in { animation: ssa-up 0.45s cubic-bezier(.22,.68,0,1.2) both; }
        .ssa-login-in-d2 { animation-delay: 0.12s; }
        .ssa-pw-input { transition: border-color 180ms ease, box-shadow 180ms ease; }
        .ssa-pw-input:focus {
          border-color: rgba(136,176,63,0.8) !important;
          box-shadow: 0 0 0 3px rgba(136,176,63,0.15);
          outline: none;
        }
      `}</style>

      <div className="w-full max-w-[360px] flex flex-col items-center">
        <Link href="/" className="shrink-0 group block mb-8">
          <div className="relative flex items-center justify-center w-24 sm:w-32 md:w-40 lg:w-48 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/assets/logo.png"
              alt="K-Arena Logo"
              width={1000}
              height={800}
              priority
              className="w-full h-auto object-contain drop-shadow-md"
            />
          </div>
        </Link>

        <form
          onSubmit={onSubmit}
          className="ssa-login-in ssa-login-in-d2 flex flex-col gap-4 w-full"
        >
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#121e34]/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <input
              type="password"
              placeholder="Admin Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ssa-pw-input w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium text-[#121e34] placeholder-[#121e34]/40 bg-white border border-white/20 shadow-lg"
              style={{ fontFamily: font }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn || !password}
            className="relative flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] bg-[#88b03f] hover:bg-[#769a35]"
            style={{
              opacity: isLoggingIn || !password ? 0.6 : 1,
              boxShadow:
                isLoggingIn || !password
                  ? "none"
                  : "0 8px 20px rgba(136,176,63,0.25)",
            }}
          >
            {isLoggingIn ? (
              <Spinner size={16} />
            ) : (
              <>
                Access Dashboard
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { font } = BRAND;
  const { data: session, status } = useSession();
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Confirmed" | "Pending" | "Failed"
  >("all");

  const {
    data: bookings = [],
    isLoading,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: fetchBookingsAdmin,
    enabled: status === "authenticated",
    refetchInterval: 10_000,
  });

  const stats = useMemo(() => {
    if (!Array.isArray(bookings))
      return { total: 0, confirmed: 0, pending: 0, failed: 0, revenue: 0 };
    const confirmed = bookings.filter(
      (b: any) => b.status === "Confirmed" || b.status === "Booked",
    );
    const pending = bookings.filter((b: any) => b.status === "Pending");
    const failed = bookings.filter((b: any) => b.status === "Failed");
    const revenue = confirmed.reduce(
      (sum: number, b: any) => sum + (b.pitchType === "8Aside" ? 8_000 : 5_000),
      0,
    );
    return {
      total: bookings.length,
      confirmed: confirmed.length,
      pending: pending.length,
      failed: failed.length,
      revenue,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (!Array.isArray(bookings)) return [];
    const q = searchTerm.toLowerCase();
    return bookings.filter((b: any) => {
      const matchSearch =
        !q ||
        b.teamName?.toLowerCase().includes(q) ||
        b.userName?.toLowerCase().includes(q) ||
        b.phoneNumber?.includes(q) ||
        b.date?.includes(q);
      const normalised = b.status === "Booked" ? "Confirmed" : b.status;
      const matchStatus = statusFilter === "all" || normalised === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  const updatedLabel = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const result = await signIn("credentials", { password, redirect: false });
    if (result?.error) {
      alert("Invalid password.");
      setIsLoggingIn(false);
    }
  };

  if (status === "loading")
    return (
      <div className="min-h-screen bg-[#F8F5F2]" />
    );

  if (status === "unauthenticated")
    return (
      <LoginScreen
        font={font}
        onSubmit={handleLogin}
        password={password}
        setPassword={setPassword}
        isLoggingIn={isLoggingIn}
      />
    );

  const FILTERS: Array<{ key: typeof statusFilter; label: string }> = [
    { key: "all", label: "All" },
    { key: "Confirmed", label: "Confirmed" },
    { key: "Pending", label: "Pending" },
    { key: "Failed", label: "Failed" },
  ];

  return (
    <div
      className="min-h-screen bg-[#F8F5F2]"
      style={{ fontFamily: font }}
    >
      <style>{`
        @keyframes ssa-pending {
          0%,100% { opacity:1; }
          50%      { opacity:0.4; }
        }
        .ssa-pending-dot { animation: ssa-pending 1.6s ease-in-out infinite; }
        .ssa-row { transition: background 120ms ease; }
        .ssa-row:hover { background: #F8F5F2; }
        .ssa-filter-btn { transition: all 150ms ease; }
        .ssa-search-input { transition: all 180ms ease; }
        .ssa-search-input:focus {
          border-color: rgba(136,176,63,0.5) !important;
          box-shadow: 0 0 0 3px rgba(136,176,63,0.1);
          outline: none;
        }
      `}</style>

      <header className="sticky top-0 z-30 flex items-center justify-between px-6 sm:px-8 h-[60px] bg-white border-b border-[#121e34]/10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="shrink-0 group block">
            <div className="relative flex items-center justify-center w-24 sm:w-28 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/assets/logo.png"
                alt="K-Arena Logo"
                width={500}
                height={200}
                priority
                className="w-full h-auto object-contain"
              />
            </div>
          </Link>
          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded bg-[#88b03f]/10 text-[#88b03f] border border-[#88b03f]/20">
            Admin Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          {session?.user?.email && (
            <span className="hidden sm:block text-xs font-semibold text-[#1f4b50]/70">
              {session.user.email}
            </span>
          )}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all text-[#1f4b50] hover:text-[#E10600] hover:bg-[#E10600]/10 border border-transparent hover:border-[#E10600]/20"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-[1320px] mx-auto px-6 sm:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[1.75rem] font-extrabold tracking-tight leading-tight text-[#121e34]">
              Bookings Overview
            </h1>
            <p className="text-sm font-medium mt-1 text-[#1f4b50]/70">
              {updatedLabel && <span>Updated {updatedLabel}</span>}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 rounded-2xl overflow-hidden mb-8 bg-white border border-[#121e34]/10 shadow-sm">
          <Stat label="Total" value={stats.total} sub="all bookings" />
          <Stat
            label="Confirmed"
            value={stats.confirmed}
            sub="paid & active"
            accent="#00a64F"
          />
          <Stat
            label="Pending"
            value={stats.pending}
            sub="awaiting M-Pesa"
            accent="#d9b300"
          />
          <Stat
            label="Failed"
            value={stats.failed}
            sub="unsuccessful"
            accent="#E10600"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 p-1 bg-white border border-[#121e34]/10 rounded-xl shadow-sm">
            {FILTERS.map(({ key, label }) => {
              const active = statusFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className="ssa-filter-btn text-[12px] font-bold px-4 py-1.5 rounded-lg"
                  style={{
                    backgroundColor: active ? "#88b03f" : "transparent",
                    color: active ? "#ffffff" : "#1f4b50",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#1f4b50]/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search team, phone, date…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ssa-search-input w-full text-[13px] font-medium text-[#121e34] pl-10 pr-9 py-2.5 rounded-xl bg-white border border-[#121e34]/10 shadow-sm placeholder-[#1f4b50]/40"
              style={{ fontFamily: font }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1f4b50]/40 hover:text-[#E10600] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden bg-white border border-[#121e34]/10 shadow-sm">
          <div
            className="overflow-x-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(18,30,52,0.1) transparent",
            }}
          >
            <table className="w-full text-left border-collapse" style={{ minWidth: 780 }}>
              <thead>
                <tr className="border-b border-[#121e34]/10 bg-[#F8F5F2]">
                  {["Date & Time", "Pitch", "Team / Rep", "Phone", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1f4b50]/70"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex items-center justify-center gap-2.5 text-[#1f4b50]/60">
                        <Spinner size={18} />
                        <span className="text-sm font-semibold">Loading bookings…</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <p className="text-sm font-bold text-[#1f4b50]/60">
                        {searchTerm || statusFilter !== "all"
                          ? "No bookings match your filters."
                          : "No bookings yet."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b: any, idx: number) => {
                    const s = getStatus(b.status);
                    const isLast = idx === filteredBookings.length - 1;
                    return (
                      <tr
                        key={idx}
                        className="ssa-row"
                        style={{
                          borderBottom: isLast ? "none" : "1px solid rgba(18,30,52,0.05)",
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-[13px] font-bold text-[#121e34]">
                            {formatDate(b.date)}
                          </span>
                          <span className="block text-[11px] mt-0.5 font-mono font-medium text-[#1f4b50]/70">
                            {b.time}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-md"
                            style={{
                              backgroundColor: b.pitchType === "8Aside" ? "rgba(31,75,80,0.1)" : "rgba(136,176,63,0.15)",
                              color: b.pitchType === "8Aside" ? "#1f4b50" : "#88b03f",
                            }}
                          >
                            {b.pitchType === "8Aside" ? "8-Aside" : "5-Aside"}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-[200px]">
                          <span className="block text-[13px] font-bold text-[#121e34] truncate">
                            {b.teamName || "—"}
                          </span>
                          <span className="block text-[11px] font-semibold mt-0.5 truncate text-[#1f4b50]/60">
                            {b.userName || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono font-semibold text-[12px] text-[#1f4b50]/80">
                            {b.phoneNumber || "—"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.bg} ${s.border} ${s.text}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot} ${
                                b.status === "Pending" ? "ssa-pending-dot" : ""
                              }`}
                            />
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && filteredBookings.length > 0 && (
            <div className="px-6 py-3.5 flex items-center justify-between border-t border-[#121e34]/10 bg-[#F8F5F2]">
              <span className="text-[11px] font-bold text-[#1f4b50]/60">
                {filteredBookings.length === (bookings as any[]).length
                  ? `${filteredBookings.length} bookings`
                  : `${filteredBookings.length} of ${(bookings as any[]).length} bookings`}
              </span>
              <span className="text-[11px] font-semibold text-[#1f4b50]/50">
                Auto-refreshes every 10s
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}