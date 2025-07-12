// utils.js - Helper functions

/**
 * Validates required parameters
 * @param {Object} params - Parameters to validate
 * @param {string[]} required - Array of required parameter names
 * @throws {Error} If any required parameter is missing
 */
function validateRequiredParams(params, required) {
  const missing = required.filter((param) => !params[param]);
  if (missing.length > 0) {
    throw new Error(`Missing required parameters: ${missing.join(", ")}`);
  }
}

/**
 * Voice style options for note generation
 */
const VOICE_STYLES = {
  GOLDILOCKS: "GOLDILOCKS",
  DETAILED: "DETAILED",
  BRIEF: "BRIEF",
  SUPER_DETAILED: "SUPER_DETAILED",
};

/**
 * Brain options for note generation
 */
const BRAIN_OPTIONS = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

/**
 * Content types for Ask Heidi
 */
const CONTENT_TYPES = {
  MARKDOWN: "MARKDOWN",
  HTML: "HTML",
};

/**
 * HTTP methods
 */
const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

export {
  validateRequiredParams,
  VOICE_STYLES,
  BRAIN_OPTIONS,
  CONTENT_TYPES,
  HTTP_METHODS,
};
