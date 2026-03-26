'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TerminalHeader from './TerminalHeader';
import ModelSelector from './ModelSelector';
import MessageBubble from './MessageBubble';
import { Message, Model } from '@/types';
import { DEFAULT_MODEL } from '@/lib/models';
import { APP_VERSION, MAX_TEXTAREA_HEIGHT } from '@/lib/constants';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>(DEFAULT_MODEL);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea based on content
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT) + 'px';
  }, [input]);

  const sendMessage = useCallback(async () => {
    const content = input.trim();
    if (!content || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    const assistantId = uuidv4();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: 'assistant',
        content: '',
        model: selectedModel.name,
        timestamp: new Date(),
      },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? 'Request failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + text } : m
          )
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, selectedModel]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--terminal-bg)]">
      <TerminalHeader />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <pre className="text-[var(--terminal-green)] text-xs sm:text-sm leading-tight terminal-glow select-none">
{`  ██████╗ ██╗   ██╗████████╗███████╗ ██████╗ ██████╗ ████████╗
  ██╔══██╗╚██╗ ██╔╝╚══██╔══╝██╔════╝██╔════╝ ██╔══██╗╚══██╔══╝
  ██████╔╝ ╚████╔╝    ██║   █████╗  ██║  ███╗██████╔╝   ██║   
  ██╔══██╗  ╚██╔╝     ██║   ██╔══╝  ██║   ██║██╔═══╝    ██║   
  ██████╔╝   ██║      ██║   ███████╗╚██████╔╝██║        ██║   
  ╚═════╝    ╚═╝      ╚═╝   ╚══════╝ ╚═════╝ ╚═╝        ╚═╝   `}
            </pre>
            <p className="mt-4 text-[var(--terminal-green-dim)] text-sm tracking-wider">
              MULTI-MODEL AI TERMINAL — {APP_VERSION}
            </p>
            <p className="mt-2 text-xs text-[var(--terminal-green-dim)] opacity-60">
              SELECT A MODEL ABOVE AND START TYPING
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages[messages.length - 1]?.content === '' && (
          <div className="flex justify-start mb-4">
            <div className="border border-[var(--terminal-border)] px-3 py-2 text-sm text-[var(--terminal-green-dim)]">
              <span className="cursor-blink">█</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-4 py-2 bg-[rgba(255,49,49,0.1)] border-t border-[var(--terminal-red)] text-[var(--terminal-red)] text-xs flex justify-between items-center">
          <span>ERROR: {error}</span>
          <button onClick={() => setError(null)} className="hover:opacity-70 ml-4">
            [DISMISS]
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-[var(--terminal-border)] p-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <ModelSelector
            selectedModel={selectedModel}
            onSelect={setSelectedModel}
            disabled={isLoading}
          />
          <button
            onClick={clearChat}
            disabled={isLoading || messages.length === 0}
            className="terminal-btn text-xs px-2 py-1 disabled:opacity-30"
          >
            [CLEAR]
          </button>
        </div>
        <div className="flex gap-2 items-end">
          <span className="text-[var(--terminal-green)] text-sm mb-2 flex-shrink-0">{'>'}</span>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Enter message... (Shift+Enter for new line)"
            rows={1}
            className="flex-1 resize-none text-sm p-2 placeholder:text-[var(--terminal-green-dim)] placeholder:opacity-50 disabled:opacity-50"
            style={{ minHeight: '2.5rem', maxHeight: `${MAX_TEXTAREA_HEIGHT}px` }}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="terminal-btn px-3 py-2 text-sm flex-shrink-0 disabled:opacity-30"
          >
            {isLoading ? '[...]' : '[SEND]'}
          </button>
        </div>
        <p className="mt-1 text-[10px] text-[var(--terminal-green-dim)] opacity-50">
          ENTER to send · SHIFT+ENTER for new line
        </p>
      </div>
    </div>
  );
}
