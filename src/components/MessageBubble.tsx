'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '@/types';

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] ${
          isUser
            ? 'border border-[var(--terminal-green)] bg-[var(--terminal-green-dark)]'
            : 'border border-[var(--terminal-border)]'
        }`}
      >
        {/* Message header */}
        <div
          className={`px-3 py-1 text-xs border-b ${
            isUser
              ? 'border-[var(--terminal-green)] text-[var(--terminal-green)] bg-[rgba(57,255,20,0.08)]'
              : 'border-[var(--terminal-border)] text-[var(--terminal-green-dim)]'
          }`}
        >
          {isUser ? '[ YOU ]' : `[ ${(message.model ?? 'BYTEGPT').toUpperCase()} ]`}
          <span className="ml-2 opacity-60">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
        {/* Message content */}
        <div className="px-3 py-2 text-sm">
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="terminal-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
