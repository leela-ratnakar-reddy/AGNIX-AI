import React from "react";
import { cn } from "@/lib/utils";

interface AgnixLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}

export function AgnixLogo({
  className,
  showWordmark = true,
  size = "md",
}: AgnixLogoProps) {
  const sizeMap = {
    sm: { icon: 20, text: "text-sm", badge: "text-[9px] px-1 py-0.2" },
    md: { icon: 24, text: "text-base", badge: "text-[10px] px-1.5 py-0.5" },
    lg: { icon: 32, text: "text-xl", badge: "text-xs px-2 py-0.5" },
  };

  const dim = sizeMap[size];

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {/* Abstract Geometric Flame "A" Emblem */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        <svg
          width={dim.icon}
          height={dim.icon}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200 hover:scale-105"
        >
          <defs>
            <linearGradient id="agnixFlame" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF6A00" />
              <stop offset="50%" stopColor="#EF2B2D" />
              <stop offset="100%" stopColor="#B31B1D" />
            </linearGradient>
            <linearGradient id="agnixCore" x1="16" y1="12" x2="16" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFA100" />
              <stop offset="100%" stopColor="#FF3B30" />
            </linearGradient>
          </defs>

          {/* Outer Stylized Geometric "A" */}
          <path
            d="M16 3L4 27H9.5L13.5 19H18.5L22.5 27H28L16 3Z"
            fill="url(#agnixFlame)"
          />

          {/* Inner Flame Core / Crossbeam */}
          <path
            d="M16 11L14.2 16H17.8L16 11Z"
            fill="#050505"
          />
          <path
            d="M16 13C16.8 15 17.5 16.5 17.5 18C17.5 19.5 16.5 21 16 21.5C15.5 21 14.5 19.5 14.5 18C14.5 16.5 15.2 15 16 13Z"
            fill="url(#agnixCore)"
          />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={cn(
              "font-bold tracking-wider text-white font-sans",
              dim.text
            )}
          >
            AGNIX
          </span>
          <span
            className={cn(
              "font-semibold bg-gradient-to-r from-agnix-red to-agnix-orange text-white rounded font-mono border border-agnix-red/30 tracking-tight",
              dim.badge
            )}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
}
