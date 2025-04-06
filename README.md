# AI Life Planner 🧠📅

An AI-powered personal planning assistant designed for **casual but meaningful life goals**.

Users can input natural language like:
- “I want to lose 3 pounds in 3 months”
- “I have a date tomorrow, help me plan it”
- “I want to move house next month”

And the system will **analyze the intent**, **generate executable tasks**, and **suggest resources or schedules**.

一个由 AI 驱动的个人生活规划工具，适用于更“日常化”的人生目标或临时需求。

你可以输入：
- “我想三个月内瘦 3 斤”
- “我明天有个约会，帮我安排一下流程”
- “下个月我想搬家”

系统会**理解你的意图**，并给出**行动计划、时间建议**，甚至推荐**相关资源**或地点。

---

## ✨ Features / 功能亮点

| 功能 | 描述 |
|------|------|
| 🎯 目标规划 | 理解长期目标并自动拆解为阶段性任务 |
| ⚡ 情境建议 | 对短期计划（如约会、出行）给出详细建议和流程 |
| 📅 时间结构化 | 为每个建议生成日历时间段（可选同步） |
| 📍 可扩展 | 后续支持地点推荐、服务商对接、提醒通知等 |

---

## 🔧 Tech Stack / 技术栈

| 技术 | 用途 |
|------|------|
| NestJS | 后端框架，负责接收与处理请求 |
| OpenAI API | AI 语言理解与生成逻辑 |
| TypeScript | 强类型开发体验 |
| PostgreSQL (optional) | 后续任务持久化 |
| React + Vite (frontend/) | 前端界面（开发中） |

---

## 🚀 Quick Start / 快速开始

### 1. Clone & Install / 克隆项目并安装依赖

```bash
git clone https://github.com/Xu929-X1/ai-planner.git
cd ai-planner/ai-planner-backend
npm install
```

### 2. Add API Key / 配置 OpenAI API 密钥

```bash
cp .env.example .env
```

#### .env
```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Start backend / 启动后端服务

```bash
npm run start:dev
```

#### 4. Test API / 测试接口

```bash 
curl -X POST http://localhost:3000/planner \
  -H "Content-Type: application/json" \
  -d '{"input": "明天下午三点健身两个小时"}'
```
## 📌TODO（MVP 阶段）| TODO (MVP Phase)

-[x] 实现自然语言解析任务的后端 API | Implement backend API for natural language task parsing

 -[] 接入 Google Calendar 同步 | Integrate with Google Calendar

 -[] 实现前端界面（输入+结果展示）| Build frontend interface (input + result display)

 -[] 添加用户身份系统（Google 登录）| Add user authentication system (Google Login)

 -[] 多任务支持（列表/批量）| Support multiple tasks (list / batch input)

 -[] 错误处理与用户反馈优化 | Improve error handling and user feedback

## 📄 License

MIT License