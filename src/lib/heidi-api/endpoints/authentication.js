// authentication.js - Authentication related functions

/**
 * Get JWT token for authentication
 * @param {HeidiAPIClient} client - The API client instance
 * @param {string} email - User's email address
 * @param {string} thirdPartyInternalId - EHR User UID
 * @returns {Promise<Object>} JWT token and expiration time
 */
export async function getJWTToken(client, email, thirdPartyInternalId) {
  const params = {
    email,
    third_party_internal_id: thirdPartyInternalId,
  };

  return client.requestWithApiKey("jwt", "GET", null, params);
}
