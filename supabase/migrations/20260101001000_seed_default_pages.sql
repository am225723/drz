-- Seed default CMS page records so /admin/pages is not empty.
-- These records give the admin dashboard editable page metadata/content containers.
-- Public pages still keep hardcoded fallbacks unless specifically wired to content_json.

insert into public.pages (slug, title, seo_title, seo_description, content_json, published)
values
  (
    'home',
    'Home',
    'Integrative Psychiatry | Douglas Zelisko, MD',
    'Integrative psychiatric care, psychotherapy, medication management, and whole-person mental health care in West Hartford, Connecticut.',
    '{"page":"home","sections":["hero","meet_doctor","practice_fit","methods","appointments","services"],"note":"Editable CMS container for homepage content. Public page currently uses hardcoded fallback content unless wired to this JSON."}'::jsonb,
    true
  ),
  (
    'about',
    'About Dr. Zelisko',
    'About Douglas Zelisko, MD | Integrative Psychiatry',
    'Learn about Douglas Zelisko, MD, a board-certified psychiatrist offering integrative psychiatric care in Connecticut.',
    '{"page":"about","sections":["letter","portrait","signature"],"note":"Editable CMS container for About page content. Public page currently uses hardcoded fallback content unless wired to this JSON."}'::jsonb,
    true
  ),
  (
    'services',
    'Services Overview',
    'Psychiatric Services | Integrative Psychiatry',
    'Explore psychotherapy, medication management, psychiatric evaluation, ketamine-assisted psychotherapy, and integrative psychiatric care.',
    '{"page":"services","sections":["featured_services","care_options","methods"],"note":"Editable CMS container for Services overview content."}'::jsonb,
    true
  ),
  (
    'psychotherapy',
    'Psychotherapy',
    'Psychotherapy | Integrative Psychiatry',
    'Psychotherapy with Douglas Zelisko, MD as part of integrative psychiatric care in West Hartford, Connecticut.',
    '{"page":"psychotherapy","sections":["hero","who_it_may_help","approach","cta"],"note":"Editable CMS container for Psychotherapy service page."}'::jsonb,
    true
  ),
  (
    'medication-management',
    'Medication Management',
    'Medication Management | Integrative Psychiatry',
    'Thoughtful psychiatric medication management with Douglas Zelisko, MD in West Hartford, Connecticut.',
    '{"page":"medication-management","sections":["hero","who_it_may_help","process","controlled_substances","cta"],"note":"Editable CMS container for Medication Management service page."}'::jsonb,
    true
  ),
  (
    'ketamine-therapy',
    'Ketamine-Assisted Psychotherapy',
    'Ketamine-Assisted Psychotherapy | Integrative Psychiatry',
    'A carefully screened, physician-guided approach to ketamine-assisted psychotherapy for selected patients.',
    '{"page":"ketamine-therapy","sections":["hero","candidacy","process","safety","practical_details","cta"],"note":"Editable CMS container for Ketamine page content."}'::jsonb,
    true
  ),
  (
    'resources',
    'Resources & FAQ',
    'Resources & FAQ | Integrative Psychiatry',
    'Educational articles and frequently asked questions about psychiatric care, holistic psychiatry, ADHD, anxiety, fees, and appointments.',
    '{"page":"resources","sections":["articles","faq"],"note":"Articles and FAQs are managed in their dedicated admin areas. This is the page-level metadata container."}'::jsonb,
    true
  ),
  (
    'fees-insurance',
    'Fees & Insurance',
    'Fees & Insurance | Integrative Psychiatry',
    'Information about fees, insurance pathways, private pay, out-of-network reimbursement, and superbills.',
    '{"page":"fees-insurance","sections":["fees","insurance","superbills"],"note":"Editable CMS container for Fees & Insurance page."}'::jsonb,
    true
  ),
  (
    'new-patients',
    'New Patients',
    'New Patients | Integrative Psychiatry',
    'Schedule a new patient psychiatric evaluation intake appointment with Douglas Zelisko, MD.',
    '{"page":"new-patients","sections":["booking","practice_fit"],"note":"Editable CMS container for New Patients page."}'::jsonb,
    true
  ),
  (
    'current-patients',
    'Current Patients',
    'Current Patients | Integrative Psychiatry',
    'Follow-up appointment scheduling and patient portal access for current patients.',
    '{"page":"current-patients","sections":["follow_up_booking","portal"],"note":"Editable CMS container for Current Patients page."}'::jsonb,
    true
  ),
  (
    'contact',
    'Contact',
    'Contact | Integrative Psychiatry',
    'Contact Integrative Psychiatry for non-urgent administrative and appointment-related communication.',
    '{"page":"contact","sections":["contact_form","office_information","emergency_notice"],"note":"Editable CMS container for Contact page."}'::jsonb,
    true
  ),
  (
    'privacy-policy',
    'Privacy Policy',
    'Privacy Policy | Integrative Psychiatry',
    'Privacy information for the Integrative Psychiatry website.',
    '{"page":"privacy-policy","sections":["policy"],"note":"Replace placeholder copy with attorney-reviewed language before final publication."}'::jsonb,
    true
  ),
  (
    'notice-of-privacy-practices',
    'Notice of Privacy Practices',
    'Notice of Privacy Practices | Integrative Psychiatry',
    'HIPAA Notice of Privacy Practices for Integrative Psychiatry.',
    '{"page":"notice-of-privacy-practices","sections":["notice"],"note":"Replace placeholder copy with official HIPAA notice before final publication."}'::jsonb,
    true
  ),
  (
    'terms-of-use',
    'Terms of Use',
    'Terms of Use | Integrative Psychiatry',
    'Terms of use for the Integrative Psychiatry website.',
    '{"page":"terms-of-use","sections":["terms"],"note":"Replace placeholder copy with attorney-reviewed language before final publication."}'::jsonb,
    true
  ),
  (
    'emergency-disclaimer',
    'Emergency Disclaimer',
    'Emergency Disclaimer | Integrative Psychiatry',
    'Emergency disclaimer and crisis information for website visitors.',
    '{"page":"emergency-disclaimer","sections":["emergency_disclaimer"],"note":"This page tells visitors not to use the website for emergencies."}'::jsonb,
    true
  )
on conflict (slug) do update set
  title = excluded.title,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  content_json = excluded.content_json,
  published = excluded.published,
  updated_at = now();
