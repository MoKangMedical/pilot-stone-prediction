/**
 * 预估值和推荐区间定义
 * 用于表单字段的默认值和输入提示
 */

export const FLIGHT_DEFAULTS = {
  flightDuration: {
    estimate: 3.5,
    min: 0.5,
    max: 12,
    unit: "小时/天",
    description: "平均每天飞行时长",
  },
  annualFlightHours: {
    estimate: 600,
    min: 0,
    max: 1500,
    unit: "小时/年",
    description: "年度飞行总时长",
  },
  altitudeRatio: {
    estimate: 70,
    min: 0,
    max: 100,
    unit: "%",
    description: "高空巡航占比（>10000米）",
  },
  timezoneFlights: {
    estimate: 5,
    min: 0,
    max: 50,
    unit: "次/年",
    description: "跨时区飞行次数",
  },
  cockpitTemp: {
    estimate: 24,
    min: 15,
    max: 35,
    unit: "°C",
    description: "驾驶舱平均温度",
  },
  diversions: {
    estimate: 1,
    min: 0,
    max: 20,
    unit: "次/年",
    description: "应急备降次数",
  },
};

export const METABOLIC_DEFAULTS = {
  serumOxalate: {
    estimate: 45,
    min: 20,
    max: 80,
    unit: "μmol/L",
    description: "血清草酸盐浓度",
    normalRange: "20-50 μmol/L",
  },
  crp: {
    estimate: 1.5,
    min: 0,
    max: 10,
    unit: "mg/L",
    description: "超敏C反应蛋白",
    normalRange: "<3 mg/L",
  },
  lipoprotein: {
    estimate: 25,
    min: 0,
    max: 100,
    unit: "mg/dL",
    description: "脂蛋白(a)浓度",
    normalRange: "<30 mg/dL",
  },
  calcium: {
    estimate: 2.3,
    min: 1.8,
    max: 2.8,
    unit: "mmol/L",
    description: "血清钙浓度",
    normalRange: "2.1-2.6 mmol/L",
  },
  phosphorus: {
    estimate: 1.2,
    min: 0.8,
    max: 1.6,
    unit: "mmol/L",
    description: "血清磷浓度",
    normalRange: "0.85-1.45 mmol/L",
  },
  urineGravity: {
    estimate: 1.015,
    min: 1.005,
    max: 1.030,
    unit: "g/mL",
    description: "尿液相对密度",
    normalRange: "1.010-1.025 g/mL",
  },
  urinePH: {
    estimate: 6.5,
    min: 4.5,
    max: 8.5,
    unit: "pH",
    description: "尿液pH值",
    normalRange: "6.0-7.0 pH",
  },
  creatinine: {
    estimate: 80,
    min: 50,
    max: 120,
    unit: "μmol/L",
    description: "血清肌酐",
    normalRange: "60-110 μmol/L",
  },
  urea: {
    estimate: 5.5,
    min: 2.5,
    max: 8.0,
    unit: "mmol/L",
    description: "血清尿素氮",
    normalRange: "2.5-7.1 mmol/L",
  },
  uricAcid: {
    estimate: 350,
    min: 150,
    max: 450,
    unit: "μmol/L",
    description: "血清尿酸",
    normalRange: "男性: 200-430 μmol/L",
  },
  alt: {
    estimate: 25,
    min: 5,
    max: 50,
    unit: "U/L",
    description: "丙氨酸转氨酶(ALT)",
    normalRange: "<40 U/L",
  },
  fastingGlucose: {
    estimate: 5.2,
    min: 3.9,
    max: 6.1,
    unit: "mmol/L",
    description: "空腹血糖",
    normalRange: "3.9-6.1 mmol/L",
  },
  hba1c: {
    estimate: 5.5,
    min: 4.0,
    max: 6.5,
    unit: "%",
    description: "糖化血红蛋白(HbA1c)",
    normalRange: "<5.7%",
  },
  pth: {
    estimate: 45,
    min: 15,
    max: 65,
    unit: "pg/mL",
    description: "甲状旁腺激素(PTH)",
    normalRange: "15-65 pg/mL",
  },
  calcitonin: {
    estimate: 5,
    min: 0,
    max: 20,
    unit: "pg/mL",
    description: "降钙素",
    normalRange: "<10 pg/mL",
  },
  totalCholesterol: {
    estimate: 4.5,
    min: 2.0,
    max: 6.0,
    unit: "mmol/L",
    description: "总胆固醇",
    normalRange: "<5.2 mmol/L",
  },
  cholesterol: {
    estimate: 4.5,
    min: 2.0,
    max: 6.0,
    unit: "mmol/L",
    description: "胆固醇",
    normalRange: "<5.2 mmol/L",
  },
  hdl: {
    estimate: 1.3,
    min: 0.9,
    max: 2.0,
    unit: "mmol/L",
    description: "高密度脂蛋白(HDL)",
    normalRange: ">1.0 mmol/L",
  },
  ldl: {
    estimate: 2.5,
    min: 0.0,
    max: 4.0,
    unit: "mmol/L",
    description: "低密度脂蛋白(LDL)",
    normalRange: "<3.4 mmol/L",
  },
  triglycerides: {
    estimate: 1.2,
    min: 0.0,
    max: 2.3,
    unit: "mmol/L",
    description: "甘油三酯",
    normalRange: "<1.7 mmol/L",
  },
};

