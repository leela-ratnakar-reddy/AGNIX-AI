import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-agnix-red/60 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-agnix-red to-[#d62426] hover:from-[#ff3b30] hover:to-agnix-red text-white shadow-fire-subtle hover:shadow-fire-glow border border-agnix-red/30",
      secondary:
        "bg-agnix-elevated hover:bg-agnix-hover text-agnix-text-primary border border-agnix-border hover:border-agnix-borderLight",
      ghost:
        "bg-transparent hover:bg-agnix-hover text-agnix-text-secondary hover:text-agnix-text-primary",
      outline:
        "bg-transparent border border-agnix-border hover:border-agnix-red/50 hover:bg-agnix-surface text-agnix-text-primary",
      danger:
        "bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40",
    };

    const sizeStyles = {
      sm: "px-2.5 py-1.5 text-xs gap-1.5",
      md: "px-3.5 py-2 text-sm gap-2",
      lg: "px-5 py-2.5 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-1" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
