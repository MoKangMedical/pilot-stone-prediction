import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Trash2, FileDown, Calendar,
  Activity, AlertTriangle, CheckCircle, AlertCircle, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { assessmentStore, type StoredAssessment, dataManager } from "@/lib/staticStore";
import { RISK_LEVEL_CONFIG, type RiskLevel } from "@shared/assessment";

const riskIcons: Record<string, any> = {
  low: CheckCircle,
  medium: AlertCircle,
  high: AlertTriangle,
  critical: XCircle,
};

export default function History() {
  const [assessments, setAssessments] = useState<StoredAssessment[]>(() => assessmentStore.getAll());

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这条评估记录吗？")) {
      assessmentStore.delete(id);
      setAssessments(assessmentStore.getAll());
    }
  };

  const handleExport = () => {
    const data = dataManager.exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pilot-stone-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm("确定要清除所有评估记录吗？此操作不可恢复。")) {
      assessmentStore.clear();
      setAssessments([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  返回
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">评估历史</h1>
                <p className="text-sm text-gray-500">共 {assessments.length} 条记录</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <FileDown className="w-4 h-4 mr-1" />
                导出数据
              </Button>
              {assessments.length > 0 && (
                <Button variant="destructive" size="sm" onClick={handleClear}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  清空
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {assessments.length === 0 ? (
          <div className="text-center py-16">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无评估记录</h3>
            <p className="text-gray-500 mb-6">完成一次风险评估后，记录将显示在这里</p>
            <Link href="/assessment">
              <Button>开始第一次评估</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map(assessment => {
              const riskConfig = RISK_LEVEL_CONFIG[assessment.riskLevel as RiskLevel];
              const RiskIcon = riskIcons[assessment.riskLevel] || Activity;

              return (
                <Card key={assessment.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${riskConfig?.color || '#6b7280'}20` }}
                        >
                          <RiskIcon className="w-6 h-6" style={{ color: riskConfig?.color || '#6b7280' }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{assessment.pilotName}</h3>
                            <span className="text-sm text-gray-500">({assessment.pilotCode})</span>
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${riskConfig?.color || '#6b7280'}20`,
                                color: riskConfig?.color || '#6b7280',
                              }}
                            >
                              {riskConfig?.label || assessment.riskLevel}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(assessment.createdAt).toLocaleDateString('zh-CN')}
                            </span>
                            <span>风险分数: {(assessment.overallRisk * 100).toFixed(1)}%</span>
                            <span>{assessment.suggestions?.length || 0} 条建议</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right mr-4">
                          <div className="text-3xl font-bold" style={{ color: riskConfig?.color || '#6b7280' }}>
                            {(assessment.overallRisk * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500">综合风险</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(assessment.id)}
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
