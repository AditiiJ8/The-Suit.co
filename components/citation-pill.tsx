'use client';

import { useState } from 'react';

interface CitationPillProps {
  citation: string;
  fullName?: string;
  className?: string;
}

export function CitationPill({ citation, fullName, className = '' }: CitationPillProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        className={`inline-flex items-center px-2 py-1 rounded-sm border border-gold text-gold text-xs font-medium hover:bg-gold/10 transition-colors cursor-help ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {citation}
      </div>
      
      {showTooltip && fullName && (
        <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-secondary border border-border rounded text-foreground text-xs whitespace-nowrap z-10">
          {fullName}
          <div className="absolute top-full left-2 w-2 h-2 bg-secondary border-b border-r border-border transform rotate-45 -mt-1"></div>
        </div>
      )}
    </div>
  );
}
