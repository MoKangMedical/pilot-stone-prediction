import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Activity, Search, FileDown, Trash2, Eye, 
  ArrowLeft, Calendar, User, AlertTriangle
} from "lucide-react";
import { RISK_LEVEL_CONFIG, type RiskLevel } from "@shared/assessment";

export default function History() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const { data: assessments, isLoading, refetch } = trpc.assessment.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  
  const deleteMutation = trpc.assessment.delete.useMutation({
    onSuccess: () => {
      toast.success("记录已删除");
      refetch();
      setDeleteDialogOpen(false);
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(`删除失败: ${error.message}`);
    },
  });
  
  const { data: exportData, refetch: fetchExport } = trpc.assessment.export.useQuery(
    { ids: selectedIds.length > 0 ? selectedIds : undefined, format: "csv" },
    { enabled: false }
  );
  
  const handleExport = async () => {
    const result = await fetchExport();
    if (result.data?.format === "csv" && typeof result.data.data === "string") {
      const blob = new Blob([result.data.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `评估记录_${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("导出成功");
    }
  };
  
  const handleDelete = (id: number) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
    }
  };
  
  const filteredAssessments = assessments?.filter(a => 
    a.pilotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.pilotCode.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  const getRiskBadge = (level: RiskLevel) => {
    const config = RISK_LEVEL_CONFIG[level];
    return (
      <span 
        className="px-2 py-1 rounded-full text-xs font-medium"
        style={{ 
          backgroundColor: `${config.color}20`,
          color: config.color
        }}
      >
        {config.label}
      </span>
    );
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
              请先登录以查看您的评估历史记录
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
                  <h1 className="text-xl font-bold text-foreground">评估历史记录</h1>
                  <p className="text-sm text-muted-foreground">查看和管理您的评估数据</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">欢迎，{user?.name || "用户"}</span>
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/settings"}>
                设置
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container py-8">
        {/* 工具栏 */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索姓名或编号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} disabled={filteredAssessments.length === 0}>
              <FileDown className="w-4 h-4 mr-2" />
              导出数据
            </Button>
            <Button onClick={() => window.location.href = "/assessment"}>
              新建评估
            </Button>
          </div>
        </div>
        
        {/* 数据表格 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              评估记录 ({filteredAssessments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="loading-spinner w-8 h-8" />
              </div>
            ) : filteredAssessments.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">暂无评估记录</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.href = "/assessment"}
                >
                  开始首次评估
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>姓名</TableHead>
                      <TableHead>编号</TableHead>
                      <TableHead>性别</TableHead>
                      <TableHead>年龄</TableHead>
                      <TableHead>总体风险</TableHead>
                      <TableHead>风险等级</TableHead>
                      <TableHead>评估时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-medium">{assessment.pilotName}</TableCell>
                        <TableCell>{assessment.pilotCode}</TableCell>
                        <TableCell>{assessment.gender === "male" ? "男" : "女"}</TableCell>
                        <TableCell>{assessment.age}岁</TableCell>
                        <TableCell>{parseFloat(assessment.overallRisk as string).toFixed(1)}%</TableCell>
                        <TableCell>{getRiskBadge(assessment.riskLevel as RiskLevel)}</TableCell>
                        <TableCell>
                          {new Date(assessment.createdAt).toLocaleString("zh-CN")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toast.info("详情查看功能即将上线")}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(assessment.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除这条评估记录吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "删除中..." : "确认删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
