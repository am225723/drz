import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("CONTACT_ALLOWED_ORIGIN") || "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const highRiskSafetyValues = new Set([
  "Active thoughts of suicide",
  "Recent suicide attempt",
  "Recent psychiatric hospitalization",
  "Recent serious self-harm",
]);

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
function str(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
function bool(value: unknown) {
  return value === true;
}
function arr(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : [];
}
function requireEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}
function textBlock(label: string, value: unknown) {
  const display = Array.isArray(value)
    ? value.join(", ")
    : typeof value === "boolean"
      ? value
        ? "Yes"
        : "No"
      : String(value || "Not provided");
  return `${label}: ${display}`;
}

function isHighRisk(payload: Record<string, unknown>) {
  return (
    str(payload.riskLevel) === "high" ||
    arr(payload.internalFlags).includes("HIGH_PRIORITY_SAFETY_RISK") ||
    str(payload.safetyRecentSi) === "Active thoughts of suicide" ||
    str(payload.safetySelfHarm) === "Yes" ||
    str(payload.safetyHarmOthers) === "Yes" ||
    bool(payload.currentCrisis) ||
    highRiskSafetyValues.has(str(payload.safetyHospitalization)) ||
    str(payload.safetyStaySafe) === "No" ||
    str(payload.safetyStaySafe) === "Unsure"
  );
}

function isScopeReview(payload: Record<string, unknown>) {
  const legal = str(payload.legalOrForensicRequest);
  return (
    arr(payload.internalFlags).includes("SCOPE_REVIEW_POSSIBLE_REFER_OUT") ||
    legal === "Yes" ||
    legal === "Maybe"
  );
}

function normalizeInternalFlags(payload: Record<string, unknown>) {
  const flags = new Set(arr(payload.internalFlags));
  if (isHighRisk(payload)) flags.add("HIGH_PRIORITY_SAFETY_RISK");
  if (isScopeReview(payload)) flags.add("SCOPE_REVIEW_POSSIBLE_REFER_OUT");
  return Array.from(flags);
}

function buildEmailBody(payload: Record<string, unknown>, id: string) {
  const highRisk = isHighRisk(payload);
  const scopeReview = isScopeReview(payload);
  const flags = normalizeInternalFlags(payload);

  return [
    "New Good-Fit Questionnaire — PHI",
    "",
    highRisk
      ? "High Priority Safety Flag:\nThis submission included one or more safety-risk responses. Review promptly. This questionnaire is not an emergency monitoring system.\n"
      : "",
    scopeReview
      ? "Scope-of-Care Review Flag:\nThis submission may involve documentation, legal, court, custody, disability, forensic, workplace, school, or benefits-related purposes. Review for possible refer-out needs.\n"
      : "",
    textBlock("Submission ID", id),
    textBlock("Submitted", new Date().toISOString()),
    textBlock(
      "Risk level",
      highRisk ? "high" : str(payload.riskLevel) || "standard",
    ),
    textBlock("Internal flags", flags),
    "",
    "BASIC INFORMATION",
    textBlock("Full legal name", payload.fullName),
    textBlock("Preferred name", payload.preferredName),
    textBlock("Date of birth", payload.dob),
    textBlock("Email", payload.email),
    textBlock("Mobile", payload.mobile),
    textBlock("Current location", payload.currentLocation),
    textBlock("Location eligibility", payload.locationEligibility),
    textBlock("Contact preference", payload.contactPreference),
    textBlock("Voicemail consent", payload.voicemailConsent),
    textBlock("Communication consent", payload.communicationConsent),
    "",
    "WHAT THEY ARE HOPING TO GET HELP WITH",
    textBlock("Selected concerns/goals", payload.appointmentGoals),
    textBlock("Primary concerns compatibility field", payload.primaryConcerns),
    textBlock("Presenting summary", payload.presentingSummary),
    textBlock("Treatment goals", payload.treatmentGoals),
    "",
    "ACUITY AND CARE PREFERENCES",
    textBlock("Scheduling timeline", payload.schedulingTimeline),
    textBlock("Functioning impact", payload.functioningImpact),
    textBlock("Open to non-medication options", payload.openToNonMedication),
    textBlock("Interested in therapy", payload.interestedInTherapy),
    textBlock("Current treatment", payload.currentTreatment),
    "",
    "SAFETY SCREENING",
    textBlock(
      "Recent thoughts of not wanting to be alive or suicide",
      payload.safetyRecentSi,
    ),
    textBlock("Thoughts of self-harm", payload.safetySelfHarm),
    textBlock("Thoughts of harming others", payload.safetyHarmOthers),
    textBlock(
      "Recent attempt/hospitalization/self-harm",
      payload.safetyHospitalization,
    ),
    textBlock(
      "Enough support to stay safe until outpatient appointment",
      payload.safetyStaySafe,
    ),
    textBlock("Currently in crisis", payload.currentCrisis),
    "",
    "TREATMENT HISTORY AND CONTEXT",
    textBlock("Current medications", payload.currentMedications),
    textBlock("Past treatment", payload.pastTreatment),
    textBlock("Medical conditions", payload.medicalConditions),
    textBlock("Substance use pattern", payload.substanceUsePattern),
    textBlock("Substance use details", payload.substanceUse),
    "",
    "ADHD / STIMULANT / KETAMINE",
    textBlock("ADHD interest", payload.adhdInterest),
    textBlock("Stimulant request", payload.stimulantRequest),
    textBlock("Ketamine interest", payload.ketamineInterest),
    textBlock("Prior advanced treatments", payload.ketaminePriorTreatment),
    textBlock("Ketamine risk factors", payload.ketamineRiskFactors),
    "",
    "LOGISTICS AND PAYMENT",
    textBlock("Preferred visit type", payload.preferredVisitType),
    textBlock("Availability", payload.availability),
    textBlock("Payment pathway", payload.paymentPathway),
    textBlock("Payment type compatibility field", payload.paymentType),
    textBlock("Insurance carrier", payload.insuranceProvider),
    "",
    "ADDITIONAL FIT QUESTIONS",
    textBlock(
      "Documentation/legal/forensic request",
      payload.legalOrForensicRequest,
    ),
    textBlock("Additional context", payload.additionalContext),
    textBlock("Acknowledgment", payload.acknowledgment),
  ]
    .filter((line) => line !== "")
    .join("\n");
}