export const HEALTH_DEFAULTS = {
  bodyFat: {
    estimate: 22,
    min: 5,
    max: 40,
    unit: "%",
    description: "体脂率",
    normalRange: "男性: 10-20%",
  },
  height: {
    estimate: 175,
    min: 150,
    max: 200,
    unit: "cm",
    description: "身高",
  },
  weight: {
    estimate: 70,
    min: 40,
    max: 150,
    unit: "kg",
    description: "体重",
  },
  waist: {
    estimate: 85,
    min: 60,
    max: 120,
    unit: "cm",
    description: "腰围",
    normalRange: "男性: <90 cm",
  },
  hip: {
    estimate: 95,
    min: 75,
    max: 130,
    unit: "cm",
    description: "臀围",
  },
  systolic: {
    estimate: 120,
    min: 90,
    max: 180,
    unit: "mmHg",
    description: "收缩压",
    normalRange: "<120 mmHg",
  },
  diastolic: {
    estimate: 80,
    min: 60,
    max: 110,
    unit: "mmHg",
    description: "舒张压",
    normalRange: "<80 mmHg",
  },
  hydrationFrequency: {
    estimate: 4,
    min: 1,
    max: 10,
    unit: "次/天",
    description: "补水频率",
  },
  radiationExposure: {
    estimate: 30,
    min: 0,
    max: 100,
    unit: "mSv/年",
    description: "年度辐射暴露",
  },
  waterIntake: {
    estimate: 2500,
    min: 1000,
    max: 5000,
    unit: "mL/天",
    description: "日均饮水量",
    normalRange: "2000-3000 mL/天",
  },
  exerciseTime: {
    estimate: 60,
    min: 0,
    max: 300,
    unit: "分钟/天",
    description: "日均运动时间",
    normalRange: "≥150 分钟/周",
  },
  workStress: {
    estimate: 40,
    min: 0,
    max: 100,
    unit: "分",
    description: "工作压力评分",
  },
  sleepQuality: {
    estimate: 70,
    min: 0,
    max: 100,
    unit: "分",
    description: "睡眠质量评分",
  },
  mentalState: {
    estimate: 75,
    min: 0,
    max: 100,
    unit: "分",
    description: "心理状态评分",
  },
};

/**
 * 根据数值获取风险等级和颜色
 */
export function getValueRiskLevel(value: number, type: "metabolic" | "health"): {
  level: "low" | "medium" | "high";
  color: string;
  description: string;
} {
  if (type === "metabolic") {
    if (value < 30) return { level: "low", color: "#10b981", description: "低风险" };
    if (value < 60) return { level: "medium", color: "#f59e0b", description: "中等风险" };
    return { level: "high", color: "#ef4444", description: "高风险" };
  }

  if (value < 40) return { level: "low", color: "#10b981", description: "低风险" };
  if (value < 70) return { level: "medium", color: "#f59e0b", description: "中等风险" };
  return { level: "high", color: "#ef4444", description: "高风险" };
}
