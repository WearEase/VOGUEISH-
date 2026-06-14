const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

if (!GROQ_API_KEY || !MONGODB_URI) {
  console.error("Error: GROQ_API_KEY or MONGODB_URI is not defined in .env.local.");
  process.exit(1);
}

// -------------------------------------------------------------
// MongoDB Schema & Model
// -------------------------------------------------------------
const CENTRAL_CONTEXT_KEY = 'fashion-assistant-core';
const assistantContextSchema = new mongoose.Schema(
  {
    contextKey: { type: String, required: true, unique: true },
    summary: { type: String, required: true, default: "" },
    refinementPrompt: { type: String, default: "" },
    summaryVersion: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const AssistantContext = mongoose.models.AssistantContext || mongoose.model("AssistantContext", assistantContextSchema, "assistantcontexts");

// -------------------------------------------------------------
// Parser
// -------------------------------------------------------------
function safeParseResult(content) {
  const trimmed = content.trim();
  const startIndex = trimmed.indexOf('{');
  const endIndex = trimmed.lastIndexOf('}');

  if (startIndex >= 0 && endIndex > startIndex) {
    try {
      const parsed = JSON.parse(trimmed.slice(startIndex, endIndex + 1));
      return {
        refinementPrompt: parsed.refinementPrompt || '',
        summary: parsed.summary || '',
      };
    } catch {
      // Fall back below
    }
  }

  return {
    refinementPrompt: 'Keep the assistant concise, fashion-first, and friendly.',
    summary: trimmed || 'Fashion assistant prefers concise, style-aware recommendations.',
  };
}

// -------------------------------------------------------------
// Groq Call
// -------------------------------------------------------------
async function callGroq(messages) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 350,
      response_format: { type: 'json_object' },
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Groq request failed.');
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

// -------------------------------------------------------------
// Main execution
// -------------------------------------------------------------
async function run() {
  try {
    console.log("1. Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    // Retrieve current context
    console.log("2. Checking for existing context...");
    const currentContext = await AssistantContext.findOne({ contextKey: CENTRAL_CONTEXT_KEY }).lean();
    console.log("Current Context:", currentContext ? currentContext : "None found (Collection is empty)");

    // Define mock transcript for refinement
    const mockMessages = [
      { sender: 'user', text: "Hi, I need outfit recommendations. I'm Ravi Kumar, a software engineer in Delhi." },
      { sender: 'bot', text: "Nice to meet you Ravi! I can help you build an outfit. What styles do you prefer?" },
      { sender: 'user', text: "I love minimalist design. Black, navy, charcoal colors are my favorites. Slim fit clothing is preferred." },
      { sender: 'bot', text: "Minimalist in dark tones, got it. What's the occasion?" },
      { sender: 'user', text: "Just daily wear at the office, and casual weekend brunch." }
    ];

    const transcript = mockMessages
      .map((m) => `${m.sender.toUpperCase()}: ${m.text}`)
      .join('\n');

    console.log("\n3. Running Stage 1 Refinement Call to Groq...");
    const refinementPromptContent = await callGroq([
      {
        role: 'system',
        content: 'Create a compact fashion-memory refinement. Return JSON only with keys refinementPrompt and summary.',
      },
      {
        role: 'user',
        content: [
          `Current central context: ${currentContext?.summary || 'none'}`,
          'Conversation transcript:',
          transcript,
          'Write a concise refinement prompt plus a short interim summary.',
        ].join('\n\n'),
      },
    ]);

    const firstPass = safeParseResult(refinementPromptContent);
    console.log("Stage 1 Output:", firstPass);

    console.log("\n4. Running Stage 2 Refinement Call to Groq...");
    const finalContextContent = await callGroq([
      {
        role: 'system',
        content: 'Update one central assistant memory using the transcript and the draft. Return JSON only with keys refinementPrompt and summary.',
      },
      {
        role: 'user',
        content: [
          `Refinement prompt: ${firstPass.refinementPrompt}`,
          `Interim summary: ${firstPass.summary}`,
          `Current central context: ${currentContext?.summary || 'none'}`,
          'Conversation transcript:',
          transcript,
          'Return the final refined context summary and a short instruction prompt.',
        ].join('\n\n'),
      },
    ]);

    const finalPass = safeParseResult(finalContextContent);
    console.log("Stage 2 (Final) Output:", finalPass);

    const nextVersion = (currentContext?.summaryVersion || 0) + 1;

    console.log("\n5. Upserting refined context to MongoDB...");
    const updatedDoc = await AssistantContext.findOneAndUpdate(
      { contextKey: CENTRAL_CONTEXT_KEY },
      {
        contextKey: CENTRAL_CONTEXT_KEY,
        summary: finalPass.summary,
        refinementPrompt: finalPass.refinementPrompt || firstPass.refinementPrompt,
        summaryVersion: nextVersion,
      },
      { upsert: true, new: true }
    );

    console.log("Upsert response document:", updatedDoc);

    console.log("\n6. Verifying write by reading from DB again...");
    const verifiedDoc = await AssistantContext.findOne({ contextKey: CENTRAL_CONTEXT_KEY }).lean();
    console.log("Verified Document from DB:", verifiedDoc);
    
    console.log("\nSUCCESS: Centralized context is working! DB has been populated.");

  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
}

run();
