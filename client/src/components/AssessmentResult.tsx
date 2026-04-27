import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Save, FileDown, RotateCcw, AlertTriangle, 
  CheckCircle, AlertCircle, XCircle, Printer
} from "lucide-react";
import { RISK_LEVEL_CONFIG, type RiskLevel } from "@shared/assessment";

interface AssessmentResultProps {
  pilotName: string;
  pilotCode: string;
  gender: "male" | "female";
  age: number;
  result: {
    flightRisk: number;
    metabolicRisk: number;
    healthRisk: number;
    overallRisk: number;
    riskLevel: RiskLevel;
    suggestions: { title: string; content: string }[];
  };
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
  isAuthenticated: boolean;
}

export default function AssessmentResult({
  pilotName,
  pilotCode,
  gender,
  age,
  result,
  onSave,
  onReset,
  isSaving,
  isAuthenticated,
}: AssessmentResultProps) {
  const riskConfig = RISK_LEVEL_CONFIG[result.riskLevel];
  
  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case "low":
        return <CheckCircle className="w-8 h-8" style={{ color: RISK_LEVEL_CONFIG.low.color }} />;
      case "medium":
        return <AlertCircle className="w-8 h-8" style={{ color: RISK_LEVEL_CONFIG.medium.color }} />;
      case "high":
        return <AlertTriangle className="w-8 h-8" style={{ color: RISK_LEVEL_CONFIG.high.color }} />;
      case "critical":
        return <XCircle className="w-8 h-8" style={{ color: RISK_LEVEL_CONFIG.critical.color }} />;
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 评估结果卡片 */}
      <Card className="result-card">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            {getRiskIcon(result.riskLevel)}
          </div>
          <CardTitle className="text-2xl">风险评估结果</CardTitle>
          <p className="text-muted-foreground">
            评估时间：{new Date().toLocaleString("zh-CN")}
          </p>
        </CardHeader>
        <CardContent>
          {/* 个人信息 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-white/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">姓名</p>
              <p className="font-semibold">{pilotName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">编号</p>
              <p className="font-semibold">{pilotCode || "未提供"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">性别</p>
              <p className="font-semibold">{gender === "male" ? "男" : "女"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">年龄</p>
              <p className="font-semibold">{age}岁</p>
            </div>
          </div>
          
          {/* 总体风险 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full" 
                 style={{ backgroundColor: `${riskConfig.color}20` }}>
              <span className="text-4xl font-bold" style={{ color: riskConfig.color }}>
                {formatPercent(result.overallRisk)}
              </span>
              <span className="text-lg font-medium" style={{ color: riskConfig.color }}>
                {riskConfig.label}
              </span>
            </div>
          </div>
          
          {/* 三维风险分解 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">职业特征风险</p>
              <p className="text-2xl font-bold">{formatPercent(result.flightRisk)}</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: formatPercent(result.flightRisk), backgroundColor: riskConfig.color }} />
              </div>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">代谢指标风险</p>
              <p className="text-2xl font-bold">{formatPercent(result.metabolicRisk)}</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: formatPercent(result.metabolicRisk), backgroundColor: riskConfig.color }} />
              </div>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">综合健康风险</p>
              <p className="text-2xl font-bold">{formatPercent(result.healthRisk)}</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: formatPercent(result.healthRisk), backgroundColor: riskConfig.color }} />
              </div>
            </div>
          </div>
          
          {/* 个性化建议 */}
          {result.suggestions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">个性化健康建议</h3>
              <div className="space-y-3">
                {result.suggestions.map((suggestion, index) => (
                  <div key={index} className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                    <p className="font-medium text-blue-900">{suggestion.title}</p>
                    <p className="text-sm text-blue-700 mt-1">{suggestion.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-3 justify-center pt-4 border-t">
            {isAuthenticated && (
              <button
                onClick={onSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "保存中..." : "保存记录"}
              </button>
            )}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Printer className="w-4 h-4" />
              打印报告
            </button>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4" />
              重新评估
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
