import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

const PROMPTS = {
  date: (name: string, type: string, extra?: string) => ({
    system: `你是一个创意约会策划师，专门为中国用户设计浪漫、有趣的约会方案。只输出JSON，不要加任何其他文字或markdown。`,
    user: `为和"${name}"（关系：${type}${extra ? `，${extra}` : ""}）的约会设计一个完整方案。返回以下JSON格式：
{"title":"约会主题名称","location":"地点路线（用→分隔）","activities":["活动1","活动2","活动3"],"estimated_cost":"预估费用范围"}
活动要具体、有时间点、有细节。`,
  }),
  gift: (name: string, type: string, extra?: string) => ({
    system: `你是一个贴心的礼物顾问，专门为中国用户推荐有意义的礼物。只输出JSON，不要加任何其他文字或markdown。`,
    user: `为送给"${name}"（关系：${type}${extra ? `，${extra}` : ""}）推荐3件礼物。返回以下JSON格式：
{"items":[{"name":"礼物名称","reason":"推荐理由","price":"价格范围"},{"name":"礼物名称","reason":"推荐理由","price":"价格范围"},{"name":"礼物名称","reason":"推荐理由","price":"价格范围"}]}`,
  }),
  sos: (name: string, type: string, context?: string, extra?: string) => ({
    system: `你是一个机智的回复顾问，帮助用户在情感对话中找到合适的措辞。只输出JSON，不要加任何其他文字或markdown。`,
    user: `帮我回复"${name}"（关系：${type}${extra ? `，${extra}` : ""}）${context ? `，背景：${context}` : ""}。提供3条不同风格的回复。返回以下JSON格式：
{"replies":["回复1（轻松幽默）","回复2（温柔真诚）","回复3（简洁有力）"]}`,
  }),
};

export async function POST(request: Request) {
  const { action, name, type, context, zodiac, platform } = await request.json();

  const extra = [zodiac ? `星座：${zodiac}` : "", platform ? `认识途径：${platform}` : ""]
    .filter(Boolean)
    .join("，");

  const promptConfig =
    action === "date"
      ? PROMPTS.date(name, type, extra || undefined)
      : action === "gift"
      ? PROMPTS.gift(name, type, extra || undefined)
      : PROMPTS.sos(name, type, context, extra || undefined);

  const response = await client.chat.completions.create({
    model: "deepseek-chat",
    stream: false,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: promptConfig.system },
      { role: "user", content: promptConfig.user },
    ],
  });

  const rawText = response.choices[0]?.message?.content || "";
  const cleaned = rawText.replace(/^```(?:json)?\s*/m, "").replace(/\s*```\s*$/m, "").trim();

  try {
    const parsed = JSON.parse(cleaned);

    if (action === "date") {
      return Response.json({ datePlan: parsed });
    } else if (action === "gift") {
      return Response.json({ giftList: parsed });
    } else {
      return Response.json({ sosReplies: parsed.replies });
    }
  } catch {
    return new Response(`Failed to parse AI response: ${rawText}`, { status: 500 });
  }
}
