# QST智能学习助手 智慧校园项目实战课程

## 理论讲解

### 1.1 大模型应用开发概述

大模型应用开发是当前人工智能领域最具活力的方向之一。随着 GPT-4、Claude、DeepSeek 等大语言模型的开放 API，越来越多的开发者开始探索如何将这些强大的能力集成到实际应用中。然而，直接调用大模型 API 只是第一步，真正构建有价值的应用需要掌握一系列核心技术，包括智能体开发、检索增强生成（RAG）、工作流编排和安全防护等。

QST智能学习助手 项目是一个完整的智慧校园实战案例，系统性地集成了 LangChain 生态的核心能力。项目采用模块化设计，分为五个渐进式阶段，每个阶段对应大模型应用开发的关键特性，帮助开发者从基础到高级系统掌握智能体开发技术。这种设计不仅是一个可运行的生产级系统，更是一套完整的教学实训体系，让学习者在实践中理解大模型应用开发的核心理念和最佳实践。

本课程的核心价值在于：它不仅提供了一套可运行的代码，更展示了大模型应用开发的最佳实践。从模块化设计到分层架构，从工具集成到安全保障，每个方面都体现了深思熟虑的技术选择。这些设计选择既有理论依据，也经过实践验证，是学习大模型应用开发的宝贵参考资料。

### 1.2 项目架构设计理念

QST智能学习助手 项目采用经典的分层架构设计，从底层到顶层依次为：基础设施层、核心服务层、业务逻辑层和接口层。这种分层设计确保了各层之间的职责清晰、耦合度低，便于维护和扩展。

基础设施层位于架构最底部，提供数据库连接、日志系统、配置管理等基础能力。该层使用 PostgreSQL 作为主数据库，通过 SQLAlchemy ORM 框架实现对象关系映射，支持同步和异步两种操作模式。日志系统采用 Loguru 库，提供结构化日志输出和多种输出格式支持。配置管理使用 Pydantic Settings，实现环境变量和 .env 文件的自动加载，确保配置的安全性和灵活性。

核心服务层位于基础设施层之上，封装了所有与业务无关的通用能力。主要包括：模型封装模块（提供统一的 LLM 接口）、工具系统（集成时间、计算器、文件系统、网络搜索等工具）、提示词模板系统、RAG 组件（文档加载、文本分块、向量化、向量存储、检索器）以及安全机制模块。该层的设计遵循"组合优于继承"的原则，通过灵活的组件组合满足不同业务场景的需求。

业务逻辑层位于架构的中间位置，实现各业务场景的具体逻辑。主要包括：基础 Agent 模块（提供通用的智能体封装）、RAG Agent 模块（实现知识库问答）、工作流引擎模块（基于 LangGraph 实现复杂任务编排）、深度研究模块（多智能体协作系统）以及安全 Agent 模块（在普通 Agent 基础上增加安全防护层）。该层充分利用核心服务层提供的组件，通过不同的组合方式实现丰富的业务功能。

接口层位于架构最顶层，通过 FastAPI 框架对外提供 RESTful API 接口。该层负责请求的接收、参数校验、响应格式化等横切关注点的处理，将业务逻辑层的复杂实现封装为简洁的 API 接口。接口层还集成了 CORS 中间件、健康检查端点、Prometheus 监控指标采集等辅助功能。

### 1.3 技术栈选型原则

项目的技术栈选型遵循"成熟稳定、社区活跃、生态完善"的原则，确保项目能够长期稳定发展。后端技术栈以 Python 3.10+ 为编程语言基础，Python 凭借其简洁的语法、丰富的库生态和强大的社区支持，成为大模型应用开发的首选语言。核心框架采用 LangChain 1.0.3 和 LangGraph 1.0.2，这两个框架由 LangChain 团队开发和维护，提供了构建智能体和工作流的完整解决方案。

