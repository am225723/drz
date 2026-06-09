import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const PURPOSES = new Set([
  'Invite to schedule',
  'Confirm receipt of questionnaire',
  'Request missing information',
  'Private pay / credit card authorization reminder',
  'Telehealth Connecticut eligibility clarification',
  'In-person availability follow-up',
  'Not a good fit / referral-style response',
  'Safety concern / higher level of care recommendation',
  'Custom message',
]);

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

function safeHeader(value) {
  return clean(value).replace(/[\r\n]+/g, ' ').slice(0, 240);
}

function listValue(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  if (value && typeof value === 'object') return Object.values(value).filter(Boolean).join(', ');
  return clean(value);
}

function firstName(row) {
  const name = clean(row.preferred_name) || clean(row.full_name) || 'there';
  return name.split(/\s+/)[0] || 'there';
}

function hasSafetySignals(row) {
  const combined = [
    row.reason_for_care,
    row.brief_context,
    row.admin_notes,
    row.risk_level,
    row.safety_concerns,
  ].map(value => String(value || '').toLowerCase()).join(' ');
  return Boolean(row.risk_flag) || /(risk|unsafe|crisis|emergency|hospital|988|911|higher level of care)/i.test(combined);
}

function submissionSummary(row) {
  return [
    `Name: ${row.full_name || 'Not provided'}`,
    `Preferred name: ${row.preferred_name || 'Not provided'}`,
    `Email present: ${row.email ? 'Yes' : 'No'}`,
    `Mobile present: ${row.mobile ? 'Yes' : 'No'}`,
    `Contact preference: ${listValue(row.contact_preference) || 'Not provided'}`,
    `Visit type: ${row.visit_type || 'Not provided'}`,
    `Availability: ${listValue(row.availability) || 'Not provided'}`,
    `Reason for care: ${row.reason_for_care || 'Not provided'}`,
    `Brief context: ${row.brief_context || 'Not provided'}`,
    `Payment type: ${listValue(row.payment_type) || 'Not provided'}`,
    `Insurance provider: ${row.insurance_provider || 'Not provided'}`,
    `Out-of-network acknowledgment: ${row.oon_acknowledgment ? 'Yes' : 'No'}`,
    `Safety/risk signal: ${hasSafetySignals(row) ? 'Yes' : 'No'}`,
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

function fallbackDraft({ channel, purpose, submission }) {
  const name = firstName(submission);
  const safety = hasSafetySignals(submission) || purpose === 'Safety concern / higher level of care recommendation';

  if (channel === 'sms') {
    if (safety) {
      return {
        subject: '',
        body: `Hi ${name}, thank you for reaching out. Based on what you shared, this may need more immediate support than our outpatient office can provide. If you feel unsafe, please call 988, 911, or go to the nearest ER.`,
        warnings: ['Safety language was included because this submission may require urgent resources.'],
      };
    }
    return {
      subject: '',
      body: `Hi ${name}, this is Dr. Zelisko's office. Thank you for completing the questionnaire. We reviewed your submission and wanted to follow up with next steps.`,
      warnings: [],
    };
  }

  return {
    subject: 'Follow-up from Dr. Zelisko\'s Office',
    body: `Hi ${name},\n\nThank you for taking the time to complete the questionnaire. We reviewed your submission and wanted to follow up regarding next steps.\n\nPlease note that this questionnaire does not establish a doctor-patient relationship and should not be used for urgent or emergency concerns. If you are in crisis or feel unsafe, please call 988, call 911, or go to the nearest emergency room.\n\nWarmly,\nDr. Zelisko's Office`,
    warnings: safety ? ['This submission may include safety concerns. Review carefully before sending.'] : [],
  };
}

function aiProviderConfig() {
  const provider = clean(process.env.AI_PROVIDER || 'openai').toLowerCase();

  if (provider === 'cloudflare' || provider === 'workers-ai' || provider === 'workers_ai') {
    const accountId = clean(process.env.CLOUDFLARE_ACCOUNT_ID || process.env.AI_ACCOUNT_ID);
    const apiKey = clean(process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_API_KEY || process.env.AI_API_KEY);
    const baseUrl = clean(process.env.CLOUDFLARE_AI_BASE_URL || process.env.AI_BASE_URL) || (accountId ? `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1` : '');
    return {
      provider: 'cloudflare',
      apiKey,
      baseUrl,
      model: clean(process.env.CLOUDFLARE_AI_MODEL || process.env.AI_MODEL) || '@cf/google/gemma-4-26b-a4b-it',
      useResponseFormat: false,
    };
  }

  return {
    provider: 'openai',
    apiKey: clean(process.env.OPENAI_API_KEY || process.env.AI_API_KEY),
    baseUrl: clean(process.env.OPENAI_BASE_URL || process.env.AI_BASE_URL) || 'https://api.openai.com/v1',
    model: clean(process.env.OPENAI_MODEL || process.env.AI_MODEL) || 'gpt-4o-mini',
    useResponseFormat: true,
  };
}

function extractJsonObject(text) {
  const raw = clean(text);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch {}

  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    try { return JSON.parse(fenced[1].trim()); } catch {}
  }

  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try { return JSON.parse(raw.slice(start, end + 1)); } catch {}
  }
  return null;
}

