import * as React from "react"

export const Toaster = () => {
  return <div id="toast-container" className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2" />
}

export const toast = (message: string | { title?: string; description?: string; variant?: string }) => {
  const container = document.getElementById("toast-container")
  if (!container) return
  const div = document.createElement("div")
  const text = typeof message === "string" ? message : message.description || message.title || ""
  div.className = "rounded-lg border bg-background p-4 shadow-lg text-sm max-w-sm animate-in slide-in-from-bottom-5"
  div.textContent = text
  container.appendChild(div)
  setTimeout(() => div.remove(), 3000)
}
