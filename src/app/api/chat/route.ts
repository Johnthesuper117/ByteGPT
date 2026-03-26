import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    if (!messages || !model) {
      return NextResponse.json(
        { error: 'Missing required fields: messages and model' },
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
      const stream = await openai.chat.completions.create({
        model,
        messages: [systemMessage, ...messages],
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
        .filter((m: { role: string; content: string }) => m.role === 'user' || m.role === 'assistant')
        .map((m: { role: string; content: string }) => ({
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
        .filter((m: { role: string; content: string }) => m.role === 'user' || m.role === 'assistant')
        .map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const lastMessage = messages[messages.length - 1];
      const chat = geminiModel.startChat({ history: geminiHistory });
      const result = await chat.sendMessageStream(lastMessage.content);

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