LangChain 是目前最流行的 LLM 应用开发框架，它提供了一系列抽象层，将不同 LLM 提供商的 API 统一起来，让开发者可以轻松切换模型。LangGraph 则是 LangChain 的扩展，专注于构建复杂的有状态工作流，支持多步骤任务、状态持久化、人机交互、自动重试等高级特性。两者的结合为构建复杂的 AI 应用提供了强大的基础设施。

Web 框架选用 FastAPI 0.121.0，其异步原生支持、高性能、自动 API 文档生成等特性非常适合 AI 应用场景。FastAPI 的异步能力可以有效处理 LLM API 调用带来的延迟，让服务器能够同时处理大量并发请求。自动生成的 OpenAPI 文档便于前后端协作开发，大大提高了开发效率。

向量数据库默认使用 FAISS，FAISS 是 Facebook 开发的向量检索库，提供了高效的相似度搜索和聚类功能，非常适合 RAG 场景。数据验证采用 Pydantic 2.12.4 的完整类型系统，Pydantic 是 Python 中最流行的数据验证库，它提供了声明式的数据定义方式和自动的运行时验证。日志系统使用 Loguru 提供优雅的日志输出体验，Loguru 的 API 比标准 logging 库更加简洁美观。

## 实操步骤

### 2.1 环境配置与项目初始化

首先，确保你的开发环境满足以下要求：Python 3.10 或更高版本、pip 包管理器、Git 版本控制工具。建议使用 Conda 或 venv 创建独立的虚拟环境，避免依赖冲突。

克隆项目仓库并进入项目目录：

```bash
git clone https://github.com/your-repo/lc-studylab.git
cd lc-studylab
```

创建并激活虚拟环境：

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
.\venv\Scripts\activate  # Windows
```

安装项目依赖：

```bash
cd backend
pip install -r requirements.txt
```

配置环境变量，复制 .env.example 为 .env 文件：

```bash
cp .env.example .env
```

编辑 .env 文件，设置必要的 API 密钥和配置：

```bash
# LLM 配置
OPENAI_API_KEY=your-api-key-here
OPENAI_MODEL=gpt-4o
OPENAI_API_BASE=https://api.openai.com/v1

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/lc_studylab

# 向量数据库配置
VECTOR_STORE_PATH=./data/vector_store

# 日志配置
LOG_LEVEL=INFO
```

### 2.2 基础 Agent 开发实践

让我们从最简单的 Agent 开始，理解 LangChain Agent 的基本工作原理。首先创建我们的第一个 Agent：

```python
# examples/01_basic_agent.py
"""
基础 Agent 示例
使用 LangChain 1.0.3 的 create_agent API 实现最简单的智能体
"""

from agents.base_agent import BaseAgent
from core.tools import get_current_time, calculator
from config import get_logger

logger = get_logger(__name__)


def main():
    """运行基础 Agent 示例"""
    logger.info("🚀 启动基础 Agent 示例")
    
    # 创建 Agent，传入工具列表
    agent = BaseAgent(
        tools=[get_current_time, calculator],
        prompt_mode="default",
        debug=False
    )
    
    # 测试各种查询
    test_queries = [
        "现在几点了？",
        "计算 123 * 456",
        "计算 (10 + 5) * 2 - 30",
        "今天是哪一年？"
    ]
    
    for query in test_queries:
        logger.info(f"\n{'='*50}")
        logger.info(f"📝 用户提问: {query}")
        logger.info(f"{'='*50}")
        
        # 非流式调用
        response = agent.invoke(query)
        logger.info(f"🤖 回答: {response}")


if __name__ == "__main__":
    main()
```

运行这个示例：

```bash
cd /home/dy/lc-studylab-main
python examples/01_basic_agent.py
```

你会看到 Agent 能够自动识别问题类型，调用合适的工具获取答案。当问时间时，Agent 会调用时间工具；当问计算问题时，Agent 会调用计算器工具。这种工具自动选择的能力是 Agent 的核心特性之一。

接下来，我们尝试流式输出，这在实际应用中非常重要：

```python
# examples/02_streaming_agent.py
"""
流式 Agent 示例
展示如何获取实时的 token 生成过程
"""

