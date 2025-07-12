"use client";

import { useState, useRef, useEffect } from "react";

export default function GroqChatPage() {
  // State for the chat messages and input
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm Groq. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending a user message
  const handleSend = async () => {
    if (!input.trim()) return;
    setError("");
    setLoading(true);
    // Add the user's message to the chat
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    try {
      // Send the full message array to the /api/groq endpoint
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Only send the messages array and model
          messages: newMessages,
          model: "llama-3.1-8b-instant",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unknown error");
      }
      // Add Groq's response as an assistant message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle pressing Enter to send
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-2xl border border-gray-700 flex flex-col h-[80vh]">
        <h1 className="text-2xl font-bold text-white mb-4">Groq Chatbot</h1>
        <div className="flex-1 overflow-y-auto mb-4 bg-gray-900 rounded p-4 border border-gray-700">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[70%] whitespace-pre-wrap font-mono text-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {error && (
          <div className="bg-red-900 text-red-300 p-2 rounded mb-2">
            Error: {error}
          </div>
        )}
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) handleSend();
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 resize-none"
            rows={2}
            placeholder="Type your message and press Enter..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
