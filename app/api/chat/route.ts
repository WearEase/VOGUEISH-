import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AssistantContext } from '@/models/AssistantContext';
import { Product } from '@/models/Product';

export const dynamic = 'force-dynamic';

type ChatMessage = {
  sender: 'user' | 'bot';
  text: string;
};

type LlmPayload = {
  reply: string;
  suggestions?: string[];
  followUps?: string[];
  searchFilters?: {
    searchQuery?: string;
    gender?: string;
    brand?: string;
    collectionType?: string;
    priceRange?: string;
  };
};

const stylistSystemPrompt =
  'You are Vogueish, a warm fashion-expert friend. Give concise, practical outfit advice for occasion, fit, size, color, style, budget, likes, and dislikes. Ask at most one clarifying question. ' +
  'If the user is looking for, asking about, or describing specific clothing items, styles, or options to buy/see, you must include a "searchFilters" object in the JSON with relevant search terms to help the user find them. ' +
  'The "searchFilters" object can have the following optional fields:\n' +
  '- searchQuery: string (keywords like "red lehenga", "teal blue", etc.)\n' +
  '- gender: "Men" or "Women" (exact match) if specified\n' +
  '- brand: comma-separated brand names if specified (from: Bliss Club, Clazep, Lashkaraa, Lazo Store, Nishorama, Shopapara, Shree, Six Four Six, Syuti Kalaa, Torr, Urbano)\n' +
  '- collectionType: comma-separated collection types if specified (from: All Day Wear, Coord Sets, Ethnic Sets, Ethnic Wear, Korean Trousers, Kurtis & Kurtas, Lehengas & Sarees, Menswear, Most Wanted, Pants, Sale, Sherwanis & Kurtas, Shirts, Summer Collection, T-shirts, Womenswear)\n' +
  '- priceRange: string in "min-max" format (e.g. "1000-5000", "0-20000") if a budget is specified.\n\n' +
  'Output JSON only: {"reply":"...", "suggestions":["..."], "followUps":["..."], "searchFilters":{"searchQuery":"...", "gender":"...", "brand":"...", "collectionType":"...", "priceRange":"..."}}. ' +
  'Omit searchFilters from JSON if the user is just greeting or talking generally. Never write labels like Reply, Suggestions, or Follow-Ups.';

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

    let products: Record<string, unknown>[] = [];
    if (parsed.searchFilters) {
      const { searchQuery, gender, brand, collectionType, priceRange } = parsed.searchFilters;
      const query: Record<string, unknown> = {};

      if (searchQuery && searchQuery.trim()) {
        const terms = searchQuery.trim().split(/\s+/).filter(Boolean);
        if (terms.length > 0) {
          // Attempt to match all terms first
          query.$and = terms.map(term => ({
            $or: [
              { name: { $regex: term, $options: 'i' } },
              { brand: { $regex: term, $options: 'i' } },
              { description: { $regex: term, $options: 'i' } }
            ]
          }));
        }
      }

      if (gender) {
        const genders = gender.split(',').map(g => g.trim()).filter(Boolean);
        if (genders.length > 0) {
          query.gender = { $in: genders.map(g => new RegExp(`^${g}$`, 'i')) };
        }
      }

      if (brand) {
        const brands = brand.split(',').map(b => b.trim()).filter(Boolean);
        if (brands.length > 0) {
          query.brand = { $in: brands.map(b => new RegExp(`^${b}$`, 'i')) };
        }
      }

      if (collectionType) {
        const types = collectionType.split(',').map(t => t.trim()).filter(Boolean);
        if (types.length > 0) {
          query.collectionType = { $in: types.map(t => new RegExp(`^${t}$`, 'i')) };
        }
      }

      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        if (!isNaN(min) && !isNaN(max)) {
          query.discountedPrice = { $gte: min, $lte: max };
        }
      }

      try {
        products = await Product.find(query)
          .sort({ popularityRank: 1 })
          .limit(4)
          .lean();

        // If no products match the combined criteria, fall back to matching any of the search query terms
        if (products.length === 0 && searchQuery && searchQuery.trim()) {
          const terms = searchQuery.trim().split(/\s+/).filter(Boolean);
          if (terms.length > 0) {
            const fallbackQuery = { ...query };
            fallbackQuery.$or = terms.map(term => ({
              $or: [
                { name: { $regex: term, $options: 'i' } },
                { brand: { $regex: term, $options: 'i' } },
                { description: { $regex: term, $options: 'i' } }
              ]
            }));
            delete fallbackQuery.$and;
            products = await Product.find(fallbackQuery)
              .sort({ popularityRank: 1 })
              .limit(4)
              .lean();
          }
        }
      } catch (err) {
        console.error("Error fetching recommended products for chatbot:", err);
      }
    }

    return NextResponse.json({
      reply: normalizeAssistantText(parsed.reply),
      suggestions: parsed.suggestions ?? [],
      followUps: (parsed.followUps ?? []).map(normalizeAssistantText).filter(Boolean),
      products: products
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to generate a fashion response.', detail: message },
      { status: 500 },
    );
  }
}