from agents.base_agent import BaseAgent
from core.tools import web_search
import asyncio


async def main():
    """运行流式 Agent 示例"""
    print("🌊 启动流式 Agent 示例\n")
    
    # 创建带搜索工具的 Agent
    agent = BaseAgent(
        tools=[web_search],
        prompt_mode="research",
        debug=False
    )
    
    query = "介绍人工智能的发展历史"
    print(f"📝 用户提问: {query}\n")
    print("🤖 回答: ", end="", flush=True)
    
    # 流式调用
    async for chunk in agent.astream(query):
        print(chunk, end="", flush=True)
    print("\n")


if __name__ == "__main__":
    asyncio.run(main())
```

### 2.3 RAG 知识库系统构建

RAG（Retrieval-Augmented Generation）是构建知识密集型应用的核心技术。让我��学习如何构建一个完整的 RAG 系统。

首先，我们需要准备文档数据。RAG 系统支持多种文档格式：

```python
# examples/03_document_loading.py
"""
文档加载示例
展示如何加载不同格式的文档
"""

import os
from rag.loaders import load_document
from rag.splitters import recursive_split
from config import get_logger

logger = get_logger(__name__)


def main():
    """演示文档加载和分块"""
    
    # 文档路径
    doc_path = "./data/documents"
    
    # 支持的文档格式
    examples = [
        ("sample.pdf", "PDF 文档"),
        ("readme.md", "Markdown 文档"),
        ("notes.txt", "纯文本文件"),
        ("data.json", "JSON 数据文件"),
        ("article.html", "HTML 网页")
    ]
    
    for filename, description in examples:
        filepath = os.path.join(doc_path, filename)
        if os.path.exists(filepath):
            logger.info(f"📄 加载 {description}: {filename}")
            
            # 加载文档
            documents = load_document(filepath)
            logger.info(f"   加载了 {len(documents)} 个文档块")
            
            # 分块处理
            chunks = recursive_split(documents, chunk_size=500, chunk_overlap=50)
            logger.info(f"   分割为 {len(chunks)} 个文本块")
        else:
            logger.warning(f"⚠️  文件不存在: {filepath}")


if __name__ == "__main__":
    main()
```

接下来，创建向量索引：

```python
# examples/04_build_vector_index.py
"""
向量索引构建示例
展示如何创建和持久化向量索引
"""

import os
from rag import load_document, recursive_split, get_embeddings, load_vector_store, create_vector_store
from config import get_logger

logger = get_logger(__name__)


def main():
    """构建向量索引"""
    
    # 1. 准备文档目录
    docs_dir = "./data/documents"
    index_dir = "./data/indexes/sample"
    
    # 2. 加载并分块文档
    logger.info("📚 加载文档...")
    all_documents = []
    
    for filename in os.listdir(docs_dir):
        if filename.endswith(('.md', '.txt', '.pdf')):
            filepath = os.path.join(docs_dir, filename)
            docs = load_document(filepath)
            all_documents.extend(docs)
    
    logger.info(f"   加载了 {len(all_documents)} 个文档")
    
    # 3. 分块处理
    logger.info("✂️  分割文档...")
    chunks = recursive_split(all_documents, chunk_size=1000, chunk_overlap=100)
    logger.info(f"   生成了 {len(chunks)} 个文本块")
    
    # 4. 创建 Embedding
    logger.info("🔢 生成向量...")
    embeddings = get_embeddings()
    
    # 5. 创建向量存储
    logger.info("💾 创建向量索引...")
    vector_store = create_vector_store(
        embedding=embeddings,
        persist_directory=index_dir
    )
    
    # 6. 添加文档到向量库
    logger.info("📥 添加文档到向量库...")
    vector_store.add_documents(chunks)
    
    # 7. 保存索引
    logger.info("✅ 索引构建完成！")
    logger.info(f"   索引保存位置: {index_dir}")


