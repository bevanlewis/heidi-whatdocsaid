// ask.js - Ask Heidi functions

/**
 * Get a response from the Heidi AI Assistant
 * @param {HeidiAPIClient} client - The API client instance
 * @param {string} token - JWT token
 * @param {string} sessionId - Session ID
 * @param {string} aiCommandText - Instruction for the AI
 * @param {string} content - Context content for the AI
 * @param {string} contentType - Content type ('MARKDOWN' or 'HTML')
 * @returns {Promise<Object>} AI response (streamed)
 */
export async function askHeidi(
  client,
  token,
  sessionId,
  aiCommandText,
  content,
  contentType = "MARKDOWN"
) {
  const requestBody = {
    ai_command_text: aiCommandText,
    content,
    content_type: contentType,
  };

  return client.requestWithToken(
    token,
    `sessions/${sessionId}/ask-ai`,
    "POST",
    requestBody
  );
}
