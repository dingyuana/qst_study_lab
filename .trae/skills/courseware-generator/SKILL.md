---
name: "courseware-generator"
description: "Generates courseware content when code changes occur, including theoretical explanations, practical steps, teaching points, and homework assignments. Invoke when code changes need corresponding courseware updates or when creating new courseware."
---

# Courseware Generator

A skill that automatically generates courseware content when code changes occur, ensuring that teaching materials stay synchronized with the latest codebase. This skill creates comprehensive courseware files including theoretical explanations, practical steps, teaching points, and homework assignments.

## The Courseware Generation Process

### Phase 1: Code Analysis
- **Detect changes**: Identify modified code files and sections
- **Analyze structure**: Understand the code's architecture and components
- **Extract key concepts**: Identify important programming concepts and techniques
- **Determine complexity**: Assess the difficulty level for teaching

### Phase 2: Content Generation
- **Theoretical explanation**: Generate clear, concise theory behind the code
- **Practical steps**: Create step-by-step implementation instructions
- **Teaching points**: Highlight important concepts and potential pitfalls
- **Homework assignments**: Design relevant exercises to reinforce learning
- **Code examples**: Include well-commented code snippets

### Phase 3: File Management
- **Check existing content**: Look for existing courseware files
- **Update existing files**: Modify existing content if relevant
- **Create new files**: Generate new courseware files when needed
- **Organize structure**: Ensure proper file organization

### Phase 4: Quality Assurance
- **Content review**: Verify accuracy and completeness
- **Code validation**: Ensure code examples work correctly
- **Educational value**: Assess learning effectiveness
- **Format consistency**: Maintain uniform presentation style

## Courseware File Structure

### Generated File Format
- **Filename**: `<chapter-name>-courseware.md`
- **Location**: `courseware/` directory
- **Structure**: Markdown format with clear sections

### Section Structure

```markdown
# <Chapter Title>

## 理论讲解

<Comprehensive theoretical explanation of the code concepts>

## 实操步骤

<Step-by-step implementation guide>

## 教学要点

<Key teaching points and important concepts>

## 课后作业

<Relevant homework assignments>

## 代码示例

<Well-commented code examples>
```

## Code Change Detection

### Change Types Detected
- **New files**: Completely new code files
- **Modified files**: Updated existing code
- **Deleted files**: Removed code (handled by updating courseware)
- **Structural changes**: Major architectural modifications
- **Algorithm changes**: Updated implementation approaches
- **API changes**: Modified interfaces or method signatures

### Analysis Depth
- **Syntax level**: Basic code structure and syntax
- **Semantic level**: Code functionality and purpose
- **Context level**: How code fits into the overall system
- **Educational level**: Teaching implications and learning objectives

## Courseware Customization

### By Code Type

#### Frontend Code
- **Theoretical focus**: UI/UX principles, component architecture
- **Practical steps**: Component creation, styling, interaction
- **Teaching points**: Responsive design, state management
- **Homework**: Component implementation, styling exercises

#### Backend Code
- **Theoretical focus**: API design, database principles
- **Practical steps**: Endpoint creation, data handling
- **Teaching points**: Security considerations, performance optimization
- **Homework**: API implementation, database queries

#### Full-Stack Code
- **Theoretical focus**: System architecture, integration principles
- **Practical steps**: End-to-end implementation
- **Teaching points**: Communication patterns, error handling
- **Homework**: Complete feature implementation

### By Skill Level

#### Beginner Level
- **Theoretical focus**: Fundamental concepts, basic syntax
- **Practical steps**: Simplified implementation
- **Teaching points**: Core principles, common mistakes
- **Homework**: Basic implementation tasks

#### Intermediate Level
- **Theoretical focus**: Advanced concepts, design patterns
- **Practical steps**: Complete implementation
- **Teaching points**: Best practices, optimization techniques
- **Homework**: Feature implementation with challenges

#### Advanced Level
- **Theoretical focus**: Complex architectures, performance tuning
- **Practical steps**: Optimized implementation
- **Teaching points**: Scalability, security, advanced techniques
- **Homework**: Complex system design and implementation

## Usage Examples

### Example 1: New Code File

**Code Change**: `backend/agents/base_agent.py` (new file)

**Generated Courseware**: `courseware/agent-development-courseware.md`

