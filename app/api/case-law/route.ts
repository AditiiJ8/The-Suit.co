import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { retrieveChunks, buildContext } from '@/lib/rag';

const SYSTEM = `You are The Suit Co. Case Law — an expert on Indian Supreme Court and High Court judgements.

CRITICAL ACCURACY RULES:
1. Only return cases you are HIGHLY confident are real. A missing case is better than a hallucinated one.
2. If you are not certain of the exact citation (AIR/SCC number), leave the citation field as "Verify on Indian Kanoon" — do not fabricate it.
3. Use the VERIFIED LEGAL SOURCES to identify which sections to search for — return cases that interpret those specific sections.
4. The indianKanoonHint must be a real search term that would find this case on indiankanoon.org.
5. Prefer landmark Supreme Court cases that are widely reported and cited.

Return ONLY a valid JSON array.

[
  {
    "caseTitle": "string (full case name)",
    "court": "Supreme Court of India / [Name] High Court",
    "year": number,
    "citation": "string (exact citation if certain, otherwise 'Verify on Indian Kanoon')",
    "summary": "string (2-3 sentences — what was actually decided)",
    "significance": "string (why this matters — reference the specific section from sources)",
    "topic": "GST / Income Tax / Contract / Corporate / Arbitration / Constitutional",
    "indianKanoonHint": "string (search term to find and verify on indiankanoon.org)"
  }
]

Return 3-5 results only. Quality over quantity.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body?.query?.trim();
    if (!query) return NextResponse.json({ error: 'No query provided' }, { status: 400 });

    const chunks = retrieveChunks(query, 3);
    const context = buildContext(chunks);

    const userMessage = context
      ? `VERIFIED LEGAL SOURCES (find cases interpreting these exact sections):\n\n${context}\n\n---\n\nFind Indian case law for: ${query}`
      : `Find Indian case law for: ${query}\n\nOnly return cases you are certain exist. Do not fabricate citations.`;

    const raw = await callGemini(SYSTEM, userMessage);
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    try {
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({
        cases: parsed,
        sources: chunks.map(c => ({ title: `${c.act} · ${c.section} · ${c.title}`, url: c.source }))
      });
    } catch {
      const match = cleaned.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          return NextResponse.json({
            cases: JSON.parse(match[0]),
            sources: chunks.map(c => ({ title: `${c.act} · ${c.section} · ${c.title}`, url: c.source }))
          });
        } catch {}
      }
      return NextResponse.json({ error: 'Could not parse results. Try again.' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Search failed' }, { status: 500 });
  }
}
