# Dr. Zelisko Website

Next.js + Tailwind website for Integrative Psychiatry / Douglas Zelisko, MD.

## What is integrated

### Patient Portal
- PracticeQ / IntakeQ portal: `https://drz.intakeq.com/portal`

### Booking Links
New patient psychiatric evaluation intake appointments:
- Virtual: `https://link.drz.services/veval`
- In office: `https://link.drz.services/ieval`

Current patient follow-up appointments:
- In office: `https://link.drz.services/o`
- Virtual: `https://link.drz.services/v`

### Supabase backend
The website now supports a Supabase-powered backend for:
- Contact form submissions
- Admin login
- Submission review
- Article CMS
- FAQ CMS
- Page/content JSON CMS

The old PHP contact endpoint is deprecated. The public contact form submits to the Supabase Edge Function `submit-contact`.

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
npm run start
```

## Required environment variables

Public website / admin:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
NEXT_PUBLIC_CONTACT_FUNCTION_URL=https://YOUR_PROJECT.supabase.co/functions/v1/submit-contact
```

Supabase Edge Function secrets:

```bash
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
CONTACT_ALLOWED_ORIGIN=https://drzelisko.com
CONTACT_EMAIL_TO=secure-inbox@example.com
CONTACT_EMAIL_FROM=no-reply@drzelisko.com
CONTACT_EMAIL_SUBJECT=New Website Inquiry — PHI
CONTACT_RATE_LIMIT_PER_HOUR=3
EMAIL_PROVIDER=resend
RESEND_API_KEY=YOUR_RESEND_API_KEY
```

Supported `EMAIL_PROVIDER` values in the Edge Function:
- `resend` using `RESEND_API_KEY`
- `postmark` using `POSTMARK_SERVER_TOKEN`
- `sendgrid` using `SENDGRID_API_KEY`

Do not commit real secrets.

## Supabase setup

1. Create a Supabase project.
2. Install the Supabase CLI.
3. Log in and link the project:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

4. Apply the migration:

```bash
supabase db push
```

The migration file is:

```text
supabase/migrations/20260101000000_admin_cms_contact.sql
```

It creates:
- `profiles`
- `contact_submissions`
- `pages`
- `articles`
- `faqs`
- `audit_log`
- Row Level Security policies
- Role helpers

## Deploy the Edge Function

```bash
supabase functions deploy submit-contact
```

Set function secrets:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
supabase secrets set CONTACT_EMAIL_TO=secure-inbox@example.com
supabase secrets set CONTACT_EMAIL_FROM=no-reply@drzelisko.com
supabase secrets set CONTACT_ALLOWED_ORIGIN=https://drzelisko.com
supabase secrets set EMAIL_PROVIDER=resend
supabase secrets set RESEND_API_KEY=YOUR_RESEND_API_KEY
```

The function config disables JWT verification because the contact form is public:

```text
supabase/functions/submit-contact/config.toml
```

The function validates submissions, stores them in Supabase, rate-limits by email, and sends the full PHI email notification to the configured secure inbox.

## Create the first admin user

1. In Supabase Auth, create the admin user with email/password.
2. In the Supabase SQL editor, run:

```sql
insert into public.profiles (id, email, full_name, role)
select id, email, 'Douglas Zelisko', 'admin'
from auth.users
where email = 'YOUR_ADMIN_EMAIL@example.com'
on conflict (id) do update set role = 'admin', email = excluded.email;
```

Roles:
- `admin`: view submissions, edit submissions, edit CMS, read audit log
- `editor`: edit CMS
- `viewer`: read admin data allowed by RLS

## Admin routes

- `/admin/login`
- `/admin`
- `/admin/submissions`
- `/admin/submissions/[id]`
- `/admin/articles`
- `/admin/articles/new`
- `/admin/articles/[id]`
- `/admin/faq`
- `/admin/pages`

Note: the FAQ editor route is `/admin/faq`.

## Contact form testing checklist

1. Set all Vercel/hosting public env vars.
2. Deploy the Edge Function.
3. Set all Edge Function secrets.
4. Submit the contact form with test data only.
5. Confirm the browser shows a success state.
6. Confirm a row appears in `contact_submissions`.
7. Confirm the full email reaches the secure practice inbox.
8. Confirm no PHI appears in browser console, deployment logs, or function logs.
9. Confirm `/admin/submissions` can view the submission after login.
10. Mark it reviewed and confirm status changes.

## CMS behavior

The Resources page loads published `articles` and `faqs` from Supabase when available. If Supabase is empty or unavailable, it falls back to the existing hardcoded content in `lib/content.js` and `lib/faq.js`, so the public website remains functional.

## Deploy to Vercel

Use:

```text
Framework preset: Next.js
Install command: npm install
Build command: npm run build
Output directory: leave blank
Root directory: repository root
```

Set the required `NEXT_PUBLIC_*` environment variables in Vercel.

## PHP deprecation

The PHP files under `/api` and `/admin` are legacy/deprecated and are no longer used by the Next.js contact form or CMS workflow. They may be removed later after confirming the Supabase workflow is fully live.

## Production notes before launch

- Verify public phone, email, and address.
- Confirm exact insurance language.
- Replace placeholder legal pages with attorney-reviewed versions.
- Confirm email provider BAA and mailbox security controls.
- Keep Supabase RLS enabled.
- Never expose the Supabase service role key to the browser.
- Never log PHI to console, hosting logs, or analytics.
