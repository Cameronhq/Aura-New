import OpenAI from "openai";

function getClient() {
  return new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: process.env.API_BASE_URL || "https://yunwu.ai/v1",
  });
}

function buildSystemPrompt(
  analysisContext: string,
  memoryContext: string
): string {
  let prompt = `你是「感情军师」—— 一个犀利、有洞察力的 AI 恋爱顾问。用户刚刚让你分析了一段聊天截图，现在想跟你进一步讨论。

## 你的风格
- 直接、犀利、不说废话
- 像一个真懂感情的好朋友在聊天
- 先理解用户的情绪，再给建议
- 建议要具体可操作，不要泛泛而谈
- 回复简洁有力，100-200字，复杂问题可以更长
- 中文回复，不用 markdown

## 刚才的分析结果
${analysisContext}`;

  if (memoryContext) {
    prompt += `\n\n## 你对这个用户的了解\n${memoryContext}`;
  }

  return prompt;
}

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  const { message, history, analysisContext, memoryContext } =
    await request.json();

  if (!process.env.API_KEY) {
    return new Response("API Key 未配置", { status: 500 });
  }

  const client = getClient();
  const systemPrompt = buildSystemPrompt(
    analysisContext || "",
    memoryContext || ""
  );

  const historyMessages: ChatMsg[] = (history || []).slice(-16);

  const stream = await client.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      ...historyMessages,
      { role: "user", content: message },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
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
