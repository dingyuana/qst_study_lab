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
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Settings,
  Key,
  Globe,
  Shield,
  Sparkles,
  Server,
  Database,
  Brain,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronRight,
  Zap,
  Lock,
  FileText,
  Users,
  Clock,
  TrendingUp,
  Plus,
  Trash2,
  Edit,
  Copy,
  ExternalLink
} from "lucide-react"

interface APIProvider {
  id: string
  name: string
  icon: React.ReactNode
  models: string[]
  enabled: boolean
  apiKey?: string
  baseUrl?: string
}

interface GuardrailRule {
  id: string
  name: string
  description: string
  enabled: boolean
  type: "input" | "output" | "both"
  action: "block" | "warn" | "filter"
}

interface BackendConfig {
  host: string
  port: number
  maxConcurrent: number
  timeout: number
  retryCount: number
  enableCaching: boolean
  cacheTtl: number
}

const apiProviders: APIProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    icon: <Brain className="h-5 w-5" />,
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
    enabled: true,
    apiKey: "sk-••••••••••••••••"
  },
  {
    id: "anthropic",
    name: "Anthropic",
    icon: <Users className="h-5 w-5" />,
    models: ["claude-4-opus", "claude-4-sonnet", "claude-3-5-sonnet"],
    enabled: false,
    apiKey: ""
  },
  {
    id: "google",
    name: "Google",
    icon: <Globe className="h-5 w-5" />,
    models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
    enabled: false,
    apiKey: ""
  }
]

const guardrailRules: GuardrailRule[] = [
  {
    id: "1",
    name: "敏感信息过滤",
    description: "自动检测并过滤身份证号、手机号、银行卡号等敏感信息",
    enabled: true,
    type: "both",
    action: "filter"
  },
  {
    id: "2",
    name: "恶意内容检测",
    description: "检测并拦截恶意代码、SQL 注入、XSS 攻击等安全威胁",
    enabled: true,
    type: "input",
    action: "block"
  },
  {
    id: "3",
    name: "不当言论过滤",
    description: "过滤涉及歧视、暴力、色情等不当内容",
    enabled: true,
    type: "both",
    action: "filter"
  },
  {
    id: "4",
    name: "提示词注入防护",
    description: "检测并阻止用户尝试覆盖系统提示词的行为",
    enabled: true,
    type: "input",
    action: "block"
  },
  {
    id: "5",
    name: "输出长度限制",
    description: "限制单次回复的最大字符数，防止资源滥用",
    enabled: true,
    type: "output",
    action: "warn"
  },
  {
    id: "6",
    name: "频率限制",
    description: "限制用户的请求频率，防止滥用",
    enabled: true,
    type: "both",
    action: "block"
  }
]

const defaultBackendConfig: BackendConfig = {
  host: "localhost",
  port: 8000,
  maxConcurrent: 10,
  timeout: 60,
  retryCount: 3,
  enableCaching: true,
  cacheTtl: 3600
}

const sampleStats = {
  totalRequests: 12847,
  avgResponseTime: "145ms",
  errorRate: "0.12%",
  cacheHitRate: "87%"
}

