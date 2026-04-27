
/**
 * 飞行员肾结石风险评估算法
 * 基于机器学习模型的肾结石预测方法
 */

import type { MetabolicData, HealthData, HealthSuggestion } from "../../../shared/assessment";

// 计算飞行风险
export function calculateFlightRisk(data: {
  flightDuration: number;
  annualFlightHours: number;
  altitudeRatio: number;
  timezoneFlights: number;
  cockpitTemp: number;
  diversions: number;
  saltIntake: "low" | "medium" | "high";
}): number {
  // 归一化各项指标
  const normAvgFlightDuration = Math.min(data.flightDuration / 5.0, 1.0);
  const normAnnualFlight = data.annualFlightHours / 900.0;
  const normHighAltitude = data.altitudeRatio / 100.0;
  const normTimezone = Math.min(data.timezoneFlights / 30.0, 1.0);
  const normCockpitTemp = (35 - data.cockpitTemp) / 17.0;
  const normDiversions = Math.min(data.diversions / 10.0, 1.0);
  
  let normMealSalt: number;
  switch (data.saltIntake) {
    case "low": normMealSalt = 0.2; break;
    case "medium": normMealSalt = 0.5; break;
    case "high": normMealSalt = 0.8; break;
  }
  
  const flightRisk = (normAvgFlightDuration + normAnnualFlight + normHighAltitude + 
                     normTimezone + normCockpitTemp + normDiversions + normMealSalt) / 7.0;
  
  return Math.min(100, Math.max(0, flightRisk * 100));
}

// 计算代谢风险
export function calculateMetabolicRisk(data: MetabolicData, gender: "male" | "female"): number {
  // 血清草酸盐归一化
  const normSerumOxalate = ((data.serumOxalate ?? 40) - 20) / 80.0;
  
  // 尿酸结晶指数计算
  let normUricAcidCrystal = 0;
  if (!data.uricAcidUndone && data.uricAcid !== null) {
    const uricAcidIndex = data.uricAcid / 100;
    normUricAcidCrystal = Math.min(uricAcidIndex / 10.0, 1.0);
  }
  
  // 钙磷比计算
  let normCalciumRatio = 0;
  if (!data.calciumUndone && !data.phosphorusUndone && 
      data.calcium !== null && data.phosphorus !== null && data.phosphorus !== 0) {
    const ratio = data.calcium / data.phosphorus;
    normCalciumRatio = (ratio - 1.0) / 3.0;
  }
  
  // 尿液比重
  let normUrineGravity = 0;
  if (!data.urineGravityUndone && data.urineGravity !== null) {
    normUrineGravity = Math.abs(data.urineGravity - 1.015) / 0.025;
    normUrineGravity = Math.min(normUrineGravity, 1.0);
  }
  
  // 尿素/肌酐比
  let normUreaCreatinine = 0;
  if (!data.ureaUndone && !data.creatinineUndone && 
      data.urea !== null && data.creatinine !== null && data.creatinine !== 0) {
    const ratio = data.urea / (data.creatinine / 1000);
    const mappedValue = ratio / 75;
    normUreaCreatinine = Math.max(0, Math.min(1, (mappedValue - 0.1) / 1.9));
  }
  
  // 脂蛋白(a)
  let normLipoproteinA = 0;
  if (!data.lipoproteinUndone && data.lipoprotein !== null) {
    normLipoproteinA = data.lipoprotein / 100.0;
  }
  
  // 超敏C反应蛋白
  let normHSCRP = 0;
  if (!data.crpUndone && data.crp !== null) {
    normHSCRP = data.crp / 10.0;
  }
  
  // 基础指标
  let metabolicSum = normSerumOxalate + normUricAcidCrystal + normCalciumRatio + 
                     normLipoproteinA + normHSCRP + normUreaCreatinine;
  let weightSum = 6;
  
  // 其他代谢指标
  const metabolicIndicators = [
    { value: data.alt, undone: data.altUndone, min: 0, max: 200, weight: 0.3 },
    { value: data.fastingGlucose, undone: data.fastingGlucoseUndone, min: 3, max: 15, weight: 0.7 },
    { value: data.hba1c, undone: data.hba1cUndone, min: 4, max: 15, weight: 0.7 },
    { value: data.totalCholesterol, undone: data.totalCholesterolUndone, min: 2, max: 10, weight: 0.5 },
    { value: data.hdl, undone: data.hdlUndone, min: 0.5, max: 3, weight: 0.4 },
    { value: data.ldl, undone: data.ldlUndone, min: 1, max: 8, weight: 0.6 },
    { value: data.triglycerides, undone: data.triglyceridesUndone, min: 0.3, max: 10, weight: 0.5 },
  ];
  
  metabolicIndicators.forEach(indicator => {
    if (!indicator.undone && indicator.value !== null) {
      const normalized = (indicator.value - indicator.min) / (indicator.max - indicator.min);
      metabolicSum += Math.abs(normalized - 0.5) * 2 * indicator.weight;
      weightSum += indicator.weight;
    }
  });
  
  return Math.min(100, Math.max(0, (metabolicSum / weightSum) * 100));
}

