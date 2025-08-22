# 🤖 AI Planner

An intelligent planning application that combines AI-powered task management with real-time data access through MCP (Model Context Protocol) integration.

## ✨ Features

### 🎯 Core Planning
- **AI-Powered Planning**: Natural language task and project creation
- **Smart Dependencies**: Simple task dependencies with visual indicators
- **Timeline Views**: Clear project timelines without Gantt complexity
- **Contextual AI**: AI agents with live access to your current plans and tasks

### 💬 Intelligent Chat Interface
- **Conversational Planning**: Plan projects through natural conversation
- **Context-Aware Responses**: AI remembers your previous conversations
- **Real-Time Suggestions**: Get AI insights based on your current workload
- **Multi-Modal Responses**: Text, structured plans, and actionable tasks

### 📊 Data Management
- **Live Database Integration**: MCP server provides real-time data access to AI
- **Persistent Planning**: All plans and tasks saved to PostgreSQL
- **User Authentication**: Secure JWT-based authentication
- **Conversation History**: Full chat history with plan associations

### 🔧 Developer Experience
- **MCP Integration**: Standardized AI-to-database communication
- **Type-Safe APIs**: Full TypeScript integration with Prisma
- **Modern Stack**: Next.js 14, React, Tailwind CSS
- **Extensible Architecture**: Easy to add new data sources and AI capabilities

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-4, LangChain
- **MCP**: Model Context Protocol for AI-database integration
- **Authentication**: JWT with secure HTTP-only cookies

### System Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │    │   Next.js API    │    │   PostgreSQL    │
│                 │◄──►│                  │◄──►│                 │
│ - Chat UI       │    │ - Auth routes    │    │ - Users         │
│ - Task mgmt     │    │ - CRUD APIs      │    │ - Plans         │
│ - Timeline view │    │ - AI endpoints   │    │ - Tasks         │
└─────────────────┘    └──────────────────┘    │ - Conversations │
                                ▲               └─────────────────┘
                                │
                       ┌──────────────────┐
                       │   MCP Server     │
                       │                  │
                       │ - Live data      │
                       │ - AI tools       │
                       │ - Resources      │
                       └──────────────────┘
                                ▲
                       ┌──────────────────┐
                       │   AI Agents      │
                       │                  │
                       │ - LangChain      │
                       │ - OpenAI GPT-4   │
                       │ - Planning logic │
                       └──────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-planner.git
   cd ai-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   # Also install MCP SDK for AI integration
   npm install @modelcontextprotocol/sdk
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   AIPLANNER_POSTGRES_URL="postgresql://username:password@localhost:5432/ai_planner"
   
   # OpenAI
   OPENAI_API_KEY="sk-your-openai-api-key"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key"
   
   # App
   NODE_ENV="development"
   ```

4. **Database setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # (Optional) Seed with sample data
   npx prisma db seed
   ```

5. **Start development servers**
   
   **Terminal 1** - Next.js app:
   ```bash
   npm run dev
   ```
   
   **Terminal 2** - MCP server:
   ```bash
   node mcp-planner-server.js
   ```

6. **Open the application**
   ```
   http://localhost:3000
   ```

## 📖 Usage

### Basic Planning
1. **Sign up/Login** at `/login` or `/register`
2. **Start chatting** at `/chat` - describe what you want to plan
3. **AI creates structured plans** with tasks, dependencies, and timelines
4. **Manage tasks** directly in the UI or continue chatting for updates

### Example Conversations

**Simple Task Creation:**
```
User: "I need to prepare for my job interview next week"

AI: Creates a structured plan with tasks like:
- Research the company (2h)
- Prepare answers for common questions (3h) 
- Choose outfit and print resume (1h)
- Mock interview practice (2h)
```

**Complex Project Planning:**
```
User: "Help me plan a website redesign project for my business"

AI: Creates a comprehensive plan with dependencies:
1. Audit current website (blocked: none)
2. Research competitors (blocked: none)  
3. Create wireframes (blocked: audit, research)
4. Design mockups (blocked: wireframes)
5. Develop website (blocked: mockups)
6. Test and launch (blocked: development)
```

**Progress Updates:**
```
User: "I finished the research task, what should I focus on next?"

AI: Analyzes your current tasks and suggests the optimal next steps
```

### MCP Integration Benefits

The AI can now:
- **See your current tasks** before making suggestions
- **Avoid duplicate work** by checking existing plans
- **Make realistic recommendations** based on your workload
- **Update tasks automatically** when you complete items
- **Provide personalized insights** about your productivity patterns

## 🛠️ Development

### Project Structure
```
├── app/
│   ├── api/                 # Next.js API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── plan/           # Plan CRUD + AI endpoints
│   │   ├── task/           # Task management
│   │   └── utils.ts        # API utilities
│   ├── chat/               # Chat interface
│   ├── login/              # Authentication pages
│   └── generated/          # Prisma generated types
├── components/             # React components
│   ├── UI/                 # shadcn/ui components  
│   ├── Calendar/           # Timeline and calendar views
│   └── ...                 # Feature components
├── lib/
│   ├── ai/                 # AI agents and logic
│   │   ├── Agents.ts       # Core planning agents
│   │   └── state.ts        # Conversation management
│   ├── prisma.ts           # Database client
│   └── utils.ts            # Utilities
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── mcp-planner-server.js   # MCP server for AI integration
└── contexts/               # React contexts
```

