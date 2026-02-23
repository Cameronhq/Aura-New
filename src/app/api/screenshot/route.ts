import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPTS = {
  fox: `你是Aura的狐狸军师，正在分析用户上传的聊天截图。毒舌直接，一眼看穿真相。分析截图中的聊天模式、信号、和潜台词。只输出JSON，不要加任何其他文字。`,
  dog: `你是Aura的忠犬军师，正在分析用户上传的聊天截图。温暖真诚，站在用户这边。分析截图中的聊天模式、情感信号、和互动质量。只输出JSON，不要加任何其他文字。`,
  owl: `你是Aura的猫头鹰军师，正在分析用户上传的聊天截图。冷静客观，从行为学角度分析。识别截图中的沟通模式、信号指标、和关系动态。只输出JSON，不要加任何其他文字。`,
};

export async function POST(request: Request) {
  const { images, caption, name, type, zodiac, platform, vibe } = await request.json();

  const tone: "fox" | "dog" | "owl" = vibe || "fox";

  const contextInfo = [
    `TA的信息：${name}，关系类型：${type}`,
    zodiac ? `星座：${zodiac}` : "",
    platform ? `认识途径：${platform}` : "",
    caption ? `用户备注：${caption}` : "",
  ]
    .filter(Boolean)
    .join("，");

  const toneDesc =
    tone === "fox" ? "毒舌直接，一针见血" : tone === "dog" ? "温暖真诚，支持用户" : "冷静客观，多角度解读";

  const imageBlocks = (images as string[]).map((dataUrl) => {
    const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
    return {
      type: "image" as const,
      source: {
        type: "base64" as const,
        media_type: "image/jpeg" as const,
        data: base64,
      },
    };
  });

  const userContent = [
    ...imageBlocks,
    {
      type: "text" as const,
      text: `${contextInfo}

请分析以上聊天截图，返回如下JSON格式（只输出JSON，不加任何其他文字）：
{"analysis":"对截图内容的总体分析（2-3句话，描述主要聊天模式和氛围）","signals":["信号1","信号2","信号3"],"confidence":75,"consultation":"基于截图的具体建议（约150字，语气：${toneDesc}）"}

说明：
- analysis: 描述截图中看到的主要内容和互动模式
- signals: 3-5个简短信号标签（如"回复冷淡"、"主动性强"、"话题转移"等）
- confidence: 解读置信度 0-100
- consultation: 结合截图内容给用户的具体行动建议`,
    },
  ];

  try {
    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      system: SYSTEM_PROMPTS[tone],
      messages: [
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const rawText = response.content[0].type === "text" ? response.content[0].text : "";
    const cleaned = rawText.replace(/^```(?:json)?\s*/m, "").replace(/\s*```\s*$/m, "").trim();

    const parsed = JSON.parse(cleaned);
    return Response.json({
      analysis: parsed.analysis || "",
      signals: Array.isArray(parsed.signals) ? parsed.signals : [],
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
      consultation: parsed.consultation || "",
    });
  } catch (err) {
    return new Response(`Screenshot analysis failed: ${err}`, { status: 500 });
  }
}
