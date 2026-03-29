import { j as jsxRuntimeExports } from "./index-CojzdrZl.js";
import { j as getPaymentStatusLabel, k as getPaymentStatusClass } from "./helpers-BNKG4l1e.js";
function PaymentStatusBadge({
  status
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${getPaymentStatusClass(status)}`, children: getPaymentStatusLabel(status) });
}
export {
  PaymentStatusBadge as P
};
