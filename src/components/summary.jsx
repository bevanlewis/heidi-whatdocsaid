"use client";
import React, { useState } from "react";
import { Icon } from "@chakra-ui/react";
import { Text, Box, Input, Button, InputGroup, InputLeftElement } from "@chakra-ui/react";
import Image from "next/image";

const Summary = () => {
  const [name, setName] = useState("");
  const [treatments, setTreatments] = useState("");
  const [summary, setSummary] = useState("");
  const [inputValue, setInputValue] = useState("");

  return (
    <Box>
      <Text
        color="#64748B"
        fontFamily="var(--font-family-Font-1, Geist)"
        fontSize="2rem"
        fontStyle="normal"
        fontWeight="var(--font-weight-500, 500)"
        lineHeight="2.5rem"
        letterSpacing="var(--letter-spacing--0_75, -0.04688rem)"
      >
        {`We're here to help you with your health journey ${name}`}
      </Text>
      <Text
        color="#64748B"
        fontFamily="Inter"
        fontSize="1rem"
        fontStyle="normal"
        fontWeight={300}
        lineHeight="1.375rem"
        width="57.25rem"
      >
        {"It's your personal guide, helping you easily track treatments, understand complex medical information, and stay connected with your care team."}
      </Text>
      <Text fontWeight="bold" mt={4} mb={2}>
        Summary of your consult:
      </Text>

      <Box
        bg="#FFFFFF"
        borderRadius="lg"
        p={4}
        mb={4}
        position="relative"
      >
        <Text>
          - The patient, a 39-year-old male, experienced sharp chest pain on the left side starting the previous night.
          - The pain has been constant and worsens when laying down or taking a deep breath.
          - Associated symptoms include lightheadedness, difficulty breathing, and a slight racing of the heart.
          - The patient is a smoker and consumes a moderate amount of alcohol.
          - His father had a heart attack at 45 and may have had cholesterol problems.
          - The patient has no prior medical conditions, hospitalizations, or surgeries.
          - He does not take any medications regularly and has no allergies to medications.
          - His immunizations are up to date.
          - He lives in an apartment, works as an accountant, and exercises regularly.
        </Text>

        <Box
          bg="#F3F3F3"
          borderRadius="lg"
          p={4}
          mb={4}
          maxW="400px"
          ml="auto"
          boxShadow="sm"
          mt={6}
        >
          <Text color="#000000" fontFamily="Inter" fontSize="1rem" fontWeight={400}>
            Remind me again what my treatment is
          </Text>
        </Box>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>
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
                <Image src="/chat.svg" alt="Chat" width={24} height={24} style={{ display: 'block' }} />
              </InputLeftElement>
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Ask WhatDocSaid about your consultation"
              variant="unstyled"
              fontSize="1rem"
              fontFamily="Inter"
              color="#64748B"
              _placeholder={{ color: "#64748B" }}
              pl="2.5rem"
              height="2.5rem"
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
            isDisabled={inputValue === ""}
            _hover={inputValue === "" ? { bg: "#000000" } : { bg: "#222" }}
            _disabled={{ bg: "#000000", cursor: "not-allowed", opacity: 0.5 }}
          >
            <img src="/arrow.svg" alt="Send" width={16} height={16} style={{ display: 'block' }} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Summary;