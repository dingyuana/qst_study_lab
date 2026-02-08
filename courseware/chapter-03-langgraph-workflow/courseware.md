# 第三章：LangGraph 工作流引擎

## 理论讲解

### 3.1 工作流编排概述与核心价值

工作流编排（Workflow Orchestration）是构建复杂 AI 系统的关键技术。当单次模型调用无法满足需求时，我们需要将复杂任务分解为多个步骤，通过有向图的形式组织这些步骤的执行顺序，这就是工作流编排的核心思想。LangGraph 是 LangChain 团队开发的工作流编排框架，它基于图计算模型，提供了状态管理、节点定义、边连接、检查点持久化等核心能力，让开发者能够灵活地构建各种复杂的 AI 应用。

与传统的 Agent 相比，LangGraph 工作流具有几个显著优势。首先是可控性，工作流的执行顺序和条件分支是明确定义的，开发者对整个流程有完全的控制权。其次是可观测性，每个节点的输入输出都是显式的，便于调试和监控。第三是可恢复性，通过检查点机制，工作流可以在中断后从上次的状态继续执行，这对于长时间运行的任务尤为重要。第四是人机协作，LangGraph 支持在任意节点设置中断点，等待用户确认后再继续执行，实现真正的人机协作流程。

QST智能学习助手 项目中的工作流模块是整个系统的核心编排层，它实现了"智能学习工作流"这一典型案例。这个工作流将学习过程分解为"规划 → 检索 → 出题 → 评分 → 反馈"五个阶段，每个阶段由专门的节点负责处理。通过这个案例，开发者可以学习到如何设计工作流状态、如何定义节点逻辑、如何连接节点形成完整流程、以及如何实现人机交互等关键技术。

### 3.2 图计算模型与状态管理

LangGraph 的核心抽象是"状态图"（StateGraph），它由"节点"（Node）和"边"（Edge）两部分组成。节点代表工作流中的处理单元，每个节点接收输入、执行特定逻辑、产生输出；边代表节点之间的连接关系，定义了数据如何在节点之间流动。图的执行从入口节点开始，沿着边的方向依次经过各个节点，直到达到终止条件。

状态（State）是 LangGraph 工作流的核心概念。每个工作流都有一个关联的状态类型，通常是一个 TypedDict 或 Pydantic 模型。状态中包含了所有需要跨节点传递的信息，如用户输入、中间结果、配置参数等。当数据在节点之间流动时，状态也随之更新和传递。这种设计使得每个节点都能访问完整的状态信息，也能修改状态供后续节点使用。

状态的设计需要仔细考虑。一方面，状态应该包含所有节点需要的信息，避免在节点之间传递大量数据；另一方面，状态也不应该过于庞大，否则会增加内存使用和序列化成本。最佳实践是只保存必要的结果数据，而不是保留所有的中间过程数据。对于大型数据，可以考虑使用外部存储（如数据库或文件系统），在状态中只保存引用。

LangGraph 提供了两种状态更新方式：直接赋值和函数式更新。直接赋值是最简单的方式，直接修改状态字典中的值。函数式更新则使用 `operator.add`、`operator.setitem` 等函数，更新后的值会被添加到状态中。这种区分在处理列表等可变类型时尤为重要，确保更新的正确性和可追溯性。

### 3.3 节点设计与执行模型

节点是工作流的基本执行单元。在 LangGraph 中，节点就是一个普通的 Python 函数，它接收当前状态作为输入，返回更新后的状态（或状态的某些字段）。这种设计非常简洁，任何函数都可以作为节点，无需特殊的接口或继承。节点函数应该是纯函数，即对于相同的输入，总是产生相同的输出，且不产生副作用。

节点的输入输出需要遵循预定义的契约。工作流定义时需要指定状态的类型，节点函数必须接受符合该类型的参数，返回符合该类型的更新。LangGraph 会在运行时进行类型检查，如果节点返回的状态与定义不符，会抛出明确的错误。这种类型安全的机制有助于在早期发现错误，提高代码的可靠性。

节点的执行顺序由边决定。边连接两个节点，表示数据从源节点流向目标节点。LangGraph 支持多种边类型：普通边表示无条件执行；条件边根据状态内容决定下一步执行哪个节点；起始边定义工作流的入口；终止边定义工作流的终点。复杂的业务流程通常需要组合使用多种边类型。

节点的错误处理是实际应用中必须考虑的问题。LangGraph 支持为单个节点或整个图设置错误处理策略。当节点执行出错时，可以选择重试、跳过、执行备用节点或直接终止工作流。合理的错误处理策略能够提高工作流的健壮性，确保在遇到问题时能够优雅地恢复或报告。

### 3.4 检查点与状态持久化

检查点（Checkpoint）是 LangGraph 工作流持久化的核心机制。在工作流执行过程中，可以定期将当前状态保存到持久化存储（如内存、SQLite、PostgreSQL 等）。如果工作流中断（无论是正常中断还是异常中断），可以从最近的检查点恢复，继续执行而无需从头开始。这对于长时间运行的任务或需要在多轮对话中保持上下文的场景非常有用。

检查点的配置通过 `checkpointer` 参数完成。LangGraph 提供了多种检查点存储实现：MemoryCheckpointer 将检查点保存在内存中，适合开发和测试；SqliteCheckpointer 使用 SQLite 数据库持久化，适合单机部署；PostgresCheckpointer 使用 PostgreSQL 数据库，适合生产环境。使用时需要根据实际需求选择合适的存储后端。

检查点的命名空间（Thread）机制支持多个独立的工作流实例并行执行。通过为每个用户或每个会话指定不同的 thread_id，可以确保它们的执行状态互不干扰。这种设计使得同一个工作流可以同时为多个用户提供服务，每个用户都有独立的状态空间。

检查点的生命周期管理也是需要考虑的问题。长期运行的系统会产生大量的检查点，需要定期清理以释放存储空间。可以通过配置检查点的保留策略（如只保留最近 N 个版本、保留最近 N 天的版本）来控制存储增长。同时，也需要考虑检查点的安全性和隐私保护，确保不同用户的检查点数据不会泄露。

