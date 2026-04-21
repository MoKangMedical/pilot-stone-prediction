import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users, Calendar, BookOpen } from "lucide-react";
import type { PilotStoneResearch } from "@/../../drizzle/schema";

interface ResearchPaperCardProps {
  research: PilotStoneResearch;
  onViewFigures?: (researchId: number) => void;
}

export function ResearchPaperCard({ research, onViewFigures }: ResearchPaperCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight mb-2">{research.title}</CardTitle>
            <CardDescription className="text-sm">
              {research.authors && `${research.authors.split(";")[0]}${research.authors.split(";").length > 1 ? " et al." : ""}`}
            </CardDescription>
          </div>
          {research.publicationYear && (
            <Badge variant="secondary" className="whitespace-nowrap">
              {research.publicationYear}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 期刊和DOI信息 */}
        <div className="space-y-2 text-sm">
          {research.journal && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>{research.journal}</span>
            </div>
          )}
          {research.country && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-lg">🌍</span>
              <span>{research.country}</span>
            </div>
          )}
        </div>

        {/* 摘要 */}
        {research.abstract && (
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <p className="line-clamp-3 text-muted-foreground">{research.abstract}</p>
          </div>
        )}

        {/* 关键数据 */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {research.sampleSize && (
            <div className="bg-primary/5 rounded p-2">
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Users className="w-3 h-3" />
                <span>样本量</span>
              </div>
              <div className="font-semibold text-primary">{research.sampleSize.toLocaleString()}</div>
            </div>
          )}
          {research.pilotIncidence && (
            <div className="bg-blue-50 dark:bg-blue-950 rounded p-2">
              <div className="text-muted-foreground mb-1 text-xs">飞行员患病率</div>
              <div className="font-semibold text-blue-600 dark:text-blue-400">{research.pilotIncidence}%</div>
            </div>
          )}
          {research.generalIncidence && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded p-2">
              <div className="text-muted-foreground mb-1 text-xs">普通人群患病率</div>
              <div className="font-semibold text-gray-600 dark:text-gray-400">{research.generalIncidence}%</div>
            </div>
          )}
          {research.publicationYear && (
            <div className="bg-muted/50 rounded p-2">
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Calendar className="w-3 h-3" />
                <span>发表年份</span>
              </div>
              <div className="font-semibold">{research.publicationYear}</div>
            </div>
          )}
        </div>

        {/* 主要发现 */}
        {research.mainFindings && (
          <div className="border-t pt-3">
            <h4 className="text-sm font-semibold mb-2">主要发现</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{research.mainFindings}</p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-2">
          {research.url && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => research.url && window.open(research.url, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              查看论文
            </Button>
          )}
          {onViewFigures && (
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => onViewFigures(research.id)}
            >
              查看图表
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
