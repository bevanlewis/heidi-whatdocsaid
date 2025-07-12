// transcription.js - Transcription functions

/**
 * Initialize audio transcription
 * @param {HeidiAPIClient} client - The API client instance
 * @param {string} token - JWT token
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Recording ID
 */
export async function initializeTranscription(client, token, sessionId) {
  return client.requestWithToken(
    token,
    `sessions/${sessionId}/restful-segment-transcription`,
    "POST"
  );
}

/**
 * Upload audio chunk to transcribe
 * @param {HeidiAPIClient} client - The API client instance
 * @param {string} token - JWT token
 * @param {string} sessionId - Session ID
 * @param {string} recordingId - Recording ID
 * @param {File} audioFile - Audio file to upload
 * @param {number} index - Audio chunk index
 * @returns {Promise<Object>} Success status
 */
export async function uploadAudioChunk(
  client,
  token,
  sessionId,
  recordingId,
  audioFile,
  index
) {
  const formData = new FormData();
  formData.append("file", audioFile);
  formData.append("index", index.toString());

  return client.requestMultipart(
    token,
    `sessions/${sessionId}/restful-segment-transcription/${recordingId}:transcribe`,
    formData
  );
}

/**
 * End audio transcription
 * @param {HeidiAPIClient} client - The API client instance
 * @param {string} token - JWT token
 * @param {string} sessionId - Session ID
 * @param {string} recordingId - Recording ID
 * @returns {Promise<Object>} Success status
 */
export async function finishTranscription(
  client,
  token,
  sessionId,
  recordingId
) {
  return client.requestWithToken(
    token,
    `sessions/${sessionId}/restful-segment-transcription/${recordingId}:finish`,
    "POST"
  );
}

/**
 * Get transcript for a session
 * @param {HeidiAPIClient} client - The API client instance
 * @param {string} token - JWT token
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Transcript text
 */
export async function getTranscript(client, token, sessionId) {
  return client.requestWithToken(
    token,
    `sessions/${sessionId}/transcript`,
    "GET"
  );
}
