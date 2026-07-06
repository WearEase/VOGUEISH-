import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AssistantContext } from '@/models/AssistantContext';

export const dynamic = 'force-dynamic';

type ChatMessage = {
  sender: 'user' | 'bot';
  text: string;
};

const CENTRAL_CONTEXT_KEY = 'fashion-assistant-core';

type RefinementResult = {
  refinementPrompt: string;
  summary: string;
};

function safeParseResult(content: string): RefinementResult {
  const trimmed = content.trim();
  const startIndex = trimmed.indexOf('{');
  const endIndex = trimmed.lastIndexOf('}');

  if (startIndex >= 0 && endIndex > startIndex) {
    try {
      const parsed = JSON.parse(trimmed.slice(startIndex, endIndex + 1)) as Partial<RefinementResult>;
      return {
        refinementPrompt: parsed.refinementPrompt || '',
        summary: parsed.summary || '',
      };
    } catch {
      // Fall back to plain text below.
    }
  }

  return {
    refinementPrompt: 'Keep the assistant concise, fashion-first, and friendly.',
    summary: trimmed || 'Fashion assistant prefers concise, style-aware recommendations.',
  };
}

async function callGroq(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('Missing GROQ_API_KEY.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
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

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content ?? '';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (messages.length === 0) {
      return NextResponse.json({ error: 'No chat messages were provided.' }, { status: 400 });
    }

    await connectDB();

    const transcript = messages
      .map((message) => `${message.sender.toUpperCase()}: ${message.text}`)
      .join('\n');

    const currentContext = (await AssistantContext.findOne({ contextKey: CENTRAL_CONTEXT_KEY }).lean()) as
      | { summary?: string; summaryVersion?: number }
      | null;

    const refinementPromptContent = await callGroq([
      {
        role: 'system',
        content:
          'Create a compact fashion-memory refinement. Return JSON only with keys refinementPrompt and summary.',
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

    const finalContextContent = await callGroq([
      {
        role: 'system',
        content:
          'Update one central assistant memory using the transcript and the draft. Return JSON only with keys refinementPrompt and summary.',
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
    const nextVersion = (currentContext?.summaryVersion || 0) + 1;

    await AssistantContext.findOneAndUpdate(
      { contextKey: CENTRAL_CONTEXT_KEY },
      {
        contextKey: CENTRAL_CONTEXT_KEY,
        summary: finalPass.summary,
        refinementPrompt: finalPass.refinementPrompt || firstPass.refinementPrompt,
        summaryVersion: nextVersion,
      },
      { upsert: true, new: true },
    );

    return NextResponse.json({
      ok: true,
      summary: finalPass.summary,
      refinementPrompt: finalPass.refinementPrompt || firstPass.refinementPrompt,
      version: nextVersion,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to refine central context.', detail: message },
      { status: 500 },
    );
  }
}