import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ Utility to merge Tailwind + conditionals safely
function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function InfoPill({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        // defaults
        "w-full rounded-full border-[1.5px] px-8 py-3 md:py-4 text-[15px] text-[#222] shadow-sm",
        // user overrides
        className
      )}
    >
      {children}
    </div>
  );
}

// ✅ Reusable Button
export function DfButton({
  children,
  className = "",
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "text-white flex items-center justify-center gap-2 rounded-lg bg-black px-10 py-2 text-xl font-medium drop-shadow-lg",
        className
      )}
    >
      {children}
    </button>
  );
}