### 3.5 人机交互与流式输出

Human-in-the-Loop（人机交互）是现代 AI 系统的重要特性。LangGraph 通过中断点（Interrupt）机制支持人机协作。在任意节点之后可以设置中断点，工作流执行到该点时会暂停，等待外部触发（如用户确认、API 调用等）后才继续执行。这种设计让人类能够审核 AI 的中间结果、纠正错误决策、提供额外输入。

中断点的使用场景非常广泛。在内容审核场景，AI 生成的敏感内容需要人工审核后才能发布；在代码生成场景，AI 生成的代码需要开发者审查后才能执行；在对话场景，用户可以在任意时刻打断 AI，主动提供指导或纠正。这种人机协作模式平衡了 AI 的效率和人类的判断力，是构建可信 AI 系统的关键。

流式输出（Streaming）是提升用户体验的重要技术。LangGraph 支持多种流式模式："messages" 模式流式输出模型生成的消息；"updates" 模式流式输出每个节点的更新；"values" 模式流式输出完整的状态快照；"debug" 模式输出详细的调试信息。开发者可以根据需要选择合适的流式模式。

Server-Sent Events（SSE）是实现流式输出的常用协议。在 Web 应用中，客户端通过 SSE 连接监听服务器的推送，服务器可以随时向客户端发送数据，而无需客户端轮询。QST智能学习助手 的工作流接口使用 SSE 协议，将工作流的执行过程实时推送给前端，让用户能够看到每个节点的执行状态和结果。

## 实操步骤

### 3.1 工作流开发环境准备

工作流开发需要安装 LangGraph 相关的依赖。确保已经完成了前两章的环境配置，然后安装 LangGraph：

```bash
# 安装 LangGraph
cd backend
pip install langgraph>=1.0.2
```

检查依赖版本：

```bash
python -c "import langgraph; print(f'LangGraph 版本: {langgraph.__version__}')"
```

工作流模块的目录结构如下：

```
backend/workflows/
├── __init__.py           # 模块导出
├── state.py               # 状态定义
├── study_flow_graph.py   # 学习工作流图定义
├── safe_study_flow.py     # 安全版本工作流
└── nodes/                # 节点实现
    ├── __init__.py
    ├── planner_node.py   # 规划节点
    ├── retrieval_node.py # 检索节点
    ├── quiz_generator_node.py  # 出题节点
    ├── grading_node.py   # 评分节点
    └── feedback_node.py # 反馈节点
```

### 3.2 工作流状态定义

首先定义工作流的状态类型：

```python
# workflows/state.py（核心代码解析）

from typing import TypedDict, Optional, List, Dict, Any
from pydantic import BaseModel, Field


class LearningState(TypedDict):
    """
    智能学习工作流的状态定义
    
    这个状态包含工作流执行过程中需要的所有信息。
    每个字段都是必需的，但在某些阶段可能为空。
    """
    # 用户输入
    topic: str                           # 学习主题
    learning_goal: str                   # 学习目标
    user_level: str                      # 用户水平
    
    # 规划阶段
    learning_plan: Optional[str]         # 生成的学习计划
    planning_error: Optional[str]        # 规划阶段的错误信息
    
    # 检索阶段
    retrieved_documents: List[str]      # 检索到的文档内容
    retrieval_error: Optional[str]       # 检索阶段的错误信息
    
    # 出题阶段
    quiz_questions: List[Dict[str, Any]] # 生成的题目
    quiz_error: Optional[str]           # 出题阶段的错误信息
    
    # 用户答案
    user_answers: List[str]             # 用户的答案
    submission_error: Optional[str]      # 提交错误
    
    # 评分阶段
    grades: List[Dict[str, Any]]         # 评分结果
    grading_error: Optional[str]         # 评分错误
    
    # 反馈阶段
    feedback: Optional[str]              # 综合反馈
    feedback_error: Optional[str]        # 反馈错误
    
    # 元数据
    current_step: str                   # 当前执行的步骤
    completed_steps: List[str]          # 已完成的步骤
    total_steps: int                    # 总步骤数


class QuizQuestion(BaseModel):
    """题目数据模型"""
    question_id: int
    question_type: str = Field(..., description="题目类型：choice/true-false/short-answer")
    question_text: str
    options: Optional[List[str]] = None
    correct_answer: str
    explanation: Optional[str] = None
    difficulty: str = "medium"


class GradeResult(BaseModel):
    """评分结果数据模型"""
    question_id: int
    is_correct: bool
    user_answer: str
    correct_answer: str
    score: float = 0.0
    feedback: Optional[str] = None


def get_initial_state(
    topic: str,
    learning_goal: str,
    user_level: str = "intermediate"
) -> LearningState:
    """
    创建初始状态
    
    Args:
        topic: 学习主题
        learning_goal: 学习目标
        user_level: 用户水平
        
    Returns:
        初始状态字典
    """
    return LearningState(
        # 用户输入
        topic=topic,
        learning_goal=learning_goal,
        user_level=user_level,
        
        # 规划阶段
        learning_plan=None,
        planning_error=None,
        
        # 检索阶段
        retrieved_documents=[],
        retrieval_error=None,
        
        # 出题阶段
        quiz_questions=[],
        quiz_error=None,
        
        # 用户答案
        user_answers=[],
        submission_error=None,
        
        # 评分阶段
        grades=[],
        grading_error=None,
        
        # 反馈阶段
        feedback=None,
        feedback_error=None,
        
        # 元数据
        current_step="start",
        completed_steps=[],
        total_steps=5  # 规划、检索、出题、评分、反馈
    )
```

### 3.3 工作流节点实现

接下来实现各个节点：