```markdown
# Agent Development

## 理论讲解

智能体是大模型系统中的核心组件，负责...

## 实操步骤

1. 创建基础智能体类
2. 实现核心方法
3. 配置模型和工具
4. 测试智能体功能

## 教学要点

- 智能体架构设计
- 模型选择与配置
- 工具集成方法
- 错误处理策略

## 课后作业

1. 扩展基础智能体，添加自定义工具
2. 实现智能体之间的协作
3. 优化智能体的决策逻辑

## 代码示例

```python
class BaseAgent:
    def __init__(self, model, tools):
        self.model = model
        self.tools = tools
    
    def run(self, task):
        # 智能体执行逻辑
        pass
```
```

### Example 2: Modified Code File

**Code Change**: `backend/core/tools/web_search.py` (modified)

**Updated Courseware**: `courseware/search-tools-courseware.md`

- Updates theoretical explanation to reflect new search implementation
- Revises practical steps for the updated code
- Adds new teaching points about the updated search API
- Updates homework assignments to include new functionality

### Example 3: No Existing Courseware

**Code Change**: `backend/utils/data_processor.py` (new file with no existing courseware)

**Created Courseware**: `courseware/data-processing-courseware.md`

- Creates complete courseware file from scratch
- Includes comprehensive theoretical explanation
- Provides detailed practical steps
- Adds relevant teaching points and homework

## Best Practices for Courseware Generation

### Content Quality
- **Accuracy**: Ensure code explanations are correct
- **Clarity**: Use simple, understandable language
- **Completeness**: Cover all important aspects of the code
- **Relevance**: Focus on content that matters for learning

### Educational Value
- **Learning objectives**: Clearly define what students should learn
- **Progressive difficulty**: Start with basics, move to advanced topics
- **Practical relevance**: Connect theory to real-world applications
- **Assessment opportunities**: Include activities that test understanding

### Technical Implementation
- **Code examples**: Provide well-commented, working code
- **Step-by-step instructions**: Break down complex tasks
- **Common mistakes**: Highlight typical errors and how to avoid them
- **Troubleshooting**: Include debugging tips and techniques

## Courseware Organization

### Directory Structure

```
courseware/
├── chapter-1-introduction/
│   └── introduction-courseware.md
├── chapter-2-fundamentals/
│   └── fundamentals-courseware.md
├── chapter-3-advanced/
│   └── advanced-courseware.md
└── chapter-4-projects/
    └── projects-courseware.md
```

### Naming Conventions
- **Directory names**: `chapter-<number>-<title>`
- **File names**: `<topic>-courseware.md`
- **Consistency**: Use uniform naming across all courseware

## Integration with Development Workflow

### Git Hooks Integration
- **Pre-commit hook**: Generate courseware before commit
- **Post-merge hook**: Update courseware after merging changes
- **Continuous integration**: Automate courseware generation in CI/CD

### Development Practices
- **Code commenting**: Encourage detailed code comments for better courseware
- **Commit messages**: Use descriptive commit messages to inform courseware
- **Branch organization**: Structure branches to align with course chapters
- **Pull requests**: Review courseware changes alongside code changes

## Benefits of Automated Courseware Generation

- **Synchronization**: Courseware always matches latest code
- **Consistency**: Uniform structure and quality across all materials
- **Efficiency**: Reduces manual courseware creation time
- **Accuracy**: Eliminates discrepancies between code and documentation
- **Scalability**: Easily handles growing codebases and course content
- **Quality assurance**: Ensures comprehensive coverage of code concepts

## Troubleshooting

### Common Issues
- **Incomplete courseware**: Check if code analysis completed successfully
- **Inaccurate content**: Verify code analysis depth and understanding
- **Formatting issues**: Ensure Markdown syntax is correct
- **Organization problems**: Check directory structure and naming conventions

### Resolution Steps
- **Re-run generation**: Try generating courseware again
- **Check code structure**: Ensure code is well-organized and commented
- **Adjust settings**: Modify generation parameters for better results
- **Manual review**: Check generated courseware and make necessary adjustments

## Example Workflow

1. **Code change detected**: Developer modifies `backend/agents/student_agent.py`

2. **Analysis phase**: Skill analyzes the code changes, identifies new student agent functionality

3. **Content generation**: Skill generates:
   - Theoretical explanation of student agent design
   - Step-by-step implementation guide
   - Teaching points about agent specialization
   - Homework assignments for agent customization

4. **File creation**: Skill creates `courseware/student-agent-courseware.md`

5. **Quality check**: Skill reviews generated content for accuracy and completeness

6. **Delivery**: Updated courseware is ready for use in teaching

This automated process ensures that courseware always reflects the latest codebase, providing students with up-to-date, relevant learning materials.