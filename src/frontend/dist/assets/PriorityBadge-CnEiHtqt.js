import { j as jsxRuntimeExports, v as getPriorityLabel, w as getPriorityClass } from "./index-DuXxNtqE.js";
function PriorityBadge({ priority }) {
  const p = typeof priority === "string" ? ["low", "medium", "high", "urgent"].indexOf(priority) + 1 || 1 : Number(priority);
  const label = priority === "low" ? "Low" : priority === "medium" ? "Medium" : priority === "high" ? "High" : priority === "urgent" ? "Urgent" : getPriorityLabel(p);
  const cls = priority === "low" ? "badge-priority-low" : priority === "medium" ? "badge-priority-medium" : priority === "high" ? "badge-priority-high" : priority === "urgent" ? "badge-priority-urgent" : getPriorityClass(p);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${cls}`, children: label });
}
export {
  PriorityBadge as P
};
