import React, { useState, useRef } from 'react';

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
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">🗣️ Speech to Text Converter</h1>

        <textarea
          value={transcript}
          readOnly
          placeholder="Your speech will appear here..."
          className="w-full h-48 p-4 border rounded resize-none"
        />

        <div className="flex flex-wrap justify-center gap-4">
          {!isListening ? (
            <button onClick={startListening} className="bg-green-500 text-white px-4 py-2 rounded">
              🎙️ Start Listening
            </button>
          ) : (
            <button onClick={stopListening} className="bg-red-500 text-white px-4 py-2 rounded">
              🛑 Stop
            </button>
          )}

          <button onClick={clearTranscript} className="bg-gray-500 text-white px-4 py-2 rounded">
            🧹 Clear
          </button>

          <button onClick={downloadTranscript} className="bg-blue-500 text-white px-4 py-2 rounded">
            💾 Save Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeechToTextApp;
