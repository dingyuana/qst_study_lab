# 第四章：DeepAgents 深度研究系统

## 理论讲解

### 4.1 多智能体系统概述与核心价值

多智能体系统（Multi-Agent System）是人工智能领域的一个重要分支，它由多个自主智能体组成，这些智能体能够感知环境、做出决策、与其他智能体交互，共同完成复杂任务。与单一智能体相比，多智能体系统具有几个显著优势：首先是可扩展性，新增或移除智能体不会影响整体系统；其次是专业分工，每个智能体可以专注于特定任务，发挥专长；第三是并行处理，多个智能体可以同时工作，提高执行效率；第四是容错性，单个智能体的故障不会导致整个系统崩溃。

在深度研究场景中，多智能体系统的优势尤为明显。复杂的研究任务通常涉及多个方面：信息收集需要广泛的网络搜索和文献调研；信息分析需要深度的内容理解和知识提取；报告撰写需要清晰的结构和流畅的表达。如果让一个智能体同时完成所有这些任务，不仅会增加系统的复杂度，也会限制每个环节的专业深度。通过多智能体分工，可以让专门的智能体负责专门的任务，每个环节都能达到更高的质量。

LC-StudyLab 项目中的 DeepAgents 模块是一个完整的多智能体协作系统，它实现了"深度研究"这一典型案例。这个系统包含三类专业智能体：WebResearcher 负责网络搜索和信息收集；DocAnalyst 负责文档分析和信息提取；ReportWriter 负责研究报告撰写。主智能体 DeepResearchAgent 负责任务分解和协调，将复杂的研究任务分解为多个子任务，分配给专门的子智能体处理，最终汇总生成完整的研究报告。

### 4.2 多智能体协作架构设计

多智能体系统的架构设计需要解决几个核心问题：智能体之间的通信机制、任务的分解与分配、结果的汇总与验证、以及冲突的检测与解决。LC-StudyLab 采用"主-从"架构，主智能体作为协调者负责整体规划和任务分配，子智能体作为执行者负责具体任务的处理。

主智能体的核心职责包括：理解用户的研究需求、制定详细的研究计划、将计划分解为可执行的任务、协调子智能体的执行、处理子智能体的结果反馈、生成最终的研究报告。主智能体需要具备强大的自然语言理解能力，能够准确把握用户的意图；同时需要具备良好的规划能力，能够制定出合理的研究路径。

子智能体的设计遵循"专业分工"原则。每个子智能体只专注于特定类型的任务，但每个任务都能做到深入和专业。WebResearcher 智能体专注于信息收集，它能够进行网络搜索、筛选高质量来源、提取关键信息；DocAnalyst 智能体专注于信息分析，它能够阅读和理解文档内容、提取关键论点和数据、识别信息之间的关联；ReportWriter 智能体专注于报告生成，它能够组织内容结构、撰写清晰的段落、生成规范的引用。

智能体之间的通信采用消息传递机制。每个智能体有自己独立的输入和输出接口，主智能体通过发送消息触发子智能体的执行，子智能体通过返回消息报告执行结果和获取的状态信息。这种松耦合的设计使得智能体可以独立开发和测试，只需要遵循约定的消息格式即可。

### 4.3 研究计划生成与任务分解

研究计划生成是深度研究的第一步，它决定了后续研究的方向和路径。一个好的研究计划应该包含：明确的研究目标、清晰的研究问题、合理的时间安排、充分的信息来源考虑。LC-StudyLab 的主智能体使用 LLM 生成研究计划，计划的详细程度可以根据用户需求和研究复杂度进行调整。

任务分解是将研究计划转化为可执行任务的过程。分解的原则是"粒度适中"：任务太大会难以管理，任务太小会产生过多的协调开销。每个子任务应该有明确的输入、输出和完成标准，便于子智能体执行和主智能体验收。分解时还需要考虑任务之间的依赖关系，某些任务可能需要等待前置任务完成后才能开始。

研究计划需要经过用户确认才能执行。人类专家的知识和判断力是 AI 难以完全替代的，用户可以补充研究方向、修正计划中的错误、调整优先级。确认后的计划作为后续执行的基础，主智能体会严格按照计划推进研究进程。如果在执行过程中发现计划需要调整，主智能体会向用户请求确认。

### 4.4 文件系统工具集成

