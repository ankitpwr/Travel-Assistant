import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex w-full items-center gap-3"
    >
      <div className="relative flex w-full items-center rounded-full border border-white/10 bg-zinc-900/50 px-2 py-2 shadow-inner transition-colors duration-200 focus-within:border-zinc-700/50 focus-within:bg-zinc-900/80">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Tell me about your dream trip..."
          disabled={disabled}
          className="flex-1 bg-transparent px-4 py-2 font-inter text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-300 enabled:hover:scale-105 enabled:hover:bg-indigo-400 enabled:hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600 disabled:shadow-none"
        >
          <Send className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}
