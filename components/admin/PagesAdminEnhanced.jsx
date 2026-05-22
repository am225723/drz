'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AdminGate } from './AdminComponents';
import { getSupabaseBrowserClient } from '../../lib/supabasePublic';

const roleCanEdit = (role) => ['admin', 'editor'].includes(role);

const sectionCopy = {
  hero: ['Hero', 'Main introduction, headline, supporting copy, and primary call to action.'],
  meet_doctor: ['Meet Doctor', 'Doctor introduction, portrait area, credentials, and trust-building summary.'],
  practice_fit: ['Practice Fit', 'Who the practice is best suited for and who may need a different level of care.'],
  methods: ['Methods', 'Clinical approaches, modalities, and care philosophy.'],
  appointments: ['Appointments', 'Scheduling section, booking tiles, and IntakeQ scheduler area.'],
  services: ['Services', 'Overview of service categories and pathways into care.'],
  letter: ['Letter', 'Welcome letter or longer personal introduction.'],
  portrait: ['Portrait', 'Headshot/image area and accompanying introduction.'],
  signature: ['Signature', 'Closing note or physician signature block.'],
  featured_services: ['Featured Services', 'High-priority service cards and calls to action.'],
  care_options: ['Care Options', 'Detailed list of available treatment pathways.'],
  who_it_may_help: ['Who It May Help', 'Patient concerns, symptoms, or situations this page addresses.'],
  approach: ['Approach', 'How care is delivered and what the clinical frame feels like.'],
  cta: ['Call to Action', 'Final booking/contact prompt.'],
  process: ['Process', 'Step-by-step overview of evaluation or treatment flow.'],
  controlled_substances: ['Controlled Substances', 'Clinical boundaries and medication safety information.'],
  candidacy: ['Candidacy', 'Who may or may not be appropriate for this treatment.'],
  safety: ['Safety', 'Risks, screening, emergency boundaries, and clinical safeguards.'],
  practical_details: ['Practical Details', 'Logistics, appointment expectations, and preparation details.'],
  articles: ['Articles', 'Featured resource articles and educational content.'],
  faq: ['FAQ', 'Frequently asked questions grouped by topic.'],
  fees: ['Fees', 'Private-pay fees, billing, or appointment costs.'],
  insurance: ['Insurance', 'Insurance pathways, partner platforms, and coverage notes.'],
  superbills: ['Superbills', 'Out-of-network documentation and reimbursement guidance.'],
  booking: ['Booking', 'New patient scheduling and appointment selection.'],
  follow_up_booking: ['Follow-Up Booking', 'Established-patient scheduling options.'],
  portal: ['Portal', 'Patient portal access and secure messaging instructions.'],
  contact_form: ['Contact Form', 'Non-urgent inquiry form and patient communication boundaries.'],
  office_information: ['Office Information', 'Location, phone, email, and practical contact details.'],
  emergency_notice: ['Emergency Notice', 'Crisis and emergency-care instructions.'],
  policy: ['Policy', 'Privacy policy content container.'],
  notice: ['Notice', 'Notice of Privacy Practices content container.'],
  terms: ['Terms', 'Terms of use content container.'],
  emergency_disclaimer: ['Emergency Disclaimer', 'Clear notice that the website is not for emergencies.']
};

