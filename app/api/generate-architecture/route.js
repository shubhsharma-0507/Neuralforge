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
// Return ONLY valid JSON.

// {
//   "nodes":[
//     {
//       "id":"client",
//       "label":"Client App",
//       "icon":"Globe",
//       "x":50,
//       "y":10,
//       "color":"from-blue-500 to-cyan-500"
//     }
//   ],
//   "connections":[
//     {
//       "from":"client",
//       "to":"api"
//     }
//   ]
// }
// `,
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//     });

//     const result =
//       completion.choices?.[0]?.message?.content;

//     return NextResponse.json(JSON.parse(result));
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


// app/api/generate-architecture/route.js
// Architecture Generator — login required
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

const VALID_ICONS = ['Globe', 'Server', 'Database', 'Cloud', 'Shield', 'Cpu', 'HardDrive', 'Layers', 'Network']

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

  const systemPrompt = `You are a software architecture expert.
Return ONLY valid JSON — no markdown, no explanation, no backticks.

JSON structure:
{
  "nodes": [
    { "id": "unique_id", "label": "Short Label", "icon": "IconName" }
  ],
  "links": [
    { "from": "node_id", "to": "node_id" }
  ]
}

Rules:
- id must be unique snake_case
- label max 3 words
- icon must be one of: ${VALID_ICONS.join(', ')}
- 5 to 10 nodes maximum
- links must only use valid node ids
- Return ONLY the JSON object`

  try {
    const response = await client.chat.completions.create({
      model: 'deepseek/deepseek-chat',
      max_tokens: 1500,
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: `Generate architecture for: ${userPrompt}` },
      ],
    })

    let raw = response.choices[0]?.message?.content || '{}'
    raw = raw.replace(/```json|```/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      return Response.json({ error: 'AI returned invalid JSON. Please try again.' }, { status: 500 })
    }

    const nodes = (parsed.nodes || []).map((n, i) => ({
      id:    String(n.id    || `node_${i}`),
      label: String(n.label || `Node ${i + 1}`),
      icon:  VALID_ICONS.includes(n.icon) ? n.icon : 'Server',
    }))

    const nodeIds = new Set(nodes.map(n => n.id))
    const links   = (parsed.links || []).filter(
      l => nodeIds.has(l.from) && nodeIds.has(l.to)
    )

    return Response.json({ nodes, links }, { status: 200 })

  } catch (err) {
    console.error('[generate-architecture] error:', err?.message)
    return Response.json({ error: err?.message || 'OpenRouter request failed' }, { status: 500 })
  }
}