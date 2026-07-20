import { useCallback, useState } from "react";
import { ClipboardList, TriangleAlert, X } from "lucide-react";
import { Header } from "@/components/Header";
import { ChatWindow } from "@/components/ChatWindow";
import { ChatInput } from "@/components/ChatInput";
import { LeadPanel } from "@/components/LeadPanel";
import { getConversationId, resetConversationId, sendMessage } from "@/lib/api";
import type { AgentResponse, ChatMessage } from "@/lib/types";

export function ChatPage() {
  const [conversationId, setConversationId] = useState(getConversationId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [leadData, setLeadData] = useState<AgentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleSend = useCallback(
    async (text: string) => {
      setError(null);
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        owner: "USER",
        text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const response = await sendMessage(conversationId, text);
        const agentMsg: ChatMessage = {
          id: crypto.randomUUID(),
          owner: "AGENT",
          text: response.replay,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, agentMsg]);
        setLeadData(response);
      } catch {
        setError(
          "Couldn't reach the assistant. Check your connection and try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId],
  );

  function handleNewChat() {
    const id = resetConversationId();
    setConversationId(id);
    setMessages([]);
    setLeadData(null);
    setError(null);
    setPanelOpen(false);
  }

  return (
    <div className="flex h-dvh flex-col bg-zinc-950 font-inter text-zinc-100 selection:bg-indigo-500/30">
      <Header onNewChat={handleNewChat} />

      <div className="flex flex-1 gap-5 overflow-hidden p-4 sm:p-6 lg:max-w-[1600px] lg:mx-auto lg:w-full">
        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-zinc-900/40 ring-1 ring-white/10 shadow-2xl backdrop-blur-sm transition-all">
          <ChatWindow messages={messages} isLoading={isLoading} />

          {error && (
            <div className="flex items-center gap-3 border-t border-white/5 bg-red-500/10 px-5 py-3 animate-in slide-in-from-bottom-2">
              <TriangleAlert className="h-4 w-4 shrink-0 text-red-400" />
              <p className="text-sm font-medium text-red-400/90">{error}</p>
            </div>
          )}

          <div className="p-4 sm:p-6 bg-zinc-900/50 border-t border-white/5 backdrop-blur-md">
            <ChatInput onSend={handleSend} disabled={isLoading} />
          </div>
        </div>

        <div className="hidden w-[380px] shrink-0 flex-col overflow-hidden rounded-3xl bg-zinc-900/40 ring-1 ring-white/10 shadow-2xl backdrop-blur-sm lg:flex">
          <LeadPanel data={leadData} conversationId={conversationId} />
        </div>
      </div>

      <button
        onClick={() => setPanelOpen(true)}
        className="fixed bottom-6 right-5 flex items-center gap-2.5 rounded-full ring-1 ring-white/10 bg-zinc-900/90 px-5 py-3.5 text-sm font-bricolage font-medium text-zinc-200 shadow-2xl backdrop-blur-xl transition-all hover:bg-zinc-800 active:scale-95 lg:hidden"
      >
        <ClipboardList className="h-4 w-4 text-indigo-400" />
        Trip details
        {leadData?.leadScore != null && (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[11px] font-bold text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]">
            {leadData.leadScore}
          </span>
        )}
      </button>

      {panelOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200 lg:hidden"
          onClick={() => setPanelOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full rounded-t-3xl bg-zinc-900 ring-1 ring-white/10 animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <h2 className="font-bricolage text-lg font-semibold text-zinc-100">
                Trip Details
              </h2>
              <button
                onClick={() => setPanelOpen(false)}
                aria-label="Close trip details"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800/50 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto p-6 [scrollbar-gutter:stable]">
              <LeadPanel data={leadData} conversationId={conversationId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
