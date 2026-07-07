'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const TICKER_ITEMS = [
  'CGST Act 2017 (incl. Finance Act 2025 amendments)',
  'Income Tax Act 2025 — in force from April 2026',
  'Income Tax Act 1961 — AY 2026-27 and earlier',
  'Companies Act 2013',
  'Indian Contract Act 1872',
  'Arbitration & Conciliation Act 1996',
  'Transfer Pricing — Sections 92–92F',
  'GSTAT — operational 2025',
  'IMS — Invoice Management System',
  'New Tax Regime — Tax Year 2026-27',
  'GST Blocked Credits — Finance Act 2025',
  'BM25-powered RAG Retrieval',
];

const FEATURES = [
  {
    mode: 'Research',
    href: '/app/research',
    desc: 'Ask any legal or tax question. RAG retrieves verified statutory sources, then generates structured answers with exact section citations.',
    example: 'What are penalties for ITC mismatch under GST?',
  },
  {
    mode: 'Document Analysis',
    href: '/app/document-analysis',
    desc: 'Paste any notice or contract. RAG matches the document to real statutory provisions and produces a risk-scored clause-by-clause breakdown.',
    example: 'Upload a GST SCN → Risk Score: 78/HIGH · § 73 CGST Act',
  },
  {
    mode: 'Plain English',
    href: '/app/plain-english',
    desc: 'Paste any legal clause. RAG identifies the relevant Act and section, then translates it into clear, accurate plain language.',
    example: '"Section 16(2)(aa)..." → explained in 3 sentences',
  },
  {
    mode: 'Harvey Mode',
    href: '/app/harvey-mode',
    desc: 'Describe your legal situation. RAG finds your leverage in real statutes and delivers a confident, strategy-first response.',
    example: 'Your leverage. Their weakness. The exact section.',
  },
];

const HOW_RAG_WORKS = [
  { step: '01', label: 'You ask a question or paste a document' },
  { step: '02', label: 'BM25 searches 35+ statutory chunks from real Indian Acts' },
  { step: '03', label: 'Top matching sections are retrieved as verified sources' },
  { step: '04', label: 'Sources are injected into the AI prompt before your query' },
  { step: '05', label: 'AI answers are grounded in real law — not model memory' },
  { step: '06', label: 'Every response shows which sources were used' },
];

export default function LandingPage() {
  const router = useRouter();
  const [showHow, setShowHow] = useState(false);
  const [showRag, setShowRag] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute bottom-0 right-0 pointer-events-none select-none" style={{ opacity: 0.03 }}>
        <p className="font-serif font-bold text-gold" style={{ fontSize: '20rem', lineHeight: 1 }}>L</p>
      </div>

      {/* Hero */}
      <div className="flex-1 flex items-center px-8 md:px-16 relative z-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-gold opacity-60" />
            <span className="text-xs text-gold uppercase tracking-widest font-medium">RAG-Powered Legal Intelligence for India</span>
          </div>

          <h1 className="font-serif font-bold leading-tight mb-6" style={{ fontSize: '3.8rem' }}>
            The Law Doesn&apos;t Wait.<br />
            <span style={{ color: '#B8972A' }}>Neither Should You.</span>
          </h1>

          <p className="text-muted-foreground leading-relaxed mb-4" style={{ fontSize: '1.1rem', maxWidth: '520px' }}>
            AI legal and tax research for India, grounded in real statutory text.
            Every answer is retrieved from actual Acts — CGST Act 2017, Income Tax Act 2025,
            Companies Act 2013, and more — before the AI generates a response.
          </p>

          {/* RAG badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 border border-gold/30" style={{ borderRadius: '2px' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-xs text-gold/80 font-medium tracking-wide">Retrieval-Augmented Generation — answers grounded in real law</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => router.push('/app/research')}
              className="font-serif font-bold text-black px-8 py-3.5 transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#B8972A', borderRadius: '2px', fontSize: '1rem' }}
            >
              Open the Brief
            </button>
            <button
              onClick={() => { setShowHow(!showHow); setShowRag(false); }}
              className="font-medium transition-colors"
              style={{ color: '#B8972A', fontSize: '0.95rem' }}
            >
              {showHow ? 'Close ↑' : 'See Features →'}
            </button>
            <button
              onClick={() => { setShowRag(!showRag); setShowHow(false); }}
              className="font-medium transition-colors text-muted-foreground hover:text-gold"
              style={{ fontSize: '0.95rem' }}
            >
              {showRag ? 'Close ↑' : 'How RAG Works →'}
            </button>
          </div>

          {/* Features panel */}
          {showHow && (
            <div className="mt-10 grid grid-cols-2 gap-4">
              {FEATURES.map((f, i) => (
                <button
                  key={i}
                  onClick={() => router.push(f.href)}
                  className="text-left p-4 border border-border hover:border-gold/50 transition-all bg-card"
                  style={{ borderRadius: '2px' }}
                >
                  <p className="text-gold font-serif font-bold text-sm mb-1">{f.mode}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-2">{f.desc}</p>
                  <p className="text-foreground/50 text-xs italic">{f.example}</p>
                </button>
              ))}
            </div>
          )}

          {/* RAG explanation panel */}
          {showRag && (
            <div className="mt-10 border border-gold/20 bg-card p-6" style={{ borderRadius: '2px' }}>
              <p className="text-gold font-serif font-bold text-base mb-1">How RAG Works in This App</p>
              <p className="text-muted-foreground text-xs mb-5">
                Standard AI apps guess from training memory. This app retrieves real statutory text first.
              </p>
              <div className="space-y-3">
                {HOW_RAG_WORKS.map((s, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-gold font-serif font-bold text-xs mt-0.5 flex-shrink-0">{s.step}</span>
                    <p className="text-sm text-foreground/80">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Knowledge base: CGST Act 2017 (Finance Act 2025 amendments) · Income Tax Act 1961 · Income Tax Act 2025 · Companies Act 2013 · Indian Contract Act 1872 · Arbitration Act 1996 · Transfer Pricing
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ticker */}
      <div className="border-t border-gold/20 py-3 relative z-10 overflow-hidden">
        <div className="flex">
          <div className="flex gap-10 animate-scroll whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="text-xs text-muted-foreground tracking-wide">
                {item} <span style={{ color: '#B8972A', margin: '0 4px' }}>·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
