# Travel Desk

An AI-powered chat assistant that talks naturally with prospective travellers, gathers trip details over the course of a conversation, and continuously scores how likely each conversation is to convert into a real sales lead.

---

## Tech stack

| Layer             | Choice                                                 |
| ----------------- | ------------------------------------------------------ |
| Frontend          | React + TypeScript + Tailwind CSS                      |
| Backend           | Node.js + Express                                      |
| LLM               | Google Gemini (`gemini-3.1-flash-lite`)                |
| Structured output | LangChain's `withStructuredOutput()` over a Zod schema |
| Database          | MongoDB via Mongoose                                   |

---

## Approach

### Conversation strategy

The assistant is instructed (via its system prompt) to behave like a real travel consultant, not a form:

- Trip details (destination, trip type, dates, traveller count, budget, duration, special requirements) are gathered **gradually across multiple turns**, one or two questions at a time — never all at once.
- **Name and phone number are never asked for in the opening exchanges.** The assistant only raises contact details once at least two or three concrete trip details are already known, and frames it as an offer ("connect you with a consultant").
- If a user volunteers contact info unprompted, it's captured immediately and never re-requested.
- If a user declines to share contact info, the assistant accepts it gracefully, doesn't ask again the same way, and keeps helping.

### Lead scoring logic

**Scoring is computed by the LLM itself, on every turn, guided by an explicit point rubric embedded in the system prompt** rather than a separate deterministic backend function.

The rubric given to the model:

| Signal                            | Points                                       |
| --------------------------------- | -------------------------------------------- |
| Destination named                 | +15                                          |
| Trip type specified               | +15                                          |
| Travel date/month given           | +10 (+5 if vague, e.g. "sometime next year") |
| Traveller count given             | +10                                          |
| Budget given                      | +15                                          |
| Duration given                    | +5                                           |
| Both name **and** phone given     | +30                                          |
| Only name **or** only phone given | +10                                          |

**Confidence bands**, tied directly to the score so the two never contradict each other:

- `LOW`: leadScore < 40
- `MEDIUM`: leadScore 40–74
- `HIGH`: leadScore ≥ 75, and at least one strong signal present (budget or full contact info)

**Special case — explicit phone refusal:** leadScore is capped at 74 regardless of how many other details are known.

### LangChain usage

LangChain is used for exactly one thing: `model.withStructuredOutput(schema)`, wrapping a Zod schema that forces the LLM to return `{ reply, customerName, phone, email, destination, ..., leadScore, confidence, reason, summary }` as a single typed object every turn, with automatic validation against the schema.

### MongoDB / Mongoose data model

A single `Conversation` document per conversation, using MongoDB's document model instead of a relational join structure:

- `messages` — embedded array, grows with the conversation
- `tripDetails` — embedded subdocument, overwritten in place each turn (not accumulated as rows)
- `score` — embedded subdocument, recomputed and overwritten every turn
- `customerName` / `phone` / `email` — top-level fields, set once known

## Running it

**Backend**

```bash
bun install
# .env: MONGO_URL, GOOGLE_API_KEY, CLIENT_URL
bun run dev
```

**Frontend**

```bash
bun install
cp .env.example .env   # VITE_API_BASE_URL, defaults to http://localhost:3000
bun  run dev
```

---

## Sample Conversation Transcripts

Below is a live flow demonstrating how the LangChain agent dynamically updates the state on every turn while keeping the conversation natural.

<div style="max-height: 500px; overflow-y: auto; background-color: #0d1117; color: #c9d1d9; padding: 20px; border-radius: 8px; border: 1px solid #30363d;">

<p><strong>User:</strong> Hello</p>
<p><strong>Agent:</strong></p>
<pre><code class="language-json">{
  "message": {
    "reply": "Hello! I'm here to help you plan your next getaway. Whether you're dreaming of a relaxing beach escape or an adventurous city break, I'd love to hear what you have in mind. Where are you thinking of heading for your next trip?",
    "customerName": null,
    "phone": null,
    "email": null,
    "destination": null,
    "departureCity": null,
    "travelDate": null,
    "duration": null,
    "travellers": null,
    "budget": null,
    "tripType": null,
    "specialRequirements": null,
    "leadScore": 0,
    "confidence": "LOW",
    "reason": "Initial greeting, no travel details provided yet.",
    "summary": "User has initiated contact; no trip details gathered."
  }
}
</code></pre>
<hr style="border-color: #30363d; margin: 20px 0;">

<p><strong> User:</strong> looking forward for an adventurous trip</p>
<p><strong> Agent:</strong></p>
<pre><code class="language-json">{
  "message": {
    "reply": "That sounds exciting! Adventure trips are always a thrill. Do you have a specific destination in mind, or are you looking for some inspiration?",
    "customerName": null,
    "phone": null,
    "email": null,
    "destination": null,
    "departureCity": null,
    "travelDate": null,
    "duration": null,
    "travellers": null,
    "budget": null,
    "tripType": "adventurous",
    "specialRequirements": null,
    "leadScore": 15,
    "confidence": "LOW",
    "reason": "User specified trip type as adventurous, adding 15 points.",
    "summary": "User is interested in an adventurous trip; destination and other details are pending."
  }
}
</code></pre>
<hr style="border-color: #30363d; margin: 20px 0;">

