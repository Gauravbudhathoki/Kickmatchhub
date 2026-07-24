"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, type, className = "", ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    const isPassword = type === "password";
    const [revealed, setRevealed] = useState(false);

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-semibold text-soil">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isPassword ? (revealed ? "text" : "password") : type}
            className={`w-full rounded-xl border-2 bg-white px-4 py-2.5 text-soil placeholder:text-moss/50 transition-colors ${
              error ? "border-clay" : "border-moss/25 focus:border-turf"
            } ${isPassword ? "pr-12" : ""} ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => {
                console.log("eye button clicked, revealed was:", revealed);
                setRevealed((v) => !v);
              }}
              aria-label={revealed ? "Hide password" : "Show password"}
              aria-pressed={revealed}
              className="absolute inset-y-0 right-0 z-10 flex w-11 items-center justify-center text-moss hover:text-soil cursor-pointer"
            >
              {revealed ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-clay">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.7a3 3 0 0 0 4.2 4.2M6.6 6.8C4.4 8.3 3 10.5 2 12c0 0 3.5 7 10 7 1.7 0 3.2-.4 4.4-1.1M9.9 4.2A10.6 10.6 0 0 1 12 4c6.5 0 10 7 10 7-.5.9-1.2 2-2.2 3.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
