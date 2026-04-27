import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue { value: string; onValueChange: (value: string) => void }
const TabsContext = React.createContext<TabsContextValue>({ value: "", onValueChange: () => {} })

const Tabs = ({ value, onValueChange, className, children, ...props }: { value: string; onValueChange: (value: string) => void; className?: string; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
  <TabsContext.Provider value={{ value, onValueChange }}>
    <div className={cn("", className)} {...props}>{children}</div>
  </TabsContext.Provider>
)
const TabsList = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)} {...props}>{children}</div>
)
const TabsTrigger = ({ value, className, children, ...props }: { value: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const ctx = React.useContext(TabsContext)
  return (
    <button className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm", ctx.value === value && "bg-background text-foreground shadow-sm", className)} onClick={() => ctx.onValueChange(value)} {...props}>{children}</button>
  )
}
const TabsContent = ({ value, className, children, ...props }: { value: string } & React.HTMLAttributes<HTMLDivElement>) => {
  const ctx = React.useContext(TabsContext)
  if (ctx.value !== value) return null
  return <div className={cn("mt-2 ring-offset-background focus-visible:outline-none", className)} {...props}>{children}</div>
}
export { Tabs, TabsList, TabsTrigger, TabsContent }
