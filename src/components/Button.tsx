import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base cursor-pointer font-medium p-10 transition-all disabled:pointer-events-none disabled:opacity-50 outline-none w-full aria-invalid:ring-destructive/20 aria-invalid:border-destructive focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-green-700 text-white hover:bg-green-600 focus-visible:ring-green-700",
        destructive:
          "bg-red-700 text-white hover:bg-red-600 focus-visible:ring-red-700",
        outline:
          "border border-gray-200 bg-white text-green-800 shadow-xs hover:bg-gray-200 hover:text-green-600 focus-visible:ring-green-600",
        secondary:
          "border border-gray-400 bg-white text-green-700 hover:bg-gray-300 focus-visible:ring-green-700",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2",
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
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
