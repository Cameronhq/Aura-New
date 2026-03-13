# 感情军师 (Aura) — 项目说明文档

## 一、产品概述

**感情军师** 是一款 AI 驱动的聊天截图情感分析工具。用户上传与对方的聊天截图，AI 根据关系类型给出精准的情感评分、关键信号解读、行动建议，并支持后续追问对话。

**核心定位**：截图分析 + 可分享卡片 + 追问对话 + 隐式 AI 记忆

**线上地址**：https://aura-new-swart.vercel.app

**GitHub**：https://github.com/Cameronhq/Aura-New

---

## 二、技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| UI | React 18 + Tailwind CSS 3.4 |
| 状态管理 | Zustand 5 (with persist middleware) |
| AI 模型 | GPT-4o (通过云雾 API 中转) |
| 截图分享 | html2canvas |
| 部署 | Vercel |

---

## 三、项目结构

```
src/
├── app/
│   ├── layout.tsx              # 根布局 (metadata, viewport, 字体)
│   ├── page.tsx                # 首页：上传截图 + 填写背景信息 + 历史列表
│   ├── globals.css             # 全局样式 + CSS 变量 + 动画工具类
│   ├── analysis/
│   │   └── [id]/
│   │       └── page.tsx        # 分析结果页：卡片 + 分享 + 追问对话
│   └── api/
│       ├── analyze/
│       │   └── route.ts        # 截图分析 API (视觉模型 + 关系框架 prompt)
│       └── chat/
│           └── route.ts        # 追问对话 API (流式输出)
├── components/
│   ├── UploadZone.tsx          # 图片上传区 (拖拽 + 点选, iOS 兼容)
│   ├── ScoreGauge.tsx          # 圆环分数动画组件
│   ├── AnalysisCard.tsx        # 可分享的分析结果卡片
│   ├── ChatPanel.tsx           # 追问对话面板 (含动态快捷问题)
│   └── RecentList.tsx          # 最近分析历史列表
├── stores/
│   └── appStore.ts             # Zustand 全局状态 (分析记录 + 记忆)
├── types/
│   └── index.ts                # TypeScript 类型定义
└── lib/
    └── utils.ts                # 工具函数
```

---

## 四、核心数据模型

```typescript
// 分析结果
interface AnalysisResult {
  score: number;          // 0-100 评分
  scoreLabel: string;     // 评分简述，如"有明显兴趣"
  signals: string[];      // 从截图观察到的关键信号
  verdict: string;        // 一句话判断 (≤15字)
  advice: string;         // 行动建议 (50-100字)
  analysis: string;       // 详细分析 (150-250字)
}

// 单次分析记录
interface Analysis {
  id: string;
  createdAt: number;
  personName: string;     // 对方名字
  personType: string;     // 关系类型
  duration?: string;      // 认识/在一起时长
  concern?: string;       // 用户最想了解的问题
  result: AnalysisResult;
  chatHistory: ChatMessage[];
}

// 对话消息
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// AI 记忆条目
interface MemoryItem {
  id: string;
  content: string;        // 记忆内容
  personName?: string;    // 关联的人
  createdAt: number;
}
```

---

## 五、用户流程

```
1. 首页
   ├── 首次用户看到情景示例（"秒回但不主动 → 48分" 等）
   └── 上传聊天截图 (1-4 张)
         ↓
2. 填写背景
   ├── TA 的名字
   ├── 关系类型 (暧昧/男女朋友/前任/Crush/相亲/朋友)
   ├── 认识多久 (刚认识 ~ 3年以上)
   └── 最想了解什么 (选填)
         ↓
3. AI 分析 (分阶段加载动画)
   └── 识别内容 → 分析语气 → 评估互动 → 计算指数 → 生成报告
         ↓
4. 分析结果页
   ├── 情绪化反应 (emoji + 共情文案，根据关系类型变化)
   ├── 分析卡片 (评分圆环动画 + 信号 + 建议 + 详细分析)
   ├── 操作按钮 (保存/分享卡片图片, 复制结论)
   └── 追问军师 (动态快捷问题 + 自由对话, 流式输出)
         ↓
5. 返回首页
   └── 历史记录列表 (点击查看/再次分析)
```

---

## 六、AI Prompt 架构

### 6.1 截图分析 Prompt (`/api/analyze`)

**System Prompt — 角色设定**：

```
你是「感情军师」—— 一个犀利、洞察力极强的 AI 恋爱分析师。

铁律：
1. 只分析图片中实际可见的内容，看不清的不猜，不编造
2. 评分基于实际信号，不讨好也不压分
3. 信号要具体，引用截图中的实际行为/文字/语气
4. 建议要实用、可操作、接地气
5. 语气犀利直接但不刻薄
6. 截图模糊/内容太少/无关，直接说明

关键：必须根据关系类型调整分析框架，不要用"好感度"套所有关系。
```

**User Prompt — 关系类型分框架**：

根据 `personType` 动态选择不同的分析框架：

