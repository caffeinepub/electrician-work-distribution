# Specification

## Summary
**Goal:** Remove the "actor not available" blocking alert from the Book Service flow and add a Contact Number field to the booking form.

**Planned changes:**
- Remove any "actor not available" alert/toast/dialog that appears when accessing or using the Book Service page; replace with a graceful loading state if the actor is not yet initialized.
- Add a "Contact Number" input field to the Book Service form (Services.tsx) that accepts phone number characters.
- Update the backend WorkOrder data type to include a `contactNumber` field.
- Submit and store the contact number value along with the rest of the work order data.
- Display the contact number in the admin Work Orders view for each booking.

**User-visible outcome:** Users can open the Book Service form without seeing a blocking alert, fill in their contact number, and submit a booking. Admins can see the contact number for each work order in the admin panel.
