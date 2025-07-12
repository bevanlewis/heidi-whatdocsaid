"use client";

import { useState } from "react";

export default function GroqTestPage() {
  // State for user input, system instruction, and Groq response
  const [prompt, setPrompt] = useState("");
  const [systemInstruction, setSystemInstruction] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to handle sending the prompt to the private API endpoint
  const handleSend = async () => {
    setLoading(true);
    setError("");
    setResponse("");
    try {
      // Send a POST request to the /api/groq endpoint
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unknown error");
      }
      setResponse(data.answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-4">Groq API Test</h1>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">
            System Instruction (optional):
          </label>
          <input
            type="text"
            value={systemInstruction}
            onChange={(e) => setSystemInstruction(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            placeholder="e.g. You are a helpful assistant."
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Prompt:</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            rows={4}
            placeholder="Type your question for Groq here..."
          />
        </div>
        <button
          onClick={handleSend}
          disabled={loading || !prompt}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed w-full mb-4"
        >
          {loading ? "Sending..." : "Send to Groq"}
        </button>
        {error && (
          <div className="bg-red-900 text-red-300 p-2 rounded mb-2">
            Error: {error}
          </div>
        )}
        {response && (
          <div className="bg-gray-700 text-gray-100 p-4 rounded mt-2 whitespace-pre-wrap">
            <strong>Groq Response:</strong>
            <div className="mt-2">{response}</div>
          </div>
        )}
      </div>
    </div>
  );
}