```python
# workflows/nodes/planner_node.py（核心代码解析）

from typing import Dict, Any
from workflows.state import LearningState
from config import get_logger

logger = get_logger(__name__)


def planner_node(state: LearningState) -> LearningState:
    """
    规划节点
    
    根据用户输入的学习主题和目标，生成学习计划。
    
    Args:
        state: 当前状态
        
    Returns:
        更新后的状态
    """
    logger.info("📋 执行规划节点")
    
    try:
        topic = state["topic"]
        goal = state["learning_goal"]
        level = state["user_level"]
        
        # 使用 LLM 生成学习计划
        # 这里简化处理，实际应该调用模型生成
        learning_plan = f"""
# {topic} 学习计划

## 学习目标
{goal}

## 用户水平
{level}

## 学习路径

### 第一阶段：基础知识（建议时长：2小时）
- 核心概念介绍
- 基本原理理解
- 经典案例学习

### 第二阶段：进阶应用（建议时长：3小时）
- 实践项目演练
- 常见问题解决
- 最佳实践总结

### 第三阶段：能力提升（建议时长：2小时）
- 高级技巧探索
- 扩展知识学习
- 综合能力测试

## 学习建议
1. 建议按照顺序学习，打好基础
2. 每个阶段完成后进行自我测试
3. 遇到问题及时查阅资料
"""
        logger.info("✅ 学习计划生成完成")
        
        return {
            "learning_plan": learning_plan,
            "planning_error": None,
            "current_step": "planning",
            "completed_steps": state.get("completed_steps", []) + ["planning"]
        }
        
    except Exception as e:
        logger.error(f"❌ 规划节点执行失败: {e}")
        return {
            "learning_plan": None,
            "planning_error": str(e),
            "current_step": "error",
        }
```

```python
# workflows/nodes/retrieval_node.py（核心代码解析）

from typing import Dict, Any, List
from workflows.state import LearningState
from rag.retrievers import create_retriever
from config import get_logger

logger = get_logger(__name__)


def retrieval_node(state: LearningState) -> LearningState:
    """
    检索节点
    
    根据学习主题检索相关的知识库文档。
    
    Args:
        state: 当前状态
        
    Returns:
        更新后的状态
    """
    logger.info("🔍 执行检索节点")
    
    try:
        topic = state["topic"]
        
        # 加载向量存储和检索器
        # 实际项目中应该缓存检索器实例
        from rag.vector_stores import load_vector_store
        from rag.embeddings import get_embeddings
        
        index_path = "./data/indexes/sample"
        embeddings = get_embeddings()
        vector_store = load_vector_store(index_path, embeddings)
        
        if vector_store is None:
            # 没有索引时返回空列表
            return {
                "retrieved_documents": [],
                "retrieval_error": "向量索引不存在",
                "current_step": "retrieval",
                "completed_steps": state.get("completed_steps", []) + ["retrieval"]
            }
        
        # 创建检索器
        retriever = create_retriever(
            vector_store=vector_store,
            search_type="similarity",
            k=5
        )
        
        # 执行检索
        documents = retriever.invoke(topic)
        
        # 提取文档内容
        retrieved_contents = [
            doc.page_content[:500]  # 只保留前500字符
            for doc in documents
        ]
        
        logger.info(f"✅ 检索到 {len(retrieved_contents)} 篇相关文档")
        
        return {
            "retrieved_documents": retrieved_contents,
            "retrieval_error": None,
            "current_step": "retrieval",
            "completed_steps": state.get("completed_steps", []) + ["retrieval"]
        }
        
    except Exception as e:
        logger.error(f"❌ 检索节点执行失败: {e}")
        return {
            "retrieved_documents": [],
            "retrieval_error": str(e),
            "current_step": "error",
        }
```

```python
# workflows/nodes/quiz_generator_node.py（核心代码解析）

from typing import Dict, Any, List
from workflows.state import LearningState, QuizQuestion
from config import get_logger

logger = get_logger(__name__)


def quiz_generator_node(state: LearningState) -> LearningState:
    """
    出题节点
    
    根据学习资料生成练习题目。
    
    Args:
        state: 当前状态
        
    Returns:
        更新后的状态
    """
    logger.info("📝 执行出题节点")
    
    try:
        topic = state["topic"]
        retrieved_docs = state.get("retrieved_documents", [])
        
        # 生成题目（简化处理，实际应该调用 LLM）
        questions = [
            QuizQuestion(
                question_id=1,
                question_type="choice",
                question_text=f"关于 {topic}，以下说法正确的是？",
                options=[
                    "A. 核心概念一",
                    "B. 核心概念二",
                    "C. 核心概念三",
                    "D. 以上都是"
                ],
                correct_answer="D",
                explanation=f"{topic} 涵盖了多个核心概念，需要全面理解。",
                difficulty="medium"
            ),
            QuizQuestion(
                question_id=2,
                question_type="true-false",
                question_text=f"'{topic}' 的主要应用场景包括以下几个方面。",
                options=["正确", "错误"],
                correct_answer="正确",
                explanation=f"{topic} 在实际应用中有广泛的应用场景。",
                difficulty="easy"
            ),
            QuizQuestion(
                question_id=3,
                question_type="short-answer",
                question_text=f"请简述 {topic} 的三个主要特点。",
                correct_answer="请参考学习资料中的相关章节。",
                explanation="这是一个开放性问题，需要结合学习内容作答。",
                difficulty="hard"
            )
        ]
        
        # 转换为字典列表
        questions_data = [
            q.model_dump() for q in questions
        ]
        
        logger.info(f"✅ 生成了 {len(questions)} 道题目")
        
        return {
            "quiz_questions": questions_data,
            "quiz_error": None,
            "current_step": "quiz_generation",
            "completed_steps": state.get("completed_steps", []) + ["quiz_generation"]
        }
        
    except Exception as e:
        logger.error(f"❌ 出题节点执行失败: {e}")
        return {
            "quiz_questions": [],
            "quiz_error": str(e),
            "current_step": "error",
        }
```

