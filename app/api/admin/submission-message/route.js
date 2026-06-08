import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase server environment is not configured.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function json(body, status = 200) {
  return Response.json(body, { status });
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function submissionSummary(row) {
  return [
    `Name: ${row.full_name || 'Not provided'}`,
    `Preferred name: ${row.preferred_name || 'Not provided'}`,
    `Email: ${row.email || 'Not provided'}`,
    `Mobile: ${row.mobile || 'Not provided'}`,
    `Visit type: ${row.visit_type || 'Not provided'}`,
    `Reason for care: ${row.reason_for_care || 'Not provided'}`,
    `Brief context: ${row.brief_context || 'Not provided'}`,
    `Payment type: ${Array.isArray(row.payment_type) ? row.payment_type.join(', ') : 'Not provided'}`,
    `Insurance provider: ${row.insurance_provider || 'Not provided'}`,
  ].join('\n');
}

async function requireAdminUser(req, supabase) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return { error: json({ ok: false, error: 'Missing authorization.' }, 401) };

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user?.id) return { error: json({ ok: false, error: 'Not authenticated.' }, 401) };

  const profile = await supabase.from('profiles').select('id,email,role').eq('id', data.user.id).single();
  if (profile.error || !profile.data || !['admin', 'editor'].includes(profile.data.role)) {
    return { error: json({ ok: false, error: 'Not authorized.' }, 403) };
  }

  return { user: data.user, profile: profile.data };
}

function fallbackDraft({ channel, tone, submission }) {
  const name = submission.preferred_name || submission.full_name || 'there';
  if (channel === 'sms') {
    return {
      body: `Hi ${name}, this is Integrative Psychiatry. Thank you for reaching out. We reviewed your inquiry and wanted to follow up. You can reply here for non-urgent administrative questions, or use the patient portal for secure communication if you are an established patient. If this is an emergency, please call 911, go to the nearest ER, or call/text 988.`,
    };
  }
  return {
    subject: 'Follow-up from Integrative Psychiatry',
    body: `Hi ${name},\n\nThank you for reaching out to Integrative Psychiatry. We reviewed your inquiry and wanted to follow up regarding next steps.\n\nPlease reply with any non-urgent administrative questions, or use the patient portal for secure communication if you are an established patient.\n\nIf you are experiencing an emergency or urgent safety concern, please call 911, go to the nearest emergency room, or call/text 988.\n\nWarmly,\nIntegrative Psychiatry`,
  };
}

