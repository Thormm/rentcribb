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