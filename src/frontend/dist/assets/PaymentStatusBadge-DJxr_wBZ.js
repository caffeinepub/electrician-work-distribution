import { j as jsxRuntimeExports, ao as getPaymentStatusLabel, ap as getPaymentStatusClass } from "./index-DuXxNtqE.js";
function PaymentStatusBadge({
  status
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${getPaymentStatusClass(status)}`, children: getPaymentStatusLabel(status) });
}
export {
  PaymentStatusBadge as P
};