| 关系类型 | 评分维度 | 核心分析方向 |
|---------|---------|------------|
| **暧昧 / Crush / 相亲** | 好感度 (0-100) | 回复速度/主动性、对话投入、话题延伸、暗示见面信号 |
| **男/女朋友** | 感情浓度 (0-100) | 回复用心程度、主动表达关心、耐心包容度、对未来的重视、冷淡迹象 |
| **前任** | 留恋度 (0-100) | 主动联系、提到过去回忆、语气亲近vs疏远、试探性暧昧、回避感情话题 |
| **朋友** | 暧昧指数 (0-100) | 聊天频率超出普通、特殊关注、亲密语气、试探性言语、深夜聊天等 |

Prompt 中还包含：
- **记忆上下文**：之前分析中积累的关于这段关系的记忆
- **时长**：认识/在一起多久，影响分析的期望基线
- **用户关切**：用户最想了解的问题，AI 会重点回应

**输出格式** (强制 JSON)：

```json
{
  "score": 0-100,
  "scoreLabel": "评分简短描述",
  "signals": ["具体信号1", "信号2", "信号3"],
  "verdict": "一句话判断 (15字以内)",
  "advice": "行动建议 (50-100字)",
  "analysis": "详细分析 (150-250字，引用截图内容)",
  "newInsights": ["值得记住的新发现 (用于记忆系统)"]
}
```

### 6.2 追问对话 Prompt (`/api/chat`)

**System Prompt**：

```
你是「感情军师」—— 一个犀利、有洞察力的 AI 恋爱顾问。

风格：
- 直接、犀利、不说废话
- 像一个真懂感情的好朋友在聊天
- 先理解用户的情绪，再给建议
- 建议要具体可操作
- 回复 100-200 字，复杂问题可以更长
- 中文回复，不用 markdown

上下文：
- 刚才的分析结果（分数、信号、判断、建议）
- 对用户的记忆（历史分析中积累的洞察）
```

**特点**：
- 流式输出 (SSE)，打字机效果
- 保留最近 16 条对话历史
- 分析结果作为系统上下文，保证追问的连贯性

---

## 七、AI 记忆系统

每次分析后，AI 会返回 `newInsights` 字段，自动提取值得记住的信息：

- 用户的性格特点/焦虑模式（如"容易过度解读已读不回"）
- 对方的沟通风格（如"倾向简短回复但会主动发起话题"）
- 关系中的关键事件

这些记忆：
- 按 `personName` 索引，下次分析同一个人时自动注入 prompt
- 存储在客户端 localStorage（Zustand persist）
- 上限 200 条，FIFO 淘汰
- 对用户完全透明/隐式，不需要手动管理

**护城河意义**：用得越多，AI 越了解你的关系，分析越准，形成使用粘性。

---

## 八、环境变量

| 变量名 | 说明 | 示例 |
|-------|------|-----|
| `API_KEY` | AI API 密钥 (OpenAI 兼容) | `sk-xxxx` |
| `API_BASE_URL` | API 基础 URL | `https://yunwu.ai/v1` |

当前使用云雾 API (yunwu.ai) 作为中转站，调用 GPT-4o 模型。

---

## 九、本地开发

```bash
# 安装依赖
npm install

# 创建环境变量
echo 'API_KEY=your-key-here' > .env.local
echo 'API_BASE_URL=https://yunwu.ai/v1' >> .env.local

# 启动开发服务器
npm run dev
# → http://localhost:3000
```

---

## 十、部署

项目部署在 Vercel：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署到生产
vercel --prod

# 设置环境变量
vercel env add API_KEY production
vercel env add API_BASE_URL production
```

---

## 十一、UI/UX 设计要点

### 视觉风格
- 黑白灰极简风，背景色 `#FAFAF8`，主色 `#1A1A1A`
- 圆角卡片 + 细边框，无阴影/渐变（仅分数色条例外）
- 字体层级：标题 extrabold，标签 11px 大写间距，正文 15px

### 交互细节
- 分阶段加载文案动画（识别→分析→计算→生成）
- 分数圆环 easeOutCubic 填充 + 数字递增动画
- 骨架屏 → 卡片 fade+slide 入场
- 所有按钮 `active:scale-95` 触控反馈
- iOS 安全区域适配 (`viewport-fit: cover` + `env(safe-area-inset-bottom)`)
- 文件选择使用 `<label htmlFor>` 而非 JS `.click()` 以兼容 iOS 相册

### 动态内容
- 情绪反应 (emoji + 文案) 根据关系类型 × 分数动态变化
- 快捷追问根据关系类型 × 分数 × 用户关切动态生成
- 卡片标题根据关系类型显示不同维度名（好感度/感情浓度/留恋度/暧昧指数）
- 分析卡片顶部彩色条根据分数变色

### 分享机制
- html2canvas 截取分析卡片为 2x PNG
- 支持 Web Share API（移动端直接分享到社交平台）
- 不支持时自动触发下载
- 一键复制结论到剪贴板

---

## 十二、产品策略

### MVP 核心逻辑
```
截图 → AI 分析 → 可分享卡片 (传播) → 追问对话 (粘性) → 记忆积累 (护城河)
```

### 与通用 AI 的差异化
1. **一步到位**：不需要写 prompt，上传截图就出结果
2. **可分享卡片**：精美的评分卡片天然适合社交传播
3. **关系记忆**：越用越懂你，通用 AI 每次从零开始
4. **关系框架**：针对不同关系类型有专门的分析维度，不是万能模板
