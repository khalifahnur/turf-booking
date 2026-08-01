"use client";

import { BRAND } from "@/lib/booking";
import React from "react";

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
}: FieldProps) {
  const { font } = BRAND;
  
  return (
    <div className="mb-5 relative">
      <label
        className="block text-[11px] font-semibold uppercase tracking-widest mb-1.5 ml-1"
        style={{ color: "#2c2825", opacity: 0.7, fontFamily: font }}
      >
        {label}
      </label>
      
      <div 
        className="relative flex items-center rounded-xl overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: "#ffffff",
          border: `1px solid rgba(0,0,0,0.1)`,
          boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
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
          className={`block w-full text-[14px] h-12 outline-none transition-colors ${
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
        <span className="text-red-500 text-[12px] font-medium mt-1.5 ml-1 block">
          {error}
        </span>
      )}
    </div>
  );
}