```python
# workflows/nodes/grading_node.py（核心代码解析）

from typing import Dict, Any, List
from workflows.state import LearningState, GradeResult
from config import get_logger

logger = get_logger(__name__)


def grading_node(state: LearningState) -> LearningState:
    """
    评分节点
    
    评估用户的答案并给出评分。
    
    Args:
        state: 当前状态
        
    Returns:
        更新后的状态
    """
    logger.info("📊 执行评分节点")
    
    try:
        questions = state.get("quiz_questions", [])
        user_answers = state.get("user_answers", [])
        
        if not questions:
            return {
                "grades": [],
                "grading_error": "没有题目可评分",
                "current_step": "grading",
                "completed_steps": state.get("completed_steps", []) + ["grading"]
            }
        
        # 简化评分逻辑
        grades = []
        for i, question in enumerate(questions):
            user_answer = user_answers[i] if i < len(user_answers) else ""
            
            # 简化处理：对于选择题只要选对就得分
            is_correct = False
            score = 0.0
            
            if question["question_type"] == "choice":
                if user_answer.upper() == question["correct_answer"].upper():
                    is_correct = True
                    score = 1.0
            elif question["question_type"] == "true-false":
                if user_answer.strip() in ["正确", "True", "true", "T"]:
                    is_correct = True
                    score = 1.0
            else:
                # 简答题：检查是否为空
                if user_answer and len(user_answer) > 10:
                    is_correct = True
                    score = 0.7  # 简答题部分给分
            
            grade = GradeResult(
                question_id=question["question_id"],
                is_correct=is_correct,
                user_answer=user_answer,
                correct_answer=question["correct_answer"],
                score=score,
                feedback=f"{'正确' if is_correct else '错误'}，{'得分为 ' + str(score) if is_correct else '请参考答案进行分析。'}"
            )
            grades.append(grade.model_dump())
        
        correct_count = sum(1 for g in grades if g["is_correct"])
        logger.info(f"✅ 评分完成：{correct_count}/{len(grades)} 正确")
        
        return {
            "grades": grades,
            "grading_error": None,
            "current_step": "grading",
            "completed_steps": state.get("completed_steps", []) + ["grading"]
        }
        
    except Exception as e:
        logger.error(f"❌ 评分节点执行失败: {e}")
        return {
            "grades": [],
            "grading_error": str(e),
            "current_step": "error",
        }
```

```python
# workflows/nodes/feedback_node.py（核心代码解析）

from typing import Dict, Any
from workflows.state import LearningState
from config import get_logger

logger = get_logger(__name__)


def feedback_node(state: LearningState) -> LearningState:
    """
    反馈节点
    
    生成综合学习反馈。
    
    Args:
        state: 当前状态
        
    Returns:
        更新后的状态
    """
    logger.info("💬 执行反馈节点")
    
    try:
        topic = state["topic"]
        grades = state.get("grades", [])
        learning_plan = state.get("learning_plan", "")
        
        # 计算总体表现
        total = len(grades)
        correct = sum(1 for g in grades if g["is_correct"]) if grades else 0
        score_rate = (correct / total * 100) if total > 0 else 0
        
        # 生成反馈
        if score_rate >= 80:
            level = "优秀"
            advice = "您已经很好地掌握了这部分内容，可以进入更高级的学习。"
        elif score_rate >= 60:
            level = "良好"
            advice = "基础不错，建议针对错题进行复习巩固。"
        else:
            level = "需要加强"
            advice = "建议重新学习相关章节，多做练习题。"
        
        feedback = f"""
# {topic} 学习反馈

## 总体评估
- 正确率：{correct}/{total} ({score_rate:.1f}%)
- 表现等级：{level}

## 学习建议
{advice}

## 后续学习路径
1. 复习薄弱环节：根据错题对应的知识点进行针对性学习
2. 实践应用：尝试将所学知识应用于实际项目
3. 进阶挑战：完成更高难度的练习题

## 学习计划参考
{learning_plan[:500] if learning_plan else '请先生成学习计划'}
"""
        
        logger.info(f"✅ 反馈生成完成，表现等级：{level}")
        
        return {
            "feedback": feedback,
            "feedback_error": None,
            "current_step": "feedback",
            "completed_steps": state.get("completed_steps", []) + ["feedback"]
        }
        
    except Exception as e:
        logger.error(f"❌ 反馈节点执行失败: {e}")
        return {
            "feedback": None,
            "feedback_error": str(e),
            "current_step": "error",
        }
```

### 3.4 工作流图定义与执行

现在创建完整的工作流图：

