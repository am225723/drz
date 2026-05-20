import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

type ContactPayload = {
  fullName?: string;
  preferredName?: string;
  dob?: string;
  mobile?: string;
  email?: string;
  contactPreference?: string[];
  voicemailConsent?: boolean;
  visitType?: string;
  availability?: string[];
  reasonForCare?: string;
  briefContext?: string;
  paymentType?: string[];
  insuranceProvider?: string;
  oonAcknowledgment?: boolean;
  website?: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('CONTACT_ALLOWED_ORIGIN') || '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function clean(value: unknown, max = 2000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function cleanArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => clean(item, 120)).filter(Boolean).slice(0, 12);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function requireEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function formatBool(value: boolean | undefined) {
  return value ? 'Yes' : 'No';
}

function formatList(value: string[]) {
  return value.length ? value.join(', ') : 'Not provided';
}

function buildEmailText(submissionId: string, createdAt: string, payload: Required<Omit<ContactPayload, 'website'>>) {
  return `New website inquiry received. This email may contain PHI and should be handled according to practice policy.\n\nSubmission ID: ${submissionId}\nSubmitted: ${createdAt}\n\nPATIENT\nFull legal name: ${payload.fullName}\nPreferred name: ${payload.preferredName || 'Not provided'}\nDate of birth: ${payload.dob || 'Not provided'}\nMobile: ${payload.mobile}\nEmail: ${payload.email}\n\nCONTACT\nPreferred contact method: ${formatList(payload.contactPreference)}\nVoicemail consent: ${formatBool(payload.voicemailConsent)}\n\nAPPOINTMENT\nVisit type: ${payload.visitType}\nAvailability: ${formatList(payload.availability)}\nReason for care: ${payload.reasonForCare}\nBrief context: ${payload.briefContext || 'Not provided'}\n\nFINANCIAL\nPayment type: ${formatList(payload.paymentType)}\nInsurance provider: ${payload.insuranceProvider || 'Not provided'}\nOut-of-network acknowledgment: ${formatBool(payload.oonAcknowledgment)}\n`;
}

function buildEmailHtml(submissionId: string, createdAt: string, payload: Required<Omit<ContactPayload, 'website'>>) {
  const rows = [
    ['Submission ID', submissionId],
    ['Submitted', createdAt],
    ['Full legal name', payload.fullName],
    ['Preferred name', payload.preferredName || 'Not provided'],
    ['Date of birth', payload.dob || 'Not provided'],
    ['Mobile', payload.mobile],
    ['Email', payload.email],
    ['Preferred contact method', formatList(payload.contactPreference)],
    ['Voicemail consent', formatBool(payload.voicemailConsent)],
    ['Visit type', payload.visitType],
    ['Availability', formatList(payload.availability)],
    ['Reason for care', payload.reasonForCare],
    ['Brief context', payload.briefContext || 'Not provided'],
    ['Payment type', formatList(payload.paymentType)],
    ['Insurance provider', payload.insuranceProvider || 'Not provided'],
    ['Out-of-network acknowledgment', formatBool(payload.oonAcknowledgment)],
  ];
  return `<div style="font-family:Arial,sans-serif;color:#173f42"><h1>New Website Inquiry — PHI</h1><p>This email may contain PHI and should be handled according to practice policy.</p><table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:760px">${rows.map(([label, value]) => `<tr><th style="border:1px solid #d6e7c7;text-align:left;background:#edf8f1;width:220px">${escapeHtml(label)}</th><td style="border:1px solid #d6e7c7">${escapeHtml(value)}</td></tr>`).join('')}</table></div>`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char] || char));
}

