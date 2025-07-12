"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useHeidiApi } from "../../hooks/useHeidiApi";

export default function NoAuthTranscript() {
    const apiKey = process.env.NEXT_PUBLIC_HEIDI_API_KEY;
    const heidiApi = useHeidiApi(apiKey);

    const [transcript, setTranscript] = useState("");
    const [consultNote, setConsultNote] = useState("");

    // Get parameters from URL
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("sessionId");
    console.log(sessionId);

    useEffect(() => {
        const fetchTranscript = async () => {
            if (!sessionId) {
                return;
            }

            try {
                const transcriptData = await heidiApi.getTranscriptHeidiTestAuth(sessionId);
                const sessionDetail = await heidiApi.getConsultNoteHeidiTestAuth(sessionId);

                setConsultNote(sessionDetail);

                // Handle different possible response structures
                const transcriptText =
                    transcriptData?.text ||
                    transcriptData?.transcript ||
                    transcriptData?.content ||
                    transcriptData?.data?.text ||
                    transcriptData?.data?.transcript ||
                    transcriptData;

                if (transcriptText && transcriptText !== "No transcript available") {
                    setTranscript(transcriptText);
                }
            } catch (err) {}
        };

        fetchTranscript();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    {transcript ? (
                        <div>
                            <h2 className="text-lg font-semibold mb-3">Transcript</h2>
                            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                                <div className="text-gray-800 whitespace-pre-wrap">{transcript}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Loading transcript...</p>
                        </div>
                    )}
                    {consultNote && (
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold mb-3">Consultation Note</h2>
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <div className="text-gray-800 whitespace-pre-wrap">{consultNote}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
