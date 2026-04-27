import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, TrendingUp, BarChart3, Loader } from "lucide-react";
import { ResearchPaperCard } from "./ResearchPaperCard";
import { trpc } from "@/lib/trpc";

export function ResearchGallery() {
  const [selectedResearchId, setSelectedResearchId] = useState<number | null>(null);

  // 获取所有研究论文
  const { data: researchPapers, isLoading: papersLoading } = trpc.research.getAllResearch.useQuery();
  
  // 获取研究图表
  const { data: researchFigures } = trpc.research.getResearchFigures.useQuery(
    { researchId: selectedResearchId || 0 },
    { enabled: !!selectedResearchId }
  );

  // 获取研究统计数据
  const { data: statisticsData } = trpc.research.getResearchStatistics.useQuery();

  if (papersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4 border border-primary/20">
          <Globe className="w-4 h-4" />
          全球飞行员结石研究
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">国际研究进展</h2>
        <p className="text-muted-foreground">基于全球范围内发表的科学研究，了解飞行员肾结石风险的最新发现</p>
      </div>

      {/* 标签页 */}
      <Tabs defaultValue="papers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="papers" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            研究论文
          </TabsTrigger>
          <TabsTrigger value="figures" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            研究数据
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            全球统计
          </TabsTrigger>
        </TabsList>

        {/* 研究论文标签页 */}
        <TabsContent value="papers" className="space-y-4">
          {researchPapers && researchPapers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {researchPapers.map((paper: any) => (
                <ResearchPaperCard
                  key={paper.id}
                  research={paper}
                  onViewFigures={setSelectedResearchId}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                暂无研究论文数据
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 研究数据标签页 */}
        <TabsContent value="figures" className="space-y-4">
          {selectedResearchId ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">研究图表</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedResearchId(null)}
                >
                  清除选择
                </Button>
              </div>
              
              {researchFigures && researchFigures.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {researchFigures.map((figure: any) => (
                    <Card key={figure.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{figure.title}</CardTitle>
                        <CardDescription>{figure.figureNumber}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {figure.imageUrl && (
                          <img
                            src={figure.imageUrl}
                            alt={figure.title}
                            className="w-full rounded-lg object-cover max-h-64"
                          />
                        )}
                        {figure.description && (
                          <p className="text-sm text-muted-foreground">{figure.description}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    该研究暂无图表数据
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                请在研究论文中选择一篇论文查看其图表数据
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 全球统计标签页 */}
        <TabsContent value="statistics" className="space-y-4">
          {statisticsData && statisticsData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statisticsData.map((stat: any, index: number) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                      <div className="text-3xl font-bold text-primary mb-1">
                        {stat.value}
                        {stat.unit && <span className="text-lg ml-1">{stat.unit}</span>}
                      </div>
                      {stat.year && (
                        <p className="text-xs text-muted-foreground">数据年份: {stat.year}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                暂无全球统计数据
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
