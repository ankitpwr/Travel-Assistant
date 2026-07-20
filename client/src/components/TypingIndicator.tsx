import { Plane } from "lucide-react"; //[cite: 8]

export function TypingIndicator() {
  return (
    <div className="flex animate-in slide-in-from-bottom-2 fade-in duration-300 items-end gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.1)] backdrop-blur-md">
        <Plane className="h-4 w-4" strokeWidth={2.5} />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-white/5 bg-zinc-800/80 px-5 py-4 backdrop-blur-sm shadow-sm">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
      </div>
    </div>
  );
}
