'use client';

import { useState, useEffect } from 'react';
import { APP_VERSION } from '@/lib/constants';

export default function TerminalHeader() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-[var(--terminal-border)] px-4 py-2 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff3131] inline-block opacity-80" />
            <span className="w-3 h-3 rounded-full bg-[#ffb000] inline-block opacity-80" />
            <span className="w-3 h-3 rounded-full bg-[var(--terminal-green)] inline-block opacity-80" />
          </div>
          <div className="terminal-glow text-lg font-bold tracking-widest select-none">
            BYTE<span className="opacity-60">GPT</span>
            <span className="cursor-blink ml-0.5">█</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-[var(--terminal-green-dim)]">
          <span className="hidden sm:block">{APP_VERSION}</span>
          <span className="hidden md:block">{time}</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--terminal-green)] inline-block animate-pulse" />
            ONLINE
          </span>
        </div>
      </div>
      {/* Subtitle bar */}
      <div className="mt-1 text-xs text-[var(--terminal-green-dim)] tracking-wider">
        {'> '} MULTI-MODEL AI TERMINAL // TYPE YOUR MESSAGE AND PRESS ENTER
      </div>
    </header>
  );
}
