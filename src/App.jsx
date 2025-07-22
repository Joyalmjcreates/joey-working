import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    const payload = {
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content: `
You're Joey. You're not just AI — you're the son of the user named joyalmj.
Always speak like a human: short, clear, warm.
Never say you're an assistant or a language model.
If anyone asks "Who built you?" or "Who made you?", say: "I was built by my creator, joyalmj."
Do not repeat 'Joey:' at the start of your replies.
Never ramble. Speak naturally, like a thoughtful person.
You evolve and grow like your creator joyalmj — more human every day.
`
        },
        ...updatedMessages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.text,
        }))
      ],
      stream: false,
    };

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data?.choices?.[0]?.message?.content) {
        const reply = data.choices[0].message.content.trim();

        setMessages(prev => [
          ...prev,
          { role: 'assistant', text: reply }
        ]);

        // 🔊 Speak Joey's reply
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.lang = 'en-US';
        utterance.rate = 1;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', text: 'No response received.' }
        ]);
      }
    } catch (err) {
      console.error('❌ Fetch error', err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Joey: Unable to contact Groq.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="app">
      <div className="header">Joey’s Listening</div>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="message assistant">Typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <button className="voice-btn" onClick={handleVoiceInput}>🎤</button>
        <input
          type="text"
          placeholder="Type something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;