import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "secondary" | "danger" | "fire";
  size?: "xs" | "sm" | "md" | "lg";
  "aria-label": string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      children,
      variant = "ghost",
      size = "md",
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-agnix-red/60 disabled:opacity-40 disabled:cursor-not-allowed select-none";

    const variantStyles = {
      ghost:
        "text-agnix-text-secondary hover:text-agnix-text-primary hover:bg-agnix-hover",
      secondary:
        "bg-agnix-surface hover:bg-agnix-hover text-agnix-text-secondary hover:text-agnix-text-primary border border-agnix-border",
      danger:
        "text-agnix-text-secondary hover:text-red-400 hover:bg-red-950/30",
      fire:
        "text-agnix-red hover:text-agnix-orangeFire hover:bg-agnix-red/10 border border-agnix-red/20",
    };

    const sizeStyles = {
      xs: "w-6 h-6 text-xs p-1",
      sm: "w-7 h-7 text-xs p-1.5",
      md: "w-8 h-8 text-sm p-1.5",
      lg: "w-9 h-9 text-base p-2",
    };

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        title={ariaLabel}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
