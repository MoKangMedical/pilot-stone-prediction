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
  
  const handleExportPDF = () => {
    // 触发打印对话框，用户可以选择保存为PDF
    window.print();
  };
  
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