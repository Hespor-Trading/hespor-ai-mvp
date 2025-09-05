import * as React from "react";

export function Switch({ checked, onCheckedChange }: { checked?: boolean; onCheckedChange?: (v:boolean)=>void }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e)=>onCheckedChange?.(e.target.checked)}
        style={{ display: "none" }}
      />
      <span
        style={{
          width: 42,
          height: 24,
          background: checked ? "#000" : "#e5e7eb",
          borderRadius: 9999,
          position: "relative",
          transition: "all 0.2s",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)"
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 22 : 3,
            width: 18,
            height: 18,
            background: "#fff",
            borderRadius: "9999px",
            transition: "all 0.2s",
            boxShadow: "0 1px 2px rgba(0,0,0,0.15)"
          }}
        />
      </span>
    </label>
  );
}
