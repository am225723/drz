'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '../../lib/supabasePublic';
import { AdminGate } from './AdminComponents';

function client() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase;
}

function Card({ children, className = '' }) {
  return <div className={`rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}

function Badge({ status }) {
  const c = status === 'reviewed' ? 'bg-blue-50 text-blue-800 border-blue-200' : status === 'archived' ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200';
  return <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${c}`}>{status || 'new'}</span>;
}

function valueList(value) {
  return Array.isArray(value) ? value.join(', ') : value || '';
}

function MessageComposer({ row }) {
  const [channel, setChannel] = useState('sms');
  const [tone, setTone] = useState('warm, professional, concise');
  const [instruction, setInstruction] = useState('Thank them for reaching out and tell them the next step.');
  const [subject, setSubject] = useState('Follow-up from Integrative Psychiatry');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [logs, setLogs] = useState([]);

  async function authHeaders() {
    const { data } = await client().auth.getSession();
    const token = data?.session?.access_token;
    if (!token) throw new Error('You are not signed in.');
    return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  }

  async function loadLogs() {
    try {
      const { data } = await client().from('communication_log').select('*').eq('submission_id', row.id).order('created_at', { ascending: false }).limit(10);
      setLogs(data || []);
    } catch {}
  }

  useEffect(() => { loadLogs(); }, [row.id]);

  async function request(action) {
    setBusy(true);
    setMsg(action === 'draft' ? 'Drafting message…' : 'Sending message…');
    try {
      const response = await fetch('/api/admin/submission-message', {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({ action, channel, submissionId: row.id, tone, instruction, subject, body }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) throw new Error(data.error || 'Request failed.');
      if (action === 'draft') {
        setSubject(data.draft?.subject || 'Follow-up from Integrative Psychiatry');
        setBody(data.draft?.body || '');
        setMsg('Draft created. Please review and edit before sending.');
      } else {
        setMsg(channel === 'sms' ? 'Text message sent.' : 'Email sent.');
      }
      await loadLogs();
    } catch (err) {
      setMsg(err.message || 'Unable to complete request.');
    } finally {
      setBusy(false);
    }
  }

  return <Card className="border-[#9fcf9a] bg-[#f6fbf4]">
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#2f8c85]">AI draft + send</p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-950">Create response</h3>
        <p className="mt-2 leading-7 text-slate-700">Draft a text or email from this submission, edit it, then send through the configured server-side provider.</p>
      </div>
      <div className="rounded-2xl bg-white p-4 text-sm text-slate-700">
        <p><strong>SMS:</strong> {row.mobile || 'No mobile'}</p>
        <p><strong>Email:</strong> {row.email || 'No email'}</p>
      </div>
    </div>

    <div className="mt-6 grid gap-4 md:grid-cols-3">
      <label className="font-semibold text-slate-800">Channel<select value={channel} onChange={e => setChannel(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3"><option value="sms">Text message</option><option value="email">Email</option></select></label>
      <label className="font-semibold text-slate-800 md:col-span-2">Tone / style<input value={tone} onChange={e => setTone(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3" /></label>
    </div>

    <label className="mt-4 block font-semibold text-slate-800">Instruction for AI<textarea value={instruction} onChange={e => setInstruction(e.target.value)} className="mt-2 min-h-24 w-full rounded-2xl border border-slate-300 bg-white p-4" /></label>

    {channel === 'email' && <label className="mt-4 block font-semibold text-slate-800">Subject<input value={subject} onChange={e => setSubject(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3" /></label>}

    <label className="mt-4 block font-semibold text-slate-800">Message body<textarea value={body} onChange={e => setBody(e.target.value)} className="mt-2 min-h-48 w-full rounded-2xl border border-slate-300 bg-white p-4" /></label>

    <div className="mt-4 flex flex-wrap gap-3">
      <button type="button" disabled={busy} onClick={() => request('draft')} className="rounded-2xl border border-[#9fcf9a] bg-white px-5 py-3 font-semibold text-[#173f42] disabled:opacity-60">Draft with AI</button>
      <button type="button" disabled={busy || !body.trim()} onClick={() => request('send')} className="rounded-2xl bg-[#173f42] px-5 py-3 font-semibold text-white disabled:opacity-60">Send {channel === 'sms' ? 'Text' : 'Email'}</button>
    </div>

    {msg && <p className="mt-4 rounded-2xl bg-white p-4 font-semibold text-[#173f42]">{msg}</p>}

    <div className="mt-6">
      <h4 className="font-semibold text-slate-950">Recent communication log</h4>
      <div className="mt-3 space-y-3">
        {logs.map(log => <div key={log.id} className="rounded-2xl bg-white p-4 text-sm text-slate-700"><div className="flex flex-wrap gap-2"><strong>{log.channel?.toUpperCase()}</strong><span>·</span><span>{log.status}</span><span>·</span><span>{log.created_at ? new Date(log.created_at).toLocaleString() : ''}</span></div><p className="mt-2 whitespace-pre-wrap">{String(log.body || '').slice(0, 260)}{String(log.body || '').length > 260 ? '…' : ''}</p>{log.error && <p className="mt-2 text-rose-800">{log.error}</p>}</div>)}
        {logs.length === 0 && <p className="rounded-2xl bg-white p-4 text-sm text-slate-500">No communication log yet.</p>}
      </div>
    </div>
  </Card>;
}

export default function SubmissionCommunications({ id }) {
  const [row, setRow] = useState(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const { data, error } = await client().from('contact_submissions').select('*').eq('id', id).single();
      if (error) throw error;
      setRow(data);
      setNotes(data.admin_notes || '');
    } catch {
      setError('Unable to load submission.');
    }
  }

  useEffect(() => { load(); }, [id]);

  async function save(status) {
    setSaving(true); setError('');
    try {
      const patch = { admin_notes: notes };
      if (status) { patch.status = status; if (status === 'reviewed') patch.reviewed_at = new Date().toISOString(); }
      const { error } = await client().from('contact_submissions').update(patch).eq('id', id);
      if (error) throw error;
      await load();
    } catch {
      setError('Unable to update submission. Admin role is required.');
    } finally { setSaving(false); }
  }

  const pairs = row ? [
    ['Full legal name', row.full_name], ['Preferred name', row.preferred_name], ['Date of birth', row.dob], ['Mobile', row.mobile], ['Email', row.email], ['Contact preference', valueList(row.contact_preference)], ['Voicemail consent', row.voicemail_consent ? 'Yes' : 'No'], ['Visit type', row.visit_type], ['Availability', valueList(row.availability)], ['Reason for care', row.reason_for_care], ['Brief context', row.brief_context], ['Payment type', valueList(row.payment_type)], ['Insurance provider', row.insurance_provider], ['Out-of-network acknowledgment', row.oon_acknowledgment ? 'Yes' : 'No'], ['Submitted', row.created_at ? new Date(row.created_at).toLocaleString() : '']
  ] : [];

  return <AdminGate>{() => <div className="space-y-5">
    <Link href="/admin/submissions" className="inline-flex rounded-2xl bg-white px-4 py-2 font-semibold text-[#173f42] shadow-sm">← Back</Link>
    {error && <Card><p className="text-rose-900">{error}</p></Card>}
    {!row ? <Card>Loading…</Card> : <>
      <Card><div className="flex justify-between gap-4"><div><h2 className="text-2xl font-semibold text-slate-950">{row.full_name}</h2><p className="mt-1 text-slate-600">{row.id}</p></div><Badge status={row.status} /></div></Card>
      <MessageComposer row={row} />
      <Card><div className="grid gap-4 md:grid-cols-2">{pairs.map(([label, value]) => <div key={label} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 whitespace-pre-wrap text-slate-950">{value || 'Not provided'}</p></div>)}</div></Card>
      <Card><h3 className="text-xl font-semibold text-slate-950">Admin notes</h3><textarea value={notes} onChange={e => setNotes(e.target.value)} className="mt-4 min-h-36 w-full rounded-2xl border border-slate-300 p-4" /><div className="mt-4 flex flex-wrap gap-3"><button disabled={saving} onClick={() => save()} className="rounded-2xl bg-[#173f42] px-5 py-3 font-semibold text-white disabled:opacity-60">Save notes</button><button disabled={saving} onClick={() => save('reviewed')} className="rounded-2xl bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-60">Mark reviewed</button><button disabled={saving} onClick={() => save('archived')} className="rounded-2xl bg-slate-700 px-5 py-3 font-semibold text-white disabled:opacity-60">Archive</button></div></Card>
    </>}
  </div>}</AdminGate>;
}
