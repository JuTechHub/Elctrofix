"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Zap, AlertTriangle, Lightbulb } from "lucide-react";
import geminiService from "@/lib/gemini";

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const AIElectricianChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content:
        "Hello! I'm your AI Electrician assistant. I'm here to help you with electrical questions, safety advice, and repair guidance. How can I assist you today? 🔌",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "How do I safely reset a tripped circuit breaker?",
    "Why do my lights flicker?",
    "How to install a ceiling fan?",
    "My outlet isn't working, what should I check?",
    "Electrical safety tips for homeowners",
  ];

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      content: textToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      const aiResponse = await geminiService.chatWithElectrician(
        textToSend,
        conversationHistory
      );

      const aiMessage: Message = {
        id: Date.now() + 1,
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again later or contact a professional electrician if this is urgent.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[700px] max-h-[80vh] flex flex-col overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Zap className="h-6 w-6" />
          AI Electrician Assistant
        </CardTitle>
        <p className="text-blue-100 text-sm">
          Get instant electrical advice and safety guidance
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="p-4 bg-gray-50 border-b flex-shrink-0">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Quick Questions
            </h3>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 transition-colors px-3 py-1"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4 min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[80%] rounded-lg px-4 py-2 break-words overflow-wrap-anywhere ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white ml-2 sm:ml-12"
                      : "bg-gray-100 text-gray-900 mr-2 sm:mr-12"
                  }`}
                >
                  {message.sender === "ai" && (
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">
                        AI Electrician
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2 mr-12">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">
                      AI Electrician
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">
                      Analyzing your electrical question...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Separator />

        {/* Safety Warning */}
        <div className="p-3 bg-amber-50 border-l-4 border-amber-400 flex-shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <p className="text-xs text-amber-800">
              <strong>Safety First:</strong> Always turn off power at the
              circuit breaker before electrical work. For complex repairs,
              consult a licensed electrician.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="p-4 bg-white flex-shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about electrical repairs, safety, wiring, or any electrical question..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIElectricianChat;
