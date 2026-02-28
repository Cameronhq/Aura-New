import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

const vibeDescriptions: Record<string, string> = {
  fox: "狡狐型（洞察力强、策略思考、情感独立）",
  dog: "忠犬型（温暖真诚、忠诚可靠、情感支持）",
  owl: "猫头鹰型（智慧深邃、理性平衡、洞察全局）",
};

export async function POST(request: Request) {
  const { user, mirrorAnswers, mirrorChatMessages } = await request.json();

  // Calculate age from birthday
  const age = user.birthday
    ? new Date().getFullYear() - parseInt(user.birthday.split("-")[0])
    : null;

  // Build user context
  const userContext = [
    `昵称：${user.nickname}`,
    age ? `年龄：${age}岁` : "",
    user.gender ? `性别：${user.gender}` : "",
    user.orientation ? `取向：${user.orientation}` : "",
    user.relationshipStatus ? `感情状态：${user.relationshipStatus}` : "",
    `灵气类型：${vibeDescriptions[user.consultantVibe] || user.consultantVibe}`,
  ]
    .filter(Boolean)
    .join("，");

  // Build mirror Q&A history
  const mirrorHistory = (mirrorAnswers || [])
    .slice(-5)
    .map(
      (m: { question: string; answer: string; insight?: string }, i: number) =>
        `[自我反思${i + 1}]\n问题：${m.question}\n回答：${m.answer}${m.insight ? `\n军师洞见：${m.insight}` : ""}`
    )
    .join("\n\n");

  // Build chat history snippet
  const chatHistory = (mirrorChatMessages || [])
    .slice(-20)
    .map((m: { role: string; text: string }) => `${m.role === "ai" ? "军师" : "用户"}：${m.text}`)
    .join("\n");

  const hasHistory = mirrorHistory || chatHistory;

  const prompt = `以下是用户的基本信息和与AI军师的对话历史：

用户信息：${userContext}

${mirrorHistory ? `自我反思记录：\n${mirrorHistory}\n\n` : ""}${chatHistory ? `军师对话片段：\n${chatHistory}\n\n` : ""}${
    !hasHistory ? "用户刚刚完成初次设置，尚无对话记录。\n\n" : ""
  }请根据以上信息，生成用户的灵气档案。返回如下JSON格式（只输出JSON，不加任何其他文字）：
{"summary":"2-3句个性化的灵气摘要，基于用户真实分享的内容，不要泛泛而谈","labels":["个性标签1","个性标签2","个性标签3"]}

要求：
- summary：结合用户实际的性格特点、感情状态和自我认知，写出有温度、有洞见的摘要（60字以内）
- labels：3个短标签，精准反映用户的灵气特质（每个2-5个字，不要用通用词如"善良"）`;

  try {
    const response = await client.chat.completions.create({
      model: "qwen-max",
      stream: false,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "你是Aura的灵气分析师，根据用户的自我反思和对话记录，生成个性化的灵气档案。只输出JSON，不要加任何其他文字。",
        },
        { role: "user", content: prompt },
      ],
    });

    const rawText = response.choices[0]?.message?.content || "";
    const cleaned = rawText.replace(/^```(?:json)?\s*/m, "").replace(/\s*```\s*$/m, "").trim();
    const parsed = JSON.parse(cleaned);

    return Response.json({
      summary: parsed.summary || "",
      labels: Array.isArray(parsed.labels) ? parsed.labels.slice(0, 4) : [],
    });
  } catch (err) {
    return new Response(`Aura profile generation failed: ${err}`, { status: 500 });
  }
}
