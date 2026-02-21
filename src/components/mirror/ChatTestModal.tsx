"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send } from "lucide-react";

interface TestQuestion {
  question: string;
  followUp: string;
}

const testData: Record<string, { title: string; questions: TestQuestion[]; resultLabels: string[][] }> = {
  attachment: {
    title: "依恋类型深度测验",
    questions: [
      {
        question: "想象一下：你发了消息给一个你很在乎的人，过了3个小时还没回复。你的第一反应是什么？",
        followUp: "你的反应透露了你对不确定性的容忍度。让我们继续探索。",
      },
      {
        question: "当一段亲密关系开始变得认真时，你通常会感到兴奋还是有一种想要退缩的冲动？",
        followUp: "这反映了你在亲密关系中的舒适区。接下来...",
      },
      {
        question: "回忆你上一段让你难过的关系经历。你倾向于反复回想哪里出了问题，还是尽快让自己忙起来不去想？",
        followUp: "你处理情感伤痛的方式跟你的依恋模式有很强的关联。",
      },
      {
        question: "如果你的伴侣说「我需要一些独处的空间」，你内心最真实的感受是什么？",
        followUp: "对「空间」的理解方式往往是依恋类型最核心的差异之一。",
      },
      {
        question: "最后一个问题：在你看来，一段理想的亲密关系中，两个人应该保持怎样的距离感？",
        followUp: "",
      },
    ],
    resultLabels: [
      ["安全型依恋", "你能够自然地在关系中给予和接受亲密，信任他人同时也信任自己。你的关系模式健康而稳定。"],
      ["焦虑型依恋", "你渴望亲密，但容易担心对方是否同样在乎你。这种敏感其实是你爱得深的表现，关键是学会自我安抚。"],
      ["回避型依恋", "你重视独立性，在关系变得太亲密时可能会本能地保护自己的空间。认识到这一点是建立更深连接的第一步。"],
    ],
  },
  mbti: {
    title: "MBTI 恋爱人格分析",
    questions: [
      {
        question: "周五晚上，恋人突然说「我们出去走走吧」但没有任何计划。你的反应是？",
        followUp: "有趣，这透露了你对计划和自发性的偏好。",
      },
      {
        question: "你和恋人产生了分歧。你会先分析逻辑上谁更有道理，还是先关注彼此的感受？",
        followUp: "决策方式在感情中的影响比你想象的要大。",
      },
      {
        question: "参加恋人朋友的聚会后，你的感受更接近「好开心认识了新朋友」还是「终于可以回家充电了」？",
        followUp: "社交能量的管理方式会直接影响两个人的相处节奏。",
      },
      {
        question: "如果恋人跟你分享一个困扰TA的问题，你的第一反应是帮TA想解决方案，还是先倾听和陪伴？",
        followUp: "这是很多情侣容易产生误解的地方。",
      },
      {
        question: "你觉得在感情中，「保持神秘感」和「完全坦诚」哪个更重要？为什么？",
        followUp: "",
      },
    ],
    resultLabels: [
      ["理想主义恋人 (NF型)", "你在感情中追求深层的灵魂连接，重视精神共鸣胜过物质条件。你的浪漫和共情能力是你最大的魅力。"],
      ["务实守护者 (SJ型)", "你用行动表达爱意，重视承诺和稳定。你是那种会记住所有纪念日、默默为对方做很多事的人。"],
      ["探索型恋人 (SP/NT型)", "你在感情中需要新鲜感和智识上的刺激。你的好奇心和独立性让你在关系中既迷人又有挑战性。"],
    ],
  },
};

interface ChatTestModalProps {
  testId: string;
  onClose: () => void;
}

export function ChatTestModal({ testId, onClose }: ChatTestModalProps) {
  const test = testData[testId];
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<Array<{ role: "ai" | "user"; text: string }>>([
    { role: "ai", text: `欢迎来到「${test.title}」。我会通过几个真实情境来了解你的内心世界。没有标准答案，请说出你最真实的想法。` },
    { role: "ai", text: test.questions[0].question },
  ]);
  const [input, setInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<string[]>([]);

  const handleSend = () => {
    if (!input.trim() || isComplete) return;

    const userMsg = input.trim();
    setInput("");

    const newMessages = [...messages, { role: "user" as const, text: userMsg }];

    if (currentStep < test.questions.length - 1) {
      // Add follow-up and next question
      const followUp = test.questions[currentStep].followUp;
      const nextQ = test.questions[currentStep + 1].question;
      newMessages.push({ role: "ai", text: followUp });

      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "ai", text: nextQ }]);
      }, 800);

      setMessages(newMessages);
      setCurrentStep(currentStep + 1);
    } else {
      // Test complete — show results
      setMessages(newMessages);
      const resultIdx = Math.floor(Math.random() * test.resultLabels.length);
      setResult(test.resultLabels[resultIdx]);

      setTimeout(() => {
        setIsComplete(true);
      }, 600);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-void/95 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="text-text-primary font-medium text-sm">{test.title}</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
        >
          <X className="w-4 h-4 text-text-secondary" />
        </button>
      </div>

      {/* Progress */}
      <div className="px-4 py-2">
        <div className="flex gap-1">
          {test.questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= currentStep ? "bg-aurora-mid" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-aurora-start/30 text-text-primary rounded-br-md"
                    : "bg-white/[0.06] text-text-secondary rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Result card */}
        <AnimatePresence>
          {isComplete && result.length > 0 && (
            <motion.div
              className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-aurora-start/20 to-aurora-end/10 border border-aurora-mid/30"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <p className="text-aurora-end font-bold text-base mb-2">🎯 你的测试结果</p>
              <p className="text-text-primary font-semibold text-lg mb-2">{result[0]}</p>
              <p className="text-text-secondary text-sm leading-relaxed">{result[1]}</p>
              <button
                onClick={onClose}
                className="mt-4 w-full btn-glow py-2.5 rounded-xl text-sm font-semibold"
              >
                完成测试
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      {!isComplete && (
        <div className="px-4 py-3 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="说出你最真实的想法..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors"
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-aurora-mid/20 flex items-center justify-center hover:bg-aurora-mid/30 transition-colors disabled:opacity-30"
            >
              <Send className="w-4 h-4 text-aurora-end" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
