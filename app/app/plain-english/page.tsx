'use client';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const SAMPLES = [
  {
    label: 'Indemnity Clause',
    text: 'The party of the first part hereby indemnifies and holds harmless the party of the second part from and against all claims, demands, liabilities, losses, costs and expenses of every nature whatsoever arising out of or in connection with this Agreement.',
  },
  {
    label: 'Liability Cap',
    text: 'Notwithstanding any provision to the contrary contained herein, the aggregate liability of either party to the other party under or arising out of this Agreement shall not exceed the total fees paid by Client to Service Provider in the three (3) months immediately preceding the event giving rise to such liability.',
  },
  {
    label: 'Software License',
    text: "The Licensor hereby grants to the Licensee a non-exclusive, non-transferable, revocable license to use the Software solely for the Licensee's internal business purposes, subject to the terms and conditions set forth herein, and for no other purpose whatsoever.",
  },
];

function OutputText({ text }: { text: string }) {
  return (
    <div className="space-y-1">
      {text.split('\n').map((line, i) => {
        const t = line.trim();
        if (!t) return <div key={i} className="h-2" />;
        if (t.startsWith('**') && t.endsWith('**')) {
          return <p key={i} className="font-serif font-bold text-gold mt-4 mb-1 text-sm">{t.replace(/\*\*/g, '')}</p>;
        }
        if (t.startsWith('• ') || t.startsWith('- ')) {
          return <p key={i} className="text-xs text-foreground/80 leading-relaxed pl-3">· {t.slice(2)}</p>;
        }
        if (t.startsWith('*') && t.endsWith('*')) {
          return <p key={i} className="text-xs text-muted-foreground italic mt-3">{t.replace(/\*/g, '')}</p>;
        }
        return <p key={i} className="text-sm text-foreground leading-relaxed">{t}</p>;
      })}
    </div>
  );
}

export default function PlainEnglishPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSimplify() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const res = await fetch('/api/plain-english', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setOutput(data.response);
    } catch (err: any) {
      setError(err.message || 'Failed to simplify');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <div>
        <p className="text-gold font-serif italic text-sm mb-1">&ldquo;Say what you mean. Mean what you say.&rdquo;</p>
        <p className="text-muted-foreground text-sm">Paste any legal clause, notice, or contract section. Get an instant plain-language explanation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <label className="text-xs text-muted-foreground uppercase tracking-widest">Paste Legal Text</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste any legal clause, section, notice, or regulation here..."
            rows={10}
            className="w-full bg-card border border-gold/40 text-foreground placeholder-muted-foreground px-4 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:border-gold transition-colors"
            style={{ borderRadius: '2px' }}
          />
          <button
            onClick={handleSimplify}
            disabled={!input.trim() || loading}
            className="w-full py-3 flex items-center justify-center gap-2 font-serif font-bold text-sm text-black transition-all"
            style={{ backgroundColor: !input.trim() || loading ? 'rgba(184,151,42,0.4)' : '#B8972A', borderRadius: '2px', cursor: !input.trim() || loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-black/50 border-t-black rounded-full animate-spin" /> Simplifying...</>
            ) : (
              <>Simplify <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <label className="text-xs text-muted-foreground uppercase tracking-widest">Plain English</label>
          <div className="bg-card border border-border px-4 py-3 overflow-y-auto" style={{ borderRadius: '2px', minHeight: '264px' }}>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {!output && !error && <p className="text-muted-foreground text-sm italic">Your plain-language explanation will appear here...</p>}
            {output && <div className="animate-fade-in"><OutputText text={output} /></div>}
          </div>
        </div>
      </div>

      {/* Samples */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Try a sample</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {SAMPLES.map((s, i) => (
            <button key={i} onClick={() => { setInput(s.text); setOutput(''); setError(''); }}
              className="text-left p-4 bg-card border border-border hover:border-gold/50 transition-colors"
              style={{ borderRadius: '2px' }}>
              <p className="text-xs text-gold font-medium mb-1">{s.label}</p>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{s.text}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
