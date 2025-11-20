import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-accent/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        // Primary button -> your blue
        default:
          "bg-primary text-cream hover:bg-primary/90",

        // Accent button -> your orange
        accent:
          "bg-accent text-white hover:bg-accent/90",

        destructive:
          "bg-destructive text-white hover:bg-destructive/90",

        // Outline button -> border accent
        outline:
          "border border-accent text-accent hover:bg-accent hover:text-white",

        // Secondary -> your light-blue
        secondary:
          " border border-accent text-light-blue hover:bg-light-blue/80 focus-visible:border-light-blue",

        // Ghost -> subtle accent
        ghost:
          "hover:bg-accent/20 text-accent",

        // Link -> accent colored text
        link: "text-accent underline-offset-4 hover:underline",
      },

      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
