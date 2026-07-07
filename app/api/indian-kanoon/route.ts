import { NextRequest, NextResponse } from 'next/server';

// Indian Kanoon search — no API key needed, uses public search endpoint
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body?.query?.trim();
    if (!query) return NextResponse.json({ error: 'No query provided' }, { status: 400 });

    const encoded = encodeURIComponent(query);
    const searchUrl = `https://indiankanoon.org/search/?formInput=${encoded}&pagenum=0`;

    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; legal-research-tool)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json({ results: [], searchUrl, query, fallback: true }, { status: 200 });
    }

    const html = await res.text();

    // Parse results from Indian Kanoon HTML
    const results: Array<{
      title: string;
      court: string;
      date: string;
      snippet: string;
      url: string;
      docId: string;
    }> = [];

    // IK result blocks
    const resultPattern = /<div[^>]*class="[^"]*result[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]*class="[^"]*result[^"]*"|<div[^>]*class="pagination|$)/gi;
    const titlePattern = /<a[^>]*href="\/doc\/(\d+)\/"[^>]*>([\s\S]*?)<\/a>/i;
    const snippetPattern = /<p[^>]*class="[^"]*snippet[^"]*"[^>]*>([\s\S]*?)<\/p>/i;
    const docInfoPattern = /<span[^>]*class="[^"]*docsource[^"]*"[^>]*>([\s\S]*?)<\/span>/i;

    let match;
    while ((match = resultPattern.exec(html)) !== null && results.length < 8) {
      const block = match[1];
      const titleMatch = titlePattern.exec(block);
      if (!titleMatch) continue;

      const docId = titleMatch[1];
      const rawTitle = titleMatch[2].replace(/<[^>]+>/g, '').trim();
      if (!rawTitle || rawTitle.length < 5) continue;

      const snippetMatch = snippetPattern.exec(block);
      const snippet = snippetMatch
        ? snippetMatch[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim()
        : '';

      const infoMatch = docInfoPattern.exec(block);
      const docInfo = infoMatch ? infoMatch[1].replace(/<[^>]+>/g, '').trim() : '';

      let court = 'Indian Court';
      let date = '';

      if (docInfo) {
        const parts = docInfo.split(',').map((s: string) => s.trim());
        if (parts.length >= 1) court = parts[0];
        if (parts.length >= 2) date = parts[parts.length - 1];
      }

      if (court === 'Indian Court') {
        if (/supreme court/i.test(rawTitle + block)) court = 'Supreme Court of India';
        else {
          const hcMatch = /([A-Za-z][\w\s]+High Court)/i.exec(block);
          if (hcMatch) court = hcMatch[1];
        }
      }

      results.push({
        title: rawTitle,
        court,
        date,
        snippet: snippet.slice(0, 400),
        url: `https://indiankanoon.org/doc/${docId}/`,
        docId,
      });
    }

    return NextResponse.json({ results, searchUrl, query, fallback: results.length === 0 });
  } catch (error: any) {
    return NextResponse.json({
      results: [],
      searchUrl: '',
      query: '',
      fallback: true,
      error: error.message,
    });
  }
}
