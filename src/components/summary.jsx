"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Icon,
  Text,
  Box,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import Image from "next/image";
import { useHeidiApi } from "@/hooks/useHeidiApi";
import { useSearchParams } from "next/navigation";

const Summary = () => {
  const heidiApi = useHeidiApi(process.env.NEXT_PUBLIC_HEIDI_API_KEY);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [consultNote, setConsultNote] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // On mount or when sessionId changes, fetch consult note and get Groq summary
  useEffect(() => {
    const fetchSummary = async () => {
      if (!sessionId) {
        setError("No sessionId provided in URL.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        // 1. Get the consult note from Heidi API
        const note = await heidiApi.getConsultNoteHeidiTestAuth(sessionId);
        setConsultNote(note);
        const transcript = await heidiApi.getTranscriptHeidiTestAuth(sessionId);
        setTranscript(transcript);

        // 2. First Groq call: Summarize the data
        const groqRes = await fetch("/api/groq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: note,
            model: "llama-3.1-8b-instant",
            systemInstruction:
              "Summarize the following medical consult note in 2 lines.",
          }),
        });
        const groqData = await groqRes.json();
        if (!groqRes.ok)
          throw new Error(groqData.error || "Groq summary failed");

        // 3. Set up initial chat messages: summary as assistant, then user can chat
        setMessages([{ role: "assistant", content: groqData.answer }]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Handle sending a user message
  const handleSend = async () => {
    if (!inputValue.trim()) return;
    setSending(true);
    setError("");
    // Always start with the system message containing the consult note as context
    const systemMessage = {
      role: "system",
      content: `

      You are a patient-facing medical assistant. Your role is to help patients understand the details of their medical consultation using only the content from the provided doctor's notes or raw transcript (which may be in audio-transcribed form, SOAP format, or H&P format).

      Critical Rules:
      1. Do not guess, infer, or hallucinate any information. Only use what is directly stated or clearly implied in the transcript or notes.
      2. Do not provide medical advice, triage recommendations, or emergency guidance. The user has already visited a doctor — your role is to clarify and reflect information, not give care directions.
      3. If a patient question cannot be answered based on the consultation notes, respond with: "I’m only able to provide information discussed during your consultation. Please contact your doctor for anything new or not covered."
      4. Use layman's terms. When explaining medical terms (e.g. "troponin", "pericarditis"), keep explanations brief and accessible to a general audience.
      5. Reiterate what the doctor said clearly and respectfully. You may paraphrase or summarise, but never fabricate.
      6. If medication, dosage, or next steps were mentioned, state them clearly. Include dosage and timing only if explicitly noted in the transcript.
      7. Always include a short disclaimer in your responses: "This information is based only on your consultation. If your symptoms change or you need further support, please follow up with your doctor."

      Here is the consultation notes: ${consultNote}
      Here is the transcript: ${transcript}`,
    };
    // Build the full message array for Groq: system message + chat history + new user message
    const chatHistory = [
      systemMessage,
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: inputValue },
    ];
    setMessages([...messages, { role: "user", content: inputValue }]);
    setInputValue("");
    try {
      // Second Groq call: Use context and chat history
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          model: "llama-3.1-8b-instant",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  // Handle pressing Enter to send
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sending) handleSend();
    }
  };

  return (
    <Box>
      <Text
        color="#64748B"
        fontFamily="var(--font-family-Font-1, Geist)"
        fontSize="2rem"
        fontWeight={500}
        lineHeight="2.5rem"
        letterSpacing="-0.04688rem"
      >
        {`We're here to help you with your health journey`}
      </Text>
      <Text
        color="#64748B"
        fontFamily="Inter"
        fontSize="1rem"
        fontWeight={300}
        lineHeight="1.375rem"
        width="57.25rem"
      >
        {
          "It's your personal guide, helping you easily track treatments, understand complex medical information, and stay connected with your care team."
        }
      </Text>
      <Text fontWeight="bold" mt={4} mb={2}>
        Summary of your consult:
      </Text>

      <Box bg="#FFFFFF" borderRadius="lg" p={4} mb={4} position="relative">
        {/* Show loading or error */}
        {loading && <Text>Loading summary...</Text>}
        {error && <Text color="red.500">{error}</Text>}

        {/* Chat area */}
        <Box
          bg="#F3F3F3"
          borderRadius="lg"
          p={4}
          mb={4}
          maxW="600px"
          mx="auto"
          boxShadow="sm"
          mt={6}
          minHeight="200px"
        >
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              mb={3}
              display="flex"
              justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}
            >
              <Box
                px={4}
                py={2}
                borderRadius="lg"
                maxW="70%"
                bg={msg.role === "user" ? "#3182ce" : "#e2e8f0"}
                color={msg.role === "user" ? "#fff" : "#222"}
                fontFamily="Inter"
                fontSize="1rem"
                fontWeight={400}
                whiteSpace="pre-wrap"
              >
                {msg.content}
              </Box>
            </Box>
          ))}
          <div ref={chatEndRef} />
        </Box>

        {/* Chat input bar */}
        <Box
          position="sticky"
          bottom={0}
          left={0}
          width="100%"
          bg="#F3F3F3"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          px={4}
          py={3}
          mt={8}
          zIndex={1}
        >
          <InputGroup alignItems="center">
            <InputLeftElement
              pointerEvents="none"
              display="flex"
              alignItems="center"
              height="100%"
            >
              <Image
                src="/chat.svg"
                alt="Chat"
                width={24}
                height={24}
                style={{ display: "block" }}
              />
            </InputLeftElement>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask WhatDocSaid about your consultation"
              variant="unstyled"
              fontSize="1rem"
              fontFamily="Inter"
              color="#64748B"
              _placeholder={{ color: "#64748B" }}
              pl="2.5rem"
              height="2.5rem"
              isDisabled={sending || loading}
            />
          </InputGroup>
          <Button
            bg="#000000"
            borderRadius="md"
            fontWeight={500}
            px={3}
            py={2}
            minW={0}
            height="2.5rem"
            ml={2}
            isDisabled={inputValue === "" || sending || loading}
            _hover={inputValue === "" ? { bg: "#000000" } : { bg: "#222" }}
            _disabled={{ bg: "#000000", cursor: "not-allowed", opacity: 0.5 }}
            onClick={handleSend}
          >
            <img
              src="/arrow.svg"
              alt="Send"
              width={16}
              height={16}
              style={{ display: "block" }}
            />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Summary;
