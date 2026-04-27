import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaperList } from "@/components/PaperList";
import { ArrowLeft, BookOpen, TrendingUp, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function PapersPage() {
  const [, setLocation] = useLocation();
  const { data: papers = [] } = trpc.research.getAllResearch.useQuery();

  // 计算统计数据
  const totalPapers = papers.length;
  const latestYear = Math.max(...papers.map(p => Number(p.publicationYear) || 0));
  const avgCitations = papers.length > 0
    ? Math.round(papers.reduce((sum: number, p) => sum + ((p as any).citations || 0), 0) / papers.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
                    全球结石研究论文库
                  </h1>
                  <p className="text-xs text-muted-foreground">Global Kidney Stone Research Papers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">总论文数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPapers}</div>
              <p className="text-xs text-muted-foreground">已收录论文</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">最新年份</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestYear || "-"}</div>
              <p className="text-xs text-muted-foreground">发表年份</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">平均引用</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgCitations}</div>
              <p className="text-xs text-muted-foreground">次</p>
            </CardContent>
          </Card>
        </div>

        {/* 介绍卡片 */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              全球结石研究进展
            </CardTitle>
            <CardDescription>
              汇集全球最新发表的肾结石预测、诊断和预防相关研究论文
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              本论文库收录了来自全球各地的同行评审论文，涵盖肾结石的风险预测、诊断方法、预防策略和治疗方案等多个研究方向。
              这些论文为飞行员群体的结石风险评估和健康管理提供了重要的科学依据。
            </p>
          </CardContent>
        </Card>

        {/* 论文列表 */}
        <PaperList />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white/50 mt-12">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-semibold">全球结石研究论文库</span>
            </div>
            <p className="text-sm text-muted-foreground">
              所有数据来自已发表的同行评审论文。本论文库仅供参考，不能替代专业医疗诊断。
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
