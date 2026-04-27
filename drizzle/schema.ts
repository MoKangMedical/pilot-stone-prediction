import { mysqlTable, int, varchar, text, timestamp, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * 用户表
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 255 }),
  username: varchar("username", { length: 255 }),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 50 }),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  lastSignedIn: timestamp("lastSignedIn"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 飞行员信息表
 */
export const pilots = mysqlTable("pilots", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  name: varchar("name", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 10 }),
  age: int("age"),
  pilotId: varchar("pilotId", { length: 100 }),
  // 职业特征
  avgFlightDuration: decimal("avgFlightDuration", { precision: 5, scale: 1 }),
  annualFlightHours: int("annualFlightHours"),
  aircraftType: varchar("aircraftType", { length: 100 }),
  highAltitudeRatio: decimal("highAltitudeRatio", { precision: 5, scale: 2 }),
  crossTimezoneFlights: int("crossTimezoneFlights"),
  cockpitTempMedian: decimal("cockpitTempMedian", { precision: 4, scale: 1 }),
  emergencyLandings: int("emergencyLandings"),
  saltIntakeLevel: int("saltIntakeLevel"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pilot = typeof pilots.$inferSelect;
export type InsertPilot = typeof pilots.$inferInsert;

/**
 * 评估记录表
 */
export const assessments = mysqlTable("assessments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  pilotId: int("pilotId"),
  pilotName: varchar("pilotName", { length: 255 }),
  gender: varchar("gender", { length: 10 }),
  age: int("age"),
  pilotNumber: varchar("pilotNumber", { length: 100 }),
  // 飞行风险数据 (JSON)
  flightData: json("flightData"),
  // 代谢数据 (JSON)
  metabolicData: json("metabolicData"),
  // 健康数据 (JSON)
  healthData: json("healthData"),
  // 风险评分
  flightRisk: decimal("flightRisk", { precision: 5, scale: 4 }),
  metabolicRisk: decimal("metabolicRisk", { precision: 5, scale: 4 }),
  healthRisk: decimal("healthRisk", { precision: 5, scale: 4 }),
  overallRisk: decimal("overallRisk", { precision: 5, scale: 4 }),
  riskLevel: varchar("riskLevel", { length: 50 }),
  // 建议
  suggestions: json("suggestions"),
  // 同步状态
  syncedToRemote: boolean("syncedToRemote").default(false),
  remoteId: varchar("remoteId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;

/**
 * API配置表
 */
export const apiConfigs = mysqlTable("api_configs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  name: varchar("name", { length: 255 }).notNull(),
  endpoint: varchar("endpoint", { length: 512 }),
  apiKey: varchar("apiKey", { length: 512 }),
  isActive: boolean("isActive").default(false),
  lastSyncAt: timestamp("lastSyncAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
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
export const researchFigures = mysqlTable("research_figures", {
  id: int("id").autoincrement().primaryKey(),
  researchId: int("researchId"),
  figureUrl: varchar("figureUrl", { length: 512 }),
  caption: text("caption"),
  figureData: json("figureData"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ResearchFigure = typeof researchFigures.$inferSelect;
export type InsertResearchFigure = typeof researchFigures.$inferInsert;

/**
 * 研究统计数据表
 */
export const researchStatistics = mysqlTable("research_statistics", {
  id: int("id").autoincrement().primaryKey(),
  researchId: int("researchId"),
  statisticType: varchar("statisticType", { length: 128 }),
  label: varchar("label", { length: 256 }),
  value: decimal("value", { precision: 10, scale: 2 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ResearchStatistic = typeof researchStatistics.$inferSelect;
export type InsertResearchStatistic = typeof researchStatistics.$inferInsert;

/**
 * SEER研究文章表
 */
export const seerResearchArticles = mysqlTable("seer_research_articles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 512 }).notNull(),
  abstract: text("abstract"),
  authors: text("authors"),
  journal: varchar("journal", { length: 256 }),
  publicationYear: int("publicationYear"),
  doi: varchar("doi", { length: 256 }),
  url: varchar("url", { length: 512 }),
  keywords: text("keywords"),
  researchType: varchar("researchType", { length: 128 }),
  studyFocus: varchar("studyFocus", { length: 128 }),
  processed: boolean("processed").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SeerResearchArticle = typeof seerResearchArticles.$inferSelect;
export type InsertSeerResearchArticle = typeof seerResearchArticles.$inferInsert;