文件系统工具是多智能体系统的重要组成部分，它让智能体能够持久化存储和读取研究过程中收集的资料、生成的草稿和最终的报告。LC-StudyLab 的文件系统工具支持多种操作：读取文件内容、写入新文件、创建目录、列出目录内容、删除文件等。

文件操作的接口设计遵循简单易用的原则。每个操作都是独立的工具函数，接受明确的参数，返回清晰的结果。文件路径支持相对路径和绝对路径，相对路径相对于工作目录解析。glob 模式的文件搜索功能让智能体能够批量查找满足条件的文件。

文件组织是研究系统的重要方面。LC-StudyLab 采用结构化的目录组织方式：每个研究任务有独立的目录，下设"sources"存放原始资料、"drafts"存放中间草稿、"reports"存放最终报告。这种组织方式便于管理和追溯，也便于用户查看研究的中间过程。

### 4.5 结构化报告生成

研究报告是深度研究的最终产出，它的质量直接影响研究的价值。LC-StudyLab 的 ReportWriter 智能体能够生成结构化的 Markdown 格式报告，包含标题、摘要、章节、引用、参考文献等标准结构。报告采用"先大纲后内容"的生成策略，先构建报告框架，再逐步填充详细内容。

报告的规范性是专业研究的基本要求。报告应该有清晰的层级结构，标题和小节的组织逻辑严密；应该有充分的引用标注，所有引用的来源都应该有对应的引用标记；应该有规范的参考文献列表，列出所有参考的资料来源。ReportWriter 智能体在生成报告时会自动添加这些结构元素。

报告的个性化定制是提高用户满意度的重要手段。用户可以指定报告的格式要求、篇幅限制、重点关注的方面等。ReportWriter 智能体会根据用户的要求调整报告的内容和风格，生成满足用户特定需求的研究报告。

## 实操步骤

### 4.1 研究系统环境准备

首先查看 DeepAgents 模块的目录结构：

```
backend/deep_research/
├── __init__.py
├── deep_agent.py           # 主智能体
├── deep_researcher.py      # 研究协调者（已废弃，保留向后兼容）
├── safe_deep_agent.py      # 安全版本主智能体
└── subagents.py            # 子智能体定义
```

确保所有依赖已安装：

```bash
# 检查依赖
cd backend
pip list | grep -E "langchain|openai|pydantic"
```

### 4.2 子智能体实现

首先创建子智能体的基础类：

