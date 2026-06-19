import React, { useState, useEffect, useRef } from 'react';
import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { FaRobot, FaUser } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { io } from 'socket.io-client';
import axios from 'axios';

const quickReplies = [
  "What skills do you have?",
  "Show me projects",
  "Tell me about experience",
  "Education details",
];

function parseResponse(text) {
  const parts = [];
  const lines = text.split("\n");
  for (const line of lines) {
    if (line.startsWith("*") && line.endsWith("*")) {
      parts.push({ type: "heading", text: line.slice(1, -1) });
    } else if (line.match(/^https?:\/\/\S+/)) {
      parts.push({ type: "link", text: line.trim() });
    } else {
      const boldParts = [];
      let remaining = line;
      let lastIdx = 0;
      const regex = /\*(.*?)\*/g;
      let match;
      while ((match = regex.exec(remaining)) !== null) {
        if (match.index > lastIdx) {
          boldParts.push({ type: "text", text: remaining.slice(lastIdx, match.index) });
        }
        boldParts.push({ type: "bold", text: match[1] });
        lastIdx = match.index + match[0].length;
      }
      if (lastIdx < remaining.length) {
        boldParts.push({ type: "text", text: remaining.slice(lastIdx) });
      }
      if (boldParts.length) {
        parts.push({ type: "line", children: boldParts });
      } else if (line.trim()) {
        parts.push({ type: "line", children: [{ type: "text", text: line }] });
      } else {
        parts.push({ type: "spacer" });
      }
    }
  }
  return parts;
}

function BotMessage({ text }) {
  const parts = parseResponse(text);
  return (
    <div className="space-y-1">
      {parts.map((part, i) => {
        if (part.type === "heading") {
          return (
            <p key={i} className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
              {part.text}
            </p>
          );
        }
        if (part.type === "link") {
          return (
            <a key={i} href={part.text} target="_blank" rel="noopener noreferrer"
              className="text-blue-500 underline text-sm break-all hover:text-blue-700">
              {part.text}
            </a>
          );
        }
        if (part.type === "spacer") {
          return <div key={i} className="h-1" />;
        }
        if (part.type === "line") {
          return (
            <p key={i} className="text-sm leading-relaxed">
              {part.children.map((child, j) => {
                if (child.type === "bold") {
                  return <strong key={j} className="font-semibold text-blue-600 dark:text-blue-400">{child.text}</strong>;
                }
                return <span key={j}>{child.text}</span>;
              })}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const basePort = 5000;
    const maxAttempts = 5;

    const connectSocket = (port) => {
      const socket = io(`http://localhost:${port}`);
      socketRef.current = socket;

      socket.on('connect', () => {
        setSocketConnected(true);
      });

      socket.on('connect_error', () => {
        if (port < basePort + maxAttempts) {
          setTimeout(() => {
            socket.disconnect();
            connectSocket(port + 1);
          }, 1000);
        }
      });

      socket.on('chat_response', (data) => {
        setIsTyping(false);
        const newMessage = {
          id: Date.now(),
          text: data.response,
          sender: 'bot',
          timestamp: data.timestamp,
        };
        setMessages(prev => [...prev, newMessage]);
      });

      socket.on('chat_error', () => {
        setIsTyping(false);
      });

      socket.on('disconnect', () => {
        setSocketConnected(false);
      });
    };

    connectSocket(basePort);

    if (isOpen) {
      fetchChatHistory();
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!messages.length && isOpen) {
      setMessages([
        { id: 1, text: "Hi! I'm Charan's portfolio assistant. I can answer questions about skills, projects, experience, education, certificates, and more!", sender: 'bot', timestamp: Date.now() },
      ]);
    }
  }, [isOpen]);

  const fetchChatHistory = async () => {
    try {
      const basePort = 5000;
      const maxAttempts = 5;
      for (let port = basePort; port < basePort + maxAttempts; port++) {
        try {
          const response = await axios.get(`http://localhost:${port}/api/chat/history`);
          if (response.data.success) {
            const formatted = [];
            for (const item of response.data.history) {
              formatted.push({ id: item._id, text: item.message, sender: 'user', timestamp: item.timestamp });
              formatted.push({ id: item._id + '_r', text: item.response, sender: 'bot', timestamp: item.timestamp });
            }
            if (formatted.length) setMessages(formatted);
            break;
          }
        } catch {
          continue;
        }
      }
    } catch {}
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !socketConnected) return;

    const userMsg = { id: Date.now(), text: inputMessage, sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    socketRef.current.emit('chat_message', {
      message: inputMessage,
      sessionId: socketRef.current.id,
      user: 'guest',
    });

    const basePort = 5000;
    const maxAttempts = 5;
    for (let port = basePort; port < basePort + maxAttempts; port++) {
      try {
        await axios.post(`http://localhost:${port}/api/chat/send`, {
          message: inputMessage,
          sessionId: socketRef.current.id,
          user: 'guest',
        });
        break;
      } catch {
        continue;
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-3.5 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
        aria-label="Toggle chat"
      >
        {isOpen ? <IoClose size={24} /> : <IoChatbubbleEllipses size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 z-50 sm:w-96 h-[60vh] sm:h-[520px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <FaRobot className="text-white" size={16} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Portfolio Assistant</h3>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  {socketConnected ? 'Online' : 'Connecting...'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              <IoClose size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-gray-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    msg.sender === 'user'
                      ? 'bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    {msg.sender === 'user'
                      ? <FaUser className="text-white" size={11} />
                      : <FaRobot className="text-gray-700 dark:text-gray-300" size={11} />
                    }
                  </div>
                  <div className={`rounded-2xl px-3.5 py-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-md'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-md shadow-sm border border-gray-200 dark:border-gray-700'
                  }`}>
                    {msg.sender === 'bot' ? (
                      <BotMessage text={msg.text} />
                    ) : (
                      <p className="text-sm">{msg.text}</p>
                    )}
                    <p className={`text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaRobot className="text-gray-700 dark:text-gray-300" size={11} />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isTyping && messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {quickReplies.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => {
                      setInputMessage(qr);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about skills, projects..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                disabled={!socketConnected}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || !socketConnected}
                className="px-3.5 py-2.5 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <IoSend size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