async function createAIChatCompletion({ messages, model, temperature }) {
  const config = aiProviderConfig();
  if (!config.apiKey || !config.baseUrl) return null;

  const requestBody = {
    model: config.model || model,
    temperature,
    messages,
  };

  if (config.useResponseFormat) requestBody.response_format = { type: 'json_object' };

  const response = await fetch(`${config.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) return null;
  const data = await response.json().catch(() => null);
  return data?.choices?.[0]?.message?.content || '';
}

async function draftWithAI({ channel, tone, instruction, purpose, submission }) {
  const config = aiProviderConfig();
  if (!config.apiKey || !config.baseUrl) return fallbackDraft({ channel, purpose, submission });

  const safety = hasSafetySignals(submission);
  const prompt = `Draft a ${channel === 'sms' ? 'brief SMS text message' : 'professional email'} from Dr. Zelisko's office / Integrative Psychiatry to a person who submitted a website questionnaire.\n\nPurpose: ${purpose || 'Follow up'}\nTone: ${tone || 'Warm and professional'}\nAdmin instruction: ${instruction || 'Follow up politely and guide the person to next steps.'}\n\nRules:\n- Return JSON only with keys subject, body, and warnings. warnings must be an array of strings.\n- Do not diagnose.\n- Do not promise acceptance into care.\n- Do not promise medication, stimulants, ketamine, or a specific treatment.\n- Do not include diagnosis labels, risk details, trauma details, medication details, or questionnaire specifics in SMS.\n- SMS must be concise, ideally under 320 characters and never over 1600 characters.\n- Email may be warmer and more complete.\n- Include the crisis/emergency disclaimer if safety/risk signal is Yes or if the purpose is higher level of care.\n- Make clear that the questionnaire does not establish a doctor-patient relationship when appropriate.\n- Sign emails as Dr. Zelisko's Office.\n\nSafety/risk signal: ${safety ? 'Yes' : 'No'}\n\nSubmission summary:\n${submissionSummary(submission)}`;

  const content = await createAIChatCompletion({
    model: config.model,
    temperature: 0.35,
    messages: [
      { role: 'system', content: 'You draft cautious, warm, professional administrative communications for a psychiatry practice. Protect privacy and do not include unnecessary clinical details. Return valid JSON only.' },
      { role: 'user', content: prompt },
    ],
  });

  if (!content) return fallbackDraft({ channel, purpose, submission });

  const parsed = extractJsonObject(content);
  if (!parsed) return fallbackDraft({ channel, purpose, submission });

  const draft = {
    subject: safeHeader(parsed.subject) || (channel === 'email' ? 'Follow-up from Dr. Zelisko\'s Office' : ''),
    body: clean(parsed.body),
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings.map(clean).filter(Boolean) : [],
  };

  if (!draft.body) return fallbackDraft({ channel, purpose, submission });
  if (channel === 'sms' && draft.body.length > 1600) {
    draft.body = draft.body.slice(0, 1597).trimEnd() + '...';
    draft.warnings.push('The SMS draft was shortened to fit Quo\'s 1,600-character limit.');
  }
  if (safety && draft.warnings.length === 0) draft.warnings.push('This submission may include safety concerns. Review carefully before sending.');
  if (config.provider === 'cloudflare') draft.warnings.push('Drafted with Cloudflare Workers AI. Review carefully before sending.');
  return draft;
}

function normalizeE164(raw) {
  const value = clean(raw);
  if (/^\+[1-9]\d{1,14}$/.test(value)) return value;
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return '';
}

async function sendSms({ to, body }) {
  const apiKey = process.env.QUO_API_KEY || process.env.OPENPHONE_API_KEY;
  const from = process.env.QUO_FROM_NUMBER_ID || process.env.QUO_FROM_NUMBER || process.env.OPENPHONE_FROM_NUMBER;
  const userId = process.env.QUO_USER_ID || process.env.OPENPHONE_USER_ID;
  const url = process.env.QUO_API_URL || 'https://api.openphone.com/v1/messages';
  const normalizedTo = normalizeE164(to);

  if (!apiKey || !from) throw new Error('Quo SMS provider is not configured. Add QUO_API_KEY and QUO_FROM_NUMBER_ID.');
  if (!normalizedTo) throw new Error('Mobile number must be a valid E.164 phone number, such as +18606153629.');
  if (!clean(body)) throw new Error('SMS body is required.');
  if (body.length > 1600) throw new Error('Quo SMS messages must be 1,600 characters or less.');

  const payload = {
    content: body,
    from,
    to: [normalizedTo],
    setInboxStatus: 'done',
  };
  if (userId) payload.userId = userId;

  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  if (!response.ok) throw new Error(`Quo SMS failed: ${text.slice(0, 220)}`);

  let providerMessageId = '';
  try {
    const parsed = JSON.parse(text);
    providerMessageId = parsed?.data?.id || parsed?.id || '';
  } catch {}
  return { provider: 'quo', providerMessageId, recipient: normalizedTo };
}

function base64Url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function gmailAccessToken() {
  const client_id = process.env.GMAIL_CLIENT_ID;
  const client_secret = process.env.GMAIL_CLIENT_SECRET;
  const refresh_token = process.env.GMAIL_REFRESH_TOKEN;
  if (!client_id || !client_secret || !refresh_token) throw new Error('Gmail OAuth is not configured. Add GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN.');

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
  const from = safeHeader(process.env.GMAIL_FROM || process.env.CONTACT_EMAIL_FROM || 'support@drzelisko.com');
  const recipient = safeHeader(to);
  const finalSubject = safeHeader(subject || 'Follow-up from Dr. Zelisko\'s Office');
  if (!recipient || !recipient.includes('@')) throw new Error('A valid email recipient is required.');
  if (!clean(body)) throw new Error('Email body is required.');

  const accessToken = await gmailAccessToken();
  const raw = [
    `From: ${from}`,
    `To: ${recipient}`,
    `Subject: ${finalSubject}`,
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
  if (!response.ok) throw new Error(data?.error?.message || 'Gmail send failed.');
  return { provider: 'gmail', providerMessageId: data.id || '', recipient };
}

async function insertCommunicationLog(supabase, values) {
  return supabase.from('communication_log').insert(values);
}

export async function POST(req) {
  const supabase = supabaseAdmin();
  const auth = await requireAdminUser(req, supabase);
  if (auth.error) return auth.error;

  const payload = await req.json();
  const action = clean(payload.action);
  const channel = clean(payload.channel);
  const submissionId = clean(payload.submissionId);
  const purpose = PURPOSES.has(clean(payload.purpose)) ? clean(payload.purpose) : 'Custom message';
  const tone = clean(payload.tone) || 'Warm and professional';

  if (!['draft', 'save', 'send'].includes(action) || !['sms', 'email'].includes(channel) || !submissionId) {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  const { data: submission, error } = await supabase.from('contact_submissions').select('*').eq('id', submissionId).single();
  if (error || !submission) return json({ ok: false, error: 'Submission not found.' }, 404);

  if (action === 'draft') {
    const draft = await draftWithAI({ channel, tone, instruction: payload.instruction, purpose, submission });
    await insertCommunicationLog(supabase, {
      submission_id: submissionId,
      channel,
      recipient: channel === 'sms' ? normalizeE164(submission.mobile) || submission.mobile : submission.email,
      subject: draft.subject || null,
      body: draft.body,
      status: 'drafted',
      provider: 'ai',
      purpose,
      tone,
      reviewed_by_admin: false,
      created_by: auth.user.id,
    });
    return json({ ok: true, draft });
  }

  const body = clean(payload.body);
  const subject = safeHeader(payload.subject);
  if (!body) return json({ ok: false, error: 'Message body is required.' }, 400);

  const recipient = channel === 'sms' ? clean(submission.mobile) : clean(submission.email);
  if (!recipient) return json({ ok: false, error: `No ${channel === 'sms' ? 'mobile number' : 'email'} on this submission.` }, 400);

  if (action === 'save') {
    await insertCommunicationLog(supabase, {
      submission_id: submissionId,
      channel,
      recipient: channel === 'sms' ? normalizeE164(recipient) || recipient : recipient,
      subject: subject || null,
      body,
      status: 'saved_draft',
      provider: 'admin',
      purpose,
      tone,
      reviewed_by_admin: false,
      created_by: auth.user.id,
    });
    return json({ ok: true, saved: true });
  }

  if (payload.reviewed !== true) return json({ ok: false, error: 'Please review and approve the message before sending.' }, 400);

  try {
    const sent = channel === 'sms' ? await sendSms({ to: recipient, body }) : await sendGmail({ to: recipient, subject, body });
    await insertCommunicationLog(supabase, {
      submission_id: submissionId,
      channel,
      recipient: sent.recipient || recipient,
      subject: subject || null,
      body,
      status: 'sent',
      provider: sent.provider,
      provider_message_id: sent.providerMessageId,
      purpose,
      tone,
      reviewed_by_admin: true,
      created_by: auth.user.id,
    });
    await supabase.from('audit_log').insert({ actor_id: auth.user.id, action: `send_${channel}`, resource_type: 'contact_submissions', resource_id: submissionId, metadata: { provider: sent.provider, purpose } });
    return json({ ok: true, sent });
  } catch (err) {
    await insertCommunicationLog(supabase, {
      submission_id: submissionId,
      channel,
      recipient: channel === 'sms' ? normalizeE164(recipient) || recipient : recipient,
      subject: subject || null,
      body,
      status: 'failed',
      provider: channel === 'sms' ? 'quo' : 'gmail',
      error: err.message || 'Send failed',
      purpose,
      tone,
      reviewed_by_admin: true,
      created_by: auth.user.id,
    });
    return json({ ok: false, error: err.message || 'Unable to send message.' }, 500);
  }
}
