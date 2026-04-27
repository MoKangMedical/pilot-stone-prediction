import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: number[]) => void
  value?: number[]
  min?: number
  max?: number
  step?: number
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(({ className, onValueChange, value, ...props }, ref) => (
  <input
    type="range"
    ref={ref}
    className={cn("w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer", className)}
    value={value?.[0]}
    onChange={(e) => onValueChange?.([Number(e.target.value)])}
    {...props}
  />
))
Slider.displayName = "Slider"
export { Slider }
