// import OpenAI from "openai";
// import { NextResponse } from "next/server";

// const client = new OpenAI({
//     baseURL: "https://openrouter.ai/api/v1",
//     apiKey: process.env.OPENROUTER_API_KEY,
// });

// export async function POST(req) {

//     try {

//         const body = await req.json();

//         const completion = await client.chat.completions.create({
//             model: "openai/gpt-4o-mini",
//             messages: body.messages,
//         });

//         return NextResponse.json(completion);

//     }
//     catch (error) {

//         console.log(error);

//         return NextResponse.json(
//             {
//                 error: "Something went wrong"
//             },
//             {
//                 status: 500
//             }
//         );
//     }
// }


// app/api/chat/route.js
// AI Chatbot — login required
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
  const { session, error } = await requireAuth()
  if (error) return error

  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'messages array is required' }, { status: 400 })
    }

    const response = await client.chat.completions.create({
      model: 'deepseek/deepseek-chat',
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: `You are NeuralForge AI assistant — an expert developer assistant. 
Help users with code, debugging, architecture, and technical questions.
Be concise, practical, and provide working code examples when relevant.
Current user: ${session.user.name} (${session.user.email})`
        },
        ...messages
      ],
    })

    const reply = response.choices[0]?.message?.content || 'No response'
    return Response.json({ reply }, { status: 200 })

  } catch (err) {
    console.error('[chat] error:', err?.message)
    return Response.json({ error: err?.message || 'AI request failed' }, { status: 500 })
  }
}