import React from "react";

// ✅ Your existing default component
export default function InfoPill({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={[
        "w-full rounded-full border-[1.5px] px-8 py-4",
        "text-[15px] text-[#222] shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

// ✅ New reusable button component
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
      className={[
        "text-white flex items-center justify-center gap-2",
        "rounded-lg bg-black px-10 py-2 text-xl font-medium drop-shadow-lg",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
