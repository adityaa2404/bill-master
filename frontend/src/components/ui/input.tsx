import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
  // Base
  "flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-base outline-none transition-colors shadow-sm",

  // Text + placeholder color
  "text-cream placeholder:text-light-blue",

  // Border (default)
  "border border-accent",

  // Hover
  "hover:border-primary/80",

  // Focus
  "focus-visible:border-light-blue focus-visible:ring-primary/40 focus-visible:ring-[3px]",

  // Disabled
  "disabled:pointer-events-none disabled:opacity-50",

  className
)}
      {...props}
    />
  )
}

export { Input }
