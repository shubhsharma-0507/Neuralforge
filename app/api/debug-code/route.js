import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();

    const code = body?.code?.trim();

    if (!code) {
      return NextResponse.json(
        {
          error: "Code is required",
        },
        {
          status: 400,
        }
      );
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an expert software debugger.

Return JSON only.

Format:
{
  "issues": [
    {
      "type": "error",
      "title": "...",
      "description": "..."
    }
  ],
  "fixedCode": "..."
}
`,
        },
        {
          role: "user",
          content: code,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = completion.choices?.[0]?.message?.content;

    return NextResponse.json(JSON.parse(result));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: error?.message || "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}