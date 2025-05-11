import React, { useState, useRef } from 'react';
import './index.css';

const SpeechToTextApp = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  const initializeRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return null;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + text + ' ');
        } else {
          interimTranscript += text;
        }
      }
    };

    recognition.onerror = (e) => console.error('Speech recognition error:', e.error);

    return recognition;
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeRecognition();
    }
    recognitionRef.current?.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  const downloadTranscript = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transcript.txt';
    link.click();
  };

  return (
    <div className="app-container">
      <div className="content">
        <h1 className="title">🗣️ Speech to Text Converter</h1>

        <textarea
          value={transcript}
          readOnly
          placeholder="Your speech will appear here..."
          className="transcript-box"
        />

        <div className="button-group">
          {!isListening ? (
            <button onClick={startListening} className="start-button">🎙️ Start Listening</button>
          ) : (
            <button onClick={stopListening} className="stop-button">🛑 Stop</button>
          )}
          <button onClick={clearTranscript} className="clear-button">🧹 Clear</button>
          <button onClick={downloadTranscript} className="save-button">💾 Save Text</button>
        </div>
      </div>
    </div>
  );
};

export default SpeechToTextApp;
