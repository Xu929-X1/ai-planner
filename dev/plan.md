# ✅ AI Planner 六周执行清单（任务追踪版）

> 分支：`feat/tools`
> 目标：MVP → 具备记忆与反思闭环
> 周期：6 周
> 更新：2025-10-15

---

## 🧩 Week 1 – Agent 接口重构

**目标：** 建立统一可扩展的 Agent 架构

☐ 创建基础接口 `IAgent`
☐ 拆分 Planner / Executor Agent
☐ 建立 `agentManager` 统一注册与调用
☐ 更新 `lib/ai/index.ts` 注册全部 Agent
☐ 验证调用流程正常运行

---

## 🧠 Week 2 – Pipeline & Memory Schema

**目标：** 实现 Planner→Executor→DB 的完整流水线；建立 Memory 表

☐ 更新 Prisma schema 增加 Memory 模型
☐ 执行数据迁移 `prisma migrate dev`
☐ 创建 `lib/memory/index.ts` 实现存取函数
☐ 新建 `lib/ai/pipeline.ts` 串联调用
☐ 修改 `app/api/plan/ai/route.ts` 接入 pipeline
☐ 验证 Memory 与 Plan/Task/AgentRun 正常写入

---

## 🎨 Week 3 – UI/UX 重构 + 记忆写入

**目标：** 优化交互体验；在会话结束时写入记忆

☐ 新建 Dashboard 三栏布局
☐ 创建 AgentOutputCard 通用输出组件
☐ 改造 PlanView 支持 inline 编辑与状态切换
☐ 增加 Chat Skeleton 与 AI 思考中提示
☐ 会话结束时自动写入 Memory

---

## ⚙️ Week 4 – 类型安全 + Middleware 层

**目标：** 统一模型调用方式；强化类型与验证

☐ 创建 `types/ai.ts`
☐ 新建中间件层 `lib/ai/middleware.ts`
☐ 增加输入验证 `lib/utils/validator.ts`
☐ 配置 ESLint + Prettier + TS Strict
☐ 配置 GitHub Action CI 检查 lint/type/test

---

## 🧮 Week 5 – Reviewer Agent + 行为驱动反思

**目标：** 用户行为触发 AI 自动总结并写入记忆

☐ 新建 Reviewer Agent 进行计划审查
☐ 在任务状态变更时触发 Reviewer
☐ AgentManager 调用前检索相关 Memory
☐ 创建 ReflectionCard 展示反思输出
☐ 验证记忆检索与反思闭环生效

---

## 🧪 Week 6 – 测试 + Demo + 扩展接口

**目标：** 验证闭环；准备展示与后续功能

☐ 编写 pipeline 测试
☐ 编写 memory 测试
☐ 新建 scheduler 模块保留定时反思接口
☐ 更新 README 增加架构说明与图示
☐ 优化 Vercel 部署与环境变量验证
☐ 录制 Demo 视频或截图展示

---

## 🔁 后续延伸

☐ Memory Summarization：聚合记忆，降低成本
☐ Reflection Scheduler：定时反思（Supabase/Upstash）
☐ Agent Loop：主动触发任务
☐ Memory Visualization：Embedding 图谱可视化
