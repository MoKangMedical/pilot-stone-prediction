// Client-side risk calculation utilities

import { type MetabolicData, type HealthData, type RiskLevel, RISK_LEVEL_CONFIG } from "@shared/assessment";

export interface RiskResult {
  flightRisk: number;
  metabolicRisk: number;
  healthRisk: number;
  overallRisk: number;
  riskLevel: RiskLevel;
  suggestions: { title: string; content: string }[];
}

interface AssessmentInput {
  gender: string;
  flightDuration: number;
  annualFlightHours: number;
  altitudeRatio: number;
  timezoneFlights: number;
  cockpitTemp: number;
  diversions: number;
  saltIntake: string;
  metabolicData: MetabolicData;
  healthData: HealthData;
}

function normalizeValue(value: number, min: number, max: number): number {
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}

function calculateFlightRisk(input: AssessmentInput): number {
  const factors = [
    normalizeValue(input.flightDuration, 0, 12),
    normalizeValue(input.annualFlightHours, 0, 1500),
    normalizeValue(input.altitudeRatio, 0, 1),
    normalizeValue(input.timezoneFlights, 0, 20),
    normalizeValue(input.cockpitTemp, 15, 35),
    normalizeValue(input.diversions, 0, 10),
    input.saltIntake === "high" ? 0.8 : input.saltIntake === "medium" ? 0.5 : 0.2,
  ];
  return factors.reduce((a, b) => a + b, 0) / factors.length;
}

function calculateMetabolicRisk(data: MetabolicData): number {
  let riskSum = 0;
  let count = 0;

  const addRisk = (value: number | null, min: number, max: number, weight: number = 1) => {
    if (value !== null) {
      riskSum += normalizeValue(value, min, max) * weight;
      count += weight;
    }
  };

  addRisk(data.uricAcid, 2.5, 10);
  addRisk(data.creatinine, 0.5, 2.0);
  addRisk(data.fastingGlucose, 60, 150);
  addRisk(data.totalCholesterol, 100, 300);
  addRisk(data.ldl, 50, 200);
  addRisk(data.triglycerides, 50, 300);

  return count > 0 ? riskSum / count : 0.3;
}

function calculateHealthRisk(data: HealthData): number {
  let riskSum = 0;
  let count = 0;

  if (data.bodyFat !== null) {
    riskSum += normalizeValue(data.bodyFat, 10, 40);
    count++;
  }
  if (data.systolic !== null) {
    riskSum += normalizeValue(data.systolic, 90, 180);
    count++;
  }
  if (data.waterIntake !== undefined) {
    riskSum += 1 - normalizeValue(data.waterIntake, 500, 3000);
    count++;
  }
  if (data.exerciseTime !== undefined) {
    riskSum += 1 - normalizeValue(data.exerciseTime, 0, 300);
    count++;
  }
  if (data.workStress !== undefined) {
    riskSum += normalizeValue(data.workStress, 0, 100);
    count++;
  }
  if (data.dvt) {
    riskSum += 0.8;
    count++;
  }

  return count > 0 ? riskSum / count : 0.3;
}

function getRiskLevel(risk: number): RiskLevel {
  if (risk >= 0.8) return "critical";
  if (risk >= 0.5) return "high";
  if (risk >= 0.2) return "medium";
  return "low";
}

function generateSuggestions(input: AssessmentInput, result: RiskResult): { title: string; content: string }[] {
  const suggestions: { title: string; content: string }[] = [];

  if (input.healthData.waterIntake < 2000) {
    suggestions.push({
      title: "增加每日饮水量",
      content: "建议每日饮水量达到2000-3000ml，有助于稀释尿液，降低结石形成风险。"
    });
  }

  if (input.altitudeRatio > 0.5) {
    suggestions.push({
      title: "注意高空脱水预防",
      content: "高空飞行时空气干燥，建议增加饮水频率，每小时至少饮水200ml。"
    });
  }

  if (input.saltIntake === "high") {
    suggestions.push({
      title: "控制盐分摄入",
      content: "高盐饮食会增加尿钙排泄，建议每日盐分摄入不超过6g。"
    });
  }

  if (input.healthData.exerciseTime < 150) {
    suggestions.push({
      title: "增加运动量",
      content: "建议每周运动时间不少于150分钟，有助于改善代谢，降低结石风险。"
    });
  }

  if (result.metabolicRisk > 0.5) {
    suggestions.push({
      title: "定期检查代谢指标",
      content: "您的代谢指标存在异常风险，建议每3-6个月进行一次全面体检。"
    });
  }

  if (result.flightRisk > 0.5) {
    suggestions.push({
      title: "优化飞行工作习惯",
      content: "建议在飞行间隙充分休息，保持规律作息，避免长时间连续飞行。"
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      title: "保持良好生活习惯",
      content: "您的各项指标良好，建议继续保持健康的生活方式，定期体检。"
    });
  }

  return suggestions;
}

export function performRiskAssessment(input: AssessmentInput): RiskResult {
  const flightRisk = calculateFlightRisk(input);
  const metabolicRisk = calculateMetabolicRisk(input.metabolicData);
  const healthRisk = calculateHealthRisk(input.healthData);
  const overallRisk = (flightRisk + metabolicRisk + healthRisk) / 3;
  const riskLevel = getRiskLevel(overallRisk);

  const result: RiskResult = {
    flightRisk,
    metabolicRisk,
    healthRisk,
    overallRisk,
    riskLevel,
    suggestions: [],
  };

  result.suggestions = generateSuggestions(input, result);

  return result;
}