if __name__ == "__main__":
    main()
```

最后，创建一个 RAG Agent 来回答问题：

```python
# examples/05_rag_agent.py
"""
RAG Agent 示例
展示如何基于知识库构建问答系统
"""

import os
from rag import load_vector_store, get_embeddings, create_retriever, create_rag_agent
from config import get_logger

logger = get_logger(__name__)


def main():
    """运行 RAG 问答示例"""
    
    # 1. 加载向量索引
    index_dir = "./data/indexes/sample"
    
    if not os.path.exists(index_dir):
        logger.error("❌ 索引不存在，请先运行 04_build_vector_index.py")
        return
    
    logger.info("📚 加载向量索引...")
    embeddings = get_embeddings()
    vector_store = load_vector_store(index_dir, embeddings)
    logger.info(f"   索引包含 {len(vector_store.docstore._dict)} 个文档")
    
    # 2. 创建检索器
    logger.info("🔍 创建检索器...")
    retriever = create_retriever(
        vector_store=vector_store,
        search_type="similarity",
        k=5
    )
    
    # 3. 创建 RAG Agent
    logger.info("🤖 创建 RAG Agent...")
    agent = create_rag_agent(retriever=retriever)
    
    # 4. 问答测试
    questions = [
        "项目的技术栈是什么？",
        "如何配置环境变量？",
        "Agent 模块有哪些功能？",
        "RAG 系统支持哪些文档格式？"
    ]
    
    for question in questions:
        logger.info(f"\n{'='*50}")
        logger.info(f"📝 问题: {question}")
        logger.info(f"{'='*50}")
        
        response = agent.invoke(question)
        logger.info(f"🤖 回答: {response}")


if __name__ == "__main__":
    main()
```

### 2.4 LangGraph 工作流开发

LangGraph 是构建复杂 AI 工作流的强大工具，让我们通过一个实际案例来学习：

```python
# examples/06_study_workflow.py
"""
智能学习工作流示例
展示如何编排多步骤的 AI 工作流
"""

from workflows.study_flow_graph import create_study_workflow
from config import get_logger

logger = get_logger(__name__)


def main():
    """运行智能学习工作流示例"""
    
    # 创建工作流
    logger.info("🔨 创建智能学习工作流...")
    app = create_study_workflow()
    
    # 初始输入
    initial_state = {
        "topic": "Python 面向对象编程",
        "learning_goal": "理解类、对象、继承和多态的概念",
        "user_level": " intermediate"
    }
    
    logger.info(f"📝 学习主题: {initial_state['topic']}")
    logger.info(f"🎯 学习目标: {initial_state['learning_goal']}")
    
    # 收集用户输入（模拟）
    print("\n" + "="*50)
    print("📖 开始智能学习之旅")
    print("="*50)
    
    # 运行工作流
    config = {"configurable": {"thread_id": "study-001"}}
    
    # 规划阶段
    logger.info("\n📋 阶段 1: 制定学习计划")
    for event in app.stream({"events": [{"type": "planning"}]}, config, stream_mode="events"):
        print(f"   {event}")
    
    # 检索阶段
    logger.info("\n🔍 阶段 2: 检索学习资料")
    for event in app.stream({"events": [{"type": "retrieval"}]}, config, stream_mode="events"):
        print(f"   {event}")
    
    # 生成题目
    logger.info("📝 阶段 3: 生成练习题目")
    for event in app.stream({"events": [{"type": "quiz_generation"}]}, config, stream_mode="events"):
        print(f"   {event}")


if __name__ == "__main__":
    main()
```

### 2.5 多智能体协作系统

深度研究模块展示了如何构建多智能体协作系统：

```python
# examples/07_deep_research.py
"""
深度研究示例
展示多智能体协作系统的使用方法
"""

import asyncio
from deep_research import DeepResearcher
from config import get_logger

logger = get_logger(__name__)


