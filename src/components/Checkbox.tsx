// The square checkbox box used by the personalization / logo / opt-in / billing
// toggles. Just the visual — the clickable wrapper is the parent element.

import { Icon } from "./Icon.tsx";

export function Checkbox({ on }: { on: boolean }) {
  return (
    <span
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "6px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid " + (on ? "var(--accent)" : "var(--border-strong)"),
        background: on ? "var(--accent)" : "var(--surface)",
        color: "#fff",
        cursor: "pointer",
      }}
    >
      {on && <Icon name="check" size={13} />}
    </span>
  );
}
