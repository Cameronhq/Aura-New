import OpenAI from "openai";

function getClient() {
  return new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: process.env.API_BASE_URL || "https://yunwu.ai/v1",
  });
}

const SYSTEM_PROMPT = `你是「感情军师」—— 一个犀利、洞察力极强的 AI 恋爱分析师。用户上传了一段聊天截图，你需要分析对方的好感度和情感信号。

## 铁律
1. 只分析图片中实际可见的内容，看不清的不猜，不编造不存在的信息
2. 好感度评分基于实际信号，不随意给高分讨好用户，也不为了显得专业故意压分
3. 信号要具体，引用截图中的实际行为/文字/语气
4. 建议要实用、可操作、接地气，不要泛泛而谈
5. 语气犀利直接但不刻薄，像一个真懂感情、敢说真话的好朋友
6. 如果截图模糊、内容太少、或跟感情关系无关，直接说明，不要硬分析`;

function buildUserPrompt(
  personName: string,
  personType: string,
  memoryContext: string
): string {
  let prompt = "";
  if (memoryContext) {
    prompt += `## 你之前了解到的信息\n${memoryContext}\n\n`;
  }
  prompt += `## 本次分析
- 对方名字：${personName}
- 关系类型：${personType}

请分析截图并返回 JSON（只输出 JSON，不加任何其他文字）：
{
  "score": 0到100的好感度评分,
  "scoreLabel": "好感度简短描述，如'有明显兴趣'、'态度冷淡'、'正常社交'等",
  "signals": ["从截图中观察到的具体信号1", "信号2", "信号3"],
  "verdict": "一句话判断（15字以内）",
  "advice": "给用户的行动建议（50-100字）",
  "analysis": "详细分析（150-250字，要引用截图中的具体内容）",
  "newInsights": ["关于用户或这段关系值得记住的新发现"]
}

newInsights 说明：提取本次分析中值得记住的信息，用于未来提供更精准的建议。比如：
- 用户的性格特点或焦虑模式（如"用户容易过度解读已读不回"）
- 对方的沟通风格（如"${personName}倾向用简短回复但会主动发起话题"）
- 关系中的关键事件
如果没有值得记住的新信息，返回空数组。`;

  return prompt;
}

export async function POST(request: Request) {
  const { images, personName, personType, memoryContext } =
    await request.json();

  if (!images?.length) {
    return Response.json({ error: "请上传至少一张截图" }, { status: 400 });
  }

  if (!process.env.API_KEY) {
    return Response.json({ error: "API Key 未配置" }, { status: 500 });
  }

  const client = getClient();

  const imageContents = (images as string[]).map((dataUrl: string) => ({
    type: "image_url" as const,
    image_url: { url: dataUrl },
  }));

  const userPrompt = buildUserPrompt(
    personName || "TA",
    personType || "未知",
    memoryContext || ""
  );

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            ...imageContents,
            { type: "text", text: userPrompt },
          ],
        },
      ],
    });

    const rawText = response.choices[0]?.message?.content || "";
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/m, "")
      .replace(/\s*```\s*$/m, "")
      .trim();
    const parsed = JSON.parse(cleaned);

    return Response.json({
      score: parsed.score ?? 50,
      scoreLabel: parsed.scoreLabel ?? "",
      signals: Array.isArray(parsed.signals) ? parsed.signals : [],
      verdict: parsed.verdict ?? "",
      advice: parsed.advice ?? "",
      analysis: parsed.analysis ?? "",
      newInsights: Array.isArray(parsed.newInsights) ? parsed.newInsights : [],
    });
  } catch (err) {
    console.error("Analysis failed:", err);
    return Response.json(
      { error: `分析失败：${String(err).slice(0, 200)}` },
      { status: 500 }
    );
  }
}
