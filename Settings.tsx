import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Activity, ArrowLeft, Settings as SettingsIcon, 
  Server, Plus, Trash2, RefreshCw, Check, X,
  AlertTriangle, Link2
} from "lucide-react";

export default function Settings() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [newApiDialogOpen, setNewApiDialogOpen] = useState(false);
  const [newApiName, setNewApiName] = useState("");
  const [newApiEndpoint, setNewApiEndpoint] = useState("");
  const [newApiKey, setNewApiKey] = useState("");
  const [testingEndpoint, setTestingEndpoint] = useState<number | null>(null);
  
  const { data: apiConfigs, isLoading, refetch } = trpc.apiConfig.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  
  const createMutation = trpc.apiConfig.create.useMutation({
    onSuccess: () => {
      toast.success("API配置已添加");
      refetch();
      setNewApiDialogOpen(false);
      setNewApiName("");
      setNewApiEndpoint("");
      setNewApiKey("");
    },
    onError: (error) => {
      toast.error(`添加失败: ${error.message}`);
    },
  });
  
  const updateMutation = trpc.apiConfig.update.useMutation({
    onSuccess: () => {
      toast.success("配置已更新");
      refetch();
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });
  
  const deleteMutation = trpc.apiConfig.delete.useMutation({
    onSuccess: () => {
      toast.success("配置已删除");
      refetch();
    },
    onError: (error) => {
      toast.error(`删除失败: ${error.message}`);
    },
  });
  
  const testMutation = trpc.apiConfig.test.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success(`连接成功 (状态码: ${result.status})`);
      } else {
        toast.error(result.message);
      }
      setTestingEndpoint(null);
    },
    onError: (error) => {
      toast.error(`测试失败: ${error.message}`);
      setTestingEndpoint(null);
    },
  });
  
  const handleCreateApi = () => {
    if (!newApiName.trim() || !newApiEndpoint.trim()) {
      toast.error("请填写名称和端点地址");
      return;
    }
    createMutation.mutate({
      name: newApiName,
      endpoint: newApiEndpoint,
      apiKey: newApiKey || undefined,
    });
  };
  
  const handleTestApi = (config: { id: number; endpoint: string; apiKey: string | null }) => {
    setTestingEndpoint(config.id);
    testMutation.mutate({
      endpoint: config.endpoint,
      apiKey: config.apiKey || undefined,
    });
  };
  
  const handleToggleActive = (id: number, isActive: boolean) => {
    updateMutation.mutate({ id, isActive });
  };
  
  const handleDeleteApi = (id: number) => {
    if (confirm("确定要删除此API配置吗？")) {
      deleteMutation.mutate({ id });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-12 h-12" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">需要登录</h2>
            <p className="text-muted-foreground mb-4">
              请先登录以访问设置页面
            </p>
            <Button onClick={() => window.location.href = getLoginUrl()}>
              立即登录
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => window.location.href = "/"}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">系统设置</h1>
                  <p className="text-sm text-muted-foreground">管理API配置和账户设置</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">欢迎，{user?.name || "用户"}</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container py-8 space-y-6">
        {/* 账户信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              账户信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">用户名</Label>
                <p className="font-medium">{user?.name || "未设置"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">邮箱</Label>
                <p className="font-medium">{user?.email || "未设置"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">角色</Label>
                <p className="font-medium">{user?.role === "admin" ? "管理员" : "普通用户"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">登录方式</Label>
                <p className="font-medium">{user?.loginMethod || "Manus OAuth"}</p>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" onClick={() => logout()}>
                退出登录
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* 远端API配置 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  远端API配置
                </CardTitle>
                <CardDescription>
                  配置远端服务器API，用于数据同步和备份
                </CardDescription>
              </div>
              <Button onClick={() => setNewApiDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                添加API
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="loading-spinner w-8 h-8" />
              </div>
            ) : apiConfigs?.length === 0 ? (
              <div className="text-center py-8">
                <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">暂无API配置</p>
                <p className="text-sm text-muted-foreground mt-1">
                  添加远端API以同步评估数据
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {apiConfigs?.map((config) => (
                  <div 
                    key={config.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{config.name}</h4>
                        {config.isActive && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            已启用
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 truncate max-w-md">
                        {config.endpoint}
                      </p>
                      {config.lastSyncAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          上次同步: {new Date(config.lastSyncAt).toLocaleString("zh-CN")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={config.isActive ?? false}
                        onCheckedChange={(checked) => handleToggleActive(config.id, checked)}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTestApi(config)}
                        disabled={testingEndpoint === config.id}
                      >
                        {testingEndpoint === config.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteApi(config.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* API使用说明 */}
        <Card>
          <CardHeader>
            <CardTitle>API接口说明</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              本系统支持与远端服务器进行数据同步。配置API后，您可以将评估数据推送到您的服务器进行备份或进一步分析。
            </p>
            <h4 className="font-semibold mt-4">接口要求</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 端点地址必须支持 POST 请求</li>
              <li>• 请求体为 JSON 格式，包含评估数据</li>
              <li>• 如需认证，请提供 API Key（将作为 Bearer Token 发送）</li>
              <li>• 响应应返回 JSON 格式，包含 id 或 assessmentId 字段</li>
            </ul>
            <h4 className="font-semibold mt-4">请求示例</h4>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`POST /api/assessments
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "assessment": {
    "pilotName": "张三",
    "pilotCode": "P001",
    "gender": "male",
    "age": 35,
    "flightRisk": "25.5",
    "metabolicRisk": "30.2",
    "healthRisk": "20.1",
    "overallRisk": "25.3",
    "riskLevel": "medium",
    "metabolicData": {...},
    "healthData": {...},
    "createdAt": "2024-01-20T10:00:00Z"
  }
}`}
            </pre>
          </CardContent>
        </Card>
      </main>
      
      {/* 添加API对话框 */}
      <Dialog open={newApiDialogOpen} onOpenChange={setNewApiDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加远端API</DialogTitle>
            <DialogDescription>
              配置远端服务器API以同步评估数据
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="apiName">名称 *</Label>
              <Input
                id="apiName"
                value={newApiName}
                onChange={(e) => setNewApiName(e.target.value)}
                placeholder="例如：备份服务器"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiEndpoint">端点地址 *</Label>
              <Input
                id="apiEndpoint"
                value={newApiEndpoint}
                onChange={(e) => setNewApiEndpoint(e.target.value)}
                placeholder="https://api.example.com/assessments"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key（可选）</Label>
              <Input
                id="apiKey"
                type="password"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                placeholder="如需认证请填写"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewApiDialogOpen(false)}>
              取消
            </Button>
            <Button 
              onClick={handleCreateApi}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "添加中..." : "添加"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
