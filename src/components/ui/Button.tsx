import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-clay text-chalk hover:bg-clay-light active:bg-clay shadow-[0_4px_0_0_rgba(32,28,21,0.25)] hover:shadow-[0_2px_0_0_rgba(32,28,21,0.25)] hover:translate-y-[2px]",
  secondary:
    "bg-transparent text-chalk border-2 border-chalk/40 hover:border-chalk hover:bg-chalk/10",
  outline:
    "bg-transparent text-clay border-2 border-clay/40 hover:border-clay hover:bg-clay/5",
  ghost: "bg-transparent text-soil hover:bg-soil/5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-body font-semibold text-sm tracking-wide transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