```python
# workflows/study_flow_graph.py（核心代码解析）

from typing import Optional
from langgraph.graph import StateGraph, END, START
from workflows.state import LearningState, get_initial_state
from workflows.nodes.planner_node import planner_node
from workflows.nodes.retrieval_node import retrieval_node
from workflows.nodes.quiz_generator_node import quiz_generator_node
from workflows.nodes.grading_node import grading_node
from workflows.nodes.feedback_node import feedback_node
from config import get_logger

logger = get_logger(__name__)


def create_study_workflow(checkpointer=None):
    """
    创建智能学习工作流
    
    Args:
        checkpointer: 状态持久化检查点
        
    Returns:
        可执行的工作流图
    """
    # 1. 创建状态图
    workflow = StateGraph(LearningState)
    
    # 2. 添加节点
    workflow.add_node("planner", planner_node)
    workflow.add_node("retrieval", retrieval_node)
    workflow.add_node("quiz_generator", quiz_generator_node)
    workflow.add_node("grading", grading_node)
    workflow.add_node("feedback", feedback_node)
    
    # 3. 添加边（定义执行流程）
    # 入口 -> 规划
    workflow.add_edge(START, "planner")
    
    # 规划 -> 检索
    workflow.add_edge("planner", "retrieval")
    
    # 检索 -> 出题
    workflow.add_edge("retrieval", "quiz_generator")
    
    # 出题 -> 评分
    workflow.add_edge("quiz_generator", "grading")
    
    # 评分 -> 反馈
    workflow.add_edge("grading", "feedback")
    
    # 反馈 -> 结束
    workflow.add_edge("feedback", END)
    
    # 4. 添加检查点（可选）
    if checkpointer:
        workflow.checkpointer = checkpointer
    
    # 5. 编译工作流
    app = workflow.compile()
    
    logger.info("✅ 智能学习工作流创建完成")
    
    return app


def run_study_workflow(
    topic: str,
    learning_goal: str,
    user_level: str = "intermediate"
):
    """
    运行学习工作流
    
    Args:
        topic: 学习主题
        learning_goal: 学习目标
        user_level: 用户水平
        
    Returns:
        最终状态
    """
    # 创建工作流
    app = create_study_workflow()
    
    # 创建初始状态
    initial_state = get_initial_state(topic, learning_goal, user_level)
    
    # 运行工作流
    config = {"configurable": {"thread_id": "study-001"}}
    final_state = app.invoke(initial_state, config=config)
    
    return final_state


async def run_study_workflow_stream(
    topic: str,
    learning_goal: str,
    user_level: str = "intermediate"
):
    """
    流式运行学习工作流
    
    Args:
        topic: 学习主题
        learning_goal: 学习目标
        user_level: 用户水平
        
    Yields:
        中间状态更新
    """
    from langgraph.checkpoint.memory import MemorySaver
    
    # 创建带检查点的工作流
    memory = MemorySaver()
    app = create_study_workflow(checkpointer=memory)
    
    # 创建初始状态
    initial_state = get_initial_state(topic, learning_goal, user_level)
    
    # 流式运行
    config = {"configurable": {"thread_id": "study-002"}}
    
    async for chunk in app.astream(initial_state, config=config):
        yield chunk
```

创建工作流测试脚本：

```python
# examples/ch03/01_workflow_demo.py
"""
工作流示例
学习如何创建和运行 LangGraph 工作流
"""

import asyncio
from workflows.study_flow_graph import create_study_workflow, run_study_workflow
from config import get_logger

logger = get_logger(__name__)


def main():
    """运行学习工作流示例"""
    
    print("=" * 60)
    print("📚 LangGraph 智能学习工作流示例")
    print("=" * 60)
    
    # 运行工作流
    topic = "Python 面向对象编程"
    learning_goal = "理解类和对象的概念，掌握继承和多态"
    user_level = "intermediate"
    
    print(f"\n📝 学习主题: {topic}")
    print(f"🎯 学习目标: {learning_goal}")
    print(f"👤 用户水平: {user_level}")
    
    # 同步运行
    print("\n🚀 开始执行工作流...")
    result = run_study_workflow(topic, learning_goal, user_level)
    
    # 显示结果
    print("\n" + "=" * 60)
    print("📊 工作流执行结果")
    print("=" * 60)
    
    print(f"\n✅ 已完成步骤: {result.get('completed_steps', [])}")
    print(f"📍 当前步骤: {result.get('current_step', 'unknown')}")
    
    if result.get("learning_plan"):
        print("\n📋 学习计划:")
        print("-" * 40)
        print(result["learning_plan"][:500] + "...")
    
    if result.get("quiz_questions"):
        print(f"\n📝 生成的题目数: {len(result['quiz_questions'])}")
        for q in result["quiz_questions"][:2]:
            print(f"   - [{q['question_type']}] {q['question_text'][:50]}...")
    
    if result.get("feedback"):
        print("\n💬 学习反馈:")
        print("-" * 40)
        print(result["feedback"][:300] + "...")


async def streaming_demo():
    """流式运行示例"""
    print("\n" + "=" * 60)
    print("🌊 流式执行工作流")
    print("=" * 60)
    
    topic = "机器学习基础"
    learning_goal = "了解机器学习的基本概念"
    
    print(f"\n📝 学习主题: {topic}")
    print("📡 流式输出状态更新...")
    
    async for chunk in run_study_workflow_stream(topic, learning_goal):
        # 显示节点更新
        for node_name, node_data in chunk.items():
            if isinstance(node_data, dict) and "current_step" in node_data:
                step = node_data.get("current_step")
                print(f"   📍 节点 {node_name}: {step}")


if __name__ == "__main__":
    main()
    asyncio.run(streaming_demo())
```

### 3.5 条件分支工作流

接下来学习如何创建带条件分支的工作流：

