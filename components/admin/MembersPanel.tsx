"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addMemberAdmin, fetchMembersAdmin, removeMemberAdmin } from "@/lib/api";
import { BRAND, KSH, priceFor } from "@/lib/booking";
import { formatPhone } from "@/lib/camp";
import { monthName, type MemberRecord } from "@/lib/members";

const PHONE_PATTERN = /^[17]\d{8}$/;

function phoneLabel(raw: string): string {
  return raw.startsWith("254") && raw.length === 12 ? formatPhone(raw.slice(3)) : raw;
}

function added(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
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

/** One dot for each discounted session in the month, filled for those used. */
function Sessions({ used, limit }: { used: number; limit: number }) {
  const shown = Math.min(used, limit);
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className="inline-flex gap-1">
        {Array.from({ length: limit }, (_, i) => (
          <span
            key={i}
            className={`h-2.5 w-2.5 rounded-full border ${i < shown ? "border-[#1f4b50] bg-[#1f4b50]" : "border-[#1f4b50]/40 bg-transparent"}`}
          />
        ))}
      </span>
      <span className="text-[13px] font-bold tabular-nums text-[#121e34]">
        {used} <span className="font-semibold text-[#1f4b50]/80">of {limit}</span>
      </span>
    </span>
  );
}

export default function MembersPanel() {
  const { font } = BRAND;
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null); // the number about to be removed
  const [removeError, setRemoveError] = useState<string | null>(null);

  const { data, isError, dataUpdatedAt } = useQuery({
    queryKey: ["admin-members"],
    queryFn: fetchMembersAdmin,
    refetchInterval: 20_000,
  });
  const members = useMemo(() => data?.members ?? [], [data]);
  const unknown = !data;

  const add = useMutation({
    mutationFn: addMemberAdmin,
    onSuccess: (member) => {
      setName("");
      setPhone("");
      setFormError(null);
      setNotice(`Added ${member.fullName}. They get the member price from their next booking.`);
      queryClient.invalidateQueries({ queryKey: ["admin-members"] });
    },
    onError: (err: Error) => {
      setNotice(null);
      setFormError(err.message);
    },
  });

  const remove = useMutation({
    mutationFn: removeMemberAdmin,
    onSuccess: (_void, number) => {
      const gone = members.find((m) => m.phoneNumber === number);
      setConfirming(null);
      setRemoveError(null);
      setNotice(gone ? `Removed ${gone.fullName}. Their next booking is at the standard price.` : "Removed.");
      queryClient.invalidateQueries({ queryKey: ["admin-members"] });
    },
    onError: (err: Error) => {
      setNotice(null);
      setRemoveError(err.message);
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    if (name.trim().length < 2) return setFormError("Enter the member's name.");
    if (!PHONE_PATTERN.test(phone)) return setFormError("Enter 9 digits starting with 7 or 1, e.g. 712345678.");
    setFormError(null);
    add.mutate({ fullName: name.trim(), phoneNumber: `254${phone}` });
  };

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    // Numbers are stored as 254712345678; people search the way they write them (0712…, +254 712…).
    let digits = q.replace(/\D/g, "");
    if (digits.startsWith("0")) digits = `254${digits.slice(1)}`;
    return members.filter(
      (m) => m.fullName.toLowerCase().includes(q) || (digits.length > 0 && m.phoneNumber.includes(digits)),
    );
  }, [members, search]);

  const month = data ? monthName(data.month) : "";
  const stats = useMemo(
    () => ({
      count: members.length,
      used: members.reduce((sum, m) => sum + m.used, 0),
      full: data ? members.filter((m) => m.used >= data.limit).length : 0,
    }),
    [members, data],
  );

  const memberPrice = data ? (priceFor("8Aside", 120) * (100 - data.percent)) / 100 : null;
  const updatedLabel = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  return (
    <div style={{ fontFamily: font }}>
      <div className="mb-8">
        <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-[#121e34]">Members</h1>
        <p className="mt-1 max-w-2xl text-sm font-medium text-[#1f4b50]/80">
          {data && memberPrice !== null ? (
            <>
              Members pay {data.percent}% less on the 8-a-side 2 hr session ({KSH(priceFor("8Aside", 120))} becomes{" "}
              {KSH(memberPrice)}), for up to {data.limit} sessions a month. Everything else is at the standard price.
            </>
          ) : (
            "Members get the member price on the sessions it covers."
          )}
          {updatedLabel && <> · Updated {updatedLabel}</>}
        </p>
      </div>

      {isError && (
        <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Couldn&rsquo;t load the members. Try again in a moment. If it keeps happening, sign out and back in, and check that
          the booking API is running and its ADMIN_API_KEY matches.
        </p>
      )}

      <form
        onSubmit={submit}
        noValidate
        className="mb-8 rounded-2xl border border-[#121e34]/10 bg-white p-5 shadow-sm"
        aria-labelledby="add-member-heading"
      >
        <h2 id="add-member-heading" className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#1f4b50]/80">
          Add a member
        </h2>
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <label htmlFor="member-name" className="mb-1.5 block text-xs font-semibold text-[#2c2825]/80">
              Name
            </label>
            <input
              id="member-name"
              type="text"
              autoComplete="off"
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Amina Otieno"
              disabled={add.isPending}
              aria-invalid={formError ? true : undefined}
              aria-describedby={formError ? "member-form-error" : undefined}
              className="h-11 w-full rounded-xl border border-[#121e34]/15 bg-white px-3.5 text-[13px] font-medium text-[#121e34] placeholder-[#6b7280] focus-visible:border-[#1f4b50] focus-visible:outline-2 focus-visible:outline-[#1f4b50]/30 disabled:opacity-60"
            />
          </div>
          <div>
            <label htmlFor="member-phone" className="mb-1.5 block text-xs font-semibold text-[#2c2825]/80">
              M-Pesa number
            </label>
            <div className="flex h-11 items-center overflow-hidden rounded-xl border border-[#121e34]/15 bg-white focus-within:border-[#1f4b50] focus-within:outline-2 focus-within:outline-[#1f4b50]/30">
              <span className="border-r border-[#121e34]/10 px-3 text-[13px] font-bold text-[#2c2825]/70">+254</span>
              <input
                id="member-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="off"
                maxLength={9}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="7XXXXXXXX"
                disabled={add.isPending}
                aria-invalid={formError ? true : undefined}
                aria-describedby={formError ? "member-form-error" : undefined}
                className="h-full w-full bg-transparent px-3 text-[13px] font-medium text-[#121e34] outline-none placeholder-[#6b7280] disabled:opacity-60"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={add.isPending}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#88b03f] px-5 text-[13px] font-bold text-[#121e34] shadow-sm transition-colors hover:bg-[#769a35] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {add.isPending ? "Adding…" : "Add member"}
          </button>
        </div>
        {formError && (
          <p id="member-form-error" role="alert" className="mt-3 text-[13px] font-medium text-red-700">
            {formError}
          </p>
        )}
      </form>

      <div aria-live="polite" className="mb-6 empty:mb-0">
        {notice && (
          <p role="status" className="rounded-xl border border-[#00a64F]/25 bg-[#00a64F]/10 px-4 py-3 text-sm font-medium text-[#05632f]">
            {notice}
          </p>
        )}
      </div>

      <div className="mb-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-[#121e34]/10 bg-white shadow-sm sm:grid-cols-3">
        <Stat label="Members" value={unknown ? "–" : stats.count} sub="on the list" />
        <Stat
          label={month ? `${month} sessions` : "Sessions"}
          value={unknown ? "–" : stats.used}
          sub="booked at the member price"
          accent="#007a3a"
        />
        <Stat
          label="All used"
          value={unknown ? "–" : stats.full}
          sub={data ? `reached ${data.limit} this month` : "reached the limit"}
          accent="#7a6300"
        />
      </div>

      <div className="mb-4 flex justify-end">
        <label className="sr-only" htmlFor="member-search">Search members</label>
        <input
          id="member-search"
          type="search"
          placeholder="Search name or number…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#121e34]/10 bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#121e34] shadow-sm placeholder-[#6b7280] sm:w-64"
        />
      </div>

      {removeError && (
        <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {removeError}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#121e34]/10 bg-white shadow-sm">
        {unknown || rows.length === 0 ? (
          <p role="status" className="px-6 py-16 text-center text-sm font-semibold text-[#1f4b50]/80">
            {unknown
              ? isError
                ? "Members could not be loaded."
                : "Loading members…"
              : members.length === 0
                ? "No members yet. Add the first one above."
                : "No members match your search."}
          </p>
        ) : (
          // "relative" makes this the containing block of the visually-hidden labels in the
          // table, so they scroll with it instead of stretching the whole page sideways.
          <div className="relative overflow-x-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(18,30,52,0.1) transparent" }}>
            <table className="w-full border-collapse text-left" style={{ minWidth: 760 }}>
              <caption className="sr-only">Members</caption>
              <thead>
                <tr className="border-b border-[#121e34]/10 bg-[#F8F5F2]">
                  {["Name", "M-Pesa number", `${month} sessions`, "Added", ""].map((h, i) => (
                    <th key={i} scope="col" className="px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#1f4b50]/80">
                      {h || <span className="sr-only">Actions</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((m: MemberRecord, idx) => (
                  <tr
                    key={m.id}
                    className="transition-colors hover:bg-[#F8F5F2]"
                    style={{ borderBottom: idx === rows.length - 1 ? "none" : "1px solid rgba(18,30,52,0.05)" }}
                  >
                    <td className="px-5 py-4">
                      <span className="block break-words text-[13px] font-bold text-[#121e34]">{m.fullName}</span>
                    </td>
                    <td className="px-5 py-4">
                      <a href={`tel:+${m.phoneNumber}`} className="font-mono text-[12px] font-semibold text-[#1f4b50] hover:underline">
                        {phoneLabel(m.phoneNumber)}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <Sessions used={m.used} limit={data.limit} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-[#1f4b50]/90">{added(m.createdAt)}</td>
                    <td className="px-5 py-4 text-right">
                      {confirming === m.phoneNumber ? (
                        <span className="inline-flex flex-wrap items-center justify-end gap-2">
                          <span className="text-xs font-semibold text-[#121e34]">Remove {m.fullName}?</span>
                          <button
                            type="button"
                            onClick={() => remove.mutate(m.phoneNumber)}
                            disabled={remove.isPending}
                            className="min-h-9 rounded-lg bg-[#E10600] px-3 text-xs font-bold text-white transition-colors hover:bg-[#b80500] disabled:opacity-60"
                          >
                            {remove.isPending ? "Removing…" : "Yes, remove"}
                          </button>
                          <button
                            type="button"
                            autoFocus // the safe choice, so a keyboard user does not lose their place or remove by accident
                            onClick={() => setConfirming(null)}
                            disabled={remove.isPending}
                            className="min-h-9 rounded-lg px-3 text-xs font-bold text-[#1f4b50] hover:bg-[#1f4b50]/10"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setRemoveError(null);
                            setNotice(null);
                            setConfirming(m.phoneNumber);
                          }}
                          className="min-h-9 rounded-lg px-3 text-xs font-bold text-[#a30500] transition-colors hover:bg-[#E10600]/10"
                        >
                          Remove<span className="sr-only"> {m.fullName}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!unknown && rows.length > 0 && (
          <div className="flex items-center justify-between border-t border-[#121e34]/10 bg-[#F8F5F2] px-6 py-3.5">
            <span className="text-xs font-bold text-[#1f4b50]/80">
              {rows.length === members.length ? `${rows.length} members` : `${rows.length} of ${members.length} members`}
            </span>
            <span className="text-xs font-semibold text-[#1f4b50]/80">Auto-refreshes every 20s</span>
          </div>
        )}
      </div>
    </div>
  );
}
