// Shared constants

export const RISK_LEVEL_CONFIG = {
  low: { label: "低风险", color: "#22c55e", min: 0, max: 0.2 },
  moderate: { label: "中等风险", color: "#f59e0b", min: 0.2, max: 0.5 },
  high: { label: "高风险", color: "#f97316", min: 0.5, max: 0.8 },
  very_high: { label: "极高风险", color: "#ef4444", min: 0.8, max: 1.0 },
} as const

export type RiskLevel = keyof typeof RISK_LEVEL_CONFIG

export function getRiskLevel(risk: number): RiskLevel {
  if (risk >= 0.8) return "very_high"
  if (risk >= 0.5) return "high"
  if (risk >= 0.2) return "moderate"
  return "low"
}

export const AIRCRAFT_TYPES = [
  "波音737", "波音747", "波音777", "波音787",
  "空客A320", "空客A330", "空客A340", "空客A350", "空客A380",
  "C919", "ARJ21", "其他"
] as const

export const SALT_INTAKE_LEVELS = [
  { value: 1, label: "低盐" },
  { value: 2, label: "中等盐分" },
  { value: 3, label: "高盐" },
  { value: 4, label: "极高盐分" },
] as const
