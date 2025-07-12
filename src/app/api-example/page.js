"use client";

import { useState } from "react";
import { useHeidiApi } from "../../hooks/useHeidiApi";

export default function ApiExamplePage() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [results, setResults] = useState([]);

  // Initialize the hook with your API key
  const heidiApi = useHeidiApi(process.env.NEXT_PUBLIC_HEIDI_API_KEY);

  const addResult = (message, data = null) => {
    setResults((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        message,
        data,
      },
    ]);
  };

  const handleAuthenticate = async () => {
    try {
      const result = await heidiApi.authenticate(email, userId);
      addResult("Authentication successful", result);
    } catch (error) {
      addResult(`Authentication failed: ${error.message}`);
    }
  };

  const handleCreateSession = async () => {
    try {
      const result = await heidiApi.createNewSession();
      setSessionId(result.session_id);
      addResult("Session created", result);
    } catch (error) {
      addResult(`Session creation failed: ${error.message}`);
    }
  };

  const handleGetTemplates = async () => {
    try {
      const result = await heidiApi.getTemplates();
      addResult("Templates retrieved", result);
    } catch (error) {
      addResult(`Failed to get templates: ${error.message}`);
    }
  };

  const handleGenerateNote = async () => {
    if (!sessionId) {
      addResult("Please create a session first");
      return;
    }

    try {
      const result = await heidiApi.generateNote(sessionId, {
        template_id: "659b8042fe093d6592b41ef7", // Example template ID
        voice_style: "GOLDILOCKS",
        brain: "LEFT",
      });
      addResult("Note generated", result);
    } catch (error) {
      addResult(`Note generation failed: ${error.message}`);
    }
  };

  const handleAskHeidi = async () => {
    if (!sessionId) {
      addResult("Please create a session first");
      return;
    }

    try {
      const result = await heidiApi.askHeidiAI(
        sessionId,
        "Summarize this text",
        "This is a sample medical consultation about a patient with headaches.",
        "MARKDOWN"
      );
      addResult("Ask Heidi response", result);
    } catch (error) {
      addResult(`Ask Heidi failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Heidi API Example
          </h1>
          <p className="text-lg text-gray-300">
            Test the Heidi Health API integration
          </p>
        </div>

        {/* Authentication Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-700">
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 rounded-full p-3 mr-4">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <h2 className="text-2xl font-semibold text-white">
              Authentication
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-white placeholder-gray-400"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                User ID:
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-white placeholder-gray-400"
                placeholder="unique-user-id"
              />
            </div>
            <button
              onClick={handleAuthenticate}
              disabled={heidiApi.loading || !email || !userId}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {heidiApi.loading ? "Authenticating..." : "Authenticate"}
            </button>
            {heidiApi.isAuthenticated && (
              <div className="flex items-center mt-4">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <p className="text-green-400 font-medium">
                  Authenticated successfully
                </p>
              </div>
            )}
          </div>
        </div>

        {/* API Actions Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-700">
          <div className="flex items-center mb-6">
            <div className="bg-green-600 rounded-full p-3 mr-4">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <h2 className="text-2xl font-semibold text-white">API Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleCreateSession}
              disabled={heidiApi.loading || !heidiApi.isAuthenticated}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Create Session
            </button>

            <button
              onClick={handleGetTemplates}
              disabled={heidiApi.loading || !heidiApi.isAuthenticated}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Get Templates
            </button>

            <button
              onClick={handleGenerateNote}
              disabled={
                heidiApi.loading || !heidiApi.isAuthenticated || !sessionId
              }
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Generate Note
            </button>

            <button
              onClick={handleAskHeidi}
              disabled={
                heidiApi.loading || !heidiApi.isAuthenticated || !sessionId
              }
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Ask Heidi
            </button>
          </div>

          {sessionId && (
            <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700">
              <p className="text-sm text-blue-300">
                <span className="font-medium">Current Session ID:</span>{" "}
                <code className="bg-blue-800/50 px-2 py-1 rounded font-mono text-xs text-blue-200">
                  {sessionId}
                </code>
              </p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
          <div className="flex items-center mb-6">
            <div className="bg-indigo-600 rounded-full p-3 mr-4">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <h2 className="text-2xl font-semibold text-white">Results</h2>
          </div>

          {heidiApi.error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                <span className="font-medium">Error:</span>
                <span className="ml-2">{heidiApi.error}</span>
              </div>
            </div>
          )}

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className="border-l-4 border-indigo-500 bg-gray-700/50 p-4 rounded-r-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-white">
                    {result.message}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                    {result.timestamp}
                  </span>
                </div>
                {result.data && (
                  <pre className="mt-3 text-sm bg-gray-900 p-3 rounded border border-gray-600 overflow-x-auto text-gray-300 font-mono">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>

          {results.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📋</span>
              </div>
              <p className="text-gray-300 text-lg">No results yet</p>
              <p className="text-gray-500 text-sm mt-1">
                Try the API actions above to see results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
