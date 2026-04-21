import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface InputFieldProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  onUndoneChange?: (undone: boolean) => void;
  undone?: boolean;
  min: number;
  max: number;
  unit: string;
  estimate: number; // 单个数字占位符
  disabled?: boolean;
}

export default function InputField({
  label,
  value,
  onChange,
  onUndoneChange,
  undone = false,
  min,
  max,
  unit,
  estimate,
  disabled = false,
}: InputFieldProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  // 生成推荐区间显示文本
  const rangeText = `${min}-${max}`;

  // 判断输入值是否合理
  const isValueValid = (val: number): boolean => {
    // 允许范围：最小值的1/10倍 到 最大值的10倍
    const lowerBound = min / 10;
    const upperBound = max * 10;
    return val >= lowerBound && val <= upperBound;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // 用户输入时自动取消"未做"状态
    if (undone && onUndoneChange) {
      onUndoneChange(false);
    }

    if (val === "" || val === "-") {
      // 空值或仅有负号时，保持为null
      onChange(null);
    } else {
      const numVal = parseFloat(val);
      if (!isNaN(numVal)) {
        if (isValueValid(numVal)) {
          // 值合理，更新为用户输入值
          onChange(numVal);
        } else {
          // 值不合理，保持为null（显示占位符）
          onChange(null);
        }
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // 聚焦时，如果没有用户输入值，清空输入框；如果有值，显示该值
    if (value === null) {
      setInputValue("");
    } else {
      setInputValue(value.toString());
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // 失焦时，清空输入框显示占位符
    setInputValue("");
  };

  // 显示的占位符文本（单个数字）
  const placeholderText = estimate.toString();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">
            {label} <span className="text-muted-foreground">({unit})</span>
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-blue-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-semibold">正常参考范围</p>
                  <p className="text-sm">{rangeText} {unit}</p>
                  <p className="text-xs text-gray-300 mt-2">
                    可接受范围: {(min / 10).toFixed(2)} - {(max * 10).toFixed(1)} {unit}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {onUndoneChange && (
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={undone}
              onCheckedChange={(checked) => {
                onUndoneChange(checked as boolean);
                if (checked) {
                  onChange(null);
                  setInputValue("");
                }
              }}
              disabled={disabled}
            />
            <span className="text-muted-foreground">未做</span>
          </label>
        )}
      </div>

      {/* 填写框始终显示，无论未做状态如何 */}
      <div className="relative">
        <Input
          type="number"
          value={isFocused ? inputValue : ""}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholderText}
          className="text-base"
          step="0.1"
        />
        {!isFocused && (
          <div className="absolute inset-0 flex items-center px-3 pointer-events-none text-muted-foreground font-medium">
            {placeholderText}
          </div>
        )}
      </div>

      {/* 聚焦时显示推荐区间提示（仅在未做状态为false时） */}
      {isFocused && !undone && (
        <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded border border-blue-200">
          <p className="font-semibold text-blue-900">推荐区间: {rangeText} {unit}</p>
          <p className="text-blue-700 mt-1">
            可接受范围: {(min / 10).toFixed(2)} - {(max * 10).toFixed(1)} {unit}
          </p>
          <p className="text-blue-600 mt-1 text-xs">
            超出可接受范围的值将保持占位符显示
          </p>
        </div>
      )}

      {/* 未做状态提示 */}
      {undone && (
        <div className="text-xs text-muted-foreground italic bg-gray-50 p-2 rounded">
          此项标记为未做，点击框内修改数据会自动取消未做状态
        </div>
      )}
    </div>
  );
}