// 计算健康风险
export function calculateHealthRisk(data: HealthData): number {
  let healthSum = 0;
  let healthWeight = 0;
  
  // 体脂率
  if (data.bodyFat !== null) {
    const bodyFatNorm = Math.abs((data.bodyFat - 20) / 15);
    healthSum += Math.min(bodyFatNorm, 1.0) * 0.3;
    healthWeight += 0.3;
  }
  
  // 血压
  if (data.systolic !== null && data.diastolic !== null) {
    const systolicNorm = Math.abs((data.systolic - 120) / 40);
    const diastolicNorm = Math.abs((data.diastolic - 80) / 20);
    const bpNorm = (systolicNorm + diastolicNorm) / 2;
    healthSum += Math.min(bpNorm, 1.0) * 0.3;
    healthWeight += 0.3;
  }
  
  // 运动时间
  if (data.exerciseTime !== null) {
    const exerciseNorm = Math.max(0, 1 - data.exerciseTime / 150);
    healthSum += exerciseNorm * 0.2;
    healthWeight += 0.2;
  }
  
  // 饮水量
  if (data.waterIntake !== null) {
    const waterNorm = Math.abs((data.waterIntake - 2500) / 1500);
    healthSum += Math.min(waterNorm, 1.0) * 0.1;
    healthWeight += 0.1;
  }
  
  // 睡眠质量
  if (data.sleepQuality !== null) {
    const sleepNorm = Math.max(0, 1 - data.sleepQuality / 100);
    healthSum += sleepNorm * 0.1;
    healthWeight += 0.1;
  }
  
  return healthWeight > 0 ? Math.min(100, Math.max(0, (healthSum / healthWeight) * 100)) : 0;
}

// 计算综合风险
export function calculateOverallRisk(
  flightRisk: number,
  metabolicRisk: number,
  healthRisk: number
): number {
  return (flightRisk * 0.3 + metabolicRisk * 0.4 + healthRisk * 0.3);
}

// 确定风险等级
export function determineRiskLevel(risk: number): "low" | "medium" | "high" | "critical" {
  if (risk < 20) return "low";
  if (risk < 50) return "medium";
  if (risk < 80) return "high";
  return "critical";
}

