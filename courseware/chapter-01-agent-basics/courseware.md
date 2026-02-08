# 第一章：基础 Agent 与工具调用

## 理论讲解

### 1.1 智能体概述与核心概念

智能体（Agent）是大模型应用开发中最核心的概念之一，它是能够感知环境、理解任务、执行行动并从经验中学习的自主系统。与传统的程序不同，智能体不是简单地执行预定义的指令序列，而是能够根据上下文动态决定使用哪些工具、如何处理信息、以及如何达成目标。这种灵活性使得智能体能够处理开放域任务，应对用户的各种请求。

在 LangChain 框架中，智能体的概念得到了精心设计和实现。LangChain 1.0.3 引入了全新的 `create_agent` API，这是一个基于 LangGraph 构建的高级接口，它返回一个 `CompiledStateGraph` 实例。这个编译后的状态图内部已经实现了完整的工具调用循环、状态管理和流式输出支持，开发者只需要关注业务逻辑本身，而不必从头构建智能体的基础设施。这种设计大大降低了智能体开发的门槛，同时也保持了足够的灵活性以满足复杂场景的需求。

智能体的核心能力体现在三个方面：首先是理解能力，智能体需要理解用户的自然语言输入，提取关键信息和意图；其次是规划能力，智能体需要将复杂任务分解为可执行的步骤，决定调用哪些工具以及调用的顺序；第三是执行能力，智能体需要正确地调用各种工具，处理工具返回的结果，并根据结果调整后续的行动方案。这三种能力相互配合，使智能体能够完成从简单问答到复杂研究的各种任务。

### 1.2 工具调用系统架构

工具（Tools）是智能体与外部世界交互的桥梁。在 QST智能学习助手 项目中，工具系统采用模块化设计，每个工具都是独立的组件，遵循统一的接口规范。这种设计带来了多重好处：一方面，工具的实现可以非常专注和简洁，每个工具只做好一件事；另一方面，工具可以灵活组合，不同的智能体可以根据需要选择不同的工具集。

工具的定义基于 LangChain 的 `BaseTool` 抽象类，每个工具需要实现 `name`（工具名称）、`description`（工具描述）和 `_call` 或 `_arun` 方法（工具执行逻辑）。工具描述尤为重要，因为智能体会根据描述决定是否调用该工具。一个好的工具描述应该清晰说明工具的用途、参数格式和返回值类型，帮助智能体做出正确的调用决策。

工具调用循环是智能体的核心机制。当用户提出请求时，智能体会首先分析请求内容，判断是否需要调用工具。如果需要，智能体会选择合适的工具，准备参数，执行调用，处理结果，然后判断是否还需要进一步的工具调用。这个循环会持续进行，直到智能体认为任务已经完成。LangChain 的 `create_agent` API 已经内置了这个循环机制，并提供了丰富的配置选项，如递归深度限制、中断点设置、检查点存储等。

### 1.3 LangChain create_agent API 详解

`create_agent` 是 LangChain 1.0.3 中最重要的 API 之一，它封装了构建智能体所需的全部复杂性。理解这个 API 的工作原理对于有效使用它至关重要。这个函数接受三个核心参数：`model`（语言模型）、`tools`（可用工具列表）和 `system_prompt`（系统提示词），返回一个可执行的 `CompiledStateGraph` 实例。

`model` 参数指定了智能体使用的语言模型。在 LangChain V1.0.0 中，这个参数可以是字符串标识符（如 `"openai:gpt-4o"`）或 `BaseChatModel` 实例。字符串格式的优势在于可以方便地切换不同的模型提供商，只需更改前缀即可。LangChain 会自动解析这个字符串，初始化对应的模型实例，并使用环境变量中的 API Key 进行认证。

`tools` 参数是一个 `Sequence[BaseTool]` 类型的列表，包含了智能体可以调用的所有工具。如果传递空列表或 `None`，智能体将只包含模型节点，不会进行工具调用循环。这种设计允许开发者灵活控制智能体的能力范围，既可以创建纯聊天的智能体，也可以创建功能强大的工具调用智能体。

