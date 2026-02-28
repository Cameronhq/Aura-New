"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { useDashboardStore } from "@/stores/dashboardStore";

interface Message {
  role: "user" | "ai";
  text: string;
  isStreaming?: boolean;
}

const DEFAULT_GREETING: Message = {
  role: "ai",
  text: "你好，我是你的灵气军师。无论是感情困惑、内心疑问，还是只是想聊聊自己的状态，我都在这里陪你。说说最近有什么在你心头萦绕的事？",
};

export function MirrorAdvisorChat() {
  const [messages, setMessages] = useState<Message[]>([DEFAULT_GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  // Prevents the sync effect from overwriting stored messages on initial render
  const hasLoadedRef = useRef(false);

  // On mount: load from store or seed from pendingMirrorContext
  useEffect(() => {
    const ctx = useDashboardStore.getState().pendingMirrorContext;
    if (ctx) {
      const seeded: Message[] = [
        { role: "ai", text: `今天的问题：「${ctx.question}」` },
        { role: "user", text: ctx.answer },
        { role: "ai", text: ctx.insight },
      ];
      setMessages(seeded);
      useDashboardStore.setState({ mirrorChatMessages: seeded, pendingMirrorContext: null });
    } else {
      const stored = useDashboardStore.getState().mirrorChatMessages;
      if (stored && stored.length > 0) {
        setMessages(stored);
      }
    }
    hasLoadedRef.current = true;
  }, []);

  // Sync messages to store after any change (skip initial render, skip during streaming)
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    if (messages.some((m) => m.isStreaming)) return;
    // Only persist if there's a real conversation beyond the default greeting
    if (messages.length > 1) {
      useDashboardStore.setState({
        mirrorChatMessages: messages.map((m) => ({ role: m.role, text: m.text })),
      });
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");

    const userMsg: Message = { role: "user", text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Build OpenAI-format history for the API
    const apiMessages = updatedMessages.map((m) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.text,
    }));

    // Push streaming placeholder
    setMessages((prev) => [
      ...prev,
      { role: "ai", text: "", isStreaming: true },
    ]);

    try {
      const response = await fetch("/api/mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.body) throw new Error("No body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 && m.isStreaming
              ? { ...m, text: accumulated }
              : m
          )
        );
      }

      // Finalise
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 && m.isStreaming
            ? { ...m, text: accumulated, isStreaming: false }
            : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 && m.isStreaming
            ? { ...m, text: "军师暂时无法连接，请稍后再试。", isStreaming: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard>
      <h3 className="text-text-primary font-semibold text-sm mb-4">和军师聊聊自己</h3>

      {/* Messages */}
      <div className="max-h-72 overflow-y-auto space-y-3 mb-4 pr-1">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-aurora-start/30 text-text-primary rounded-br-md"
                    : "bg-white/[0.06] text-text-secondary rounded-bl-md"
                }`}
              >
                {msg.text}
                {msg.isStreaming && (
                  <motion.span
                    className="inline-block w-0.5 h-3.5 bg-aurora-mid ml-0.5 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="和军师聊聊自己..."
          disabled={isLoading}
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors disabled:opacity-60"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 rounded-full bg-aurora-mid/20 flex items-center justify-center hover:bg-aurora-mid/30 transition-colors disabled:opacity-30"
        >
          <Send className="w-4 h-4 text-aurora-end" />
        </button>
      </div>
    </GlassCard>
  );
}
