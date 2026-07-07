'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, BookOpen, ExternalLink } from 'lucide-react';

const SUGGESTIONS = [
  'What are penalties for ITC mismatch under GST?',
  'How does Section 143(2) scrutiny notice work?',
  'What changed in the Income Tax Act 2025?',
  'What is the time limit for a GST Section 73 demand order?',
  'What are blocked credits under Section 17(5)?',
  'How does the new IMS system affect ITC claims?',
];

interface Source { title: string; url: string; }
interface Message {
  role: 'user' | 'ai';
  text: string;
  sources?: Source[];
}

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
    <div className="mt-4 pt-4 border-t border-border/50">
      <div className="flex items-center gap-1.5 mb-3">
        <BookOpen className="w-3 h-3 text-gold/70" />
        <span className="text-xs text-gold/70 font-medium uppercase tracking-wider">RAG Sources Retrieved</span>
      </div>
      <div className="space-y-2.5">
        {sources.map((s, i) => {
          const badge = getDomainBadge(s.url);
          return (
            <div key={i} className="flex items-start gap-2 group">
              <span className="text-gold/40 text-xs mt-1 flex-shrink-0">·</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-foreground/85 leading-relaxed font-medium">{s.title}</p>
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
                  className="inline-block mt-1 px-1.5 py-0.5 text-xs rounded-sm"
                  style={{ backgroundColor: badge.color + '25', color: badge.color, fontSize: '10px', fontWeight: 500 }}
                >
                  {badge.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground/40 mt-3 italic">
        Statutory chunks retrieved via BM25 · Click ↗ to verify at official source.
      </p>
    </div>
  );
}

function AIMessage({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const t = line.trim();
        if (!t) return <div key={i} className="h-2" />;
        if (t.startsWith('**') && t.endsWith('**')) {
          return <p key={i} className="font-serif font-bold text-gold mt-5 mb-1 text-base">{t.replace(/\*\*/g, '')}</p>;
        }
        if (t.startsWith('• ') || t.startsWith('- ')) {
          return <p key={i} className="text-sm text-foreground/80 leading-relaxed pl-3">· {t.slice(2)}</p>;
        }
        if (t.startsWith('⚠️')) {
          return <p key={i} className="text-sm text-yellow-500 leading-relaxed mt-2">{t}</p>;
        }
        if (t.startsWith('*') && t.endsWith('*')) {
          return <p key={i} className="text-xs text-muted-foreground italic mt-3">{t.replace(/\*/g, '')}</p>;
        }
        const withCitations = t.replace(/(§\s*[\w().\s]+·[^,\n]+)/g, (match) =>
          `<span style="display:inline-block;padding:1px 6px;border:1px solid rgba(184,151,42,0.5);color:#B8972A;font-size:11px;border-radius:2px;margin:0 2px">${match}</span>`
        );
        return <p key={i} className="text-sm text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: withCitations }} />;
      })}
    </div>
  );
}

export default function ResearchPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  async function sendMessage(q?: string) {
    const question = (q || input).trim();
    if (!question || loading) return;
    setInput('');
    setError('');
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setLoading(true);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setMessages(prev => [...prev, { role: 'ai', text: data.response, sources: data.sources }]);
    } catch (err: any) {
      setError(err.message || 'Failed to get response');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center pb-16">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-xs text-gold/70 uppercase tracking-widest font-medium">RAG-Powered Research</span>
            </div>
            <p className="font-serif text-3xl text-foreground mb-2">What do you need to know?</p>
            <p className="text-muted-foreground text-sm mb-8 max-w-md">
              Ask any question about Indian law, tax, GST, contracts, or compliance.
              Real statutory text is retrieved before the AI answers.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-2 border border-gold/30 text-gold/80 hover:border-gold hover:text-gold transition-colors"
                  style={{ borderRadius: '2px' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'user' ? (
              <div className="max-w-lg bg-gold/10 border border-gold/20 px-5 py-3" style={{ borderRadius: '2px' }}>
                <p className="text-foreground text-sm font-serif">{msg.text}</p>
              </div>
            ) : (
              <div className="max-w-2xl bg-card border border-border border-l-2 border-l-gold px-6 py-5" style={{ borderRadius: '2px' }}>
                <AIMessage text={msg.text} />
                <SourcesPanel sources={msg.sources || []} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border border-l-2 border-l-gold px-6 py-4" style={{ borderRadius: '2px' }}>
              <div className="flex gap-1.5 items-center">
                <div className="flex gap-1 items-center h-4">
                  {[0, 150, 300].map(delay => (
                    <div key={delay} className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-2">Retrieving statutory sources...</span>
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-border bg-background px-4 md:px-8 py-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask a legal or tax question..."
            className="flex-1 bg-card border border-border text-foreground placeholder-muted-foreground px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
            style={{ borderRadius: '2px' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="px-5 py-3 text-black font-medium transition-all flex items-center gap-2 text-sm"
            style={{ backgroundColor: !input.trim() || loading ? 'rgba(184,151,42,0.4)' : '#B8972A', borderRadius: '2px', cursor: !input.trim() || loading ? 'not-allowed' : 'pointer' }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground/50 mt-2">
          Real statutory text retrieved before each answer · Verify citations at official sources
        </p>
      </div>
    </div>
  );
}
