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
  BookOpen,
  Search,
  Plus,
  Trash2,
  Upload,
  FileText,
  FolderOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  Database,
  RefreshCw,
  Eye,
  MessageSquare,
  TrendingUp,
  BarChart3
} from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  size: string
  chunks: number
  status: "indexed" | "indexing" | "error"
  createdAt: string
}

interface QAHistory {
  id: string
  question: string
  answer: string
  sources: number
  timestamp: string
  useful: boolean
}

interface RetrievalLog {
  id: string
  query: string
  documents: number
  timestamp: string
  responseTime: string
}

const sampleDocuments: Document[] = [
  {
    id: "1",
    name: "Python机器学习指南.pdf",
    type: "pdf",
    size: "2.4 MB",
    chunks: 156,
    status: "indexed",
    createdAt: "2024-01-15 10:30"
  },
  {
    id: "2",
    name: "LangChain官方文档.md",
    type: "markdown",
    size: "856 KB",
    chunks: 89,
    status: "indexed",
    createdAt: "2024-01-14 15:20"
  },
  {
    id: "3",
    name: "RAG技术综述.txt",
    type: "text",
    size: "124 KB",
    chunks: 32,
    status: "indexed",
    createdAt: "2024-01-13 09:15"
  },
  {
    id: "4",
    name: "深度学习入门指南.pdf",
    type: "pdf",
    size: "3.1 MB",
    chunks: 203,
    status: "indexing",
    createdAt: "2024-01-15 11:00"
  }
]

const sampleQAHistory: QAHistory[] = [
  {
    id: "1",
    question: "什么是向量数据库？",
    answer: "向量数据库是专门用于存储和检索向量数据的数据库系统...",
    sources: 3,
    timestamp: "2024-01-15 10:45",
    useful: true
  },
  {
    id: "2",
    question: "如何优化 RAG 系统的检索效果？",
    answer: "优化 RAG 检索效果可以从以下几个方面入手...",
    sources: 5,
    timestamp: "2024-01-15 10:30",
    useful: true
  },
  {
    id: "3",
    question: "LangChain 有哪些主要组件？",
    answer: "LangChain 的主要组件包括：LLM Wrapper、Prompts、Memory...",
    sources: 2,
    timestamp: "2024-01-15 09:20",
    useful: false
  }
]

const sampleRetrievalLogs: RetrievalLog[] = [
  {
    id: "1",
    query: "向量数据库的原理",
    documents: 4,
    timestamp: "2024-01-15 10:45",
    responseTime: "125ms"
  },
  {
    id: "2",
    query: "RAG 检索优化策略",
    documents: 5,
    timestamp: "2024-01-15 10:30",
    responseTime: "98ms"
  },
  {
    id: "3",
    query: "LangChain 组件介绍",
    documents: 3,
    timestamp: "2024-01-15 09:20",
    responseTime: "87ms"
  },
  {
    id: "4",
    query: "文本分块的最佳实践",
    documents: 6,
    timestamp: "2024-01-14 16:45",
    responseTime: "112ms"
  }
]

const documentTypeIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-4 w-4 text-red-500" />,
  markdown: <FileText className="h-4 w-4 text-blue-500" />,
  text: <FileText className="h-4 w-4 text-gray-500" />,
  html: <FileText className="h-4 w-4 text-orange-500" />
}

const statusColors: Record<string, string> = {
  indexed: "bg-green-500",
  indexing: "bg-blue-500 animate-pulse",
  error: "bg-red-500"
}