```python
# deep_research/subagents.py（核心代码解析）

from typing import Dict, List, Any, Optional
from abc import ABC, abstractmethod
from langchain_core.tools import BaseTool
from agents.base_agent import BaseAgent
from config import get_logger

logger = get_logger(__name__)


class BaseSubAgent(ABC):
    """子智能体基类"""
    
    @property
    @abstractmethod
    def name(self) -> str:
        """智能体名称"""
        pass
    
    @property
    @abstractmethod
    def description(self) -> str:
        """智能体描述"""
        pass
    
    @abstractmethod
    def get_system_prompt(self) -> str:
        """获取系统提示词"""
        pass
    
    @abstractmethod
    def get_tools(self) -> List[BaseTool]:
        """获取智能体工具列表"""
        pass
    
    def create_agent(self) -> BaseAgent:
        """创建智能体实例"""
        return BaseAgent(
            tools=self.get_tools(),
            system_prompt=self.get_system_prompt(),
            prompt_mode="detailed"
        )
    
    @abstractmethod
    def execute(self, task: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        执行任务
        
        Args:
            task: 任务描述
            context: 上下文信息
            
        Returns:
            执行结果
        """
        pass


class WebResearcherSubAgent(BaseSubAgent):
    """网络研究者子智能体"""
    
    @property
    def name(self) -> str:
        return "WebResearcher"
    
    @property
    def description(self) -> str:
        return "负责网络搜索和信息收集的智能体"
    
    def get_system_prompt(self) -> str:
        return """你是一个专业的研究助手，专注于网络搜索和信息收集。

你的职责：
1. 根据研究主题进行全面的网络搜索
2. 筛选高质量、可信赖的信息来源
3. 提取关键信息和重要数据
4. 对收集的信息进行初步整理

工作要求：
- 优先选择权威机构和专业网站的资料
- 注意信息的时效性和准确性
- 记录所有信息来源（标题、URL、日期）
- 对多个来源的信息进行交叉验证

输出格式：
每条信息应包含：
- 信息标题
- 关键内容摘要
- 来源链接
- 获取日期
"""
    
    def get_tools(self) -> List[BaseTool]:
        """获取网络搜索工具"""
        from core.tools import web_search
        return [web_search]
    
    def execute(self, task: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """执行网络研究任务"""
        logger.info(f"🔍 WebResearcher 执行任务: {task}")
        
        agent = self.create_agent()
        result = agent.invoke(task)
        
        return {
            "agent": self.name,
            "task": task,
            "result": result,
            "sources": []  # 可以从工具调用结果中提取
        }


class DocAnalystSubAgent(BaseSubAgent):
    """文档分析子智能体"""
    
    @property
    def name(self) -> str:
        return "DocAnalyst"
    
    @property
    def description(self) -> str:
        return "负责文档分析和信息提取的智能体"
    
    def get_system_prompt(self) -> str:
        return """你是一个专业的文档分析助手，专注于深度阅读和信息提取。

你的职责：
1. 阅读并理解文档内容
2. 提取关键概念和核心论点
3. 分析信息之间的关联和逻辑关系
4. 识别重要的数据和事实

工作要求：
- 准确把握作者的核心观点
- 注意信息之间的逻辑关系
- 区分事实陈述和观点表达
- 识别信息的可靠性和局限性

输出格式：
分析结果应包含：
- 文档概述（1-2句话）
- 关键发现（3-5个要点）
- 重要数据（如果有）
- 信息关联分析
"""
    
    def get_tools(self) -> List[BaseTool]:
        """获取文件系统工具"""
        from core.tools import filesystem
        return [filesystem]
    
    def execute(self, task: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """执行文档分析任务"""
        logger.info(f"📄 DocAnalyst 执行任务: {task}")
        
        agent = self.create_agent()
        result = agent.invoke(task)
        
        return {
            "agent": self.name,
            "task": task,
            "result": result,
            "analysis": result
        }


class ReportWriterSubAgent(BaseSubAgent):
    """报告撰写子智能体"""
    
    @property
    def name(self) -> str:
        return "ReportWriter"
    
    @property
    def description(self) -> str:
        return "负责研究报告撰写的智能体"
    
    def get_system_prompt(self) -> str:
        return """你是一个专业的研究报告撰写助手。

你的职责：
1. 根据收集的资料撰写结构清晰的研究报告
2. 使用规范、专业的语言表达
3. 确保报告内容准确、逻辑严密
4. 正确引用所有参考资料

报告结构：
1. 标题
2. 摘要
3. 引言
4. 研究方法
5. 主要发现
6. 结论与建议
7. 参考文献

工作要求：
- 报告应该有清晰的逻辑结构
- 使用简洁明了的语言
- 适当引用信息来源
- 保持客观、专业的写作风格
"""
    
    def get_tools(self) -> List[BaseTool]:
        """获取文件系统工具"""
        from core.tools import filesystem
        return [filesystem]
    
    def execute(self, task: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """执行报告撰写任务"""
        logger.info(f"📝 ReportWriter 执行任务: {task}")
        
        agent = self.create_agent()
        result = agent.invoke(task)
        
        return {
            "agent": self.name,
            "task": task,
            "result": result,
            "report": result
        }
```

### 4.3 主智能体实现

创建主智能体 DeepResearchAgent：

