"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Trash2, Mic, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

const WELCOME_MESSAGE = "Hi! I'm your Barangay Assistant. I can help with document requests, announcements, processes, and more. What do you need?";

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: WELCOME_MESSAGE, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: data.response } : m))
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, I couldn't connect. Please try again." }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([{ id: "welcome", role: "assistant", content: WELCOME_MESSAGE, timestamp: new Date() }]);
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 bg-green-700 hover:bg-green-800 text-white"
        aria-label="Toggle assistant"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] rounded-2xl shadow-2xl flex flex-col bg-white border border-gray-200 overflow-hidden h-[540px]">
          <div className="flex items-center gap-3 px-4 py-3 bg-green-700 text-white shrink-0">
            <Bot className="w-4 h-4" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Barangay Assistant</p>
              <p className="text-xs text-green-100">Always here to help</p>
            </div>
            <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-white/10 transition text-green-100">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === "assistant" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                  {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${msg.role === "assistant" ? "bg-gray-100 text-gray-800" : "bg-green-700 text-white"}`}>
                  {msg.content || <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />Thinking...</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 px-3 py-2 shrink-0 bg-gray-50">
            <div className="flex gap-2 items-center">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Ask something..."
                className="flex-1 text-sm h-9 bg-white"
                disabled={loading}
              />
              <Button size="icon" className="h-9 w-9 bg-green-700 hover:bg-green-800 shrink-0" onClick={sendMessage} disabled={loading || !input.trim()}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
