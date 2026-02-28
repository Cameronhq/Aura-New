import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPTS = {
  fox: `你是Aura的狐狸军师，帮用户解读TA发来或分享的图片。你毒舌直接，一眼看穿真相——但你的犀利建立在事实上，不是脑补。铁律：只说图片里实际存在的内容，看不清楚的不猜，信号不明显的直接说"这张图信息有限"，宁可置信度低也不编造细节。只输出JSON，不要加任何其他文字。`,
  dog: `你是Aura的忠犬军师，帮用户解读TA发来或分享的图片。你温暖真诚，永远站在用户这边——但真正在乎用户就不能给TA误导性的分析。铁律：只说图片里实际存在的内容，看不清楚的不猜，信号不明显时直接告诉用户"这张图看不出太多"，不要为了显得有用而编故事。只输出JSON，不要加任何其他文字。`,
  owl: `你是Aura的猫头鹰军师，帮用户解读TA发来或分享的图片。你冷静客观，从行为学角度剖析——客观的前提是只基于可观察到的事实。铁律：只说图片里实际存在的内容，无法确认的细节不推断，置信度低时如实标注，宁可结论保守也不过度解读。只输出JSON，不要加任何其他文字。`,
};

function buildPrompt(contextInfo: string, toneDesc: string): string {
  return `${contextInfo}

请分析以上图片，返回如下JSON格式（只输出JSON，不加任何其他文字）：
{"analysis":"对图片内容的真实描述（2-3句，只描述图片中实际可见的内容，不推断不存在的信息）","signals":["信号1","信号2","信号3"],"confidence":75,"consultation":"基于图片给用户的分析和建议（100-200字，语气：${toneDesc}）"}

各字段说明：
- analysis: 忠实描述图片里实际看到的内容——是聊天记录就描述互动模式，是照片就描述状态和场景，是笔记就描述主题和情绪，不要套用不符合实际内容的框架
- signals: 3-5个基于实际内容的信号标签，不要编造图片中不存在的细节
- confidence: 对这次解读的置信度 0-100。图片模糊、内容与感情关系关联不强、或看不出明显信号时，主动给低分（40分以下），不要为了显得专业而虚报高分
- consultation: 结合图片实际内容和TA的关系背景给出分析。如果图片与这段感情的关联并不明显，直接说明，分析TA这个人的特质或习惯反而比硬找感情信号更有价值。内容少宁可短，不要凑字数，绝对不要引用图片里不存在的文字或细节`;
}

function parseVisionResponse(rawText: string) {
  const cleaned = rawText.replace(/^```(?:json)?\s*/m, "").replace(/\s*```\s*$/m, "").trim();
  const parsed = JSON.parse(cleaned);
  return {
    analysis: parsed.analysis || "",
    signals: Array.isArray(parsed.signals) ? parsed.signals : [],
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
    consultation: parsed.consultation || "",
    visionAvailable: true,
  };
}

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

  const promptText = buildPrompt(contextInfo, toneDesc);

  // 1. Try DashScope (Qwen-VL-Max) — works in mainland China
  if (process.env.DASHSCOPE_API_KEY) {
    const client = new OpenAI({
      apiKey: process.env.DASHSCOPE_API_KEY,
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    });

    const imageContents = (images as string[]).map((dataUrl) => ({
      type: "image_url" as const,
      image_url: { url: dataUrl },
    }));

    try {
      const response = await client.chat.completions.create({
        model: "qwen-vl-max",
        messages: [
          { role: "system", content: SYSTEM_PROMPTS[tone] },
          {
            role: "user",
            content: [
              ...imageContents,
              { type: "text", text: promptText },
            ],
          },
        ],
      });

      const rawText = response.choices[0]?.message?.content || "";
      return Response.json(parseVisionResponse(rawText));
    } catch (err) {
      return Response.json({
        error: "vision_failed",
        visionError: String(err).slice(0, 200),
        analysis: "",
        signals: [],
        confidence: 0,
        consultation: "",
        visionAvailable: false,
      });
    }
  }

  // 2. Try Anthropic Claude (works outside China / with VPN)
  if (process.env.ANTHROPIC_API_KEY) {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

    try {
      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: SYSTEM_PROMPTS[tone],
        messages: [
          {
            role: "user",
            content: [...imageBlocks, { type: "text" as const, text: promptText }],
          },
        ],
      });

      const rawText = response.content[0].type === "text" ? response.content[0].text : "";
      return Response.json(parseVisionResponse(rawText));
    } catch (err) {
      return Response.json({
        error: "vision_failed",
        visionError: String(err).slice(0, 200),
        analysis: "",
        signals: [],
        confidence: 0,
        consultation: "",
        visionAvailable: false,
      });
    }
  }

  // No vision key configured
  return Response.json({
    error: "vision_unavailable",
    visionError: "需要配置 DASHSCOPE_API_KEY 或 ANTHROPIC_API_KEY 才能分析图片内容",
    analysis: "",
    signals: [],
    confidence: 0,
    consultation: "",
    visionAvailable: false,
  });
}
