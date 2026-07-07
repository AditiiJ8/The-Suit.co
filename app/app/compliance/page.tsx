'use client';
import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

const SAMPLE_DOC = `Income Tax Notice - Section 148
Assessment Year: 2021-22

To,
Mr. Rajesh Kumar
PAN: ABCPK1234D
45, MG Road, Bengaluru - 560001

This is to inform you that income chargeable to tax for the Assessment Year 2021-22 has escaped assessment within the meaning of Section 147 of the Income Tax Act, 1961.

You are therefore required to furnish a return of income for the Assessment Year 2021-22 within 30 days from the date of receipt of this notice. Non-compliance may result in best judgment assessment under Section 144 and penalty proceedings under Section 271(1)(b).

Please note that any undisclosed income or assets should be declared. Failure to respond may result in prosecution under Section 276CC of the Income Tax Act, 1961.

Income Tax Officer
Ward 5(1), Bengaluru`;

const URGENCY_COLORS: Record<string, string> = {
  CRITICAL: '#C0392B',
  HIGH: '#E67E22',
  MEDIUM: '#B8972A',
  LOW: '#27AE60',
};

interface ChecklistItem {
  action: string; section: string; deadline: string;
  responsible: string; urgency: string; consequence: string;
}
interface Checklist {
  title: string; period: string; parties: string; documentSummary: string;
  items: ChecklistItem[]; priorityNote: string; totalItems: number; criticalCount: number;
}

export default function CompliancePage() {
  const [docText, setDocText] = useState('');
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggleCheck(i: number) {
    setChecked(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  }

  async function generate() {
    if (!docText.trim() || loading) return;
    setLoading(true);
    setError('');
    setChecklist(null);
    setChecked(new Set());
    try {
      const res = await fetch('/api/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document: docText }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to generate');
      setChecklist(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate checklist');
    } finally {
      setLoading(false);
    }
  }

  const completion = checklist ? Math.round((checked.size / checklist.items.length) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div>
        <p className="text-gold font-serif italic text-sm mb-1">&ldquo;Rules are what other people break. Know them first.&rdquo;</p>
        <p className="text-muted-foreground text-sm">Paste any legal notice or document. Get an actionable compliance checklist with deadlines.</p>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground uppercase tracking-widest">Paste Document</label>
          <button onClick={() => { setDocText(SAMPLE_DOC); setChecklist(null); setError(''); }}
            className="text-xs text-gold border border-gold/30 px-3 py-1 hover:bg-gold/5 transition-colors"
            style={{ borderRadius: '2px' }}>
            Load Sample IT Notice
          </button>
        </div>
        <textarea
          value={docText}
          onChange={e => setDocText(e.target.value)}
          placeholder="Paste a legal notice, contract, or regulatory document..."
          rows={6}
          className="w-full bg-card border border-gold/40 text-foreground placeholder-muted-foreground px-4 py-3 text-sm font-mono leading-relaxed resize-none focus:outline-none focus:border-gold transition-colors"
          style={{ borderRadius: '2px' }}
        />
        <button
          onClick={generate}
          disabled={!docText.trim() || loading}
          className="w-full py-3 flex items-center justify-center gap-2 font-serif font-bold text-sm text-black transition-all"
          style={{ backgroundColor: !docText.trim() || loading ? 'rgba(184,151,42,0.4)' : '#B8972A', borderRadius: '2px', cursor: !docText.trim() || loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating checklist...</> : 'Generate Compliance Checklist'}
        </button>
      </div>

      {error && <div className="border border-red-800 bg-red-950/40 px-4 py-3" style={{ borderRadius: '2px' }}><p className="text-red-400 text-sm">⚠ {error}</p></div>}

      {/* Checklist */}
      {checklist && (
        <div className="animate-fade-in space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-serif text-xl md:text-2xl font-bold">{checklist.title}</h2>
              <p className="text-muted-foreground text-sm mt-1">{checklist.period} · {checklist.parties}</p>
              <p className="text-foreground/70 text-xs mt-2 max-w-xl">{checklist.documentSummary}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gold text-gold hover:bg-gold/10 transition-colors text-sm flex-shrink-0"
              style={{ borderRadius: '2px' }}>
              <Download className="w-4 h-4" /> Export Brief
            </button>
          </div>

          {/* Progress */}
          <div className="bg-card border border-border p-5" style={{ borderRadius: '2px' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Completion</p>
              <p className="text-foreground font-bold text-lg">{completion}%</p>
            </div>
            <div className="w-full bg-secondary h-1.5" style={{ borderRadius: '2px' }}>
              <div className="h-full bg-gold transition-all" style={{ width: `${completion}%`, borderRadius: '2px' }} />
            </div>
            <div className="flex gap-6 mt-3">
              <p className="text-xs text-muted-foreground">Total: <span className="text-foreground font-bold">{checklist.items.length}</span></p>
              <p className="text-xs text-muted-foreground">Done: <span className="text-green-400 font-bold">{checked.size}</span></p>
              <p className="text-xs text-muted-foreground">Critical: <span className="text-red-400 font-bold">{checklist.criticalCount}</span></p>
            </div>
          </div>

          {/* Priority note */}
          {checklist.priorityNote && (
            <div className="border border-gold/40 bg-gold/5 px-4 py-3" style={{ borderRadius: '2px' }}>
              <p className="text-xs text-gold uppercase tracking-widest mb-1">Priority</p>
              <p className="text-sm text-foreground">{checklist.priorityNote}</p>
            </div>
          )}

          {/* Items */}
          <div className="space-y-2">
            {checklist.items.map((item, i) => {
              const isChecked = checked.has(i);
              const color = URGENCY_COLORS[item.urgency] || '#6B7280';
              return (
                <div key={i}
                  className="bg-card border border-border transition-all"
                  style={{ borderRadius: '2px', opacity: isChecked ? 0.6 : 1, borderLeftColor: color, borderLeftWidth: '3px' }}>
                  <div className="flex items-start gap-4 p-4">
                    <button
                      onClick={() => toggleCheck(i)}
                      className="mt-0.5 w-4 h-4 flex-shrink-0 border-2 transition-all flex items-center justify-center"
                      style={{ borderColor: isChecked ? color : '#3a3a45', backgroundColor: isChecked ? color : 'transparent', borderRadius: '2px' }}
                    >
                      {isChecked && <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className={`text-sm font-medium ${isChecked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{item.action}</p>
                        <span className="text-xs font-bold flex-shrink-0 px-2 py-0.5 uppercase tracking-wider" style={{ color, border: `1px solid ${color}`, borderRadius: '2px' }}>{item.urgency}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1.5">
                        <span className="text-xs text-gold">{item.section}</span>
                        <span className="text-xs text-muted-foreground">Due: {item.deadline}</span>
                        <span className="text-xs text-muted-foreground">By: {item.responsible}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 italic">If not done: {item.consequence}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
