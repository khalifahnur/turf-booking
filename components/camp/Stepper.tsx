import { Check } from "lucide-react";

const STEPS = [
  { n: 1, label: "Your details" },
  { n: 2, label: "Plan & payment" },
] as const;

export default function Stepper({ step }: { step: 1 | 2 }) {
  return (
    <ol className="flex items-center gap-3 sm:gap-4" aria-label="Registration progress">
      {STEPS.map((s, i) => {
        const done = step > s.n;
        const active = step === s.n;
        return (
          <li
            key={s.n}
            aria-current={active ? "step" : undefined}
            className={`flex items-center gap-3 sm:gap-4 ${i === 0 ? "flex-1" : ""}`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300 ${
                done
                  ? "bg-[#88b03f] text-white"
                  : active
                    ? "bg-[#1f4b50] text-white shadow-[0_6px_16px_-4px_rgba(31,75,80,0.55)]"
                    : "border-2 border-[#121e34]/15 text-[#121e34]/40"
              }`}
            >
              {done ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : s.n}
              <span className="sr-only">{done ? " (completed)" : ""}</span>
            </span>
            <span
              className={`text-[13px] font-semibold leading-tight transition-colors sm:text-sm ${
                active || done ? "text-[#121e34]" : "text-[#121e34]/45"
              }`}
            >
              {s.label}
            </span>
            {i === 0 && (
              <span aria-hidden="true" className="relative ml-1 h-0.5 flex-1 rounded-full bg-[#121e34]/10">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-[#88b03f] transition-[width] duration-500 ease-out"
                  style={{ width: step > 1 ? "100%" : "0%" }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
