import { cn } from "@/lib/utils";
import type { AgentResponse, Confidence } from "@/lib/types";
import { FieldRow } from "./FieldRow";

interface LeadPanelProps {
  data: AgentResponse | null;
  conversationId: string;
}

const CONFIDENCE_STYLES: Record<Confidence, string> = {
  LOW: "text-rose-400 border-rose-500/20 bg-rose-500/10 shadow-[0_0_10px_rgba(244,63,94,0.1)]",
  MEDIUM:
    "text-amber-400 border-amber-500/20 bg-amber-500/10 shadow-[0_0_10px_rgba(251,191,36,0.1)]",
  HIGH: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
};

export function LeadPanel({ data, conversationId }: LeadPanelProps) {
  const score = data?.leadScore ?? 0;
  const confidence: Confidence = data?.confidence ?? "LOW";

  return (
    <aside className="flex h-full w-full flex-col bg-transparent">
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <span className="font-bricolage text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Lead Profile
        </span>
        <span className="rounded-md bg-zinc-800/50 px-2 py-1 font-inter text-xs font-medium text-zinc-400">
          #{conversationId.slice(0, 6).toUpperCase()}
        </span>
      </div>

      <div className="flex items-center justify-between border-b border-white/5 bg-zinc-900/20 px-6 py-6">
        <div className="flex flex-col gap-1">
          <p className="font-bricolage text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Lead score
          </p>
          <p className="font-bricolage text-4xl font-bold tracking-tight text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            {score}
            <span className="font-inter text-xl font-medium text-zinc-600">
              /100
            </span>
          </p>
        </div>
        <span
          className={cn(
            "rotate-2 select-none rounded-lg border px-3 py-1.5 font-bricolage text-[11px] font-bold uppercase tracking-widest backdrop-blur-sm",
            CONFIDENCE_STYLES[confidence],
          )}
        >
          {confidence}
        </span>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pl-6 pr-4 py-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-800 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700">
        <div className="space-y-1">
          <p className="mb-3 font-bricolage text-sm font-semibold uppercase tracking-widest text-white">
            Traveller
          </p>
          <FieldRow label="Name" value={data?.customerName} />
          <FieldRow label="Phone" value={data?.phone} />
          <FieldRow label="Email" value={data?.email} />
        </div>

        <div className="space-y-1">
          <p className="mb-3 font-bricolage text-sm font-semibold uppercase tracking-widest text-white">
            Trip
          </p>
          <FieldRow label="Destination" value={data?.destination} />
          <FieldRow label="From" value={data?.departureCity} />
          <FieldRow label="Dates" value={data?.travelDate} />
          <FieldRow label="Duration" value={data?.duration} />
          <FieldRow label="Travellers" value={data?.travellers} />
          <FieldRow label="Budget" value={data?.budget} />
          <FieldRow label="Trip type" value={data?.tripType} />
          <FieldRow label="Notes" value={data?.specialRequirements} />
        </div>

        {data?.summary && (
          <div className="mt-4 rounded-xl border border-white/5 bg-zinc-900/50 p-4 shadow-inner">
            <p className="mb-2 font-bricolage text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              Summary
            </p>
            <p className="font-inter text-sm leading-relaxed text-zinc-300">
              {data.summary}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
