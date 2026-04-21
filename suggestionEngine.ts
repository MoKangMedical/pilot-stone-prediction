/**
 * 专属建议生成引擎
 * 根据具体的数值和风险因素生成个性化健康建议
 */

import type { AssessmentFormData } from "./assessment";

type AssessmentData = AssessmentFormData;

interface SuggestionItem {
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  category: "diet" | "lifestyle" | "medical" | "hydration" | "exercise" | "monitoring";
}

export function generatePersonalizedSuggestions(data: AssessmentData): SuggestionItem[] {
  const suggestions: SuggestionItem[] = [];

  // 分析飞行相关风险
  analyzeFlight(data, suggestions);

  // 分析代谢指标风险
  analyzeMetabolic(data, suggestions);

  // 分析健康指标风险
  analyzeHealth(data, suggestions);

  // 按优先级排序
  suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // 如果建议数量不足，添加默认建议
  if (suggestions.length < 8) {
    addDefaultSuggestions(data, suggestions, 8 - suggestions.length);
  }

  // 返回不少于8条的建议
  return suggestions.slice(0, Math.max(8, suggestions.length));
}

function analyzeFlight(data: AssessmentData, suggestions: SuggestionItem[]): void {

  // 高空巡航风险
  if (data.altitudeRatio > 80) {
    suggestions.push({
      title: "高空巡航风险提示",
      content: `您的高空巡航占比达到${data.altitudeRatio}%，长期高空飞行会导致脱水加重。建议在高空飞行期间每小时补水200-300ml，并在降落后进行充分补水恢复。`,
      priority: "high",
      category: "hydration",
    });
  }

  // 跨时区飞行风险
  if (data.timezoneFlights > 20) {
    suggestions.push({
      title: "跨时区飞行调理",
      content: `您年度跨时区飞行次数较多(${data.timezoneFlights}次)，易导致生物钟紊乱和代谢异常。建议：1)飞行前调整作息；2)到达目的地后适应当地时间；3)增加运动时间促进代谢调节。`,
      priority: "high",
      category: "lifestyle",
    });
  }

  // 应急备降风险
  if (data.diversions > 5) {
    suggestions.push({
      title: "应急备降压力管理",
      content: `您年度应急备降次数为${data.diversions}次，频繁的应急情况会增加心理压力和代谢负担。建议定期进行心理疏导和压力管理，必要时咨询心理医生。`,
      priority: "medium",
      category: "lifestyle",
    });
  }
}

