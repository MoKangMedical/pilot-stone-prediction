import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Shield, Activity, FileText, BookOpen, ChevronRight,
  Plane, Heart, Droplets, Brain, BarChart3, Users,
  CheckCircle, ArrowRight, Globe, Award, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "研究论文", value: "6+", icon: BookOpen },
  { label: "风险指标", value: "20+", icon: Activity },
  { label: "评估维度", value: "3", icon: BarChart3 },
  { label: "个性化建议", value: "16+", icon: Heart },
];

const features = [
  {
    icon: Shield,
    title: "三维风险评估",
    desc: "职业特征、代谢指标、综合健康三维度全面评估飞行员尿石症风险",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Activity,
    title: "AI驱动预测",
    desc: "基于机器学习模型，整合20+项临床指标，精准预测结石风险",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: FileText,
    title: "医疗级报告",
    desc: "自动生成专业PDF评估报告，包含风险分析和个性化健康建议",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: BookOpen,
    title: "全球研究前沿",
    desc: "整合PubMed最新研究论文，追踪全球肾结石预防和治疗进展",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Globe,
    title: "飞行员专属",
    desc: "针对高空飞行环境、脱水风险、特殊饮食等飞行员特有因素设计",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: Zap,
    title: "即时评估",
    desc: "5分钟完成全部评估，实时计算风险分数，立即获取健康建议",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
];

const riskFactors = [
  { icon: Droplets, label: "脱水风险", desc: "驾驶舱低湿度环境导致体液流失" },
  { icon: Plane, label: "高空暴露", desc: "长时间高空巡航影响代谢平衡" },
  { icon: Brain, label: "工作压力", desc: "高强度飞行任务增加代谢负担" },
  { icon: Heart, label: "饮食限制", desc: "航空餐营养结构和盐分摄入" },
];

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">PilotStone</span>
              <span className="text-xs text-gray-500 hidden sm:inline">飞行员结石风险评估</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/research">
                <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">研究论文</span>
              </Link>
              <Link href="/assessment">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  开始评估
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                <Award className="w-4 h-4" />
                专利技术支撑 · 专利号 2024116733167
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                飞行员
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  尿石症风险
                </span>
                <br />智能评估系统
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                基于AI和机器学习，整合职业特征、代谢指标、综合健康三维度数据，
                为飞行员提供精准的尿石症风险预测和个性化健康管理建议。
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/assessment">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                    开始风险评估
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
                <Link href="/research">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    查看研究论文
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>20+临床指标</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>医疗级报告</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>数据安全</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-3xl blur-3xl" />
                <Card className="relative border-0 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Activity className="w-4 h-4" />
                        风险评估示例
                      </div>
                      <div className="text-5xl font-bold text-blue-600 mb-2">23.5%</div>
                      <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                        低风险
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">职业特征风险</span>
                          <span className="font-medium">18%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '18%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">代谢指标风险</span>
                          <span className="font-medium">31%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '31%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">综合健康风险</span>
                          <span className="font-medium">21%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '21%' }} />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">6</div>
                          <div className="text-xs text-gray-500">个性化建议</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">20+</div>
                          <div className="text-xs text-gray-500">评估指标</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Factors */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              飞行员面临的独特风险
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              高空飞行环境带来特殊的健康挑战，尿石症是飞行员最常见的职业健康问题之一
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {riskFactors.map((factor) => (
              <Card key={factor.label} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 text-red-600 mb-4">
                    <factor.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{factor.label}</h3>
                  <p className="text-sm text-gray-600">{factor.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              全方位风险评估能力
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              融合临床医学、航空医学和人工智能，提供精准的风险预测和健康管理方案
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <h2 className="text-3xl font-bold mb-4">
                  开始您的健康风险评估
                </h2>
                <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                  5分钟完成评估，获取专业的风险分析报告和个性化健康建议
                </p>
                <Link href="/assessment">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-10">
                    立即开始评估
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">PilotStone</span>
              </div>
              <p className="text-sm">
                基于AI的飞行员尿石症风险评估系统，
                守护飞行员健康与飞行安全。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">快速链接</h4>
              <div className="space-y-2">
                <Link href="/assessment"><div className="text-sm hover:text-white cursor-pointer">风险评估</div></Link>
                <Link href="/research"><div className="text-sm hover:text-white cursor-pointer">研究论文</div></Link>
                <Link href="/history"><div className="text-sm hover:text-white cursor-pointer">评估历史</div></Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">技术支撑</h4>
              <div className="space-y-2 text-sm">
                <p>专利号：2024116733167</p>
                <p>发明名称：基于机器学习模型的肾结石预测并协助早筛方法</p>
                <p>苏州工业园区蒙纳士科学技术研究院</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2024 PilotStone. 飞行员尿石症风险评估系统. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
