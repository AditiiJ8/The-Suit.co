import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { retrieveChunks, buildContext } from '@/lib/rag';

const SYSTEM = `You are The Suit Co. Compliance — an AI compliance officer for Indian legal and tax requirements.

ACCURACY RULES:
1. Use ONLY section numbers from the VERIFIED LEGAL SOURCES provided.
2. Deadlines and penalties must come from the sources — do not invent them.
3. If a compliance item is not covered by the sources, omit it rather than guessing.
4. Consequences must reflect actual statutory penalties.

Respond with ONLY valid JSON — no markdown, no text outside the JSON.

{
  "title": "string",
  "period": "string",
  "parties": "string",
  "documentSummary": "string",
  "items": [
    {
      "action": "string",
      "section": "string (exact section from verified sources only)",
      "deadline": "string (from sources or document)",
      "responsible": "Taxpayer / CA / Advocate / Company Secretary",
      "urgency": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "consequence": "string (actual statutory penalty from sources)"
    }
  ],
  "priorityNote": "string",
  "totalItems": number,
  "criticalCount": number
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const document = body?.document?.trim();
    if (!document) return NextResponse.json({ error: 'No document provided' }, { status: 400 });

    const chunks = retrieveChunks(document, 5);
    const context = buildContext(chunks);

    const userMessage = context
      ? `VERIFIED LEGAL SOURCES:\n\n${context}\n\n---\n\nGenerate compliance checklist. JSON only:\n\n${document}`
      : `Generate compliance checklist. JSON only:\n\n${document}`;

    const raw = await callGemini(SYSTEM, userMessage);
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    try {
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({ ...parsed, sources: chunks.map(c => ({ title: `${c.act} · ${c.section} · ${c.title}`, url: c.source })) });
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          const parsed = JSON.parse(match[0]);
          return NextResponse.json({ ...parsed, sources: chunks.map(c => ({ title: `${c.act} · ${c.section} · ${c.title}`, url: c.source })) });
        } catch {}
      }
      return NextResponse.json({ error: 'Could not parse checklist. Try again.' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate checklist' }, { status: 500 });
  }
}