function analyzeMetabolic(data: AssessmentData, suggestions: SuggestionItem[]): void {
  const metabolic = data.metabolicData;

  // 血清草酸盐风险 - 结石风险最直接的指标
  if (metabolic.serumOxalate && metabolic.serumOxalate > 60) {
    suggestions.push({
      title: "血清草酸盐升高 - 结石风险最高",
      content: `您的血清草酸盐浓度为${metabolic.serumOxalate}μmol/L，已超过正常范围。这是肾结石形成的关键因素。建议：1)立即增加饮水量至3000ml/天以上；2)减少高草酸食物摄入（菠菜、坚果等）；3)每3个月复查一次；4)咨询肾内科医生制定个性化预防方案。`,
      priority: "high",
      category: "diet",
    });
  } else if (metabolic.serumOxalate && metabolic.serumOxalate > 50) {
    suggestions.push({
      title: "血清草酸盐偏高",
      content: `您的血清草酸盐浓度为${metabolic.serumOxalate}μmol/L，处于偏高水平。建议增加饮水量至2500ml/天，减少高草酸食物，定期监测。`,
      priority: "high",
      category: "diet",
    });
  }

  // 尿酸风险
  if (metabolic.uricAcid && metabolic.uricAcid > 420) {
    suggestions.push({
      title: "血清尿酸升高",
      content: `您的血清尿酸为${metabolic.uricAcid}μmol/L，超过正常范围。高尿酸会增加尿酸结石风险。建议：1)减少高嘌呤食物（红肉、海鲜、啤酒）；2)增加水果蔬菜摄入；3)定期运动；4)必要时使用降尿酸药物。`,
      priority: "high",
      category: "diet",
    });
  }

  // 尿液密度风险
  if (metabolic.urineGravity && metabolic.urineGravity > 1.025) {
    suggestions.push({
      title: "尿液浓度过高",
      content: `您的尿液相对密度为${metabolic.urineGravity}g/mL，表示尿液浓度过高。这是结石形成的重要风险因素。建议每天饮水3000-4000ml，使尿液密度保持在1.010-1.020范围内。`,
      priority: "high",
      category: "hydration",
    });
  }

  // 尿液pH风险
  if (metabolic.urinePH && metabolic.urinePH < 5.5) {
    suggestions.push({
      title: "尿液过酸",
      content: `您的尿液pH值为${metabolic.urinePH}，尿液过酸易形成尿酸结石。建议：1)增加碱性食物摄入（蔬菜、水果）；2)减少酸性食物（肉类、谷物）；3)必要时使用碱化剂调节pH值。`,
      priority: "medium",
      category: "diet",
    });
  }

  // 钙磷代谢风险
  if (metabolic.calcium && metabolic.calcium > 2.6) {
    suggestions.push({
      title: "血清钙升高",
      content: `您的血清钙为${metabolic.calcium}mmol/L，偏高。建议：1)减少高钙食物摄入；2)避免过量补钙；3)增加运动促进钙吸收；4)定期检查甲状旁腺功能。`,
      priority: "medium",
      category: "diet",
    });
  }

  // 肾功能风险
  if (metabolic.creatinine && metabolic.creatinine > 110) {
    suggestions.push({
      title: "肾功能提示",
      content: `您的血清肌酐为${metabolic.creatinine}μmol/L，处于偏高水平。建议：1)定期监测肾功能；2)控制蛋白质摄入；3)避免过量使用NSAID类药物；4)咨询肾内科医生。`,
      priority: "medium",
      category: "medical",
    });
  }

  // 血糖风险
  if (metabolic.fastingGlucose && metabolic.fastingGlucose > 6.1) {
    suggestions.push({
      title: "空腹血糖升高",
      content: `您的空腹血糖为${metabolic.fastingGlucose}mmol/L，已超过正常范围。高血糖会增加结石风险。建议：1)减少高糖食物摄入；2)增加纤维素摄入；3)定期运动；4)必要时进行糖尿病筛查。`,
      priority: "medium",
      category: "diet",
    });
  }

  // 血脂风险
  if (metabolic.totalCholesterol && metabolic.totalCholesterol > 5.2) {
    suggestions.push({
      title: "血脂升高",
      content: `您的总胆固醇为${metabolic.totalCholesterol}mmol/L，超过正常范围。建议：1)减少饱和脂肪摄入；2)增加有氧运动；3)多吃富含纤维的食物；4)必要时使用降脂药物。`,
      priority: "medium",
      category: "diet",
    });
  }

  // 炎症标志物风险
  if (metabolic.crp && metabolic.crp > 3) {
    suggestions.push({
      title: "炎症标志物升高",
      content: `您的超敏C反应蛋白为${metabolic.crp}mg/L，提示体内炎症水平偏高。建议：1)增加抗炎食物（鱼、坚果、绿叶蔬菜）；2)规律运动；3)充分休息；4)必要时进行进一步检查。`,
      priority: "low",
      category: "diet",
    });
  }
}

