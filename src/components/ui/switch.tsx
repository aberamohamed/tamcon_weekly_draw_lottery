"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Switch({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <input
        type="checkbox"
        className="peer sr-only"
        {...props}
      />
      <div className="h-5 w-9 rounded-full bg-zinc-200 transition-colors peer-checked:bg-[#2D338B] peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
      </div>
    </div>
  )
}

export { Switch }
