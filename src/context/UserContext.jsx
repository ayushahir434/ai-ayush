import React, { createContext, useState } from "react";
import run from "../gemini";

export const datacontext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState("Listening...");

  // Function to speak text using Web Speech API
  function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.volume = 1;
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.lang = "hi-IN"; // Use "hi-IN" for Hindi (India), "hi-GB" is uncommon
    window.speechSynthesis.speak(text_speak);
  }

  
// Function to get AI response and speak it
  async function aiResponse(inputPrompt) {
    try {
      const response = await run(inputPrompt);

      // Clean and personalize the response
      const cleanedText = response
        .replace(/\*\*/g, '')  // Remove bold markdown
        .replace(/\*/g, '')    // Remove italics markdown
        .replace(/google/gi, 'Ayush Ladumor'); // Replace all forms of "google"

      setPrompt(cleanedText);
      speak(cleanedText);

      // Stop speaking state after 5 seconds
      setTimeout(() => {
        setSpeaking(false);
      }, 5000);

    } catch (error) {
      console.error("Error in aiResponse:", error);
      speak("Something went wrong while generating a response.");
      setSpeaking(false);
    }
  }

  // Setup Speech Recognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.onresult = (e) => {
    const currentIndex = e.resultIndex;
    const transcript = e.results[currentIndex][0].transcript;
    setPrompt(transcript);
    aiResponse(transcript);
  };

  const value = {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
  };

  return (
    <datacontext.Provider value={value}>
      {children}
    </datacontext.Provider>
  );
}

export default UserContext;