```python
# deep_research/deep_agent.py（核心代码解析）

from typing import Dict, List, Any, Optional
from datetime import datetime
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from config import settings, get_logger
from deep_research.subagents import (
    WebResearcherSubAgent,
    DocAnalystSubAgent,
    ReportWriterSubAgent
)

logger = get_logger(__name__)


class DeepResearchAgent:
    """
    深度研究智能体
    
    多智能体协作系统的主协调者。
    负责任务分解、子智能体调度和结果汇总。
    
    Attributes:
        model: LLM 模型实例
        subagents: 子智能体字典
    """
    
    def __init__(self, model_name: str = None):
        """
        初始化深度研究智能体
        
        Args:
            model_name: 模型名称
        """
        self.model = ChatOpenAI(
            model=model_name or settings.openai_model,
            temperature=0.7,
            api_key=settings.openai_api_key,
            base_url=settings.openai_api_base
        )
        
        # 初始化子智能体
        self.subagents = {
            "web_researcher": WebResearcherSubAgent(),
            "doc_analyst": DocAnalystSubAgent(),
            "report_writer": ReportWriterSubAgent()
        }
        
        logger.info("🤖 DeepResearchAgent 初始化完成")
        logger.info(f"   子智能体: {', '.join(self.subagents.keys())}")
    
    def create_research_plan(
        self,
        topic: str,
        goals: List[str] = None
    ) -> Dict[str, Any]:
        """
        创建研究计划
        
        Args:
            topic: 研究主题
            goals: 研究目标列表
            
        Returns:
            研究计划字典
        """
        logger.info(f"📋 创建研究计划: {topic}")
        
        prompt = f"""为以下研究主题制定详细的研究计划：

**研究主题**: {topic}

**研究目标**:
{chr(10).join([f'- {g}' for g in goals]) if goals else '- 全面了解该主题'}

请制定一个结构化的研究计划，包括：
1. 研究范围界定
2. 关键研究问题（3-5个）
3. 推荐的信息来源类型
4. 预计的研究步骤
5. 时间分配建议

请以 JSON 格式返回研究计划。"""
        
        response = self.model.invoke([HumanMessage(content=prompt)])
        plan_text = response.content
        
        logger.info("✅ 研究计划创建完成")
        
        return {
            "topic": topic,
            "goals": goals,
            "plan": plan_text,
            "created_at": datetime.now().isoformat()
        }
    
    def decompose_tasks(self, plan: str) -> List[Dict[str, Any]]:
        """
        将研究计划分解为具体任务
        
        Args:
            plan: 研究计划文本
            
        Returns:
            任务列表
        """
        prompt = f"""将以下研究计划分解为具体的执行任务。

**研究计划**:
{plan}

请将计划分解为 5-8 个具体任务，每个任务包含：
1. 任务名称（简洁描述）
2. 任务类型（web_research/doc_analysis/report_writing）
3. 任务描述（详细说明）
4. 前置依赖（如果有）

请以 JSON 数组格式返回任务列表。"""
        
        response = self.model.invoke([HumanMessage(content=prompt)])
        tasks_text = response.content
        
        # 解析任务列表（简化处理）
        import json
        try:
            tasks = json.loads(tasks_text)
        except json.JSONDecodeError:
            # 解析失败时的默认处理
            tasks = [
                {
                    "name": "网络搜索",
                    "type": "web_research",
                    "description": "搜索相关信息"
                }
            ]
        
        logger.info(f"📦 任务分解完成: {len(tasks)} 个任务")
        
        return tasks
    
    def execute_research(
        self,
        topic: str,
        goals: List[str] = None,
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        执行完整的研究流程
        
        Args:
            topic: 研究主题
            goals: 研究目标
            context: 额外的上下文信息
            
        Returns:
            研究结果
        """
        logger.info(f"🚀 开始深度研究: {topic}")
        
        # 1. 创建研究计划
        plan = self.create_research_plan(topic, goals)
        
        # 2. 分解任务
        tasks = self.decompose_tasks(plan["plan"])
        
        # 3. 执行任务（简化处理）
        results = {
            "research_topic": topic,
            "research_goals": goals,
            "research_plan": plan,
            "task_results": [],
            "final_report": None,
            "sources": [],
            "executed_at": datetime.now().isoformat()
        }
        
        # 执行每个任务
        for task in tasks:
            task_type = task.get("type", "web_research")
            task_desc = task.get("description", "")
            
            # 选择对应的子智能体
            if task_type == "web_researcher":
                subagent = self.subagents["web_researcher"]
            elif task_type == "doc_analyst":
                subagent = self.subagents["doc_analyst"]
            elif task_type == "report_writer":
                subagent = self.subagents["report_writer"]
            else:
                subagent = self.subagents["web_researcher"]
            
            # 执行任务
            task_result = subagent.execute(task_desc, context)
            results["task_results"].append(task_result)
            
            logger.info(f"   完成任务: {task['name']} ({task_type})")
        
        # 4. 汇总结果
        results["final_report"] = self._generate_final_report(results)
        
        logger.info("✅ 深度研究完成")
        
        return results
    
    def _generate_final_report(self, research_results: Dict) -> str:
        """生成最终报告"""
        # 收集所有子智能体的结果
        all_findings = []
        for result in research_results.get("task_results", []):
            if isinstance(result, dict) and "result" in result:
                all_findings.append(result["result"])
        
        prompt = f"""基于以下研究结果，生成一份完整的研究报告：

**研究主题**: {research_results.get('research_topic', '')}

**研究目标**:
{chr(10).join([f'- {g}' for g in research_results.get('research_goals', [])])}

**研究过程发现**:
{chr(10).chr(10).join(all_findings)}

请生成一份结构完整、内容详实的研究报告。"""
        
        response = self.model.invoke([HumanMessage(content=prompt)])
        
        return response.content


class DeepResearcher:
    """深度研究者（保留向后兼容）"""
    
    def __init__(self):
        self.agent = DeepResearchAgent()
    
    async def research(
        self,
        topic: str,
        goals: List[str] = None
    ) -> Dict[str, Any]:
        """
        执行研究
        
        Args:
            topic: 研究主题
            goals: 研究目标
            
        Returns:
            研究结果
        """
        return self.agent.execute_research(topic, goals)
```

