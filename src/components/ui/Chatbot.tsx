"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Send, Bot, Loader2 } from "lucide-react";
import { processChat } from "@/app/actions/chat";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hello! I am the CRC AI Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentInput = input;
    if (!currentInput.trim()) return;

    // Add user message immediately
    setMessages(prev => [...prev, { id: Date.now(), sender: "user", text: currentInput }]);
    setInput("");
    setIsTyping(true);

    try {
      // Process AI response
      const reply = await processChat(currentInput);
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          sender: "bot", 
          text: reply 
        }
      ]);
    } catch (error) {
       setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          sender: "bot", 
          text: "Thanks for your question! I’m unable to answer that specific request right now, but our team will be happy to help you directly on WhatsApp or phone: 09069168041." 
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) {
    return null;
  }

  return (
    <>
      {/* CHATBOT TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className={`${isOpen ? 'hidden' : 'flex'} fixed bottom-6 left-6 z-50 p-4 rounded-full bg-primary-dark text-white shadow-lg  hover:bg-primary hover:scale-110 transition-transform duration-300 items-center justify-center animate-pulse-slow`}
        aria-label="Open AI Chatbot"
      >
        <MessageSquare className="h-7 w-7" />
      </button>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-[60] w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300 h-[500px] max-h-[80vh]">
          
          {/* HEADER */}
          <div className="bg-primary text-white p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center">
              <Bot className="h-6 w-6 mr-2" />
              <div>
                <h3 className="font-bold font-heading">CRC Assistant</h3>
                <p className="text-xs text-primary-light">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-primary-light hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex max-w-[85%] ${msg.sender === 'user' ? 'self-end justify-end' : 'self-start'}`}
              >
                <div 
                  className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-sm' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex max-w-[85%] self-start">
                <div className="p-4 rounded-2xl bg-white border border-gray-200 text-gray-400 rounded-tl-sm flex items-center shadow-sm">
                   <Loader2 className="h-4 w-4 animate-spin text-primary" />
                   <span className="ml-2 text-xs">AI is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM */}
          <div className="p-3 bg-white border-t border-border">
            <form onSubmit={handleSend} className="flex relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-100 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary border-transparent"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:bg-gray-400"
              >
                <Send className="h-4 w-4 ml-0.5" />
              </button>
            </form>
          </div>
          
        </div>
      )}
    </>
  );
}
