import { useState } from "react";
import { Link } from "wouter";
import {
  Search, ExternalLink, BookOpen, Calendar, Users,
  Tag, ChevronLeft, Filter, Globe, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { paperStore, type StoredPaper } from "@/lib/staticStore";

const allTags = [
  "risk-factors", "prevention", "machine-learning", "dehydration",
  "high-altitude", "meta-analysis", "military", "commercial",
  "chinese", "retrospective", "systematic-review", "prediction"
];

export default function Research() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const papers = paperStore.getAll();

  const filteredPapers = papers.filter(p => {
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || p.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                返回首页
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">全球肾结石研究</h1>
              <p className="text-sm text-gray-500">飞行员尿石症风险预测研究论文库</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{papers.length}</div>
              <div className="text-xs text-gray-500">研究论文</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Globe className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{new Set(papers.flatMap(p => p.tags)).size}</div>
              <div className="text-xs text-gray-500">研究主题</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{new Set(papers.flatMap(p => p.authors.split(',').map(a => a.trim()))).size}</div>
              <div className="text-xs text-gray-500">研究作者</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{new Set(papers.map(p => p.journal)).size}</div>
              <div className="text-xs text-gray-500">期刊来源</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索论文标题、作者、摘要..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            全部
          </Button>
          {allTags.map(tag => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* Papers List */}
        <div className="space-y-6">
          {filteredPapers.map(paper => (
            <Card key={paper.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                      <a href={paper.url} target="_blank" rel="noopener noreferrer">
                        {paper.title}
                      </a>
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {paper.authors}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {paper.journal}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {paper.year}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {paper.abstract}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {paper.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a href={paper.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-3.5 h-3.5 mr-1" />
                        PubMed
                      </Button>
                    </a>
                    {paper.doi && (
                      <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="w-full">
                          DOI
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPapers.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">未找到匹配的论文</p>
          </div>
        )}
      </div>
    </div>
  );
}
