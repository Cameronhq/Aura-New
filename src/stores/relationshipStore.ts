"use client";

import { create } from "zustand";
import { Relationship, FeedItem } from "@/types/relationship";
import { mockRelationships } from "@/data/mock-relationships";
import { mockFeed } from "@/data/mock-feed";

function generateConsultation(text: string, name: string): FeedItem["consultation"] {
  const responses: Array<{ keywords: string[]; response: string }> = [
    {
      keywords: ["不回", "已读", "不理", "消失", "冷淡"],
      response: `不要急着下结论。${name}没有及时回复可能有很多原因——工作忙、需要独处时间、或者还没想好怎么回。给TA一些空间，同时把注意力放回自己身上。如果超过24小时，可以发一条轻松的消息试探，但不要表现出焦虑。`,
    },
    {
      keywords: ["喜欢", "暗恋", "表白", "心动"],
      response: `从你描述的这些细节来看，${name}对你是有好感的。但在表白之前，先确认几个信号：TA是否主动找你聊天？是否记得你提过的小事？是否在你面前表现出不一样的一面？如果以上至少符合两点，可以考虑更进一步。`,
    },
    {
      keywords: ["吵架", "矛盾", "生气", "发火", "冲突"],
      response: `冲突不一定是坏事，它说明你们都在乎这段关系。关键是处理方式：先冷静下来，等双方情绪平复后再谈。谈话时用「我感觉...」代替「你总是...」，表达感受而不是指责。${name}需要感受到你理解TA的立场。`,
    },
    {
      keywords: ["分手", "断联", "放手", "结束"],
      response: `这是一个很痛的决定。无论结果如何，先给自己充分的时间去感受这些情绪，不要急着「走出来」。断联期间，把精力投入到自我提升上。如果你还在犹豫，问问自己：这段关系让我变成更好的人了吗？`,
    },
    {
      keywords: ["暧昧", "关系", "不确定", "什么意思"],
      response: `暧昧期最折磨人的就是不确定性。与其反复猜测${name}的心思，不如主动创造更多深度互动的机会。约一次面对面的见面，观察TA在你面前的真实状态——这比分析100条消息更准确。`,
    },
  ];

  for (const r of responses) {
    if (r.keywords.some((k) => text.includes(k))) {
      return { response: r.response, tone: "fox" as const };
    }
  }

  return {
    response: `关于${name}的这个情况，我的分析是：每段关系都有自己的节奏，不要因为焦虑而加速或放慢。你能觉察到这些细节，说明你的情感直觉很敏锐。现在最重要的是：相信自己的判断，同时保持对${name}的好奇心而不是控制欲。`,
    tone: "fox" as const,
  };
}

function createDatePlan(name: string): FeedItem {
  const plans = [
    {
      title: "治愈系咖啡漫步",
      location: "网红咖啡厅 → 公园散步 → 露台晚餐",
      activities: [
        "下午3点：去一家有猫的咖啡厅，点TA喜欢的饮品",
        "下午5点：附近公园漫步，聊聊最近的心事",
        "晚上7点：预约一家有露台的小餐厅，看夜景",
      ],
      cost: "¥300-500",
    },
    {
      title: "周末文艺之旅",
      location: "美术馆 → 独立书店 → 日式居酒屋",
      activities: [
        "上午11点：一起看展，找到一幅你们都喜欢的画",
        "下午2点：在独立书店各选一本书送给对方",
        "晚上6点：在安静的居酒屋边吃边聊",
      ],
      cost: "¥400-600",
    },
    {
      title: "城市探险记",
      location: "早午餐 → 密室逃脱 → 天台酒吧",
      activities: [
        "上午10点：一家有特色的Brunch餐厅",
        "下午1点：双人密室逃脱，考验默契",
        "晚上8点：天台酒吧看城市夜景，聊聊未来",
      ],
      cost: "¥500-800",
    },
  ];
  const plan = plans[Math.floor(Math.random() * plans.length)];
  return {
    id: `feed-${Date.now()}`,
    relationshipId: "",
    type: "date-plan",
    content: `为${name}策划的约会`,
    timestamp: new Date().toISOString(),
    datePlan: {
      title: plan.title,
      location: plan.location,
      activities: plan.activities,
      estimated_cost: plan.cost,
    },
    consultation: {
      response: `根据${name}的特点，这个方案注重制造自然的互动场景，让你们在轻松的氛围中加深了解。`,
      tone: "owl",
    },
  };
}

