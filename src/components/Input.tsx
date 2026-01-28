import * as React from "react";

import { cn } from "../lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-white border border-gray-400 text-gray-900 text-sm rounded-md placeholder:text-gray-600 focus:ring-green-700 focus:border-green-700 focus:bg-gray-50 focus:ring-1 block w-full p-4 max-h-12 disabled:cursor-not-allowed disabled:opacity-50 outline-none",
        "focus-visible:border-ring",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className,
      )}
      autoComplete="off"
      {...props}
    />
  );
}

export { Input };
