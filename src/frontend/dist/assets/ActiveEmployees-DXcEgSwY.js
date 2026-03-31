import { r as reactExports, j as jsxRuntimeExports, f as LoaderCircle, o as UserCheck, I as Input, M as Mail, B as Briefcase } from "./index-DT4hGqI0.js";
import { B as Badge } from "./badge-B6MCZdEA.js";
import { K as useActiveEmployees, C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./useQueries-DkbzSMcZ.js";
import { P as Phone } from "./phone-Ba6pnPz4.js";
import { G as GraduationCap } from "./graduation-cap-DPOIPPJf.js";
import { I as IndianRupee } from "./indian-rupee-Bjder2c0.js";
import { C as Clock } from "./clock-BadqGE9p.js";
function ActiveEmployees() {
  const { data: employees = [], isLoading } = useActiveEmployees();
  const [search, setSearch] = reactExports.useState("");
  const filtered = employees.filter(
    (e) => e.fullName.toLowerCase().includes(search.toLowerCase())
  );
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-8 h-8 text-primary" }),
        "Active Employees"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "All approved and staying employees." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        "data-ocid": "employees.search_input",
        placeholder: "Search by name...",
        value: search,
        onChange: (e) => setSearch(e.target.value),
        className: "max-w-sm"
      }
    ) }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "employees.empty_state",
        className: "flex flex-col items-center justify-center py-16 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-12 h-12 text-muted-foreground mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: search ? "No employees match your search." : "No active employees yet. Approve job applications to see them here." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", "data-ocid": "employees.list", children: filtered.map((emp, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "bg-white text-gray-900",
        "data-ocid": `employees.item.${idx + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: emp.fullName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-500 text-white flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-3.5 h-3.5" }),
              "Active Employee"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3.5 h-3.5" }),
                emp.mobileNo
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5" }),
                emp.gmailId
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-3.5 h-3.5" }),
                emp.academicQualification
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "w-3.5 h-3.5" }),
                emp.jobType,
                " · ",
                emp.workingTime,
                " hrs/day"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-3.5 h-3.5" }),
                "₹",
                emp.salaryPerMonth,
                "/mo · ₹",
                emp.salaryPerWeek,
                "/wk · ₹",
                emp.salaryPerDay,
                "/day"
              ] }),
              emp.workExperience && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
                "Exp: ",
                emp.workExperience
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Approved:",
              " ",
              new Date(emp.submittedAt).toLocaleDateString("en-IN")
            ] })
          ] })
        ]
      },
      emp.id
    )) })
  ] });
}
export {
  ActiveEmployees as default
};
