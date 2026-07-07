'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface ChecklistItemProps {
  id: string;
  action: string;
  section: string;
  deadline: string;
  responsible: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  initialChecked?: boolean;
  onCheck?: (id: string, checked: boolean) => void;
}

export function ChecklistItem({
  id,
  action,
  section,
  deadline,
  responsible,
  urgency,
  initialChecked = false,
  onCheck,
}: ChecklistItemProps) {
  const [isChecked, setIsChecked] = useState(initialChecked);

  const urgencyStyles = {
    CRITICAL: 'text-danger bg-danger/10',
    HIGH: 'text-warning bg-warning/10',
    MEDIUM: 'text-success bg-success/10',
  };

  const deadlineUrgency = deadline.includes('7 days') || deadline.includes('10 days') ? 'CRITICAL' : urgency;

  const handleCheck = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onCheck?.(id, newChecked);
  };

  return (
    <div className="flex gap-4 p-4 border border-border rounded-sm bg-card hover:bg-card/80 transition-colors">
      {/* Checkbox */}
      <button
        onClick={handleCheck}
        className="flex-shrink-0 mt-1 w-5 h-5 border border-gold rounded-sm flex items-center justify-center hover:bg-gold/10 transition-colors"
      >
        {isChecked && (
          <Check className="w-4 h-4 text-gold animate-checkmark" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h4 className={`font-medium text-foreground ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
            {action}
          </h4>
          <div className="flex gap-2 flex-shrink-0">
            <span className="pill-gold text-xs">{section}</span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wide ${urgencyStyles[deadlineUrgency]}`}>
              {deadlineUrgency}
            </span>
          </div>
        </div>

        <div className="flex gap-4 text-xs text-muted-foreground">
          <div>
            <span className="font-medium">Deadline:</span> {deadline}
          </div>
          <div>
            <span className="font-medium">Responsible:</span> {responsible}
          </div>
        </div>
      </div>
    </div>
  );
}