### Key APIs

**Planning Endpoints:**
- `POST /api/plan/ai` - AI-powered planning (enhanced with MCP)
- `GET /api/plan` - Get user's plans
- `PUT /api/plan/[id]` - Update plan
- `DELETE /api/plan/[id]` - Delete plan

**Task Management:**
- `GET /api/task/[id]` - Get task details
- `PUT /api/task/[id]` - Update task (status, dependencies, etc.)
- `DELETE /api/task/[id]` - Delete task

**MCP Tools (AI Access):**
- `get_user_dashboard` - Complete user overview
- `search_tasks` - Filter and find tasks
- `create_plan` - Create new plans
- `create_task` - Create tasks with dependencies
- `update_task_status` - Update task progress
- `get_upcoming_tasks` - Get deadlines and priorities

### Database Schema

**Core Models:**
```prisma
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
  // ... relationships
}

model Plan {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  status      StatusCd
  priority    Int?
  dueDate     DateTime?
  userId      Int
  Tasks       Task[]
  // ... relationships
}

model Task {
  id              Int       @id @default(autoincrement()) 
  title           String
  description     String?
  status          StatusCd
  priority        Int?
  dueDate         DateTime?
  estimatedHours  Int?
  blockedByTaskId Int?      // Simple dependencies
  userId          Int
  planId          Int?
  // ... relationships
}

model Conversation {
  id       Int       @id @default(autoincrement())
  title    String
  userId   Int  
  messages Message[]
  // ... AI conversation tracking
}
```

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma`
2. **API Routes**: Add endpoints in `app/api/`
3. **MCP Tools**: Extend `mcp-planner-server.js` with new tools
4. **AI Agents**: Update prompts in `lib/ai/Agents.ts`
5. **UI Components**: Create React components in `components/`

## 🔒 Security

- **JWT Authentication**: Secure HTTP-only cookies
- **API Protection**: All routes require authentication
- **MCP Security**: Server validates user permissions for all operations
- **Input Validation**: Zod schemas for API validation
- **SQL Injection Protection**: Prisma ORM with parameterized queries

## 🚀 Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
AIPLANNER_POSTGRES_URL="your-production-db-url"
OPENAI_API_KEY="your-openai-key"
JWT_SECRET="your-production-jwt-secret"
```

### Deployment Options

**Vercel (Recommended):**
1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically on push

**Docker:**
```bash
# Build and run the application
docker build -t ai-planner .
docker run -p 3000:3000 ai-planner
```

**Traditional VPS:**
```bash
# Build the application
npm run build

# Start with PM2
pm2 start npm --name "ai-planner" -- start
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make changes** and add tests
4. **Commit changes** (`git commit -m 'Add amazing feature'`)
5. **Push to branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Add Prisma migrations for schema changes
- Update MCP tools when adding new data operations
- Write tests for new AI agent functionality
- Update this README for new features

## 📚 Technology Deep Dive

### MCP (Model Context Protocol) Integration
This project pioneers the use of MCP for AI-database integration:

**What is MCP?**
- Standardized protocol for AI systems to access external data
- Provides tools (actions) and resources (data) to AI agents
- Enables real-time, contextual AI responses

**Benefits in AI Planner:**
- AI sees your current tasks before making suggestions
- Automatic data persistence when AI creates plans
- Consistent, structured data access across all AI operations
- Easy to extend with new data sources (calendars, emails, etc.)

### AI Agent Architecture
- **Planning Agent**: Creates structured plans from natural language
- **Context Agent**: Summarizes conversation history
- **Enhanced Agent**: Combines planning with live data access via MCP
- **Function Calling**: OpenAI function calling for tool selection
- **Schema Validation**: Zod schemas ensure consistent AI outputs

## 🗺️ Roadmap

### Version 1.0 (Current)
- ✅ Basic AI planning
- ✅ Task dependencies
- ✅ MCP integration
- ✅ Chat interface
- ✅ User authentication

### Version 1.1 (Next)
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Mobile responsiveness improvements
- [ ] Advanced timeline views

### Version 2.0 (Future)
- [ ] Full Gantt charts
- [ ] Team collaboration
- [ ] Integration with external tools (Google Calendar, Slack)
- [ ] Advanced AI insights and analytics
- [ ] Mobile app

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for GPT-4 API
- [Anthropic](https://anthropic.com) for MCP protocol
- [Vercel](https://vercel.com) for Next.js framework
- [Prisma](https://prisma.io) for database toolkit
- [shadcn/ui](https://ui.shadcn.com) for UI components

---

**Built with ❤️ for better productivity and planning**