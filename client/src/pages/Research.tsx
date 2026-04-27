import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResearchDashboard } from "@/components/ResearchDashboard";
import { Globe, ArrowLeft, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function Research() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-white via-blue-50/50 to-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
                    全球肾结石研究数据库
                  </h1>
                  <p className="text-xs text-muted-foreground">Global Kidney Stone Research Database</p>
                </div>
              </div>
            </div>
            {isAdmin && (
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                添加研究
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* 介绍卡片 */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              全球肾结石研究数据库
            </CardTitle>
            <CardDescription>
              汇集全球范围内关于肾结石风险预测、论断方法和预防策略的科学研究数据
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              本数据库收录了来自全球各地的同行评审论文，展示了肾结石的患病情况、
              地理分布、发表趋势、风险因素和预测模型。这些数据特别针对飞行员群体的健康评估和预防策略提供了科学依据。
            </p>
          </CardContent>
        </Card>

        {/* 研究仪表板 */}
        <ResearchDashboard />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white/50 mt-12">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <span className="font-semibold">全球肾结石研究数据库</span>
            </div>
                        <p className="text-sm text-muted-foreground">
              所有数据来自已发表的同行评审论文。本数据库仅供参考，不能替代专业医疗诊断。
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© 2024</span>
              <span>版本 1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
