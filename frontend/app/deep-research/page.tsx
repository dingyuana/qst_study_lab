"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Brain,
  Search,
  Plus,
  Trash2,
  FileText,
  FolderOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Globe,
  FileSearch,
  TrendingUp,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Download,
  Eye,
  Settings,
  Sparkles,
  Lightbulb,
  Target,
  Zap,
  ChevronRight
} from "lucide-react"

interface ResearchSession {
  id: string
  topic: string
  status: "planning" | "researching" | "writing" | "completed" | "error"
  progress: number
  agents: number
  sources: number
  createdAt: string
  updatedAt: string
}

interface AgentTask {
  id: string
  name: string
  role: string
  status: "pending" | "running" | "completed" | "error"
  progress: number
  output?: string
}

interface Report {
  id: string
  title: string
  summary: string
  sections: number
  words: number
  createdAt: string
}

const sampleSessions: ResearchSession[] = [
  {
    id: "1",
    topic: "LLM Agent 技术发展趋势",
    status: "completed",
    progress: 100,
    agents: 4,
    sources: 28,
    createdAt: "2024-01-15 10:30",
    updatedAt: "2024-01-15 12:45"
  },
  {
    id: "2",
    topic: "RAG 优化策略研究",
    status: "researching",
    progress: 65,
    agents: 3,
    sources: 15,
    createdAt: "2024-01-15 14:20",
    updatedAt: "2024-01-15 15:30"
  },
  {
    id: "3",
    topic: "向量数据库性能对比",
    status: "planning",
    progress: 10,
    agents: 2,
    sources: 0,
    createdAt: "2024-01-15 16:00",
    updatedAt: "2024-01-15 16:00"
  }
]

const sampleAgentTasks: AgentTask[] = [
  {
    id: "1",
    name: "Web Researcher",
    role: "网络研究员",
    status: "completed",
    progress: 100,
    output: "收集了 15 篇相关论文和技术文章"
  },
  {
    id: "2",
    name: "Doc Analyst",
    role: "文档分析师",
    status: "completed",
    progress: 100,
    output: "分析了关键概念和技术实现"
  },
  {
    id: "3",
    name: "Report Writer",
    role: "报告撰写员",
    status: "running",
    progress: 60,
    output: "正在撰写研究报告..."
  },
  {
    id: "4",
    name: "Fact Checker",
    role: "事实核查员",
    status: "pending",
    progress: 0
  }
]

const sampleReports: Report[] = [
  {
    id: "1",
    title: "LLM Agent 技术发展趋势分析报告",
    summary: "本报告深入分析了大型语言模型智能体技术的发展现状、主要技术路线和未来趋势...",
    sections: 8,
    words: 12500,
    createdAt: "2024-01-15 12:45"
  },
  {
    id: "2",
    title: "RAG 系统优化最佳实践",
    summary: "本文档总结了 RAG（检索增强生成）系统的各种优化策略和实施方法...",
    sections: 6,
    words: 8200,
    createdAt: "2024-01-14 18:30"
  }
]

const agentRoleIcons: Record<string, React.ReactNode> = {
  "网络研究员": <Globe className="h-4 w-4 text-blue-500" />,
  "文档分析师": <FileSearch className="h-4 w-4 text-green-500" />,
  "报告撰写员": <FileText className="h-4 w-4 text-purple-500" />,
  "事实核查员": <CheckCircle2 className="h-4 w-4 text-orange-500" />
}

const statusConfig: Record<string, { color: string; label: string }> = {
  planning: { color: "bg-gray-500", label: "规划中" },
  researching: { color: "bg-blue-500 animate-pulse", label: "研究中" },
  writing: { color: "bg-purple-500", label: "撰写中" },
  completed: { color: "bg-green-500", label: "已完成" },
  error: { color: "bg-red-500", label: "出错" },
  pending: { color: "bg-muted text-muted-foreground", label: "等待" },
  running: { color: "bg-blue-500 animate-pulse", label: "运行中" }
}

