# Architecture Overview

## Concept
CampusConnect is built as a single-page application (SPA) designed to communicate securely with Firebase backend services.

## User Roles
* **Student:** View events, register via QR codes, participate in clubs.
* **Faculty:** Create, manage, and approve platform events. Review analytics.
* **Organizer (Club):** Handle specific events tied to clubs. Manage club rosters.

## Components
1. **Frontend (React + Tailwind):** Client-side routing, state management, and UI rendering.
2. **Backend Services (Firebase):**
   * **Authentication:** Google Sign-in and standard Email/Password login.
   * **Realtime Database:** Non-relational JSON tree for flexible data storage.
3. **Mobile Wrapper (Android):** A WebView pointing to the hosted React frontend, with native push notification support bindings.

## Volunteer Management System (Bonus Feature)
A dedicated module where Organizers can broadcast volunteer needs. Students can apply, and upon successful event conclusion, verified volunteers receive digital certificates.