function analyzeHealth(data: AssessmentData, suggestions: SuggestionItem[]): void {
  const health = data.healthData;
  
  // 注意：这里假设healthData包含所有字段，实际使用时需要检查字段是否存在

  // 体脂率风险
  if (health.bodyFat && health.bodyFat > 25) {
    suggestions.push({
      title: "体脂率偏高",
      content: `您的体脂率为${health.bodyFat}%，超过正常范围。高体脂会增加代谢负担和结石风险。建议：1)增加有氧运动至每周150分钟以上；2)减少高热量食物摄入；3)增加蛋白质摄入；4)定期监测体脂变化。`,
      priority: "high",
      category: "exercise",
    });
  }

  // 腰围风险 - 腹部肥胖
  if (health.waist && health.waist > 90) {
    suggestions.push({
      title: "腹部肥胖风险",
      content: `您的腰围为${health.waist}cm，属于腹部肥胖范围。腹部肥胖会增加代谢综合征和结石风险。建议加强核心肌群锻炼和有氧运动，目标腰围<90cm。`,
      priority: "high",
      category: "exercise",
    });
  }

  // 血压风险
  if (health.systolic && health.systolic > 140) {
    suggestions.push({
      title: "血压升高",
      content: `您的收缩压为${health.systolic}mmHg，已达到高血压诊断标准。建议：1)减少钠盐摄入；2)增加运动；3)控制体重；4)定期监测血压；5)必要时使用降压药物。`,
      priority: "high",
      category: "medical",
    });
  } else if (health.systolic && health.systolic > 120) {
    suggestions.push({
      title: "血压偏高",
      content: `您的收缩压为${health.systolic}mmHg，处于偏高水平。建议减少钠盐摄入，增加运动，定期监测。`,
      priority: "medium",
      category: "medical",
    });
  }

  // 饮水量风险
  if (health.waterIntake < 2000) {
    suggestions.push({
      title: "饮水量不足 - 结石风险最高",
      content: `您的日均饮水量仅为${health.waterIntake}ml，远低于推荐量。饮水不足是结石形成的最主要原因。建议立即增加饮水量至3000-4000ml/天，特别是在飞行期间。`,
      priority: "high",
      category: "hydration",
    });
  } else if (health.waterIntake < 2500) {
    suggestions.push({
      title: "饮水量偏低",
      content: `您的日均饮水量为${health.waterIntake}ml，建议增加至2500ml以上，特别是飞行日。`,
      priority: "high",
      category: "hydration",
    });
  }

  // 运动时间风险
  if (health.exerciseTime < 30) {
    suggestions.push({
      title: "运动不足",
      content: `您的日均运动时间仅为${health.exerciseTime}分钟，低于推荐标准。建议增加至每天30-60分钟，每周至少150分钟中等强度有氧运动。`,
      priority: "medium",
      category: "exercise",
    });
  }

  // 睡眠质量风险
  if (health.sleepQuality < 60) {
    suggestions.push({
      title: "睡眠质量差",
      content: `您的睡眠质量评分为${health.sleepQuality}分，质量较差。睡眠不足会影响代谢和免疫功能。建议：1)保持规律作息；2)避免睡前使用电子产品；3)创造良好睡眠环境；4)必要时咨询睡眠医学专家。`,
      priority: "medium",
      category: "lifestyle",
    });
  }

  // 工作压力风险
  if (health.workStress > 70) {
    suggestions.push({
      title: "工作压力过大",
      content: `您的工作压力评分为${health.workStress}分，压力较大。长期高压力会导致代谢紊乱。建议：1)进行冥想或瑜伽；2)定期运动释放压力；3)保证充足休息；4)必要时寻求心理咨询。`,
      priority: "medium",
      category: "lifestyle",
    });
  }

  // 心理状态风险
  if (health.mentalState < 60) {
    suggestions.push({
      title: "心理状态需要改善",
      content: `您的心理状态评分为${health.mentalState}分。不良的心理状态会影响整体健康。建议进行心理疏导、增加社交活动、规律运动和充分休息。`,
      priority: "low",
      category: "lifestyle",
    });
  }

  // 深静脉血栓史
  if (health.dvt) {
    suggestions.push({
      title: "深静脉血栓风险提示",
      content: `您有深静脉血栓病史，飞行中长时间久坐会增加血栓风险。建议：1)飞行中每小时站起活动一次；2)穿着压力袜；3)增加饮水；4)定期检查；5)必要时咨询血管外科医生。`,
      priority: "high",
      category: "medical",
    });
  }
}

/**
 * 添加默认建议以确保总数不少于8条
 */
function addDefaultSuggestions(data: AssessmentData, suggestions: SuggestionItem[], count: number): void {
  const defaultSuggestions: SuggestionItem[] = [
    {
      title: "定期检查计划",
      content: "建议每年进行一次全面的体检，包括血液检查、尿液检查和肉类检查。特别是不应车日期间，建议每半年检查一次。",
      priority: "high",
      category: "medical",
    },
    {
      title: "饮食结构优化",
      content: "建议增加新鲜水果、绿叶蔬菜等低草酸食物的摄入。减少加工食品的摄入，批量飞行时一定要注意低盐选择。",
      priority: "medium",
      category: "diet",
    },
    {
      title: "常规运动计划",
      content: "建议制定个性化的运动计划，不仅有助于维持健康体重，还能促进代谢。每周至少进行150分钟中等强度有氧运动。",
      priority: "medium",
      category: "exercise",
    },
    {
      title: "睡眠优化",
      content: "保持一致的睡眠时间，每天睡眠稍微较为不足时，建议增加睡眠时间至每天睡眠不少于7小时。良好的睡眠有助于整体代谢平衡。",
      priority: "medium",
      category: "lifestyle",
    },
    {
      title: "应急处理",
      content: "如果出现腰部疼痛、血尿、慢性转步不灵等症状，应立即就医检查。不要自行使用抗生素或抗炎药物，应等待医生诊断后再使用。",
      priority: "high",
      category: "medical",
    },
  ];

  // 添加需要的默认建议
  for (let i = 0; i < count && i < defaultSuggestions.length; i++) {
    suggestions.push(defaultSuggestions[i]);
  }
}

/**
 * 格式化建议为可显示的格式
 */
export function formatSuggestions(suggestions: SuggestionItem[]): Array<{
  title: string;
  content: string;
}> {
  return suggestions.map((s) => ({
    title: s.title,
    content: s.content,
  }));
}
