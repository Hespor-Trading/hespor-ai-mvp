import * as React from "react";

export function Progress({ value = 0, className = "" }: { value?: number; className?: string }) {
  return (
    <div className={`w-full rounded-full bg-gray-200 ${className}`}>
      <div className="h-full rounded-full bg-black" style={{ width: `${Math.max(0, Math.min(100, value))}%`, height: "8px"}} />
    </div>
  );
}