`system_prompt` 参数定义了智能体的行为准则和角色设定。一个精心设计的系统提示词应该包含智能体的职责描述、可用的工具说明、响应格式要求以及行为约束。系统提示词的质量直接影响智能体的表现，好的提示词可以让智能体更加可靠和高效。

### 1.4 流式输出与异步处理

流式输出（Streaming）是提升用户体验的关键技术。在传统的请求-响应模式中，用户需要等待模型生成完整的回答后才能看到任何内容，这种等待可能持续数十秒，严重影响交互体验。流式输出允许智能体在生成过程中逐步返回内容，让用户能够实时看到输出的进展，大大改善了感知延迟。

`create_agent` 返回的 `CompiledStateGraph` 原生支持多种流式模式。"messages" 模式是最常用的，它逐步返回生成的消息内容，包括中间的工具调用和工具结果。"updates" 模式返回状态更新信息，适合需要监控工作流进场的场景。"values" 模式返回完整的状态快照，适合需要访问历史状态的场景。开发者可以根据具体需求选择合适的流式模式。

异步处理是现代 AI 应用不可或缺的特性。LLM API 调用通常是 I/O 密集型操作，如果使用同步方式处理大量并发请求，服务器很容易成为瓶颈。LangChain 提供了完整的异步接口，包括 `ainvoke`、`astream` 和 `ainvoke` 等方法。这些方法基于 Python 的 `asyncio` 框架实现，能够在单线程内高效处理大量并发连接。配合 FastAPI 的异步能力，可以构建高性能的 AI 服务。

## 实操步骤

### 2.1 开发环境准备

在开始智能体开发之前，需要正确配置开发环境。首先确保 Python 版本满足要求，QST智能学习助手 项目需要 Python 3.10 或更高版本。可以使用以下命令检查当前 Python 版本：

```bash
python --version
```

如果版本不满足要求，建议使用 Conda 创建新的虚拟环境：

```bash
conda create -n lc-studylab python=3.11
conda activate lc-studylab
```

接下来安装项目依赖。进入 backend 目录，查看 requirements.txt 文件，然后使用 pip 安装：

```bash
cd backend
pip install -r requirements.txt
```

requirements.txt 通常包含以下核心依赖：

```
langchain>=1.0.3
langgraph>=1.0.2
langchain-openai>=0.1.0
fastapi>=0.121.0
uvicorn>=0.27.0
pydantic>=2.12.4
loguru>=0.7.2
python-dotenv>=1.0.0
```

安装完成后，需要配置环境变量。复制项目提供的环境变量模板：

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置 OpenAI API Key：

```bash
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o
OPENAI_API_BASE=https://api.openai.com/v1
```

建议同时配置日志级别，便于开发调试：

```bash
LOG_LEVEL=DEBUG
```

### 2.2 创建第一个基础 Agent

现在开始创建第一个基础 Agent。项目中的 Agent 实现位于 `backend/agents/` 目录下。首先查看现有的 BaseAgent 实现，理解其结构：

```python
# backend/agents/base_agent.py（核心代码解析）

from langchain.agents import create_agent
from langchain_core.language_models.chat_models import BaseChatModel

class BaseAgent:
    def __init__(
        self,
        model: Optional[Union[str, BaseChatModel]] = None,
        tools: Optional[Sequence[BaseTool]] = None,
        system_prompt: Optional[str] = None,
        prompt_mode: str = "default",
        debug: bool = False,
    ):
        # 模型初始化
        if model is None:
            self.model = f"openai:{settings.openai_model}"
        elif isinstance(model, str):
            self.model = model
        else:
            self.model = model
        
        # 工具初始化
        if tools is None:
            self.tools = BASIC_TOOLS
        else:
            self.tools = list(tools)
        
        # 创建 Agent
        self.graph = create_agent(
            model=self.model,
            tools=self.tools if self.tools else None,
            system_prompt=self.system_prompt,
            debug=self.debug,
        )
```

创建第一个测试文件：

