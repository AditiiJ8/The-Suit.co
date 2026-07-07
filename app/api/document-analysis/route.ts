import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { retrieveChunks, buildContext } from '@/lib/rag';

const SYSTEM = `You are The Suit Co. Document Analyst — an expert AI legal analyst for Indian law.

ACCURACY RULES:
1. Use ONLY section numbers present in the VERIFIED LEGAL SOURCES.
2. "keyText" must be actual text from the uploaded document — not invented.
3. Risk scores must reflect actual legal exposure based on the source penalties.
4. Do not add issues not supported by the sources or the document itself.
5. "consequence" must state the actual statutory penalty from the sources.

Respond with ONLY valid JSON.

{
  "documentType": "string",
  "riskScore": number (0-100),
  "overallRisk": "LOW" | "MEDIUM" | "HIGH",
  "summary": "string (2-3 sentences, factual)",
  "issues": [
    {
      "title": "string",
      "risk": "LOW" | "MEDIUM" | "HIGH",
      "section": "string (from verified sources only)",
      "details": "string (grounded in sources)",
      "keyText": "string (actual text from the document)"
    }
  ],
  "missingClauses": ["string"],
  "suggestedActions": [
    { "action": "string", "deadline": "string" }
  ],
  "lawyerRequired": boolean,
  "lawyerNote": "string"
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const document = body?.document?.trim();
    if (!document) return NextResponse.json({ error: 'No document provided' }, { status: 400 });

    const chunks = retrieveChunks(document, 5);
    const context = buildContext(chunks);

    const userMessage = context
      ? `VERIFIED LEGAL SOURCES:\n\n${context}\n\n---\n\nAnalyze this document. JSON only:\n\n${document}`
      : `Analyze this document. JSON only:\n\n${document}`;

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
      return NextResponse.json({ error: 'Could not parse analysis. Try again.' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
