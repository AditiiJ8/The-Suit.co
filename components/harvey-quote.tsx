'use client';

import { useEffect, useState } from 'react';
import { harveyQuotes } from '@/lib/mockData';

interface HarveyQuoteProps {
  mode?: keyof typeof harveyQuotes;
  className?: string;
}

export function HarveyQuote({ mode = 'general', className = '' }: HarveyQuoteProps) {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const quotes = harveyQuotes[mode] || harveyQuotes.general;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, [mode]);

  if (!quote) return null;

  return (
    <div className={`animate-fade-in ${className}`}>
      <p className="font-serif italic text-lg text-gold leading-relaxed">
        "{quote}"
      </p>
    </div>
  );
}