const defaultPageSeeds = [
  ['home','Home','Integrative Psychiatry | Douglas Zelisko, MD','Integrative psychiatric care, psychotherapy, medication management, and whole-person mental health care in West Hartford, Connecticut.',{ page:'home', sections:['hero','meet_doctor','practice_fit','methods','appointments','services'], note:'Editable homepage content container.' }],
  ['about','About Dr. Zelisko','About Douglas Zelisko, MD | Integrative Psychiatry','Learn about Douglas Zelisko, MD, a board-certified psychiatrist offering integrative psychiatric care in Connecticut.',{ page:'about', sections:['letter','portrait','signature'], note:'Editable About page content container.' }],
  ['services','Services Overview','Psychiatric Services | Integrative Psychiatry','Explore psychotherapy, medication management, psychiatric evaluation, ketamine-assisted psychotherapy, and integrative psychiatric care.',{ page:'services', sections:['featured_services','care_options','methods'], note:'Editable Services overview content container.' }],
  ['psychotherapy','Psychotherapy','Psychotherapy | Integrative Psychiatry','Psychotherapy with Douglas Zelisko, MD as part of integrative psychiatric care in West Hartford, Connecticut.',{ page:'psychotherapy', sections:['hero','who_it_may_help','approach','cta'], note:'Editable Psychotherapy page content container.' }],
  ['medication-management','Medication Management','Medication Management | Integrative Psychiatry','Thoughtful psychiatric medication management with Douglas Zelisko, MD in West Hartford, Connecticut.',{ page:'medication-management', sections:['hero','who_it_may_help','process','controlled_substances','cta'], note:'Editable Medication Management page content container.' }],
  ['ketamine-therapy','Ketamine-Assisted Psychotherapy','Ketamine-Assisted Psychotherapy | Integrative Psychiatry','A carefully screened, physician-guided approach to ketamine-assisted psychotherapy for selected patients.',{ page:'ketamine-therapy', sections:['hero','candidacy','process','safety','practical_details','cta'], note:'Editable Ketamine page content container.' }],
  ['resources','Resources & FAQ','Resources & FAQ | Integrative Psychiatry','Educational articles and frequently asked questions about psychiatric care, holistic psychiatry, ADHD, anxiety, fees, and appointments.',{ page:'resources', sections:['articles','faq'], note:'Articles and FAQs are managed in dedicated admin areas.' }],
  ['fees-insurance','Fees & Insurance','Fees & Insurance | Integrative Psychiatry','Information about fees, insurance pathways, private pay, out-of-network reimbursement, and superbills.',{ page:'fees-insurance', sections:['fees','insurance','superbills'], note:'Editable Fees & Insurance page content container.' }],
  ['new-patients','New Patients','New Patients | Integrative Psychiatry','Schedule a new patient psychiatric evaluation intake appointment with Douglas Zelisko, MD.',{ page:'new-patients', sections:['booking','practice_fit'], note:'Editable New Patients page content container.' }],
  ['current-patients','Current Patients','Current Patients | Integrative Psychiatry','Follow-up appointment scheduling and patient portal access for current patients.',{ page:'current-patients', sections:['follow_up_booking','portal'], note:'Editable Current Patients page content container.' }],
  ['contact','Contact','Contact | Integrative Psychiatry','Contact Integrative Psychiatry for non-urgent administrative and appointment-related communication.',{ page:'contact', sections:['contact_form','office_information','emergency_notice'], note:'Editable Contact page content container.' }],
  ['privacy-policy','Privacy Policy','Privacy Policy | Integrative Psychiatry','Privacy information for the Integrative Psychiatry website.',{ page:'privacy-policy', sections:['policy'], note:'Replace placeholder copy with attorney-reviewed language before final publication.' }],
  ['notice-of-privacy-practices','Notice of Privacy Practices','Notice of Privacy Practices | Integrative Psychiatry','HIPAA Notice of Privacy Practices for Integrative Psychiatry.',{ page:'notice-of-privacy-practices', sections:['notice'], note:'Replace placeholder copy with official HIPAA notice before final publication.' }],
  ['terms-of-use','Terms of Use','Terms of Use | Integrative Psychiatry','Terms of use for the Integrative Psychiatry website.',{ page:'terms-of-use', sections:['terms'], note:'Replace placeholder copy with attorney-reviewed language before final publication.' }],
  ['emergency-disclaimer','Emergency Disclaimer','Emergency Disclaimer | Integrative Psychiatry','Emergency disclaimer and crisis information for website visitors.',{ page:'emergency-disclaimer', sections:['emergency_disclaimer'], note:'This page tells visitors not to use the website for emergencies.' }]
];