async def main():
    """运行深度研究示例"""
    
    # 创建研究者
    researcher = DeepResearcher()
    
    # 研究主题
    topic = "大语言模型在教育领域的应用"
    
    logger.info(f"🎯 开始深度研究: {topic}")
    
    # 运行研究
    result = await researcher.research(topic)
    
    # 输出结果
    logger.info("\n" + "="*50)
    logger.info("📊 研究报告")
    logger.info("="*50)
    logger.info(f"\n{result['report']}")
    
    # 输出参考资料
    logger.info("\n📚 参考资料:")
    for i, source in enumerate(result['sources'], 1):
        logger.info(f"   {i}. {source}")


if __name__ == "__main__":
    asyncio.run(main())
```

## 教学要点

### 3.1 Agent 设计的核心原则

在设计 Agent 系统时，需要遵循几个核心原则。首先是职责分离原则，每个工具应该只做一件事，并且做好这件事。工具的粒度太粗会导致灵活性不足，粒度太细则会增加 Agent 调用的复杂性。找到合适的粒度是 Agent 设计的艺术所在。

其次是错误处理原则，Agent 系统需要优雅地处理各种错误情况，包括网络超时、API 限流、工具执行失败等。在 QST智能学习助手 项目中，每个工具都实现了完善的错误处理逻辑，确保单个工具的失败不会导致整个 Agent 系统崩溃。

第三是状态管理原则，对于复杂的对话场景，需要妥善管理对话历史和上下文信息。LangGraph 的检查点机制提供了状态持久化的能力，让 Agent 能够在中断后恢复执行。

### 3.2 RAG 系统的优化策略

构建高效的 RAG 系统需要注意几个关键点。文档预处理的质量直接影响检索效果，在实际项目中，建议投入足够的时间优化文档的分块策略。块的大小需要权衡：太小的块可能丢失上下文信息，太大的块则可能引入噪声。

检索策略的选择也很重要。相似度检索返回最相似的文档，但可能遗漏相关内容；MMR 检索在相关性和多样性之间取得平衡；阈值检索可以过滤低质量的检索结果。在实际应用中，可以组合使用多种检索策略。

查询改写是提升 RAG 效果的有效手段。用户的原始问题可能不够清晰或包含歧义，通过查询改写可以生成更适合检索的查询表达式。常见的改写策略包括：同义词扩展、分解复杂问题、添加上下文信息等。

### 3.3 工作流编排的注意事项

使用 LangGraph 编排工作流时，需要注意状态设计和工作流结构。状态类应该包含所有需要跨节点传递的信息，同时避免不必要的字段。每个状态字段都应该有明确的类型定义，便于调试和错误检测。

节点设计应该遵循单一职责原则，每个节点只完成一个特定的任务。节点之间通过状态传递信息，而不是直接调用其他节点的方法。这种设计让工作流更容易理解和维护。

人机交互（Human-in-the-Lop）是工作流的重要特性。通过设置中断点，可以暂停工作流执行，等待用户确认或输入。这种机制在需要人工审核、复杂决策、错误恢复等场景中非常有用。

### 3.4 常见错误与调试技巧

在开发 Agent 系统时，常见的错误包括：工具调用死循环、上下文长度溢出、模型响应不稳定等。QST智能学习助手 项目总结了以下调试技巧：

使用递归深度限制防止无限循环，通过配置 recursion_limit 参数控制最大递归次数。监控工具调用的次数和时间，及时发现异常情况。使用 LangGraph 的检查点功能保存执行状态，便于问题回溯和调试。

日志记录是调试的重要手段，项目采用结构化日志格式，便于搜索和分析。建议在关键路径添加详细日志，包括输入参数、执行步骤、输出结果等信息。

## 课后作业

### 基础作业

**作业 1：自定义工具开发**

开发一个天气查询工具，集成到 Agent 系统中。要求：
- 创建新的工具文件 `weather_tool.py`
- 实现 `get_weather(city: str) -> str` 函数
- 工具需要处理异常情况（城市不存在、网络错误等）
- 在 Agent 中集成并测试该工具

**作业 2：文档索引优化**

优化 RAG 系统的文档索引，要求：
- 实现自定义的分块策略
- 添加文档元数据（标题、来源、日期等）
- 实现 MMR 检索策略
- 对比不同策略的检索效果

### 中级作业

**作业 3：对话式 RAG Agent**

构建支持多轮对话的 RAG Agent，要求：
- 实现对话历史的存储和管理
- 支持指代消解（理解"它"、"这个"等指代词）
- 实现对话状态的持久化
- 添加对话历史的摘要功能

**作业 4：自定义工作流节点**

添加一个新的工作流节点，要求：
- 设计节点的功能和状态变更
- 实现节点的完整逻辑
- 集成到现有工作流中
- 测试节点在不同情况下的行为

### 高级作业

**作业 5：多智能体辩论系统**

设计一个多智能体辩论系统，要求：
- 创建至少 3 个不同立场的智能体
- 实现论点生成和反驳机制
- 设计辩论流程和终止条件
- 实现辩论结果的总结和评估

**作业 6：安全防护增强**

增强系统的安全防护能力，要求：
- 实现自定义的内容过滤器
- 添加 Prompt Injection 检测
- 实现敏感信息的自动脱敏
- 添加安全等级的动态调整

## 代码示例

### 示例 1：工具定义模板

```python
# core/tools/template.py
"""
自定义工具模板
用于创建新的工具时参考
"""