export default function SettingsPage() {
  const [providers, setProviders] = useState<APIProvider[]>(apiProviders)
  const [guardrails, setGuardrails] = useState<GuardrailRule[]>(guardrailRules)
  const [backendConfig, setBackendConfig] = useState<BackendConfig>(defaultBackendConfig)
  const [activeTab, setActiveTab] = useState("models")
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)

  const toggleGuardrail = (id: string) => {
    setGuardrails(prev => prev.map(rule =>
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ))
  }

  const updateProvider = (id: string, updates: Partial<APIProvider>) => {
    setProviders(prev => prev.map(p =>
      p.id === id ? { ...p, ...updates } : p
    ))
  }

  const saveSettings = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case "block":
        return <Badge className="bg-red-500">拦截</Badge>
      case "warn":
        return <Badge className="bg-yellow-500">警告</Badge>
      case "filter":
        return <Badge className="bg-blue-500">过滤</Badge>
      default:
        return <Badge variant="outline">{action}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "input":
        return <Badge variant="outline">输入</Badge>
      case "output":
        return <Badge variant="outline">输出</Badge>
      case "both":
        return <Badge variant="secondary">双向</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        {/* 页面标题 */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">设置</h1>
              <p className="text-muted-foreground">
                配置 AI 模型、后端服务和安全策略
              </p>
            </div>
            <Button onClick={saveSettings} disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  保存设置
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4 p-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                总请求数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{sampleStats.totalRequests.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                平均响应
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">{sampleStats.avgResponseTime}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                错误率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-2xl font-bold">{sampleStats.errorRate}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                缓存命中率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-500" />
                <span className="text-2xl font-bold">{sampleStats.cacheHitRate}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 p-6 pt-0 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="models">
                <Brain className="h-4 w-4 mr-2" />
                模型配置
              </TabsTrigger>
              <TabsTrigger value="backend">
                <Server className="h-4 w-4 mr-2" />
                后端设置
              </TabsTrigger>
              <TabsTrigger value="guardrails">
                <Shield className="h-4 w-4 mr-2" />
                Guardrails
              </TabsTrigger>
            </TabsList>

            {/* 模型配置 */}
            <TabsContent value="models">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      API 提供商配置
                    </CardTitle>
                    <CardDescription>
                      配置和管理不同的 AI 模型提供商
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {providers.map((provider, index) => (
                        <div key={provider.id}>
                          {index > 0 && <Separator className="my-4" />}
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="p-2 rounded-lg bg-muted">
                                {provider.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{provider.name}</h4>
                                  <Badge variant={provider.enabled ? "default" : "secondary"}>
                                    {provider.enabled ? "已启用" : "未启用"}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground mb-3">
                                  支持模型: {provider.models.join(", ")}
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <Label className="text-xs">API Key</Label>
                                    <div className="flex gap-2 mt-1">
                                      <div className="relative flex-1">
                                        <Input
                                          type={showApiKeys[provider.id] ? "text" : "password"}
                                          defaultValue={provider.apiKey || ""}
                                          placeholder={`输入 ${provider.name} API Key`}
                                          className="pr-10"
                                          disabled={!provider.enabled}
                                          readOnly
                                        />
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="absolute right-0 top-0 h-full"
                                          onClick={() => setShowApiKeys(prev => ({
                                            ...prev,
                                            [provider.id]: !prev[provider.id]
                                          }))}
                                        >
                                          {showApiKeys[provider.id] ? (
                                            <EyeOff className="h-4 w-4" />
                                          ) : (
                                            <Eye className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </div>
                                      <Button variant="outline" size="icon">
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-xs">Base URL (可选)</Label>
                                    <Input
                                      defaultValue={provider.baseUrl || ""}
                                      placeholder={`${provider.name} API 地址`}
                                      className="mt-1"
                                      disabled={!provider.enabled}
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={provider.enabled}
                                onCheckedChange={(checked) => updateProvider(provider.id, { enabled: checked })}
                              />
                              <Button variant="ghost" size="icon">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 默认模型设置 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      默认模型选择
                    </CardTitle>
                    <CardDescription>
                      设置不同场景下使用的默认模型
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>对话模型</Label>
                        <Select defaultValue="gpt-4o">
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="选择对话模型" />
                          </SelectTrigger>
                          <SelectContent>
                            {providers.find(p => p.enabled)?.models.map(model => (
                              <SelectItem key={model} value={model}>{model}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>嵌入模型</Label>
                        <Select defaultValue="text-embedding-3-small">
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="选择嵌入模型" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text-embedding-3-small">text-embedding-3-small</SelectItem>
                            <SelectItem value="text-embedding-3-large">text-embedding-3-large</SelectItem>
                            <SelectItem value="text-embedding-ada-002">text-embedding-ada-002</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>RAG 检索模型</Label>
                        <Select defaultValue="gpt-4o-mini">
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="选择检索模型" />
                          </SelectTrigger>
                          <SelectContent>
                            {providers.find(p => p.enabled)?.models.map(model => (
                              <SelectItem key={model} value={model}>{model}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>代码生成模型</Label>
                        <Select defaultValue="claude-4-opus">
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="选择代码模型" />
                          </SelectTrigger>
                          <SelectContent>
                            {providers.find(p => p.enabled)?.models.map(model => (
                              <SelectItem key={model} value={model}>{model}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 模型参数 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      模型参数配置
                    </CardTitle>
                    <CardDescription>
                      调整生成参数以平衡响应质量与速度
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Temperature (随机性)</Label>
                        <span className="text-sm text-muted-foreground">0.7</span>
                      </div>
                      <Slider defaultValue={[0.7]} min={0} max={2} step={0.1} />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>精确 (0.0)</span>
                        <span>平衡 (0.7)</span>
                        <span>创意 (2.0)</span>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Max Tokens (最大输出)</Label>
                        <span className="text-sm text-muted-foreground">4096</span>
                      </div>
                      <Slider defaultValue={[4096]} min={256} max={8192} step={256} />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>256</span>
                        <span>4096</span>
                        <span>8192</span>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Top P (采样阈值)</Label>
                        <span className="text-sm text-muted-foreground">0.9</span>
                      </div>
                      <Slider defaultValue={[0.9]} min={0} max={1} step={0.05} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 后端设置 */}
            <TabsContent value="backend">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      服务器配置
                    </CardTitle>
                    <CardDescription>
                      配置后端服务器的运行参数
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>服务器地址</Label>
                        <Input
                          value={backendConfig.host}
                          onChange={(e) => setBackendConfig(prev => ({ ...prev, host: e.target.value }))}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>端口号</Label>
                        <Input
                          type="number"
                          value={backendConfig.port}
                          onChange={(e) => setBackendConfig(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>最大并发数</Label>
                        <Input
                          type="number"
                          value={backendConfig.maxConcurrent}
                          onChange={(e) => setBackendConfig(prev => ({ ...prev, maxConcurrent: parseInt(e.target.value) }))}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>请求超时 (秒)</Label>
                        <Input
                          type="number"
                          value={backendConfig.timeout}
                          onChange={(e) => setBackendConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>重试次数</Label>
                        <Input
                          type="number"
                          value={backendConfig.retryCount}
                          onChange={(e) => setBackendConfig(prev => ({ ...prev, retryCount: parseInt(e.target.value) }))}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      缓存配置
                    </CardTitle>
                    <CardDescription>
                      配置响应缓存以提高性能
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">启用缓存</h4>
                          <p className="text-sm text-muted-foreground">缓存常用查询结果，减少 API 调用</p>
                        </div>
                        <Switch
                          checked={backendConfig.enableCaching}
                          onCheckedChange={(checked) => setBackendConfig(prev => ({ ...prev, enableCaching: checked }))}
                        />
                      </div>
                      {backendConfig.enableCaching && (
                        <div>
                          <Label>缓存有效期 (秒)</Label>
                          <Input
                            type="number"
                            value={backendConfig.cacheTtl}
                            onChange={(e) => setBackendConfig(prev => ({ ...prev, cacheTtl: parseInt(e.target.value) }))}
                            className="mt-2"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            建议值: 3600 (1小时) - 86400 (24小时)
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <RefreshCw className="h-5 w-5" />
                      服务状态
                    </CardTitle>
                    <CardDescription>
                      查看和管理后端服务状态
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <span className="font-medium">后端服务</span>
                        </div>
                        <p className="text-sm text-muted-foreground">运行中</p>
                        <p className="text-xs text-muted-foreground mt-1">Uptime: 3d 12h 30m</p>
                      </div>
                      <div className="p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <span className="font-medium">数据库</span>
                        </div>
                        <p className="text-sm text-muted-foreground">已连接</p>
                        <p className="text-xs text-muted-foreground mt-1">延迟: 2ms</p>
                      </div>
                      <div className="p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <span className="font-medium">Redis 缓存</span>
                        </div>
                        <p className="text-sm text-muted-foreground">已连接</p>
                        <p className="text-xs text-muted-foreground mt-1">命中率: 87%</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        重启服务
                      </Button>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        查看日志
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Guardrails */}
            <TabsContent value="guardrails">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      安全策略规则
                    </CardTitle>
                    <CardDescription>
                      配置输入/输出过滤规则，保护系统安全
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {guardrails.map((rule, index) => (
                        <div key={rule.id}>
                          {index > 0 && <Separator className="my-3" />}
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${
                                rule.enabled ? "bg-muted" : "bg-muted/50 opacity-50"
                              }`}>
                                <Lock className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{rule.name}</h4>
                                  {getTypeBadge(rule.type)}
                                  {getActionBadge(rule.action)}
                                </div>
                                <p className="text-sm text-muted-foreground">{rule.description}</p>
                              </div>
                            </div>
                            <Switch
                              checked={rule.enabled}
                              onCheckedChange={() => toggleGuardrail(rule.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 自定义规则 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      自定义规则
                    </CardTitle>
                    <CardDescription>
                      添加自定义关键词或正则表达式过滤规则
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">屏蔽关键词列表</span>
                          <Button variant="ghost" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            添加
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-white">
                            垃圾信息 ×
                          </Badge>
                          <Badge variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-white">
                            广告 ×
                          </Badge>
                          <Badge variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-white">
                            恶意链接 ×
                          </Badge>
                          <Badge variant="outline" className="cursor-pointer">
                            + 添加关键词
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label>自定义正则表达式</Label>
                        <Input
                          placeholder="例如: \b(virus|malware)\b"
                          className="mt-2 font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          使用正则表达式进行高级匹配
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 统计 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      防护统计
                    </CardTitle>
                    <CardDescription>
                      查看 Guardrails 拦截统计
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                        <p className="text-2xl font-bold text-red-500">127</p>
                        <p className="text-xs text-muted-foreground">今日拦截</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-500">34</p>
                        <p className="text-xs text-muted-foreground">警告次数</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <p className="text-2xl font-bold text-blue-500">1,247</p>
                        <p className="text-xs text-muted-foreground">过滤内容</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <p className="text-2xl font-bold text-green-500">99.2%</p>
                        <p className="text-xs text-muted-foreground">有效防护</p>
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
