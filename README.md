# AI Planner 🧠📅

An AI-powered schedule assistant. Users input natural language like  
"Workout at 3 PM tomorrow for 2 hours", and the system will parse it into structured tasks with title, start_time, and end_time.

一个由 AI 驱动的智能日程助手。用户输入自然语言描述（如：“明天下午三点健身两个小时”），系统将其解析为结构化的日程任务（标题、开始时间、结束时间）。

---

## ✨ Features / 功能亮点

- 🧠 Understands natural language using OpenAI Function Calling  
- 🗓 Outputs structured event objects: title, start_time, end_time  
- ⚙️ Built with NestJS for modular backend structure  
- 🚀 Designed for frontend-backend separation (React + NestJS)  
- ✅ MVP stage focused on fast iteration and core value
  
  ---
- 🧠 使用 OpenAI Function Calling 解析自然语言
- 🗓 输出结构化的日程事件：标题、开始时间、结束时间
- ⚙️ 使用 NestJS 搭建后端，结构清晰、易扩展
- 🚀 前后端分离架构（React + NestJS）
- ✅ 当前为 MVP 阶段，核心功能优先，快速验证思路

---

## 🔧 Tech Stack / 技术栈

| 技术 / Tech        | 用途 / Purpose        |
|-------------------|------------------------|
| NestJS            | Backend framework      |
| OpenAI API        | Language understanding |
| TypeScript        | Type-safe development  |
| React + Vite      | Frontend (planned)     |
| PostgreSQL        | Data storage (planned) |

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