"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bot, X, Send, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingAIElectrician() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: 80, y: 20 });
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  // Advanced floating animation with sine wave movement
  useEffect(() => {
    if (isOpen) return; // Stop movement when chat is open

    const animate = () => {
      timeRef.current += 0.02;
      
      setPosition({
        x: 50 + Math.sin(timeRef.current) * 30 + Math.cos(timeRef.current * 0.7) * 15,
        y: 50 + Math.cos(timeRef.current * 0.8) * 25 + Math.sin(timeRef.current * 1.2) * 10
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-electrician', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button with Smooth Movement */}
      <div 
        className="fixed z-50 transition-all duration-75 ease-out"
        style={{
          left: `${Math.max(8, Math.min(92, position.x))}%`,
          top: `${Math.max(8, Math.min(88, position.y))}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Floating Ring Animation */}
        <div className="absolute inset-0 rounded-full">
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-75 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border border-purple-400 opacity-50 animate-pulse"></div>
        </div>

        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "relative rounded-full w-14 h-14 md:w-16 md:h-16 shadow-xl hover:shadow-2xl",
            "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800",
            "hover:from-blue-700 hover:via-purple-700 hover:to-blue-900",
            "transform hover:scale-110 transition-all duration-300",
            "border-2 border-white",
            isOpen && "rotate-180 scale-110"
          )}
          size="icon"
        >
          {isOpen ? (
            <X className="h-6 w-6 md:h-7 md:w-7 text-white" />
          ) : (
            <>
              <Bot className="h-6 w-6 md:h-7 md:w-7 text-white" />
              <Zap className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-bounce" />
            </>
          )}
        </Button>
        
        {/* Floating Tooltip */}
        {!isOpen && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-90">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg text-xs md:text-sm whitespace-nowrap animate-bounce">
              ⚡ Floating AI Assistant
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
            </div>
          </div>
        )}

        {/* Sparkle Effects */}
        {!isOpen && (
          <>
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-1 -right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1 -left-3 w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
          </>
        )}
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-w-md w-full max-h-[80vh] animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-4 text-white">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bot className="h-6 w-6 md:h-7 md:w-7" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base">Floating AI Electrician ⚡</h3>
                  <p className="text-xs md:text-sm opacity-90">I was floating around just for you!</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-64 md:h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <div className="relative">
                    <Bot className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-blue-500" />
                    <Zap className="absolute top-0 right-1/2 transform translate-x-8 h-4 w-4 text-yellow-500 animate-bounce" />
                  </div>
                  <p className="text-sm md:text-base font-medium mb-2">
                    🚀 Your Floating AI Assistant is Here!
                  </p>
                  <p className="text-xs md:text-sm text-gray-400">
                    I was floating around the screen to catch your attention!
                    <br />
                    Ask me about electrical problems, safety tips, or any electrical questions!
                  </p>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] p-3 rounded-lg text-sm",
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-md border'
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg rounded-bl-none shadow-md border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask your floating electrical assistant..."
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