function client() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase;
}

function Card({ children, className = '' }) {
  return <div className={`rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}

function Badge({ published }) {
  return <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${published ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>{published ? 'Published' : 'Draft'}</span>;
}

function parseJson(value) {
  if (typeof value === 'object' && value) return value;
  try { return JSON.parse(value || '{}'); } catch { return {}; }
}

function sectionTitle(key) {
  return sectionCopy[key]?.[0] || String(key || 'Section').replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function sectionDescription(key) {
  return sectionCopy[key]?.[1] || 'Editable content section for this page.';
}

function sectionItems(parsed) {
  if (Array.isArray(parsed.section_details)) return parsed.section_details;
  const sections = Array.isArray(parsed.sections) ? parsed.sections : [];
  return sections.map((key) => ({ key, title: sectionTitle(key), description: sectionDescription(key) }));
}

function textPreview(value, fallback = 'No preview yet.') {
  const text = typeof value === 'string' ? value : value ? JSON.stringify(value) : '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean ? clean.slice(0, 180) + (clean.length > 180 ? '…' : '') : fallback;
}

async function audit(action, resource_type, resource_id, metadata = {}) {
  try {
    const supabase = client();
    const { data } = await supabase.auth.getUser();
    await supabase.from('audit_log').insert({ actor_id: data?.user?.id || null, action, resource_type, resource_id: resource_id ? String(resource_id) : null, metadata });
  } catch {}
}

async function seedPages() {
  const rows = defaultPageSeeds.map(([slug, title, seo_title, seo_description, content_json], index) => ({
    slug,
    title,
    seo_title,
    seo_description,
    content_json,
    published: true,
    sort_order: index + 1
  }));
  const result = await client().from('pages').upsert(rows, { onConflict: 'slug' });
  if (result.error) throw result.error;
  await audit('seed_pages', 'pages', 'defaults', { count: rows.length });
  return rows.length;
}

async function reorderRows(rows, index, direction, reload) {
  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= rows.length) return;
  const current = rows[index];
  const other = rows[target];
  const currentOrder = Number.isFinite(Number(current.sort_order)) ? Number(current.sort_order) : index + 1;
  const otherOrder = Number.isFinite(Number(other.sort_order)) ? Number(other.sort_order) : target + 1;
  const supabase = client();
  const a = await supabase.from('pages').update({ sort_order: otherOrder }).eq('id', current.id);
  if (a.error) throw a.error;
  const b = await supabase.from('pages').update({ sort_order: currentOrder }).eq('id', other.id);
  if (b.error) throw b.error;
  await audit('reorder', 'pages', current.id, { direction, swapped_with: other.id });
  await reload();
}

function PageVisualPreview({ form }) {
  const parsed = parseJson(form.content_json);
  const sections = sectionItems(parsed);
  const pageKey = parsed.page || form.slug || 'page';
  const hero = parsed.hero || {};
  const heading = hero.headline || form.title || 'Untitled page';
  const subtitle = hero.subtitle || form.seo_description || 'Page description preview will appear here.';

  return <Card className="sticky top-6 overflow-hidden bg-[#fbfaf7] p-0">
    <div className="bg-[radial-gradient(circle_at_top_left,#edf8f1,transparent_42%),#173f42] p-7 text-white">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9fcf9a]">Page preview</p>
      <h2 className="mt-4 text-3xl font-semibold text-white">{heading}</h2>
      <p className="mt-4 leading-7 text-slate-100">{subtitle}</p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
        <span className="rounded-full bg-white/15 px-3 py-1.5">/{form.slug || pageKey}</span>
        <span className="rounded-full bg-white/15 px-3 py-1.5">{sections.length} sections</span>
      </div>
    </div>

    <div className="space-y-5 p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2f8c85]">SEO display</p>
        <h3 className="mt-3 text-lg font-semibold text-slate-950">{form.seo_title || form.title || 'SEO title'}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">{form.seo_description || 'SEO description preview will appear here.'}</p>
      </div>

      {sections.length > 0 ? <div className="grid gap-3">
        {sections.map((section, index) => {
          const key = section.key || section.id || section.title || `section-${index}`;
          return <div key={`${key}-${index}`} className="rounded-2xl border border-[#dbe7e1] bg-white p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#173f42] text-sm font-bold text-white">{index + 1}</span>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">{section.title || sectionTitle(key)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{section.description || section.body || sectionDescription(key)}</p>
              </div>
            </div>
          </div>;
        })}
      </div> : <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">No sections are listed yet. Add section keys in the JSON editor to build the page preview.</div>}

      {parsed.note && <div className="rounded-2xl border border-[#e8d8b8] bg-[#fffaf0] p-5 text-sm leading-6 text-[#5a3b1e]"><strong>Editor note:</strong> {parsed.note}</div>}

      <details className="rounded-2xl border border-slate-200 bg-white p-5">
        <summary className="cursor-pointer text-sm font-bold uppercase tracking-[0.16em] text-slate-600">Advanced JSON</summary>
        <pre className="mt-4 max-h-72 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{JSON.stringify(parsed, null, 2)}</pre>
      </details>
    </div>
  </Card>;
}

function ReorderButtons({ rows, index, reload, canEdit }) {
  const [busy, setBusy] = useState(false);
  async function move(direction) {
    if (!canEdit || busy) return;
    setBusy(true);
    try { await reorderRows(rows, index, direction, reload); } finally { setBusy(false); }
  }
  return <div className="flex gap-2"><button type="button" disabled={!canEdit || busy || index === 0} onClick={() => move('up')} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-40">↑ Up</button><button type="button" disabled={!canEdit || busy || index === rows.length - 1} onClick={() => move('down')} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-40">↓ Down</button></div>;
}

export function PagesAdminEnhanced() {
  return <AdminGate>{(profile) => <PagesEditor profile={profile} />}</AdminGate>;
}

function PagesEditor({ profile }) {
  const canEdit = roleCanEdit(profile.role);
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ slug:'', title:'', seo_title:'', seo_description:'', content_json:'{}', sort_order:0, published:true });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  async function load() {
    setLoading(true);
    const { data, error } = await client().from('pages').select('*').order('sort_order', { ascending: true });
    if (error) {
      setMsg('Unable to load pages. Make sure the pages table exists and your account has access.');
      setRows([]);
    } else {
      setRows(data || []);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function start(row = null) {
    const next = row || { slug:'', title:'', seo_title:'', seo_description:'', content_json:{ page:'', sections:[], note:'' }, sort_order:rows.length + 1, published:true };
    setEditing(row?.id || 'new');
    setForm({
      ...next,
      content_json: typeof next.content_json === 'object' ? JSON.stringify(next.content_json, null, 2) : next.content_json
    });
    setMsg('');
  }

  async function seed() {
    if (!canEdit) return;
    setMsg('Seeding page records…');
    try {
      const count = await seedPages();
      await load();
      setMsg(`Seeded ${count} page records.`);
    } catch {
      setMsg('Unable to seed pages. Make sure your account has editor/admin access.');
    }
  }

  async function save(e) {
    e.preventDefault();
    if (!canEdit) return setMsg('Your role cannot edit pages.');
    let content_json = {};
    try { content_json = JSON.parse(form.content_json || '{}'); } catch { return setMsg('Content JSON is not valid. Fix the JSON before saving.'); }
    const payload = {
      slug: form.slug,
      title: form.title,
      seo_title: form.seo_title,
      seo_description: form.seo_description,
      content_json,
      sort_order: Number(form.sort_order || 0),
      published: Boolean(form.published)
    };
    const result = editing === 'new'
      ? await client().from('pages').insert(payload).select('id').single()
      : await client().from('pages').update(payload).eq('id', editing).select('id').single();
    if (result.error) return setMsg('Unable to save page.');
    await audit(editing === 'new' ? 'create_page' : 'update_page', 'pages', result.data?.id || editing);
    setEditing(null);
    await load();
  }

  return <div className="space-y-5">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Pages</h2>
        <p className="mt-1 text-slate-600">Pages now show a readable visual preview instead of only a JSON summary. JSON is still available under Advanced JSON.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {canEdit && <button onClick={seed} className="rounded-2xl border border-[#9fcf9a] bg-[#edf8f1] px-5 py-3 font-semibold text-[#173f42]">Seed defaults</button>}
        {canEdit && <button onClick={() => start()} className="rounded-2xl bg-[#173f42] px-5 py-3 font-semibold text-white">New page</button>}
      </div>
    </div>

    {msg && <Card><p className="font-semibold text-[#173f42]">{msg}</p></Card>}

    {editing && <form onSubmit={save} className="grid gap-5 lg:grid-cols-[1fr_.95fr]">
      <Card className="grid gap-4">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#2f8c85]">Editor</p>
        {['slug','title','seo_title','seo_description','sort_order'].map((field) => <label key={field} className="grid gap-2 text-sm font-semibold text-slate-700"><span>{field.replaceAll('_',' ')}</span>{field === 'seo_description' ? <textarea value={form[field] || ''} onChange={(e) => setForm({...form, [field]: e.target.value})} className="min-h-24 rounded-2xl border border-slate-300 p-3 font-normal" /> : <input type={field === 'sort_order' ? 'number' : 'text'} value={form[field] || ''} onChange={(e) => setForm({...form, [field]: e.target.value})} className="rounded-2xl border border-slate-300 p-3 font-normal" />}</label>)}
        <label className="grid gap-2 text-sm font-semibold text-slate-700"><span>advanced content JSON</span><textarea value={form.content_json || ''} onChange={(e) => setForm({...form, content_json: e.target.value})} className="min-h-80 rounded-2xl border border-slate-300 p-3 font-mono text-sm" /></label>
        <label className="flex gap-3"><input type="checkbox" checked={!!form.published} onChange={(e) => setForm({...form, published:e.target.checked})}/> Published</label>
        <div className="flex flex-wrap gap-3"><button className="rounded-2xl bg-[#173f42] px-5 py-3 font-semibold text-white">Save</button><button type="button" onClick={() => setEditing(null)} className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold">Cancel</button></div>
      </Card>
      <PageVisualPreview form={form} />
    </form>}

    {loading && <Card>Loading pages…</Card>}

    <div className="grid gap-4 md:grid-cols-2">
      {rows.map((row, index) => {
        const parsed = parseJson(row.content_json);
        const sections = sectionItems(parsed);
        return <Card key={row.id} className="h-full transition hover:shadow-xl">
          <div className="flex items-start justify-between gap-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2f8c85]">/{row.slug || 'missing-slug'}</p><Badge published={row.published} /></div>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">{row.title || 'Untitled page'}</h3>
          <p className="mt-2 text-sm text-slate-500">Sort {row.sort_order ?? 0} · {sections.length} sections</p>
          <p className="mt-4 leading-7 text-slate-700">{textPreview(row.seo_description || parsed.note)}</p>
          {sections.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{sections.slice(0, 5).map((section, i) => <span key={`${section.key || section.title}-${i}`} className="rounded-full bg-[#edf8f1] px-3 py-1 text-xs font-semibold text-[#173f42]">{section.title || sectionTitle(section.key)}</span>)}</div>}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={() => start(row)} className="rounded-2xl bg-[#173f42] px-4 py-2 text-sm font-semibold text-white">Edit</button><ReorderButtons rows={rows} index={index} reload={load} canEdit={canEdit} /></div>
        </Card>;
      })}
      {!loading && rows.length === 0 && <Card><h3 className="text-lg font-semibold text-slate-950">No pages yet</h3><p className="mt-2 text-slate-600">Use “Seed defaults” to populate the CMS.</p></Card>}
    </div>
  </div>;
}
