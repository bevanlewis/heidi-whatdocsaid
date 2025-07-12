This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Heidi API Wrapper

A comprehensive JavaScript wrapper for the [Heidi Health API](https://www.heidihealth.com/developers/heidi-api/overview) built with Next.js and Axios.

## Features

- **Complete API Coverage**: All major Heidi API endpoints including authentication, sessions, transcription, notes, and Ask Heidi
- **Axios-Based**: Uses Axios for better request handling, automatic JSON parsing, and improved error handling
- **React Integration**: Custom hooks for easy React component integration
- **Error Handling**: Comprehensive error handling with detailed error messages and automatic retry logic
- **File Upload Support**: Multipart form data support for audio transcription
- **TypeScript-like Documentation**: JSDoc comments for better IDE support
- **Request Timeouts**: 30-second timeout for all requests to prevent hanging

## Project Structure

```
src/
├── lib/heidi-api/
│   ├── client.js          # Main API client class (Axios-based)
│   ├── config.js          # API configuration and constants
│   ├── utils.js           # Helper functions and constants
│   └── endpoints/
│       ├── index.js       # Export all endpoint modules
│       ├── authentication.js # JWT token management
│       ├── sessions.js    # Session CRUD operations
│       ├── transcription.js # Audio transcription workflow
│       ├── notes.js       # Consult note generation
│       └── ask.js         # Ask Heidi AI assistant
├── hooks/
│   └── useHeidiApi.js     # React hook for API integration
└── app/
    └── api-example/       # Example usage page
        └── page.js
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

The wrapper uses **Axios** for HTTP requests, which provides:

- Automatic JSON parsing
- Better error handling
- Request/response interceptors
- Built-in timeout support
- Automatic request/response transformations

### 2. Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_HEIDI_API_KEY=your_heidi_api_key_here
```

### 3. Basic Usage

#### Using the Client Directly

```javascript
import HeidiAPIClient from "./lib/heidi-api/client.js";
import { getJWTToken } from "./lib/heidi-api/endpoints/authentication.js";
import { createSession } from "./lib/heidi-api/endpoints/sessions.js";

// Initialize client
const client = new HeidiAPIClient("your-api-key");

// Authenticate
const authResult = await getJWTToken(client, "user@example.com", "user-id");
const token = authResult.token;

// Create session
const session = await createSession(client, token);
console.log("Session ID:", session.session_id);
```

#### Using the React Hook

```javascript
import { useHeidiApi } from "./hooks/useHeidiApi";

function MyComponent() {
  const heidiApi = useHeidiApi(process.env.NEXT_PUBLIC_HEIDI_API_KEY);

  const handleAuth = async () => {
    try {
      await heidiApi.authenticate("user@example.com", "user-id");
      console.log("Authenticated!");
    } catch (error) {
      console.error("Auth failed:", error);
    }
  };

  return (
    <div>
      <button onClick={handleAuth} disabled={heidiApi.loading}>
        {heidiApi.loading ? "Authenticating..." : "Authenticate"}
      </button>
      {heidiApi.isAuthenticated && <p>✓ Authenticated</p>}
    </div>
  );
}
```

## API Reference

### Authentication

```javascript
// Get JWT token
const result = await getJWTToken(client, email, thirdPartyInternalId);
```

### Sessions

```javascript
// Create new session
const session = await createSession(client, token);

// Get session details
const details = await getSession(client, token, sessionId);

// Update session
const updated = await updateSession(client, token, sessionId, {
  duration: 60,
  patient: { name: "John Doe", gender: "MALE" },
});
```

### Transcription

```javascript
// Initialize transcription
const recording = await initializeTranscription(client, token, sessionId);

// Upload audio chunk
await uploadAudioChunk(client, token, sessionId, recordingId, audioFile, 0);

// Finish transcription
await finishTranscription(client, token, sessionId, recordingId);

// Get transcript
const transcript = await getTranscript(client, token, sessionId);
```

### Notes

```javascript
// Get available templates
const templates = await getConsultNoteTemplates(client, token);

// Generate note
const note = await generateConsultNote(client, token, sessionId, {
  template_id: "template-id",
  voice_style: "GOLDILOCKS",
  brain: "LEFT",
});
```

### Ask Heidi

```javascript
// Ask Heidi AI
const response = await askHeidi(
  client,
  token,
  sessionId,
  "Summarize this text",
  "Patient complained of headaches...",
  "MARKDOWN"
);
```

## Constants

The wrapper provides helpful constants for API options:

```javascript
import {
  VOICE_STYLES,
  BRAIN_OPTIONS,
  CONTENT_TYPES,
  HTTP_METHODS,
} from "./lib/heidi-api/utils.js";

// Voice styles: GOLDILOCKS, DETAILED, BRIEF, SUPER_DETAILED
// Brain options: LEFT, RIGHT
// Content types: MARKDOWN, HTML
// HTTP methods: GET, POST, PUT, PATCH, DELETE
```

## Axios Benefits

The wrapper uses Axios instead of fetch for several advantages:

- **Automatic JSON parsing**: No need to call `.json()` on responses
- **Better error handling**: Automatic error throwing for HTTP error status codes
- **Request/Response interceptors**: Centralized error handling and request modification
- **Timeout support**: Built-in request timeout (30 seconds)
- **Request cancellation**: Ability to cancel requests if needed
- **Automatic request body serialization**: JSON.stringify is handled automatically

## Example Application

Visit `/api-example` to see a complete working example with:

- Authentication flow
- Session management
- Template retrieval
- Note generation
- Ask Heidi queries
- Dark mode UI

## Error Handling

The wrapper includes comprehensive error handling with Axios interceptors:

```javascript
try {
  const result = await heidiApi.authenticate(email, userId);
} catch (error) {
  console.error("API Error:", error.message);
  // Axios provides detailed error information
  console.error("Status:", error.response?.status);
  console.error("Data:", error.response?.data);
}
```

## Development

### Running the Development Server

```bash
npm run dev
```

### Testing the API

1. Get your API key from Heidi Health
2. Set it in `.env.local`
3. Navigate to `/api-example`
4. Test the authentication and API calls

## Learn More

- [Heidi API Documentation](https://www.heidihealth.com/developers/heidi-api/overview)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Hooks Guide](https://reactjs.org/docs/hooks-intro.html)

## Contributing

Feel free to submit issues and pull requests to improve this wrapper!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