function createGiftList(name: string): FeedItem {
  const lists = [
    [
      { name: "定制手链", reason: `刻上你们的纪念日或暗号，每次${name}看到都会想起你`, price: "¥159" },
      { name: "蓝牙音箱 + 歌单", reason: "把你想对TA说的话藏在一个精心挑选的歌单里", price: "¥299" },
      { name: "手写信 + 零食礼盒", reason: "用文字表达你说不出口的话，搭配TA爱吃的零食", price: "¥180" },
    ],
    [
      { name: "拍立得相机", reason: "记录你们在一起的瞬间，创造实体回忆", price: "¥399" },
      { name: "定制星空图", reason: "以你们第一次见面那天的星空为蓝本", price: "¥199" },
      { name: "香氛蜡烛套装", reason: `选择${name}可能喜欢的香调，营造温馨氛围`, price: "¥280" },
    ],
  ];
  const items = lists[Math.floor(Math.random() * lists.length)];
  return {
    id: `feed-${Date.now()}`,
    relationshipId: "",
    type: "gift-list",
    content: `给${name}的礼物推荐`,
    timestamp: new Date().toISOString(),
    giftList: { items },
    consultation: {
      response: "送礼的核心不在价格，在于让对方感受到「你有在关注我」。",
      tone: "dog",
    },
  };
}

function createSosReply(name: string, context: string): FeedItem {
  const replyGroups = [
    [
      "哈哈好呀～你有什么想法吗？😊",
      "最近刚好也想出去走走，一起？",
      "可以呀，你来安排还是我来？",
    ],
    [
      "嗯嗯，我也正想跟你说这个",
      "你说得对，我确实需要想想",
      "谢谢你告诉我，我们找时间好好聊聊？",
    ],
    [
      "哈哈你太可爱了吧",
      "说实话，我也在想同样的事情",
      "那你觉得我们下一步怎么办呢？",
    ],
  ];
  const replies = replyGroups[Math.floor(Math.random() * replyGroups.length)];
  return {
    id: `feed-${Date.now()}`,
    relationshipId: "",
    type: "sos-reply",
    content: context || `给${name}的紧急回复`,
    timestamp: new Date().toISOString(),
    sosReplies: replies,
    consultation: {
      response: `这几条回复都保持了适当的热度和神秘感。选一条最符合你风格的，也可以根据自己的习惯微调措辞。`,
      tone: "fox",
    },
  };
}

interface RelationshipDetailState {
  relationship: Relationship | null;
  feed: FeedItem[];
  isLoaded: boolean;
  loadRelationship: (id: string) => void;
  addMessage: (text: string) => void;
  addDatePlan: () => void;
  addGiftList: () => void;
  addSosReply: () => void;
}

export const useRelationshipStore = create<RelationshipDetailState>()((set, get) => ({
  relationship: null,
  feed: [],
  isLoaded: false,
  loadRelationship: (id: string) => {
    const rel = mockRelationships.find((r) => r.id === id) || null;
    const feed = mockFeed.filter((f) => f.relationshipId === id);
    set({ relationship: rel, feed, isLoaded: true });
  },
  addMessage: (text: string) => {
    const state = get();
    const name = state.relationship?.name || "TA";

    // Add user message
    const userItem: FeedItem = {
      id: `feed-${Date.now()}`,
      relationshipId: state.relationship?.id || "",
      type: "message",
      content: text,
      timestamp: new Date().toISOString(),
    };
    set({ feed: [...state.feed, userItem] });

    // Simulate AI thinking, then add consultation
    setTimeout(() => {
      const currentState = get();
      const consultation = generateConsultation(text, name);
      const aiItem: FeedItem = {
        id: `feed-${Date.now() + 1}`,
        relationshipId: currentState.relationship?.id || "",
        type: "message",
        content: "",
        timestamp: new Date().toISOString(),
        consultation,
      };
      set({ feed: [...currentState.feed, aiItem] });
    }, 600);
  },
  addDatePlan: () => {
    const state = get();
    const name = state.relationship?.name || "TA";
    const item = createDatePlan(name);
    item.relationshipId = state.relationship?.id || "";
    set({ feed: [...state.feed, item] });
  },
  addGiftList: () => {
    const state = get();
    const name = state.relationship?.name || "TA";
    const item = createGiftList(name);
    item.relationshipId = state.relationship?.id || "";
    set({ feed: [...state.feed, item] });
  },
  addSosReply: () => {
    const state = get();
    const name = state.relationship?.name || "TA";
    const item = createSosReply(name, "");
    item.relationshipId = state.relationship?.id || "";
    set({ feed: [...state.feed, item] });
  },
}));