```python
# examples/ch01/01_first_agent.py
"""
第一个基础 Agent 示例
学习如何使用 create_agent 创建智能体
"""

from agents.base_agent import BaseAgent
from core.tools import get_current_time, calculator
from config import get_logger

logger = get_logger(__name__)


def main():
    """运行基础 Agent 示例"""
    print("=" * 60)
    print("🚀 第一个基础 Agent - 时间与计算助手")
    print("=" * 60)
    
    # 创建 Agent，传入基础工具
    agent = BaseAgent(
        tools=[get_current_time, calculator],
        prompt_mode="default",
        debug=False
    )
    
    # 测试用例
    test_cases = [
        "现在几点了？请告诉我具体时间。",
        "请计算：25 * 4 + 77",
        "今天是星期几？",
        "计算 1000 除以 8 的结果",
    ]
    
    for i, query in enumerate(test_cases, 1):
        print(f"\n📝 测试用例 {i}: {query}")
        print("-" * 40)
        
        # 调用 Agent
        response = agent.invoke(query)
        print(f"🤖 回复: {response}")


if __name__ == "__main__":
    main()
```

运行这个示例：

```bash
python examples/ch01/01_first_agent.py
```

期望输出应该显示 Agent 能够根据问题内容自动选择合适的工具。对于时间相关的问题，Agent 会调用时间工具；对于计算问题，Agent 会调用计算器工具。

### 2.3 工具系统深度实践

接下来深入学习工具系统。查看现有的工具实现：

```python
# backend/core/tools/time_tools.py

from langchain_core.tools import tool
from datetime import datetime


@tool
def get_current_time(format: str = "%Y-%m-%d %H:%M:%S") -> str:
    """
    获取当前时间
    
    Args:
        format: 时间格式，默认为 "%Y-%m-%d %H:%M:%S"
        
    Returns:
        格式化后的当前时间字符串
    """
    now = datetime.now()
    return now.strftime(format)


@tool
def get_current_date() -> str:
    """获取当前日期"""
    return datetime.now().strftime("%Y-%m-%d")
```

```python
# backend/core/tools/calculator.py

from langchain_core.tools import tool


@tool
def calculator(expression: str) -> str:
    """
    执行数学表达式计算
    
    Args:
        expression: 数学表达式，如 "2 + 3 * 4"
        
    Returns:
        计算结果字符串
    """
    try:
        # 使用 eval 计算表达式（实际项目中应使用更安全的替代方案）
        result = eval(expression)
        return str(result)
    except Exception as e:
        return f"计算错误: {str(e)}"
```

现在创建一个更复杂的示例，展示如何组合使用多个工具：

```python
# examples/ch01/02_multi_tools_agent.py
"""
多工具 Agent 示例
展示如何创建支持多种工具的智能体
"""

from agents.base_agent import BaseAgent
from core.tools import (
    get_current_time,
    get_current_date,
    calculator,
    web_search,
    get_weather
)
from config import get_logger

logger = get_logger(__name__)


def main():
    """运行多工具 Agent 示例"""
    print("=" * 60)
    print("🌟 多功能 Agent - 日常生活助手")
    print("=" * 60)
    
    # 创建包含所有工具的 Agent
    all_tools = [
        get_current_time,
        get_current_date,
        calculator,
        web_search,
        get_weather
    ]
    
    agent = BaseAgent(
        tools=all_tools,
        prompt_mode="detailed",
        debug=False
    )
    
    # 综合测试用例
    queries = [
        # 时间相关
        "现在几点了？",
        # 计算相关
        "如果一个苹果2块钱，我买5个，再买3个梨（每个3块钱），一共多少钱？",
        # 天气相关
        "今天北京的天气怎么样？",
        # 搜索相关
        "帮我搜索一下最新的 AI 新闻",
    ]
    
    for query in queries:
        print(f"\n{'='*50}")
        print(f"📝 用户: {query}")
        print("=" * 50)
        
        response = agent.invoke(query)
        print(f"🤖 Agent: {response}")


if __name__ == "__main__":
    main()
```

### 2.4 自定义工具开发

学习完现有工具后，我们来开发自定义工具。自定义工具需要继承 `BaseTool` 类或使用 `@tool` 装饰器：

