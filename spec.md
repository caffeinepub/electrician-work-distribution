# Specification

## Summary
**Goal:** Add a fully protected Admin Portal to the application with a Verifications section that allows admins to approve or reject work orders, electrician profiles, job applications, and payments.

**Planned changes:**
- Add an "Admin Portal" group in the sidebar navigation (visible only to authenticated admin users) with links: Dashboard, Work Orders, Electricians, Payments, and Verifications
- Add protected admin routes (`/admin/dashboard`, `/admin/work-orders`, `/admin/electricians`, `/admin/payments`, `/admin/verifications`) that redirect unauthenticated users and show "Access Denied" to non-admins
- Create an Admin Verifications page with four tabs: Work Order Requests, Electrician Profiles, Job Applications, and Payment Verifications — each showing pending items with Approve/Reject action buttons, status badges, pending counts, and empty states
- Add backend admin-only functions: `approveWorkOrder`, `rejectWorkOrder`, `approveElectrician`, `rejectElectrician`, `approveJobApplication`, `rejectJobApplication`, `approvePayment`, and `flagPayment`, each updating the relevant record's status
- Add TanStack Query hooks in `useQueries.ts` for fetching pending items and for all approve/reject/flag mutations with cache invalidation
- Wrap all admin pages in `PageTransition` for fade-in animations, add animated tab indicators, loading spinners on action buttons, and slide-in toast notifications

**User-visible outcome:** Admin users can access a dedicated Admin Portal from the sidebar, navigate to a Verifications page, and approve or reject pending work orders, electrician profiles, job applications, and payments — all with smooth animations and instant feedback.
