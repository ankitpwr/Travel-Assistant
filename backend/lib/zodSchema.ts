import { z } from "zod";
import { Conversation } from "../db/conversation";

export const NewMessageSchema = z.object({
  conversationId: z.uuid({ message: "Invalid conversation id" }),
  userMessage: z.string({ message: "No user response" }),
});

export const structuredResonse = z.object({
  replay: z
    .string()
    .nullable()
    .describe(
      "The friendly, natural language response text that will actually be displayed to the user in the chat bubbles.",
    ),
  customerName: z
    .string()
    .nullable()
    .describe("name of the user once explicitly provided."),
  phone: z
    .string()
    .nullable()
    .describe("Valid contact number once explicitly provided."),
  email: z
    .string()
    .nullable()
    .describe("Valid email address of user once explicitly provided. "),
  destination: z
    .string()
    .nullable()
    .describe("The primary target destination for the trip."),
  departureCity: z
    .string()
    .nullable()
    .describe("Where the user is flying or traveling out from."),
  travelDate: z
    .string()
    .nullable()
    .describe("The month, specific dates, or time frame of the trip."),

  duration: z
    .string()
    .nullable()
    .describe("How long user is planning for a trip. e.g 1 week, few days"),

  travellers: z
    .string()
    .nullable()
    .describe("The total count of individuals traveling"),

  budget: z
    .string()
    .nullable()
    .describe(
      "The budget threshold mentioned by the user (e.g., 'Rs 2 Lakh').",
    ),

  tripType: z
    .string()
    .nullable()
    .describe(
      "The nature of the trip (e.g., Honeymoon, Family Vacation, Solo, Business).",
    ),

  specialRequirements: z
    .string()
    .nullable()
    .describe(
      "Specific notes like 'vegetarian food options required', 'wheelchair accessible', '5-star stay'.",
    ),

  leadScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "The dynamically calculated score assessing probability of conversion based on parameter completion, concrete budgets, and willingness to share info.",
    ),

  confidence: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .describe(
      "Assessment of data certainty. High means explicit constraints + contact info are locked in.",
    ),

  reason: z
    .string()
    .describe(
      "A brief, structural explanation of why you calculated this specific score and confidence level.",
    ),

  summary: z
    .string()
    .describe(
      "A clean, short summary of the total profile state so far (e.g., 'A couple looking for a luxury honeymoon package to Bali this winter').",
    ),
});
