import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function GET() {
  try {
    const result = await callGemini(
      'You are a helpful assistant.',
      'Say exactly: "LEXIS API is working. Model: gpt-4o-mini"'
    );
    return NextResponse.json({ status: 'success', model: 'gpt-4o-mini', response: result });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
