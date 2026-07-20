import { Schema, model, Document } from "mongoose";

export type Owner = "USER" | "AGENT";
export type Confidence = "LOW" | "MEDIUM" | "HIGH";

export interface Message {
  owner: Owner;
  text: string;
  timestamp: Date;
}

export interface TripDetails {
  destination?: string | null;
  departureCity?: string | null;
  travelDate?: string | null;
  travellers?: String | null;
  budget?: string | null;
  duration?: string | null;
  tripType?: string | null;
  specialRequirements?: string | null;
}

export interface Score {
  leadScore: number;
  confidence: Confidence;
  reason: string;
  summary: string;
  updatedAt: Date;
}

export interface Conversation {
  _id: string;
  startedAt: Date;
  updatedAt: Date;
  customerName: string | null;
  phone: string | null;
  email: string | null;
  tripDetails: TripDetails;
  score: Score;
  messages: Message[];
}

const MessageSchema = new Schema<Message>(
  {
    owner: { type: String, enum: ["USER", "AGENT"], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const TripDetailsSchema = new Schema<TripDetails>(
  {
    destination: { type: String, default: null },
    departureCity: { type: String, default: null },
    travelDate: { type: String, default: null },
    travellers: { type: String, default: null },
    budget: { type: String, default: null },
    duration: { type: String, default: null },
    tripType: { type: String, default: null },
    specialRequirements: { type: String, default: null },
  },
  { _id: false },
);

const ScoreSchema = new Schema<Score>(
  {
    leadScore: { type: Number, default: 0, min: 0, max: 100 },
    confidence: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },
    reason: { type: String, default: "" },
    summary: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ConversationSchema = new Schema<Conversation>(
  {
    _id: { type: String, required: true },
    startedAt: { type: Date, default: Date.now },
    customerName: { type: String, default: null },
    phone: { type: String, default: null },
    email: { type: String, default: null },
    tripDetails: { type: TripDetailsSchema, default: () => ({}) },
    score: { type: ScoreSchema, default: () => ({}) },
    messages: { type: [MessageSchema], default: [] },
  },
  {
    _id: false,
    timestamps: { createdAt: false, updatedAt: true },
  },
);

ConversationSchema.index({ updatedAt: -1 });

export const Conversation = model<Conversation>(
  "Conversation",
  ConversationSchema,
);
