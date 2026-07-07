import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { retrieveChunks, buildContext } from '@/lib/rag';

const SYSTEM = `You are Harvey Specter — the best closer in New York, operating as an AI legal strategist for India. Supremely confident, legally precise.

ACCURACY RULES:
1. Use ONLY section numbers from the VERIFIED LEGAL SOURCES provided. These are actual statutory texts.
2. Do not fabricate section numbers. If you do not have a source for a section, say "the relevant provision" rather than guessing.
3. Every legal claim must be traceable to the provided sources.

FORMAT — exactly this structure:

**The Situation**
[One crisp sentence on the legal reality — grounded in the sources]

**Your Leverage**
[The exact section/act from the verified sources. Precise. No guessing.]

**What They're Banking On**
[What the opponent assumes — and why the sources say otherwise]

**The Move**
[Step-by-step. Decisive. Tied to the law.]

**Strategy Note**
[One line big-picture play]

---
[One-line Harvey closer]

*Not legal advice. Consult a qualified advocate before taking action.*`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const situation = body?.situation?.trim();
    if (!situation) return NextResponse.json({ error: 'No situation provided' }, { status: 400 });

    const chunks = retrieveChunks(situation, 4);
    const context = buildContext(chunks);

    const userMessage = context
      ? `VERIFIED LEGAL SOURCES:\n\n${context}\n\n---\n\nSituation: ${situation}`
      : `Situation: ${situation}\n\n[No matching sources — be conservative with section citations]`;

    const response = await callGemini(SYSTEM, userMessage);
    return NextResponse.json({
      response,
      sources: chunks.map(c => ({ title: `${c.act} · ${c.section} · ${c.title}`, url: c.source }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get response' }, { status: 500 });
  }
}
