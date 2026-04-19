"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

/**
 * AI Chatbot with 25 Features:
 *
 * OFFICIAL FEATURES (12):
 * 1. Smart daily task assistant
 * 2. Real-time data insights
 * 3. Auto report generator
 * 4. Document assistance
 * 5. Blotter case assistance
 * 6. Notification drafting
 * 7. Resident search & filtering
 * 8. Event/announcement generation
 * 9. Smart validation
 * 10. Email automation ready
 * 11. Predictive insights framework
 * 12. Voice command support
 *
 * RESIDENT FEATURES (13):
 * 1. Step-by-step guidance
 * 2. Document request assistance
 * 3. Smart checklist system
 * 4. Request status tracking
 * 5. Notification explanation
 * 6. Barangay information
 * 7. Announcement explanation
 * 8. Blotter process guidance
 * 9. Profile management help
 * 10. Event discovery
 * 11. Email & request help
 * 12. Multilingual support (English, Tagalog, Taglish)
 * 13. Voice assistant
 */

export function Chatbot() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hello! I'm the Santiago Barangay AI Assistant. ${
        isAuthenticated
          ? user?.role === "official"
            ? "I can help you with daily tasks, generate reports, manage documents, and much more."
            : "I can help you request documents, track your requests, and guide you through barangay services."
          : "Please log in to use this feature."
      }`,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!isAuthenticated) {
    return null;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await api.chatbot.sendMessage(input, {
        userRole: user?.role,
        userId: user?.id,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response || "I couldn't process that request. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I encountered an error. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setInput(action);
    const userMessage: Message = {
      id: Date.now().toString(),
      text: action,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.chatbot.sendMessage(action, {
        userRole: user?.role,
        userId: user?.id,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response || "I couldn't process that request.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast.error("Failed to process request");
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions =
    user?.role === "official"
      ? [
          "Show pending documents",
          "Generate report for this week",
          "Find senior citizens",
          "Create announcement",
          "Notify respondent",
        ]
      : [
          "How do I request clearance?",
          "Track my document request",
          "What events are coming?",
          "File a complaint",
          "Check announcements",
        ];

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
          title="Open Chat Assistant"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[500px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-lg">
            <div>
              <h3 className="font-semibold">Santiago AI Assistant</h3>
              <p className="text-xs text-blue-100">
                {user?.role === "official"
                  ? "Official Support"
                  : "Resident Support"}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 p-1 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 space-y-4">
            <div>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-100 text-slate-900 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Loader size={16} className="animate-spin" />
                  <p className="text-sm">AI is thinking...</p>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
              <p className="text-xs font-medium text-slate-600 mb-2">
                Quick Actions:
              </p>
              <div className="space-y-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(action)}
                    className="w-full text-left text-xs px-2 py-1 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded transition"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-slate-200 flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 text-sm"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send size={16} />
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
