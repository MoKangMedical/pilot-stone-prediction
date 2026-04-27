// 代谢指标数据类型定义
export interface MetabolicData {
  serumOxalate: number | null;
  serumOxalateUndone: boolean;
  crp: number | null;
  crpUndone: boolean;
  lipoprotein: number | null;
  lipoproteinUndone: boolean;
  calcium: number | null;
  calciumUndone: boolean;
  phosphorus: number | null;
  phosphorusUndone: boolean;
  urineGravity: number | null;
  urineGravityUndone: boolean;
  urinePH: number | null;
  urinePHUndone: boolean;
  creatinine: number | null;
  creatinineUndone: boolean;
  urea: number | null;
  ureaUndone: boolean;
  uricAcid: number | null;
  uricAcidUndone: boolean;
  alt: number | null;
  altUndone: boolean;
  fastingGlucose: number | null;
  fastingGlucoseUndone: boolean;
  hba1c: number | null;
  hba1cUndone: boolean;
  pth: number | null;
  pthUndone: boolean;
  calcitonin: number | null;
  calcitoninUndone: boolean;
  totalCholesterol: number | null;
  totalCholesterolUndone: boolean;
  cholesterol: number | null;
  cholesterolUndone: boolean;
  hdl: number | null;
  hdlUndone: boolean;
  ldl: number | null;
  ldlUndone: boolean;
  triglycerides: number | null;
  triglyceridesUndone: boolean;
}

// 综合健康指标数据类型定义
export interface HealthData {
  bodyFat: number | null;
  bodyFatUndone: boolean;
  height: number | null;
  weight: number | null;
  waist: number | null;
  waistUndone: boolean;
  hip: number | null;
  hipUndone: boolean;
  systolic: number | null;
  diastolic: number | null;
  dvt: boolean;
  hydrationFrequency: number;
  radiationExposure: number;
  waterIntake: number;
  exerciseTime: number;
  workStress: number;
  sleepQuality: number;
  mentalState: number;
}

// 风险等级类型
export type RiskLevel = "low" | "medium" | "high" | "critical";

// 风险等级配置
export const RISK_LEVEL_CONFIG = {
  low: { label: "低风险", color: "#34a853", threshold: 20 },
  medium: { label: "中等风险", color: "#fbbc05", threshold: 50 },
  high: { label: "高风险", color: "#ea4335", threshold: 80 },
  critical: { label: "极高风险", color: "#9c27b0", threshold: 100 },
} as const;

// 健康建议类型
export interface HealthSuggestion {
  title: string;
  content: string;
}

// 评估表单数据类型
export interface AssessmentFormData {
  // 个人信息
  pilotName: string;
  pilotCode: string;
  gender: "male" | "female";
  age: number;
  
  // 职业特征
  flightDuration: number;
  annualFlightHours: number;
  aircraftType: string;
  altitudeRatio: number;
  timezoneFlights: number;
  cockpitTemp: number;
  diversions: number;
  saltIntake: "low" | "medium" | "high";
  
  // 代谢指标
  metabolicData: MetabolicData;
  
  // 健康指标
  healthData: HealthData;
}

// 风险评估结果类型
export interface RiskAssessmentResult {
  flightRisk: number;
  metabolicRisk: number;
  healthRisk: number;
  overallRisk: number;
  riskLevel: RiskLevel;
  suggestions: HealthSuggestion[];
}

// 默认代谢指标数据
export const defaultMetabolicData: MetabolicData = {
  serumOxalate: 40,
  serumOxalateUndone: false,
  crp: 1.0,
  crpUndone: false,
  lipoprotein: 20,
  lipoproteinUndone: false,
  calcium: null,
  calciumUndone: true,
  phosphorus: null,
  phosphorusUndone: true,
  urineGravity: null,
  urineGravityUndone: false,
  urinePH: null,
  urinePHUndone: true, // 初始勾选未做
  creatinine: null,
  creatinineUndone: false,
  urea: null,
  ureaUndone: false,
  uricAcid: null,
  uricAcidUndone: false,
  alt: null,
  altUndone: false,
  fastingGlucose: null,
  fastingGlucoseUndone: false,
  hba1c: null,
  hba1cUndone: false,
  pth: null,
  pthUndone: true,
  calcitonin: null,
  calcitoninUndone: true,
  totalCholesterol: null,
  totalCholesterolUndone: false,
  cholesterol: null,
  cholesterolUndone: false,
  hdl: null,
  hdlUndone: false,
  ldl: null,
  ldlUndone: false,
  triglycerides: null,
  triglyceridesUndone: true,
};

// 默认健康指标数据
export const defaultHealthData: HealthData = {
  bodyFat: null,
  bodyFatUndone: false,
  height: null,
  weight: null,
  waist: null,
  waistUndone: false,
  hip: null,
  hipUndone: false,
  systolic: null,
  diastolic: null,
  dvt: false,
  hydrationFrequency: 3,
  radiationExposure: 50,
  waterIntake: 2000,
  exerciseTime: 50,
  workStress: 50,
  sleepQuality: 50,
  mentalState: 50,
};
