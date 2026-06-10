import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AssistantContext } from '@/models/AssistantContext';

export const dynamic = 'force-dynamic';

type ChatMessage = {
  sender: 'user' | 'bot';
  text: string;
};

type LlmPayload = {
  reply: string;
  suggestions?: string[];
  followUps?: string[];
};

const stylistSystemPrompt =
  'You are Vogueish, a warm fashion-expert friend. Give concise, practical outfit advice for occasion, fit, size, color, style, budget, likes, and dislikes. Ask at most one clarifying question. Output JSON only: {"reply":"...","suggestions":["..."],"followUps":["..."]}. Never write labels like Reply, Suggestions, or Follow-Ups.';

const CENTRAL_CONTEXT_KEY = 'fashion-assistant-core';

function safeParsePayload(content: string): LlmPayload {
  const trimmed = content.trim();

  const startIndex = trimmed.indexOf('{');
  const endIndex = trimmed.lastIndexOf('}');

  if (startIndex >= 0 && endIndex > startIndex) {
    try {
      return JSON.parse(trimmed.slice(startIndex, endIndex + 1)) as LlmPayload;
    } catch {
      // Fall through to plain-text wrapper.
    }
  }

  return { reply: trimmed || 'I can help you style that outfit.' };
}

function normalizeAssistantText(text: string) {
  return text
    .replace(/^Reply:\s*/i, '')
    .replace(/^Suggestions:\s*/i, '')
    .replace(/^Follow-?Ups?:\s*/i, '')
    .trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Missing GROQ_API_KEY. Add it to .env.local to enable the hosted chatbot.',
        },
        { status: 500 },
      );
    }

    await connectDB();
    const centralContext = (await AssistantContext.findOne({ contextKey: CENTRAL_CONTEXT_KEY }).lean()) as
      | { summary?: string }
      | null;

    const recentMessages = messages.slice(-8).map((message) => ({
      role: message.sender === 'user' ? 'user' : 'assistant',
      content: message.text,
    }));

    const centralContextMessage = centralContext?.summary
      ? {
          role: 'system' as const,
          content: `Central refined context for this assistant: ${centralContext.summary}`,
        }
      : null;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 400,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: stylistSystemPrompt,
          },
          ...(centralContextMessage ? [centralContextMessage] : []),
          ...recentMessages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Hosted model request failed.', detail: errorText },
        { status: response.status },
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content ?? '';
    const parsed = safeParsePayload(content);

    return NextResponse.json({
      reply: normalizeAssistantText(parsed.reply),
      suggestions: parsed.suggestions ?? [],
      followUps: (parsed.followUps ?? []).map(normalizeAssistantText).filter(Boolean),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to generate a fashion response.', detail: message },
      { status: 500 },
    );
  }
}