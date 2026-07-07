'use client';
import { useState } from 'react';
import { Send, BookOpen, ExternalLink } from 'lucide-react';

const QUOTES = [
  "I don't have dreams. I have goals.",
  "I'm not the one you want to cross.",
  "Win the argument before it starts.",
  "I don't get lucky. I make my own luck.",
  "You don't send a puppy to do a partner's job.",
  "The only time success comes before work is in the dictionary.",
];

interface Source { title: string; url: string; }

function getDomainBadge(url: string) {
  if (url.includes('taxinformation.cbic.gov.in')) return { label: 'CBIC Tax Portal', color: '#1a6b8a' };
  if (url.includes('incometaxindia.gov.in') && url.includes('2025')) return { label: 'IT Act 2025 · Income Tax India', color: '#1e8449' };
  if (url.includes('incometaxindia.gov.in')) return { label: 'Income Tax India (IT Act 1961)', color: '#1e6b3a' };
  if (url.includes('mca.gov.in')) return { label: 'MCA · Ministry of Corporate Affairs', color: '#7d3c98' };
  if (url.includes('legislative.gov.in')) return { label: 'Legislative Dept · Govt of India', color: '#935116' };
  return { label: 'Official Source', color: '#666' };
}

function SourcesPanel({ sources }: { sources: Source[] }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="mt-4 pt-4 border-t border-gold/20">
      <div className="flex items-center gap-1.5 mb-3">
        <BookOpen className="w-3 h-3 text-gold/60" />
        <span className="text-xs text-gold/60 uppercase tracking-wider font-medium">RAG Sources Used</span>
      </div>
      <div className="space-y-2.5">
        {sources.map((s, i) => {
          const badge = getDomainBadge(s.url);
          return (
            <div key={i} className="flex items-start gap-2 group">
              <span className="text-gold/30 text-xs mt-1 flex-shrink-0">·</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-foreground/80 leading-relaxed font-medium">{s.title}</p>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity"
                    title={`Verify at ${badge.label}`}
                  >
                    <ExternalLink className="w-3 h-3 text-gold" />
                  </a>
                </div>
                <span
                  className="inline-block mt-1 px-1.5 py-0.5 rounded-sm"
                  style={{ backgroundColor: badge.color + '25', color: badge.color, fontSize: '10px', fontWeight: 500 }}
                >
                  {badge.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HarveyModePage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  async function handleSubmit() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError('');
    setResponse('');
    setSources([]);
    try {
      const res = await fetch('/api/harvey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setResponse(data.response);
      setSources(data.sources || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function renderResponse(text: string) {
    return text.split('\n').map((line, i) => {
      const t = line.trim();
      if (!t) return <div key={i} className="h-3" />;
      if (t.startsWith('**') && t.endsWith('**')) {
        return <p key={i} className="font-serif font-bold text-gold text-lg mt-6 mb-1">{t.replace(/\*\*/g, '')}</p>;
      }
      if (t.startsWith('*') && t.endsWith('*') && !t.startsWith('**')) {
        return <p key={i} className="text-muted-foreground text-xs italic mt-4">{t.replace(/\*/g, '')}</p>;
      }
      return <p key={i} className="text-foreground leading-relaxed text-base">{t}</p>;
    });
  }

  return (
    <div className="min-h-full relative" style={{ backgroundColor: '#0D0008' }}>
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, #B8972A, transparent 60%)' }} />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">

        <div className="text-center mb-12">
          <p className="font-serif italic text-gold text-2xl mb-3">&ldquo;{quote}&rdquo;</p>
          <div className="w-16 h-px bg-gold/50 mx-auto mb-4" />
          <p className="text-foreground/60 text-sm mb-2">Describe your situation. Get the response your opponent won&apos;t expect.</p>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-pulse" />
            <span className="text-xs text-gold/60">RAG retrieves real Indian law before crafting your strategy</span>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-4 mb-8">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Lay out the facts. No sugar-coating. What's the dispute? What went wrong? What are you up against? The more detail you give, the sharper the strategy."
            rows={6}
            className="w-full bg-black/50 border border-gold/40 text-foreground placeholder-foreground/30 px-5 py-4 text-sm font-serif leading-relaxed resize-none focus:outline-none focus:border-gold transition-colors"
            style={{ borderRadius: '2px' }}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || loading}
            className="w-full py-4 flex items-center justify-center gap-3 font-serif font-bold text-base text-black transition-all"
            style={{ backgroundColor: loading || !input.trim() ? 'rgba(184,151,42,0.4)' : '#B8972A', borderRadius: '2px', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer' }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/60 border-t-black rounded-full animate-spin" />
                Retrieving sources &amp; building strategy...
              </>
            ) : (
              <>Get My Response <Send className="w-4 h-4" /></>
            )}
          </button>
        </div>

        {error && (
          <div className="border border-red-800 bg-red-950/50 px-5 py-3 mb-6" style={{ borderRadius: '2px' }}>
            <p className="text-red-400 text-sm">⚠ {error}</p>
          </div>
        )}

        {response && (
          <div className="space-y-4">
            <div className="border-l-2 border-gold pl-6 py-2">
              {renderResponse(response)}
            </div>
            <div className="border border-gold/20 bg-black/30 px-5 py-4" style={{ borderRadius: '2px' }}>
              <SourcesPanel sources={sources} />
              <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-gold/10">Grounded in Indian law via RAG. Execute with precision. Always have a qualified advocate for court proceedings.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
