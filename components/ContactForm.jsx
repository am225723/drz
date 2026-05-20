'use client';
import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { getSubmitContactUrl } from '../lib/supabasePublic';

const reasons = ['Anxiety', 'Depression', 'ADHD', 'Medication Management', 'Psychotherapy', 'Ketamine-Assisted Psychotherapy', 'Trauma / PTSD', 'Sleep Concerns', 'Substance Use / Relapse Prevention', 'Relationship Concerns', 'Diagnostic Clarification / Second Opinion', 'Other'];
const insurers = ['Aetna', 'Anthem / Blue Cross Blue Shield', 'Cigna', 'ConnectiCare', 'Harvard Pilgrim', 'Optum / UnitedHealthcare', 'Oxford', 'Medicaid / HUSKY', 'Medicare', 'Private Pay', 'Other / Not Sure'];
const initial = { fullName: '', preferredName: '', dob: '', mobile: '', email: '', contactPreference: [], voicemailConsent: false, visitType: '', availability: [], reasonForCare: '', briefContext: '', paymentType: [], insuranceProvider: '', oonAcknowledgment: false, website: '' };

function toggleArray(value, item) { return value.includes(item) ? value.filter((x) => x !== item) : [...value, item]; }
function Check({ label, checked, onChange }) { return <label className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700"><input className="mt-1 accent-[#173f42]" type="checkbox" checked={checked} onChange={onChange} /> {label}</label>; }
function Field({ label, children }) { return <div><label className="mb-2 block font-semibold text-slate-800">{label}</label>{children}</div>; }

function getClientValidationError(form) {
  if (!form.fullName.trim()) return 'Please enter your full legal name.';
  if (!form.dob) return 'Please enter your date of birth.';
  if (!form.mobile.trim()) return 'Please enter your mobile phone number.';
  if (!form.email.trim()) return 'Please enter your email address.';
  if (!form.visitType) return 'Please select telehealth or in-person.';
  if (!form.reasonForCare) return 'Please select a reason for care.';
  return '';
}

export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function submit(e) {
    e.preventDefault();
    const validationError = getClientValidationError(form);
    if (validationError) {
      setStatus({ type: 'error', message: validationError });
      return;
    }

    const endpoint = getSubmitContactUrl();
    if (!endpoint) {
      setStatus({ type: 'error', message: 'The secure contact endpoint is not configured yet. Please use the Patient Portal or call the office.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'loading', message: 'Submitting secure inquiry…' });
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) throw new Error(data.error || 'Submission failed');
      setStatus({ type: 'success', message: 'Thank you. Your inquiry was received. The practice will follow up using your selected contact preference.' });
      setForm(initial);
    } catch {
      setStatus({ type: 'error', message: 'There was a problem submitting the form. Please use the Patient Portal or call the office.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return <section className="mx-auto mt-10 max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200"><div className="bg-[#173f42] p-8 text-white"><p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9fcf9a]">Secure inquiry request</p><h2 className="mt-3 text-3xl font-semibold text-white">Contact the practice</h2><p className="mt-3 max-w-3xl leading-7 text-slate-100">Use this form for non-urgent appointment and administrative requests.</p><div className="mt-6 rounded-2xl border border-amber-200/40 bg-amber-300/10 p-5 text-amber-50"><div className="mb-2 flex gap-2 font-semibold"><AlertTriangle className="h-5 w-5" /> Emergencies</div>Please do not use this form for emergencies or urgent clinical concerns. This form is intended for non-urgent administrative and appointment-related communication. If you are experiencing a psychiatric emergency, call 911, go to the nearest emergency room, or call/text 988.</div></div><form onSubmit={submit} className="grid gap-8 p-8"><input type="text" className="hidden" value={form.website} onChange={(e) => set('website', e.target.value)} tabIndex="-1" autoComplete="off" aria-hidden="true" />
    <fieldset className="rounded-[1.5rem] border border-slate-200 p-6"><legend className="px-2 font-bold text-[#173f42]">Essential Information</legend><div className="grid gap-5 md:grid-cols-2"><Field label="Full legal name *"><input required className="w-full rounded-2xl border border-slate-300 p-3" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} /></Field><Field label="Preferred name"><input className="w-full rounded-2xl border border-slate-300 p-3" value={form.preferredName} onChange={(e) => set('preferredName', e.target.value)} /></Field><Field label="Date of birth *"><input required type="date" className="w-full rounded-2xl border border-slate-300 p-3" value={form.dob} onChange={(e) => set('dob', e.target.value)} /></Field><Field label="Mobile phone *"><input required type="tel" className="w-full rounded-2xl border border-slate-300 p-3" value={form.mobile} onChange={(e) => set('mobile', e.target.value)} /></Field><Field label="Email *"><input required type="email" className="w-full rounded-2xl border border-slate-300 p-3" value={form.email} onChange={(e) => set('email', e.target.value)} /></Field><div><p className="mb-2 font-semibold">Preferred contact method</p><div className="grid gap-2 sm:grid-cols-3">{['Text', 'Call', 'Email'].map((x) => <Check key={x} label={x} checked={form.contactPreference.includes(x)} onChange={() => set('contactPreference', toggleArray(form.contactPreference, x))} />)}</div></div></div><div className="mt-5"><Check label="I give permission for the practice to leave voicemail messages at the number provided." checked={form.voicemailConsent} onChange={() => set('voicemailConsent', !form.voicemailConsent)} /></div></fieldset>
    <fieldset className="rounded-[1.5rem] border border-slate-200 p-6"><legend className="px-2 font-bold text-[#173f42]">Appointment Details</legend><div className="grid gap-5 md:grid-cols-2"><Field label="Visit type *"><select required className="w-full rounded-2xl border border-slate-300 p-3" value={form.visitType} onChange={(e) => set('visitType', e.target.value)}><option value="">Select one</option><option>Telehealth</option><option>In-person</option></select></Field><div><p className="mb-2 font-semibold">Availability</p><div className="grid gap-2 sm:grid-cols-3">{['Mornings', 'Afternoons', 'Evenings'].map((x) => <Check key={x} label={x} checked={form.availability.includes(x)} onChange={() => set('availability', toggleArray(form.availability, x))} />)}</div></div><Field label="Reason for care *"><select required className="w-full rounded-2xl border border-slate-300 p-3" value={form.reasonForCare} onChange={(e) => set('reasonForCare', e.target.value)}><option value="">Select one</option>{reasons.map((r) => <option key={r}>{r}</option>)}</select></Field><Field label="Any brief context you wish to share"><textarea maxLength={600} className="min-h-28 w-full rounded-2xl border border-slate-300 p-3" value={form.briefContext} onChange={(e) => set('briefContext', e.target.value)} /></Field></div></fieldset>
    <fieldset className="rounded-[1.5rem] border border-slate-200 p-6"><legend className="px-2 font-bold text-[#173f42]">Financial Screening</legend><div className="grid gap-5 md:grid-cols-2"><div><p className="mb-2 font-semibold">Payment type</p><div className="grid gap-2 sm:grid-cols-2">{['Using Insurance', 'Private Pay'].map((x) => <Check key={x} label={x} checked={form.paymentType.includes(x)} onChange={() => set('paymentType', toggleArray(form.paymentType, x))} />)}</div></div><Field label="Insurance provider"><select className="w-full rounded-2xl border border-slate-300 p-3" value={form.insuranceProvider} onChange={(e) => set('insuranceProvider', e.target.value)}><option value="">Select one</option>{insurers.map((i) => <option key={i}>{i}</option>)}</select></Field></div><div className="mt-5"><Check label="I understand that if my plan is not accepted or services are out-of-network, I may be responsible for private-pay rates and/or seeking reimbursement." checked={form.oonAcknowledgment} onChange={() => set('oonAcknowledgment', !form.oonAcknowledgment)} /></div></fieldset>
    {status.message && <div role="status" className={`rounded-2xl p-4 font-semibold ${status.type === 'error' ? 'bg-rose-50 text-rose-900' : 'bg-[#edf8f1] text-[#173f42]'}`}>{status.message}</div>}<button disabled={isSubmitting} className="rounded-2xl bg-[#173f42] px-6 py-4 font-bold text-white hover:bg-[#24565a] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Submitting…' : 'Submit Secure Inquiry'}</button></form></section>;
}
