import { useState, useCallback } from "react";
import HeidiAPIClient from "../lib/heidi-api/client.js";
import { getJWTToken } from "../lib/heidi-api/endpoints/authentication.js";
import { createSession, getSession, updateSession } from "../lib/heidi-api/endpoints/sessions.js";
import {
    initializeTranscription,
    uploadAudioChunk,
    finishTranscription,
    getTranscript,
} from "../lib/heidi-api/endpoints/transcription.js";
import { getConsultNoteTemplates, generateConsultNote } from "../lib/heidi-api/endpoints/notes.js";
import { askHeidi } from "../lib/heidi-api/endpoints/ask.js";

export function useHeidiApi(apiKey) {
    const [client] = useState(() => new HeidiAPIClient(apiKey));
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleApiCall = useCallback(async (apiFunction) => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiFunction();
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Authentication
    const authenticate = useCallback(
        async (email, thirdPartyInternalId) => {
            return handleApiCall(async () => {
                const result = await getJWTToken(client, email, thirdPartyInternalId);
                setToken(result.token);
                return result;
            });
        },
        [client, handleApiCall]
    );

    // Sessions
    const createNewSession = useCallback(async () => {
        if (!token) throw new Error("Must authenticate first");
        return handleApiCall(() => createSession(client, token));
    }, [client, token, handleApiCall]);

    const getSessionDetails = useCallback(
        async (sessionId) => {
            if (!token) throw new Error("Must authenticate first");
            return handleApiCall(() => getSession(client, token, sessionId));
        },
        [client, token, handleApiCall]
    );

    const updateSessionDetails = useCallback(
        async (sessionId, sessionData) => {
            if (!token) throw new Error("Must authenticate first");
            return handleApiCall(() => updateSession(client, token, sessionId, sessionData));
        },
        [client, token, handleApiCall]
    );

    // Transcription
    const startTranscription = useCallback(
        async (sessionId) => {
            if (!token) throw new Error("Must authenticate first");
            return handleApiCall(() => initializeTranscription(client, token, sessionId));
        },
        [client, token, handleApiCall]
    );

    const uploadAudio = useCallback(
        async (sessionId, recordingId, audioFile, index) => {
            if (!token) throw new Error("Must authenticate first");
            return handleApiCall(() => uploadAudioChunk(client, token, sessionId, recordingId, audioFile, index));
        },
        [client, token, handleApiCall]
    );

    const endTranscription = useCallback(
        async (sessionId, recordingId) => {
            if (!token) throw new Error("Must authenticate first");
            return handleApiCall(() => finishTranscription(client, token, sessionId, recordingId));
        },
        [client, token, handleApiCall]
    );

    const getSessionTranscript = useCallback(
        async (sessionId) => {
            if (!token) throw new Error("Must authenticate first");
            return handleApiCall(() => getTranscript(client, token, sessionId));
        },
        [client, token, handleApiCall]
    );

    // Notes
    const getTemplates = useCallback(async () => {
        if (!token) throw new Error("Must authenticate first");
        return handleApiCall(() => getConsultNoteTemplates(client, token));
    }, [client, token, handleApiCall]);

    const generateNote = useCallback(
        async (sessionId, noteOptions) => {
            if (!token) throw new Error("Must authenticate first");
            return handleApiCall(() => generateConsultNote(client, token, sessionId, noteOptions));
        },
        [client, token, handleApiCall]
    );

    // Ask Heidi
    const askHeidiAI = useCallback(
        async (sessionId, aiCommandText, content, contentType = "MARKDOWN") => {
            if (!token) throw new Error("Must authenticate first");
            return handleApiCall(() => askHeidi(client, token, sessionId, aiCommandText, content, contentType));
        },
        [client, token, handleApiCall]
    );

    const getToken = useCallback(
        async (email, thirdPartyInternalId) => {
            const result = await getJWTToken(client, email, thirdPartyInternalId);
            return result.token;
        },
        [client, handleApiCall]
    );

    const getTranscriptNoAuth = useCallback(
        async (sessionId, thirdPartyInternalId, email) => {
            const token = await getToken(email, thirdPartyInternalId);
            return handleApiCall(() => getTranscript(client, token, sessionId));
        },
        [client, handleApiCall]
    );

    return {
        // State
        token,
        loading,
        error,
        isAuthenticated: !!token,

        // Methods
        authenticate,
        createNewSession,
        getSessionDetails,
        updateSessionDetails,
        startTranscription,
        uploadAudio,
        endTranscription,
        getSessionTranscript,
        getTemplates,
        generateNote,
        askHeidiAI,
        getTranscriptNoAuth,
    };
}