```python
# examples/ch01/03_custom_tools.py
"""
自定义工具开发示例
学习如何创建自己的工具
"""

from langchain_core.tools import tool
from typing import Optional
from pydantic import Field


@tool
def word_counter(text: str) -> str:
    """
    统计文本中的字符数、单词数和行数
    
    Args:
        text: 要统计的文本
        
    Returns:
        统计结果字符串
    """
    char_count = len(text)
    word_count = len(text.split()) if text.strip() else 0
    line_count = len(text.split('\n'))
    
    return f"""📊 文本统计结果：
- 字符数：{char_count}
- 单词数：{word_count}
- 行数：{line_count}"""


@tool
def text_reverser(text: str) -> str:
    """
    反转文本内容
    
    Args:
        text: 要反转的文本
        
    Returns:
        反转后的文本
    """
    return text[::-1]


@tool
def extract_numbers(text: str) -> str:
    """
    从文本中提取所有数字
    
    Args:
        text: 源文本
        
    Returns:
        提取出的数字列表
    """
    import re
    numbers = re.findall(r'\d+', text)
    if numbers:
        return f"提取到 {len(numbers)} 个数字: {', '.join(numbers)}"
    return "文本中没有找到数字"


def main():
    """测试自定义工具"""
    print("=" * 60)
    print("🔧 自定义工具测试")
    print("=" * 60)
    
    # 测试 word_counter
    test_text = """
    Hello, World!
    This is a test.
    Third line here.
    """
    
    result = word_counter.invoke(test_text)
    print(f"\n📝 测试文本:\n{test_text}")
    print(f"\n🔢 计数结果:\n{result}")
    
    # 测试 text_reverser
    original = "Hello, LangChain!"
    reversed_text = text_reverser.invoke(original)
    print(f"\n🔄 文本反转:")
    print(f"   原文: {original}")
    print(f"   反转: {reversed_text}")
    
    # 测试 extract_numbers
    mixed_text = "我的电话号码是123-4567-8901，银行卡号是98765432101"
    numbers = extract_numbers.invoke(mixed_text)
    print(f"\n🔢 数字提取:")
    print(f"   原文: {mixed_text}")
    print(f"   结果: {numbers}")


if __name__ == "__main__":
    main()
```

### 2.5 流式输出实践

流式输出是提升用户体验的重要技术：

```python
# examples/ch01/04_streaming_agent.py
"""
流式输出示例
学习如何实现实时响应的 Agent
"""

import asyncio
from agents.base_agent import BaseAgent
from core.tools import web_search
from config import get_logger

logger = get_logger(__name__)


async def streaming_demo():
    """流式输出演示"""
    print("=" * 60)
    print("🌊 流式输出体验 - 实时看到 AI 的思考过程")
    print("=" * 60)
    
    # 创建支持搜索的 Agent
    agent = BaseAgent(
        tools=[web_search],
        prompt_mode="research",
        debug=False
    )
    
    query = "请介绍一下人工智能的发展历程"
    print(f"\n📝 用户提问: {query}\n")
    print("🤖 Agent 响应 (流式输出):")
    print("-" * 40)
    
    # 使用流式调用
    async for chunk in agent.astream(query):
        print(chunk, end="", flush=True)
    
    print("\n" + "=" * 60)


async def compare_streaming():
    """对比流式和非流式输出"""
    print("\n" + "=" * 60)
    print("📊 流式 vs 非流式 对比")
    print("=" * 60)
    
    agent = BaseAgent(
        tools=[web_search],
        prompt_mode="default",
        debug=False
    )
    
    query = "什么是大语言模型？"
    
    # 非流式调用
    print(f"\n📝 问题: {query}\n")
    print("❌ 非流式输出 (需要等待完整生成):")
    response = agent.invoke(query)
    print(f"   {response[:200]}...")
    
    print("\n" + "-" * 40)
    print("✅ 流式输出 (实时显示):")
    
    async for chunk in agent.astream(query):
        print(chunk, end="", flush=True)
    
    print()


if __name__ == "__main__":
    asyncio.run(streaming_demo())
    asyncio.run(compare_streaming())
```

## 教学要点

### 3.1 Agent 设计的核心原则

