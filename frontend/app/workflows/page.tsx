"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  FileText,
  Brain,
  Search,
  CheckSquare,
  MessageSquare
} from "lucide-react"

interface WorkflowNode {
  id: string
  name: string
  description: string
  icon: string
  status: "pending" | "running" | "completed" | "error"
}

const defaultWorkflowNodes: WorkflowNode[] = [
  {
    id: "planner",
    name: "规划阶段",
    description: "根据学习目标制定学习计划",
    icon: "brain",
    status: "pending"
  },
  {
    id: "retrieval",
    name: "检索阶段",
    description: "从知识库检索相关内容",
    icon: "search",
    status: "pending"
  },
  {
    id: "quiz",
    name: "出题阶段",
    description: "根据学习内容生成测试题",
    icon: "file-text",
    status: "pending"
  },
  {
    id: "grading",
    name: "评分阶段",
    description: "评估用户答题情况",
    icon: "check-square",
    status: "pending"
  },
  {
    id: "feedback",
    name: "反馈阶段",
    description: "生成综合学习反馈",
    icon: "message-square",
    status: "pending"
  }
]

const iconMap: Record<string, React.ReactNode> = {
  brain: <Brain className="h-5 w-5" />,
  search: <Search className="h-5 w-5" />,
  "file-text": <FileText className="h-5 w-5" />,
  "check-square": <CheckSquare className="h-5 w-5" />,
  "message-square": <MessageSquare className="h-5 w-5" />
}

const statusColors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  running: "bg-blue-500 text-white animate-pulse",
  completed: "bg-green-500 text-white",
  error: "bg-red-500 text-white"
}

const statusLabels: Record<string, string> = {
  pending: "等待执行",
  running: "执行中",
  completed: "已完成",
  error: "执行出错"
}

export default function WorkflowsPage() {
  const [topic, setTopic] = useState("")
  const [nodes, setNodes] = useState<WorkflowNode[]>(defaultWorkflowNodes)
  const [isRunning, setIsRunning] = useState(false)
  const [currentNode, setCurrentNode] = useState<string | null>(null)
  const [workflowHistory, setWorkflowHistory] = useState<Array<{
    node: string
    status: string
    time: string
    message?: string
  }>>([])

  const runWorkflow = async () => {
    if (!topic.trim() || isRunning) return

    setIsRunning(true)
    setNodes(defaultWorkflowNodes.map(n => ({ ...n, status: "pending" as const })))
    setWorkflowHistory([])

    for (const node of defaultWorkflowNodes) {
      setCurrentNode(node.id)
      setNodes(prev => prev.map(n =>
        n.id === node.id ? { ...n, status: "running" as const } : n
      ))

      await new Promise(resolve => setTimeout(resolve, 1500))

      setNodes(prev => prev.map(n =>
        n.id === node.id ? { ...n, status: "completed" as const } : n
      ))

      setWorkflowHistory(prev => [...prev, {
        node: node.name,
        status: "completed",
        time: new Date().toLocaleTimeString(),
        message: `${node.name}已完成`
      }])
    }

    setCurrentNode(null)
    setIsRunning(false)
  }

  const resetWorkflow = () => {
    setNodes(defaultWorkflowNodes.map(n => ({ ...n, status: "pending" as const })))
    setWorkflowHistory([])
    setCurrentNode(null)
    setIsRunning(false)
    setTopic("")
  }

  return (
    <AppLayout>
      <div className="flex h-full">
        {/* 左侧：工作流可视化 */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">学习工作流</h1>
              <p className="text-muted-foreground">
                基于 LangGraph 的智能学习流程：规划 → 检索 → 出题 → 评分 → 反馈
              </p>
            </div>

            {/* 工作流输入 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">开始学习</CardTitle>
                <CardDescription>输入一个学习主题，启动智能学习工作流</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="例如：Python 机器学习入门"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isRunning}
                    className="flex-1"
                  />
                  <Button onClick={runWorkflow} disabled={!topic.trim() || isRunning}>
                    {isRunning ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        运行中...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        运行工作流
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetWorkflow} disabled={isRunning}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 工作流节点 */}
            <div className="relative">
              {nodes.map((node, index) => (
                <div key={node.id} className="relative pl-8 pb-4 last:pb-0">
                  {/* 连接线 */}
                  {index < nodes.length - 1 && (
                    <div className="absolute left-[18px] top-9 bottom-0 w-0.5 bg-border" />
                  )}

                  {/* 节点 */}
                  <div className={`
                    relative flex items-start gap-4 p-4 rounded-lg border bg-card
                    ${node.status === "running" ? "border-blue-500 shadow-lg shadow-blue-500/10" : ""}
                    ${node.status === "completed" ? "border-green-500 bg-green-50/50 dark:bg-green-950/20" : ""}
                  `}>
                    {/* 状态图标 */}
                    <div className={`
                      relative z-10 flex items-center justify-center w-10 h-10 rounded-full
                      ${node.status === "pending" ? "bg-muted" : ""}
                      ${node.status === "running" ? "bg-blue-500" : ""}
                      ${node.status === "completed" ? "bg-green-500" : ""}
                      ${node.status === "error" ? "bg-red-500" : ""}
                    `}>
                      {node.status === "running" ? (
                        <Loader2 className="h-5 w-5 text-white animate-spin" />
                      ) : node.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      ) : node.status === "error" ? (
                        <Circle className="h-5 w-5 text-red-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                      )}
                    </div>

                    {/* 节点内容 */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{node.name}</h3>
                        <Badge className={statusColors[node.status]}>
                          {statusLabels[node.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{node.description}</p>

                      {/* 运行中的详细步骤 */}
                      {node.status === "running" && node.id === currentNode && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md">
                          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>正在执行中...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：执行历史 */}
        <div className="w-80 border-l bg-muted/30 p-4">
          <h2 className="font-semibold mb-4">执行历史</h2>
          {workflowHistory.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">暂无执行记录</p>
              <p className="text-xs mt-1">运行工作流后显示执行历史</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3">
                {workflowHistory.map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-card border">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-sm">{item.node}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
