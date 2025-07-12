// sessions.js - Session management functions

/**
 * Create a new session
 * @param {HeidiAPIClient} client - The API client instance
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Session ID
 */
export async function createSession(client, token) {
  return client.requestWithToken(token, "sessions", "POST");
}

/**
 * Get session details
 * @param {HeidiAPIClient} client - The API client instance
 * @param {string} token - JWT token
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Session details
 */
export async function getSession(client, token, sessionId) {
  return client.requestWithToken(token, `sessions/${sessionId}`, "GET");
}

/**
 * Update session information
 * @param {HeidiAPIClient} client - The API client instance
 * @param {string} token - JWT token
 * @param {string} sessionId - Session ID
 * @param {Object} sessionData - Session update data
 * @returns {Promise<Object>} Updated session details
 */
export async function updateSession(client, token, sessionId, sessionData) {
  return client.requestWithToken(
    token,
    `sessions/${sessionId}`,
    "PATCH",
    sessionData
  );
}
