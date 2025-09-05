"use client";
import * as React from "react";
import clsx from "clsx";

const TabsContext = React.createContext<{ value: string, setValue: (v:string)=>void } | null>(null);

export function Tabs({ defaultValue, className, children }: { defaultValue: string, className?: string, children: React.ReactNode }) {
  const [value, setValue] = React.useState(defaultValue);
  return <TabsContext.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsContext.Provider>;
}

export function TabsList({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={clsx("inline-flex rounded-xl border bg-white p-1", className)}>{children}</div>;
}

export function TabsTrigger({ value, children }: { value: string, children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext)!;
  const active = ctx.value === value;
  return (
    <button
      onClick={()=>ctx.setValue(value)}
      className={clsx("px-3 py-1.5 text-sm rounded-lg", active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100")}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children }: { value: string, className?: string, children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext)!;
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}
