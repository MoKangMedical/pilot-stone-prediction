import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Download, Upload, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dataManager } from "@/lib/staticStore";

export default function Settings() {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const data = dataManager.exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pilot-stone-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (dataManager.importAll(text)) {
          setImportStatus("数据导入成功！");
        } else {
          setImportStatus("导入失败：文件格式不正确");
        }
        setTimeout(() => setImportStatus(null), 3000);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearAll = () => {
    if (confirm("确定要清除所有数据吗？此操作不可恢复。")) {
      dataManager.clearAll();
      setImportStatus("所有数据已清除");
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                返回
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {importStatus && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
            {importStatus}
          </div>
        )}

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>数据管理</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              所有数据存储在浏览器本地（localStorage），不会上传到任何服务器。
              您可以导出数据进行备份，或导入之前备份的数据。
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                导出所有数据
              </Button>
              <Button onClick={handleImport} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                导入数据
              </Button>
              <Button onClick={handleClearAll} variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                清除所有数据
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>关于系统</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">飞行员尿石症风险评估系统 v1.0.0</h4>
                <p className="text-sm text-gray-600 mt-1">
                  基于AI和机器学习的飞行员尿石症风险预测系统。系统整合职业特征、
                  代谢指标和综合健康三维度数据，提供精准的风险评估和个性化健康建议。
                </p>
                <div className="mt-3 text-sm text-gray-500 space-y-1">
                  <p>专利号：2024116733167</p>
                  <p>发明名称：基于机器学习模型的肾结石预测并协助早筛方法</p>
                  <p>申请人：苏州工业园区蒙纳士科学技术研究院</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>隐私说明</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>所有评估数据仅存储在您的浏览器本地，不会上传到服务器</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>系统不收集任何个人信息或健康数据</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>清除浏览器数据将删除所有评估记录，建议定期导出备份</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>本系统仅供健康风险评估参考，不构成医疗诊断建议</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
