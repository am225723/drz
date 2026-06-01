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
const internalFlagLabels: Record<string, string> = {
  HIGH_PRIORITY_SAFETY_RISK: "High priority safety risk",
  SCOPE_REVIEW_POSSIBLE_REFER_OUT: "Scope review / possible refer-out",
  CONTROLLED_SUBSTANCE_REVIEW: "Controlled-substance review",
  STIMULANT_REVIEW: "Stimulant review",
  KETAMINE_REVIEW: "Ketamine review",
};

const contactMethodLabels: Record<string, string> = {
  Phone: "Phone call",
  phone: "Phone call",
  Voicemail: "Voicemail",
  voicemail: "Voicemail",
  Text: "Text message",
  text: "Text message",
  Email: "Email",
  email: "Email",
};

type EmailContent = {
  html: string;
  text: string;
};

type WarningBanner = {
  title: string;
  body: string;
  action?: string;
  priority?: "high" | "standard";
};

function titleCase(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(
      /\w\S*/g,
      (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
    );
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function nl2br(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function formatBoolean(value: boolean) {
  return value ? "Yes" : "No";
}

function readableValue(
  value: unknown,
  options: { contactMethods?: boolean } = {},
) {
  if (Array.isArray(value)) {
    const values = value.map((item) => String(item).trim()).filter(Boolean);
    if (!values.length) return "Not provided";
    return values
      .map((item) =>
        options.contactMethods
          ? contactMethodLabels[item] || titleCase(item)
          : item,
      )
      .join(", ");
  }
  if (typeof value === "boolean") return formatBoolean(value);
  const text = String(value ?? "").trim();
  if (!text) return "Not provided";
  return options.contactMethods
    ? contactMethodLabels[text] || titleCase(text)
    : text;
}

function formatRiskLevel(value: unknown) {
  return titleCase(str(value) || "standard");
}

function formatInternalFlags(flags: string[]) {
  if (!flags.length) return "None";
  return flags
    .map((flag) => internalFlagLabels[flag] || titleCase(flag))
    .join(", ");
}

function formatLocationEligibility(payload: Record<string, unknown>) {
  const eligibility = str(payload.locationEligibility);
  if (eligibility === "connecticut") return "Connecticut / eligible";
  if (eligibility === "outside_connecticut")
    return "Outside Connecticut / review needed";
  if (eligibility === "unsure") return "Unsure / review needed";
  return readableValue(payload.currentLocation);
}

function contactMethodsFor(payload: Record<string, unknown>) {
  const allowed = arr(payload.allowedContactMethods);
  return allowed.length ? allowed : arr(payload.contactPreference);
}

function hasSafetyComplexity(payload: Record<string, unknown>) {
  return Boolean(
    str(payload.safetyRecentSi) ||
    str(payload.safetySelfHarm) ||
    str(payload.safetyHarmOthers) ||
    str(payload.safetyHospitalization) ||
    str(payload.safetyStaySafe) ||
    bool(payload.currentCrisis),
  );
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

function isLocationReview(payload: Record<string, unknown>) {
  const location = str(payload.currentLocation).toLowerCase();
  const eligibility = str(payload.locationEligibility).toLowerCase();
  return (
    str(payload.currentLocation) === "No" ||
    location.includes("not in connecticut") ||
    location.includes("outside") ||
    eligibility === "outside_connecticut" ||
    eligibility === "out_of_state" ||
    eligibility === "not_eligible"
  );
}

function isMedicationReview(payload: Record<string, unknown>) {
  const adhdInterest = str(payload.adhdInterest).toLowerCase();
  const stimulantRequest = str(payload.stimulantRequest).toLowerCase();
  const goals = arr(payload.appointmentGoals).join(" ").toLowerCase();
  const flags = arr(payload.internalFlags).join(" ").toLowerCase();
  return (
    adhdInterest.includes("continuation of a current prescription") ||
    stimulantRequest.includes("seeking a new stimulant prescription") ||
    stimulantRequest.includes("currently prescribed") ||
    stimulantRequest.includes("continuation") ||
    goals.includes("stimulant") ||
    goals.includes("controlled substance") ||
    flags.includes("stimulant") ||
    flags.includes("controlled")
  );
}

function isKetamineReview(payload: Record<string, unknown>) {
  const ketamineInterest = str(payload.ketamineInterest);
  const ketamineGoal = arr(payload.appointmentGoals).some(
    (item) =>
      item.toLowerCase().includes("ketamine") ||
      item.toLowerCase().includes("advanced treatment"),
  );
  const riskFactors = arr(payload.ketamineRiskFactors).filter(
    (item) => item !== "None of the above",
  );
  return Boolean((ketamineInterest || ketamineGoal) && riskFactors.length);
}

function isElevatedAcuity(payload: Record<string, unknown>) {
  return (
    str(payload.functioningImpact) === "Severely" ||
    (str(payload.schedulingTimeline) === "First available" &&
      hasSafetyComplexity(payload)) ||
    highRiskSafetyValues.has(str(payload.safetyHospitalization))
  );
}

function normalizeInternalFlags(payload: Record<string, unknown>) {
  const flags = new Set(arr(payload.internalFlags));
  if (isHighRisk(payload)) flags.add("HIGH_PRIORITY_SAFETY_RISK");
  if (isScopeReview(payload)) flags.add("SCOPE_REVIEW_POSSIBLE_REFER_OUT");
  return Array.from(flags);
}

function suggestedNextAction(payload: Record<string, unknown>) {
  if (isHighRisk(payload)) {
    return "Review promptly. This submission includes safety-risk responses. Do not treat this form as emergency monitoring, but consider sending crisis-resource guidance and assessing whether outpatient scheduling is appropriate.";
  }
  if (isScopeReview(payload)) {
    return "Clarify the purpose of the request before scheduling. The patient may be seeking legal, forensic, custody, disability, workplace, school, or benefits-related documentation.";
  }
  if (isLocationReview(payload)) {
    return "Clarify whether the patient will be physically located in Connecticut at the time of appointment before scheduling.";
  }
  if (isKetamineReview(payload)) {
    return "Review ketamine risk factors before scheduling ketamine-related care.";
  }
  if (isMedicationReview(payload)) {
    return "Clarify ADHD history, current/past prescriptions, and openness to full evaluation without guaranteeing stimulant prescribing.";
  }
  return "Review for scheduling fit and follow up using the patient’s preferred contact method.";
}

function warningBanners(payload: Record<string, unknown>) {
  const banners: WarningBanner[] = [];
  if (isHighRisk(payload)) {
    const staySafeConcern =
      str(payload.safetyStaySafe) === "No" ||
      str(payload.safetyStaySafe) === "Unsure";
    banners.push({
      title: "High Priority Safety Review",
      body: `This submission includes one or more safety-risk responses. This questionnaire is not an emergency monitoring system, but the submission should be reviewed promptly. If responding to the patient, include crisis guidance as appropriate.${staySafeConcern ? " The patient indicated they may not have enough support to remain safe until an outpatient appointment." : ""}`,
      action:
        "Review promptly. Consider sending crisis-resource language and determine whether outpatient scheduling is appropriate.",
      priority: "high",
    });
  }
  if (isScopeReview(payload)) {
    banners.push({
      title: "Scope-of-Care Review",
      body: "This submission may involve legal, forensic, custody, disability, workplace, school, benefits-related, or documentation-focused services. Confirm whether the request is within the practice’s scope before scheduling.",
      action:
        "Consider a polite clarification or referral-out response if the primary request is outside the practice’s clinical treatment scope.",
    });
  }
  if (isLocationReview(payload)) {
    banners.push({
      title: "Connecticut Location Review",
      body: "The patient indicated they may not be physically located in Connecticut. Confirm location eligibility before scheduling, especially for telehealth.",
      action:
        "Clarify whether the patient will be physically located in Connecticut at the time of appointment.",
    });
  }
  if (isMedicationReview(payload)) {
    banners.push({
      title: "Medication / Stimulant Review",
      body: "This submission includes stimulant-related medication interest. Confirm diagnostic history, prior records, current prescriber, and whether the patient is open to a full evaluation and all appropriate treatment options.",
      action:
        "Review for fit. Avoid implying any guarantee of controlled-substance prescribing.",
    });
  }
  if (isKetamineReview(payload)) {
    banners.push({
      title: "Ketamine Clinical Review",
      body: "The patient expressed ketamine interest and selected one or more factors that may require additional clinical screening before scheduling ketamine-related care.",
      action:
        "Review risk factors before scheduling ketamine consultation or treatment.",
    });
  }
  if (isElevatedAcuity(payload) && !isHighRisk(payload)) {
    banners.push({
      title: "Elevated Acuity Review",
      body: "The patient reports high current impairment or recent clinical acuity. Confirm whether routine outpatient care is appropriate.",
    });
  }
  return banners;
}

function buildAdminSubject(payload: Record<string, unknown>) {
  const patientName = str(payload.fullName) || "Prospective Patient";
  if (isHighRisk(payload))
    return `[HIGH PRIORITY / SAFETY RISK] Good-Fit Questionnaire – ${patientName}`;
  if (isScopeReview(payload))
    return `[SCOPE REVIEW] Good-Fit Questionnaire – ${patientName}`;
  if (isLocationReview(payload))
    return `[LOCATION REVIEW] Good-Fit Questionnaire – ${patientName}`;
  if (isKetamineReview(payload))
    return `[KETAMINE REVIEW] Good-Fit Questionnaire – ${patientName}`;
  if (isMedicationReview(payload))
    return `[MEDICATION REVIEW] Good-Fit Questionnaire – ${patientName}`;
  return `Good-Fit Questionnaire – ${patientName}`;
}

function field(
  label: string,
  value: unknown,
  options: { contactMethods?: boolean } = {},
) {
  return { label, value: readableValue(value, options) };
}

function htmlRows(rows: Array<{ label: string; value: string }>) {
  return rows
    .map(
      (row) => `<tr>
        <th style="width: 38%; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #475569; font-size: 13px; line-height: 1.45; text-align: left; vertical-align: top; font-weight: 700;">${escapeHtml(row.label)}</th>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 14px; line-height: 1.55; vertical-align: top;">${nl2br(row.value)}</td>
      </tr>`,
    )
    .join("");
}

function htmlCard(
  title: string,
  rows: Array<{ label: string; value: string }>,
) {
  return `<div style="margin-top: 18px; border: 1px solid #dbe5e2; border-radius: 18px; overflow: hidden; background: #ffffff;">
    <h2 style="margin: 0; padding: 14px 16px; background: #f8fafc; color: #173f42; font-size: 16px; line-height: 1.35;">${escapeHtml(title)}</h2>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">${htmlRows(rows)}</table>
  </div>`;
}

function textSection(
  title: string,
  rows: Array<{ label: string; value: string }>,
) {
  return [title, ...rows.map((row) => `${row.label}: ${row.value}`)].join("\n");
}

function buildEmailContent(
  payload: Record<string, unknown>,
  id: string,
): EmailContent {
  const submitted = new Date().toISOString();
  const flags = normalizeInternalFlags(payload);
  const withFlags = { ...payload, internalFlags: flags };
  const action = suggestedNextAction(withFlags);
  const banners = warningBanners(withFlags);
  const safetyConcern = isHighRisk(withFlags) || hasSafetyComplexity(withFlags);
  const scopeReview = isScopeReview(withFlags);
  const medicationReview = isMedicationReview(withFlags);
  const ketamineReview = isKetamineReview(withFlags);

  const triageRows = [
    field("Risk level", formatRiskLevel(withFlags.riskLevel)),
    field("Internal flags", formatInternalFlags(flags)),
    field("CT/location eligibility", formatLocationEligibility(withFlags)),
    field("Safety concern present", safetyConcern ? "Yes" : "No"),
    field("Scope review needed", scopeReview ? "Yes" : "No"),
    field("ADHD/stimulant review", medicationReview ? "Yes" : "No"),
    field("Ketamine review", ketamineReview ? "Yes" : "No"),
    field("Preferred appointment type", withFlags.preferredVisitType),
    field("Payment pathway", withFlags.paymentPathway || withFlags.paymentType),
    field("Suggested next action", action),
  ];

  const quickRows = [
    field("Patient name", withFlags.fullName),
    field("Date of birth", withFlags.dob),
    field("Location / CT eligibility", formatLocationEligibility(withFlags)),
    field(
      "Main concerns",
      withFlags.appointmentGoals || withFlags.primaryConcerns,
    ),
    field("Timeline", withFlags.schedulingTimeline),
    field("Functioning impact", withFlags.functioningImpact),
    field(
      "Safety summary",
      safetyConcern
        ? "Safety concern or safety-screening content present"
        : "No safety concern flagged",
    ),
    field(
      "Scope-of-care summary",
      scopeReview ? "Scope review may be needed" : "No scope concern flagged",
    ),
    field("Suggested next action", action),
  ];

  const contactRows = [
    field("Email", withFlags.email),
    field("Phone", withFlags.mobile),
    field("Allowed contact methods", contactMethodsFor(withFlags), {
      contactMethods: true,
    }),
    field("Preferred contact method", withFlags.preferredContactMethod, {
      contactMethods: true,
    }),
    field("Best time to contact", withFlags.bestContactTime),
    field("Communication consent", bool(withFlags.communicationConsent)),
  ];

  const clinicalRows = [
    field("What they are hoping to get help with", withFlags.appointmentGoals),
    field(
      "Symptoms/goals",
      [str(withFlags.presentingSummary), str(withFlags.treatmentGoals)].filter(
        Boolean,
      ),
    ),
    field("Appointment preference", withFlags.preferredVisitType),
    field("Payment pathway", withFlags.paymentPathway || withFlags.paymentType),
    field("Insurance carrier", withFlags.insuranceProvider),
  ];

  const safetyRows = [
    field(
      "Past-month passive/active suicidal thoughts",
      withFlags.safetyRecentSi,
    ),
    field("Harm to self", withFlags.safetySelfHarm),
    field("Harm to others", withFlags.safetyHarmOthers),
    field("Current crisis", bool(withFlags.currentCrisis)),
    field(
      "Recent attempt/hospitalization/self-harm",
      withFlags.safetyHospitalization,
    ),
    field(
      "Enough support to stay safe until outpatient appointment",
      withFlags.safetyStaySafe,
    ),
  ];

  const historyRows = [
    field("Current medications", withFlags.currentMedications),
    field("Past treatment/medications", withFlags.pastTreatment),
    field("Medical conditions/allergies", withFlags.medicalConditions),
    field("Substance use", withFlags.substanceUsePattern),
    field("Substance-use details", withFlags.substanceUse),
    field("Current treatment / clinicians", withFlags.currentTreatment),
  ];

  const specialtyRows = [
    ...(str(withFlags.adhdInterest) || str(withFlags.stimulantRequest)
      ? [
          field("ADHD interest", withFlags.adhdInterest),
          field("Stimulant request", withFlags.stimulantRequest),
        ]
      : []),
    ...(str(withFlags.ketamineInterest) ||
    arr(withFlags.ketaminePriorTreatment).length ||
    arr(withFlags.ketamineRiskFactors).length
      ? [
          field("Ketamine interest", withFlags.ketamineInterest),
          field("Prior advanced treatments", withFlags.ketaminePriorTreatment),
          field("Ketamine risk factors", withFlags.ketamineRiskFactors),
        ]
      : []),
  ];

  const scopeRows = [
    field(
      "Legal/forensic/disability/custody/workplace/school/benefits response",
      withFlags.legalOrForensicRequest,
    ),
    field("Any additional context", withFlags.additionalContext),
  ];

  const fullSections = [
    {
      title: "Section 1 — Basic information",
      rows: [
        field("Full legal name", withFlags.fullName),
        field("Preferred name", withFlags.preferredName),
        field("Date of birth", withFlags.dob),
        field("Email", withFlags.email),
        field("Mobile", withFlags.mobile),
        field("Current location", withFlags.currentLocation),
        field("Location eligibility", formatLocationEligibility(withFlags)),
        field("Allowed contact methods", contactMethodsFor(withFlags), {
          contactMethods: true,
        }),
        field("Preferred contact method", withFlags.preferredContactMethod, {
          contactMethods: true,
        }),
        field("Best contact time", withFlags.bestContactTime),
        field("Voicemail consent", bool(withFlags.voicemailConsent)),
        field("Communication consent", bool(withFlags.communicationConsent)),
      ],
    },
    {
      title: "Section 2 — Goals and concerns",
      rows: [
        field("Selected concerns/goals", withFlags.appointmentGoals),
        field("Presenting summary", withFlags.presentingSummary),
        field("Treatment goals", withFlags.treatmentGoals),
      ],
    },
    {
      title: "Section 3 — Timing and functioning",
      rows: [
        field("Scheduling timeline", withFlags.schedulingTimeline),
        field("Functioning impact", withFlags.functioningImpact),
        field("Open to non-medication options", withFlags.openToNonMedication),
        field("Interested in therapy", withFlags.interestedInTherapy),
        field("Current treatment", withFlags.currentTreatment),
      ],
    },
    { title: "Section 4 — Safety screening", rows: safetyRows },
    {
      title: "Section 5 — Treatment history and clinical context",
      rows: [
        ...historyRows,
        field("ADHD interest", withFlags.adhdInterest),
        field("Stimulant request", withFlags.stimulantRequest),
        field("Ketamine interest", withFlags.ketamineInterest),
        field("Prior advanced treatments", withFlags.ketaminePriorTreatment),
        field("Ketamine risk factors", withFlags.ketamineRiskFactors),
      ],
    },
    {
      title: "Section 6 — Logistics and payment",
      rows: [
        field("Preferred visit type", withFlags.preferredVisitType),
        field("Availability", withFlags.availability),
        field("Payment pathway", withFlags.paymentPathway),
        field("Payment type compatibility field", withFlags.paymentType),
        field("Insurance carrier", withFlags.insuranceProvider),
      ],
    },
    {
      title: "Section 7 — Scope of care and acknowledgment",
      rows: [
        field(
          "Documentation/legal/forensic request",
          withFlags.legalOrForensicRequest,
        ),
        field("Acknowledgment", bool(withFlags.acknowledgment)),
      ],
    },
    {
      title: "Additional notes",
      rows: [
        field(
          "Anything else / additional context",
          withFlags.additionalContext,
        ),
        field("Submission reference", id),
      ],
    },
  ];

  const bannerHtml = banners
    .map((banner) => {
      const high = banner.priority === "high";
      return `<div style="margin-top: 16px; border: 1px solid ${high ? "#fecdd3" : "#fde68a"}; border-left: 6px solid ${high ? "#be123c" : "#d97706"}; border-radius: 16px; background: ${high ? "#fff1f2" : "#fffbeb"}; padding: 16px;">
        <h2 style="margin: 0 0 8px; color: ${high ? "#9f1239" : "#92400e"}; font-size: 16px;">${escapeHtml(banner.title)}</h2>
        <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6;">${escapeHtml(banner.body)}</p>
        ${banner.action ? `<p style="margin: 10px 0 0; color: #0f172a; font-size: 14px; line-height: 1.6;"><strong>Suggested next action:</strong> ${escapeHtml(banner.action)}</p>` : ""}
      </div>`;
    })
    .join("");

  const html = `<!doctype html><html><body style="margin: 0; padding: 0; background: #f1f5f9; font-family: Arial, Helvetica, sans-serif; color: #0f172a;">
    <div style="display:none; max-height:0; overflow:hidden;">New prospective patient fit-screening submission. Risk level: ${escapeHtml(formatRiskLevel(withFlags.riskLevel))}.</div>
    <main style="max-width: 760px; margin: 0 auto; padding: 28px 14px;">
      <div style="border-radius: 24px; overflow: hidden; border: 1px solid #dbe5e2; background: #ffffff; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);">
        <div style="background: #173f42; padding: 24px; color: #ffffff;">
          <p style="margin: 0 0 8px; color: #d6e7c7; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">New prospective patient fit-screening submission</p>
          <h1 style="margin: 0; font-size: 26px; line-height: 1.2;">Good-Fit Questionnaire Submission</h1>
          <p style="margin: 14px 0 0; color: #e2e8f0; font-size: 14px; line-height: 1.6;">Submitted: ${escapeHtml(submitted)}<br />Risk level: ${escapeHtml(formatRiskLevel(withFlags.riskLevel))}<br />Internal flags: ${escapeHtml(formatInternalFlags(flags))}</p>
        </div>
        <div style="padding: 22px;">
          ${bannerHtml}
          <div style="margin-top: 18px; border: 1px solid #cfe0dc; border-radius: 18px; background: #f7fbfa; padding: 16px;">
            <h2 style="margin: 0 0 8px; color: #173f42; font-size: 16px;">Suggested next action</h2>
            <p style="margin: 0; color: #0f172a; font-size: 15px; line-height: 1.65;">${escapeHtml(action)}</p>
          </div>
          ${htmlCard("Compact triage summary", triageRows)}
          ${htmlCard("Quick triage summary", quickRows)}
          ${htmlCard("Contact details", contactRows)}
          ${htmlCard("Clinical fit summary", clinicalRows)}
          ${htmlCard("Safety screening", safetyRows)}
          ${htmlCard("Treatment history and clinical context", historyRows)}
          ${specialtyRows.length ? htmlCard("Conditional specialty sections", specialtyRows) : ""}
          ${htmlCard("Scope-of-care / documentation requests", scopeRows)}
          ${htmlCard("Anything else / additional context", [field("Final free-text response", withFlags.additionalContext)])}
          <h2 style="margin: 26px 0 8px; color: #173f42; font-size: 18px;">Full questionnaire responses</h2>
          ${fullSections.map((section) => htmlCard(section.title, section.rows)).join("")}
          <p style="margin: 20px 0 0; color: #64748b; font-size: 12px; line-height: 1.6;">Submission reference: ${escapeHtml(id)}</p>
        </div>
      </div>
    </main>
  </body></html>`;

  const warningText = banners.length
    ? [
        "WARNINGS",
        ...banners.map(
          (banner) =>
            `${banner.title}: ${banner.body}${banner.action ? ` Suggested next action: ${banner.action}` : ""}`,
        ),
      ].join("\n")
    : "WARNINGS\nNone";
  const text = [
    "Good-Fit Questionnaire Submission",
    "New prospective patient fit-screening submission",
    `Submitted: ${submitted}`,
    `Risk level: ${formatRiskLevel(withFlags.riskLevel)}`,
    `Internal flags: ${formatInternalFlags(flags)}`,
    "",
    warningText,
    "",
    "Suggested next action",
    action,
    "",
    textSection("Compact triage summary", triageRows),
    "",
    textSection("Patient/contact info", contactRows),
    "",
    textSection("Quick triage summary", quickRows),
    "",
    ...fullSections.flatMap((section) => [
      textSection(section.title, section.rows),
      "",
    ]),
  ].join("\n");

  return { html, text };
}

async function sendEmail(
  subject: string,
  content: EmailContent,
  replyTo?: string,
) {
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
        html: content.html,
        text: content.text,
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
        HtmlBody: content.html,
        TextBody: content.text,
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
        content: [
          { type: "text/plain", value: content.text },
          { type: "text/html", value: content.html },
        ],
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
  if (
    !arr(payload.allowedContactMethods).length &&
    !arr(payload.contactPreference).length
  )
    return "At least one allowed contact method is required.";
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
      contact_preference: arr(payload.allowedContactMethods).length
        ? arr(payload.allowedContactMethods)
        : arr(payload.contactPreference),
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
        arr(payload.allowedContactMethods).length
          ? `Allowed contact methods: ${arr(payload.allowedContactMethods).join(", ")}`
          : "",
        str(payload.preferredContactMethod)
          ? `Preferred contact method: ${str(payload.preferredContactMethod)}`
          : "",
        str(payload.bestContactTime)
          ? `Best contact time: ${str(payload.bestContactTime)}`
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
    const emailPayload = { ...payload, riskLevel, internalFlags: flags };
    const subject = buildAdminSubject(emailPayload);
    try {
      await sendEmail(subject, buildEmailContent(emailPayload, data.id), email);
    } catch (_) {
      /* saved even if email fails */
    }
    return json({ ok: true, id: data.id, riskLevel, internalFlags: flags });
  } catch (_) {
    return json({ ok: false, error: "Unexpected submission error." }, 500);
  }
});
