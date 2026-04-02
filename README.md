# Trakteras – company site

Public marketing and **coming soon** landing page for [Trakteras](https://trakteras.com): bilingual (English / Greek), mobile-first, with a waitlist backed by Firebase Firestore when configured.

## Stack

- React 19 + TypeScript + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Motion](https://motion.dev/) for light animations
- [Firebase](https://firebase.google.com/) (Firestore) for waitlist signups

## Prerequisites

- Node.js 20+ (or current LTS)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Dev server (port 3000)   |
| `npm run build`| Production build → `dist`|
| `npm run preview` | Preview production build locally |
| `npm run lint` | Typecheck (`tsc --noEmit`) |

## Deploy (e.g. Vercel)

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`

Connect the GitHub repository and deploy; no extra framework config is required for this SPA.

## Firebase / waitlist

Waitlist emails are written to the Firestore collection `waitlist` (see `src/App.tsx` and `firestore.rules`).

1. Create or use a Firebase project and enable **Firestore**.
2. Copy your web app config into `firebase-applet-config.json` (or replace with env-based config later).
3. Deploy the rules in `firestore.rules` in the Firebase console.

Until Firebase is configured and rules are published, the page still loads but submitting the waitlist may fail.

## Repository

Source for the organization site: `Trakteras/company_site` on GitHub.

## License

Private – all rights reserved by Trakteras.
