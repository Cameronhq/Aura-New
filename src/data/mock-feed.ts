import { FeedItem } from "@/types/relationship";

export const mockFeed: FeedItem[] = [
  {
    id: "feed-001",
    relationshipId: "rel-001",
    type: "message",
    content: "他今天突然给我发了一首歌，说让我听听看",
    timestamp: "2024-02-20T14:30:00",
    evidence: {
      analysis: "主动分享音乐是建立情感连接的常见方式。他在试图通过音乐传达某种情绪或想法。",
      signals: ["主动联系", "分享个人品味", "寻求共鸣"],
      confidence: 0.85,
    },
    consultation: {
      response:
        "这首歌的歌词有没有什么特别的意思？如果有，他可能是在用音乐表达自己说不出口的话。你可以回复你对这首歌的感受，打开更深的对话。",
      tone: "fox",
    },
  },
  {
    id: "feed-002",
    relationshipId: "rel-001",
    type: "screenshot",
    content: "他说「我都行，看你吧」，到底什么意思？",
    timestamp: "2024-02-19T20:15:00",
    evidence: {
      analysis:
        "「我都行，看你吧」是一种表面上的退让，但实际上包含期待。他希望你做主，同时也在测试你是否愿意为这段关系付出主动性。",
      signals: ["被动沟通", "期待主导", "安全感测试"],
      confidence: 0.78,
    },
    consultation: {
      response:
        "他其实希望你做主，但需要你给他一个台阶。试试直接说「那我来安排，你只要出现就好」——给他一个既不费力又有参与感的角色。",
      tone: "fox",
    },
  },
  {
    id: "feed-003",
    relationshipId: "rel-001",
    type: "sos-reply",
    content: "他问我周末有没有空，我不知道怎么回",
    timestamp: "2024-02-18T11:00:00",
    sosReplies: [
      "周末看情况诶～你有什么想法吗？😊",
      "哈哈还没想好，你有什么好主意不？",
      "暂时还没安排，有好玩的推荐吗？",
    ],
    consultation: {
      response:
        "他主动问你周末安排，这是一个非常积极的信号。不要直接说「有空」，保持一点神秘感但又给出明确的开放态度。",
      tone: "fox",
    },
  },
  {
    id: "feed-004",
    relationshipId: "rel-001",
    type: "date-plan",
    content: "纪念日约会策划",
    timestamp: "2024-02-17T09:00:00",
    datePlan: {
      title: "城市探索之旅",
      location: "798艺术区 → 隐藏餐厅 → 日落天台",
      activities: [
        "下午2点：798看展，找到一幅你们都喜欢的画",
        "下午5点：预约隐藏餐厅（提前一周订位）",
        "晚上7点：天台看日落，带上蓝牙音箱",
      ],
      estimated_cost: "¥500-800",
    },
    consultation: {
      response: "根据Alex喜欢艺术和户外的特点，这个方案兼顾了文艺感和浪漫氛围。",
      tone: "owl",
    },
  },
  {
    id: "feed-005",
    relationshipId: "rel-001",
    type: "gift-list",
    content: "生日礼物推荐",
    timestamp: "2024-02-16T16:00:00",
    giftList: {
      items: [
        {
          name: "拍立得相机 Instax Mini",
          reason: "他喜欢记录生活瞬间，拍立得能创造你们之间的实体记忆",
          price: "¥399",
        },
        {
          name: "定制星空图",
          reason: "以你们第一次见面那天的星空为蓝本，独一无二的仪式感",
          price: "¥199",
        },
        {
          name: "手写信 + 香氛蜡烛套装",
          reason: "用文字表达你说不出口的话，搭配他喜欢的木质调香氛",
          price: "¥280",
        },
      ],
    },
    consultation: {
      response: "送礼的核心不在价格，在于「你有在关注我」的感觉。这三个选项都体现了你对他的了解。",
      tone: "dog",
    },
  },
];