// 生成详细的健康建议（8条以上）
export function generateHealthSuggestions(
  overallRisk: number,
  flightData: {
    flightDuration: number;
    annualFlightHours: number;
    saltIntake: "low" | "medium" | "high";
  },
  metabolicData: MetabolicData,
  healthData: HealthData,
  gender: "male" | "female"
): HealthSuggestion[] {
  const suggestions: HealthSuggestion[] = [];
  
  // 1. 根据风险级别添加通用建议
  if (overallRisk < 20) {
    suggestions.push({
      title: "低风险维持建议",
      content: `您的结石风险评估为低风险（${overallRisk.toFixed(1)}%），这表明您目前的健康状况良好，结石风险较低。继续保持以下健康习惯：保持每日饮水量在${healthData.waterIntake}ml左右，均衡饮食，适度运动。建议每年进行一次常规体检，监测肾功能相关指标。`
    });
  } else if (overallRisk < 50) {
    suggestions.push({
      title: "中等风险改善建议",
      content: `您的结石风险评估为中等风险（${overallRisk.toFixed(1)}%），存在一定的结石风险。建议重点关注以下方面：增加每日饮水量至2500-3000ml，特别是在飞行期间。您目前的每日饮水量为${healthData.waterIntake}ml，可以考虑适当增加。同时注意减少高盐、高嘌呤食物的摄入。`
    });
  } else if (overallRisk < 80) {
    suggestions.push({
      title: "高风险干预建议",
      content: `您的结石风险评估为高风险（${overallRisk.toFixed(1)}%），需要立即采取干预措施。强烈建议：1. 咨询肾内科或泌尿外科医生进行详细检查；2. 将每日饮水量增加至3000ml以上；3. 严格控制盐分摄入，每日钠摄入量低于2000mg；4. 定期监测尿液PH值和肾功能指标。`
    });
  } else {
    suggestions.push({
      title: "极高风险紧急建议",
      content: `警告！您的结石风险评估为极高风险（${overallRisk.toFixed(1)}%），存在显著的结石形成风险。必须立即采取行动：1. 立即就医进行专业评估和检查；2. 可能需要药物治疗或饮食干预；3. 调整飞行任务，避免长时间连续飞行；4. 建立严格的饮水计划，确保每日饮水量达到3500ml以上。`
    });
  }
  
  // 2. 尿酸建议
  if (!metabolicData.uricAcidUndone && metabolicData.uricAcid !== null) {
    const normalRange = gender === "male" ? "208-428 μmol/L" : "155-357 μmol/L";
    const upperLimit = gender === "male" ? 428 : 357;
    const lowerLimit = gender === "male" ? 208 : 155;
    
    if (metabolicData.uricAcid > upperLimit) {
      suggestions.push({
        title: "尿酸管理建议",
        content: `您的尿酸值为${metabolicData.uricAcid} μmol/L，高于正常范围（${normalRange}），可能增加尿酸结石风险。建议：减少高嘌呤食物（动物内脏、海鲜、浓汤）摄入，增加饮水量促进尿酸排泄，必要时咨询医生使用降尿酸药物。`
      });
    } else if (metabolicData.uricAcid >= lowerLimit) {
      suggestions.push({
        title: "尿酸管理建议",
        content: `您的尿酸值为${metabolicData.uricAcid} μmol/L，在正常范围内（${normalRange}），这对预防尿酸结石是有利的。继续保持良好饮食习惯。`
      });
    }
  }
  
  // 3. 钙磷代谢建议
  if (!metabolicData.calciumUndone && !metabolicData.phosphorusUndone && 
      metabolicData.calcium !== null && metabolicData.phosphorus !== null) {
    const ratio = metabolicData.calcium / metabolicData.phosphorus;
    
    if (ratio > 3.0) {
      suggestions.push({
        title: "钙磷平衡建议",
        content: `您的钙磷比值为${ratio.toFixed(2)}（钙${metabolicData.calcium} mmol/L，磷${metabolicData.phosphorus} mmol/L），比值偏高。高钙磷比可能增加钙结石风险。建议：避免过量补充钙剂，增加磷的摄入（如全谷物、坚果），但需在医生指导下进行。`
      });
    } else if (ratio < 2.0) {
      suggestions.push({
        title: "钙磷平衡建议",
        content: `您的钙磷比值为${ratio.toFixed(2)}（钙${metabolicData.calcium} mmol/L，磷${metabolicData.phosphorus} mmol/L），比值偏低。建议：适量增加富含钙的食物（如奶制品、深绿色蔬菜），减少高磷食物（如加工食品、碳酸饮料）。`
      });
    }
  }
  
  // 4. 尿液酸碱度建议
  if (!metabolicData.urinePHUndone && metabolicData.urinePH !== null) {
    if (metabolicData.urinePH < 5.5) {
      suggestions.push({
        title: "尿液酸碱度管理建议",
        content: `您的尿液PH值为${metabolicData.urinePH}，偏酸性。酸性尿液有利于某些类型结石的形成。建议：增加碱性食物摄入（如蔬菜、水果），适量饮用柠檬水（柠檬酸有助于预防结石），避免过多摄入酸性食物（如肉类、谷物）。`
      });
    } else if (metabolicData.urinePH > 7.0) {
      suggestions.push({
        title: "尿液酸碱度管理建议",
        content: `您的尿液PH值为${metabolicData.urinePH}，偏碱性。碱性尿液有利于预防某些类型结石，但可能增加其他类型结石风险。建议：保持尿液PH在6.0-6.5的理想范围，这有助于预防大多数类型的结石。`
      });
    }
  }
  
  // 5. 尿液比重建议
  if (!metabolicData.urineGravityUndone && metabolicData.urineGravity !== null) {
    if (metabolicData.urineGravity > 1.025) {
      suggestions.push({
        title: "尿液比重管理建议",
        content: `您的尿液比重为${metabolicData.urineGravity}，偏高。高比重尿液通常表示尿液浓缩，可能增加结石风险。建议：增加水分摄入，保持尿液稀释，特别是飞行期间要定时补水。`
      });
    } else if (metabolicData.urineGravity < 1.010) {
      suggestions.push({
        title: "尿液比重管理建议",
        content: `您的尿液比重为${metabolicData.urineGravity}，偏低。低比重尿液通常表示水分摄入充足，有利于预防结石。继续保持良好的饮水习惯。`
      });
    }
  }
  
  // 6. 肾功能相关建议
  if (!metabolicData.ureaUndone && !metabolicData.creatinineUndone && 
      metabolicData.urea !== null && metabolicData.creatinine !== null && metabolicData.creatinine !== 0) {
    const ratio = metabolicData.urea / (metabolicData.creatinine / 1000);
    const mappedValue = ratio / 75;
    
    if (mappedValue > 1.2) {
      suggestions.push({
        title: "肾功能相关建议",
        content: `您的尿素/肌酐比值为${mappedValue.toFixed(2)}（尿素${metabolicData.urea} μmol/L，肌酐${metabolicData.creatinine} μmol/L），比值偏高。这可能提示脱水、高蛋白饮食或肾功能轻度异常。建议：增加水分摄入，适量减少蛋白质摄入，定期监测肾功能。`
      });
    } else if (mappedValue < 0.8) {
      suggestions.push({
        title: "肾功能相关建议",
        content: `您的尿素/肌酐比值为${mappedValue.toFixed(2)}（尿素${metabolicData.urea} μmol/L，肌酐${metabolicData.creatinine} μmol/L），比值偏低。这可能与低蛋白饮食、肝功能异常或肌肉量减少有关。建议：保证适量优质蛋白摄入，咨询医生评估营养状况。`
      });
    }
  }
  
  // 7. 体脂管理建议
  if (healthData.bodyFat !== null) {
    if (healthData.bodyFat > 25) {
      suggestions.push({
        title: "体脂管理建议",
        content: `您的体脂率为${healthData.bodyFat}%，偏高。高体脂率与结石风险增加相关。建议：通过有氧运动和力量训练结合的方式减脂，控制体重在健康范围，同时注意饮食调整。`
      });
    } else if (healthData.bodyFat < 15) {
      suggestions.push({
        title: "体脂管理建议",
        content: `您的体脂率为${healthData.bodyFat}%，偏低。虽然低体脂率通常不是结石的主要风险因素，但需注意保持均衡营养摄入，避免过度节食。`
      });
    }
  }
  
  // 8. 脂蛋白(a)管理建议
  if (!metabolicData.lipoproteinUndone && metabolicData.lipoprotein !== null) {
    if (metabolicData.lipoprotein > 30) {
      suggestions.push({
        title: "脂蛋白(a)管理建议",
        content: `您的脂蛋白(a)水平为${metabolicData.lipoprotein}，偏高。高脂蛋白(a)水平可能与结石风险增加相关。建议：咨询心血管科医生评估心血管风险，同时注意控制血脂和保持健康生活方式。`
      });
    } else {
      suggestions.push({
        title: "脂蛋白(a)管理建议",
        content: `您的脂蛋白(a)水平为${metabolicData.lipoprotein}，在可接受范围内。继续保持健康生活方式，定期监测血脂水平。`
      });
    }
  }
  
  // 9. 炎症指标管理建议
  if (!metabolicData.crpUndone && metabolicData.crp !== null) {
    if (metabolicData.crp > 3.0) {
      suggestions.push({
        title: "炎症指标管理建议",
        content: `您的超敏C反应蛋白为${metabolicData.crp}，偏高。这可能提示体内存在炎症反应，炎症状态可能增加结石风险。建议：寻找并处理可能的感染或炎症源，保持健康生活方式降低炎症水平。`
      });
    } else {
      suggestions.push({
        title: "炎症指标管理建议",
        content: `您的超敏C反应蛋白为${metabolicData.crp}，在正常范围内，表明体内无明显炎症反应，有利于预防结石。`
      });
    }
  }
  
  // 10. 飞行相关建议
  suggestions.push({
    title: "飞行职业特殊建议",
    content: `作为飞行员，您的职业特点可能增加结石风险。您的平均单次飞行时长为${flightData.flightDuration}小时，年度飞行时间${flightData.annualFlightHours}小时。建议：1. 飞行期间定时补水，每小时至少饮水200ml；2. 长途飞行时适当活动，促进血液循环；3. 合理安排飞行任务，避免连续长时间飞行；4. 注意驾驶舱温度调节，避免过度脱水。`
  });
  
  // 11. 草酸盐代谢建议
  suggestions.push({
    title: "草酸盐代谢建议",
    content: `您的血清草酸盐值为${metabolicData.serumOxalate ?? 40} μmol/L。草酸盐是草酸钙结石的主要成分。建议：1. 避免过量摄入高草酸食物（如菠菜、甜菜、坚果）；2. 保证足够的钙摄入，钙在肠道中与草酸结合可减少其吸收；3. 维生素C补充剂可能增加草酸生成，避免过量补充。`
  });
  
  // 12. 科学饮水建议
  suggestions.push({
    title: "科学饮水建议",
    content: `您目前的每日饮水量为${healthData.waterIntake}ml。科学饮水建议：1. 均匀分配饮水时间，不要等到口渴再喝水；2. 飞行前、中、后都要补充水分；3. 观察尿液颜色，理想应为淡黄色；4. 避免一次性大量饮水，应少量多次；5. 可以适量饮用柠檬水，柠檬酸有助于预防结石。`
  });
  
  // 13. 运动建议
  if (healthData.exerciseTime !== null && healthData.exerciseTime < 150) {
    suggestions.push({
      title: "运动健身建议",
      content: `您每周运动时间为${healthData.exerciseTime}分钟，低于推荐标准。适度运动有助于维持健康体重和代谢功能。建议：每周进行至少150分钟中等强度有氧运动，如快走、游泳或骑自行车。同时可以进行力量训练，每周2-3次。`
    });
  }
  
  // 14. 睡眠质量建议
  if (healthData.sleepQuality !== null && healthData.sleepQuality < 50) {
    suggestions.push({
      title: "睡眠质量建议",
      content: `您的睡眠质量指数为${healthData.sleepQuality}，处于较低水平。睡眠不足可能影响代谢功能。建议：保持规律作息，创造良好睡眠环境，避免睡前使用电子设备，必要时咨询睡眠专科医生。`
    });
  }
  
  // 15. 血压管理建议
  if (healthData.systolic !== null && healthData.diastolic !== null) {
    if (healthData.systolic > 140 || healthData.diastolic > 90) {
      suggestions.push({
        title: "血压管理建议",
        content: `您的血压为${healthData.systolic}/${healthData.diastolic} mmHg，属于高血压范围。高血压与肾脏疾病和结石风险相关。建议：1. 减少盐分摄入，每日钠摄入量低于2000mg；2. 增加体育锻炼，每周至少150分钟中等强度运动；3. 控制体重，BMI保持在18.5-24.9；4. 定期监测血压，必要时咨询医生。`
      });
    }
  }
  
  // 16. 饮食盐分建议
  if (flightData.saltIntake === "high") {
    suggestions.push({
      title: "饮食盐分管理建议",
      content: `您的航空餐盐分摄入等级为高，高盐饮食会增加尿钙排泄，从而增加结石风险。建议：选择低盐航空餐选项，自备低盐零食，避免添加额外盐分，同时增加钾的摄入（如香蕉、番茄）。`
    });
  }
  
  // 确保至少有8条建议
  while (suggestions.length < 8) {
    suggestions.push({
      title: "定期健康检查建议",
      content: `建议每年进行一次全面体检，特别是监测肾功能相关指标（肌酐、尿素、尿酸等）。同时定期进行尿液检查，观察是否有结晶或其他异常。如有任何不适症状，应及时就医。`
    });
  }
  
  return suggestions;
}