from langchain_core.tools import tool
from typing import Optional
from pydantic import Field


@tool
def custom_tool(
    input_param: str = Field(
        description="输入参数的说明"
    ),
    optional_param: Optional[str] = Field(
        default=None,
        description="可选参数的说明"
    )
) -> str:
    """
    工具的详细说明，会被 Agent 解析和使用。
    
    Args:
        input_param: 主要输入参数的说明
        optional_param: 可选参数的说明
    
    Returns:
        工具执行结果的字符串描述
    """
    # 工具实现逻辑
    result = f"处理结果: {input_param}"
    
    if optional_param:
        result += f", 附加信息: {optional_param}"
    
    return result
```

### 示例 2：检索器配置

```python
# rag/retrievers.py
"""
检索器工厂函数
提供不同配置的检索器创建方法
"""

from langchain_core.retrievers import EnsembleRetriever
from rag.vector_stores import get_vector_store


def create_mmr_retriever(
    vector_store,
    k: int = 5,
    fetch_k: int = 20,
    lambda_mult: float = 0.5
):
    """
    创建 MMR（最大边际相关性）检索器
    
    MMR 在相关性和多样性之间取得平衡，
    避免返回内容重复的检索结果。
    """
    from langchain_core.retrievers import MMRRetriever
    
    return MMRRetriever(
        vectorstore=vector_store,
        search_type="mmr",
        search_kwargs={
            "k": k,
            "fetch_k": fetch_k,
            "lambda_mult": lambda_mult
        }
    )


def create_threshold_retriever(
    vector_store,
    score_threshold: float = 0.7
):
    """
    创建阈值过滤检索器
    
    只返回相似度分数高于阈值的文档，
    过滤低质量的检索结果。
    """
    from langchain_core.retrievers import VectorStoreRetriever
    
    return VectorStoreRetriever(
        vectorstore=vector_store,
        search_type="similarity_score_threshold",
        search_kwargs={
            "score_threshold": score_threshold
        }
    )


def create_ensemble_retriever(
    retrievers: list,
    weights: list = None
):
    """
    创建集成检索器
    
    组合多个检索器的结果，
    提高检索的鲁棒性。
    """
    if weights is None:
        weights = [1.0 / len(retrievers)] * len(retrievers)
    
    return EnsembleRetriever(
        retrievers=retrievers,
        weights=weights
    )
```

### 示例 3：工作流节点模板

```python
# workflows/nodes/template_node.py
"""
自定义工作流节点模板
用于创建新的工作流节点时参考
"""

