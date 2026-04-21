
        {/* 胆固醇 */}
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

        {/* 高密度脂蛋白 */}
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

        {/* 低密度脂蛋白 */}
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

        {/* 甘油三酯 */}
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
  );
}
