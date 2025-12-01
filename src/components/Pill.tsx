import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ Utility to merge Tailwind + conditionals safely
function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface InfoPillProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export default function InfoPill({ children, className = "", ...props }: InfoPillProps) {
  return (
    <div
      className={clsx(
        "w-full rounded-full border-[1.5px] px-8 py-3 md:py-4 text-[15px] text-[#222] shadow-sm",
        className
      )}
      {...props} // now accepts onClick, onMouseOver, etc.
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
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean; // <-- Added
}) {
  return (
    <button
      type={type}
      disabled={disabled} // <-- Added
      onClick={disabled ? undefined : onClick} // Prevent clicks while disabled
      className={cn(
        "text-white flex items-center justify-center gap-2 rounded-lg bg-black px-10 py-2 text-xl font-medium drop-shadow-lg transition-all",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className
      )}
    >
      {children}
    </button>
  );
}