在设计 Agent 系统时，需要遵循几个基本原则。第一个原则是职责单一，每个工具应该只做一件事，并且做好这件事。工具的粒度太粗会导致灵活性不足，粒度太细则会增加 Agent 调用的复杂性。例如，与其创建一个 "数据分析" 工具，不如将其拆分为 "数据统计"、"数据可视化"、"数据清洗" 等多个专门的工具。

第二个原则是错误处理健壮。Agent 系统需要优雅地处理各种错误情况，包括网络超时、API 限流、工具执行失败等。每个工具都应该捕获可能的异常，返回有意义的错误信息。Agent 级别的代码应该能够识别错误类型，决定是重试、降级还是直接返回错误。

第三个原则是上下文管理合理。对于复杂任务，需要妥善管理对话历史和上下文信息。LangGraph 的检查点机制提供了状态持久化的能力，让 Agent 能够在中断后恢复执行。但是，过长的上下文会增加 API 调用成本和延迟，需要在完整性和效率之间找到平衡。

第四个原则是提示词设计精心。系统提示词直接影响 Agent 的行为。高质量的提示词应该包含清晰的角色定义、详细的任务说明、明确的输出格式要求以及必要的行为约束。提示词需要经过反复测试和优化，才能达到理想效果。

### 3.2 工具集成的注意事项

工具描述是 Agent 选择工具的依据，必须清晰准确。描述应该包含三部分内容：工具的用途说明（告诉 Agent 什么时候应该调用这个工具）、参数说明（告诉 Agent 如何传递参数）、返回值说明（告诉 Agent 如何理解工具的输出）。好的描述能够帮助 Agent 做出正确的调用决策。

工具命名也很重要。名称应该简洁明了，能够表达工具的功能。建议使用动词+名词的命名方式，如 `search_web`、`get_weather`、`calculate_expression` 等。避免使用过于笼统或模糊的名称，如 `do_something`、`process_data` 等。

工具参数的验证是安全性的关键。虽然 Agent 会根据描述传递参数，但仍需在工具内部进行验证。对于关键参数，需要检查类型、范围、格式等。对于危险操作，需要添加额外的确认机制。永远不要完全信任外部输入，包括来自 Agent 的调用请求。

### 3.3 常见问题与调试技巧

调用死循环是最常见的问题之一工具。当 Agent 对工具返回的结果处理不当，或者工具实现存在缺陷时，可能导致反复调用同一个工具。解决方法包括：设置递归深度限制、记录工具调用日志、监控调用次数等。LangGraph 的 `recursion_limit` 配置可以有效防止无限循环。

上下文长度溢出是另一个常见问题。随着对话的进行，消息历史不断增长，可能超过模型的上下文窗口限制。解决方法包括：摘要压缩（只保留关键信息）、滑动窗口（丢弃最早的对话）、选择性保留（只保留相关对话）等。

调试 Agent 时，日志记录是重要手段。建议在关键位置添加日志，包括输入参数、执行步骤、输出结果、耗时统计等。QST智能学习助手 项目采用结构化日志格式，便于搜索和分析。可以使用不同的日志级别区分重要程度，如 DEBUG 用于详细调试、INFO 用于正常运行记录、WARN 用于异常情况、ERROR 用于错误信息。

## 课后作业

### 基础作业

**作业 1：天气查询工具**

开发一个天气查询工具并集成到 Agent 中。要求：
- 创建 `weather_tool.py` 文件
- 实现 `get_weather(city: str) -> str` 函数（可以使用免费天气 API）
- 工具需要处理异常情况（城市不存在、网络错误、API 限流等）
- 集成到 Agent 并测试以下查询：
  - "北京今天天气怎么样？"
  - "上海明天会下雨吗？"
  - "查询一个不存在的城市"

**作业 2：单位换算工具**

创建一个单位换算工具集。要求：
- 创建 `conversion_tool.py` 文件
- 实现以下换算功能：
  - 长度换算（米、厘米、英寸、英尺等）
  - 重量换算（千克、克、磅、盎司等）
  - 温度换算（摄氏度、华氏度、开尔文等）
- 使用枚举或字典管理换算系数
- 编写单元测试验证换算准确性

### 中级作业

**作业 3：知识问答 Agent**

