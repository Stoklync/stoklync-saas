import { generateText, Output } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const GrapesSchema = z.object({
  html: z.string().describe('HTML structure for the page sections'),
  css: z.string().describe('Minimal CSS for the layout'),
  components: z.array(z.object({
    type: z.string(),
    content: z.string(),
    style: z.record(z.string(), z.string()).optional(),
  })).optional(),
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ error: 'prompt required' }, { status: 400 });
    }

    const { output } = await generateText({
      model: openai('gpt-4o-mini'),
      output: Output.object({
        schema: GrapesSchema,
        name: 'GrapesJSScaffold',
        description: 'Website scaffold structure for visual editor',
      }),
      prompt: `You are scaffolding a website for GrapesJS. The user described their business: "${prompt}".

Generate a modern, professional single-page structure with:
1. A hero section (headline, subheadline, CTA)
2. A features/services section (3 blocks)
3. An about section
4. A contact/form section

Return:
- html: Semantic HTML string (use divs with data-gjs-type for GrapesJS: section, text, image, etc.)
- css: Tailwind-like or minimal CSS for the layout

Keep it simple and conversion-focused.`,
    });

    return Response.json(output);
  } catch (e) {
    console.warn('ai-scaffold error:', e);
    return Response.json({ error: 'Failed to scaffold' }, { status: 500 });
  }
}
