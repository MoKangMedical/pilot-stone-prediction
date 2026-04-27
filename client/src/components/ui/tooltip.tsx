import * as React from "react"
import { cn } from "@/lib/utils"

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </TooltipContext.Provider>
  )
}

const TooltipContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void }>({ open: false, setOpen: () => {} })

const TooltipTrigger = ({ children, asChild, ...props }: { children: React.ReactNode; asChild?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { setOpen } = React.useContext(TooltipContext)
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onMouseEnter: () => setOpen(true),
      onMouseLeave: () => setOpen(false),
    })
  }
  return <button onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} {...props}>{children}</button>
}

const TooltipContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { open } = React.useContext(TooltipContext)
  if (!open) return null
  return (
    <div className={cn("z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 absolute bottom-full left-1/2 -translate-x-1/2 mb-2", className)} {...props}>{children}</div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
