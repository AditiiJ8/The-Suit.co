'use client';
import { useState } from 'react';
import { Search, Loader2, ExternalLink, AlertCircle } from 'lucide-react';

const POPULAR = [
  'ITC mismatch GST penalty',
  'Section 148 income tax reassessment',
  'Contract breach damages India',
  'Director liability Companies Act',
  'GST show cause notice time limit',
];

interface IKResult {
  title: string;
  court: string;
  date: string;
  snippet: string;
  url: string;
  docId: string;
}

export default function CaseLawPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IKResult[]>([]);
  const [searchUrl, setSearchUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [fallback, setFallback] = useState(false);

  async function search(q?: string) {
    const searchQuery = (q || query).trim();
    if (!searchQuery || loading) return;
    setLoading(true);
    setError('');
    setResults([]);
    setSearched(true);
    setFallback(false);
    setSearchUrl('');
    try {
      const res = await fetch('/api/indian-kanoon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      if (data.error && !data.results) throw new Error(data.error);
      setResults(data.results || []);
      setSearchUrl(data.searchUrl || `https://indiankanoon.org/search/?formInput=${encodeURIComponent(searchQuery)}`);
      setFallback(data.fallback || false);
    } catch (err: any) {
      setError(err.message || 'Search failed');
      setSearchUrl(`https://indiankanoon.org/search/?formInput=${encodeURIComponent(searchQuery)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <div>
        <p className="text-gold font-serif italic text-sm mb-1">&ldquo;Knowledge isn&apos;t just power. In court, it&apos;s everything.&rdquo;</p>
        <p className="text-muted-foreground text-sm">Search Indian Supreme Court and High Court judgements via Indian Kanoon — live, real results.</p>
      </div>

      {/* Search */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 flex items-center border border-gold/40 bg-card focus-within:border-gold transition-colors" style={{ borderRadius: '2px' }}>
            <Search className="w-4 h-4 text-muted-foreground ml-4 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') search(); }}
              placeholder="Search Indian case law... e.g. ITC mismatch GST, Section 143 income tax, contract breach damages"
              className="flex-1 bg-transparent text-foreground placeholder-muted-foreground px-3 py-3 text-sm focus:outline-none"
            />
          </div>
          <button
            onClick={() => search()}
            disabled={!query.trim() || loading}
            className="px-6 py-3 font-serif font-bold text-sm text-black transition-all flex items-center gap-2"
            style={{ backgroundColor: !query.trim() || loading ? 'rgba(184,151,42,0.4)' : '#B8972A', borderRadius: '2px', cursor: !query.trim() || loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </div>

        {!searched && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground py-1">Popular:</span>
            {POPULAR.map((p, i) => (
              <button key={i} onClick={() => { setQuery(p); search(p); }}
                className="text-xs px-3 py-1.5 border border-gold/25 text-gold/70 hover:border-gold hover:text-gold transition-colors"
                style={{ borderRadius: '2px' }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="border border-red-800 bg-red-950/40 px-4 py-3 space-y-2" style={{ borderRadius: '2px' }}>
          <p className="text-red-400 text-sm">⚠ {error}</p>
          {searchUrl && (
            <a href={searchUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold/80 transition-colors">
              Open search on Indian Kanoon <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <p className="text-sm">Searching Indian Kanoon...</p>
        </div>
      )}

      {/* Fallback — show IK search link when HTML parse yields nothing */}
      {searched && !loading && fallback && results.length === 0 && !error && (
        <div className="border border-gold/20 bg-card px-5 py-4 space-y-3" style={{ borderRadius: '2px' }}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-gold/60 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium">Results available on Indian Kanoon</p>
              <p className="text-xs text-muted-foreground mt-1">Indian Kanoon returned results but they couldn&apos;t be parsed inline. Open the full search results directly:</p>
            </div>
          </div>
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black transition-all"
            style={{ backgroundColor: '#B8972A', borderRadius: '2px' }}
          >
            View results on Indian Kanoon <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{results.length} judgement{results.length !== 1 ? 's' : ''} found · Live from Indian Kanoon</p>
            {searchUrl && (
              <a href={searchUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-gold/70 hover:text-gold flex items-center gap-1 transition-colors">
                See all results <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          {results.map((c, i) => (
            <div key={i} className="bg-card border border-border hover:border-gold/30 transition-colors p-5" style={{ borderRadius: '2px' }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-foreground text-base leading-tight">{c.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    <span className="text-xs text-muted-foreground">{c.court}</span>
                    {c.date && <><span className="text-xs text-muted-foreground">·</span><span className="text-xs text-muted-foreground">{c.date}</span></>}
                  </div>
                </div>
              </div>
              {c.snippet && (
                <p className="text-sm text-foreground/80 leading-relaxed mb-3">{c.snippet}{c.snippet.length >= 400 ? '…' : ''}</p>
              )}
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold/80 transition-colors"
              >
                Read full judgement on Indian Kanoon <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
          <p className="text-xs text-muted-foreground italic text-center pt-2">Results fetched live from indiankanoon.org · Click any result to read the full judgement.</p>
        </div>
      )}
    </div>
  );
}
