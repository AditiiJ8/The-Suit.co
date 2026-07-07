'use client';

import { ReactNode } from 'react';

interface MessageBubbleProps {
  type: 'user' | 'ai';
  children: ReactNode;
  className?: string;
}

export function MessageBubble({ type, children, className = '' }: MessageBubbleProps) {
  if (type === 'user') {
    return (
      <div className={`flex justify-end mb-4 animate-fade-in ${className}`}>
        <div className="max-w-2xl px-4 py-3 rounded-sm border border-gold bg-transparent text-foreground">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-start mb-6 animate-fade-in ${className}`}>
      <div className="max-w-3xl">
        {children}
      </div>
    </div>
  );
}
