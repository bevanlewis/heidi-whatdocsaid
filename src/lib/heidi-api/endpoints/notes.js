// notes.js - Consult notes functions

/**
 * Get available consult note templates
 * @param {HeidiAPIClient} client - The API client instance
 * @param {string} token - JWT token
 * @returns {Promise<Object>} List of available templates
 */
export async function getConsultNoteTemplates(client, token) {
  return client.requestWithToken(
    token,
    "templates/consult-note-templates",
    "GET"
  );
}

/**
 * Generate consult note using a Heidi template
 * @param {HeidiAPIClient} client - The API client instance
 * @param {string} token - JWT token
 * @param {string} sessionId - Session ID
 * @param {Object} noteOptions - Note generation options
 * @returns {Promise<Object>} Generated note (streamed)
 */
export async function generateConsultNote(
  client,
  token,
  sessionId,
  noteOptions
) {
  const defaultOptions = {
    generation_method: "TEMPLATE",
    addition: "",
    voice_style: "GOLDILOCKS",
    brain: "LEFT",
  };

  const options = { ...defaultOptions, ...noteOptions };
  return client.requestWithToken(
    token,
    `sessions/${sessionId}/consult-note`,
    "POST",
    options
  );
}

/**
 * Generate consult note using a custom JSON template
 * @param {HeidiAPIClient} client - The API client instance
 * @param {string} token - JWT token
 * @param {string} sessionId - Session ID
 * @param {Object} customTemplate - Custom JSON template
 * @returns {Promise<Object>} Generated note response
 */
export async function generateConsultNoteWithCustomTemplate(
  client,
  token,
  sessionId,
  customTemplate
) {
  return client.requestWithToken(
    token,
    `sessions/${sessionId}/client-customised-template/response`,
    "POST",
    customTemplate
  );
}

export async function getNote(client, noteId) {
  return client.request(`/notes/${noteId}`);
}
