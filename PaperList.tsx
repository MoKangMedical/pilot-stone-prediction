import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Calendar, Users, ExternalLink, Search, Filter, 
  ChevronRight, Star, Share2, Link as LinkIcon, Copy, Check
} from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Paper {
  id: string | number;
  title: string;
  authors: string | null;
  abstract?: string | null;
  publicationDate?: string | null;
  journal?: string | null;
  doi?: string | null;
  url?: string | null;
  keywords?: string | null;
  citations?: number | null;
  createdAt?: string | Date | null;
  pmid?: string | number | null;
  thumbnail?: string | null;
}

export function PaperList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "citations" | "relevance">("latest");
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 获取所有论文
  const { data: papers = [], isLoading } = trpc.research.getAllResearch.useQuery();

  // 处理搜索和筛选
  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.authors?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (paper as any).abstract?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKeyword = !selectedKeyword || (paper as any).keywords?.includes(selectedKeyword);
    return matchesSearch && matchesKeyword;
  });

  // 排序
  const sortedPapers = [...filteredPapers].sort((a, b) => {
    if (sortBy === "latest") {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    } else if (sortBy === "citations") {
      return ((b as any).citations || 0) - ((a as any).citations || 0);
    }
    return 0;
  });

  // 提取所有关键词
  const allKeywords = Array.from(
    new Set(papers.flatMap(p => (p as any).keywords?.split(",").map((k: string) => k.trim()) || []))
  ).filter(Boolean);

  const handleCopyCitation = (paper: Paper) => {
    const citation = `${paper.authors || 'Unknown'}. ${paper.title}. ${(paper as any).journal || 'Unknown'}. ${new Date((paper as any).publicationDate || 0).getFullYear()}.`;
    navigator.clipboard.writeText(citation);
    setCopiedId(String(paper.id));
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 搜索和筛选 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            搜索论文
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="搜索论文标题、作者或摘要..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">排序方式</label>
            <div className="flex gap-2">
              {[
                { value: "latest", label: "最新发表" },
                { value: "citations", label: "引用次数" },
                { value: "relevance", label: "相关性" }
              ].map(option => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(option.value as any)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {allKeywords.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">关键词筛选</label>
              <div className="flex gap-2 flex-wrap">
                {allKeywords.slice(0, 10).map(keyword => (
                  <Badge
                    key={keyword}
                    variant={selectedKeyword === keyword ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedKeyword(selectedKeyword === keyword ? null : keyword)}
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 论文列表 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            研究论文 ({sortedPapers.length})
          </h2>
        </div>

        {sortedPapers.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              未找到匹配的论文
            </CardContent>
          </Card>
        ) : (
          sortedPapers.map((paper, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow overflow-hidden">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {/* 论文图片 */}
                  {(paper as any).thumbnail && (
                    <div className="mb-4">
                      <img 
                        src={(paper as any).thumbnail} 
                        alt={paper.title}
                        className="w-full h-40 object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* 标题 */}
                  <div>
                    <h3 className="text-lg font-semibold text-primary hover:underline cursor-pointer">
                      {paper.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {paper.authors}
                    </p>
                  </div>

                  {/* 摘要 */}
                  {(paper as any).abstract && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {(paper as any).abstract}
                    </p>
                  )}

                  {/* 元数据 */}
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {(paper as any).journal && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {(paper as any).journal}
                      </div>
                    )}
                    {(paper as any).publicationDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date((paper as any).publicationDate).toLocaleDateString()}
                      </div>
                    )}
                    {(paper as any).citations && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {(paper as any).citations} 引用
                      </div>
                    )}
                  </div>

                  {/* 关键词 */}
                  {(paper as any).keywords && (
                    <div className="flex gap-2 flex-wrap">
                      {(paper as any).keywords.split(",").map((keyword: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {keyword.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="flex gap-2 pt-2 flex-wrap">
                    {(paper as any).pmid && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => window.open(`https://pubmed.ncbi.nlm.nih.gov/${(paper as any).pmid}/`, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                        PubMed
                      </Button>
                    )}
                    {(paper as any).doi && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => window.open(`https://doi.org/${(paper as any).doi}`, "_blank")}
                      >
                        <LinkIcon className="w-4 h-4" />
                        DOI
                      </Button>
                    )}
                    {(paper as any).url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => window.open((paper as any).url, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                        全文链接
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleCopyCitation(paper)}
                    >
                      {copiedId === String(paper.id) ? (
                        <>
                          <Check className="w-4 h-4" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          复制引用
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