async function sendEmail(subject: string, body: string, replyTo?: string) {
  const provider = (Deno.env.get("EMAIL_PROVIDER") || "resend").toLowerCase();
  const to = requireEnv("CONTACT_EMAIL_TO");
  const from = requireEnv("CONTACT_EMAIL_FROM");
  if (provider === "resend") {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${requireEnv("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        text: body,
        reply_to: replyTo || undefined,
      }),
    });
    if (!response.ok) throw new Error("Email provider failed");
    return;
  }
  if (provider === "postmark") {
    const response = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        "X-Postmark-Server-Token": requireEnv("POSTMARK_SERVER_TOKEN"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        From: from,
        To: to,
        Subject: subject,
        TextBody: body,
        ReplyTo: replyTo || undefined,
      }),
    });
    if (!response.ok) throw new Error("Email provider failed");
    return;
  }
  if (provider === "sendgrid") {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${requireEnv("SENDGRID_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from },
        reply_to: replyTo ? { email: replyTo } : undefined,
        subject,
        content: [{ type: "text/plain", value: body }],
      }),
    });
    if (!response.ok) throw new Error("Email provider failed");
    return;
  }
  throw new Error("Unsupported email provider");
}

function validate(payload: Record<string, unknown>) {
  if (str(payload.website)) return "spam";
  if (!str(payload.fullName)) return "Full name is required.";
  if (!str(payload.email) || !str(payload.email).includes("@"))
    return "Valid email is required.";
  if (!str(payload.mobile)) return "Mobile phone is required.";
  if (!str(payload.dob)) return "Date of birth is required.";
  if (!str(payload.currentLocation)) return "Current location is required.";
  if (!str(payload.presentingSummary)) return "Presenting summary is required.";
  if (!bool(payload.communicationConsent))
    return "Communication consent is required.";
  if (!bool(payload.acknowledgment)) return "Acknowledgment is required.";
  return "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST")
    return json({ ok: false, error: "Method not allowed" }, 405);
  try {
    const payload = await req.json();
    const validationError = validate(payload);
    if (validationError === "spam") return json({ ok: true });
    if (validationError)
      return json({ ok: false, error: validationError }, 400);
    const supabase = createClient(
      requireEnv("SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const email = str(payload.email).toLowerCase();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("good_fit_questionnaires")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", oneHourAgo);
    if (
      (count || 0) >= Number(Deno.env.get("CONTACT_RATE_LIMIT_PER_HOUR") || "3")
    )
      return json(
        { ok: false, error: "Too many submissions. Please try again later." },
        429,
      );

    const flags = normalizeInternalFlags(payload);
    const riskLevel = flags.includes("HIGH_PRIORITY_SAFETY_RISK")
      ? "high"
      : "standard";
    const paymentType = arr(payload.paymentType).length
      ? arr(payload.paymentType)
      : str(payload.paymentPathway)
        ? [str(payload.paymentPathway)]
        : [];
    const substanceUse = [
      str(payload.substanceUsePattern),
      str(payload.substanceUse),
    ]
      .filter(Boolean)
      .join("\n\n");

    // Patient confirmation emails are not sent by this function today; if they are added later, include the same crisis and scope-review resource language used in the admin notification.
    const row = {
      risk_level: riskLevel,
      internal_flags: flags,
      location_eligibility: str(payload.locationEligibility),
      payment_pathway: str(payload.paymentPathway),
      scheduling_timeline: str(payload.schedulingTimeline),
      communication_consent: bool(payload.communicationConsent),
      safety_stay_safe: str(payload.safetyStaySafe),
      ketamine_prior_treatment: arr(payload.ketaminePriorTreatment),
      substance_use_pattern: str(payload.substanceUsePattern),
      full_name: str(payload.fullName),
      preferred_name: str(payload.preferredName),
      dob: str(payload.dob) || null,
      email,
      mobile: str(payload.mobile),
      current_location: str(payload.currentLocation),
      contact_preference: arr(payload.contactPreference),
      voicemail_consent:
        bool(payload.voicemailConsent) || bool(payload.communicationConsent),
      appointment_goals: arr(payload.appointmentGoals),
      primary_concerns: arr(payload.primaryConcerns),
      presenting_summary: str(payload.presentingSummary),
      treatment_goals: str(payload.treatmentGoals),
      practice_fit: arr(payload.practiceFit),
      open_to_non_medication:
        str(payload.openToNonMedication) === "Yes"
          ? true
          : str(payload.openToNonMedication) === "No"
            ? false
            : null,
      interested_in_therapy: str(payload.interestedInTherapy),
      current_treatment: str(payload.currentTreatment),
      functioning_impact: str(payload.functioningImpact),
      safety_recent_si: str(payload.safetyRecentSi),
      safety_self_harm: str(payload.safetySelfHarm),
      safety_harm_others: str(payload.safetyHarmOthers),
      safety_hospitalization: [
        str(payload.safetyHospitalization),
        str(payload.safetyStaySafe)
          ? `Stay safe until appointment: ${str(payload.safetyStaySafe)}`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
      current_crisis: bool(payload.currentCrisis),
      current_medications: str(payload.currentMedications),
      past_treatment: str(payload.pastTreatment),
      medical_conditions: str(payload.medicalConditions),
      substance_use: substanceUse,
      adhd_interest: str(payload.adhdInterest),
      stimulant_request: str(payload.stimulantRequest),
      ketamine_interest: str(payload.ketamineInterest),
      ketamine_risk_factors: [
        ...arr(payload.ketamineRiskFactors),
        ...arr(payload.ketaminePriorTreatment).map(
          (item) => `Prior treatment: ${item}`,
        ),
      ],
      preferred_visit_type: str(payload.preferredVisitType),
      availability: arr(payload.availability),
      payment_type: paymentType,
      insurance_provider: str(payload.insuranceProvider),
      legal_or_forensic_request: str(payload.legalOrForensicRequest),
      additional_context: [
        str(payload.additionalContext),
        `Risk level: ${riskLevel}`,
        flags.length ? `Internal flags: ${flags.join(", ")}` : "",
        str(payload.locationEligibility)
          ? `Location eligibility: ${str(payload.locationEligibility)}`
          : "",
        str(payload.schedulingTimeline)
          ? `Scheduling timeline: ${str(payload.schedulingTimeline)}`
          : "",
        bool(payload.communicationConsent)
          ? "Communication consent: Yes"
          : "Communication consent: No",
      ]
        .filter(Boolean)
        .join("\n"),
      acknowledgment: bool(payload.acknowledgment),
    };
    const { data, error } = await supabase
      .from("good_fit_questionnaires")
      .insert(row)
      .select("id")
      .single();
    if (error)
      return json({ ok: false, error: "Could not save questionnaire." }, 500);
    const subject =
      riskLevel === "high"
        ? "[HIGH PRIORITY / SAFETY RISK] Good-Fit Questionnaire Submission – Review Promptly"
        : "New Good-Fit Questionnaire — PHI";
    try {
      await sendEmail(
        subject,
        buildEmailBody(
          { ...payload, riskLevel, internalFlags: flags },
          data.id,
        ),
        email,
      );
    } catch (_) {
      /* saved even if email fails */
    }
    return json({ ok: true, id: data.id, riskLevel, internalFlags: flags });
  } catch (_) {
    return json({ ok: false, error: "Unexpected submission error." }, 500);
  }
});
