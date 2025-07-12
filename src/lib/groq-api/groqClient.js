// src/lib/groq-api/groqClient.js

// This function sends a prompt to the Groq API and returns the response.
// It uses the fetch API to make HTTP requests.

export async function askGroq(prompt) {
  const systemInstruction =
    "Summarize the following text in 100 words or less:";
  const model = "llama-3.1-8b-instant";

  // Get the API key from environment variables
  const apiKey = process.env.GROQ_API_KEY;

  // Check if the API key is set
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set in environment variables.");
  }

  // Build the messages array
  const messages = [];
  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  messages.push({ role: "user", content: prompt });

  // Set up the request payload
  const payload = {
    model,
    messages,
    max_tokens: 512, // Maximum number of tokens in the response
    temperature: 0.7, // Controls randomness: lower is more focused, higher is more creative
  };

  // Make the POST request to Groq's API
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

  // If the response is not OK, throw an error
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  // Parse the JSON response
  const data = await response.json();

  // Return the generated message from the API response
  return data.choices[0].message.content;
}
