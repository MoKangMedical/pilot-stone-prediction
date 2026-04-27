import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, TrendingUp, Globe, BarChart3 } from 'lucide-react';

export function SEERDataIntro() {
  return (
    <div className="space-y-6">
      {/* SEER数据介绍卡片 */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            SEER数据库简介
          </CardTitle>
          <CardDescription>
            美国国家癌症研究所的监测、流行病学和最终结果数据库
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 数据来源 */}
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4 text-green-500" />
                数据来源
              </h3>
              <p className="text-sm text-muted-foreground">
                收集美国18个地区的癌症登记数据，覆盖约35%的美国人口，包括肾结石相关的代谢数据。
              </p>
            </div>

            {/* 数据规模 */}
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                数据规模
              </h3>
              <p className="text-sm text-muted-foreground">
                包含超过700万条患者记录，时间跨度超过50年，提供长期纵向研究数据。
              </p>
            </div>

            {/* 数据特点 */}
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                数据特点
              </h3>
              <p className="text-sm text-muted-foreground">
                包含人口统计学、诊断、治疗和预后信息，支持风险因素分析和预测模型开发。
              </p>
            </div>

            {/* 应用价值 */}
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-500" />
                应用价值
              </h3>
              <p className="text-sm text-muted-foreground">
                支持肾结石风险评估、流行病学研究、临床决策支持和公共卫生政策制定。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEER数据流程图 */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>SEER数据处理流程</CardTitle>
          <CardDescription>
            从数据采集到风险评估的完整流程
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 流程步骤 */}
            <div className="flex flex-col space-y-3">
              {[
                {
                  step: 1,
                  title: '数据采集',
                  desc: '从美国18个地区的癌症登记机构采集患者数据',
                  color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                },
                {
                  step: 2,
                  title: '数据清洗',
                  desc: '标准化、去重和质量控制，确保数据准确性',
                  color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                },
                {
                  step: 3,
                  title: '特征提取',
                  desc: '提取代谢指标、健康指标和职业特征等关键特征',
                  color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100'
                },
                {
                  step: 4,
                  title: '模型训练',
                  desc: '使用机器学习算法训练肾结石风险预测模型',
                  color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100'
                },
                {
                  step: 5,
                  title: '风险评估',
                  desc: '对飞行员进行个性化风险评估和健康建议',
                  color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
                },
              ].map((item, index) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold ${item.color}`}>
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  {index < 4 && (
                    <div className="flex-shrink-0 text-muted-foreground">↓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEER数据统计 */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>SEER数据统计信息</CardTitle>
          <CardDescription>
            关键数据指标概览
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '患者记录数', value: '700万+', unit: '条' },
              { label: '覆盖地区', value: '18', unit: '个' },
              { label: '时间跨度', value: '50+', unit: '年' },
              { label: '美国人口覆盖', value: '35%', unit: '' },
            ].map((stat, index) => (
              <div key={index} className="border border-border rounded-lg p-4 text-center bg-muted/30">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
