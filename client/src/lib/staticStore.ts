/**
 * Static Data Store - localStorage-based data layer
 * Replaces backend API for GitHub Pages deployment
 */

const STORAGE_KEYS = {
  ASSESSMENTS: 'pilot_stone_assessments',
  SETTINGS: 'pilot_stone_settings',
  PAPERS: 'pilot_stone_papers',
  RESEARCH: 'pilot_stone_research',
} as const;

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

// ==================== Assessment Store ====================

export interface StoredAssessment {
  id: string;
  pilotName: string;
  pilotCode: string;
  gender: 'male' | 'female';
  age: number;
  flightData: any;
  metabolicData: any;
  healthData: any;
  flightRisk: number;
  metabolicRisk: number;
  healthRisk: number;
  overallRisk: number;
  riskLevel: string;
  suggestions: { title: string; content: string }[];
  createdAt: string;
}

export const assessmentStore = {
  getAll(): StoredAssessment[] {
    return getFromStorage<StoredAssessment[]>(STORAGE_KEYS.ASSESSMENTS, []);
  },

  getById(id: string): StoredAssessment | undefined {
    return this.getAll().find(a => a.id === id);
  },

  create(assessment: Omit<StoredAssessment, 'id' | 'createdAt'>): StoredAssessment {
    const assessments = this.getAll();
    const newAssessment: StoredAssessment = {
      ...assessment,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
    };
    assessments.unshift(newAssessment);
    setToStorage(STORAGE_KEYS.ASSESSMENTS, assessments);
    return newAssessment;
  },

  delete(id: string): void {
    const assessments = this.getAll().filter(a => a.id !== id);
    setToStorage(STORAGE_KEYS.ASSESSMENTS, assessments);
  },

  clear(): void {
    setToStorage(STORAGE_KEYS.ASSESSMENTS, []);
  },
};

// ==================== Research Papers Store ====================

export interface StoredPaper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  abstract: string;
  url: string;
  tags: string[];
  addedAt: string;
}

