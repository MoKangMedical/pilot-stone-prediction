import * as React from "react"
import { cn } from "@/lib/utils"

const Select = ({ children, value, onValueChange, ...props }: { children: React.ReactNode; value?: string; onValueChange?: (value: string) => void } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select value={value} onChange={(e) => onValueChange?.(e.target.value)} className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", props.className)} {...props}>{children}</select>
)
const SelectTrigger = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("", className)} {...props}>{children}</div>
)
const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>
const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
)
const SelectValue = ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>
export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }
