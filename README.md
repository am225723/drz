# Dr. Zelisko Website

A Vite + React + Tailwind website for Integrative Psychiatry / Douglas Zelisko, MD.

## What is integrated

### Patient Portal
- PracticeQ / IntakeQ portal: `https://drz.intakeq.com/portal`
- Appears in the header, homepage, Current Patients page, Contact page, and footer.

### Booking Links
New patient psychiatric evaluation intake appointments:
- Virtual: `https://link.drz.services/veval`
- In office: `https://link.drz.services/ieval`

Current patient follow-up appointments:
- In office: `https://link.drz.services/o`
- Virtual: `https://link.drz.services/v`

The website includes polished booking cards plus an optional embedded iframe scheduler panel. Some EHR/booking platforms block iframe embedding via security headers. If that happens, the direct “open secure booking page” fallback link remains visible.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints, usually:

```text
http://localhost:5173
```

## Build

```bash
npm run build
npm run preview
```

## Test

```bash
npm test
```

## Deploy to Vercel

1. Push this project to GitHub.
2. In Vercel, click **Add New Project**.
3. Import the repo.
4. Use these settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
5. Deploy.

`vercel.json` is included so direct-refresh routes like `/new-patients` and `/current-patients` serve the app correctly.

## Deploy to Netlify

1. Push this project to GitHub.
2. In Netlify, click **Add new site** and import the repo.
3. Use these settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy.

`public/_redirects` is included so direct-refresh routes work.

## Production notes before launch

- Verify the correct public phone, email, fax, and address.
- Confirm whether you want to use `info@drzelisko.com` or `support@drzelisko.com` publicly.
- Confirm the exact insurance language.
- Confirm whether IntakeQ / PracticeQ allows iframe embedding on the booking pages. The site works even if iframe embedding is blocked.
- Replace the demo email form with a secure HIPAA-conscious contact workflow if collecting any patient information.


## Tailwind / PostCSS note

This project intentionally pins Tailwind CSS to `3.4.17` because the PostCSS configuration uses the classic Tailwind v3 plugin format:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

If you previously installed dependencies and saw the error about using `tailwindcss` directly as a PostCSS plugin, delete your installed dependencies and lockfile, then reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

Do not run `npm install tailwindcss@latest` unless you also migrate the PostCSS config to Tailwind v4.
