import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

// shadcn's button, restyled as a sticker: ink outline, hard shadow, presses down when tapped.
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 border-[3px] border-ink font-heading font-bold whitespace-nowrap select-none outline-none transition-[transform,box-shadow] duration-150 ease-out focus-visible:ring-4 focus-visible:ring-fries-blue focus-visible:ring-offset-2 focus-visible:ring-offset-cream active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-fries-blue text-paper shadow-sticker",
        secondary: "bg-paper text-ink shadow-sticker",
        sun: "bg-sun text-ink shadow-sticker",
        ghost: "border-transparent bg-transparent text-ink shadow-none underline-offset-4 hover:underline active:translate-x-0 active:translate-y-0",
      },
      size: {
        default: "h-12 rounded-full px-6 text-base",
        lg: "h-14 w-full rounded-full px-6 text-lg",
        sm: "h-10 rounded-full px-4 text-sm",
        icon: "size-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