async function sendEmail(payload: { to: string; from: string; replyTo: string; subject: string; text: string; html: string }) {
  const provider = (Deno.env.get('EMAIL_PROVIDER') || 'resend').toLowerCase();

  if (provider === 'resend') {
    const apiKey = requireEnv('RESEND_API_KEY');
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: payload.from, to: [payload.to], reply_to: payload.replyTo, subject: payload.subject, text: payload.text, html: payload.html }),
    });
    if (!res.ok) throw new Error('Email provider failed');
    return;
  }

  if (provider === 'postmark') {
    const token = requireEnv('POSTMARK_SERVER_TOKEN');
    const res = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: { 'X-Postmark-Server-Token': token, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ From: payload.from, To: payload.to, ReplyTo: payload.replyTo, Subject: payload.subject, TextBody: payload.text, HtmlBody: payload.html, MessageStream: Deno.env.get('POSTMARK_MESSAGE_STREAM') || 'outbound' }),
    });
    if (!res.ok) throw new Error('Email provider failed');
    return;
  }

  if (provider === 'sendgrid') {
    const apiKey = requireEnv('SENDGRID_API_KEY');
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: payload.to }] }],
        from: { email: payload.from },
        reply_to: { email: payload.replyTo },
        subject: payload.subject,
        content: [{ type: 'text/plain', value: payload.text }, { type: 'text/html', value: payload.html }],
      }),
    });
    if (!res.ok) throw new Error('Email provider failed');
    return;
  }

  throw new Error('Unsupported EMAIL_PROVIDER');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  try {
    const raw = await req.json().catch(() => null) as ContactPayload | null;
    if (!raw) return json({ ok: false, error: 'Invalid request body' }, 400);

    // Honeypot: pretend success so bots do not learn anything.
    if (clean(raw.website, 200)) return json({ ok: true });

    const now = new Date();
    const normalized = {
      fullName: clean(raw.fullName, 160),
      preferredName: clean(raw.preferredName, 160),
      dob: clean(raw.dob, 20),
      mobile: clean(raw.mobile, 60),
      email: clean(raw.email, 160).toLowerCase(),
      contactPreference: cleanArray(raw.contactPreference),
      voicemailConsent: Boolean(raw.voicemailConsent),
      visitType: clean(raw.visitType, 80),
      availability: cleanArray(raw.availability),
      reasonForCare: clean(raw.reasonForCare, 160),
      briefContext: clean(raw.briefContext, 1000),
      paymentType: cleanArray(raw.paymentType),
      insuranceProvider: clean(raw.insuranceProvider, 160),
      oonAcknowledgment: Boolean(raw.oonAcknowledgment),
    };

    const errors: string[] = [];
    if (!normalized.fullName) errors.push('Full legal name is required.');
    if (!normalized.dob) errors.push('Date of birth is required.');
    if (!normalized.mobile) errors.push('Mobile phone is required.');
    if (!normalized.email || !isEmail(normalized.email)) errors.push('A valid email is required.');
    if (!normalized.visitType) errors.push('Visit type is required.');
    if (!normalized.reasonForCare) errors.push('Reason for care is required.');
    if (errors.length) return json({ ok: false, error: errors.join(' ') }, 400);

    const supabase = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('contact_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('email', normalized.email)
      .gte('created_at', oneHourAgo);

    if ((count || 0) >= Number(Deno.env.get('CONTACT_RATE_LIMIT_PER_HOUR') || 3)) {
      return json({ ok: false, error: 'Too many submissions. Please call the office or try again later.' }, 429);
    }

    const { data, error } = await supabase.from('contact_submissions').insert({
      full_name: normalized.fullName,
      preferred_name: normalized.preferredName,
      dob: normalized.dob,
      mobile: normalized.mobile,
      email: normalized.email,
      contact_preference: normalized.contactPreference,
      voicemail_consent: normalized.voicemailConsent,
      visit_type: normalized.visitType,
      availability: normalized.availability,
      reason_for_care: normalized.reasonForCare,
      brief_context: normalized.briefContext,
      payment_type: normalized.paymentType,
      insurance_provider: normalized.insuranceProvider,
      oon_acknowledgment: normalized.oonAcknowledgment,
      status: 'new',
    }).select('id, created_at').single();

    if (error) throw new Error('Database insert failed');

    const to = requireEnv('CONTACT_EMAIL_TO');
    const from = requireEnv('CONTACT_EMAIL_FROM');
    const subject = Deno.env.get('CONTACT_EMAIL_SUBJECT') || 'New Website Inquiry — PHI';
    const text = buildEmailText(data.id, data.created_at, normalized);
    const html = buildEmailHtml(data.id, data.created_at, normalized);
    await sendEmail({ to, from, replyTo: normalized.email, subject, text, html });

    return json({ ok: true, id: data.id });
  } catch (_error) {
    // Intentionally avoid logging request body/PHI.
    return json({ ok: false, error: 'The inquiry could not be submitted. Please call the office or use the Patient Portal.' }, 500);
  }
});
