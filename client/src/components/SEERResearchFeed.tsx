import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export function SEERResearchFeed() {
  const [limit, setLimit] = useState(10);
  
  // 获取最新SEER研究文章
  const { data: articles, isLoading, error } = trpc.seerResearch.getLatest.useQuery({
    limit
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>SEER研究进展</CardTitle>
          <CardDescription>全球最新肾结石相关研究</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>SEER研究进展</CardTitle>
          <CardDescription>全球最新肾结石相关研究</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">加载失败: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>SEER研究进展</CardTitle>
            <CardDescription>全球最新肾结石相关研究</CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">
            {articles?.length || 0} 篇文章
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {articles && articles.length > 0 ? (
          <>
            {articles.map((article) => (
              <div
                key={article.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    {article.chineseAbstract && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                        {article.chineseAbstract}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground">
                      <span>{article.source}</span>
                      {article.publishedDate && (
                        <span>
                          •{' '}
                          {new Date(article.publishedDate).toLocaleDateString('zh-CN')}
                        </span>
                      )}
                      {article.relevanceScore && (
                        <span>
                          • 相关性: {(parseFloat(article.relevanceScore as any) * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                  {article.sourceUrl && (
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 mt-1"
                    >
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            ))}
            
            {articles.length < 50 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setLimit(limit + 10)}
              >
                加载更多
              </Button>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            暂无研究文章
          </div>
        )}
      </CardContent>
    </Card>
  );
}
