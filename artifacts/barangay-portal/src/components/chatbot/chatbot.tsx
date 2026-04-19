import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Trash2, Mic, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API = `${BASE}/api`;

const OFFICIAL_WELCOME = "Hi! I'm your Barangay Assistant for officials. I can help you with document summaries, resident searches, report generation, blotter assistance, notification management, and more. What do you need?";
const RESIDENT_WELCOME = "Hi! I'm your Barangay Assistant. I can help you with document requirements, application status, process guidance, announcements, and frequently asked questions. How can I help?";

const QUICK_PROMPTS_OFFICIAL = [
  "How many pending documents today?",
  "Show residents in Purok 3",
  "Generate this week's report",
  "List unpaid document requests",
];

const QUICK_PROMPTS_RESIDENT = [
  "How do I request a Barangay Clearance?",
  "What is my request status?",
  "What documents do I need?",
  "When is the barangay office open?",
];

export function Chatbot() {
  const { userData } = useAuth();
  const isOfficial = userData?.role === "official";
  
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: isOfficial ? OFFICIAL_WELCOME : RESIDENT_WELCOME,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== "undefined" && !("webkitSpeechRecognition" in window)) {
      console.log("[v0] Speech Recognition API not supported");
    }
  }, []);

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

  async function ensureConversation(): Promise<number> {
    if (conversationId) return conversationId;
    const res = await fetch(`${API}/openai/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: `Barangay Assistant Chat - ${userData?.role || "User"}` }),
    });
    const data = await res.json();
    setConversationId(data.id);
    return data.id;
  }

  async function sendMessage(text: string = "") {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setShowQuickPrompts(false);
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: messageText, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "", timestamp: new Date() }]);

    try {
      const convId = await ensureConversation();

      // Build context-aware prompt
      const contextPrompt = buildContextPrompt(messageText);

      const response = await fetch(`${API}/openai/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contextPrompt }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const json = JSON.parse(line.slice(6));
              if (json.content) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: m.content + json.content } : m
                  )
                );
              }
            } catch {}
          }
        }
      }
    } catch (error) {
      console.error("[v0] Chat error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, I couldn't connect to the server. Please try again." }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function buildContextPrompt(userMessage: string): string {
    const baseContext = `You are a helpful Barangay Santiago assistant. Respond concisely and professionally.`;
    
    if (isOfficial) {
      return `${baseContext} The user is a barangay official. Help with: document management, resident queries, reports, blotter cases, announcements, notifications. User message: ${userMessage}`;
    } else {
      return `${baseContext} The user is a resident. Help with: document requirements, application status, general information, barangay services, announcements. User message: ${userMessage}`;
    }
  }

  function startVoiceRecognition() {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported in this browser");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.language = "en-PH";

    setIsListening(true);
    let transcript = "";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("[v0] Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function clearChat() {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: isOfficial ? OFFICIAL_WELCOME : RESIDENT_WELCOME,
        timestamp: new Date(),
      },
    ]);
    setConversationId(null);
    setShowQuickPrompts(true);
  }

  const quickPrompts = isOfficial ? QUICK_PROMPTS_OFFICIAL : QUICK_PROMPTS_RESIDENT;

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          "bg-green-700 hover:bg-green-800 text-white",
          open && "rotate-90"
        )}
        aria-label="Toggle assistant"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] rounded-2xl shadow-2xl flex flex-col bg-white border border-border overflow-hidden transition-all duration-300 origin-bottom-right",
          open ? "scale-100 opacity-100 pointer-events-auto" : "scale-90 opacity-0 pointer-events-none"
        )}
        style={{ height: "540px" }}
      >
        <div className="flex items-center gap-3 px-4 py-3 bg-green-700 text-white shrink-0">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Barangay Assistant</p>
            <p className="text-xs text-green-100">{isOfficial ? "Official Tools" : "Resident Help"}</p>
          </div>
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg hover:bg-white/10 transition text-green-100 hover:text-white"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2 items-start group",
                msg.role === "user" && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  msg.role === "assistant" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                )}
              >
                {msg.role === "assistant" ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed break-words",
                    msg.role === "assistant"
                      ? "bg-gray-100 text-gray-800 rounded-tl-sm"
                      : "bg-green-700 text-white rounded-tr-sm ml-auto"
                  )}
                >
                  {msg.content || (
                    <span className="flex items-center gap-1 text-gray-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Thinking...
                    </span>
                  )}
                </div>
                {msg.role === "assistant" && msg.content && (
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 p-1 rounded text-xs text-gray-500 hover:text-gray-700"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {showQuickPrompts && messages.length === 1 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-gray-500 font-medium px-1">Quick questions:</p>
              <div className="grid gap-2">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(prompt)}
                    disabled={loading}
                    className="text-left text-xs p-2 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border px-3 py-2 shrink-0 bg-gray-50">
          <div className="flex gap-2 items-center">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask something..."
              className="flex-1 text-sm h-9 bg-white"
              disabled={loading || isListening}
            />
            <button
              onClick={startVoiceRecognition}
              disabled={loading || isListening}
              className={cn(
                "p-2 rounded-lg transition-colors h-9 w-9 flex items-center justify-center",
                isListening ? "bg-red-100 text-red-600" : "hover:bg-gray-200 text-gray-600"
              )}
              title="Voice input"
            >
              <Mic className="w-4 h-4" />
            </button>
            <Button
              size="icon"
              className="h-9 w-9 bg-green-700 hover:bg-green-800 shrink-0"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-1">
            AI-powered • May make mistakes • Official info from barangay hall
          </p>
        </div>
      </div>
    </>
  );
}