export default function DeepResearchPage() {
  const [sessions, setSessions] = useState<ResearchSession[]>(sampleSessions)
  const [reports, setReports] = useState<Report[]>(sampleReports)
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>(sampleAgentTasks)
  const [isCreating, setIsCreating] = useState(false)
  const [newTopic, setNewTopic] = useState("")
  const [activeTab, setActiveTab] = useState("sessions")
  const [selectedSession, setSelectedSession] = useState<ResearchSession | null>(null)

  const createSession = async () => {
    if (!newTopic.trim() || isCreating) return

    setIsCreating(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const newSession: ResearchSession = {
      id: Date.now().toString(),
      topic: newTopic,
      status: "planning",
      progress: 10,
      agents: 3,
      sources: 0,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString()
    }

    setSessions(prev => [newSession, ...prev])
    setNewTopic("")
    setIsCreating(false)
  }

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  const totalSessions = sessions.length
  const completedSessions = sessions.filter(s => s.status === "completed").length
  const totalSources = sessions.reduce((sum, s) => sum + s.sources, 0)

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        {/* 页面标题 */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">深度研究</h1>
              <p className="text-muted-foreground">
                基于多智能体协作的深度研究系统，自动完成信息收集、分析和报告生成
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  新建研究
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>创建新的研究项目</DialogTitle>
                  <DialogDescription>
                    输入一个研究主题，多智能体系统将自动完成研究并生成报告
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">研究主题</label>
                    <Input
                      placeholder="例如：2024年AI大模型发展趋势分析"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                    />
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      研究流程
                    </h4>
                    <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Lightbulb className="h-3 w-3" />
                        规划
                      </div>
                      <div className="flex items-center gap-1">
                        <Search className="h-3 w-3" />
                        检索
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        分析
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        报告
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">取消</Button>
                  <Button onClick={createSession} disabled={!newTopic.trim() || isCreating}>
                    {isCreating ? (
                      <>
                        <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                        创建中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        开始研究
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4 p-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                研究项目
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                <span className="text-2xl font-bold">{totalSessions}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                已完成
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">{completedSessions}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                引用来源
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{totalSources}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                智能体
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold">4</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 p-6 pt-0 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="sessions">
                <Brain className="h-4 w-4 mr-2" />
                研究会话
              </TabsTrigger>
              <TabsTrigger value="agents">
                <Users className="h-4 w-4 mr-2" />
                智能体状态
              </TabsTrigger>
              <TabsTrigger value="reports">
                <FileText className="h-4 w-4 mr-2" />
                研究报告
              </TabsTrigger>
            </TabsList>

            {/* 研究会话 */}
            <TabsContent value="sessions">
              <div className="grid gap-4">
                <Card>
                  <ScrollArea className="h-[500px]">
                    <div className="p-4 space-y-3">
                      {sessions.map((session, index) => (
                        <div key={session.id}>
                          {index > 0 && <Separator className="my-2" />}
                          <div className="p-4 rounded-lg border hover:bg-muted/50 transition cursor-pointer"
                            onClick={() => setSelectedSession(session)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-medium flex items-center gap-2">
                                  <Target className="h-4 w-4 text-muted-foreground" />
                                  {session.topic}
                                </h3>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {session.updatedAt}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {session.agents} 个智能体
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Globe className="h-3 w-3" />
                                    {session.sources} 个来源
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={statusConfig[session.status].color}>
                                  {statusConfig[session.status].label}
                                </Badge>
                                <Button variant="ghost" size="icon" onClick={(e) => {
                                  e.stopPropagation()
                                  deleteSession(session.id)
                                }}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>

                            {/* 进度条 */}
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>研究进度</span>
                                <span>{session.progress}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                  style={{ width: `${session.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            </TabsContent>

            {/* 智能体状态 */}
            <TabsContent value="agents">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      多智能体协作系统
                    </CardTitle>
                    <CardDescription>
                      深度研究系统包含四个专业智能体，协作完成研究任务
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {agentTasks.map((task, index) => (
                        <div key={task.id} className="p-4 rounded-lg border">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-muted">
                                {agentRoleIcons[task.role] || <Brain className="h-4 w-4" />}
                              </div>
                              <div>
                                <h4 className="font-medium">{task.name}</h4>
                                <p className="text-xs text-muted-foreground">{task.role}</p>
                              </div>
                            </div>
                            <Badge className={statusConfig[task.status].color}>
                              {statusConfig[task.status].label}
                            </Badge>
                          </div>

                          {/* 进度条 */}
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>任务进度</span>
                              <span>{task.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  task.status === "running" ? "bg-blue-500 animate-pulse" :
                                  task.status === "completed" ? "bg-green-500" :
                                  task.status === "error" ? "bg-red-500" : "bg-muted-foreground/30"
                                }`}
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* 输出 */}
                          {task.output && (
                            <div className="mt-3 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                              {task.output}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 协作流程 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      智能体协作流程
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg whitespace-nowrap">
                        <Globe className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Web Researcher</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/30 rounded-lg whitespace-nowrap">
                        <FileSearch className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Doc Analyst</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg whitespace-nowrap">
                        <FileText className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Report Writer</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg whitespace-nowrap">
                        <CheckCircle2 className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">Fact Checker</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 研究报告 */}
            <TabsContent value="reports">
              <div className="grid gap-4">
                <Card>
                  <ScrollArea className="h-[400px]">
                    <div className="p-4 space-y-3">
                      {reports.map((report, index) => (
                        <div key={report.id}>
                          {index > 0 && <Separator className="my-2" />}
                          <div className="p-4 rounded-lg border hover:bg-muted/50 transition cursor-pointer">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-medium flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  {report.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {report.summary}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {report.sections} 个章节
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="font-medium">{report.words.toLocaleString()}</span>
                                字
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {report.createdAt}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>

                {/* 报告统计 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      研究成果统计
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-500">{reports.length}</p>
                        <p className="text-xs text-muted-foreground">报告总数</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-green-500">
                          {reports.reduce((sum, r) => sum + r.words, 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">总字数</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-500">
                          {reports.reduce((sum, r) => sum + r.sections, 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">章节总数</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
