"use client";

import { useState, useEffect } from "react";
import { useHeidiApi } from "../../hooks/useHeidiApi";

export default function UiChat() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [recordingId, setRecordingId] = useState(null);
    const [transcript, setTranscript] = useState("");
    const [status, setStatus] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [consultationNotes, setConsultationNotes] = useState("");
    const [noteTemplates, setNoteTemplates] = useState([]);

    // Hardcoded session ID
    const sessionId = "145247102438794386636596225015635472634";

    // Hardcoded authentication values
    const hardcodedEmail = "test@example.com";
    const hardcodedThirdPartyId = "test-user-123";

    // Get API key from environment variable
    const apiKey = process.env.NEXT_PUBLIC_HEIDI_API_KEY;
    const heidiApi = useHeidiApi(apiKey);

    // Automatic authentication on component mount
    useEffect(() => {
        const autoAuthenticate = async () => {
            if (apiKey && !heidiApi.isAuthenticated) {
                try {
                    setStatus("Authenticating automatically...");
                    const authResult = await heidiApi.authenticate(hardcodedEmail, hardcodedThirdPartyId);
                    console.log("Authentication result:", authResult);
                    setIsAuthenticated(true);
                    setStatus("Authentication successful!");
                } catch (error) {
                    console.error("Authentication error:", error);
                    setStatus(`Authentication failed: ${error.message}`);
                }
            }
        };

        autoAuthenticate();
    }, [apiKey, heidiApi, isAuthenticated]);

    // Retrieve transcript after authentication is complete
    useEffect(() => {
        const retrieveTranscript = async () => {
            if (heidiApi.isAuthenticated && !transcript) {
                try {
                    setStatus("Checking for existing transcript...");
                    console.log("Attempting to retrieve transcript for session:", sessionId);
                    console.log("Hook authentication state:", heidiApi.isAuthenticated);
                    console.log("Hook token state:", heidiApi.token);

                    const transcriptData = await heidiApi.getSessionTranscript(sessionId);
                    console.log("Existing transcript data:", transcriptData);
                    console.log("Transcript data type:", typeof transcriptData);
                    console.log("Transcript data keys:", Object.keys(transcriptData || {}));

                    // Handle different possible response structures for transcript
                    const transcriptText =
                        transcriptData?.text ||
                        transcriptData?.transcript ||
                        transcriptData?.content ||
                        transcriptData?.data?.text ||
                        transcriptData?.data?.transcript ||
                        transcriptData;

                    console.log("Extracted transcript text:", transcriptText);
                    console.log("Transcript text length:", transcriptText?.length);

                    if (transcriptText && transcriptText !== "No transcript available" && transcriptText.length > 0) {
                        setTranscript(transcriptText);
                        setStatus("Existing transcript loaded successfully!");
                    } else {
                        console.log("No valid transcript text found");
                        setStatus("Authentication successful! No existing transcript found.");
                    }
                } catch (transcriptError) {
                    console.error("Error retrieving transcript:", transcriptError);
                    console.error("Error details:", transcriptError.message);
                    setStatus(`Authentication successful! Error retrieving transcript: ${transcriptError.message}`);
                }
            }
        };

        retrieveTranscript();
    }, [heidiApi.isAuthenticated, transcript, sessionId, heidiApi]);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("audio/")) {
            setSelectedFile(file);
            setStatus(`File selected: ${file.name}`);
        } else {
            setStatus("Please select a valid audio file");
        }
    };

    const handleGetTemplates = async () => {
        try {
            setStatus("Getting consultation note templates...");
            const templates = await heidiApi.getTemplates();
            console.log("Note templates:", templates);
            setNoteTemplates(templates.templates || templates || []);
            setStatus("Templates loaded successfully!");
        } catch (error) {
            console.error("Error getting templates:", error);
            setStatus(`Failed to get templates: ${error.message}`);
        }
    };

    const handleGenerateNote = async () => {
        if (!noteTemplates.length) {
            setStatus("Please get templates first");
            return;
        }

        try {
            setStatus("Generating consultation note...");
            const note = await heidiApi.generateNote(sessionId, {
                template_id: noteTemplates[0].id || noteTemplates[0]._id,
                voice_style: "GOLDILOCKS",
                brain: "LEFT",
            });
            console.log("Generated note:", note);
            setConsultationNotes(note.note || note.content || note.text || note);
            setStatus("Consultation note generated successfully!");
        } catch (error) {
            console.error("Error generating note:", error);
            setStatus(`Failed to generate note: ${error.message}`);
        }
    };

    const handleUploadAudio = async () => {
        if (!selectedFile) {
            setStatus("Please select a file first");
            return;
        }

        try {
            setUploadProgress(0);
            setStatus("Starting transcription...");

            // Initialize transcription
            const transcription = await heidiApi.startTranscription(sessionId);
            console.log("Transcription initialization response:", transcription);

            // Handle different possible response structures for recording ID
            const recordingId =
                transcription?.id || transcription?.recording_id || transcription?.recordingId || transcription;
            setRecordingId(recordingId);
            setUploadProgress(20);
            setStatus("Transcription initialized, uploading audio... (This may take a few minutes for large files)");

            // Upload audio file
            await heidiApi.uploadAudio(sessionId, recordingId, selectedFile, 0);
            setUploadProgress(60);
            setStatus("Audio uploaded, finishing transcription...");

            // Finish transcription
            await heidiApi.endTranscription(sessionId, recordingId);
            setUploadProgress(80);
            setStatus("Transcription completed! Waiting for processing...");

            // Wait a moment for the transcription to be processed
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setStatus("Retrieving transcript...");

            // Get transcript
            const transcriptData = await heidiApi.getSessionTranscript(sessionId);
            console.log("Transcript data response:", transcriptData);

            // Handle different possible response structures for transcript
            const transcriptText =
                transcriptData?.text ||
                transcriptData?.transcript ||
                transcriptData?.content ||
                transcriptData?.data?.text ||
                transcriptData?.data?.transcript ||
                transcriptData;

            console.log("Extracted transcript text:", transcriptText);

            if (transcriptText && transcriptText !== "No transcript available") {
                setTranscript(transcriptText);
                setUploadProgress(100);
                setStatus("Transcript retrieved successfully!");
            } else {
                setTranscript("No transcript available - check console for details");
                setUploadProgress(100);
                setStatus("Transcript retrieval completed but no text found");
            }
        } catch (error) {
            console.error("Upload error details:", error);
            setUploadProgress(0);
            setStatus(`Upload failed: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Heidi API Audio Session</h1>

                {/* Session Info */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Session Information</h2>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-800">
                            <strong>Session ID:</strong> {sessionId}
                        </p>
                        <p className="text-sm text-blue-800 mt-1">
                            <strong>Authentication:</strong>{" "}
                            {isAuthenticated ? "✅ Authenticated" : "⏳ Authenticating..."}
                        </p>
                    </div>
                </div>

                {/* Audio Upload Section */}
                {isAuthenticated && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Audio Upload</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Audio File
                                </label>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleFileSelect}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {selectedFile && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <p className="text-sm text-blue-800">
                                        <strong>Selected:</strong> {selectedFile.name} (
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                    {selectedFile.size / 1024 / 1024 > 10 && (
                                        <p className="text-sm text-orange-600 mt-1">
                                            ⚠️ Large file detected. Upload may take several minutes.
                                        </p>
                                    )}
                                </div>
                            )}
                            <button
                                onClick={handleUploadAudio}
                                disabled={heidiApi.loading || !selectedFile}
                                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {heidiApi.loading ? "Processing..." : "Upload & Transcribe"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Status Section */}
                {status && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Status</h2>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                            <p className="text-sm text-gray-800 mb-3">{status}</p>
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Transcript Section */}
                {transcript && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Transcript</h2>
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">{transcript}</p>
                        </div>
                    </div>
                )}

                {/* Consultation Notes Section */}
                {isAuthenticated && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Consultation Notes</h2>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <button
                                    onClick={handleGetTemplates}
                                    disabled={heidiApi.loading}
                                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {heidiApi.loading ? "Loading..." : "Get Templates"}
                                </button>
                                <button
                                    onClick={handleGenerateNote}
                                    disabled={heidiApi.loading || !noteTemplates.length}
                                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {heidiApi.loading ? "Generating..." : "Generate Note"}
                                </button>
                            </div>

                            {noteTemplates.length > 0 && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <p className="text-sm text-blue-800">
                                        <strong>Templates Available:</strong> {noteTemplates.length}
                                    </p>
                                    <p className="text-sm text-blue-600 mt-1">
                                        Using template: {noteTemplates[0].name || noteTemplates[0].title || "Default"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Consultation Notes Display */}
                {consultationNotes && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Generated Consultation Note</h2>
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                            <div className="text-sm text-gray-800 whitespace-pre-wrap">{consultationNotes}</div>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {heidiApi.error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
                        <p className="text-sm text-red-800">
                            <strong>Error:</strong> {heidiApi.error}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