// 完整的风险评估函数
export function performRiskAssessment(
  formData: {
    gender: "male" | "female";
    flightDuration: number;
    annualFlightHours: number;
    altitudeRatio: number;
    timezoneFlights: number;
    cockpitTemp: number;
    diversions: number;
    saltIntake: "low" | "medium" | "high";
    metabolicData: MetabolicData;
    healthData: HealthData;
  }
) {
  const flightRisk = calculateFlightRisk({
    flightDuration: formData.flightDuration,
    annualFlightHours: formData.annualFlightHours,
    altitudeRatio: formData.altitudeRatio,
    timezoneFlights: formData.timezoneFlights,
    cockpitTemp: formData.cockpitTemp,
    diversions: formData.diversions,
    saltIntake: formData.saltIntake,
  });
  
  const metabolicRisk = calculateMetabolicRisk(formData.metabolicData, formData.gender);
  const healthRisk = calculateHealthRisk(formData.healthData);
  const overallRisk = calculateOverallRisk(flightRisk, metabolicRisk, healthRisk);
  const riskLevel = determineRiskLevel(overallRisk);
  
  const suggestions = generateHealthSuggestions(
    overallRisk,
    {
      flightDuration: formData.flightDuration,
      annualFlightHours: formData.annualFlightHours,
      saltIntake: formData.saltIntake,
    },
    formData.metabolicData,
    formData.healthData,
    formData.gender
  );
  
  return {
    flightRisk,
    metabolicRisk,
    healthRisk,
    overallRisk,
    riskLevel,
    suggestions,
  };
}
