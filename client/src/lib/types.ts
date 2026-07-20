export type Confidence = "LOW" | "MEDIUM" | "HIGH";

// Matches the backend's structured output exactly, including the
// "replay" key as currently returned by /api/v1/chat/new-message.
// Rename to "reply" here (and in the backend schema) if that gets fixed later.
export interface AgentResponse {
  replay: string;
  customerName: string | null;
  phone: string | null;
  email: string | null;
  destination: string | null;
  departureCity: string | null;
  travelDate: string | null;
  duration: string | null;
  travellers: number | null;
  budget: string | null;
  tripType: string | null;
  specialRequirements: string | null;
  leadScore: number;
  confidence: Confidence;
  reason: string;
  summary: string;
}

export interface ChatApiResponse {
  message: AgentResponse;
}

export interface ChatMessage {
  id: string;
  owner: "USER" | "AGENT";
  text: string;
  timestamp: string;
}
