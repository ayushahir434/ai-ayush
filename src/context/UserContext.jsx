import React, { createContext, useState } from "react";
import run from "../gemini";

export const datacontext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState("Listening...");

  function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.volume = 1;
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.lang = "hi-IN";
    window.speechSynthesis.speak(text_speak);
  }

  async function aiResponse(inputPrompt) {
    try {
      const lowerPrompt = inputPrompt.toLowerCase();

      const socialLinks = {
        youtube: "https://www.youtube.com",
        instagram: "https://www.instagram.com",
        facebook: "https://www.facebook.com",
        twitter: "https://www.twitter.com",
        x: "https://www.twitter.com",
        whatsapp: "https://web.whatsapp.com",
        linkedin: "https://www.linkedin.com",
        gmail: "https://mail.google.com",
      };

      for (const key in socialLinks) {
        if (
          lowerPrompt.includes(`open ${key}`) ||
          lowerPrompt.includes(`start ${key}`) ||
          lowerPrompt.includes(`${key} kholo`)
        ) {
          speak(`Opening ${key}`);
          window.open(socialLinks[key], "_blank");
          setSpeaking(false);
          return;
        }
      }

      const response = await run(inputPrompt);
      const cleanedText = response
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/google/gi, "Ayush Ladumor");

      setPrompt(cleanedText);
      speak(cleanedText);

      setTimeout(() => {
        setSpeaking(false);
      }, 5000);
    } catch (error) {
      console.error("Error in aiResponse:", error);
      speak("Something went wrong while generating a response.");
      setSpeaking(false);
    }
  }

  // 🎤 Setup speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";

  recognition.onresult = (e) => {
    const currentIndex = e.resultIndex;
    const transcript = e.results[currentIndex][0].transcript;
    setPrompt(transcript);
    aiResponse(transcript);
  };

  // 🛑 Add stop recognition function
  function stopRecognition() {
    recognition.stop();
    setPrompt("Stopped Listening");
    setSpeaking(false);
  }

  const value = {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    stopRecognition, // ⬅ expose stop function
  };

  return <datacontext.Provider value={value}>{children}</datacontext.Provider>;
}

export default UserContext;
