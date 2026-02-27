# Specification

## Summary
**Goal:** Move the 'Work Order' option from the 'Verify' section to the 'Verify Application' section in the Work Orders page.

**Planned changes:**
- In `frontend/src/pages/WorkOrders.tsx`, remove the 'Work Order' option from the 'Verify' section/tab/group
- Place the 'Work Order' option under the 'Verify Application' section/tab/group, ensuring correct functionality and clear UI hierarchy

**User-visible outcome:** Users will find the 'Work Order' option listed under 'Verify Application' instead of 'Verify' in the Work Orders page, and it will work as expected in its new location.
