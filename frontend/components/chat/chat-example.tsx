"use client";

import {
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
} from "@/components/ai-elements/message";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { MessageResponse } from "@/components/ai-elements/message";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import type { ToolUIPart } from "ai";
import { CheckIcon, GlobeIcon, MicIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useCallback, useState, useRef, useEffect } from "react";
import { toast } from "sonner";

type MessageType = {
  key: string;
  from: "user" | "assistant";
  sources?: { href: string; title: string }[];
  versions: {
    id: string;
    content: string;
  }[];
  reasoning?: {
    content: string;
    duration: number;
  };
  tools?: {
    name: string;
    description: string;
    status: ToolUIPart["state"];
    parameters: Record<string, unknown>;
    result: string | undefined;
    error: string | undefined;
  }[];
};

const initialMessages: MessageType[] = [
  {
    key: nanoid(),
    from: "user",
    versions: [
      {
        id: nanoid(),
        content: "请解释一下 LangChain 的主要功能和使用方法？",
      },
    ],
  },
  {
    key: nanoid(),
    from: "assistant",
    sources: [
      {
        href: "https://python.langchain.com/",
        title: "LangChain 官方文档",
      },
      {
        href: "https://docs.langchain.com/",
        title: "LangChain 文档",
      },
    ],
    tools: [
      {
        name: "mcp",
        description: "正在搜索 LangChain 文档",
        status: "input-available",
        parameters: {
          query: "LangChain 主要功能",
          source: "python.langchain.com",
        },
        result: `{
  "query": "LangChain 主要功能",
  "results": [
    {
      "title": "LangChain 核心概念",
      "url": "https://python.langchain.com/docs/concepts/",
      "snippet": "LangChain 是一个用于构建大语言模型应用的框架，提供了模型 I/O、数据检索、链式调用等功能。"
    },
    {
      "title": "快速开始",
      "url": "https://python.langchain.com/docs/quick_start/",
      "snippet": "学习如何快速开始使用 LangChain 构建你的第一个 LLM 应用。"
    },
    {
      "title": "Agents 和 Tools",
      "url": "https://python.langchain.com/docs/how_to/agents/",
      "snippet": "了解如何使用 Agents 和 Tools 来创建能够执行复杂任务的智能体。"
    }
  ]
}`,
        error: undefined,
      },
    ],
    versions: [
      {
        id: nanoid(),
        content: `## LangChain 主要功能

LangChain 是一个强大的大语言模型应用开发框架，主要功能包括：

### 核心功能

- **模型 I/O**：统一封装多种 LLM 模型的调用接口
- **数据检索**：支持向量数据库和文档加载
- **链式调用**：通过 Chain 将多个组件串联
- **智能体**：创建能够使用工具的 AI Agent
- **记忆管理**：对话历史和状态持久化

### 常用组件

- **LLM**：语言模型调用
- **ChatModel**：对话模型封装
- **PromptTemplate**：提示词模板
- **VectorStore**：向量数据库
- **Retriever**：检索器

### 简单示例

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

llm = ChatOpenAI(model="gpt-4o")
prompt = ChatPromptTemplate.from_messages([
    ("human", "请用一句话解释 {topic}")
])

chain = prompt | llm
response = chain.invoke({"topic": "人工智能"})
print(response.content)
\`\`\`

还有其他问题想了解吗？`,
      },
    ],
  },
  {
    key: nanoid(),
    from: "user",
    versions: [
      {
        id: nanoid(),
        content: "LangGraph 和 LangChain 有什么关系？",
      },
      {
        id: nanoid(),
        content: "我想了解更多关于 LangGraph 的信息，它和 LangChain 有什么不同？",
      },
    ],
  },
  {
    key: nanoid(),
    from: "assistant",
    reasoning: {
      content: `用户问的是 LangGraph 和 LangChain 的关系。LangGraph 是 LangChain 的扩展，专门用于构建复杂的多智能体工作流。它基于图结构，允许定义节点和边来实现复杂的流程控制。`,
      duration: 10,
    },
    versions: [
      {
        id: nanoid(),
        content: `## LangGraph 与 LangChain 的关系

LangGraph 是 LangChain 的扩展库，专门用于构建**复杂的多智能体工作流**。

### 关系说明

- **LangChain**：提供基础的 LLM 应用开发能力
- **LangGraph**：在 LangChain 基础上，提供图结构的工作流编排

### LangGraph 的特点

1. **图结构**：使用节点和边组织流程
2. **状态管理**：每个节点可以读写共享状态
3. **循环支持**：支持条件循环和迭代
4. **检查点**：自动保存和恢复执行状态

### 简单对比

| 特性 | LangChain | LangGraph |
|------|-----------|-----------|
| 复杂度 | 简单任务 | 复杂工作流 |
| 结构 | 线性链 | 图结构 |
| 状态 | 无共享状态 | 节点间共享状态 |
| 适用场景 | 单一调用 | 多步骤编排 |

### LangGraph 示例

\`\`\`python
from langgraph.graph import StateGraph

def my_node(state):
    return {"result": f"处理: {state['input']}"}

graph = StateGraph(dict)
graph.add_node("process", my_node)
graph.set_entry_point("process")
app = graph.compile()
\`\`\``,
      },
    ],
  },
];

