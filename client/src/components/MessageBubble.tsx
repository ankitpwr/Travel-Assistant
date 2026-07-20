import { Plane, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.owner === "USER";

  return (
    <div
      className={cn(
        "flex animate-in slide-in-from-bottom-3 fade-in duration-300 items-end gap-3",
        isUser && "flex-row-reverse",
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border backdrop-blur-md",
          isUser
            ? "border-white/5 bg-zinc-800 text-zinc-300"
            : "border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.1)]",
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Plane className="h-4 w-4" strokeWidth={2.5} />
        )}
      </div>
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-5 py-3.5 font-inter text-[15px] leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-sm bg-indigo-600 text-white shadow-[0_4px_15px_rgba(79,70,229,0.2)]"
            : "rounded-bl-sm border border-white/5 bg-zinc-800/80 text-zinc-200 backdrop-blur-sm",
        )}
      >
        {message.text}
      </div>
    </div>
  );
}
