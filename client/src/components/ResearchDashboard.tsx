import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter
} from "recharts";
import { Globe, TrendingUp, Users, BookOpen, Search, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";

const RESEARCH_TYPES = [
  { value: "pilot", label: "飞行员特定研究" },
  { value: "general", label: "通用肾结石研究" },
  { value: "prediction", label: "风险预测研究" },
  { value: "diagnosis", label: "诊断方法研究" },
  { value: "prevention", label: "预防策略研究" },
];

const STUDY_FOCUS = [
  { value: "risk", label: "风险因素" },
  { value: "diagnosis", label: "诊断方法" },
  { value: "prevention", label: "预防策略" },
  { value: "treatment", label: "治疗方法" },
  { value: "epidemiology", label: "流行病学" },
];

export function ResearchDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedResearchType, setSelectedResearchType] = useState<string | null>(null);
  const [selectedStudyFocus, setSelectedStudyFocus] = useState<string | null>(null);
  
  // 获取所有研究数据
  const { data: allResearch = [], isLoading } = trpc.research.getAllResearch.useQuery();
  
  // 获取研究统计数据
  const { data: statistics = [] } = trpc.research.getResearchStatistics.useQuery();

  // 处理搜索过滤
  const filteredResearch = allResearch.filter(paper => {
    const matchesSearch = paper.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.authors?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.country?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || paper.country === selectedCountry;
    const matchesResearchType = !selectedResearchType || (paper as any).researchType === selectedResearchType;
    const matchesStudyFocus = !selectedStudyFocus || (paper as any).studyFocus === selectedStudyFocus;
    return matchesSearch && matchesCountry && matchesResearchType && matchesStudyFocus;
  });

  // 按国家统计研究数量
  const countryStats = allResearch.reduce((acc: any, paper) => {
    if (!paper.country) return acc;
    const existing = acc.find((c: any) => c.name === paper.country);
    if (existing) {
      existing.count += 1;
      if (paper.pilotIncidence) {
        existing.incidence = (parseFloat(existing.incidence) + parseFloat(paper.pilotIncidence)) / 2;
      }
    } else {
      acc.push({
        name: paper.country,
        count: 1,
        incidence: paper.pilotIncidence ? parseFloat(paper.pilotIncidence) : 0
      });
    }
    return acc;
  }, []).sort((a: any, b: any) => b.count - a.count);

  // 按发表年份统计
  const yearStats = allResearch.reduce((acc: any, paper) => {
    if (!paper.publicationYear) return acc;
    const existing = acc.find((y: any) => y.year === paper.publicationYear);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ year: String(paper.publicationYear), count: 1 });
    }
    return acc;
  }, []).sort((a: any, b: any) => parseInt(a.year) - parseInt(b.year));

  // 患病率数据
  const incidenceData = allResearch
    .filter(p => p.pilotIncidence && p.sampleSize)
    .map(p => ({
      country: p.country,
      incidence: parseFloat(String(p.pilotIncidence)),
      sampleSize: p.sampleSize
    }))
    .sort((a: any, b: any) => b.incidence - a.incidence)
    .slice(0, 15);

  // 计算统计数据
  const totalResearch = allResearch.length;
  const countriesCount = new Set(allResearch.map(p => p.country)).size;
  const avgIncidence = allResearch.length > 0
    ? (allResearch.reduce((sum: number, p) => sum + (p.pilotIncidence ? parseFloat(String(p.pilotIncidence)) : 0), 0) / allResearch.length).toFixed(2)
    : 0;
  const latestYear = Math.max(...allResearch.map(p => Number(p.publicationYear) || 0));

  if (isLoading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总研究数量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResearch}</div>
            <p className="text-xs text-muted-foreground">已收录论文</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">覆盖国家</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countriesCount}</div>
            <p className="text-xs text-muted-foreground">个国家和地区</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">平均患病率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgIncidence}%</div>
            <p className="text-xs text-muted-foreground">肾结石患病率</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">最新发表</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestYear}</div>
            <p className="text-xs text-muted-foreground">年份</p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            搜索和筛选
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="搜索论文标题、作者或国家..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">研究类型</label>
            <div className="flex gap-2 flex-wrap">
              {RESEARCH_TYPES.map(type => (
                <Button
                  key={type.value}
                  variant={selectedResearchType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedResearchType(selectedResearchType === type.value ? null : type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">研究焦点</label>
            <div className="flex gap-2 flex-wrap">
              {STUDY_FOCUS.map(focus => (
                <Button
                  key={focus.value}
                  variant={selectedStudyFocus === focus.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStudyFocus(selectedStudyFocus === focus.value ? null : focus.value)}
                >
                  {focus.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 数据展示标签页 */}
      <Tabs defaultValue="papers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="papers">论文列表</TabsTrigger>
          <TabsTrigger value="countries">国家分布</TabsTrigger>
          <TabsTrigger value="trends">发表趋势</TabsTrigger>
          <TabsTrigger value="incidence">患病率对比</TabsTrigger>
        </TabsList>

        {/* 论文列表标签页 */}
        <TabsContent value="papers">
          <Card>
            <CardHeader>
              <CardTitle>肾结石研究论文 ({filteredResearch.length})</CardTitle>
              <CardDescription>全球肾结石预测和诊断相关研究</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">标题</th>
                      <th className="text-left py-2 px-4">国家</th>
                      <th className="text-left py-2 px-4">年份</th>
                      <th className="text-left py-2 px-4">患病率</th>
                      <th className="text-left py-2 px-4">样本量</th>
                      <th className="text-left py-2 px-4">研究类型</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResearch.slice(0, 10).map((paper, idx) => {
                      const researchType = RESEARCH_TYPES.find(t => t.value === (paper as any).researchType);
                      return (
                        <tr key={idx} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4 max-w-xs truncate">{paper.title}</td>
                          <td className="py-2 px-4">{paper.country || "-"}</td>
                          <td className="py-2 px-4">{paper.publicationYear || "-"}</td>
                          <td className="py-2 px-4">
                            {paper.pilotIncidence ? `${paper.pilotIncidence}%` : "-"}
                          </td>
                          <td className="py-2 px-4">{paper.sampleSize || "-"}</td>
                          <td className="py-2 px-4 text-xs">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {researchType?.label || "-"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 国家分布标签页 */}
        <TabsContent value="countries">
          <Card>
            <CardHeader>
              <CardTitle>各国研究分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={countryStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#0052cc" name="研究数量" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 发表趋势标签页 */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>研究发表趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yearStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" type="number" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#0052cc" name="论文数量" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 患病率对比标签页 */}
        <TabsContent value="incidence">
          <Card>
            <CardHeader>
              <CardTitle>患病率对比分析</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incidenceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="incidence" fill="#0052cc" name="患病率 (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
