import axios from "axios";
import { BASE_URL } from "./config.js";

class HeidiAPIClient {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    this.apiKey = apiKey;

    // Create axios instance with base configuration
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      timeout: 30000, // 30 second timeout
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Extract error message from axios error
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "API request failed";
        throw new Error(message);
      }
    );
  }

  // Make request with API key (for authentication)
  async requestWithApiKey(
    endpoint,
    method = "GET",
    data = null,
    params = null
  ) {
    const config = {
      method,
      url: endpoint,
      headers: {
        "Heidi-Api-Key": this.apiKey,
      },
      params,
    };

    if (data && method !== "GET") {
      config.data = data;
    }

    const response = await this.axiosInstance(config);
    return response.data;
  }

  // Make request with JWT token (for all other endpoints)
  async requestWithToken(token, endpoint, method = "GET", data = null) {
    const config = {
      method,
      url: endpoint,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (data && method !== "GET") {
      config.data = data;
    }

    const response = await this.axiosInstance(config);
    return response.data;
  }

  // Make multipart request for file uploads
  async requestMultipart(token, endpoint, formData) {
    const config = {
      method: "POST",
      url: endpoint,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };

    const response = await this.axiosInstance(config);
    return response.data;
  }
}

export default HeidiAPIClient;
