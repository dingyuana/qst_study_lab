# QST智能学习助手

> 一个基于 LangChain v1.0.3 的完整智能体学习与实践平台，涵盖 Agent、RAG、LangGraph、DeepAgents 和 Guardrails 等核心能力。

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![LangChain](https://img.shields.io/badge/LangChain-v1.0.3-green.svg)](https://docs.langchain.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-v1.0.2-orange.svg)](https://docs.langchain.com/oss/python/langgraph/)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](LICENSE)

## 项目简介

QST智能学习助手是一个以学习和研究为导向的 LangChain v1.0.3 全栈示例项目，系统性地集成了 LangChain 生态的核心能力。项目采用模块化设计，分为五个渐进式阶段，每个阶段对应 LangChain 文档中的关键特性，帮助开发者从基础到高级系统掌握智能体开发。

**核心定位**：

- 学习平台：系统学习 LangChain v1.0.3 的完整能力地图
- 实践模板：可直接用于构建生产级 AI 智能体系统
- 参考实现：展示最佳实践和设计模式

## 核心特性

### 阶段一：基础 Agent 与工具调用

- 基于 `create_agent` 的智能体封装
- 流式输出支持（Streaming）
- 工具调用系统（时间、计算器、网络搜索）
- FastAPI HTTP 接口
- CLI 交互式工具

### 阶段二：RAG 知识库系统

- 多格式文档加载（PDF、Markdown、TXT、HTML、JSON）
- 智能文本分块策略
- 向量索引构建与管理（FAISS）
- 多种检索策略（相似度、MMR、阈值过滤）
- RAG Agent 实现
- 完整的索引管理 API

### 阶段三：LangGraph 工作流

- 有状态工作流管理（StateGraph）
- 检查点持久化（SQLite）
- 人机交互（Human-in-the-Loop）
- 流式事件输出（SSE）
- 智能学习工作流（规划 → 检索 → 出题 → 评分 → 反馈）
- 自动重试机制

### 阶段四：DeepAgents 深度研究

- 多智能体协作系统
- 专业智能体分工（WebResearcher、DocAnalyst、ReportWriter）
- 研究计划生成与任务分解
- 文件系统工具集成
- 结构化报告生成

### 阶段五：Guardrails 安全机制

- 输入验证与清理
- 输出过滤与格式化
- Pydantic 模型定义
- 结构化数据验证
- 安全响应生成

## 快速开始

### 环境要求

- Python 3.10+
- Node.js 18+ (前端)
- OpenAI API Key

### 后端安装

```bash
cd backend
pip install -r requirements.txt
```

### 前端安装

```bash
cd frontend
pnpm install
```

### 配置环境变量

创建 `.env` 文件：

```env
OPENAI_API_KEY=your_api_key_here
```

### 启动服务

```bash
# 终端 1 - 启动后端
cd backend
python -m api.http_server

# 终端 2 - 启动前端
cd frontend
pnpm dev
```

访问 http://localhost:3000

## 技术栈

### 后端

- **FastAPI**: 现代高性能 Web 框架
- **LangChain v1.0.3**: LLM 应用开发框架
- **LangGraph**: 工作流编排引擎
- **Pydantic v2**: 数据验证与设置管理
- **Loguru**: 现代化日志库
- **SQLite**: 轻量级数据库（检查点存储）

### 前端

- **Next.js 16**: React 全栈框架
- **React 19**: UI 库
- **shadcn/ui**: UI 组件库
- **AI SDK**: Vercel AI SDK
- **Tailwind CSS**: 原子化 CSS

## 项目结构

```
QST智能学习助手/
├── backend/                 # FastAPI 后端
│   ├── api/                # API 路由
│   │   ├── routers/       # 路由模块
│   │   └── http_server.py # 服务器入口
│   ├── agents/            # Agent 模块
│   ├── core/              # 核心功能
│   │   ├── tools/         # 工具函数
│   │   ├── prompts.py     # 提示词模板
│   │   └── models.py      # 模型配置
│   ├── workflows/         # LangGraph 工作流
│   ├── deep_research/     # DeepAgents 模块
│   ├── config/            # 配置管理
│   └── docs/              # 阶段文档
├── frontend/              # Next.js 前端
│   ├── app/              # App Router 页面
│   ├── components/       # React 组件
│   └── lib/              # 工具函数
├── courseware/           # 课程教案
└── docker-compose.yml    # Docker 编排
```

## API 文档

启动服务后访问：

- Swagger UI: http://localhost:6000/docs
- ReDoc: http://localhost:6000/redoc

## Docker 部署

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 学习路径

建议按照以下顺序学习：

1. **阶段一**: 基础 Agent - 理解工具调用和流式输出
2. **阶段二**: RAG 知识库 - 掌握向量检索和文档处理
3. **阶段三**: LangGraph 工作流 - 学习状态管理和流程编排
4. **阶段四**: DeepAgents - 实践多智能体协作
5. **阶段五**: Guardrails - 了解安全防护机制

## 许可证

MIT License

## 贡献

欢迎贡献代码、文档和问题反馈！

---

**QST智能学习助手** - 让 LangChain 学习更简单，让智能体开发更高效。