<p><strong> User:</strong> probably somewhere in europe</p>
<p><strong> Agent:</strong></p>
<pre><code class="language-json">{
  "message": {
    "reply": "Europe is a fantastic choice for adventure! From the rugged peaks of the Alps to the hidden trails in the Balkans, there's so much to explore. Do you have a particular time of year in mind for this trip?",
    "customerName": null,
    "phone": null,
    "email": null,
    "destination": "Europe",
    "departureCity": null,
    "travelDate": null,
    "duration": null,
    "travellers": null,
    "budget": null,
    "tripType": "adventurous",
    "specialRequirements": null,
    "leadScore": 30,
    "confidence": "LOW",
    "reason": "User specified destination (Europe), adding 15 points to the existing 15 for trip type.",
    "summary": "User is planning an adventurous trip to Europe; dates and other logistics are pending."
  }
}
</code></pre>
<hr style="border-color: #30363d; margin: 20px 0;">

<p><strong> User:</strong> somewhere in winters</p>
<p><strong> Agent:</strong></p>
<pre><code class="language-json">{
  "message": {
    "reply": "Winters in Europe can be magical, especially if you're into skiing or cozy mountain retreats! Are you planning to travel solo, or will you be joined by friends or family for this adventure?",
    "customerName": null,
    "phone": null,
    "email": null,
    "destination": "Europe",
    "departureCity": null,
    "travelDate": "winter",
    "duration": null,
    "travellers": null,
    "budget": null,
    "tripType": "adventurous",
    "specialRequirements": null,
    "leadScore": 40,
    "confidence": "MEDIUM",
    "reason": "Added 10 points for specifying the travel season (winter), bringing the total score to 40.",
    "summary": "User is planning an adventurous winter trip to Europe; traveller count and other logistics are pending."
  }
}
</code></pre>
<hr style="border-color: #30363d; margin: 20px 0;">

<p><strong> User:</strong> 2 peoples</p>
<p><strong> Agent:</strong></p>
<pre><code class="language-json">{
  "message": {
    "reply": "Got it, a trip for two! That sounds like a great way to experience a winter adventure. To help me narrow down the best spots for you, do you have a rough idea of how long you'd like to be away?",
    "customerName": null,
    "phone": null,
    "email": null,
    "destination": "Europe",
    "departureCity": null,
    "travelDate": "winter",
    "duration": null,
    "travellers": 2,
    "budget": null,
    "tripType": "adventurous",
    "specialRequirements": null,
    "leadScore": 50,
    "confidence": "MEDIUM",
    "reason": "Added 10 points for traveller count, bringing the total score to 50.",
    "summary": "A party of two planning an adventurous winter trip to Europe; duration and budget are still pending."
  }
}
</code></pre>
<hr style="border-color: #30363d; margin: 20px 0;">

<p><strong> User:</strong> not sure on that</p>
<p><strong>Agent:</strong></p>
<pre><code class="language-json">{
  "message": {
    "reply": "No problem at all, there's no rush to decide! Sometimes it's easier to start with a budget in mind-do you have a rough idea of what you'd like to spend on this trip, or should we just focus on finding the perfect destination first?",
    "customerName": null,
    "phone": null,
    "email": null,
    "destination": "Europe",
    "departureCity": null,
    "travelDate": "winter",
    "duration": null,
    "travellers": 2,
    "budget": null,
    "tripType": "adventurous",
    "specialRequirements": null,
    "leadScore": 50,
    "confidence": "MEDIUM",
    "reason": "The user is still in the early discovery phase. Score remains at 50 as no new concrete parameters were added.",
    "summary": "A party of two planning an adventurous winter trip to Europe; duration and budget are still pending."
  }
}
</code></pre>
<hr style="border-color: #30363d; margin: 20px 0;">

<p><strong> User:</strong> around 5 lakh</p>
<p><strong> Agent:</strong></p>
<pre><code class="language-json">{
  "message": {
    "reply": "That's a great budget to work with for a winter adventure in Europe! With that in mind, I can definitely help you narrow down some fantastic options. Since we have a good sense of the trip now, would you like me to connect you with one of our travel consultants who can put together a custom itinerary for you? If so, just let me know your name and the best number to reach you at.",
    "customerName": null,
    "phone": null,
    "email": null,
    "destination": "Europe",
    "departureCity": null,
    "travelDate": "winter",
    "duration": null,
    "travellers": 2,
    "budget": "5 lakh",
    "tripType": "adventurous",
    "specialRequirements": null,
    "leadScore": 65,
    "confidence": "MEDIUM",
    "reason": "The user provided a budget, increasing the lead score. We are now at a point where offering a consultant is appropriate.",
    "summary": "A party of two planning an adventurous winter trip to Europe with a budget of 5 lakh."
  }
}
</code></pre>
</div>
