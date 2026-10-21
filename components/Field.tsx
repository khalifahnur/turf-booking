"use client";

import { BRAND } from "@/lib/booking";
import React, { useId } from "react";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  prefix?: string;
  error?: string;
  maxLength?: number;
  name?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  required = false,
  prefix,
  error,
  maxLength,
  name,
  autoComplete,
  inputMode,
}: FieldProps) {
  const { font } = BRAND;
  const id = useId();
  const errorId = `${id}-error`;
  
  return (
    <div className="mb-5 relative">
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold uppercase tracking-widest mb-1.5 ml-1"
        style={{ color: "#2c2825", opacity: 0.7, fontFamily: font }}
      >
        {label}
      </label>
      
      <div 
        // The input draws no outline of its own, so the box shows focus instead.
        className="relative flex items-center rounded-xl overflow-hidden border border-black/10 shadow-[0_2px_5px_rgba(0,0,0,0.02)] transition-all duration-300 focus-within:border-[#1f4b50] focus-within:ring-2 focus-within:ring-[#1f4b50]/30"
        style={{
          backgroundColor: "#ffffff",
          fontFamily: font,
          fontSize: 14,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {prefix && (
          <div
            className="flex items-center pl-4 pr-3 border-r h-12"
            style={{
              borderColor: "rgba(0,0,0,0.05)",
            }}
          >
            <span className="text-[#2c2825] font-bold opacity-70 tracking-tight">{prefix}</span>
          </div>
        )}
        
        <input
          id={id}
          name={name}
          autoComplete={autoComplete}
          inputMode={inputMode ?? (type === "tel" ? "numeric" : undefined)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          required={required}
          type={type}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          onChange={(e) => {
            let val = e.target.value;
            if (type === "tel") val = val.replace(/\D/g, "");
            onChange(val);
          }}
          placeholder={placeholder}
          className={`block w-full text-[14px] h-12 outline-none transition-colors placeholder:text-[#6b7280] ${
            prefix ? "pl-3" : "pl-4"
          } pr-4`}
          style={{
            backgroundColor: "transparent",
            color: "#2c2825",
            ...(error && {
              boxShadow: "inset 0 0 0 1px #ef4444", 
              borderRadius: "inherit",
            })
          }}
        />
        
      </div>
      
      {error && (
        <span id={errorId} role="alert" className="text-red-700 text-[12px] font-medium mt-1.5 ml-1 block">
          {error}
        </span>
      )}
    </div>
  );
}