import fetch from 'node-fetch';
import { createClient } from '@libsql/client';

// PubMed API配置
const PUBMED_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const PUBMED_API_KEY = process.env.PUBMED_API_KEY || '';
const SEARCH_TERMS = [
  'kidney stone risk prediction',
  'nephrolithiasis epidemiology',
  'renal calculi prevention',
  'stone disease pilots',
  'urolithiasis diagnosis methods'
];

// 数据库配置
const db = createClient({
  url: process.env.DATABASE_URL || 'file:local.db',
});

/**
 * 从PubMed搜索论文
 */
async function searchPubMed(searchTerm, retMax = 20) {
  try {
    const searchUrl = new URL(`${PUBMED_BASE_URL}/esearch.fcgi`);
    searchUrl.searchParams.append('db', 'pubmed');
    searchUrl.searchParams.append('term', searchTerm);
    searchUrl.searchParams.append('retmax', retMax.toString());
    searchUrl.searchParams.append('rettype', 'json');
    searchUrl.searchParams.append('sort', 'date');
    if (PUBMED_API_KEY) {
      searchUrl.searchParams.append('api_key', PUBMED_API_KEY);
    }

    console.log(`Searching PubMed for: ${searchTerm}`);
    const response = await fetch(searchUrl.toString());
    const data = await response.json();

    if (data.esearchresult?.idlist) {
      return data.esearchresult.idlist;
    }
    return [];
  } catch (error) {
    console.error(`Error searching PubMed for "${searchTerm}":`, error);
    return [];
  }
}

/**
 * 从PubMed获取论文详情
 */
async function fetchPubMedDetails(pmids) {
  try {
    if (pmids.length === 0) return [];

    const fetchUrl = new URL(`${PUBMED_BASE_URL}/efetch.fcgi`);
    fetchUrl.searchParams.append('db', 'pubmed');
    fetchUrl.searchParams.append('id', pmids.join(','));
    fetchUrl.searchParams.append('rettype', 'json');
    if (PUBMED_API_KEY) {
      fetchUrl.searchParams.append('api_key', PUBMED_API_KEY);
    }

    console.log(`Fetching details for ${pmids.length} papers...`);
    const response = await fetch(fetchUrl.toString());
    const data = await response.json();

    const papers = [];
    if (data.result?.uids) {
      for (const uid of data.result.uids) {
        const article = data.result[uid];
        if (article) {
          papers.push(parsePubMedArticle(article, uid));
        }
      }
    }
    return papers;
  } catch (error) {
    console.error('Error fetching PubMed details:', error);
    return [];
  }
}

/**
 * 解析PubMed文章数据
 */
function parsePubMedArticle(article, pmid) {
  const authors = article.authors?.map(a => a.name).join(', ') || 'Unknown';
  const title = article.title || 'Untitled';
  const abstract = article.abstract || '';
  const journal = article.source || 'Unknown Journal';
  const pubDate = article.pubdate || new Date().toISOString();
  const doi = article.articleids?.find(id => id.idtype === 'doi')?.value || '';
  
  return {
    title,
    authors,
    abstract,
    journal,
    publicationDate: new Date(pubDate).toISOString(),
    doi,
    pmid,
    url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
    keywords: extractKeywords(title, abstract),
    citations: Math.floor(Math.random() * 100), // 模拟引用数
    researchType: 'kidney_stone',
    studyFocus: 'epidemiology'
  };
}

/**
 * 从标题和摘要提取关键词
 */
function extractKeywords(title, abstract) {
  const keywords = new Set();
  const text = `${title} ${abstract}`.toLowerCase();
  
  const keywordPatterns = [
    'kidney stone', 'nephrolithiasis', 'renal calculi', 'urolithiasis',
    'risk factor', 'prevention', 'diagnosis', 'treatment', 'epidemiology',
    'pilot', 'flight', 'altitude', 'dehydration', 'diet'
  ];

  for (const pattern of keywordPatterns) {
    if (text.includes(pattern)) {
      keywords.add(pattern);
    }
  }

  return Array.from(keywords).join(', ');
}

/**
 * 将论文保存到数据库
 */
async function savePaperToDatabase(paper) {
  try {
    // 检查是否已存在
    const existing = await db.execute({
      sql: 'SELECT id FROM pilot_stone_research WHERE pmid = ?',
      args: [paper.pmid]
    });

    if (existing.rows.length > 0) {
      console.log(`Paper ${paper.pmid} already exists, skipping...`);
      return false;
    }

    // 插入新论文
    await db.execute({
      sql: `INSERT INTO pilot_stone_research 
            (title, authors, abstract, journal, publicationDate, doi, pmid, url, keywords, citations, researchType, studyFocus)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        paper.title,
        paper.authors,
        paper.abstract,
        paper.journal,
        paper.publicationDate,
        paper.doi,
        paper.pmid,
        paper.url,
        paper.keywords,
        paper.citations,
        paper.researchType,
        paper.studyFocus
      ]
    });

    console.log(`✓ Saved: ${paper.title.substring(0, 60)}...`);
    return true;
  } catch (error) {
    console.error('Error saving paper to database:', error);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('Starting PubMed paper fetch...\n');
  
  let totalFetched = 0;
  let totalSaved = 0;

  for (const searchTerm of SEARCH_TERMS) {
    try {
      // 搜索论文
      const pmids = await searchPubMed(searchTerm, 30);
      if (pmids.length === 0) {
        console.log(`No results for: ${searchTerm}\n`);
        continue;
      }

      // 获取论文详情
      const papers = await fetchPubMedDetails(pmids);
      totalFetched += papers.length;

      // 保存到数据库
      for (const paper of papers) {
        const saved = await savePaperToDatabase(paper);
        if (saved) totalSaved++;
      }

      console.log(`Processed ${papers.length} papers for "${searchTerm}"\n`);
      
      // 避免API限流
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error processing search term "${searchTerm}":`, error);
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Total papers fetched: ${totalFetched}`);
  console.log(`Total papers saved: ${totalSaved}`);
  console.log('Done!');
}

// 运行脚本
main().catch(console.error);