export default function RagPage() {
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments)
  const [qaHistory, setQAHistory] = useState<QAHistory[]>(sampleQAHistory)
  const [retrievalLogs, setRetrievalLogs] = useState<RetrievalLog[]>(sampleRetrievalLogs)
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("documents")

  const handleUpload = async () => {
    setIsUploading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    const newDoc: Document = {
      id: Date.now().toString(),
      name: "新上传文档.pdf",
      type: "pdf",
      size: "1.2 MB",
      chunks: 78,
      status: "indexing",
      createdAt: new Date().toLocaleString()
    }
    setDocuments(prev => [newDoc, ...prev])
    setIsUploading(false)
  }

  const handleDeleteDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id))
  }

  const totalChunks = documents.filter(d => d.status === "indexed").reduce((sum, d) => sum + d.chunks, 0)
  const indexedDocs = documents.filter(d => d.status === "indexed").length

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        {/* 页面标题 */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">RAG 知识库</h1>
              <p className="text-muted-foreground">
                基于向量的知识检索与问答系统，支持多格式文档管理和智能检索
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  添加文档
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>上传新文档</DialogTitle>
                  <DialogDescription>
                    支持 PDF、Markdown、TXT、HTML 等格式
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      拖拽文件到此处，或点击选择文件
                    </p>
                    <Button variant="outline" size="sm" onClick={handleUpload}>
                      选择文件
                    </Button>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <p>支持格式：PDF、Markdown、TXT、HTML、JSON</p>
                    <p>单个文件大小限制：10 MB</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">取消</Button>
                  <Button onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        上传中...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        上传
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
                文档总数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{documents.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                已索引
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">{indexedDocs}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                知识块
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-500" />
                <span className="text-2xl font-bold">{totalChunks}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                问答次数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold">{qaHistory.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 p-6 pt-0 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="documents">
                <FolderOpen className="h-4 w-4 mr-2" />
                文档管理
              </TabsTrigger>
              <TabsTrigger value="qa">
                <MessageSquare className="h-4 w-4 mr-2" />
                问答历史
              </TabsTrigger>
              <TabsTrigger value="retrieval">
                <Search className="h-4 w-4 mr-2" />
                检索日志
              </TabsTrigger>
            </TabsList>

            {/* 文档管理 */}
            <TabsContent value="documents">
              <div className="grid gap-4">
                {/* 搜索框 */}
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索文档..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* 文档列表 */}
                <Card>
                  <ScrollArea className="h-[400px]">
                    <div className="p-4 space-y-2">
                      {documents
                        .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((doc, index) => (
                        <div key={doc.id}>
                          {index > 0 && <Separator className="my-2" />}
                          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition">
                            <div className="flex items-center gap-3">
                              {documentTypeIcons[doc.type] || <FileText className="h-4 w-4" />}
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{doc.size}</span>
                                  <span>·</span>
                                  <span>{doc.chunks} 个知识块</span>
                                  <span>·</span>
                                  <span>{doc.createdAt}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={`${statusColors[doc.status]} text-white`}>
                                {doc.status === "indexed" ? "已索引" : "索引中"}
                              </Badge>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteDoc(doc.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            </TabsContent>

            {/* 问答历史 */}
            <TabsContent value="qa">
              <div className="grid gap-4">
                <Card>
                  <ScrollArea className="h-[500px]">
                    <div className="p-4 space-y-4">
                      {qaHistory.map((qa, index) => (
                        <div key={qa.id}>
                          {index > 0 && <Separator className="my-4" />}
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{qa.question}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {qa.timestamp}
                              </div>
                            </div>
                            <div className="ml-6 p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm">{qa.answer}</p>
                            </div>
                            <div className="ml-6 flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                引用 {qa.sources} 个文档
                              </span>
                              <span className="flex items-center gap-1">
                                {qa.useful ? (
                                  <>
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    有帮助
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="h-3 w-3 text-gray-400" />
                                    未评价
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            </TabsContent>

            {/* 检索日志 */}
            <TabsContent value="retrieval">
              <div className="grid gap-4">
                <Card>
                  <ScrollArea className="h-[500px]">
                    <div className="p-4 space-y-2">
                      {retrievalLogs.map((log, index) => (
                        <div key={log.id}>
                          {index > 0 && <Separator className="my-2" />}
                          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition">
                            <div>
                              <p className="font-medium flex items-center gap-2">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                {log.query}
                              </p>
                              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  检索 {log.documents} 篇文档
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {log.timestamp}
                                </span>
                              </div>
                            </div>
                            <Badge variant="outline">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {log.responseTime}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>

                {/* 性能统计 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      检索性能统计
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-green-500">105ms</p>
                        <p className="text-xs text-muted-foreground">平均响应时间</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-500">4.5</p>
                        <p className="text-xs text-muted-foreground">平均检索文档数</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-500">98%</p>
                        <p className="text-xs text-muted-foreground">用户满意度</p>
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
