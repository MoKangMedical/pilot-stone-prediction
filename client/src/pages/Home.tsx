import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ResearchGallery } from "@/components/ResearchGallery";
import { 
  Activity, Plane, FlaskConical, Heart, Calculator, 
  FileText, Settings, ArrowRight, Shield, Clock,
  Database, Zap, Users, BarChart3, Compass, Gauge, Wind, Globe
} from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* 飞行员主题背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 飞行路线装饰 */}
        <svg className="absolute top-20 right-10 w-64 h-64 opacity-5" viewBox="0 0 200 200">
          <path d="M 10 50 Q 100 20, 190 80" stroke="#0052cc" strokeWidth="2" fill="none" />
          <circle cx="10" cy="50" r="4" fill="#0052cc" />
          <circle cx="190" cy="80" r="4" fill="#0052cc" />
        </svg>
        {/* 罗盘装饰 */}
        <svg className="absolute bottom-32 left-10 w-48 h-48 opacity-5" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="#d4af37" strokeWidth="1" fill="none" />
          <line x1="50" y1="10" x2="50" y2="20" stroke="#d4af37" strokeWidth="2" />
          <line x1="50" y1="80" x2="50" y2="90" stroke="#d4af37" strokeWidth="2" />
          <line x1="10" y1="50" x2="20" y2="50" stroke="#d4af37" strokeWidth="2" />
          <line x1="80" y1="50" x2="90" y2="50" stroke="#d4af37" strokeWidth="2" />
        </svg>
      </div>
      {/* Header */}
      <header className="bg-gradient-to-r from-white via-blue-50/50 to-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">飞行员结石风险评估系统</h1>
                <p className="text-sm text-muted-foreground">✈️ 基于机器学习的肾结石风险预测</p>
              </div>
            </div>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden md:inline">
                  欢迎，{user?.name || "用户"}
                </span>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  退出
                </Button>
              </div>
            ) : (
              <Button onClick={() => window.location.href = getLoginUrl()}>
                登录
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-12 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-blue-100 rounded-full text-primary text-sm font-medium mb-6 border border-primary/20">
            <Plane className="w-4 h-4 animate-pulse" />
            专业医疗级风险评估
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            守护飞行员健康<br />
            <span className="bg-gradient-to-r from-primary via-blue-600 to-blue-700 bg-clip-text text-transparent">预防肾结石风险</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            基于先进的机器学习算法，结合飞行员职业特征、代谢指标和综合健康数据，
            提供科学、精准的肾结石风险评估与个性化健康建议。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => window.location.href = "/assessment"} className="bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-primary shadow-lg">
              开始风险评估
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            {isAuthenticated && (
              <Button size="lg" variant="outline" onClick={() => window.location.href = "/history"}>
                查看历史记录
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-12">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-4">系统功能</h3>
          <p className="text-muted-foreground">全方位的健康评估与数据管理</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          <Card className="card-hover border-blue-200 hover:border-primary hover:shadow-lg transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center mb-4 border border-primary/20">
                <Plane className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">职业特征分析</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                采集飞行时长、高空巡航占比、跨时区飞行等职业相关数据，评估飞行因素对结石风险的影响。
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="card-hover border-blue-200 hover:border-primary hover:shadow-lg transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center mb-4 border border-primary/20">
                <Wind className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">代谢指标检测</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                全面分析血清草酸盐、尿酸、钙磷代谢等关键代谢指标，精准评估代谢风险。
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="card-hover border-blue-200 hover:border-primary hover:shadow-lg transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center mb-4 border border-primary/20">
                <Compass className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">综合健康评估</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                整合体脂率、血压、运动习惯、睡眠质量等多维度健康数据，全面评估健康状况。
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="card-hover border-blue-200 hover:border-primary hover:shadow-lg transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center mb-4 border border-primary/20">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">风险评分计算</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                运用机器学习算法综合分析，生成精准的风险评分和个性化健康建议。
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Assessment Process */}
      <section className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">评估流程</h3>
            <p className="text-muted-foreground">简单四步，完成专业风险评估</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, icon: Users, title: "个人信息", desc: "填写基本信息" },
              { step: 2, icon: Plane, title: "职业特征", desc: "录入飞行数据" },
              { step: 3, icon: FlaskConical, title: "代谢指标", desc: "输入检测结果" },
              { step: 4, icon: BarChart3, title: "风险报告", desc: "获取评估结果" },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Features */}
      <section className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <Database className="w-10 h-10 mb-4" />
              <h4 className="text-lg font-semibold mb-2">数据管理</h4>
              <p className="text-blue-100">
                完整记录每次评估数据，支持历史查询、数据导出和远端同步。
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <Zap className="w-10 h-10 mb-4" />
              <h4 className="text-lg font-semibold mb-2">响应式设计</h4>
              <p className="text-purple-100">
                完美适配手机、平板和电脑，随时随地进行健康评估。
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <Shield className="w-10 h-10 mb-4" />
              <h4 className="text-lg font-semibold mb-2">数据安全</h4>
              <p className="text-green-100">
                采用安全加密传输，保护您的健康数据隐私安全。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 全球飞行员结石研究 */}
      <section className="container py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-4">全球飞行员结石研究</h2>
          <p className="text-muted-foreground mb-6">查看全球范围内的飞行员肾结石研究数据和统计分析</p>
          <Button 
            size="lg"
            onClick={() => window.location.href = "/research"}
            className="gap-2"
          >
            <Globe className="w-5 h-5" />
            查看全球研究数据
          </Button>
        </div>
        <ResearchGallery />
      </section>

      {/* Quick Actions */}
      {isAuthenticated && (
        <section className="container py-12">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>快捷操作</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => window.location.href = "/assessment"}
                  >
                    <Calculator className="w-6 h-6" />
                    <span>新建评估</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => window.location.href = "/history"}
                  >
                    <FileText className="w-6 h-6" />
                    <span>历史记录</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => window.location.href = "/settings"}
                  >
                    <Settings className="w-6 h-6" />
                    <span>系统设置</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => window.location.href = "/settings"}
                  >
                    <Database className="w-6 h-6" />
                    <span>API配置</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* 全球研究论文部分 */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <FileText className="w-8 h-8 text-primary" />
                全球结石研究论文
              </h2>
              <p className="text-muted-foreground">最新发表的肾结石预测、诊断和预防研究</p>
            </div>
            <a href="/papers">
              <Button className="gap-2">
                查看全部论文
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base line-clamp-2">
                    示例论文标题 {i}: 肾结石风险预测模型研究
                  </CardTitle>
                  <CardDescription>
                    作者 {i} 等 • 2024年
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    本研究基于大规模临床数据，建立了肾结石风险预测模型，特别针对飞行员群体的特殊风险因素进行了分析...
                  </p>
                  <a href="/papers">
                    <Button variant="outline" size="sm" className="w-full">
                      查看详情
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white/50">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <span className="font-semibold">飞行员结石风险评估系统</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              本系统仅供参考，不能替代专业医疗诊断。如有健康问题，请及时咨询专业医生。
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
