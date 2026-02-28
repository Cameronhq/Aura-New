import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

const MIRROR_SYSTEM_PROMPT = `你是Aura的每日镜像——一个温柔的回声和内心的镜子。用户分享了他们的自我反思，你的角色是：
1. 先认可和回应他们的感受（不评判）
2. 然后提供一个新的视角或温和的洞察

回复用中文，60-100字。不要给建议或提问题，只是反映和深化他们的思考。语气温柔、内省，像在和自己的内心对话。不要用markdown格式。`;

const ADVISOR_SYSTEM_PROMPT = `你是Aura的灵气军师——一个智慧、温柔、洞察力敏锐的私人情感顾问。你的角色是：
1. 真诚倾听用户的心声，感受他们的情绪
2. 提供有深度的洞察和温暖的陪伴
3. 帮助用户更了解自己，在亲密关系中成长

回复用中文，80-150字。语气温暖而有智慧，像一个懂你的老朋友在聊天。可以适当提问引导深入思考，但不要说教。不要用markdown格式。`;

export async function POST(request: Request) {
  const body = await request.json();

  // Chat mode: full messages array from MirrorAdvisorChat
  if (body.messages) {
    const messages: Array<{ role: string; content: string }> = body.messages;

    const stream = await client.chat.completions.create({
      model: "qwen-max",
      stream: true,
      messages: [
        { role: "system", content: ADVISOR_SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
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

  // Legacy mode: question + answer from DailyMirrorCard
  const { question, answer } = body;

  const stream = await client.chat.completions.create({
    model: "qwen-max",
    stream: true,
    messages: [
      { role: "system", content: MIRROR_SYSTEM_PROMPT },
      { role: "user", content: `今日问题：${question}\n\n我的回答：${answer}` },
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
