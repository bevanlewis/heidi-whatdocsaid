import { NextResponse } from "next/server";
import { askGroq } from "@/lib/groq-api/groqClient";

// This API route allows private server-side access to the Groq API.
// It accepts POST requests with a JSON body: { prompt, model, systemInstruction }
// and returns the Groq response as JSON.

export async function POST(request) {
  try {
    // Parse the JSON body
    const body = await request.json();
    const { prompt } = body;

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: "Missing 'prompt' in request body." },
        { status: 400 }
      );
    }

    // Call the askGroq function (server-side, so API key is private)
    const answer = await askGroq(prompt);

    // Return the response as JSON
    return NextResponse.json({ answer });
  } catch (error) {
    // Handle errors and return a 500 status
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
