/**
 * SEER研究文章爬取和处理服务
 * 自动从PubMed和Google Scholar爬取最新SEER相关研究文章
 * 使用LLM生成中文摘要
 */

import { createSeerArticle, getLatestSeerArticles, getUnprocessedSeerArticles, updateSeerArticle, getSeerArticleByUrl } from './db';
import { invokeLLM } from './_core/llm';
import { InsertSeerResearchArticle } from '../drizzle/schema';

// SEER相关的关键词
const SEER_KEYWORDS = [
  'SEER database',
  'SEER registry',
  'Surveillance Epidemiology End Results',
  'kidney stone',
  'nephrolithiasis',
  'urolithiasis',
  'uric acid stone',
  'calcium oxalate stone',
  'stone formation',
  'urinary calculi',
];

/**
 * 从PubMed API获取最新文章
 */
export async function fetchFromPubMed(keyword: string, limit: number = 5): Promise<any[]> {
  try {
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(keyword)}&sort=date&retmax=${limit}&rettype=json`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (!searchData.esearchresult?.idlist) {
      return [];
    }

    const pmids = searchData.esearchresult.idlist.slice(0, limit);
    const articles = [];

    // 获取每篇文章的详细信息
    for (const pmid of pmids) {
      const detailUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmid}&rettype=json`;
      const detailResponse = await fetch(detailUrl);
      const detailData = await detailResponse.json();

      if (detailData.result?.uids?.[0]) {
        const article = detailData.result[pmid];
        if (article) {
          articles.push({
            title: article.title || '',
            abstract: article.abstract || '',
            pmid: pmid,
            authors: article.authors?.map((a: any) => a.name).join(', ') || '',
            publishedDate: article.pubdate || new Date().toISOString(),
          });
        }
      }
    }

    return articles;
  } catch (error) {
    console.error('[SEER Service] Error fetching from PubMed:', error);
    return [];
  }
}

/**
 * 使用LLM生成中文摘要
 */
export async function generateChineseSummary(title: string, abstract: string): Promise<string> {
  try {
    const prompt = `请为以下医学研究文章生成一份简洁的中文摘要（150字以内）。

标题：${title}

摘要：${abstract}

要求：
1. 用中文简洁表达
2. 突出主要研究发现
3. 关注与肾结石风险评估的相关性
4. 避免过于专业的医学术语`;

    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: '你是一位医学文献翻译专家，擅长将英文医学摘要翻译成易懂的中文总结。'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.choices?.[0]?.message?.content;
    return typeof content === 'string' ? content : '';
  } catch (error) {
    console.error('[SEER Service] Error generating Chinese summary:', error);
    return '';
  }
}

/**
 * 处理未处理的文章，生成中文摘要
 */
export async function processUnprocessedArticles(): Promise<void> {
  try {
    const unprocessedArticles = await getUnprocessedSeerArticles();
    
    for (const article of unprocessedArticles) {
      if (!article.originalAbstract) {
        continue;
      }

      const chineseSummary = await generateChineseSummary(
        article.title,
        article.originalAbstract
      );

      if (chineseSummary) {
        await updateSeerArticle(article.id, {
          chineseAbstract: chineseSummary,
          isProcessed: true,
        });
        console.log(`[SEER Service] Processed article: ${article.title}`);
      }

      // 避免API速率限制
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('[SEER Service] Error processing articles:', error);
  }
}

/**
 * 爬取最新的SEER相关研究文章
 */
export async function crawlLatestSeerResearch(): Promise<void> {
  try {
    console.log('[SEER Service] Starting to crawl latest SEER research...');

    for (const keyword of SEER_KEYWORDS) {
      const articles = await fetchFromPubMed(keyword, 3);

      for (const article of articles) {
        // 检查是否已存在
        const existing = await getSeerArticleByUrl(`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}`);
        if (existing) {
          continue;
        }

        // 计算相关性评分（简单实现）
        const relevanceScore = calculateRelevanceScore(article.title, article.abstract);

        const newArticle: InsertSeerResearchArticle = {
          title: article.title,
          originalAbstract: article.abstract,
          source: 'PubMed',
          sourceUrl: `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}`,
          publishedDate: new Date(article.publishedDate),
          authors: article.authors,
          keywords: JSON.stringify([keyword]),
          relevanceScore: String(relevanceScore),
          isProcessed: false,
        };

        const id = await createSeerArticle(newArticle);
        console.log(`[SEER Service] Created new article: ${article.title} (ID: ${id})`);

        // 避免API速率限制
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // 处理未处理的文章
    await processUnprocessedArticles();

    console.log('[SEER Service] Crawling completed');
  } catch (error) {
    console.error('[SEER Service] Error crawling SEER research:', error);
  }
}

/**
 * 计算文章的相关性评分
 */
function calculateRelevanceScore(title: string, abstract: string): number {
  const text = (title + ' ' + abstract).toLowerCase();
  let score = 0;

  // 关键词匹配
  const keywordMatches = [
    'seer',
    'kidney stone',
    'nephrolithiasis',
    'urolithiasis',
    'uric acid',
    'calcium oxalate',
    'stone formation',
  ];

  for (const keyword of keywordMatches) {
    if (text.includes(keyword)) {
      score += 0.15;
    }
  }

  // 标题中的关键词权重更高
  if (title.toLowerCase().includes('kidney stone') || title.toLowerCase().includes('nephrolithiasis')) {
    score += 0.2;
  }

  // 限制分数在0-1之间
  return Math.min(score, 1) as any;
}

/**
 * 定时任务：每天凌晨2点爬取最新研究
 */
export function schedulePeriodicCrawl(): void {
  // 每24小时执行一次
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 2 && now.getMinutes() === 0) {
      crawlLatestSeerResearch();
    }
  }, 60000); // 每分钟检查一次
}
