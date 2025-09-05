import * as React from "react";
import clsx from "clsx";

type Variant = "default" | "secondary" | "destructive" | "outline";

const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs";
const variants: Record<Variant, string> = {
  default: "bg-black text-white",
  secondary: "bg-gray-100 text-gray-800",
  destructive: "bg-red-100 text-red-700",
  outline: "border border-gray-300 text-gray-800",
};

export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return <span className={clsx(base, variants[variant], className)} {...props} />;
}
