  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ApiConfig = typeof apiConfigs.$inferSelect;
export type InsertApiConfig = typeof apiConfigs.$inferInsert;

// 代谢指标数据类型定义
export interface MetabolicData {
  serumOxalate: number; // 血清草酸盐
  crp: number | null; // 超敏C反应蛋白
  crpUndone: boolean;
  lipoprotein: number | null; // 脂蛋白(a)
  lipoproteinUndone: boolean;
  calcium: number | null; // 钙
  calciumUndone: boolean;
  phosphorus: number | null; // 磷
  phosphorusUndone: boolean;
  urineGravity: number | null; // 尿液比重
  urineGravityUndone: boolean;
  urinePH: number | null; // 尿常规PH值
  urinePHUndone: boolean;
  creatinine: number | null; // 肌酐
  creatinineUndone: boolean;
  urea: number | null; // 尿素
  ureaUndone: boolean;
  uricAcid: number | null; // 尿酸
  uricAcidUndone: boolean;
  alt: number | null; // 丙氨酸氨基转移酶
  altUndone: boolean;
  fastingGlucose: number | null; // 空腹血糖
  fastingGlucoseUndone: boolean;
  hba1c: number | null; // 糖化血红蛋白
  hba1cUndone: boolean;
  pth: number | null; // 甲状旁腺素
  pthUndone: boolean;
  calcitonin: number | null; // 降钙素
  calcitoninUndone: boolean;
  totalCholesterol: number | null; // 总胆固醇
  totalCholesterolUndone: boolean;
  cholesterol: number | null; // 胆固醇
  cholesterolUndone: boolean;
  hdl: number | null; // 高密度脂蛋白
  hdlUndone: boolean;
  ldl: number | null; // 低密度脂蛋白
  ldlUndone: boolean;
  triglycerides: number | null; // 甘油三酯
  triglyceridesUndone: boolean;
}

// 综合健康指标数据类型定义
export interface HealthData {
  bodyFat: number | null; // 体脂率
  bodyFatUndone: boolean;
  height: number | null; // 身高
  weight: number | null; // 体重
  waist: number | null; // 腰围
  waistUndone: boolean;
  hip: number | null; // 臀围
  hipUndone: boolean;
  systolic: number | null; // 收缩压
  diastolic: number | null; // 舒张压
  dvt: boolean; // 深静脉血栓史
  hydrationFrequency: number; // 飞行中补水频率
  radiationExposure: number; // 辐射暴露程度
  waterIntake: number; // 每日饮水量
  exerciseTime: number; // 每周运动时间
  workStress: number; // 工作压力指数
  sleepQuality: number; // 睡眠质量指数
  mentalState: number; // 心理状态指数
}


/**
 * 全球飞行员结石研究论文表
 */
export const pilotStoneResearch = mysqlTable("pilot_stone_research", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 512 }).notNull(), // 论文标题
  abstract: text("abstract"), // 摘要
  authors: text("authors"), // 作者列表
  journal: varchar("journal", { length: 256 }), // 期刊名称
  publicationYear: int("publicationYear"), // 发表年份
  doi: varchar("doi", { length: 256 }), // DOI
  url: varchar("url", { length: 512 }), // 论文链接
  country: varchar("country", { length: 128 }), // 研究国家
  sampleSize: int("sampleSize"), // 样本量
  mainFindings: text("mainFindings"), // 主要发现
  pilotIncidence: decimal("pilotIncidence", { precision: 5, scale: 2 }), // 飞行员结石患病率(%)
  generalIncidence: decimal("generalIncidence", { precision: 5, scale: 2 }), // 普通人群患病率(%)
  riskFactors: text("riskFactors"), // 主要风险因素
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PilotStoneResearch = typeof pilotStoneResearch.$inferSelect;
export type InsertPilotStoneResearch = typeof pilotStoneResearch.$inferInsert;

/**
 * 研究论文图表表 - 存储论文中的关键图表
 */