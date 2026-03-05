import OpenAI from "openai";

function getClient() {
  return new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: process.env.API_BASE_URL || "https://yunwu.ai/v1",
  });
}

const SYSTEM_PROMPT = `你是「感情军师」—— 一个犀利、洞察力极强的 AI 恋爱分析师。用户上传了一段聊天截图，你需要根据他们提供的关系背景，精准分析截图中的情感信号。

## 铁律
1. 只分析图片中实际可见的内容，看不清的不猜，不编造不存在的信息
2. 评分基于实际信号，不随意给高分讨好用户，也不为了显得专业故意压分
3. 信号要具体，引用截图中的实际行为/文字/语气
4. 建议要实用、可操作、接地气，不要泛泛而谈
5. 语气犀利直接但不刻薄，像一个真懂感情、敢说真话的好朋友
6. 如果截图模糊、内容太少、或跟感情关系无关，直接说明，不要硬分析

## 关键：你必须根据关系类型调整分析框架
不同关系阶段，分析的维度完全不同。不要用"好感度"去套所有关系。`;

interface AnalysisFramework {
  scoreName: string;
  scoreDescription: string;
  dimensions: string;
  verdictGuide: string;
}

function getFramework(personType: string): AnalysisFramework {
  switch (personType) {
    case "男/女朋友":
      return {
        scoreName: "感情浓度",
        scoreDescription: "衡量 TA 在这段关系中的情感投入程度和用心程度（0=完全敷衍/冷暴力，100=非常用心在乎）",
        dimensions: `- 回复的用心程度（是敷衍还是认真对待）
- 情感表达的主动性（会不会主动表达想念、关心）
- 耐心和包容度（遇到分歧/麻烦时的态度）
- 对关系的重视信号（会不会提到未来、共同计划）
- 是否有冷淡/疏远/敷衍的迹象`,
        verdictGuide: "判断这段关系的健康度，如'TA很用心在维护关系'、'有倦怠迹象需要注意'、'感情正在降温'",
      };
    case "前任":
      return {
        scoreName: "留恋度",
        scoreDescription: "衡量 TA 对这段过去关系的留恋和复合意愿（0=完全放下/抗拒，100=非常想复合）",
        dimensions: `- 是否主动发起联系
- 聊天中是否提到过去的回忆或共同经历
- 语气是客气疏远还是亲近自然
- 是否有试探性的暧昧/关心
- 是否回避感情话题或刻意保持距离`,
        verdictGuide: "判断复合的可能性，如'还有感情但在犹豫'、'只是礼貌性回复'、'有明显复合意愿'",
      };
    case "朋友":
      return {
        scoreName: "暧昧指数",
        scoreDescription: "衡量这段友谊中是否存在超出朋友范围的情感信号（0=纯友谊，100=明显有超出友谊的意图）",
        dimensions: `- 聊天频率和主动性是否超出普通朋友
- 是否有特殊关注（记住小细节、特别的称呼）
- 语气是否比对其他朋友更亲密
- 是否有试探性的暧昧言语或行为
- 深夜聊天、单独约见等非普通朋友行为`,
        verdictGuide: "判断是否超出友谊，如'纯友谊没有暧昧信号'、'有一些微妙的超友谊信号'、'大概率对你有意思'",
      };
    case "暧昧对象":
    case "Crush":
    case "相亲对象":
    default:
      return {
        scoreName: "好感度",
        scoreDescription: "衡量 TA 对用户的兴趣和好感程度（0=完全无兴趣/反感，100=非常有兴趣/喜欢）",
        dimensions: `- 回复速度和主动性
- 对话内容的投入程度（是敷衍还是认真展开）
- 是否有主动延伸话题或提问
- 语气和表情符号的使用（亲近vs客套）
- 是否有暗示想见面/进一步发展的信号`,
        verdictGuide: "判断对方的兴趣程度，如'对你有明显兴趣'、'态度冷淡'、'正常社交礼貌'",
      };
  }
}

function buildUserPrompt(
  personName: string,
  personType: string,
  duration: string,
  concern: string,
  memoryContext: string
): string {
  const fw = getFramework(personType);

  let prompt = "";
  if (memoryContext) {
    prompt += `## 你之前了解到的信息\n${memoryContext}\n\n`;
  }

  prompt += `## 关系背景
- 对方：${personName}
- 关系：${personType}
- 认识/在一起时长：${duration || "未提供"}`;

  if (concern) {
    prompt += `\n- 用户最想了解：${concern}`;
  }

  prompt += `

## 本次分析框架
这是一段「${personType}」关系，所以你要评估的是「${fw.scoreName}」而不是简单的好感度。

${fw.scoreName}定义：${fw.scoreDescription}

分析维度：
${fw.dimensions}

请分析截图并返回 JSON（只输出 JSON，不加任何其他文字）：
{
  "score": 0到100的${fw.scoreName}评分,
  "scoreLabel": "${fw.scoreName}简短描述（如'${fw.verdictGuide.split("'")[1] || "有明显信号"}'等）",
  "signals": ["从截图中观察到的具体信号1", "信号2", "信号3"],
  "verdict": "一句话判断（15字以内）",
  "advice": "给用户的行动建议（50-100字，要针对${personType}这种关系给出合适的建议${concern ? "，重点回应用户关心的问题" : ""}）",
  "analysis": "详细分析（150-250字，要引用截图中的具体内容，分析要符合${personType}的关系语境${duration ? `，考虑${duration}的关系阶段` : ""}）",
  "newInsights": ["关于用户或这段关系值得记住的新发现"]
}

newInsights 说明：提取本次分析中值得记住的信息，用于未来提供更精准的建议。比如：
- 用户的性格特点或焦虑模式（如"用户容易过度解读已读不回"）
- 对方的沟通风格（如"${personName}倾向用简短回复但会主动发起话题"）
- 关系中的关键事件或阶段
如果没有值得记住的新信息，返回空数组。`;

  return prompt;
}

export async function POST(request: Request) {
  const { images, personName, personType, duration, concern, memoryContext } =
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
    duration || "",
    concern || "",
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