创建一个专门用于回答领域知识问题的 Agent。要求：
- 至少包含 5 个专业领域的知识工具
- 实现工具自动选择机制
- 支持多轮对话，上下文相关
- 设计评估方法，测试 Agent 的准确性

**作业 4：智能助手 Agent**

创建一个综合性的生活助手 Agent。要求：
- 包含时间、计算、提醒、日历、天气等功能
- 实现任务规划能力
- 支持设置定时提醒
- 记录用户偏好，提供个性化服务

### 高级作业

**作业 5：工具注册系统**

设计并实现一个工具注册系统。要求：
- 支持运行时动态注册和注销工具
- 实现工具依赖管理
- 提供工具版本控制
- 支持工具的热更新

**作业 6：Agent 协作框架**

设计一个多 Agent 协作框架。要求：
- 实现 Agent 之间的消息传递机制
- 支持任务分配和结果汇总
- 实现冲突解决策略
- 提供可视化的协作监控界面

## 代码示例

### 示例 1：完整工具定义模板

```python
# core/tools/template.py
"""
自定义工具开发模板
按照这个模板创建新的工具
"""

from langchain_core.tools import tool
from typing import Optional
from pydantic import Field, BaseModel


class ToolInput(BaseModel):
    """工具输入参数模型"""
    param1: str = Field(description="参数1的说明")
    param2: Optional[str] = Field(default="默认值", description="可选参数2的说明")


@tool
def custom_tool_name(
    param1: str = Field(description="参数1的说明"),
    param2: Optional[str] = Field(default="默认值", description="可选参数2的说明")
) -> str:
    """
    工具的详细说明，会被 Agent 解析和使用。
    
    ## 何时使用
    当用户需要...时使用此工具。
    
    ## 参数说明
    - param1: 主要输入参数的详细说明
    - param2: 可选参数的详细说明
    
    ## 返回值说明
    返回处理结果的字符串描述。
    
    ## 注意事项
    - 需要注意的第一点
    - 需要注意的第二点
    """
    # 1. 参数验证
    if not param1:
        return "错误: 参数1不能为空"
    
    # 2. 业务逻辑处理
    result = f"处理 param1: {param1}"
    
    if param2:
        result += f", param2: {param2}"
    
    # 3. 返回结果
    return result


# 工具注册
CUSTOM_TOOLS = [custom_tool_name]
```

### 示例 2：Agent 工厂函数

```python
# agents/factory.py
"""
Agent 工厂函数
提供创建不同类型 Agent 的便捷接口
"""

from typing import Optional, Sequence
from langchain_core.tools import BaseTool
from agents.base_agent import BaseAgent
from core.tools import BASIC_TOOLS, ALL_TOOLS
from config import settings, get_logger

logger = get_logger(__name__)


def create_assistant_agent(
    tools: Optional[Sequence[BaseTool]] = None,
    model: Optional[str] = None,
    prompt_mode: str = "default",
    debug: bool = False,
) -> BaseAgent:
    """
    创建通用助手 Agent
    
    Args:
        tools: 工具列表，默认使用基础工具集
        model: 模型标识符
        prompt_mode: 提示词模式
        debug: 是否启用调试模式
        
    Returns:
        BaseAgent 实例
    """
    if tools is None:
        tools = BASIC_TOOLS
    
    return BaseAgent(
        model=model,
        tools=tools,
        prompt_mode=prompt_mode,
        debug=debug,
    )


def create_research_agent(
    model: Optional[str] = None,
    debug: bool = False,
) -> BaseAgent:
    """
    创建研究助手 Agent
    
    专门用于信息搜索和分析的 Agent。
    """
    return BaseAgent(
        model=model,
        tools=ALL_TOOLS,
        prompt_mode="research",
        debug=debug,
    )


def create_coding_agent(
    model: Optional[str] = None,
    debug: bool = False,
) -> BaseAgent:
    """
    创建编程助手 Agent
    
    专门用于代码编写和调试的 Agent。
    """
    from core.tools import code_tools
    
    return BaseAgent(
        model=model,
        tools=code_tools,
        prompt_mode="coding",
        debug=debug,
    )


def create_conversation_agent(
    model: Optional[str] = None,
    debug: bool = False,
) -> BaseAgent:
    """
    创建对话 Agent
    
    不带工具的纯对话 Agent。
    """
    return BaseAgent(
        model=model,
        tools=[],  # 无工具
        prompt_mode="concise",
        debug=debug,
    )
```

