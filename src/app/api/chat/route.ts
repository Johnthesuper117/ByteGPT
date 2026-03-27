import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

type MessageInput = { role: string; content: string };

function validateMessages(messages: unknown): MessageInput[] | null {
  if (!Array.isArray(messages) || messages.length === 0) return null;

  const allowedRoles = new Set(['system', 'user', 'assistant']);
  let hasUserMessage = false;

  for (const m of messages) {
    if (
      !m ||
      typeof m !== 'object' ||
      typeof (m as Record<string, unknown>).role !== 'string' ||
      typeof (m as Record<string, unknown>).content !== 'string' ||
      !allowedRoles.has((m as MessageInput).role)
    ) {
      return null;
    }
    if ((m as MessageInput).role === 'user') hasUserMessage = true;
  }

  if (!hasUserMessage) return null;
  return messages as MessageInput[];
}

export async function POST(req: NextRequest) {
  try {
    const { messages: rawMessages, model } = await req.json();

    if (!model || typeof model !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: model' },
        { status: 400 }
      );
    }

    const messages = validateMessages(rawMessages);
    if (!messages) {
      return NextResponse.json(
        {
          error:
            'Invalid messages: expected a non-empty array of { role: system|user|assistant, content: string } objects with at least one user message',
        },
        { status: 400 }
      );
    }

    const systemMessage = {
      role: 'system' as const,
      content:
        'You are ByteGPT, an AI assistant with a terminal/hacker aesthetic. Be helpful, concise, and occasionally use terminal-style formatting when appropriate.',
    };

    // OpenAI models
    if (model.startsWith('gpt-')) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: 'OpenAI API key not configured' },
          { status: 503 }
        );
      }
      const openai = new OpenAI({ apiKey });
      const allowedRoles = new Set(['user', 'assistant']);
      const sanitizedMessages = messages
        .filter((m) => allowedRoles.has(m.role))
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
      const stream = await openai.chat.completions.create({
        model,
        messages: [systemMessage, ...sanitizedMessages],
        stream: true,
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? '';
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        },
      });

      return new Response(readable, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // Anthropic models
    if (model.startsWith('claude-')) {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: 'Anthropic API key not configured' },
          { status: 503 }
        );
      }
      const anthropic = new Anthropic({ apiKey });
      const anthropicMessages = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      const stream = anthropic.messages.stream({
        model,
        max_tokens: 4096,
        system: systemMessage.content,
        messages: anthropicMessages,
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        },
      });

      return new Response(readable, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // Google Gemini models
    if (model.startsWith('gemini-')) {
      const apiKey = process.env.GOOGLE_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: 'Google API key not configured' },
          { status: 503 }
        );
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({
        model,
        systemInstruction: systemMessage.content,
      });

      const geminiHistory = messages
        .slice(0, -1)
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
      if (!lastUserMessage) {
        return NextResponse.json(
          { error: 'No user message found to send' },
          { status: 400 }
        );
      }
      const chat = geminiModel.startChat({ history: geminiHistory });
      const result = await chat.sendMessageStream(lastUserMessage.content);

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        },
      });

      return new Response(readable, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    return NextResponse.json({ error: 'Unknown model' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
