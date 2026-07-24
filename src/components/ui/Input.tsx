import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-semibold text-soil">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`rounded-xl border-2 bg-white/60 px-4 py-2.5 text-soil placeholder:text-moss/50 transition-colors ${
            error ? "border-clay" : "border-moss/25 focus:border-turf"
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
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