```python
# examples/ch03/02_conditional_workflow.py
"""
条件分支工作流示例
学习如何创建带条件判断的工作流
"""

from typing import TypedDict
from langgraph.graph import StateGraph, END, START
from langgraph.checkpoint.memory import MemorySaver
from config import get_logger

logger = get_logger(__name__)


class ConditionalState(TypedDict):
    """带条件分支的状态"""
    input_value: int
    process_a_result: str
    process_b_result: str
    final_decision: str
    intermediate_values: list


def process_a(state: ConditionalState) -> ConditionalState:
    """处理 A"""
    result = f"处理 A: 输入值 {state['input_value']} * 2 = {state['input_value'] * 2}"
    return {
        "process_a_result": result,
        "intermediate_values": state.get("intermediate_values", []) + [state["input_value"]]
    }


def process_b(state: ConditionalState) -> ConditionalState:
    """处理 B"""
    result = f"处理 B: 输入值 {state['input_value']} + 10 = {state['input_value'] + 10}"
    return {
        "process_b_result": result,
        "intermediate_values": state.get("intermediate_values", []) + [state["input_value"]]
    }


def should_continue(state: ConditionalState) -> str:
    """
    条件判断函数
    
    根据状态决定下一步执行哪个节点。
    
    Returns:
        下一个节点名称
    """
    input_value = state["input_value"]
    
    if input_value > 50:
        return "process_b"
    elif input_value < 10:
        return "process_a"
    else:
        return "both"


def make_decision(state: ConditionalState) -> ConditionalState:
    """最终决策节点"""
    process_a = state.get("process_a_result", "")
    process_b = state.get("process_b_result", "")
    
    if process_a and process_b:
        decision = f"同时执行了 A 和 B：{process_a}，{process_b}"
    elif process_a:
        decision = f"只执行了 A：{process_a}"
    elif process_b:
        decision = f"只执行了 B：{process_b}"
    else:
        decision = "未执行任何处理"
    
    return {"final_decision": decision}


def create_conditional_workflow():
    """创建条件分支工作流"""
    workflow = StateGraph(ConditionalState)
    
    # 添加节点
    workflow.add_node("process_a", process_a)
    workflow.add_node("process_b", process_b)
    workflow.add_node("make_decision", make_decision)
    
    # 设置入口
    workflow.add_edge(START, "make_decision")
    
    # 添加条件边
    workflow.add_conditional_edges(
        "make_decision",
        should_continue,
        {
            "process_a": "process_a",
            "process_b": "process_b",
            "both": "both"
        }
    )
    
    # 从两个处理节点汇聚到结束
    workflow.add_edge("process_a", END)
    workflow.add_edge("process_b", END)
    
    # 编译工作流
    return workflow.compile()


def main():
    """测试条件分支工作流"""
    
    print("=" * 60)
    print("🔀 条件分支工作流示例")
    print("=" * 60)
    
    app = create_conditional_workflow()
    
    # 测试用例
    test_cases = [
        {"input_value": 5, "description": "小于 10，只执行 A"},
        {"input_value": 25, "description": "10-50，同时执行 A 和 B"},
        {"input_value": 75, "description": "大于 50，只执行 B"},
    ]
    
    for test in test_cases:
        print(f"\n📝 测试: 输入值 {test['input_value']} ({test['description']})")
        print("-" * 40)
        
        state = {"input_value": test["input_value"]}
        result = app.invoke(state)
        
        print(f"   结果: {result.get('final_decision', 'N/A')}")


if __name__ == "__main__":
    main()
```

### 3.6 带中断的工作流

学习如何实现人机协作的中断功能：

```python
# examples/ch03/03_human_in_loop.py
"""
人机交互工作流示例
学习如何使用中断点实现人机协作
"""

from typing import TypedDict
from langgraph.graph import StateGraph, END, START
from langgraph.checkpoint.memory import MemorySaver
from config import get_logger

logger = get_logger(__name__)


class HumanReviewState(TypedDict):
    """人机交互状态"""
    task_description: str
    ai_suggestion: str
    human_decision: str
    human_comment: str
    final_result: str
    approved: bool


def generate_suggestion(state: HumanReviewState) -> HumanReviewState:
    """AI 生成建议"""
    return {
        "ai_suggestion": f"建议方案：基于'{state['task_description']}'，推荐执行方案 A。"
    }


def human_review(state: HumanReviewState) -> HumanReviewState:
    """
    人机交互节点
    
    这个节点会中断执行，等待人类审核。
    """
    return {
        "human_decision": "待审核",
        "human_comment": ""
    }


def execute_approved(state: HumanReviewState) -> HumanReviewState:
    """执行批准的方案"""
    if state.get("approved"):
        return {
            "final_result": f"执行方案：{state['ai_suggestion']}，执行人备注：{state.get('human_comment', '')}"
        }
    else:
        return {
            "final_result": f"方案未通过。备注：{state.get('human_comment', '无')}"
        }


def create_human_review_workflow():
    """创建人机交互工作流"""
    workflow = StateGraph(HumanReviewState)
    
    # 添加节点
    workflow.add_node("generate_suggestion", generate_suggestion)
    workflow.add_node("human_review", human_review)
    workflow.add_node("execute_approved", execute_approved)
    
    # 设置流程
    workflow.add_edge(START, "generate_suggestion")
    workflow.add_edge("generate_suggestion", "human_review")
    workflow.add_edge("human_review", "execute_approved")
    workflow.add_edge("execute_approved", END)
    
    # 编译（启用中断）
    memory = MemorySaver()
    return workflow.compile(checkpointer=memory, interrupt_before=["human_review"])


def simulate_human_review():
    """模拟人机交互流程"""
    
    print("=" * 60)
    print("👤 人机交互工作流示例")
    print("=" * 60)
    
    app = create_human_review_workflow()
    
    # 初始状态
    initial_state = {
        "task_description": "优化用户登录流程"
    }
    
    # 第一步：启动工作流
    print("\n🚀 步骤 1: 启动工作流")
    config = {"configurable": {"thread_id": "review-001"}}
    result = app.invoke(initial_state, config=config)
    
    print(f"   AI 建议: {result['ai_suggestion']}")
    print("   ⚠️  工作流已暂停，等待人工审核...")
    
    # 第二步：模拟人工审核
    print("\n👤 步骤 2: 人工审核")
    approved = input("   是否批准该方案？(y/n): ").lower().strip() == "y"
    comment = input("   请输入审核意见: ")
    
    # 继续执行
    print("\n▶️  步骤 3: 继续执行")
    
    # 获取当前状态并更新
    current_state = app.get_state(config).values
    current_state["approved"] = approved
    current_state["human_comment"] = comment
    
    # 从中断点继续
    result = app.invoke(current_state, config=config)
    
    print(f"\n✅ 最终结果: {result['final_result']}")


if __name__ == "__main__":
    simulate_human_review()
```

## 教学要点

### 3.1 工作流设计的最佳实践

工作流设计应该遵循"单一职责"原则，每个节点只做一件事。复杂的功能应该拆分为多个节点，而不是在一个节点中处理所有逻辑。细粒度的节点划分带来更好的可维护性、可测试性和可复用性。但也要避免过度拆分，如果两个操作总是同时执行且逻辑紧密相关，合并为单个节点可能更合适。

状态设计是工作流开发的关键。状态应该包含所有节点需要共享的数据，但不应该包含只在单个节点内部使用的数据。状态的字段应该有明确的类型定义，便于类型检查和调试。对于大型数据，考虑使用引用而不是直接存储，通过 ID 或路径在状态中引用外部数据。

