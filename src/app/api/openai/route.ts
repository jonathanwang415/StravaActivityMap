import { getOpenAiPrompt } from '@/utils/prompts';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { mileage, power } = await req.json();

    const prompt = getOpenAiPrompt (mileage, power);

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or 'gpt-4o' or others
      messages: [{ role: 'user', content: prompt }],
    });

    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI error:', error);
    return NextResponse.json({ error: 'OpenAI request failed' }, { status: 500 });
  }
}