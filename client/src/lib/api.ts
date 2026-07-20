import axios from "axios";
import type { ChatApiResponse } from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

const STORAGE_KEY = "travel-lead-conversation-id";

export function getConversationId(): string {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

export function resetConversationId(): string {
  const id = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, id);
  return id;
}

export async function sendMessage(conversationId: string, userMessage: string) {
  const { data } = await api.post<ChatApiResponse>("/api/v1/chat/new-message", {
    conversationId,
    userMessage,
  });
  return data.message;
}