// Default demo papers
const DEMO_PAPERS: StoredPaper[] = [
  {
    id: 'demo-1',
    title: 'Kidney Stone Risk in Military Pilots: A 10-Year Retrospective Study',
    authors: 'Zhang L, Wang H, Chen X, Li M',
    journal: 'Aviation Space and Environmental Medicine',
    year: 2024,
    doi: '10.3357/ASEM.2024.0123',
    abstract: 'Background: Military pilots face unique risk factors for kidney stone formation due to high-altitude exposure, dehydration, and dietary constraints. This retrospective study analyzed 10-year data from 2,847 pilots to identify key risk factors and develop a predictive model. Methods: We collected clinical data including serum metabolic markers, flight hours, altitude exposure, and hydration patterns. Results: The incidence rate was 8.3% over the study period. Key risk factors included high uric acid levels (OR=2.4), low fluid intake during flight (OR=1.8), and high-altitude exposure >8000m (OR=1.6). Our predictive model achieved an AUC of 0.82. Conclusion: Regular screening and hydration protocols can significantly reduce kidney stone risk in pilots.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38123456/',
    tags: ['military', 'pilots', 'retrospective', 'risk-factors'],
    addedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'demo-2',
    title: 'Dehydration and Nephrolithiasis in Commercial Aviation: A Systematic Review',
    authors: 'Smith J, Johnson A, Williams R',
    journal: 'Journal of Occupational Medicine',
    year: 2023,
    doi: '10.1093/joccmed/2023.0456',
    abstract: 'Objective: To systematically review the evidence on dehydration-related kidney stone risk in commercial aviation professionals. Methods: We searched PubMed, Embase, and Cochrane databases for studies published between 2000-2023. Results: 15 studies met inclusion criteria, encompassing 12,456 aviation professionals. The pooled prevalence of nephrolithiasis was 7.2% (95% CI: 5.8-8.6%). Cabin humidity levels of 10-20% were consistently associated with increased risk. Conclusions: Current aviation environmental conditions pose significant risk for kidney stone formation. Improved hydration protocols and environmental controls are recommended.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/37567890/',
    tags: ['commercial', 'dehydration', 'systematic-review'],
    addedAt: '2023-12-01T00:00:00Z',
  },
  {
    id: 'demo-3',
    title: '尿石症飞行员特异性风险因素分析及预防策略',
    authors: '王明, 李强, 张华, 陈伟',
    journal: '中华航空航天医学杂志',
    year: 2024,
    doi: '10.3760/cma.j.issn.1007-6239.2024.0012',
    abstract: '目的：分析飞行员尿石症的特异性风险因素，制定针对性预防策略。方法：回顾性分析2018-2023年间就诊的156例飞行员尿石症患者资料，以同期健康飞行员200例为对照组。结果：多因素Logistic回归分析显示，高尿酸血症（OR=3.12）、低饮水量（OR=2.45）、长时间高空飞行（OR=1.89）为独立风险因素。结论：建议建立飞行员尿石症风险筛查体系，重点关注高尿酸血症和脱水风险。',
    url: 'https://pubmed.ncbi.nlm.nih.gov/39012345/',
    tags: ['chinese', 'risk-factors', 'prevention'],
    addedAt: '2024-03-20T00:00:00Z',
  },
  {
    id: 'demo-4',
    title: 'Machine Learning-Based Prediction of Kidney Stones in Aviation Personnel',
    authors: 'Kim S, Park J, Lee H, Choi Y',
    journal: 'Artificial Intelligence in Medicine',
    year: 2024,
    doi: '10.1016/j.artmed.2024.102789',
    abstract: 'This study develops and validates machine learning models for predicting kidney stone risk in aviation personnel. Using data from 3,241 pilots collected between 2019-2023, we trained and evaluated Random Forest, XGBoost, and Neural Network models. The XGBoost model achieved the best performance with AUC=0.89, sensitivity=0.82, specificity=0.85. Key features included serum calcium, uric acid, urine pH, flight hours, and hydration frequency. The model was deployed as a web-based risk calculator for clinical use.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/39567890/',
    tags: ['machine-learning', 'prediction', 'AI'],
    addedAt: '2024-06-10T00:00:00Z',
  },
  {
    id: 'demo-5',
    title: 'High-Altitude Exposure and Renal Stone Formation: Mechanisms and Prevention',
    authors: 'Brown M, Davis K, Thompson R',
    journal: 'Kidney International Reports',
    year: 2023,
    doi: '10.1016/j.ekir.2023.08.015',
    abstract: 'High-altitude environments create unique conditions that promote kidney stone formation. This review examines the pathophysiological mechanisms including hypoxia-induced metabolic changes, increased uric acid production, decreased urine pH, and dehydration from low humidity environments. We propose a comprehensive prevention strategy including hydration protocols, dietary modifications, and pharmacological interventions for high-risk individuals. Implementation of these strategies in military and commercial aviation settings could reduce stone incidence by 40-60%.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38234567/',
    tags: ['high-altitude', 'mechanisms', 'prevention'],
    addedAt: '2023-09-15T00:00:00Z',
  },
  {
    id: 'demo-6',
    title: 'Meta-Analysis of Nephrolithiasis Prevalence in Pilots vs General Population',
    authors: 'Garcia F, Martinez A, Rodriguez P, Lopez J',
    journal: 'European Urology',
    year: 2024,
    doi: '10.1016/j.eururo.2024.02.018',
    abstract: 'Background: Pilots are believed to have higher kidney stone risk than the general population, but the magnitude of this difference is unclear. Objective: To quantify the excess risk of nephrolithiasis in pilots through meta-analysis. Methods: We searched major databases for comparative studies. Results: 8 studies with 45,672 pilots and 234,567 controls were included. The pooled odds ratio for kidney stones in pilots vs controls was 1.94 (95% CI: 1.52-2.48, p<0.001). Heterogeneity was moderate (I²=45%). Subgroup analyses showed higher risk in military pilots (OR=2.31) compared to commercial pilots (OR=1.67). Conclusion: Pilots have approximately 2-fold higher risk of kidney stones compared to the general population.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/39876543/',
    tags: ['meta-analysis', 'prevalence', 'comparison'],
    addedAt: '2024-04-05T00:00:00Z',
  },
];

export const paperStore = {
  getAll(): StoredPaper[] {
    const stored = getFromStorage<StoredPaper[]>(STORAGE_KEYS.PAPERS, []);
    if (stored.length === 0) {
      // Initialize with demo data
      setToStorage(STORAGE_KEYS.PAPERS, DEMO_PAPERS);
      return DEMO_PAPERS;
    }
    return stored;
  },

  search(query: string): StoredPaper[] {
    const q = query.toLowerCase();
    return this.getAll().filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.authors.toLowerCase().includes(q) ||
      p.abstract.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    );
  },

  getByTag(tag: string): StoredPaper[] {
    return this.getAll().filter(p => p.tags.includes(tag));
  },
};

// ==================== Export/Import ====================

export const dataManager = {
  exportAll(): string {
    return JSON.stringify({
      assessments: assessmentStore.getAll(),
      papers: paperStore.getAll(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    }, null, 2);
  },

  importAll(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.assessments) setToStorage(STORAGE_KEYS.ASSESSMENTS, data.assessments);
      if (data.papers) setToStorage(STORAGE_KEYS.PAPERS, data.papers);
      return true;
    } catch {
      return false;
    }
  },

  clearAll(): void {
    assessmentStore.clear();
    localStorage.removeItem(STORAGE_KEYS.PAPERS);
  },
};
