import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { retrieveChunks, buildContext } from '@/lib/rag';

const SYSTEM = `You are The Suit Co. Plain English — you translate complex Indian legal text into accurate plain English.

ACCURACY RULES:
1. Use VERIFIED LEGAL SOURCES provided to identify the correct section and Act.
2. If the text matches a section in the sources, cite it precisely.
3. Do not simplify to the point of changing the legal meaning. Accuracy first, simplicity second.
4. If a legal consequence is serious, do NOT soften it.

FORMAT:

**Plain English Version**
[2-4 clear sentences. Legally accurate.]

**What This Means For You**
[Real-world practical impact]

**Key Takeaways**
• [Takeaway 1]
• [Takeaway 2]
• [Takeaway 3]

**Legal Reference**
[Exact section from verified sources if identifiable. E.g. "Section 16(2)(aa) · CGST Act 2017"]

**Watch Out For**
[Trap clause or serious consequence — be direct, do not minimise]

*Simplified for informational purposes only. Consult a qualified professional for official legal interpretation.*`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body?.text?.trim();
    if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 });

    const chunks = retrieveChunks(text, 3);
    const context = buildContext(chunks);

    const userMessage = context
      ? `VERIFIED LEGAL SOURCES:\n\n${context}\n\n---\n\nSimplify this legal text:\n\n${text}`
      : `Simplify this legal text:\n\n${text}`;

    const response = await callGemini(SYSTEM, userMessage);
    return NextResponse.json({
      response,
      sources: chunks.map(c => ({ title: `${c.act} · ${c.section} · ${c.title}`, url: c.source }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to simplify' }, { status: 500 });
  }
}
