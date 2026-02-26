# Specification

## Summary
**Goal:** Simplify the job application flow on the Job Board and add a "Join Us" empty-state panel with backend job alert subscription support.

**Planned changes:**
- Replace the multi-step job application dialog with a single-click "Apply Now" button and a brief one-step confirmation, while still recording the application in the backend
- When no jobs are available, show a prominent "Join Us" empty-state panel with an encouraging message, a "Join Us" call-to-action button, and a note that workers will be alerted when new jobs are posted
- Add a backend `subscribeForJobAlerts()` function that records the caller's principal and timestamp in stable storage, and a `getJobAlertSubscribers()` query for admin use
- Wire the "Join Us" button to call the subscription function; show a success message and disable/update the button after successful subscription
- Handle unauthenticated users by prompting login before subscribing, and handle loading/error states gracefully

**User-visible outcome:** Workers can apply to jobs in one step, and when no jobs are listed they see a friendly "Join Us" panel where they can subscribe for job alerts with a single click and receive confirmation that they've been added to the list.
