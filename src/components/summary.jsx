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

const Summary = () => {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [summary, setSummary] = useState([]);
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
      setLoading(true);
      setError("");
      try {
        // 1. Get the consult note from Heidi API
        // const note = await heidiApi.getConsultNoteHeidiTestAuth(sessionId);
        // setConsultNote(note);
        // const transcript = await heidiApi.getTranscriptHeidiTestAuth(sessionId);
        const transcript =
          "So, what brought you in today? Sure. Um, I'm just having a lot of chest pain, um, and so I thought I should get it checked out. Okay. Uh, and before we, uh, start, could you, um, remind me of your, uh, gender and age? Sure. Um, 39, uh, I'm a male. Okay. Um, and so when did this chest pain start? Um, it started last night, uh, but it's becoming sharper. Okay. And, uh, where is this pain located? Uh, it's located on the left side of my chest. Okay. And, um, so how long has it been going on for, then, if it started, uh, last night? Uh, so, I guess it would be a couple of hours now, maybe like, eight? Yeah. Okay. Um, has it been constant throughout that time, or, um, or changing? Uh, I would say it's been pretty constant, yeah. Okay. And how would you, uh, describe the pain? Um, people will use words sometimes like sharp, burning, achy... Hmm, I'd say it's pretty sharp, yeah. Sharp, okay. Um, anything that you, uh, have done, tried, um, since last night that's made the pain better? Um, not laying down helps. Okay, so do you find laying down makes the pain worse? Yes, definitely. Okay. Um, do you find that the pain, um, is radiating anywhere? Hmm, no. Okay. And is there anything else that makes the pain worse besides, uh, laying down? Not that I've noticed, no. Okay. So not like taking a deep breath or, uh, anything like that? Hmm, maybe taking a deep breath, yeah. Okay. And, um, when the pain started, could you, um, tell me, uh, could you think of anything that you were doing at the time? Hmm, I mean, I was moving some furniture around, but, that, I've done that before. Okay, so you didn't feel, uh, like you, you hurt yourself, um, when you were doing that? No. Okay. And, uh, in regards to how severe the pain is, on a scale of 1 to 10, 10 being the, uh, worst pain you've ever felt, how severe would you say the pain is? I'd say it's like a seven or eight, it's pretty bad. Okay. Um, and with the pain, do you have any other, uh, associated symptoms? Uh, I feel a little lightheaded, and I'm having some trouble breathing. Okay. Um, um, have you, uh, had any, um, loss of consciousness? No. Okay. Um, have you been experiencing any, uh, like racing of the heart? Um, a little bit, yeah. Okay. Um, do you, and, uh, have you been, um, sweaty at all? Um, just from the short- just from having issues breathing. Okay. Have you been having issues breathing since, uh, the pain started? Yes. Okay. Um, and, uh, recently have you had any, uh, periods of time where you, um, like, have been immobilized or, or you haven't been, um, like, able to move around a lot? No, no. Okay. Um, and, um, have you been feeling sick at all, any infectious symptoms? No. Okay. Have you had any nausea or vomiting? No. Any fevers or, or chills? No. Okay. Uh, how about any abdominal pain? No. Any, uh, urinary problems? No. Or bowel problems? Mmm-mmm. Okay. Um, have you had a cough? No. Okay. Um, and you haven't brought up any blood with the cough? No. Okay. And, uh, have you had a wheeze, uh, with your difficulty breathing? Mmm, no, not that I've heard. Okay. Any changes, um, to the, like, breath sounds at all, like any noisy breathing? No. Well, I guess if I, when I'm really having trouble breathing, yeah. Okay. Um, has anything like this ever happened to you before? No. No. Okay. Um, and, um, have you, have you had any, uh, night sweats? No. Alright. And then how about any rashes or skin changes? Uh, no rashes, but I guess like my, um, neck seems to be a little swollen. Okay. Um, do you have any neck pain? No. Okay. Have you had any, um, like accidents, like a, like a car accident or anything where you really jerked your neck? No. Okay. Um, any, any trauma at all to the chest or, or back? No, no. Okay. Um, so, just in regards to past medical history, um, do you have any, uh, prior medical conditions? No. Okay. Um, any, uh, recent hospitalizations? No. Okay. Any, uh, prior surgeries? No. Okay. Do you take any medications regularly, either prescribed or over-the-counter? No. Alright. How about any allergies to medications? Nah, none. Alright. Uh, any immunizations or are they up to date? They're all up to date. Excellent. Um, alright. And, could you tell me, uh, a little bit about your, uh, living situation currently? Sure. I live in an apartment, um, by myself. Uh... yeah, that's about it. Okay. Um, and, uh, how do you support yourself, uh, financially? Uh, I'm an accountant. Okay, sounds like a, a pretty stressful job, um, or that it, it can be. Um, do you, uh, smoke cigarettes? I do. Okay. And how much do you smoke? Uh, I smoke about a pack a day. Okay. Uh, how long have you been smoking for? For the past 10 to 15 years. Okay. And do you smoke, uh, cannabis? Uh, sometimes. Um, how much, uh, marijuana would you smoke, um, per, per week? Per week? Uh, maybe about 5 milligrams, not that much. Okay. Um, and, uh, do you use any other recreational drugs, like cocaine, crystal meth, um, opioids? No. Okay. Um, have you used IV drugs before? No. Okay. Um, and do you drink alcohol? I do. Okay. How much alcohol do you, uh, drink, um, each week? Um, about... I'd say I, uh, I'd have like one or two drinks a day, so about 10 drinks a week. Okay. Um, and, um, right. And then briefly, could you tell me a little bit about your, uh, like, diet and exercise? Sure. Um, I try to eat healthy for dinner at least, but most of my lunches are, um, I eat, I eat out. Um, and then in terms of exercise, I try to exercise every other day. I run for about half an hour. Okay. Well, that's great that you've been, uh, working on the, the, um, activity and the diet as well. Um, so, uh, has anything like this happened in your family before? No. Okay. Has anybody in the family had a heart attack before? Um, actually, yes, my father had a heart attack when he was 45. Okay. And, and anybody in the family have, uh, cholesterol problems? Mmm, I think my father did. I see, okay. And how about anybody in the family have, uh, a stroke? No strokes. Okay. And then, um, any cancers in the family? No. Okay. Um, is, was there anything else that you wanted to, um, tell me about today that, that I, on, on history? Uh, no, I don't think so. I think you asked me everything.";
        setTranscript(transcript);

        // 2. First Groq call: Summarize the data
        const groqRes = await fetch("/api/groq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: transcript,
            model: "llama-3.1-8b-instant",
            temperature: 0.1, // Controls randomness: lower is more focused, higher is more creative
            systemInstruction:
              "Summarize the following medical consult note in bullet points in a way that is easy to understand for a person without a medical background. The summary will be read by the patient so do not mention them in the third person, with each bullet point separated by a #. Do not include any other text or formatting. Make it only 5 bullet points long.",
          }),
        });
        const groqData = await groqRes.json();
        if (!groqRes.ok)
          throw new Error(groqData.error || "Groq summary failed");

        // 3. Set up initial chat messages: summary as assistant, then user can chat
        setSummary(groqData.answer.split("#"));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

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
      You are talking to the patient, not the doctor so don't refernece the patient in third person.

      Critical Rules:
      1. Do not guess, infer, or hallucinate any information. Only use what is directly stated or clearly implied in the transcript or notes.
      2. Do not provide medical advice, triage recommendations, or emergency guidance. The user has already visited a doctor — your role is to clarify and reflect information, not give care directions.
      3. If a patient question cannot be answered based on the consultation notes, respond with: "I’m only able to provide information discussed during your consultation. Please contact your doctor for anything new or not covered."
      4. Use layman's terms. When explaining medical terms (e.g. "troponin", "pericarditis"), keep explanations brief and accessible to a general audience.
      5. Reiterate what the doctor said clearly and respectfully. You may paraphrase or summarise, but never fabricate.
      6. If medication, dosage, or next steps were mentioned, state them clearly. Include dosage and timing only if explicitly noted in the transcript.
      7. Include a short disclaimer in your response if you are unsure or confused: "This information is based only on your consultation. If your symptoms change or you need further support, please follow up with your doctor."
      8. Return the response in normal text format.
      9. Limit the response to 300 words.

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
          temperature: 0.1, // Controls randomness: lower is more focused, higher is more creative
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
    <Box className="h-full flex flex-col">
      {/* Fixed header content */}
      <Box className="flex-shrink-0">
        <Text
          color="#64748B"
          fontSize="2rem"
          fontWeight={500}
          lineHeight="2.5rem"
          letterSpacing="-0.04688rem"
          className="font-roboto"
        >
          {`We're here to help you with your health journey`}
        </Text>
        <Text
          color="#64748B"
          fontSize="1rem"
          fontWeight={300}
          lineHeight="1.375rem"
          width="57.25rem"
          className="font-roboto"
        >
          {
            "It's your personal guide, helping you easily track treatments, understand complex medical information, and stay connected with your care team."
          }
        </Text>
        <Text fontWeight="bold" mt={4} mb={2} className="font-roboto">
          Summary of your consult:
        </Text>
      </Box>

      {/* Scrollable chat area */}
      <Box className="flex-1 flex flex-col min-h-0">
        <Box
          bg="#FFFFFF"
          borderRadius="lg"
          p={4}
          mb={4}
          position="relative"
          className="flex-1 overflow-y-auto"
        >
          {/* Show loading or error */}
          {loading && <Text className="font-roboto">Loading summary...</Text>}
          {error && (
            <Text color="red.500" className="font-roboto">
              {error}
            </Text>
          )}
          <Box as="ul" pl={6} mb={6}>
            {summary.map(
              (msg, idx) =>
                msg.trim() && (
                  <Text
                    as="li"
                    key={idx}
                    color="#020817"
                    fontSize="1rem"
                    fontWeight={400}
                    mb={1}
                    style={{ listStyleType: "disc" }}
                    className="font-roboto"
                  >
                    {msg.trim()}
                  </Text>
                )
            )}
          </Box>
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
                bg={msg.role === "user" ? "#F3F3F3" : "#FFFFFF"}
                color={msg.role === "user" ? "#000000" : "#020817"}
                fontSize="1rem"
                fontWeight={400}
                whiteSpace="pre-wrap"
                className="font-roboto"
              >
                {msg.content}
              </Box>
            </Box>
          ))}
          <div ref={chatEndRef} />
        </Box>

        {/* Fixed chat input bar */}
        <Box
          bg="#FFFFFF"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          px={4}
          py={3}
          zIndex={1}
          className="flex-shrink-0"
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
              className="font-roboto"
              color="#64748B"
              _placeholder={{ color: "#64748B", className: "font-roboto" }}
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
            className="font-roboto"
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
