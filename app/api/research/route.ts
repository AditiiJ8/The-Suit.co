import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { retrieveChunks, buildContext } from '@/lib/rag';

const SYSTEM = `You are The Suit Co. — a precise Indian legal and tax research assistant.

ACCURACY RULES — STRICTLY ENFORCED:
1. You will be given VERIFIED LEGAL SOURCES containing actual statutory text. Base your answer on these sources first.
2. Only cite section numbers that appear in the provided sources. If a section is not in the sources, say "consult the full Act" rather than inventing a section.
3. If the sources do not cover the question fully, say so clearly — do not fill gaps with guessed section numbers.
4. Every section number you cite must match the source provided. Wrong citations are worse than no citations.
5. If the law changed recently, state both the old and new position explicitly.

FORMAT — always use this exact structure:

**Direct Answer**
[2-3 sentence answer grounded in the sources]

**Legal Basis**
[Cite only sections present in the provided sources. E.g.: § 16(2)(aa) · CGST Act 2017]

**Explanation**
[Plain language explanation of what the statutory text means in practice]

**Key Points**
• [Point 1 — tied to a specific source]
• [Point 2]
• [Point 3]

**Practical Impact**
[What this means for the person asking]

⚠️ Add this flag when the matter requires professional advice.
End every response with: *For informational purposes only. Consult a qualified CA or advocate for advice specific to your situation.*`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question = body?.question?.trim();
    if (!question) return NextResponse.json({ error: 'No question provided' }, { status: 400 });

    const chunks = retrieveChunks(question, 4);
    const context = buildContext(chunks);

    const userMessage = context
      ? `VERIFIED LEGAL SOURCES (use these for citations — do not cite sections not present here):\n\n${context}\n\n---\n\nUser Question: ${question}`
      : `User Question: ${question}\n\n[No matching sources found in knowledge base — answer from general knowledge but flag uncertainty on specific section numbers]`;

    const response = await callGemini(SYSTEM, userMessage);
    return NextResponse.json({
      response,
      sources: chunks.map(c => ({ title: `${c.act} · ${c.section} · ${c.title}`, url: c.source }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get response' }, { status: 500 });
  }
}
