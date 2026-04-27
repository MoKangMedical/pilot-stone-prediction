/**
 * 报告生成器
 * 生成专业的医疗级评估报告，参考test.html的设计
 */

import type { AssessmentFormData } from "../shared/assessment";
import { RISK_LEVEL_CONFIG, type RiskLevel } from "../shared/assessment";

export interface ReportData {
  assessment: AssessmentFormData & {
    flightRisk: number;
    metabolicRisk: number;
    healthRisk: number;
    overallRisk: number;
    riskLevel: RiskLevel;
    suggestions: Array<{ title: string; content: string }>;
  };
}

/**
 * 生成HTML格式的报告（用于打印和PDF导出）
 * 采用专业医疗级设计，参考test.html的格式
 */
export function generateHTMLReport(data: ReportData): string {
  const { assessment } = data;
  const riskConfig = RISK_LEVEL_CONFIG[assessment.riskLevel];
  const reportDate = new Date().toLocaleString("zh-CN");

  // 生成渐变进度条的SVG
  const progressBarSvg = generateProgressBar(assessment.overallRisk);

  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>飞行员肾结石风险评估报告</title>
  <style>
    :root {
      --primary: #1a73e8;
      --secondary: #4285f4;
      --success: #34a853;
      --warning: #fbbc05;
      --danger: #ea4335;
      --dark: #202124;
      --light: #f8f9fa;
      --gray: #5f6368;
      --card-bg: #ffffff;
      --section-bg: #f1f8ff;
      --border: #dadce0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    }
    
    body {
      background: white;
      color: var(--dark);
      line-height: 1.6;
    }
    
    .page {
      page-break-after: always;
      width: 100%;
      min-height: 100vh;
      padding: 40px;
      display: flex;
      flex-direction: column;
    }
    
    .page:last-child {
      page-break-after: auto;
    }
    
    /* ===== 第一页：风险评估结果摘要 ===== */
    .page-1 {
      background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
      justify-content: center;
      align-items: center;
    }
    
    .risk-assessment-container {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 60px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      max-width: 900px;
      width: 100%;
    }
    
    .assessment-title {
      text-align: center;
      margin-bottom: 30px;
      font-size: 24px;
      font-weight: bold;
      color: var(--dark);
    }
    
    .assessment-title::before {
      content: "⊙ ";
      color: var(--primary);
      font-size: 28px;
      margin-right: 10px;
    }
    
    /* 个人信息摘要 */
    .personal-info-summary {
      text-align: center;
      margin-bottom: 30px;
      padding: 15px;
      background: var(--light);
      border-radius: 8px;
    }
    
    .personal-info-line {
      font-size: 13px;
      color: var(--gray);
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    
    .personal-info-line strong {
      color: var(--dark);
      font-weight: 600;
    }
    
    .personal-info-line:last-child {
      margin-bottom: 0;
    }
    
    .separator {
      display: inline-block;
      margin: 0 8px;
      color: var(--border);
    }
    
    /* 大字体风险百分比 */
    .risk-percentage {
      text-align: center;
      margin: 40px 0;
    }
    
    .risk-percentage-label {
      font-size: 16px;
      color: var(--gray);
      margin-bottom: 10px;
    }
    
    .risk-percentage-value {
      font-size: 80px;
      font-weight: bold;
      color: var(--primary);
      letter-spacing: -2px;
    }
    
    /* 渐变进度条 */
    .progress-bar-container {
      margin: 40px 0;
      text-align: center;
    }
    
    .progress-bar {
      width: 100%;
      height: 40px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    
    .progress-bar svg {
      width: 100%;
      height: 100%;
    }
    
    /* 风险描述 */
    .risk-description {
      text-align: center;
      font-size: 14px;
      color: var(--dark);
      line-height: 1.8;
      margin-bottom: 40px;
      padding: 20px;
      background: #f0f9ff;
      border-radius: 8px;
      border-left: 4px solid var(--primary);
    }
    
    /* 三项风险分解卡片 */
    .risk-breakdown-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .risk-card {
      padding: 30px 20px;
      background: white;
      border-radius: 12px;
      border: 1px solid var(--border);
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    
    .risk-card-label {
      font-size: 14px;
      color: var(--gray);
      margin-bottom: 15px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    
    .risk-card-value {
      font-size: 48px;
      font-weight: bold;
      color: var(--primary);
      margin-bottom: 10px;
    }
    
    .risk-card-unit {
      font-size: 14px;
      color: var(--gray);
    }
    
    /* ===== 第二页：个人信息和职业特征 ===== */
    .page-2 {
      background: white;
    }
    
    .container {
      max-width: 900px;
      width: 100%;
    }
    
    .header {
      border-bottom: 3px solid var(--primary);
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .header h1 {
      font-size: 24px;
      color: var(--primary);
      margin-bottom: 5px;
    }
    
    .header p {
      color: var(--gray);
      font-size: 12px;
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: white;
      background: linear-gradient(to right, var(--primary), var(--secondary));
      padding: 12px 18px;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .info-item {
      padding: 12px;
      background: var(--section-bg);
      border-radius: 5px;
      border-left: 3px solid var(--primary);
    }
    
    .info-label {
      font-size: 12px;
      color: var(--gray);
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .info-value {
      font-size: 14px;
      color: var(--dark);
      font-weight: 500;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    table thead {
      background: linear-gradient(to right, var(--primary), var(--secondary));
      color: white;
    }
    
    table th {
      padding: 12px;
      text-align: left;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    table td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--border);
      font-size: 13px;
    }
    
    table tbody tr:nth-child(even) {
      background: var(--light);
    }
    
    .suggestion-box {
      padding: 15px;
      background: #f0f9ff;
      border-left: 4px solid var(--primary);
      border-radius: 5px;
      margin-bottom: 15px;
    }
    
    .suggestion-title {
      font-size: 13px;
      font-weight: bold;
      color: var(--primary);
      margin-bottom: 8px;
    }
    
    .suggestion-content {
      font-size: 12px;
      color: var(--dark);
      line-height: 1.6;
    }
    
    .disclaimer {
      padding: 15px;
      background: #fef3c7;
      border-left: 4px solid var(--warning);
      border-radius: 5px;
      font-size: 11px;
      color: var(--dark);
      line-height: 1.6;
    }
    
    .personal-summary {
      background: #e8f4f8;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      border: 1px solid #bbdefb;
    }
    
    .personal-summary p {
      font-size: 13px;
      color: var(--dark);
      margin-bottom: 8px;
    }
    
    .personal-summary strong {
      color: var(--primary);
    }
    
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      .page {
        page-break-after: always;
        margin: 0;
        padding: 40px;
      }
    }
  </style>
</head>
<body>
  <!-- 第一页：风险评估结果摘要 -->
  <div class="page page-1">
    <div class="risk-assessment-container">
      <div class="assessment-title">风险评估结果</div>
      
      <!-- 个人信息摘要 -->
      <div class="personal-info-summary">
        <div class="personal-info-line">
          <strong>姓名：</strong> ${assessment.pilotName || "未填写"} 
          <span class="separator">|</span>
          <strong>性别：</strong> ${assessment.gender === "male" ? "男" : "女"}
          <span class="separator">|</span>
          <strong>年龄：</strong> ${assessment.age}岁
          <span class="separator">|</span>
          <strong>飞行员编号：</strong> ${assessment.pilotCode || "未填写"}
        </div>
        <div class="personal-info-line">
          <strong>评估日期：</strong> ${reportDate}
        </div>
      </div>
      
      <!-- 大字体风险百分比 -->
      <div class="risk-percentage">
        <div class="risk-percentage-label">评估风险为</div>
        <div class="risk-percentage-value">${assessment.overallRisk.toFixed(1)}%</div>
      </div>
      
      <!-- 渐变进度条 -->
      <div class="progress-bar-container">
        <div class="progress-bar">
          ${progressBarSvg}
        </div>
      </div>
      
      <!-- 风险描述 -->
      <div class="risk-description">
        ${getRiskDescription(assessment.overallRisk)}
      </div>
      
      <!-- 三项风险分解卡片 -->
      <div class="risk-breakdown-container">
        <div class="risk-card">
          <div class="risk-card-label">职业特征风险</div>
          <div class="risk-card-value">${assessment.flightRisk.toFixed(1)}%</div>
        </div>
        <div class="risk-card">
          <div class="risk-card-label">代谢指标风险</div>
          <div class="risk-card-value">${assessment.metabolicRisk.toFixed(1)}%</div>
        </div>
        <div class="risk-card">
          <div class="risk-card-label">健康综合风险</div>
          <div class="risk-card-value">${assessment.healthRisk.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 第二页：个人信息和职业特征 -->
  <div class="page page-2">
    <div class="container">
      <div class="header">
        <h1>个人信息与职业特征</h1>
        <p>飞行员：${assessment.pilotName || "未填写"} | 编号：${assessment.pilotCode || "未填写"} | 生成时间：${reportDate}</p>
      </div>
      
      <!-- 个人信息摘要 -->
      <div class="personal-summary">
        <p><strong>姓名：</strong>${assessment.pilotName || "未填写"} | 
           <strong>性别：</strong>${assessment.gender === "male" ? "男" : "女"} | 
           <strong>年龄：</strong>${assessment.age} 岁 | 
           <strong>飞行员编号：</strong>${assessment.pilotCode || "未填写"}</p>
        <p><strong>评估日期：</strong>${reportDate}</p>
      </div>
      
      <!-- 个人信息详情 -->
      <div class="section">
        <div class="section-title">个人基本信息</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">姓名</div>
            <div class="info-value">${assessment.pilotName || "未填写"}</div>
          </div>
          <div class="info-item">
            <div class="info-label">飞行员编号</div>
            <div class="info-value">${assessment.pilotCode || "未填写"}</div>
          </div>
          <div class="info-item">
            <div class="info-label">性别</div>
            <div class="info-value">${assessment.gender === "male" ? "男" : "女"}</div>
          </div>
          <div class="info-item">
            <div class="info-label">年龄</div>
            <div class="info-value">${assessment.age} 岁</div>
          </div>
        </div>
      </div>
      
      <!-- 职业特征 -->
      <div class="section">
        <div class="section-title">职业特征数据</div>
        <table>
          <thead>
            <tr>
              <th>指标</th>
              <th>数值</th>
              <th>单位</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>飞行时长</td>
              <td>${assessment.flightDuration}</td>
              <td>年</td>
            </tr>
            <tr>
              <td>年度飞行时间</td>
              <td>${assessment.annualFlightHours}</td>
              <td>小时</td>
            </tr>
            <tr>
              <td>机型</td>
              <td>${assessment.aircraftType || "未填写"}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>高空巡航占比</td>
              <td>${assessment.altitudeRatio}</td>
              <td>%</td>
            </tr>
            <tr>
              <td>跨时区飞行次数</td>
              <td>${assessment.timezoneFlights}</td>
              <td>次</td>
            </tr>
            <tr>
              <td>驾驶舱温度</td>
              <td>${assessment.cockpitTemp}</td>
              <td>°C</td>
            </tr>
            <tr>
              <td>应急备降次数</td>
              <td>${assessment.diversions}</td>
              <td>次</td>
            </tr>
            <tr>
              <td>航空餐盐分摄入</td>
              <td>${assessment.saltIntake === "low" ? "低" : assessment.saltIntake === "medium" ? "中" : "高"}</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
  <!-- 第三页：代谢指标和综合健康指标 -->
  <div class="page page-2">
    <div class="container">
      <div class="header">
        <h1>代谢指标与健康指标</h1>
        <p>飞行员：${assessment.pilotName || "未填写"} | 编号：${assessment.pilotCode || "未填写"}</p>
      </div>
      
      <!-- 代谢指标 -->
      <div class="section">
        <div class="section-title">代谢指标</div>
        <table>
          <thead>
            <tr>
              <th>指标</th>
              <th>数值</th>
              <th>单位</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>血清草酸盐</td>
              <td>${assessment.metabolicData?.serumOxalate ?? "未做"}</td>
              <td>μmol/L</td>
              <td>${assessment.metabolicData?.serumOxalateUndone ? "未做" : "已做"}</td>
            </tr>
            <tr>
              <td>超敏C反应蛋白</td>
              <td>${assessment.metabolicData?.crp ?? "未做"}</td>
              <td>mg/L</td>
              <td>${assessment.metabolicData?.crpUndone ? "未做" : "已做"}</td>
            </tr>
            <tr>
              <td>脂蛋白(a)</td>
              <td>${assessment.metabolicData?.lipoprotein ?? "未做"}</td>
              <td>mg/dL</td>
              <td>${assessment.metabolicData?.lipoproteinUndone ? "未做" : "已做"}</td>
            </tr>
            <tr>
              <td>血清钙</td>
              <td>${assessment.metabolicData?.calcium ?? "未做"}</td>
              <td>mmol/L</td>
              <td>${assessment.metabolicData?.calciumUndone ? "未做" : "已做"}</td>
            </tr>
            <tr>
              <td>血清磷</td>
              <td>${assessment.metabolicData?.phosphorus ?? "未做"}</td>
              <td>mmol/L</td>
              <td>${assessment.metabolicData?.phosphorusUndone ? "未做" : "已做"}</td>
            </tr>
            <tr>
              <td>尿液比重</td>
              <td>${assessment.metabolicData?.urineGravity ?? "未做"}</td>
              <td>-</td>
              <td>${assessment.metabolicData?.urineGravityUndone ? "未做" : "已做"}</td>
            </tr>
            <tr>
              <td>尿常规pH值</td>
              <td>${assessment.metabolicData?.urinePH ?? "未做"}</td>
              <td>-</td>
              <td>${assessment.metabolicData?.urinePHUndone ? "未做" : "已做"}</td>
            </tr>
            <tr>
              <td>肌酐</td>
              <td>${assessment.metabolicData?.creatinine ?? "未做"}</td>
              <td>μmol/L</td>
              <td>${assessment.metabolicData?.creatinineUndone ? "未做" : "已做"}</td>
            </tr>
            <tr>
              <td>尿素</td>
              <td>${assessment.metabolicData?.urea ?? "未做"}</td>
              <td>μmol/L</td>
              <td>${assessment.metabolicData?.ureaUndone ? "未做" : "已做"}</td>
            </tr>
            <tr>
              <td>尿酸</td>
              <td>${assessment.metabolicData?.uricAcid ?? "未做"}</td>
              <td>μmol/L</td>
              <td>${assessment.metabolicData?.uricAcidUndone ? "未做" : "已做"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 综合健康指标 -->
      <div class="section">
        <div class="section-title">综合健康指标</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">体脂率</div>
            <div class="info-value">${assessment.healthData?.bodyFat ?? "未填写"}%</div>
          </div>
          <div class="info-item">
            <div class="info-label">收缩压</div>
            <div class="info-value">${assessment.healthData?.systolic ?? "未填写"} mmHg</div>
          </div>
          <div class="info-item">
            <div class="info-label">舒张压</div>
            <div class="info-value">${assessment.healthData?.diastolic ?? "未填写"} mmHg</div>
          </div>
          <div class="info-item">
            <div class="info-label">运动时间</div>
            <div class="info-value">${assessment.healthData?.exerciseTime ?? "未填写"} 分钟/周</div>
          </div>
          <div class="info-item">
            <div class="info-label">每日饮水量</div>
            <div class="info-value">${assessment.healthData?.waterIntake ?? "未填写"} ml</div>
          </div>
          <div class="info-item">
            <div class="info-label">睡眠质量</div>
            <div class="info-value">${assessment.healthData?.sleepQuality ?? "未填写"}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 第四页：个性化建议 -->
  <div class="page page-2">
    <div class="container">
      <div class="header">
        <h1>详细健康建议</h1>
        <p>飞行员：${assessment.pilotName || "未填写"} | 编号：${assessment.pilotCode || "未填写"}</p>
      </div>
      
      <div class="section">
        <div class="section-title">个性化健康建议</div>
        ${assessment.suggestions.map(s => `
          <div class="suggestion-box">
            <div class="suggestion-title">${s.title}</div>
            <div class="suggestion-content">${s.content}</div>
          </div>
        `).join("")}
      </div>
      
      <!-- 免责声明 -->
      <div class="disclaimer">
        <strong>免责声明：</strong> 本评估系统仅供参考，不能替代专业医学诊断。如有健康问题，请及时咨询专业医生。评估结果基于您提供的数据计算得出，实际风险可能因个体差异而有所不同。建议每年进行一次常规体检，定期监测相关健康指标。
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

/**
 * 生成渐变进度条SVG
 * 从绿色（低风险）到红色（高风险）
 */
function generateProgressBar(riskPercentage: number): string {
  const percentage = Math.min(100, Math.max(0, riskPercentage));
  
  // 定义颜色渐变：绿 -> 黄 -> 橙 -> 红
  const colors = [
    { pos: 0, color: "#34a853" },    // 绿色
    { pos: 33, color: "#fbbc05" },   // 黄色
    { pos: 66, color: "#f9ab00" },   // 橙色
    { pos: 100, color: "#ea4335" }   // 红色
  ];
  
  // 计算当前位置的颜色
  let currentColor = colors[0].color;
  for (let i = 0; i < colors.length - 1; i++) {
    if (percentage >= colors[i].pos && percentage <= colors[i + 1].pos) {
      const range = colors[i + 1].pos - colors[i].pos;
      const ratio = (percentage - colors[i].pos) / range;
      // 简化处理：直接使用对应范围的颜色
      currentColor = percentage < 33 ? colors[0].color : 
                     percentage < 66 ? colors[1].color : 
                     percentage < 80 ? colors[2].color : colors[3].color;
      break;
    }
  }
  
  // 生成SVG进度条
  const svg = `
    <svg viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg" style="display: block; width: 100%; height: 100%;">
      <!-- 背景 -->
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#34a853;stop-opacity:1" />
          <stop offset="33%" style="stop-color:#fbbc05;stop-opacity:1" />
          <stop offset="66%" style="stop-color:#f9ab00;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ea4335;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- 完整渐变条 -->
      <rect x="0" y="0" width="100" height="10" rx="5" fill="url(#progressGradient)" />
      
      <!-- 指示器（小三角形或竖线） -->
      <line x1="${percentage}" y1="0" x2="${percentage}" y2="10" stroke="#333" stroke-width="1.5" />
    </svg>
  `;
  
  return svg;
}

/**
 * 根据风险百分比生成风险描述
 */
function getRiskDescription(riskPercentage: number): string {
  if (riskPercentage < 20) {
    return `您的结石风险处于低水平。建议关注高空巡航时间占比和补水频率，适当增加水分摄入并定期进行健康检查。`;
  } else if (riskPercentage < 50) {
    return `您的结石风险处于中等水平。建议关注高空巡航时间占比和补水频率，适当增加水分摄入并定期进行健康检查。`;
  } else if (riskPercentage < 80) {
    return `您的结石风险处于较高水平。建议立即咨询医生，调整飞行任务，增加水分摄入量，严格控制盐分摄入。`;
  } else {
    return `您的结石风险处于极高水平。建议立即就医进行专业评估，可能需要药物治疗或饮食干预，调整飞行任务。`;
  }
}