### 4.4 深度研究实践

创建深度研究示例脚本：

```python
# examples/ch04/01_deep_research.py
"""
深度研究示例
学习如何使用多智能体系统进行深度研究
"""

import asyncio
from deep_research import DeepResearcher
from config import get_logger

logger = get_logger(__name__)


async def main():
    """运行深度研究示例"""
    
    print("=" * 60)
    print("🔬 DeepAgents 深度研究系统示例")
    print("=" * 60)
    
    # 创建研究者
    researcher = DeepResearcher()
    
    # 定义研究主题
    topic = "大语言模型在教育领域的应用"
    goals = [
        "了解 LLM 在教育中的主要应用场景",
        "分析成功的教育 LLM 应用案例",
        "探讨 LLM 教育应用面临的挑战",
        "总结 LLM 教育应用的未来趋势"
    ]
    
    print(f"\n📝 研究主题: {topic}")
    print("🎯 研究目标:")
    for goal in goals:
        print(f"   - {goal}")
    
    # 执行研究
    print("\n🚀 开始深度研究...")
    print("   (这可能需要几分钟时间)\n")
    
    try:
        result = await researcher.research(topic, goals)
        
        # 显示结果
        print("\n" + "=" * 60)
        print("📊 深度研究结果")
        print("=" * 60)
        
        # 显示研究计划
        if "research_plan" in result:
            plan = result["research_plan"]
            if isinstance(plan, dict) and "plan" in plan:
                print("\n📋 研究计划:")
                print("-" * 40)
                print(plan["plan"][:500] + "...")
        
        # 显示最终报告
        if "final_report" in result:
            print("\n📄 研究报告:")
            print("-" * 40)
            print(result["final_report"][:1000] + "...")
        
        # 显示任务统计
        if "task_results" in result:
            print(f"\n📈 执行了 {len(result['task_results'])} 个研究任务")
            
            agent_stats = {}
            for task_result in result["task_results"]:
                agent_name = task_result.get("agent", "Unknown")
                agent_stats[agent_name] = agent_stats.get(agent_name, 0) + 1
            
            for agent, count in agent_stats.items():
                print(f"   - {agent}: {count} 个任务")
        
        print("\n" + "=" * 60)
        print("✅ 深度研究完成！")
        print("=" * 60)
        
    except Exception as e:
        logger.error(f"❌ 研究过程出错: {e}")
        print(f"\n研究过程中出现错误: {e}")


def sync_demo():
    """同步版本演示"""
    
    print("\n" + "=" * 60)
    print("🔬 同步版本深度研究")
    print("=" * 60)
    
    researcher = DeepResearcher()
    
    topic = "人工智能在医疗诊断中的应用"
    
    # 同步执行
    result = researcher.agent.execute_research(
        topic=topic,
        goals=["了解 AI 医疗诊断的应用现状", "分析主要技术路线"]
    )
    
    print(f"\n✅ 研究完成: {topic}")
    print(f"   报告长度: {len(result.get('final_report', ''))} 字符")


if __name__ == "__main__":
    asyncio.run(main())
    sync_demo()
```

### 4.5 自定义智能体开发

学习如何扩展多智能体系统：