const models = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "claude-opus-4-20250514",
    name: "Claude 4 Opus",
    chef: "Anthropic",
    chefSlug: "anthropic",
    providers: ["anthropic", "azure", "google", "amazon-bedrock"],
  },
  {
    id: "claude-sonnet-4-20250514",
    name: "Claude 4 Sonnet",
    chef: "Anthropic",
    chefSlug: "anthropic",
    providers: ["anthropic", "azure", "google", "amazon-bedrock"],
  },
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    chef: "Google",
    chefSlug: "google",
    providers: ["google"],
  },
];

const suggestions = [
  "介绍 LangChain 的核心概念",
  "什么是 RAG？有什么应用场景？",
  "LangGraph 和工作流有什么区别？",
  "如何构建多智能体系统？",
  "向量数据库有哪些选择？",
  "如何优化 AI 应用的性能？",
  "Prompt Engineering 最佳实践",
  "如何部署 AI 应用到生产环境？",
];

const mockResponses = [
  "That's a great question! Let me help you understand this concept better. The key thing to remember is that proper implementation requires careful consideration of the underlying principles and best practices in the field.",
  "I'd be happy to explain this topic in detail. From my understanding, there are several important factors to consider when approaching this problem. Let me break it down step by step for you.",
  "This is an interesting topic that comes up frequently. The solution typically involves understanding the core concepts and applying them in the right context. Here's what I recommend...",
  "Great choice of topic! This is something that many developers encounter. The approach I'd suggest is to start with the fundamentals and then build up to more complex scenarios.",
  "That's definitely worth exploring. From what I can see, the best way to handle this is to consider both the theoretical aspects and practical implementation details.",
];

