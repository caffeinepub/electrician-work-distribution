function formatTimestamp(date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function getStatusClass(status) {
  switch (status) {
    case "open":
      return "badge-status-open";
    case "inProgress":
      return "badge-status-in-progress";
    case "completed":
      return "badge-status-completed";
    case "cancelled":
      return "badge-status-cancelled";
    default:
      return "";
  }
}
function getStatusLabel(status) {
  switch (status) {
    case "open":
      return "Open";
    case "inProgress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return String(status);
  }
}
function getApplicationStatusClass(status) {
  switch (status) {
    case "pending":
      return "badge-app-pending";
    case "accepted":
      return "badge-app-accepted";
    case "declined":
      return "badge-app-declined";
    case "cancelled":
      return "badge-app-cancelled";
    case "verifiedPendingAssignment":
      return "badge-app-verified";
    default:
      return "";
  }
}
function getApplicationStatusLabel(status) {
  switch (status) {
    case "pending":
      return "Pending";
    case "accepted":
      return "Accepted";
    case "declined":
      return "Declined";
    case "cancelled":
      return "Cancelled";
    case "verifiedPendingAssignment":
      return "Verified — Pending Assignment";
    default:
      return String(status);
  }
}
function getPaymentStatusClass(status) {
  switch (status.__kind__) {
    case "pending":
      return "badge-pay-pending";
    case "paid":
      return "badge-pay-paid";
    case "confirmed":
      return "badge-pay-confirmed";
    case "flagged":
      return "badge-pay-flagged";
    default:
      return "";
  }
}
function getPaymentStatusLabel(status) {
  switch (status.__kind__) {
    case "pending":
      return "Payment Pending";
    case "paid":
      return "Paid";
    case "confirmed":
      return "Confirmed";
    case "flagged":
      return `Flagged${status.flagged ? `: ${status.flagged}` : ""}`;
    default:
      return String(status.__kind__);
  }
}
function getPriorityClass(priority) {
  switch (priority) {
    case 1:
      return "badge-priority-low";
    case 2:
      return "badge-priority-medium";
    case 3:
      return "badge-priority-high";
    case 4:
      return "badge-priority-urgent";
    default:
      return "";
  }
}
function getPriorityLabel(priority) {
  switch (priority) {
    case 1:
      return "Low";
    case 2:
      return "Medium";
    case 3:
      return "High";
    case 4:
      return "Urgent";
    default:
      return `Priority ${priority}`;
  }
}
function getQualificationLabel(qualification) {
  switch (qualification) {
    case "itiElectrician":
      return "ITI Electrician";
    case "electronicElectricalEngineering":
      return "Electronic Electrical Engineering";
    case "eeeDiploma":
      return "EEE Diploma";
    case "diploma":
      return "Diploma";
    case "acMechanic":
      return "AC Mechanic";
    default:
      return qualification;
  }
}
function getSpecialityLabel(speciality) {
  switch (speciality) {
    case "electronicRepair":
      return "Electronic Repair";
    case "acTechnician":
      return "AC Technician";
    case "fridgeRepairWork":
      return "Fridge Repair";
    case "electrician":
      return "Electrician";
    default:
      return speciality;
  }
}
export {
  getApplicationStatusClass as a,
  getPriorityLabel as b,
  getPriorityClass as c,
  getSpecialityLabel as d,
  getQualificationLabel as e,
  formatTimestamp as f,
  getApplicationStatusLabel as g,
  getStatusLabel as h,
  getStatusClass as i,
  getPaymentStatusLabel as j,
  getPaymentStatusClass as k
};
