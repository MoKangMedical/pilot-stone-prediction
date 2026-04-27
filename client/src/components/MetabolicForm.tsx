import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputField from "./InputField";
import { METABOLIC_DEFAULTS } from "@shared/defaults";
import type { MetabolicData } from "@shared/assessment";

interface MetabolicFormProps {
  data: MetabolicData;
  onChange: (data: MetabolicData) => void;
}

export default function MetabolicForm({ data, onChange }: MetabolicFormProps) {
  const handleFieldChange = (field: keyof MetabolicData, value: number | null) => {
    onChange({ ...data, [field]: value });
  };

  const handleUndoneChange = (field: string, undone: boolean) => {
    const undoneField = `${field}Undone` as keyof MetabolicData;
    onChange({ ...data, [undoneField]: undone });
  };

  return (
    <div className="space-y-6">
      {/* 钙磷代谢 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">钙磷代谢指标</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="钙"
            value={data.calcium}
            onChange={(val) => handleFieldChange("calcium", val)}
            onUndoneChange={(undone) => handleUndoneChange("calcium", undone)}
            undone={data.calciumUndone}
            min={METABOLIC_DEFAULTS.calcium.min}
            max={METABOLIC_DEFAULTS.calcium.max}
            unit={METABOLIC_DEFAULTS.calcium.unit}
            estimate={METABOLIC_DEFAULTS.calcium.estimate}
          />
          <InputField
            label="磷"
            value={data.phosphorus}
            onChange={(val) => handleFieldChange("phosphorus", val)}
            onUndoneChange={(undone) => handleUndoneChange("phosphorus", undone)}
            undone={data.phosphorusUndone}
            min={METABOLIC_DEFAULTS.phosphorus.min}
            max={METABOLIC_DEFAULTS.phosphorus.max}
            unit={METABOLIC_DEFAULTS.phosphorus.unit}
            estimate={METABOLIC_DEFAULTS.phosphorus.estimate}
          />
        </CardContent>
      </Card>

      {/* 尿液指标 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">尿液指标</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="尿液比重"
            value={data.urineGravity}
            onChange={(val) => handleFieldChange("urineGravity", val)}
            onUndoneChange={(undone) => handleUndoneChange("urineGravity", undone)}
            undone={data.urineGravityUndone}
            min={METABOLIC_DEFAULTS.urineGravity.min}
            max={METABOLIC_DEFAULTS.urineGravity.max}
            unit={METABOLIC_DEFAULTS.urineGravity.unit}
            estimate={METABOLIC_DEFAULTS.urineGravity.estimate}
          />
          <InputField
            label="尿常规pH值"
            value={data.urinePH}
            onChange={(val) => handleFieldChange("urinePH", val)}
            onUndoneChange={(undone) => handleUndoneChange("urinePH", undone)}
            undone={data.urinePHUndone}
            min={METABOLIC_DEFAULTS.urinePH.min}
            max={METABOLIC_DEFAULTS.urinePH.max}
            unit={METABOLIC_DEFAULTS.urinePH.unit}
            estimate={METABOLIC_DEFAULTS.urinePH.estimate}
          />
        </CardContent>
      </Card>

      {/* 肾功能指标 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">肾功能指标</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="肌酐"
            value={data.creatinine}
            onChange={(val) => handleFieldChange("creatinine", val)}
            onUndoneChange={(undone) => handleUndoneChange("creatinine", undone)}
            undone={data.creatinineUndone}
            min={METABOLIC_DEFAULTS.creatinine.min}
            max={METABOLIC_DEFAULTS.creatinine.max}
            unit={METABOLIC_DEFAULTS.creatinine.unit}
            estimate={METABOLIC_DEFAULTS.creatinine.estimate}
          />
          <InputField
            label="尿素"
            value={data.urea}
            onChange={(val) => handleFieldChange("urea", val)}
            onUndoneChange={(undone) => handleUndoneChange("urea", undone)}
            undone={data.ureaUndone}
            min={METABOLIC_DEFAULTS.urea.min}
            max={METABOLIC_DEFAULTS.urea.max}
            unit={METABOLIC_DEFAULTS.urea.unit}
            estimate={METABOLIC_DEFAULTS.urea.estimate}
          />
          <InputField
            label="尿酸"
            value={data.uricAcid}
            onChange={(val) => handleFieldChange("uricAcid", val)}
            onUndoneChange={(undone) => handleUndoneChange("uricAcid", undone)}
            undone={data.uricAcidUndone}
            min={METABOLIC_DEFAULTS.uricAcid.min}
            max={METABOLIC_DEFAULTS.uricAcid.max}
            unit={METABOLIC_DEFAULTS.uricAcid.unit}
            estimate={METABOLIC_DEFAULTS.uricAcid.estimate}
          />
        </CardContent>
      </Card>

      {/* 炎症和特殊指标 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">炎症与特殊指标</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="血清草酸盐"
            value={data.serumOxalate}
            onChange={(val) => handleFieldChange("serumOxalate", val)}
            min={METABOLIC_DEFAULTS.serumOxalate.min}
            max={METABOLIC_DEFAULTS.serumOxalate.max}
            unit={METABOLIC_DEFAULTS.serumOxalate.unit}
            estimate={METABOLIC_DEFAULTS.serumOxalate.estimate}
          />
          <InputField
            label="超敏C反应蛋白"
            value={data.crp}
            onChange={(val) => handleFieldChange("crp", val)}
            onUndoneChange={(undone) => handleUndoneChange("crp", undone)}
            undone={data.crpUndone}
            min={METABOLIC_DEFAULTS.crp.min}
            max={METABOLIC_DEFAULTS.crp.max}
            unit={METABOLIC_DEFAULTS.crp.unit}
            estimate={METABOLIC_DEFAULTS.crp.estimate}
          />
          <InputField
            label="脂蛋白(a)"
            value={data.lipoprotein}
            onChange={(val) => handleFieldChange("lipoprotein", val)}
            onUndoneChange={(undone) => handleUndoneChange("lipoprotein", undone)}
            undone={data.lipoproteinUndone}
            min={METABOLIC_DEFAULTS.lipoprotein.min}
            max={METABOLIC_DEFAULTS.lipoprotein.max}
            unit={METABOLIC_DEFAULTS.lipoprotein.unit}
            estimate={METABOLIC_DEFAULTS.lipoprotein.estimate}
          />
          <InputField
            label="丙氨酸转氨酶(ALT)"
            value={data.alt}
            onChange={(val) => handleFieldChange("alt", val)}
            onUndoneChange={(undone) => handleUndoneChange("alt", undone)}
            undone={data.altUndone}
            min={METABOLIC_DEFAULTS.alt.min}
            max={METABOLIC_DEFAULTS.alt.max}
            unit={METABOLIC_DEFAULTS.alt.unit}
            estimate={METABOLIC_DEFAULTS.alt.estimate}
          />
        </CardContent>
      </Card>

      {/* 血糖指标 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">血糖指标</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="空腹血糖"
            value={data.fastingGlucose}
            onChange={(val) => handleFieldChange("fastingGlucose", val)}
            onUndoneChange={(undone) => handleUndoneChange("fastingGlucose", undone)}
            undone={data.fastingGlucoseUndone}
            min={METABOLIC_DEFAULTS.fastingGlucose.min}
            max={METABOLIC_DEFAULTS.fastingGlucose.max}
            unit={METABOLIC_DEFAULTS.fastingGlucose.unit}
            estimate={METABOLIC_DEFAULTS.fastingGlucose.estimate}
          />
          <InputField
            label="糖化血红蛋白(HbA1c)"
            value={data.hba1c}
            onChange={(val) => handleFieldChange("hba1c", val)}
            onUndoneChange={(undone) => handleUndoneChange("hba1c", undone)}
            undone={data.hba1cUndone}
            min={METABOLIC_DEFAULTS.hba1c.min}
            max={METABOLIC_DEFAULTS.hba1c.max}
            unit={METABOLIC_DEFAULTS.hba1c.unit}
            estimate={METABOLIC_DEFAULTS.hba1c.estimate}
          />
        </CardContent>
      </Card>

      {/* 甲状旁腺指标 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">甲状旁腺指标</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="甲状旁腺素(PTH)"
            value={data.pth}
            onChange={(val) => handleFieldChange("pth", val)}
            onUndoneChange={(undone) => handleUndoneChange("pth", undone)}
            undone={data.pthUndone}
            min={METABOLIC_DEFAULTS.pth.min}
            max={METABOLIC_DEFAULTS.pth.max}
            unit={METABOLIC_DEFAULTS.pth.unit}
            estimate={METABOLIC_DEFAULTS.pth.estimate}
          />
          <InputField
            label="降钙素"
            value={data.calcitonin}
            onChange={(val) => handleFieldChange("calcitonin", val)}
            onUndoneChange={(undone) => handleUndoneChange("calcitonin", undone)}
            undone={data.calcitoninUndone}
            min={METABOLIC_DEFAULTS.calcitonin.min}
            max={METABOLIC_DEFAULTS.calcitonin.max}
            unit={METABOLIC_DEFAULTS.calcitonin.unit}
            estimate={METABOLIC_DEFAULTS.calcitonin.estimate}
          />
        </CardContent>
      </Card>

      {/* 血脂指标 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">血脂指标</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="总胆固醇"
            value={data.totalCholesterol}
            onChange={(val) => handleFieldChange("totalCholesterol", val)}
            onUndoneChange={(undone) => handleUndoneChange("totalCholesterol", undone)}
            undone={data.totalCholesterolUndone}
            min={METABOLIC_DEFAULTS.totalCholesterol.min}
            max={METABOLIC_DEFAULTS.totalCholesterol.max}
            unit={METABOLIC_DEFAULTS.totalCholesterol.unit}
            estimate={METABOLIC_DEFAULTS.totalCholesterol.estimate}
          />
          <InputField
            label="胆固醇"
            value={data.cholesterol}
            onChange={(val) => handleFieldChange("cholesterol", val)}
            onUndoneChange={(undone) => handleUndoneChange("cholesterol", undone)}
            undone={data.cholesterolUndone}
            min={METABOLIC_DEFAULTS.cholesterol.min}
            max={METABOLIC_DEFAULTS.cholesterol.max}
            unit={METABOLIC_DEFAULTS.cholesterol.unit}
            estimate={METABOLIC_DEFAULTS.cholesterol.estimate}
          />
          <InputField
            label="高密度脂蛋白(HDL)"
            value={data.hdl}
            onChange={(val) => handleFieldChange("hdl", val)}
            onUndoneChange={(undone) => handleUndoneChange("hdl", undone)}
            undone={data.hdlUndone}
            min={METABOLIC_DEFAULTS.hdl.min}
            max={METABOLIC_DEFAULTS.hdl.max}
            unit={METABOLIC_DEFAULTS.hdl.unit}
            estimate={METABOLIC_DEFAULTS.hdl.estimate}
          />
          <InputField
            label="低密度脂蛋白(LDL)"
            value={data.ldl}
            onChange={(val) => handleFieldChange("ldl", val)}
            onUndoneChange={(undone) => handleUndoneChange("ldl", undone)}
            undone={data.ldlUndone}
            min={METABOLIC_DEFAULTS.ldl.min}
            max={METABOLIC_DEFAULTS.ldl.max}
            unit={METABOLIC_DEFAULTS.ldl.unit}
            estimate={METABOLIC_DEFAULTS.ldl.estimate}
          />
          <InputField
            label="甘油三酯"
            value={data.triglycerides}
            onChange={(val) => handleFieldChange("triglycerides", val)}
            onUndoneChange={(undone) => handleUndoneChange("triglycerides", undone)}
            undone={data.triglyceridesUndone}
            min={METABOLIC_DEFAULTS.triglycerides.min}
            max={METABOLIC_DEFAULTS.triglycerides.max}
            unit={METABOLIC_DEFAULTS.triglycerides.unit}
            estimate={METABOLIC_DEFAULTS.triglycerides.estimate}
          />
        </CardContent>
      </Card>
    </div>
  );
}