export const ChatExample = ({ onScrollChange }: { onScrollChange?: (isScrolled: boolean) => void }) => {
  const [model, setModel] = useState<string>(models[0].id);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [text, setText] = useState<string>("");
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const [useMicrophone, setUseMicrophone] = useState<boolean>(false);
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedModelData = models.find((m) => m.id === model);

  // 监听内部滚动容器的滚动事件
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !onScrollChange) return;

    const handleScroll = () => {
      const isScrolled = scrollContainer.scrollTop > 0;
      onScrollChange(isScrolled);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    // 初始检查
    handleScroll();

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [onScrollChange]);

  const streamResponse = useCallback(
    async (messageId: string, content: string) => {
      setStatus("streaming");
      setStreamingMessageId(messageId);

      const words = content.split(" ");
      let currentContent = "";

      for (let i = 0; i < words.length; i++) {
        currentContent += (i > 0 ? " " : "") + words[i];

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.versions.some((v) => v.id === messageId)) {
              return {
                ...msg,
                versions: msg.versions.map((v) =>
                  v.id === messageId ? { ...v, content: currentContent } : v
                ),
              };
            }
            return msg;
          })
        );

        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 100 + 50)
        );
      }

      setStatus("ready");
      setStreamingMessageId(null);
    },
    []
  );

  const addUserMessage = useCallback(
    (content: string) => {
      const userMessage: MessageType = {
        key: `user-${Date.now()}`,
        from: "user",
        versions: [
          {
            id: `user-${Date.now()}`,
            content,
          },
        ],
      };

      setMessages((prev) => [...prev, userMessage]);

      setTimeout(() => {
        const assistantMessageId = `assistant-${Date.now()}`;
        const randomResponse =
          mockResponses[Math.floor(Math.random() * mockResponses.length)];

        const assistantMessage: MessageType = {
          key: `assistant-${Date.now()}`,
          from: "assistant",
          versions: [
            {
              id: assistantMessageId,
              content: "",
            },
          ],
        };

        setMessages((prev) => [...prev, assistantMessage]);
        streamResponse(assistantMessageId, randomResponse);
      }, 500);
    },
    [streamResponse]
  );

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    setStatus("submitted");

    if (message.files?.length) {
      toast.success("文件已添加", {
        description: `${message.files.length} 个文件已添加到消息`,
      });
    }

    addUserMessage(message.text || "Sent with attachments");
    setText("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setStatus("submitted");
    addUserMessage(suggestion);
  };

  return (
    <div className="relative flex size-full flex-col overflow-hidden">
      {/* Scrollable Content Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-custom">
        <div className="flex flex-col gap-8 p-4 max-w-[48rem] min-w-[768px] mx-auto">
          {/* Messages */}
          {messages.map(({ versions, ...message }) => (
            <MessageBranch defaultBranch={0} key={message.key}>
              <MessageBranchContent>
                {versions.map((version) => (
                  <Message
                    from={message.from}
                    key={`${message.key}-${version.id}`}
                  >
                    <div>
                      {message.sources?.length && (
                        <Sources>
                          <SourcesTrigger count={message.sources.length} />
                          <SourcesContent>
                            {message.sources.map((source) => (
                              <Source
                                href={source.href}
                                key={source.href}
                                title={source.title}
                              />
                            ))}
                          </SourcesContent>
                        </Sources>
                      )}
                      {message.reasoning && (
                        <Reasoning duration={message.reasoning.duration}>
                          <ReasoningTrigger />
                          <ReasoningContent>
                            {message.reasoning.content}
                          </ReasoningContent>
                        </Reasoning>
                      )}
                      <MessageContent>
                        <MessageResponse>{version.content}</MessageResponse>
                      </MessageContent>
                    </div>
                  </Message>
                ))}
              </MessageBranchContent>
              {versions.length > 1 && (
                <MessageBranchSelector from={message.from}>
                  <MessageBranchPrevious />
                  <MessageBranchPage />
                  <MessageBranchNext />
                </MessageBranchSelector>
              )}
            </MessageBranch>
          ))}

          {/* Suggestions */}
          <div className="pt-4 ">
            <Suggestions className="px-4">
              {suggestions.map((suggestion) => (
                <Suggestion
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  suggestion={suggestion}
                />
              ))}
            </Suggestions>
          </div>
        </div>
      </div>

      {/* Fixed Input Area at Bottom */}
      <div className="max-w-[48rem] min-w-[768px] mx-auto shrink-0 bg-background">
        <div className="w-full px-4 py-4">
          <PromptInput globalDrop multiple onSubmit={handleSubmit}>
            {/* <PromptInputHeader>
              <PromptInputAttachments>
                {(attachment) => <PromptInputAttachment data={attachment} />}
              </PromptInputAttachments>
            </PromptInputHeader> */}
            <PromptInputBody>
              <PromptInputTextarea
                onChange={(event) => setText(event.target.value)}
                value={text}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                <PromptInputButton
                  onClick={() => setUseMicrophone(!useMicrophone)}
                  variant={useMicrophone ? "default" : "ghost"}
                >
                  <MicIcon size={16} />
                  <span className="sr-only">Microphone</span>
                </PromptInputButton>
                <PromptInputButton
                  onClick={() => setUseWebSearch(!useWebSearch)}
                  variant={useWebSearch ? "default" : "ghost"}
                >
                  <GlobeIcon size={16} />
                  <span>Search</span>
                </PromptInputButton>
                <ModelSelector
                  onOpenChange={setModelSelectorOpen}
                  open={modelSelectorOpen}
                >
                  <ModelSelectorTrigger asChild>
                    <PromptInputButton>
                      {selectedModelData?.chefSlug && (
                        <ModelSelectorLogo provider={selectedModelData.chefSlug} />
                      )}
                      {selectedModelData?.name && (
                        <ModelSelectorName>
                          {selectedModelData.name}
                        </ModelSelectorName>
                      )}
                    </PromptInputButton>
                  </ModelSelectorTrigger>
                  <ModelSelectorContent>
                    <ModelSelectorInput placeholder="搜索模型..." />
                    <ModelSelectorList>
                      <ModelSelectorEmpty>未找到模型</ModelSelectorEmpty>
                      {["OpenAI", "Anthropic", "Google"].map((chef) => (
                        <ModelSelectorGroup key={chef} heading={chef}>
                          {models
                            .filter((m) => m.chef === chef)
                            .map((m) => (
                              <ModelSelectorItem
                                key={m.id}
                                onSelect={() => {
                                  setModel(m.id);
                                  setModelSelectorOpen(false);
                                }}
                                value={m.id}
                              >
                                <ModelSelectorLogo provider={m.chefSlug} />
                                <ModelSelectorName>{m.name}</ModelSelectorName>
                                <ModelSelectorLogoGroup>
                                  {m.providers.map((provider) => (
                                    <ModelSelectorLogo
                                      key={provider}
                                      provider={provider}
                                    />
                                  ))}
                                </ModelSelectorLogoGroup>
                                {model === m.id ? (
                                  <CheckIcon className="ml-auto size-4" />
                                ) : (
                                  <div className="ml-auto size-4" />
                                )}
                              </ModelSelectorItem>
                            ))}
                        </ModelSelectorGroup>
                      ))}
                    </ModelSelectorList>
                  </ModelSelectorContent>
                </ModelSelector>
              </PromptInputTools>
              <PromptInputSubmit
                disabled={!(text.trim() || status) || status === "streaming"}
                status={status}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
};

