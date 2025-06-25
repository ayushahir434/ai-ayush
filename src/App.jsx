import React, { useContext } from "react";
import PropTypes from "prop-types";
import "./App.css";
import { CiMicrophoneOn } from "react-icons/ci";
import speakimg from "../public/speak.gif";
import va from "../public/ai.png";
import { datacontext } from "./context/UserContext";

function App() {
  const { recognition, speaking, setSpeaking, prompt } = useContext(datacontext);

  return (
    <div className="main">
      <img src={va} alt="Virtual Assistant" id="shifra" />
      <span>I'm Shifra, Your Advanced Virtual Assistant</span>

      {!speaking ? (
        <button
          onClick={() => {
            setSpeaking(true);
            recognition.start();
          }}
        >
          Click here <CiMicrophoneOn />
        </button>
      ) : (
        <div className="response"> {/* ✅ Fixed typo from "responnse" to "response" */}
          <img src={speakimg} alt="Speaking animation" id="speakimg" />
          <p>{prompt}</p>
        </div>
      )}
    </div>
  );
}

export default App;
