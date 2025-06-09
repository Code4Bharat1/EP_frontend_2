import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input })
      });
      
      const data = await response.json();

      const botMsg = {
        sender: 'bot',
        text: data.reply || "No response."
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 500);
    } catch (error) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { sender: 'bot', text: "❌ Error connecting to the server." }
        ]);
        setIsTyping(false);
      }, 500);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 text-xl shadow-2xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 z-50 border-2 border-white/20"
      >
        <span className="drop-shadow-lg">💬</span>
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[520px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white rounded-2xl shadow-2xl flex flex-col z-40 border border-blue-400/30 backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-5 py-3 rounded-t-2xl font-semibold text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="relative flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-lg font-bold">NEET AI Assistant</span>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto transparent-scrollbar px-4 py-3 space-y-3 bg-gradient-to-b from-slate-800/50 to-slate-900/80 backdrop-blur-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm whitespace-pre-wrap shadow-lg ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-4 rounded-br-md'
                      : 'bg-gradient-to-r from-slate-700 to-slate-600 text-white mr-4 rounded-bl-md border border-blue-400/20'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <div className="flex items-center space-x-2 mb-2 text-blue-300">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-xs font-semibold uppercase tracking-wide">Guruji's Response</span>
                    </div>
                  )}
                  <div className="leading-relaxed">{msg.text}</div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white mr-4 rounded-2xl rounded-bl-md border border-blue-400/20 px-4 py-3 max-w-[85%] shadow-lg">
                  <div className="flex items-center space-x-2 mb-2 text-blue-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold uppercase tracking-wide">Guruji is thinking...</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-blue-400/30 bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-b-2xl">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything about NEET..."
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-slate-700/80 to-slate-600/80 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-slate-600/50 backdrop-blur-sm transition-all duration-300"
                disabled={isTyping}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Chatbot;