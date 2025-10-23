"use client";

import * as React from "react";

/** tiny className joiner (no external deps) */
function cn(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}

/** style maps (similar to shadcn defaults) */
const VARIANT: Record<
  NonNullable<ButtonProps["variant"]>,
  string
> = {
  default:
    "bg-emerald-600 text-white hover:bg-emerald-700",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200",
  outline:
    "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900",
  ghost:
    "bg-transparent hover:bg-gray-100 text-gray-900",
  link:
    "bg-transparent underline underline-offset-4 text-emerald-700 hover:text-emerald-800",
  destructive:
    "bg-red-600 text-white hover:bg-red-700",
};

const SIZE: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** visual variants */
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  /**
   * When true, render the styles onto the *child* element (e.g. a <Link>).
   * Usage: <Button asChild><a href="/x">Go</a></Button>
   */
  asChild?: boolean;
}

/**
 * Zero-dependency Button with optional `asChild` support.
 * If `asChild` is true and the child is a valid React element, we clone it and
 * merge className/disabled/aria props so routing semantics are preserved.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      children,
      disabled,
      ...rest
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const classes = cn(base, VARIANT[variant], SIZE[size], className);

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement, {
        className: cn((children as any).props?.className, classes),
        "aria-disabled": disabled ? true : undefined,
        ...(disabled ? { tabIndex: -1 } : {}),
        // keep all original child props; rest are irrelevant for non-button nodes
      });
    }

    return (
      <button ref={ref} className={classes} disabled={disabled} {...rest}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
