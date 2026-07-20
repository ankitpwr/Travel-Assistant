import { cn } from "@/lib/utils";

interface FieldRowProps {
  label: string;
  value: string | number | null | undefined;
}

export function FieldRow({ label, value }: FieldRowProps) {
  const filled = value !== null && value !== undefined && value !== "";

  return (
    <div className="group flex items-baseline justify-between gap-4 rounded-lg border-b border-white/5 px-3 py-3 -mx-3 transition-colors hover:bg-white/[0.02] last:border-0">
      <span className="font-bricolage text-[0.7rem] font-medium uppercase tracking-widest text-zinc-500 shrink-0">
        {label}
      </span>
      <span
        className={cn(
          "truncate text-right font-inter text-sm transition-colors pr-1",
          filled ? "font-medium text-zinc-200" : "italic text-zinc-600",
        )}
        title={filled ? String(value) : "Not specified"}
      >
        {filled ? value : "Not specified"}
      </span>
    </div>
  );
}