```python
# examples/ch04/02_custom_subagent.py
"""
自定义子智能体示例
学习如何创建新的子智能体
"""

from typing import Dict, List, Any
from langchain_core.tools import BaseTool
from deep_research.subagents import BaseSubAgent
from config import get_logger

logger = get_logger(__name__)


class DataVisualizerSubAgent(BaseSubAgent):
    """数据可视化子智能体"""
    
    @property
    def name(self) -> str:
        return "DataVisualizer"
    
    @property
    def description(self) -> str:
        return "负责数据可视化和图表生成的智能体"
    
    def get_system_prompt(self) -> str:
        return """你是一个数据可视化专家。

你的职责：
1. 根据数据生成合适的图表
2. 选择最合适的可视化类型
3. 优化图表的美观性和可读性
4. 生成可用于报告的图表图片

可视化原则：
- 选择最能表达数据含义的图表类型
- 保持图表简洁明了
- 使用清晰的标签和标题
- 注意颜色搭配和整体美观
"""
    
    def get_tools(self) -> List[BaseTool]:
        """获取可视化工具"""
        from core.tools import filesystem
        return [filesystem]
    
    def execute(self, task: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """执行可视化任务"""
        logger.info(f"📊 DataVisualizer 执行任务: {task}")
        
        # 实际实现中，这里会调用图表生成库
        result = f"可视化任务已创建: {task}"
        
        return {
            "agent": self.name,
            "task": task,
            "result": result,
            "chart_path": None  # 生成后的图表路径
        }


class LiteratureReviewSubAgent(BaseSubAgent):
    """文献综述子智能体"""
    
    @property
    def name(self) -> str:
        return "LiteratureReviewer"
    
    @property
    def description(self) -> str:
        return "负责学术文献综述和分析的智能体"
    
    def get_system_prompt(self) -> str:
        return """你是一个专业的学术文献综述专家。

你的职责：
1. 系统性收集和整理相关文献
2. 分析文献的主要观点和方法
3. 识别研究趋势和空白
4. 综合多方观点形成综述

综述要求：
- 客观呈现不同研究观点
- 清晰标注文献来源
- 识别研究的一致性和分歧
- 指出未来研究方向
"""
    
    def get_tools(self) -> List[BaseTool]:
        """获取文献工具"""
        from core.tools import filesystem, web_search
        return [filesystem, web_search]
    
    def execute(self, task: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """执行文献综述任务"""
        logger.info(f"📚 LiteratureReviewer 执行任务: {task}")
        
        result = f"文献综述任务: {task}"
        
        return {
            "agent": self.name,
            "task": task,
            "result": result
        }


def demonstrate_custom_agents():
    """演示自定义子智能体"""
    
    print("=" * 60)
    print("🔧 自定义子智能体演示")
    print("=" * 60)
    
    # 创建自定义智能体
    visualizer = DataVisualizerSubAgent()
    reviewer = LiteratureReviewSubAgent()
    
    print(f"\n📊 DataVisualizer: {visualizer.description}")
    print(f"   系统提示词长度: {len(visualizer.get_system_prompt())} 字符")
    print(f"   工具数量: {len(visualizer.get_tools())}")
    
    print(f"\n📚 LiteratureReviewer: {reviewer.description}")
    print(f"   系统提示词长度: {len(reviewer.get_system_prompt())} 字符")
    print(f"   工具数量: {len(reviewer.get_tools())}")
    
    # 创建智能体实例
    agent = visualizer.create_agent()
    print(f"\n✅ {visualizer.name} 智能体创建成功")


if __name__ == "__main__":
    demonstrate_custom_agents()
```

## 教学要点

### 4.1 多智能体系统设计原则

设计多智能体系统时，职责分离是最重要的原则。每个智能体应该有明确的、单一的职责范围。避免创建"万能"智能体，而是创建多个专业化的智能体。职责的划分应该基于实际业务流程，让每个智能体都能在其专业领域内做到最好。

通信机制的设计需要考虑效率和可靠性。同步通信适用于需要立即响应的场景，异步通信适用于耗时的任务。消息格式应该标准化，包含任务描述、上下文信息、期望输出等。错误处理机制应该完善，确保一个智能体的错误不会影响其他智能体。

任务分解需要平衡粒度和可管理性。任务太粗会导致难以跟踪进度和分配资源；任务太细会产生过多的协调开销。合理的粒度是单个智能体能够在较短时间内完成，同时又足够具体以便独立执行。

### 4.2 子智能体开发最佳实践

子智能体的系统提示词应该清晰、具体。明确智能体的角色定位、工作职责、输出格式要求。提示词中应该包含足够的上下文信息，让智能体能够理解任务的背景和目标。同时也要设置必要的限制，防止智能体偏离预期的行为。

工具的选择应该与智能体的职责相匹配。每个智能体只需要拥有完成其职责所需的工具，过多的工具会增加智能体的决策负担，也会增加出错的可能性。工具应该有良好的文档说明，包括用途、参数、返回值等。

