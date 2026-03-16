# Application Programming Interface (API) Guides

Since the platform leverages Firebase Realtime Database and Firebase SDKs, typical REST APIs are replaced with client-side library listeners.

## Key Service Hooks

### `useAuth()`
Handles user login states and role-based assignments upon authentication.
* **Input:** Email/Password or Google OAuth Payload
* **Output:** User Token, Firebase `uid`, and corresponding user object slice from `/users/{uid}`.

### `fetchEvents()`
Retrieves upcoming events from the `/events` node.
* **Filters:** Can filter by `.orderByChild('date')` or limits.
* **Output:** List of event objects.

### `registerForEvent(eventId, uid)`
Registers a student for a specific event. Also generates a mock QR digest.
* **Path Affected:** `/registrations/{eventId}/{uid}`
* **Returns:** Transaction status.

### `processQRCheckIn(eventId, uid, scannedDigest)`
Organizer function to mark `.checkedIn = true`.
* **Path Affected:** `/registrations/{eventId}/{uid}/checkedIn`
* **Returns:** Success or validation failure.