边的设计需要仔细规划。入口边和出口边定义工作流的起止点；普通边定义固定执行顺序；条件边根据状态动态决定执行路径。在复杂工作流中，可以使用平行节点并行处理独立的任务，提高执行效率。汇聚节点等待所有前置节点完成后继续执行。

### 3.2 调试与监控技巧

LangGraph 提供了多种调试工具。可视化是最直观的方式，使用 Mermaid 或 Graphviz 可以将工作流图渲染为图形，直观展示节点和边的关系。调试模式可以输出每个节点的详细执行信息，包括输入状态、输出状态、执行时间等。

日志记录是生产环境中的重要监控手段。QST智能学习助手 项目采用结构化日志，在每个节点的关键位置添加日志，记录入参、出参、耗时等信息。通过日志可以追踪工作流的执行路径，定位问题发生的位置。日志级别应该合理使用，DEBUG 用于详细调试，INFO 用于正常运行记录，WARN 和 ERROR 用于异常情况。

状态快照是排查问题的有力工具。通过检查点机制，可以获取工作流在任意时刻的状态快照。分析快照可以了解工作流的执行历史，每个节点接收到的输入和产生的输出。异常发生时，查看最近的快照可以帮助定位问题的根因。

### 3.3 性能优化策略

工作流的性能优化从几个方面考虑。首先是节点执行效率，尽量减少节点内部的 I/O 操作和计算量。对于耗时操作，考虑使用缓存或异步处理。其次是并行执行，独立节点可以并行运行，充分利用多核 CPU。

检查点的频率需要权衡。频繁的检查点消耗更多存储和 I/O 资源，但提供更细粒度的恢复点；稀疏的检查点减少开销，但可能丢失更多工作。合理的策略是在长时间运行的节点之后设置检查点，或者定期设置检查点。

流式输出可以改善用户体验。用户不需要等待整个工作流完成就能看到中间结果，特别是对于需要长时间生成内容的工作流，流式输出能够显著降低感知延迟。

## 课后作业

### 基础作业

**作业 1：简单流水线工作流**

创建一个简单的工作流。要求：
- 定义包含 3-4 个节点的处理流水线
- 每个节点处理不同的任务（如验证、转换、处理）
- 节点之间通过状态传递数据
- 实现基本的错误处理

**作业 2：条件分支工作流**

创建一个带条件分支的工作流。要求：
- 实现根据输入值决定执行路径
- 至少包含 2 个条件分支
- 不同的分支执行不同的处理逻辑
- 测试各种输入条件

### 中级作业

**作业 3：并行处理工作流**

创建支持并行执行的工作流。要求：
- 实现一个入口，多个分支并行执行
- 使用汇聚节点等待所有分支完成
- 分析并行执行 vs 顺序执行的性能差异
- 实现超时处理

**作业 4：带反馈的工作流**

创建支持循环反馈的工作流。要求：
- 工作流执行后允许用户反馈
- 根据反馈决定是否重新执行
- 限制最大循环次数
- 实现早停条件

### 高级作业

**作业 5：可配置的工作流引擎**

设计一个可配置的工作流引擎。要求：
- 支持 JSON/YAML 定义工作流结构
- 运行时动态修改工作流配置
- 支持热加载节点实现
- 提供 Web 管理界面

**作业 6：分布式工作流系统**

设计分布式工作流执行系统。要求：
- 支持多个工作节点并行执行
- 实现任务分发和结果收集
- 支持检查点的跨节点持久化
- 实现故障转移机制

## 代码示例

### 示例 1：完整工作流模板

