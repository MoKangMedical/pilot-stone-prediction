// Application constants

export const APP_NAME = "飞行员肾结石风险评估系统"
export const APP_VERSION = "1.0.0"

export function getLoginUrl(): string {
  return "/api/auth/login"
}

export const RISK_LEVELS = {
  low: { label: "低风险", color: "#22c55e", threshold: 0.2 },
  moderate: { label: "中等风险", color: "#f59e0b", threshold: 0.5 },
  high: { label: "高风险", color: "#f97316", threshold: 0.8 },
  very_high: { label: "极高风险", color: "#ef4444", threshold: 1.0 },
} as const

export const METABOLIC_REFERENCE_RANGES = {
  uricAcid: { min: 2.5, max: 7.0, unit: "mg/dL", label: "尿酸" },
  calcium: { min: 8.5, max: 10.5, unit: "mg/dL", label: "钙" },
  phosphorus: { min: 2.5, max: 4.5, unit: "mg/dL", label: "磷" },
  creatinine: { min: 0.7, max: 1.3, unit: "mg/dL", label: "肌酐" },
  bun: { min: 7, max: 20, unit: "mg/dL", label: "尿素" },
  alt: { min: 7, max: 56, unit: "U/L", label: "ALT" },
  glucose: { min: 70, max: 100, unit: "mg/dL", label: "空腹血糖" },
  hba1c: { min: 4.0, max: 5.6, unit: "%", label: "糖化血红蛋白" },
  cholesterol: { min: 0, max: 200, unit: "mg/dL", label: "总胆固醇" },
  ldl: { min: 0, max: 100, unit: "mg/dL", label: "LDL" },
  hdl: { min: 40, max: 60, unit: "mg/dL", label: "HDL" },
  triglycerides: { min: 0, max: 150, unit: "mg/dL", label: "甘油三酯" },
} as const
