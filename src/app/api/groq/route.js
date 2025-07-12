import { NextResponse } from "next/server";
import { askGroq } from "@/lib/groq-api/groqClient";

// This API route allows private server-side access to the Groq API.
// It accepts POST requests with a JSON body: { prompt, model, systemInstruction, messages }
// and returns the Groq response as JSON.

export async function POST(request) {
  try {
    // Parse the JSON body
    const body = await request.json();
    const { prompt, model, systemInstruction, messages } = body;

    // If messages array is provided, use it for chat
    if (Array.isArray(messages) && messages.length > 0) {
      // Dynamically import fetch and API key for server-side call
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: "GROQ_API_KEY is not set in environment variables." },
          { status: 500 }
        );
      }
      const payload = {
        model: model || "llama-3.1-8b-instant",
        messages,
        max_tokens: 512,
        temperature: 0.7,
      };
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const error = await response.text();
        return NextResponse.json({ error }, { status: 500 });
      }
      const data = await response.json();
      return NextResponse.json({ answer: data.choices[0].message.content });
    }

    // Otherwise, use the askGroq helper for single prompt
    if (!prompt) {
      return NextResponse.json(
        { error: "Missing 'prompt' in request body." },
        { status: 400 }
      );
    }
    const answer = await askGroq(prompt, model, systemInstruction);
    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
