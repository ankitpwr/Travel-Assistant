import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/lib/types";
import { TypingIndicator } from "./TypingIndicator";
import { MessageBubble } from "./MessageBubble";
import { Plane } from "lucide-react"; // Using Lucide for a cleaner icon

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

function FlightPathHero() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center animate-in fade-in duration-700">
      <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full" />

      <div className="relative flex flex-col gap-3">
        <h1 className="font-bricolage text-3xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-500 sm:text-4xl">
          Where to, next?
        </h1>
        <p className="max-w-md font-inter text-[15px] leading-relaxed text-zinc-400">
          Tell me about a trip you're dreaming up — a destination, an occasion,
          or just a vague idea. I'll help you shape it into reality.
        </p>
      </div>

      <div className="relative flex flex-wrap items-center justify-center gap-3 pt-4">
        {[
          "A week in Bali",
          "Honeymoon, somewhere warm",
          "Weekend in the mountains",
        ].map((s, i) => (
          <button
            key={s}
            className="group rounded-full border border-white/5 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-400 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:bg-zinc-800 hover:text-zinc-100 hover:shadow-[0_0_10px_rgba(99,102,241,0.1)] active:scale-95"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return <FlightPathHero />;
  }

  return (
    <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 [scrollbar-gutter:stable] scroll-smooth">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
