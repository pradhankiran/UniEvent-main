# Hosting Guide

## Frontend Hosting (Firebase Hosting / Vercel / Netlify)

1. Build for Production
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `/dist` directory.

### Firebase Deployment Example:
1. `firebase login`
2. `firebase init hosting`
   * Select the `frontend/dist` directory as the public directory.
   * Configure as a single-page app (rewrite all URLs to `/index.html`).
3. `firebase deploy --only hosting`

## Backend 
* As the app uses Firebase, ensure your Firebase Console has Realtime Database rules updated securely.
* Keep your `apiKey` and `projectId` within the `.env` variables safe but available to your build process.
