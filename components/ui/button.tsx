import * as React from "react";
import clsx from "clsx";

type Variant = "default" | "outline" | "secondary" | "ghost"; // <-- added "ghost"
type Size = "default" | "icon";

const base =
  "inline-flex items-center justify-center rounded-2xl px-3 py-2 text-sm shadow-sm transition active:scale-[.98]";
const variants: Record<Variant, string> = {
  default: "bg-black text-white hover:bg-black/90",
  outline: "border border-gray-300 hover:bg-gray-50",
  secondary: "bg-gray-100 hover:bg-gray-200",
  ghost: "bg-transparent hover:bg-gray-100", // <-- styles for ghost
};
const sizes: Record<Size, string> = {
  default: "h-9",
  icon: "h-9 w-9 p-0",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