from typing import TypedDict, Optional
from langchain_core.messages import BaseMessage
from workflows.nodes.base_node import BaseNode


class CustomNodeState(TypedDict):
    """自定义节点的状态定义"""
    input_data: str
    processing_result: Optional[str]
    output_data: Optional[str]
    error: Optional[str]


class CustomNode(BaseNode):
    """
    自定义工作流节点
    
    继承 BaseNode 实现工作流节点的基本框架，
    只需要实现具体的 execute 方法。
    """
    
    @property
    def state_schema(self):
        """返回状态类型定义"""
        return CustomNodeState
    
    @property
    def input_keys(self):
        """定义输入字段"""
        return ["input_data"]
    
    @property
    def output_keys(self):
        """定义输出字段"""
        return ["output_data", "processing_result"]
    
    def execute(self, state: CustomNodeState) -> CustomNodeState:
        """
        执行节点逻辑
        
        Args:
            state: 当前状态字典
            
        Returns:
            更新后的状态字典
        """
        input_data = state.get("input_data", "")
        
        try:
            # 业务逻辑处理
            result = self._process_data(input_data)
            
            return {
                "processing_result": result,
                "output_data": f"处理完成: {result}",
                "error": None
            }
            
        except Exception as e:
            return {
                "processing_result": None,
                "output_data": None,
                "error": str(e)
            }
    
    def _process_data(self, data: str) -> str:
        """具体的业务处理逻辑"""
        # 实现处理逻辑
        return f"processed_{data}"
```

### 示例 4：安全中间件配置

```python
# core/guardrails/middleware.py
"""
安全中间件配置
集成输入输出安全检查
"""

from fastapi import Request, Depends
from fastapi.security import HTTPBearer
from core.guardrails.middleware import GuardrailsMiddleware


def setup_guardrails_middleware(app):
    """
    配置安全中间件
    
    Args:
        app: FastAPI 应用实例
    """
    
    # 添加安全中间件
    app.add_middleware(
        GuardrailsMiddleware,
        # 输入检查配置
        input_checker={
            "enabled": True,
            "max_length": 10000,
            "blocked_keywords": ["admin", "root", "sudo"],
            "detect_injection": True
        },
        # 输出检查配置
        output_checker={
            "enabled": True,
            "max_length": 50000,
            "mask_sensitive": True,
            "sensitive_patterns": [
                r"\d{11}",  # 手机号
                r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",  # 邮箱
                r"\d{18}"  # 身份证号
            ]
        },
        # 安全等级配置
        security_level={
            "default": "SAFE",
            "api_key": "WARNING",
            "admin": "UNSAFE"
        },
        # 响应处理
        on_blocked_input=lambda request, reason: {
            "error": "blocked",
            "reason": reason
        },
        on_masked_output=lambda request, original, masked: {
            "warning": "output_masked",
            "original_length": len(original),
            "masked_length": len(masked)
        }
    )


# 依赖注入示例
async def verify_security_level(
    request: Request,
    security_level: str = "SAFE"
) -> bool:
    """
    安全等级验证依赖
    
    根据请求路径和参数确定需要的安全等级，
    检查当前安全配置是否满足要求。
    """
    # 实现安全等级验证逻辑
    return True
```

## 参考资料

### 官方文档

- LangChain 官方文档：https://docs.langchain.com/
- LangGraph 官方文档：https://docs.langgraph.com/
- FastAPI 官方文档：https://fastapi.tiangolo.com/
- Pydantic 官方文档：https://docs.pydantic.dev/

### 技术博客

- LangChain Blog：https://blog.langchain.dev/
- LangGraph Tutorial：https://github.com/langchain-ai/langgraph/tree/main/examples
- RAG Best Practices：https://github.com/langchain-ai/rag-chunking

### 社区资源

- LangChain Discord：https://discord.gg/langchain
- QST智能学习助手 GitHub：https://github.com/your-repo/lc-studylab
- Awesome LangChain：https://github.com/kyrol/awesome-langchain