错误处理是子智能体开发中必须考虑的问题。智能体应该能够优雅地处理各种异常情况，如工具调用失败、输入无效、超时等。错误信息应该清晰、有帮助，便于主智能体理解和处理。

### 4.3 研究任务规划策略

研究任务的规划应该遵循由浅入深、由广到窄的原则。首先进行广泛的信息收集，建立对研究主题的整体认知；然后逐步聚焦，深入探索关键问题；最后进行综合分析，形成完整的研究结论。这种渐进式的规划能够确保研究的全面性和深度。

时间分配是研究规划的重要组成部分。不同类型的研究任务需要不同的时间：信息收集需要足够的时间来确保覆盖面的广度；信息分析需要深入思考的时间；报告撰写需要充足的迭代和修改时间。合理的分配能够确保每个环节都得到充分的处理。

研究的范围界定很重要。过于宽泛的研究会导致资源分散，难以深入；过于狭窄的研究可能遗漏重要的相关信息。在开始研究之前，应该明确研究的核心问题和边界范围，在执行过程中根据需要动态调整。

## 课后作业

### 基础作业

**作业 1：扩展子智能体**

为多智能体系统添加新的子智能体。要求：
- 设计一个新的子智能体类型（如 CodeExpert、ExpertInterviewer 等）
- 实现完整的子智能体类
- 编写测试用例验证功能
- 文档说明其用途和特点

**作业 2：任务调度器**

实现一个任务调度器。要求：
- 支持任务的优先级设置
- 实现任务队列管理
- 支持并行执行子智能体任务
- 实现任务依赖关系处理

### 中级作业

**作业 3：智能体协作工作流**

设计并实现智能体协作工作流。要求：
- 定义智能体之间的协作模式
- 实现结果的传递和共享
- 支持动态调整协作流程
- 提供协作过程的可视化

**作业 4：研究质量评估**

实现研究质量评估模块。要求：
- 评估收集资料的质量和可靠性
- 分析引用来源的权威性
- 检测研究结论的一致性
- 生成质量评估报告

### 高级作业

**作业 5：自适应多智能体系统**

设计自适应多智能体系统。要求：
- 根据任务复杂度动态选择智能体组合
- 实现智能体的自我优化机制
- 支持运行时添加/移除智能体
- 提供性能监控和调优建议

**作业 6：分布式研究平台**

设计分布式研究平台。要求：
- 支持多个研究任务并行执行
- 实现跨任务的资源共享
- 支持研究进度的分布式跟踪
- 实现容错和恢复机制

## 代码示例

### 示例 1：多智能体协作框架

