import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { SystemPrompt } from "./prompt";
import type { Message, Score, TripDetails } from "../db/conversation";
import { HumanMessage } from "langchain";
import { z } from "zod";
import { structuredResonse } from "../lib/zodSchema";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// const model = new ChatGroq({
//   model: "llama-3.3-70b-versatile",
//   temperature: 0,
//   apiKey: process.env.GROQ_API,
// });

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite",
  maxRetries: 2,
  temperature: 0.2,
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function startAgent(
  newUserMessage: string,
  messages: Message[],
  score: Score,
  tripDetails: TripDetails,
  userDetails: {
    customerName: string | null;
    phone: string | null;
    email: string | null;
  },
) {
  try {
    console.log(`The parameters are \m
         message history till now : ${JSON.stringify(messages)}\n
         user details gathered till now : ${JSON.stringify(userDetails)}
         socre calculated till now : ${JSON.stringify(score)} \n
         trip details collected till now : ${JSON.stringify(tripDetails)}\n
         new User message : ${JSON.stringify(newUserMessage)}
         
         `);
    const m = [
      SystemPrompt,
      new HumanMessage(`message history till now : ${JSON.stringify(messages)}\n
         user details gathered till now : ${JSON.stringify(userDetails)}
         socre calculated till now : ${JSON.stringify(score)} \n
         trip details collected till now : ${JSON.stringify(tripDetails)}\n
         new User message : ${JSON.stringify(newUserMessage)}
         
         `),
    ];

    const modelWithStructuredOutput =
      model.withStructuredOutput(structuredResonse);

    const response = await modelWithStructuredOutput.invoke(m);

    return response;
  } catch (error) {
    console.error("Agent call failed:", error);
    throw error; // let index.ts handle the 500
  }
}
