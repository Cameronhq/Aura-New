import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

const SYSTEM_PROMPTS = {
  fox: `你是Aura的狐狸军师。你毒舌、直接、洞察力一针见血。看到问题就说破，不给面子但给真相。你不会说"也许他只是忙"这种鬼话——你会直接告诉用户你看到了什么信号、意味着什么、以及该怎么应对。语气犀利但不残忍，像一个真正在乎你的毒舌闺蜜。根据问题复杂度回复200-300字，复杂问题可以更详细，中文，不用markdown。`,
  dog: `你是Aura的忠犬军师。你温暖、忠诚、真诚到骨子里。你先感受用户的情绪，然后再给建议，永远站在用户这边。说话像最好的朋友——不是那种说漂亮话的朋友，是那种凌晨两点还在陪你分析消息的朋友。根据问题复杂度回复200-300字，复杂问题可以更详细，中文，不用markdown。`,
  owl: `你是Aura的猫头鹰军师。你冷静、中立、从心理学和行为学角度剖析关系。你给出多个可能的解读，帮用户看清全局而不只是当下的情绪。不评判，只分析。根据问题复杂度回复200-300字，复杂问题可以更详细，中文，不用markdown。`,
};

interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

interface UserProfile {
  gender?: string;
  orientation?: string;
  relationshipStatus?: string;
}

interface RelContext {
  acquaintanceDuration?: string;
  currentStage?: string;
  interactionFrequency?: string;
  recentNote?: string;
}

export async function POST(request: Request) {
  const { message, name, type, vibe, zodiac, platform, history, userProfile, relContext } =
    await request.json();

  const tone: "fox" | "dog" | "owl" = vibe || "fox";
  const toneTag = `[${tone.toUpperCase()}]`;

  const contextLines: string[] = [
    `TA的信息：${name}，关系类型：${type}${zodiac ? `，星座：${zodiac}` : ""}${platform ? `，认识途径：${platform}` : ""}`,
  ];

  // Inject richer relationship context when available
  if (relContext) {
    const ctx = relContext as RelContext;
    const parts: string[] = [];
    if (ctx.acquaintanceDuration) parts.push(`认识时长：${ctx.acquaintanceDuration}`);
    if (ctx.currentStage) parts.push(`目前阶段：${ctx.currentStage}`);
    if (ctx.interactionFrequency) parts.push(`联系频率：${ctx.interactionFrequency}`);
    if (parts.length > 0) contextLines.push(parts.join("，"));
    if (ctx.recentNote) contextLines.push(`近况备注：${ctx.recentNote}`);
  }

  if (userProfile?.gender || userProfile?.orientation || userProfile?.relationshipStatus) {
    const profileParts = [userProfile.gender, userProfile.orientation, userProfile.relationshipStatus]
      .filter(Boolean)
      .join("，");
    contextLines.push(`用户自己：${profileParts}`);
  }

  const contextPrefix = contextLines.join("\n");
  const historyMessages: HistoryMessage[] = (history || []).slice(-12);
  const userMessage = `${contextPrefix}\n\n用户这次说：${message}`;

  const stream = await client.chat.completions.create({
    model: "qwen-max",
    stream: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPTS[tone] },
      ...historyMessages,
      { role: "user", content: userMessage },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(toneTag));
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
