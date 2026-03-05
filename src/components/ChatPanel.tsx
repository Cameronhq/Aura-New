"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage, Analysis } from "@/types";
import { useAppStore } from "@/stores/appStore";

interface ChatPanelProps {
  analysis: Analysis;
}

function getQuickQuestions(analysis: Analysis): string[] {
  const { score } = analysis.result;
  const type = analysis.personType;
  const concern = analysis.concern;

  const questions: string[] = [];

  if (concern) {
    questions.push(`关于「${concern.slice(0, 15)}${concern.length > 15 ? "…" : ""}」你怎么看？`);
  }

  if (type === "男/女朋友") {
    if (score <= 40) {
      questions.push("TA 是不是已经不爱我了？", "这段关系还能挽救吗？", "我该怎么跟 TA 沟通这个问题？");
    } else if (score <= 65) {
      questions.push("TA 是不是进入倦怠期了？", "怎么让感情升温回来？", "这种相处模式正常吗？");
    } else {
      questions.push("怎么让这段关系保持新鲜感？", "TA 有认真考虑未来吗？", "有什么需要注意的隐患吗？");
    }
  } else if (type === "前任") {
    if (score <= 40) {
      questions.push("TA 是真的放下了吗？", "我还该继续联系吗？", "怎么才能优雅地放手？");
    } else if (score <= 65) {
      questions.push("TA 是在犹豫还是只是寂寞？", "我该主动提复合吗？", "怎么试探 TA 的真实想法？");
    } else {
      questions.push("TA 是想复合的意思吗？", "复合后怎么避免重蹈覆辙？", "我该怎么回应 TA 的信号？");
    }
  } else if (type === "朋友") {
    if (score <= 40) {
      questions.push("TA 真的只把我当朋友吗？", "有没有可能是我想多了？", "怎么判断 TA 对我有没有意思？");
    } else if (score <= 65) {
      questions.push("这些暧昧信号是什么意思？", "我该不该主动表明心意？", "怎么在不破坏友谊的前提下试探？");
    } else {
      questions.push("TA 是不是喜欢我但不敢说？", "我该怎么捅破这层窗户纸？", "直接表白还是继续暗示？");
    }
  } else {
    if (score <= 30) {
      questions.push("TA 是不是对我没兴趣？", "我应该主动还是放手？", "怎样才能引起 TA 注意？");
    } else if (score <= 55) {
      questions.push("TA 到底怎么想的？", "我该怎么打破僵局？", "接下来聊什么话题好？");
    } else if (score <= 75) {
      questions.push("下一步该怎么推进？", "什么时候适合约 TA 出来？", "怎么判断 TA 是认真的？");
    } else {
      questions.push("TA 是不是喜欢我？", "该不该表白？", "怎么保持这种好的状态？");
    }
  }

  return questions.slice(0, 4);
}

export function ChatPanel({ analysis }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { appendChat, updateLastAssistantMessage, getMemoryForPerson } = useAppStore();

  const messages = analysis.chatHistory;
  const quickQuestions = getQuickQuestions(analysis);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const buildAnalysisContext = () => {
    const r = analysis.result;
    return `对方：${analysis.personName}（${analysis.personType}）\n好感度：${r.score}/100（${r.scoreLabel}）\n判断：${r.verdict}\n信号：${r.signals.join("、")}\n分析：${r.analysis}`;
  };

  const buildMemoryContext = () => {
    const items = getMemoryForPerson(analysis.personName);
    if (!items.length) return "";
    return items.map((m) => `- ${m.content}`).join("\n");
  };

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;
    setInput("");
    setStreaming(true);

    const userMsg: ChatMessage = {
      role: "user",
      content: text.trim(),
      timestamp: Date.now(),
    };
    appendChat(analysis.id, userMsg);

    const assistantMsg: ChatMessage = {
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };
    appendChat(analysis.id, assistantMsg);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          analysisContext: buildAnalysisContext(),
          memoryContext: buildMemoryContext(),
        }),
      });

      if (!res.ok) throw new Error("请求失败");
      const reader = res.body?.getReader();
      if (!reader) throw new Error("无法读取响应");

      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        updateLastAssistantMessage(analysis.id, full);
      }
    } catch {
      updateLastAssistantMessage(analysis.id, "抱歉，回复失败了，请重试。");
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Messages */}
      <div className="space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-sm text-[#999] mb-3">想进一步了解？试试问军师：</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="px-3 py-2 text-sm bg-[#F5F5F3] rounded-xl text-[#333] hover:bg-[#EEEEEC] transition-colors animate-in fade-in slide-in-from-bottom-1 duration-300"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#1A1A1A] text-white rounded-br-md"
                  : "bg-[#F5F5F3] text-[#333] rounded-bl-md"
              }`}
            >
              {msg.content || (
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 items-end sticky bottom-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
          placeholder="追问军师..."
          disabled={streaming}
          className="flex-1 px-4 py-3 bg-[#F5F5F3] rounded-xl text-[15px] placeholder:text-[#BBB] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/10 disabled:opacity-50"
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || streaming}
          className="px-4 py-3 bg-[#1A1A1A] text-white rounded-xl font-medium text-sm disabled:opacity-30 transition-opacity shrink-0 active:scale-95"
        >
          发送
        </button>
      </div>
    </div>
  );
}
