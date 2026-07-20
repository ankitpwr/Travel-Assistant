import "dotenv/config";
import express from "express";
import dns from "dns";
import { NewMessageSchema } from "./lib/zodSchema";
import { Conversation } from "./db/conversation";
import { startAgent } from "./agent/agent";
import mongoose from "mongoose";
import cors from "cors";
const app = express();
app.use(express.json());

dns.setServers(["8.8.8.8", "8.8.4.4"]);

app.use(cors({ origin: process.env.CLIENT_URL }));

app.post("/api/v1/chat/new-message", async (req, res) => {
  try {
    const parsedData = NewMessageSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        error: parsedData.error.issues[0]?.message,
      });
    }

    let conversation = await Conversation.findById(
      parsedData.data.conversationId,
    ).lean();

    if (!conversation) {
      conversation = await Conversation.create({
        _id: parsedData.data.conversationId,
      });
    }

    const { messages, score, tripDetails, customerName, phone, email } =
      conversation;
    const userDetails = {};
    const agentResponse = await startAgent(
      parsedData.data.userMessage,
      messages,
      score,
      tripDetails,
      {
        customerName,
        phone,
        email,
      },
    );

    if (agentResponse) {
      const update: Record<string, any> = {};

      // Root fields
      if (agentResponse.customerName != null)
        update.customerName = agentResponse.customerName;

      if (agentResponse.phone != null) update.phone = agentResponse.phone;

      if (agentResponse.email != null) update.email = agentResponse.email;

      // Trip details
      if (agentResponse.destination != null)
        update["tripDetails.destination"] = agentResponse.destination;

      if (agentResponse.departureCity != null)
        update["tripDetails.departureCity"] = agentResponse.departureCity;

      if (agentResponse.travelDate != null)
        update["tripDetails.travelDate"] = agentResponse.travelDate;

      if (agentResponse.duration != null)
        update["tripDetails.duration"] = agentResponse.duration;

      if (agentResponse.travellers != null)
        update["tripDetails.travellers"] = agentResponse.travellers;

      if (agentResponse.budget != null)
        update["tripDetails.budget"] = agentResponse.budget;

      if (agentResponse.tripType != null)
        update["tripDetails.tripType"] = agentResponse.tripType;

      if (agentResponse.specialRequirements != null)
        update["tripDetails.specialRequirements"] =
          agentResponse.specialRequirements;

      // Score
      update["score.leadScore"] = agentResponse.leadScore;
      update["score.confidence"] = agentResponse.confidence;
      update["score.reason"] = agentResponse.reason;
      update["score.summary"] = agentResponse.summary;
      update["score.updatedAt"] = new Date();

      await Conversation.updateOne(
        { _id: conversation._id },
        {
          $set: update,
          $push: {
            messages: {
              $each: [
                {
                  owner: "USER",
                  text: parsedData.data.userMessage,
                  timestamp: new Date(),
                },
                {
                  owner: "AGENT",
                  text: agentResponse?.replay ?? "",
                  timestamp: new Date(),
                },
              ],
            },
          },
        },
      );
    }
    return res.status(200).json({
      message: agentResponse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.listen(3000, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("server stated...");
  } catch (error) {
    console.log("failed to start server ");
    console.log(error);
  }
});
