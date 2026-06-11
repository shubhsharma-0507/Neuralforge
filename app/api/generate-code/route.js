// import OpenAI from "openai";
// import { NextResponse } from "next/server";

// const client = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENROUTER_API_KEY,
// });

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     const prompt = body?.prompt?.trim();

//     if (!prompt) {
//       return NextResponse.json(
//         { error: "Prompt is required" },
//         { status: 400 }
//       );
//     }

//     const completion = await client.chat.completions.create({
//       model: "openai/gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: `
// You are an expert React and TypeScript developer.

// Return ONLY code.
// Do not use markdown.
// Do not explain anything.
// Output must start directly with code.
// `,
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//     });

//     return NextResponse.json({
//       code:
//         completion.choices?.[0]?.message?.content ||
//         "// No code generated",
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         error:
//           error?.message ||
//           "Something went wrong",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }


// app/api/generate-code/route.js
// Code Generator — login required
export const runtime = 'nodejs'

import OpenAI from 'openai'
import { requireAuth } from '@/lib/requireAuth'

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': process.env.NEXT_PUBLIC_SITE_NAME || 'NeuralForge',
  },
})

export async function POST(req) {
  // ── Auth check ───────────────────────────────────────────────────
  const { error } = await requireAuth()
  if (error) return error

  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const userPrompt = body?.prompt?.trim()
  if (!userPrompt) {
    return Response.json({ error: 'prompt is required' }, { status: 400 })
  }

  const systemPrompt = `You are an expert TypeScript/React developer.
When the user describes something to build, respond with ONLY the raw code —
no markdown fences, no explanation, no preamble, no trailing notes.
Output must start directly with the import statements or code.
Rules:
- Use TypeScript with proper types
- Use React functional components with hooks
- Follow modern best practices (2024)
- Add short inline comments where helpful
- Keep code clean and production-ready`

  try {
    const response = await client.chat.completions.create({
      model: 'deepseek/deepseek-chat',
      max_tokens: 2048,
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
    })

    const code = response.choices[0]?.message?.content || '// No code generated'
    return Response.json({ code }, { status: 200 })

  } catch (err) {
    console.error('[generate-code] error:', err?.message)
    return Response.json({ error: err?.message || 'OpenRouter request failed' }, { status: 500 })
  }
}