```python
# deep_research/multi_agent_framework.py
"""
多智能体协作框架
提供多智能体系统的基础架构
"""

from typing import Dict, List, Any, Callable, Optional
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime
import asyncio
from config import get_logger

logger = get_logger(__name__)


class TaskStatus(Enum):
    """任务状态"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class Task:
    """任务定义"""
    task_id: str
    name: str
    type: str
    description: str
    priority: int = 0
    dependencies: List[str] = field(default_factory=list)
    status: TaskStatus = TaskStatus.PENDING
    assigned_agent: Optional[str] = None
    input_data: Dict[str, Any] = field(default_factory=dict)
    output_data: Dict[str, Any] = field(default_factory=dict)
    error: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class AgentRegistry:
    """智能体注册表"""
    
    def __init__(self):
        self._agents: Dict[str, Any] = {}
    
    def register(self, agent_type: str, agent_instance: Any):
        """注册智能体"""
        self._agents[agent_type] = agent_instance
        logger.info(f"注册智能体: {agent_type}")
    
    def get(self, agent_type: str) -> Optional[Any]:
        """获取智能体"""
        return self._agents.get(agent_type)
    
    def list_types(self) -> List[str]:
        """列出所有智能体类型"""
        return list(self._agents.keys())


class MultiAgentCoordinator:
    """多智能体协调器"""
    
    def __init__(self):
        self.registry = AgentRegistry()
        self.task_queue: List[Task] = []
        self.task_results: Dict[str, Any] = {}
    
    def register_agent(self, agent_type: str, agent_instance: Any):
        """注册智能体"""
        self.registry.register(agent_type, agent_instance)
    
    def create_task(
        self,
        name: str,
        task_type: str,
        description: str,
        priority: int = 0,
        dependencies: List[str] = None,
        input_data: Dict[str, Any] = None
    ) -> Task:
        """创建任务"""
        import uuid
        task_id = str(uuid.uuid4())[:8]
        
        task = Task(
            task_id=task_id,
            name=name,
            type=task_type,
            description=description,
            priority=priority,
            dependencies=dependencies or [],
            input_data=input_data or {}
        )
        
        self.task_queue.append(task)
        logger.info(f"创建任务: {name} ({task_type})")
        
        return task
    
    async def execute_task(self, task: Task) -> Dict[str, Any]:
        """执行单个任务"""
        logger.info(f"执行任务: {task.name}")
        
        # 获取智能体
        agent = self.registry.get(task.type)
        if not agent:
            return {"error": f"未找到智能体类型: {task.type}"}
        
        # 执行任务
        try:
            if hasattr(agent, 'execute'):
                result = agent.execute(task.description, task.input_data)
            else:
                result = agent(task.description)
            
            task.output_data = result
            task.status = TaskStatus.COMPLETED
            task.completed_at = datetime.now()
            
            return result
            
        except Exception as e:
            task.status = TaskStatus.FAILED
            task.error = str(e)
            logger.error(f"任务执行失败: {task.name}, 错误: {e}")
            return {"error": str(e)}
    
    async def execute_all(self, parallel: bool = False) -> Dict[str, Any]:
        """执行所有任务"""
        results = {}
        
        if parallel:
            # 并行执行
            tasks_to_execute = [t for t in self.task_queue if t.status == TaskStatus.PENDING]
            
            # 创建协程
            coroutines = [self.execute_task(t) for t in tasks_to_execute]
            
            # 执行
            outputs = await asyncio.gather(*coroutines, return_exceptions=True)
            
            for task, output in zip(tasks_to_execute, outputs):
                results[task.task_id] = output
        
        else:
            # 顺序执行
            for task in self.task_queue:
                if task.status == TaskStatus.PENDING:
                    output = await self.execute_task(task)
                    results[task.task_id] = output
        
        self.task_results = results
        return results
    
    def get_status(self) -> Dict[str, Any]:
        """获取执行状态"""
        return {
            "total_tasks": len(self.task_queue),
            "completed": sum(1 for t in self.task_queue if t.status == TaskStatus.COMPLETED),
            "failed": sum(1 for t in self.task_queue if t.status == TaskStatus.FAILED),
            "pending": sum(1 for t in self.task_queue if t.status == TaskStatus.PENDING),
            "agent_types": self.registry.list_types()
        }


# 使用示例
def example_usage():
    """使用示例"""
    from deep_research.subagents import (
        WebResearcherSubAgent,
        DocAnalystSubAgent,
        ReportWriterSubAgent
    )
    
    # 创建协调器
    coordinator = MultiAgentCoordinator()
    
    # 注册智能体
    coordinator.register_agent("web_researcher", WebResearcherSubAgent())
    coordinator.register_agent("doc_analyst", DocAnalystSubAgent())
    coordinator.register_agent("report_writer", ReportWriterSubAgent())
    
    # 创建任务
    coordinator.create_task(
        name="搜索 AI 教育应用",
        task_type="web_researcher",
        description="搜索大语言模型在教育领域的应用案例"
    )
    
    coordinator.create_task(
        name="分析收集的资料",
        task_type="doc_analyst",
        description="分析搜索到的资料，提取关键信息"
    )
    
    coordinator.create_task(
        name="生成研究报告",
        task_type="report_writer",
        description="基于分析结果生成完整的研究报告"
    )
    
    # 执行
    import asyncio
    results = asyncio.run(coordinator.execute_all())
    
    print("执行完成!")
    print(f"结果数量: {len(results)}")
```

## 参考资料

### 官方文档

- LangChain Multi-Agent 文档：https://docs.langchain.com/
- LangGraph Agents 文档：https://docs.langgraph.com/
- OpenAI Function Calling：https://platform.openai.com/docs/guides/function-calling

### 技术论文

- Multi-Agent Systems 综述：https://arxiv.org/abs/2308.11432
- AutoGPT 架构分析：https://github.com/Significant-Gravitas/AutoGPT
- Agent 协作模式：https://arxiv.org/abs/2309.10852

### 进阶资源

- Awesome Multi-Agent：https://github.com/ai-planet/awesome-multi-agent
- MetaGPT 项目：https://github.com/geekan/MetaGPT
- CrewAI 框架：https://github.com/joaomdmoura/crewai
