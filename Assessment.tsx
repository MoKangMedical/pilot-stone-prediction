import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  User, Plane, FlaskConical, Heart, Calculator, 
  ChevronRight, ChevronLeft, Save, FileDown,
  Activity, Droplets, Brain, Moon
} from "lucide-react";
import { 
  defaultMetabolicData, 
  defaultHealthData,
  type MetabolicData,
  type HealthData,
  RISK_LEVEL_CONFIG
} from "@shared/assessment";
import { performRiskAssessment } from "@/lib/riskCalculator";
import AssessmentResult from "@/components/AssessmentResult";

type Step = "personal" | "flight" | "metabolic" | "health" | "result";

export default function Assessment() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const [showResult, setShowResult] = useState(false);
  
  // 个人信息
  const [pilotName, setPilotName] = useState("");
  const [pilotCode, setPilotCode] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState<number>(30);
  
  // 职业特征
  const [flightDuration, setFlightDuration] = useState(1.0);
  const [annualFlightHours, setAnnualFlightHours] = useState(450);
  const [aircraftType, setAircraftType] = useState("");
  const [altitudeRatio, setAltitudeRatio] = useState(50);
  const [timezoneFlights, setTimezoneFlights] = useState(0);
  const [cockpitTemp, setCockpitTemp] = useState(25);
  const [diversions, setDiversions] = useState(0);
  const [saltIntake, setSaltIntake] = useState<"low" | "medium" | "high">("medium");
  
  // 代谢指标
  const [metabolicData, setMetabolicData] = useState<MetabolicData>(defaultMetabolicData);
  
  // 健康指标
  const [healthData, setHealthData] = useState<HealthData>(defaultHealthData);
  
  // 评估结果
  const [assessmentResult, setAssessmentResult] = useState<{
    flightRisk: number;
    metabolicRisk: number;
    healthRisk: number;
    overallRisk: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    suggestions: { title: string; content: string }[];
  } | null>(null);
  
  const createAssessmentMutation = trpc.assessment.create.useMutation({
    onSuccess: () => {
      toast.success("评估记录已保存");
    },
    onError: (error) => {
      toast.error(`保存失败: ${error.message}`);
    },
  });
  
  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: "personal", label: "个人信息", icon: <User className="w-5 h-5" /> },
    { id: "flight", label: "职业特征", icon: <Plane className="w-5 h-5" /> },
    { id: "metabolic", label: "代谢指标", icon: <FlaskConical className="w-5 h-5" /> },
    { id: "health", label: "健康指标", icon: <Heart className="w-5 h-5" /> },
    { id: "result", label: "评估结果", icon: <Calculator className="w-5 h-5" /> },
  ];
  
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case "personal":
        return pilotName.trim() !== "" && age >= 18 && age <= 70;
      case "flight":
      case "metabolic":
      case "health":
        return true;
      default:
        return false;
    }
  }, [currentStep, pilotName, age]);
  
  const handleNext = () => {
    if (currentStep === "health") {
      // 执行风险评估
      const result = performRiskAssessment({
        gender,
        flightDuration,
        annualFlightHours,
        altitudeRatio,
        timezoneFlights,
        cockpitTemp,
        diversions,
        saltIntake,
        metabolicData,
        healthData,
      });
      setAssessmentResult(result);
      setCurrentStep("result");
      setShowResult(true);
    } else {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex].id);
      }
    }
  };
  
  const handlePrev = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };
  
  const handleSaveAssessment = async () => {
    if (!assessmentResult || !isAuthenticated) return;
    
    await createAssessmentMutation.mutateAsync({
      pilotName,
      pilotCode: pilotCode || `P${Date.now()}`,
      gender,
      age,
      flightDuration,
      annualFlightHours,
      aircraftType,
      altitudeRatio,
      timezoneFlights,
      cockpitTemp,
      diversions,
      saltIntake,
      metabolicData: metabolicData as MetabolicData,
      healthData: healthData as HealthData,
      ...assessmentResult,
    });
  };
  
  const handleReset = () => {
    setPilotName("");
    setPilotCode("");
    setGender("male");
    setAge(30);
    setFlightDuration(1.0);
    setAnnualFlightHours(450);
    setAircraftType("");
    setAltitudeRatio(50);
    setTimezoneFlights(0);
    setCockpitTemp(25);
    setDiversions(0);
    setSaltIntake("medium");
    setMetabolicData(defaultMetabolicData);
    setHealthData(defaultHealthData);
    setAssessmentResult(null);
    setShowResult(false);
    setCurrentStep("personal");
  };
  
  const updateMetabolicData = (key: keyof MetabolicData, value: any) => {
    setMetabolicData(prev => ({ ...prev, [key]: value }));
  };
  
  const updateHealthData = (key: keyof HealthData, value: any) => {
    setHealthData(prev => ({ ...prev, [key]: value }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 no-print">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">飞行员结石风险评估系统</h1>
                <p className="text-sm text-muted-foreground">基于机器学习的肾结石风险预测</p>
              </div>
            </div>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">欢迎，{user?.name || "用户"}</span>
                <Button variant="outline" size="sm" onClick={() => window.location.href = "/history"}>
                  历史记录
                </Button>
              </div>
            ) : (
              <Button onClick={() => window.location.href = getLoginUrl()}>
                登录
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {/* Progress Steps */}
      <div className="container py-6 no-print">
        <div className="flex items-center justify-center gap-2 md:gap-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => {
                  if (index <= currentStepIndex || (index === steps.length - 1 && showResult)) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : index < currentStepIndex || (index === steps.length - 1 && showResult)
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.icon}
                <span className="hidden md:inline text-sm font-medium">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container pb-8">
        {/* Step 1: Personal Info */}
        {currentStep === "personal" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="form-section-header">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>个人信息</CardTitle>
                <p className="text-sm text-muted-foreground">请填写飞行员基本信息</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pilotName">姓名 *</Label>
                  <Input
                    id="pilotName"
                    value={pilotName}
                    onChange={(e) => setPilotName(e.target.value)}
                    placeholder="请输入姓名"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pilotCode">飞行员编号</Label>
                  <Input
                    id="pilotCode"
                    value={pilotCode}
                    onChange={(e) => setPilotCode(e.target.value)}
                    placeholder="请输入飞行员编号（可选）"
                  />
                </div>
                <div className="space-y-2">
                  <Label>性别 *</Label>
                  <Select value={gender} onValueChange={(v) => setGender(v as "male" | "female")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">男</SelectItem>
                      <SelectItem value="female">女</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">年龄 *（18-70岁）</Label>
                  <Input
                    id="age"
                    type="number"
                    min={18}
                    max={70}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Step 2: Flight Characteristics */}
        {currentStep === "flight" && (
          <Card className="max-w-3xl mx-auto">
            <CardHeader className="form-section-header">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Plane className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>飞行员职业特征</CardTitle>
                <p className="text-sm text-muted-foreground">请填写飞行相关数据</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>平均单次飞行时长: {flightDuration} 小时</Label>
                  <Slider
                    value={[flightDuration]}
                    onValueChange={([v]) => setFlightDuration(v)}
                    min={0.5}
                    max={10}
                    step={0.5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>年度飞行时间: {annualFlightHours} 小时</Label>
                  <Slider
                    value={[annualFlightHours]}
                    onValueChange={([v]) => setAnnualFlightHours(v)}
                    min={0}
                    max={900}
                    step={50}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aircraftType">机型</Label>
                  <Input
                    id="aircraftType"
                    value={aircraftType}
                    onChange={(e) => setAircraftType(e.target.value)}
                    placeholder="例如：波音737、空客A320"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>高空巡航时间占比: {altitudeRatio}%</Label>
                  <Slider
                    value={[altitudeRatio]}
                    onValueChange={([v]) => setAltitudeRatio(v)}
                    min={0}
                    max={100}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>每月跨时区飞行次数</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTimezoneFlights(Math.max(0, timezoneFlights - 1))}
                      >
                        -
                      </Button>
                      <span className="text-xl font-semibold w-12 text-center">{timezoneFlights}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTimezoneFlights(timezoneFlights + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>应急备降经历次数</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDiversions(Math.max(0, diversions - 1))}
                      >
                        -
                      </Button>
                      <span className="text-xl font-semibold w-12 text-center">{diversions}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDiversions(diversions + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>驾驶舱温度中位数: {cockpitTemp}℃</Label>
                  <Slider
                    value={[cockpitTemp]}
                    onValueChange={([v]) => setCockpitTemp(v)}
                    min={18}
                    max={35}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>航空餐盐分摄入等级</Label>
                  <div className="flex gap-2">
                    {(["low", "medium", "high"] as const).map((level) => (
                      <Button
                        key={level}
                        variant={saltIntake === level ? "default" : "outline"}
                        onClick={() => setSaltIntake(level)}
                        className="flex-1"
                      >
                        {{ low: "低", medium: "中", high: "高" }[level]}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Step 3: Metabolic Indicators */}
        {currentStep === "metabolic" && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="form-section-header">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>代谢指标体系</CardTitle>
                <p className="text-sm text-muted-foreground">请填写代谢相关检测数据，未检测项目可勾选"未做"</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 血清草酸盐 */}
              <div className="space-y-2">
                <Label>血清草酸盐: {metabolicData.serumOxalate ?? 40} μmol/L</Label>
                <Slider
                  value={[metabolicData.serumOxalate ?? 40]}
                  onValueChange={([v]) => updateMetabolicData("serumOxalate", v)}
                  min={20}
                  max={100}
                />
              </div>
              
              {/* 超敏C反应蛋白 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>超敏C反应蛋白: {metabolicData.crpUndone ? "未做" : `${metabolicData.crp}`}</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={metabolicData.crpUndone}
                      onCheckedChange={(checked) => updateMetabolicData("crpUndone", checked)}
                    />
                    <span className="text-sm text-muted-foreground">未做</span>
                  </div>
                </div>
                {!metabolicData.crpUndone && (
                  <Slider
                    value={[metabolicData.crp || 1]}
                    onValueChange={([v]) => updateMetabolicData("crp", v)}
                    min={0}
                    max={10}
                    step={0.1}
                  />
                )}
              </div>
              
              {/* 脂蛋白(a) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>脂蛋白(a)水平: {metabolicData.lipoproteinUndone ? "未做" : `${metabolicData.lipoprotein}`}</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={metabolicData.lipoproteinUndone}
                      onCheckedChange={(checked) => updateMetabolicData("lipoproteinUndone", checked)}
                    />
                    <span className="text-sm text-muted-foreground">未做</span>
                  </div>
                </div>
                {!metabolicData.lipoproteinUndone && (
                  <Slider
                    value={[metabolicData.lipoprotein || 20]}
                    onValueChange={([v]) => updateMetabolicData("lipoprotein", v)}
                    min={0}
                    max={100}
                  />
                )}
              </div>
              
              {/* 钙磷代谢 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>钙 (mmol/L)</Label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={metabolicData.calciumUndone}
                        onCheckedChange={(checked) => {
                          updateMetabolicData("calciumUndone", checked);
                          if (checked) {
                            updateMetabolicData("calcium", null);
                          }
                        }}
                      />
                      <span className="text-muted-foreground">未做</span>
                    </label>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    value={metabolicData.calcium || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || null;
                      updateMetabolicData("calcium", val);
                      if (val !== null && metabolicData.calciumUndone) {
                        updateMetabolicData("calciumUndone", false);
                      }
                    }}
                    placeholder="2"
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>磷 (mmol/L)</Label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={metabolicData.phosphorusUndone}
                        onCheckedChange={(checked) => {
                          updateMetabolicData("phosphorusUndone", checked);
                          if (checked) {
                            updateMetabolicData("phosphorus", null);
                          }
                        }}
                      />
                      <span className="text-muted-foreground">未做</span>
                    </label>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    value={metabolicData.phosphorus || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || null;
                      updateMetabolicData("phosphorus", val);
                      if (val !== null && metabolicData.phosphorusUndone) {
                        updateMetabolicData("phosphorusUndone", false);
                      }
                    }}
                    placeholder="1"
                    className="text-base"
                  />
                </div>
              </div>
              
              {/* 尿液指标 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>尿液比重</Label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={metabolicData.urineGravityUndone}
                        onCheckedChange={(checked) => {
                          updateMetabolicData("urineGravityUndone", checked);
                          if (checked) {
                            updateMetabolicData("urineGravity", null);
                          }
                        }}
                      />
                      <span className="text-muted-foreground">未做</span>
                    </label>
                  </div>
                  <Input
                    type="number"
                    step="0.001"
                    value={metabolicData.urineGravity || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || null;
                      updateMetabolicData("urineGravity", val);
                      if (val !== null && metabolicData.urineGravityUndone) {
                        updateMetabolicData("urineGravityUndone", false);
                      }
                    }}
                    placeholder="1.015"
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>尿常规PH值</Label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={metabolicData.urinePHUndone}
                        onCheckedChange={(checked) => {
                          updateMetabolicData("urinePHUndone", checked);
                          if (checked) {
                            updateMetabolicData("urinePH", null);
                          }
                        }}
                      />
                      <span className="text-muted-foreground">未做</span>
                    </label>
                  </div>
                  <Input
                    type="number"
                    step="0.1"
                    value={metabolicData.urinePH || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || null;
                      updateMetabolicData("urinePH", val);
                      if (val !== null && metabolicData.urinePHUndone) {
                        updateMetabolicData("urinePHUndone", false);
                      }
                    }}
                    placeholder="6.5"
                    className="text-base"
                  />
                </div>
              </div>
              
              {/* 肾功能指标 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>肌酐 (μmol/L)</Label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={metabolicData.creatinineUndone}
                        onCheckedChange={(checked) => {
                          updateMetabolicData("creatinineUndone", checked);
                          if (checked) {
                            updateMetabolicData("creatinine", null);
                          }
                        }}
                      />
                      <span className="text-muted-foreground">未做</span>
                    </label>
                  </div>
                  <Input
                    type="number"
                    value={metabolicData.creatinine || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || null;
                      updateMetabolicData("creatinine", val);
                      if (val !== null && metabolicData.creatinineUndone) {
                        updateMetabolicData("creatinineUndone", false);
                      }
                    }}
                    placeholder="70"
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>尿素 (μmol/L)</Label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={metabolicData.ureaUndone}
                        onCheckedChange={(checked) => {
                          updateMetabolicData("ureaUndone", checked);
                          if (checked) {
                            updateMetabolicData("urea", null);
                          }
                        }}
                      />
                      <span className="text-muted-foreground">未做</span>
                    </label>
                  </div>
                  <Input
                    type="number"
                    step="0.1"
                    value={metabolicData.urea || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || null;
                      updateMetabolicData("urea", val);
                      if (val !== null && metabolicData.ureaUndone) {
                        updateMetabolicData("ureaUndone", false);
                      }
                    }}
                    placeholder="5"
                    className="text-base"
                  />
                </div>
              </div>
              
              {/* 尿酸 */}
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label>尿酸 (μmol/L)</Label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={metabolicData.uricAcidUndone}
                      onCheckedChange={(checked) => {
                        updateMetabolicData("uricAcidUndone", checked);
                        if (checked) {
                          updateMetabolicData("uricAcid", null);
                        }
                      }}
                    />
                    <span className="text-muted-foreground">未做</span>
                  </label>
                </div>
                <Input
                  type="number"
                  value={metabolicData.uricAcid || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || null;
                    updateMetabolicData("uricAcid", val);
                    if (val !== null && metabolicData.uricAcidUndone) {
                      updateMetabolicData("uricAcidUndone", false);
                    }
                  }}
                  placeholder="300"
                  className="text-base"
                />
              </div>
              
              {/* 其他代谢指标 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ALT */}
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label>丙氨酸氨基转移酶 (u/L)</Label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={metabolicData.altUndone}
                        onCheckedChange={(checked) => {
                          updateMetabolicData("altUndone", checked);
                          if (checked) {
                            updateMetabolicData("alt", null);
                          }
                        }}
                      />
                      <span className="text-muted-foreground">未做</span>
                    </label>
                  </div>
                  <Input
                    type="number"
                    value={metabolicData.alt || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || null;
                      updateMetabolicData("alt", val);
                      if (val !== null && metabolicData.altUndone) {
                        updateMetabolicData("altUndone", false);
                      }
                    }}
                    placeholder="30"
                    className="text-base"
                  />
                </div>
                
                {/* 空腹血糖 */}
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label>空腹血糖 (mmol/L)</Label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={metabolicData.fastingGlucoseUndone}
                        onCheckedChange={(checked) => {
                          updateMetabolicData("fastingGlucoseUndone", checked);
                          if (checked) {
                            updateMetabolicData("fastingGlucose", null);
                          }
                        }}
                      />
                      <span className="text-muted-foreground">未做</span>
                    </label>
                  </div>
                  <Input
                    type="number"
                    step="0.1"
                    value={metabolicData.fastingGlucose || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || null;
                      updateMetabolicData("fastingGlucose", val);
                      if (val !== null && metabolicData.fastingGlucoseUndone) {
                        updateMetabolicData("fastingGlucoseUndone", false);
                      }
                    }}
                    placeholder="5"
                    className="text-base"
                  />
                </div>
                
                {/* 糖化血红蛋白 */}
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label>糖化血红蛋白 (%)</Label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={metabolicData.hba1cUndone}
                        onCheckedChange={(checked) => {
                          updateMetabolicData("hba1cUndone", checked);
                          if (checked) {
                            updateMetabolicData("hba1c", null);
                          }
                        }}
                      />
                      <span className="text-muted-foreground">未做</span>
                    </label>
                  </div>
                  <Input
                    type="number"
                    step="0.1"
                    value={metabolicData.hba1c || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || null;
                      updateMetabolicData("hba1c", val);
                      if (val !== null && metabolicData.hba1cUndone) {
                        updateMetabolicData("hba1cUndone", false);
                      }
                    }}
                    placeholder="5"
                    className="text-base"
                  />
                </div>
                
                {/* 总胆固醇 */}
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label>总胆固醇 (mmol/L)</Label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={metabolicData.totalCholesterolUndone}
                        onCheckedChange={(checked) => {
                          updateMetabolicData("totalCholesterolUndone", checked);
                          if (checked) {
                            updateMetabolicData("totalCholesterol", null);
                          }
                        }}
                      />
                      <span className="text-muted-foreground">未做</span>
                    </label>
                  </div>
                  <Input
                    type="number"
                    step="0.1"
                    value={metabolicData.totalCholesterol || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || null;
                      updateMetabolicData("totalCholesterol", val);
                      if (val !== null && metabolicData.totalCholesterolUndone) {
                        updateMetabolicData("totalCholesterolUndone", false);
                      }
                    }}
                    placeholder="4"
                    className="text-base"
                  />
                </div>
              </div>

              {/* 胆固醇 */}
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label>胆固醇 (mmol/L)</Label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={metabolicData.cholesterolUndone}
                      onCheckedChange={(checked) => {
                        updateMetabolicData("cholesterolUndone", checked);
                        if (checked) {
                          updateMetabolicData("cholesterol", null);
                        }
                      }}
                    />
                    <span className="text-muted-foreground">未做</span>
                  </label>
                </div>
                <Input
                  type="number"
                  step="0.1"
                  value={metabolicData.cholesterol || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || null;
                    updateMetabolicData("cholesterol", val);
                    if (val !== null && metabolicData.cholesterolUndone) {
                      updateMetabolicData("cholesterolUndone", false);
                    }
                  }}
                  placeholder="4.5"
                  className="text-base"
                  disabled={metabolicData.cholesterolUndone}
                />
              </div>

              {/* 低密度脂蛋白(LDL) */}
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label>低密度脂蛋白(LDL) (mmol/L)</Label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={metabolicData.ldlUndone}
                      onCheckedChange={(checked) => {
                        updateMetabolicData("ldlUndone", checked);
                        if (checked) {
                          updateMetabolicData("ldl", null);
                        }
                      }}
                    />
                    <span className="text-muted-foreground">未做</span>
                  </label>
                </div>
                <Input
                  type="number"
                  step="0.1"
                  value={metabolicData.ldl || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || null;
                    updateMetabolicData("ldl", val);
                    if (val !== null && metabolicData.ldlUndone) {
                      updateMetabolicData("ldlUndone", false);
                    }
                  }}
                  placeholder="2.5"
                  className="text-base"
                  disabled={metabolicData.ldlUndone}
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Step 4: Health Indicators */}
        {currentStep === "health" && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="form-section-header">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>综合健康指标</CardTitle>
                <p className="text-sm text-muted-foreground">请填写综合健康相关数据</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 体脂率 */}
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label>体脂率 (%)</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={healthData.bodyFatUndone}
                      onCheckedChange={(checked) => updateHealthData("bodyFatUndone", checked)}
                    />
                    <span className="text-sm text-muted-foreground">未做</span>
                  </div>
                </div>
                {!healthData.bodyFatUndone && (
                  <Input
                    type="number"
                    step="0.1"
                    value={healthData.bodyFat || ""}
                    onChange={(e) => updateHealthData("bodyFat", parseFloat(e.target.value) || null)}
                    placeholder="5-50"
                  />
                )}
              </div>
              
              {/* 身体测量 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <Label>身高 (cm)</Label>
                  <Input
                    type="number"
                    value={healthData.height || ""}
                    onChange={(e) => updateHealthData("height", parseFloat(e.target.value) || null)}
                    placeholder="160-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>体重 (kg)</Label>
                  <Input
                    type="number"
                    value={healthData.weight || ""}
                    onChange={(e) => updateHealthData("weight", parseFloat(e.target.value) || null)}
                    placeholder="50-120"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>腰围 (cm)</Label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={healthData.waistUndone || false}
                        onChange={(e) => {
                          updateHealthData("waistUndone", e.target.checked);
                          if (e.target.checked) {
                            updateHealthData("waist", null);
                          }
                        }}
                      />
                      未做
                    </label>
                  </div>
                  <Input
                    type="number"
                    value={healthData.waist || ""}
                    onChange={(e) => {
                      updateHealthData("waist", parseFloat(e.target.value) || null);
                      if (e.target.value) {
                        updateHealthData("waistUndone", false);
                      }
                    }}
                    placeholder="60-120"
                    disabled={healthData.waistUndone}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>臀围 (cm)</Label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={healthData.hipUndone || false}
                        onChange={(e) => {
                          updateHealthData("hipUndone", e.target.checked);
                          if (e.target.checked) {
                            updateHealthData("hip", null);
                          }
                        }}
                      />
                      未做
                    </label>
                  </div>
                  <Input
                    type="number"
                    value={healthData.hip || ""}
                    onChange={(e) => {
                      updateHealthData("hip", parseFloat(e.target.value) || null);
                      if (e.target.value) {
                        updateHealthData("hipUndone", false);
                      }
                    }}
                    placeholder="80-130"
                    disabled={healthData.hipUndone}
                  />
                </div>
              </div>
              
              {/* 血压 */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <Label>收缩压 (mmHg)</Label>
                  <Input
                    type="number"
                    value={healthData.systolic || ""}
                    onChange={(e) => updateHealthData("systolic", parseFloat(e.target.value) || null)}
                    placeholder="90-180"
                  />
                </div>
                <div className="space-y-2">
                  <Label>舒张压 (mmHg)</Label>
                  <Input
                    type="number"
                    value={healthData.diastolic || ""}
                    onChange={(e) => updateHealthData("diastolic", parseFloat(e.target.value) || null)}
                    placeholder="60-120"
                  />
                </div>
              </div>
              
              {/* 深静脉血栓史 */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Label>深静脉血栓史</Label>
                <Switch
                  checked={healthData.dvt}
                  onCheckedChange={(checked) => updateHealthData("dvt", checked)}
                />
                <span className="text-sm text-muted-foreground">{healthData.dvt ? "有" : "无"}</span>
              </div>
              
              {/* 生活方式指标 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    飞行中补水频率: {healthData.hydrationFrequency} 次/飞行
                  </Label>
                  <Slider
                    value={[healthData.hydrationFrequency]}
                    onValueChange={([v]) => updateHealthData("hydrationFrequency", v)}
                    min={0}
                    max={10}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    每日饮水量: {healthData.waterIntake} ml
                  </Label>
                  <Slider
                    value={[healthData.waterIntake]}
                    onValueChange={([v]) => updateHealthData("waterIntake", v)}
                    min={500}
                    max={5000}
                    step={100}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    每周运动时间: {healthData.exerciseTime} 分钟
                  </Label>
                  <Slider
                    value={[healthData.exerciseTime]}
                    onValueChange={([v]) => updateHealthData("exerciseTime", v)}
                    min={0}
                    max={300}
                    step={10}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>辐射暴露程度: {healthData.radiationExposure}%</Label>
                  <Slider
                    value={[healthData.radiationExposure]}
                    onValueChange={([v]) => updateHealthData("radiationExposure", v)}
                    min={0}
                    max={100}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    工作压力指数: {healthData.workStress}%
                  </Label>
                  <Slider
                    value={[healthData.workStress]}
                    onValueChange={([v]) => updateHealthData("workStress", v)}
                    min={0}
                    max={100}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    睡眠质量指数: {healthData.sleepQuality}%
                  </Label>
                  <Slider
                    value={[healthData.sleepQuality]}
                    onValueChange={([v]) => updateHealthData("sleepQuality", v)}
                    min={0}
                    max={100}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>心理状态指数: {healthData.mentalState}%</Label>
                  <Slider
                    value={[healthData.mentalState]}
                    onValueChange={([v]) => updateHealthData("mentalState", v)}
                    min={0}
                    max={100}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Step 5: Results */}
        {currentStep === "result" && assessmentResult && (
          <AssessmentResult
            pilotName={pilotName}
            pilotCode={pilotCode}
            gender={gender}
            age={age}
            result={assessmentResult}
            onSave={handleSaveAssessment}
            onReset={handleReset}
            isSaving={createAssessmentMutation.isPending}
            isAuthenticated={isAuthenticated}
          />
        )}
        
        {/* Navigation Buttons */}
        {currentStep !== "result" && (
          <div className="flex justify-between max-w-4xl mx-auto mt-8 no-print">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              上一步
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed}
            >
              {currentStep === "health" ? "开始评估" : "下一步"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
