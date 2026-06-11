import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
  try {

    const { code } = await req.json();

    if (!code) {
      return Response.json(
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
You are an expert AI code analyzer.

Rules:
- Always return valid JSON array
- Detect multiple issues
- Minimum 3 issues
- Maximum 6 issues
- Return ONLY JSON
- No markdown
- No explanation

Allowed types:
error
warning
success

Allowed severity:
high
medium
low
info

Example:

[
  {
    "type": "error",
    "message": "Unused variable detected",
    "line": 12,
    "severity": "low"
  },
  {
    "type": "warning",
    "message": "Missing dependency in useEffect",
    "line": 25,
    "severity": "medium"
  }
]
`
        },

        {
          role: "user",
          content: code,
        },

      ],

    });

    return Response.json(completion);

  } catch (error) {

    console.log(error);

    return Response.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );

  }
}