'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, FileText, BookOpen, Scale, Search, BookMarked, Zap, Menu, X } from 'lucide-react';

const NAV = [
  { name: 'Research', href: '/app/research', icon: Home },
  { name: 'Document Analysis', href: '/app/document-analysis', icon: FileText },
  { name: 'Plain English', href: '/app/plain-english', icon: BookOpen },
  { name: 'Compliance', href: '/app/compliance', icon: Scale },
  { name: 'Case Law', href: '/app/case-law', icon: Search },
  { name: 'Glossary', href: '/app/glossary', icon: BookMarked },
  { name: 'Harvey Mode', href: '/app/harvey-mode', icon: Zap },
];

const MODE_NAMES: Record<string, string> = {
  '/app/research': 'Research',
  '/app/document-analysis': 'Document Analysis',
  '/app/plain-english': 'Plain English',
  '/app/compliance': 'Compliance Checklist',
  '/app/case-law': 'Case Law Search',
  '/app/glossary': 'Legal Glossary',
  '/app/harvey-mode': 'Harvey Specter Mode',
};

const HARVEY_QUOTES = [
  '"The law doesn\'t wait. Neither should you."',
  '"Every word in a contract matters."',
  '"Knowledge is the only weapon that never dulls."',
  '"Your legal strategy starts here."',
  '"Deadlines missed are wars lost."',
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const modeName = MODE_NAMES[pathname] || 'The Suit Co.';
  const isHarvey = pathname === '/app/harvey-mode';
  const [quote, setQuote] = useState(HARVEY_QUOTES[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setQuote(HARVEY_QUOTES[Math.floor(Math.random() * HARVEY_QUOTES.length)]);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  function navigate(href: string) {
    router.push(href);
    setSidebarOpen(false);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-56 flex flex-col border-r border-border
          transition-transform duration-200 ease-in-out
          md:static md:translate-x-0 md:flex-shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ backgroundColor: '#0A0A0F' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-left">
            <h1 className="font-serif text-2xl font-bold text-gold">The Suit Co.</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Legal Intelligence</p>
          </button>
          <button
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href;
            const harvey = item.href === '/app/harvey-mode';
            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all mb-0.5"
                style={{
                  borderLeft: `2px solid ${active ? '#B8972A' : 'transparent'}`,
                  backgroundColor: active ? 'rgba(184,151,42,0.08)' : 'transparent',
                  color: active ? '#B8972A' : harvey ? '#C0392B' : '#6B7280',
                  borderRadius: '0 2px 2px 0',
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = '#F0EDE8'; (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.03)'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = harvey ? '#C0392B' : '#6B7280'; (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; } }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* RAG status */}
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse flex-shrink-0" />
            <span className="text-xs text-gold/70 font-medium">RAG Active</span>
          </div>
          <p className="text-xs text-muted-foreground/60 leading-relaxed">Real statutory text retrieved before every answer</p>
        </div>

        {/* Quote */}
        <div className="px-4 py-4 border-t border-border">
          <p className="text-xs text-muted-foreground italic leading-relaxed">{quote}</p>
        </div>

        <div className="px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground/50">Not legal advice. Consult a qualified professional.</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="flex-shrink-0 border-b border-border px-4 md:px-8 py-4 flex items-center gap-3"
          style={{ backgroundColor: '#0A0A0F' }}
        >
          <button
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2
            className="font-serif text-xl md:text-2xl font-bold"
            style={{ color: isHarvey ? '#C0392B' : '#F0EDE8' }}
          >
            {modeName}
          </h2>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