### 示例 3：Agent 性能监控

```python
# core/monitoring/agent_metrics.py
"""
Agent 性能监控模块
收集和报告 Agent 的运行指标
"""

from typing import Dict, List, Any
from dataclasses import dataclass, field
from datetime import datetime
import time


@dataclass
class AgentMetrics:
    """Agent 性能指标数据类"""
    agent_name: str
    total_requests: int = 0
    successful_requests: int = 0
    failed_requests: int = 0
    total_tokens: int = 0
    total_latency_ms: float = 0.0
    tool_calls: Dict[str, int] = field(default_factory=dict)
    errors: List[str] = field(default_factory=list)
    
    def record_request(
        self,
        success: bool,
        tokens: int,
        latency_ms: float,
        tools_used: List[str] = None,
        error: str = None
    ):
        """记录一次请求"""
        self.total_requests += 1
        self.total_tokens += tokens
        self.total_latency_ms += latency_ms
        
        if success:
            self.successful_requests += 1
        else:
            self.failed_requests += 1
            if error:
                self.errors.append(error)
        
        if tools_used:
            for tool in tools_used:
                self.tool_calls[tool] = self.tool_calls.get(tool, 0) + 1
    
    @property
    def success_rate(self) -> float:
        """成功率"""
        if self.total_requests == 0:
            return 0.0
        return self.successful_requests / self.total_requests
    
    @property
    def avg_latency_ms(self) -> float:
        """平均延迟"""
        if self.total_requests == 0:
            return 0.0
        return self.total_latency_ms / self.total_requests
    
    def to_dict(self) -> Dict[str, Any]:
        """转换为字典"""
        return {
            "agent_name": self.agent_name,
            "total_requests": self.total_requests,
            "success_rate": f"{self.success_rate:.2%}",
            "avg_latency_ms": f"{self.avg_latency_ms:.2f}",
            "total_tokens": self.total_tokens,
            "tool_usage": self.tool_calls,
            "recent_errors": self.errors[-10:],
        }


class AgentMonitor:
    """Agent 监控器"""
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._metrics: Dict[str, AgentMetrics] = {}
        return cls._instance
    
    def get_metrics(self, agent_name: str) -> AgentMetrics:
        """获取或创建 Agent 指标"""
        if agent_name not in self._metrics:
            self._metrics[agent_name] = AgentMetrics(agent_name=agent_name)
        return self._metrics[agent_name]
    
    def report(
        self,
        agent_name: str,
        success: bool,
        tokens: int,
        latency_ms: float,
        tools_used: List[str] = None,
        error: str = None
    ):
        """报告一次调用"""
        metrics = self.get_metrics(agent_name)
        metrics.record_request(success, tokens, latency_ms, tools_used, error)
    
    def get_all_metrics(self) -> Dict[str, Dict]:
        """获取所有指标"""
        return {
            name: metrics.to_dict()
            for name, metrics in self._metrics.items()
        }
```

## 参考资料

### 官方文档

- LangChain Agents 文档：https://docs.langchain.com/oss/python/langchain/agents
- LangChain Tools 文档：https://docs.langchain.com/oss/python/langchainagents#tools
- LangGraph 文档：https://docs.langgraph.com/
- OpenAI Function Calling：https://platform.openai.com/docs/guides/function-calling

### 进阶阅读

- ReAct 论文：https://arxiv.org/abs/2210.03629（工具调用的理论基础）
- LangChain Agent 最佳实践：https://github.com/langchain-ai/langchain/tree/master/docs/docs/use_cases/agents
- Toolformer 论文：https://arxiv.org/abs/2302.04761（工具学习相关）

### 在线资源

- LangChain Discord 社区：https://discord.gg/langchain
- QST智能学习助手 GitHub 仓库：https://github.com/your-repo/lc-studylab
- Awesome LangChain 资源集合：https://github.com/kyrol/awesome-langchain
