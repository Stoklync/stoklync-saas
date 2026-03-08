import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ error: 'prompt required' }, { status: 400 });
    }
    const field = (type || 'hero') as 'hero' | 'about' | 'tagline';

    const instructions: Record<string, string> = {
      hero: `Write a punchy, modern hero headline (max 8 words) and a one-line subheadline (max 15 words) for a business. Return ONLY valid JSON: {"headline":"...","subheadline":"..."}`,
      about: `Write a 2-sentence "About us" paragraph for this business. Return ONLY valid JSON: {"body":"..."}`,
      tagline: `Write a short, memorable tagline (max 6 words) for this business. Return ONLY valid JSON: {"tagline":"..."}`,
    };

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `${instructions[field]}\n\nBusiness: ${prompt}`,
    });

    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());
    return Response.json(parsed);
  } catch (e) {
    console.warn('generate-copy error:', e);
    return Response.json({ error: 'Failed to generate' }, { status: 500 });
  }
}