```python
# workflows/template.py
"""
工作流模板
创建新工作流时参考此模板
"""

from typing import TypedDict, Optional, List, Any
from langgraph.graph import StateGraph, END, START
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.checkpoint.memory import MemorySaver
from config import get_logger

logger = get_logger(__name__)


# 1. 定义状态类型
class WorkflowState(TypedDict):
    """
    工作流状态定义
    
    包含工作流执行过程中需要的所有数据。
    """
    # 输入参数
    input_data: str
    
    # 中间结果
    step_1_result: Optional[str]
    step_2_result: Optional[str]
    step_3_result: Optional[str]
    
    # 输出结果
    final_result: Optional[str]
    
    # 错误处理
    error: Optional[str]
    error_step: Optional[str]
    
    # 元数据
    current_step: str
    completed_steps: List[str]


# 2. 定义节点函数
def step_1_node(state: WorkflowState) -> WorkflowState:
    """
    第一步处理节点
    
    Args:
        state: 当前状态
        
    Returns:
        更新后的状态
    """
    try:
        logger.info("🔧 执行步骤 1")
        
        # 业务逻辑
        result = f"处理输入: {state['input_data']}"
        
        return {
            "step_1_result": result,
            "current_step": "step_1",
            "completed_steps": state.get("completed_steps", []) + ["step_1"]
        }
    except Exception as e:
        return {
            "step_1_result": None,
            "error": str(e),
            "error_step": "step_1",
            "current_step": "error"
        }


def step_2_node(state: WorkflowState) -> WorkflowState:
    """第二步处理节点"""
    try:
        logger.info("🔧 执行步骤 2")
        
        prev_result = state.get("step_1_result", "")
        result = f"{prev_result} -> 步骤2处理"
        
        return {
            "step_2_result": result,
            "current_step": "step_2",
            "completed_steps": state.get("completed_steps", []) + ["step_2"]
        }
    except Exception as e:
        return {
            "step_2_result": None,
            "error": str(e),
            "error_step": "step_2",
            "current_step": "error"
        }


def step_3_node(state: WorkflowState) -> WorkflowState:
    """第三步处理节点"""
    try:
        logger.info("🔧 执行步骤 3")
        
        prev_result = state.get("step_2_result", "")
        result = f"{prev_result} -> 步骤3完成"
        
        return {
            "step_3_result": result,
            "current_step": "step_3",
            "completed_steps": state.get("completed_steps", []) + ["step_3"]
        }
    except Exception as e:
        return {
            "step_3_result": None,
            "error": str(e),
            "error_step": "step_3",
            "current_step": "error"
        }


def finalize_node(state: WorkflowState) -> WorkflowState:
    """最终汇总节点"""
    return {
        "final_result": f"工作流完成。结果: {state.get('step_3_result', '')}",
        "current_step": "finalize"
    }


def error_handler_node(state: WorkflowState) -> WorkflowState:
    """错误处理节点"""
    return {
        "final_result": f"工作流失败。在 {state.get('error_step', 'unknown')} 步骤发生错误: {state.get('error', '')}",
        "current_step": "error_handled"
    }


# 3. 创建工作流函数
def create_workflow(
    checkpointer: BaseCheckpointSaver = None,
    enable_error_handling: bool = True
) -> StateGraph:
    """
    创建工作流
    
    Args:
        checkpointer: 状态持久化检查点
        enable_error_handling: 是否启用错误处理
        
    Returns:
        编译后的工作流图
    """
    workflow = StateGraph(WorkflowState)
    
    # 添加节点
    workflow.add_node("step_1", step_1_node)
    workflow.add_node("step_2", step_2_node)
    workflow.add_node("step_3", step_3_node)
    workflow.add_node("finalize", finalize_node)
    
    if enable_error_handling:
        workflow.add_node("error_handler", error_handler_node)
    
    # 添加边
    workflow.add_edge(START, "step_1")
    workflow.add_edge("step_1", "step_2")
    workflow.add_edge("step_2", "step_3")
    workflow.add_edge("step_3", "finalize")
    workflow.add_edge("finalize", END)
    
    # 添加错误处理边
    if enable_error_handling:
        for step in ["step_1", "step_2", "step_3"]:
            workflow.add_edge(step, "error_handler")
        workflow.add_edge("error_handler", END)
    
    # 设置检查点
    if checkpointer:
        workflow.checkpointer = checkpointer
    
    return workflow


def run_workflow_example():
    """运行工作流示例"""
    # 创建工作流
    memory = MemorySaver()
    app = create_workflow(checkpointer=memory).compile()
    
    # 初始状态
    initial_state = WorkflowState(
        input_data="测试数据",
        step_1_result=None,
        step_2_result=None,
        step_3_result=None,
        final_result=None,
        error=None,
        error_step=None,
        current_step="start",
        completed_steps=[]
    )
    
    # 运行
    config = {"configurable": {"thread_id": "workflow-001"}}
    result = app.invoke(initial_state, config=config)
    
    print(f"✅ 最终结果: {result.get('final_result')}")
    print(f"📋 完成步骤: {result.get('completed_steps', [])}")
```

### 示例 2：工作流监控

```python
# workflows/monitoring.py
"""
工作流监控模块
收集和报告工作流执行指标
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime
import time


@dataclass
class WorkflowMetrics:
    """工作流执行指标"""
    workflow_name: str
    thread_id: str
    start_time: float
    end_time: Optional[float] = None
    status: str = "running"
    steps: List[Dict[str, Any]] = field(default_factory=list)
    error: Optional[str] = None
    
    @property
    def duration_ms(self) -> float:
        """执行时长（毫秒）"""
        end = self.end_time or time.time()
        return (end - self.start_time) * 1000
    
    def to_dict(self) -> Dict[str, Any]:
        """转换为字典"""
        return {
            "workflow_name": self.workflow_name,
            "thread_id": self.thread_id,
            "status": self.status,
            "duration_ms": f"{self.duration_ms:.2f}",
            "steps": self.steps,
            "error": self.error
        }


class WorkflowMonitor:
    """工作流监控器"""
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._metrics: Dict[str, WorkflowMetrics] = {}
        return cls._instance
    
    def start_workflow(
        self,
        workflow_name: str,
        thread_id: str
    ) -> str:
        """开始监控工作流"""
        metrics = WorkflowMetrics(
            workflow_name=workflow_name,
            thread_id=thread_id,
            start_time=time.time()
        )
        self._metrics[f"{workflow_name}_{thread_id}"] = metrics
        return thread_id
    
    def end_workflow(
        self,
        workflow_name: str,
        thread_id: str,
        status: str = "completed",
        error: str = None
    ):
        """结束监控工作流"""
        key = f"{workflow_name}_{thread_id}"
        if key in self._metrics:
            self._metrics[key].end_time = time.time()
            self._metrics[key].status = status
            self._metrics[key].error = error
    
    def record_step(
        self,
        workflow_name: str,
        thread_id: str,
        step_name: str,
        duration_ms: float,
        status: str = "completed"
    ):
        """记录步骤执行"""
        key = f"{workflow_name}_{thread_id}"
        if key in self._metrics:
            self._metrics[key].steps.append({
                "step": step_name,
                "duration_ms": f"{duration_ms:.2f}",
                "status": status,
                "timestamp": datetime.now().isoformat()
            })
    
    def get_metrics(self, workflow_name: str = None) -> List[Dict]:
        """获取监控指标"""
        if workflow_name:
            return [
                m.to_dict() for m in self._metrics.values()
                if m.workflow_name == workflow_name
            ]
        return [m.to_dict() for m in self._metrics.values()]
```

## 参考资料

### 官方文档

- LangGraph 官方文档：https://docs.langgraph.com/
- LangGraph GitHub 仓库：https://github.com/langchain-ai/langgraph
- LangChain StateGraph 文档：https://python.langchain.com/docs/langgraph

### 技术资源

- 状态机设计模式：https://refactoring.guru/design-patterns/state
- 工作流引擎比较：https://github.com/topics/workflow-engine
- DAG 有向无环图：https://en.wikipedia.org/wiki/Directed_acyclic_graph

### 进阶阅读

- LangGraph 教程合集：https://github.com/langchain-ai/langgraph/tree/main/examples
- Human-in-the-Loop ML：https://github.com/human-in-the-loop
- 工作流自动化最佳实践：https://n8n.io/blog/workflows-best-practices
