import { Plane, RotateCcw } from "lucide-react";

interface HeaderProps {
  onNewChat: () => void;
}

export function Header({ onNewChat }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-white/5 bg-zinc-950/80 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Plane className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <span className="font-bricolage text-xl font-semibold tracking-tight text-zinc-100">
          TravelDesk
        </span>
      </div>

      <button
        onClick={onNewChat}
        className="group flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/50 px-4 py-2 font-inter text-sm font-medium text-zinc-300 transition-all duration-300  hover:bg-zinc-800 hover:text-white active:scale-95"
      >
        <RotateCcw className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" />
        New chat
      </button>
    </header>
  );
}