async function draftWithAI({ channel, tone, instruction, submission }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackDraft({ channel, tone, submission });

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const prompt = `Draft a ${channel === 'sms' ? 'brief SMS text message' : 'professional email'} from Integrative Psychiatry to a person who submitted a website inquiry.\n\nTone: ${tone || 'warm, professional, concise'}\n\nAdmin instruction: ${instruction || 'Follow up politely and guide the person to next steps.'}\n\nRules:\n- Do not diagnose.\n- Do not promise acceptance into care.\n- Do not promise medication, stimulants, ketamine, or a specific treatment.\n- Include an emergency disclaimer only if clinically appropriate, and always if safety concerns are present.\n- For SMS, keep it concise.\n- Return JSON only with keys subject and body. For SMS, subject can be empty.\n\nSubmission summary:\n${submissionSummary(submission)}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        { role: 'system', content: 'You draft cautious, professional administrative communications for a psychiatry practice.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) return fallbackDraft({ channel, tone, submission });
  const data = await response.json();
  try {
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    return { subject: clean(parsed.subject), body: clean(parsed.body) };
  } catch {
    return fallbackDraft({ channel, tone, submission });
  }
}

async function sendSms({ to, body }) {
  const provider = (process.env.SMS_PROVIDER || 'quo').toLowerCase();
  const apiKey = process.env.QUO_API_KEY || process.env.OPENPHONE_API_KEY;
  const from = process.env.QUO_FROM_NUMBER || process.env.OPENPHONE_FROM_NUMBER;
  const url = process.env.QUO_API_URL || process.env.OPENPHONE_API_URL || 'https://api.openphone.com/v1/messages';
  if (!apiKey || !from) throw new Error('SMS provider is not configured.');

  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, from, content: body, text: body, message: body, provider }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`SMS provider failed: ${text.slice(0, 180)}`);
  let providerMessageId = '';
  try { providerMessageId = JSON.parse(text)?.id || JSON.parse(text)?.data?.id || ''; } catch {}
  return { provider: 'quo', providerMessageId };
}

function base64Url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function gmailAccessToken() {
  const client_id = process.env.GMAIL_CLIENT_ID;
  const client_secret = process.env.GMAIL_CLIENT_SECRET;
  const refresh_token = process.env.GMAIL_REFRESH_TOKEN;
  if (!client_id || !client_secret || !refresh_token) throw new Error('Gmail OAuth is not configured.');

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id, client_secret, refresh_token, grant_type: 'refresh_token' }),
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) throw new Error('Unable to refresh Gmail token.');
  return data.access_token;
}

async function sendGmail({ to, subject, body }) {
  const from = process.env.GMAIL_FROM || process.env.CONTACT_EMAIL_FROM || 'support@drzelisko.com';
  const accessToken = await gmailAccessToken();
  const raw = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject || 'Follow-up from Integrative Psychiatry'}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    '',
    body,
  ].join('\r\n');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: base64Url(raw) }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error('Gmail send failed.');
  return { provider: 'gmail', providerMessageId: data.id || '' };
}

export async function POST(req) {
  const supabase = supabaseAdmin();
  const auth = await requireAdminUser(req, supabase);
  if (auth.error) return auth.error;

  const payload = await req.json();
  const action = clean(payload.action);
  const channel = clean(payload.channel);
  const submissionId = clean(payload.submissionId);
  if (!['draft', 'send'].includes(action) || !['sms', 'email'].includes(channel) || !submissionId) {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  const { data: submission, error } = await supabase.from('contact_submissions').select('*').eq('id', submissionId).single();
  if (error || !submission) return json({ ok: false, error: 'Submission not found.' }, 404);

  if (action === 'draft') {
    const draft = await draftWithAI({ channel, tone: payload.tone, instruction: payload.instruction, submission });
    await supabase.from('communication_log').insert({ submission_id: submissionId, channel, recipient: channel === 'sms' ? submission.mobile : submission.email, subject: draft.subject || null, body: draft.body, status: 'drafted', provider: 'ai', created_by: auth.user.id });
    return json({ ok: true, draft });
  }

  const body = clean(payload.body);
  const subject = clean(payload.subject);
  if (!body) return json({ ok: false, error: 'Message body is required.' }, 400);
  const recipient = channel === 'sms' ? clean(submission.mobile) : clean(submission.email);
  if (!recipient) return json({ ok: false, error: `No ${channel === 'sms' ? 'mobile number' : 'email'} on this submission.` }, 400);

  try {
    const sent = channel === 'sms' ? await sendSms({ to: recipient, body }) : await sendGmail({ to: recipient, subject, body });
    await supabase.from('communication_log').insert({ submission_id: submissionId, channel, recipient, subject: subject || null, body, status: 'sent', provider: sent.provider, provider_message_id: sent.providerMessageId, created_by: auth.user.id });
    await supabase.from('audit_log').insert({ actor_id: auth.user.id, action: `send_${channel}`, resource_type: 'contact_submissions', resource_id: submissionId, metadata: { provider: sent.provider } });
    return json({ ok: true, sent });
  } catch (err) {
    await supabase.from('communication_log').insert({ submission_id: submissionId, channel, recipient, subject: subject || null, body, status: 'failed', provider: channel === 'sms' ? 'quo' : 'gmail', error: err.message || 'Send failed', created_by: auth.user.id });
    return json({ ok: false, error: err.message || 'Unable to send message.' }, 500);
  }
}
