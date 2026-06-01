"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const combinedHelpOptions = [
  "Anxiety or excessive worry",
  "Panic attacks",
  "Depression or low mood",
  "Mood swings or irritability",
  "ADHD, focus, or executive functioning concerns",
  "Trauma or PTSD symptoms",
  "Grief or major life transition",
  "Sleep problems",
  "Relationship or attachment patterns",
  "Medication evaluation",
  "Medication management",
  "Psychotherapy",
  "Combined psychotherapy and medication management",
  "Ketamine-assisted psychotherapy consultation",
  "Diagnostic clarification / second opinion",
  "Other",
];

const adhdTriggerOptions = new Set([
  "ADHD, focus, or executive functioning concerns",
  "Diagnostic clarification / second opinion",
]);
const ketamineTriggerOptions = new Set([
  "Ketamine-assisted psychotherapy consultation",
]);

const goodFitItems = [
  "A careful psychiatric evaluation",
  "Thoughtful medication management",
  "Psychotherapy integrated with psychiatric care",
  "Help understanding emotional patterns, relationships, stress, and symptoms",
  "Support for anxiety, depression, trauma, grief, ADHD/focus concerns, or life transitions",
  "A collaborative, whole-person treatment plan",
];

const notFitItems = [
  "Urgent or crisis care",
  "Primary substance-use detox or stabilization",
  "Care focused only on obtaining a specific controlled substance",
  "One-time medication requests",
  "Court-ordered, custody, forensic, or disability evaluations",
  "Situations requiring intensive outpatient, partial hospitalization, inpatient, or emergency services",
];

const ketamineRisks = [
  "Bipolar disorder or history of mania",
  "Psychosis or hallucinations",
  "Uncontrolled high blood pressure",
  "Heart condition",
  "Active substance-use concern",
  "Seizure disorder",
  "Pregnancy or planning pregnancy",
  "None of the above",
  "Prefer to discuss directly",
];

const highRiskHospitalizationValues = new Set([
  "Recent suicide attempt",
  "Recent psychiatric hospitalization",
  "Recent serious self-harm",
]);

const initial = {
  fullName: "",
  preferredName: "",
  dob: "",
  email: "",
  mobile: "",
  currentLocation: "",
  contactPreference: [],
  voicemailConsent: false,
  appointmentGoals: [],
  primaryConcerns: [],
  presentingSummary: "",
  treatmentGoals: "",
  practiceFit: [],
  openToNonMedication: "",
  interestedInTherapy: "",
  currentTreatment: "",
  schedulingTimeline: "",
  functioningImpact: "",
  safetyRecentSi: "",
  safetySelfHarm: "",
  safetyHarmOthers: "",
  safetyHospitalization: "",
  safetyStaySafe: "",
  currentCrisis: false,
  currentMedications: "",
  pastTreatment: "",
  medicalConditions: "",
  substanceUse: "",
  substanceUsePattern: "",
  adhdInterest: "",
  stimulantRequest: "",
  ketamineInterest: "",
  ketaminePriorTreatment: [],
  ketamineRiskFactors: [],
  preferredVisitType: "",
  availability: [],
  paymentType: [],
  paymentPathway: "",
  insuranceProvider: "",
  legalOrForensicRequest: "",
  additionalContext: "",
  communicationConsent: false,
  acknowledgment: false,
  website: "",
};

function toggleArray(values, item) {
  return values.includes(item)
    ? values.filter((value) => value !== item)
    : [...values, item];
}

function getSubmitUrl() {
  const explicit = process.env.NEXT_PUBLIC_GOOD_FIT_FUNCTION_URL;
  if (explicit) return explicit;
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  return url ? `${url.replace(/\/$/, "")}/functions/v1/submit-good-fit` : "";
}

function getAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ""
  );
}

function isHighRisk(form) {
  return (
    form.safetyRecentSi === "Active thoughts of suicide" ||
    form.safetySelfHarm === "Yes" ||
    form.safetyHarmOthers === "Yes" ||
    form.currentCrisis ||
    form.safetyHospitalization === "Recent suicide attempt" ||
    form.safetyHospitalization === "Recent psychiatric hospitalization" ||
    form.safetyHospitalization === "Recent serious self-harm" ||
    form.safetyStaySafe === "No" ||
    form.safetyStaySafe === "Unsure"
  );
}

function internalFlagsFor(form) {
  const flags = [];
  if (isHighRisk(form)) flags.push("HIGH_PRIORITY_SAFETY_RISK");
  if (
    form.legalOrForensicRequest === "Yes" ||
    form.legalOrForensicRequest === "Maybe"
  )
    flags.push("SCOPE_REVIEW_POSSIBLE_REFER_OUT");
  return flags;
}

function payloadFor(form) {
  const flags = internalFlagsFor(form);
  const adhdInterest = form.appointmentGoals.some((item) =>
    adhdTriggerOptions.has(item),
  );
  const ketamineInterest = form.appointmentGoals.some((item) =>
    ketamineTriggerOptions.has(item),
  );

  return {
    ...form,
    primaryConcerns: form.appointmentGoals,
    practiceFit: form.appointmentGoals,
    paymentType: form.paymentPathway ? [form.paymentPathway] : form.paymentType,
    locationEligibility:
      form.currentLocation === "Yes, I am in Connecticut"
        ? "connecticut"
        : form.currentLocation === "No"
          ? "outside_connecticut"
          : "unsure",
    adhdInterest: adhdInterest
      ? form.adhdInterest || "Interested based on selected concerns"
      : "",
    ketamineInterest: ketamineInterest
      ? form.ketamineInterest || "Interested based on selected concerns"
      : "",
    riskLevel: flags.includes("HIGH_PRIORITY_SAFETY_RISK")
      ? "high"
      : "standard",
    internalFlags: flags,
  };
}

function validate(form) {
  if (!form.fullName.trim()) return "Please enter your full legal name.";
  if (!form.dob) return "Please enter your date of birth.";
  if (!form.email.trim()) return "Please enter your email address.";
  if (!form.mobile.trim()) return "Please enter your mobile phone number.";
  if (!form.currentLocation.trim())
    return "Please confirm whether you are located in Connecticut.";
  if (!form.presentingSummary.trim())
    return "Please briefly describe what led you to seek care now.";
  if (!form.legalOrForensicRequest)
    return "Please answer the documentation, legal, custody, disability, forensic, workplace, school, or benefits-related question.";
  if (!form.communicationConsent)
    return "Please confirm how the practice may contact you for scheduling and administrative purposes.";
  if (!form.acknowledgment)
    return "Please review and accept the final acknowledgment before submitting.";
  return "";
}

function Field({ label, htmlFor, helper, required, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block font-semibold text-slate-800"
      >
        {label} {required && <span className="text-rose-700">*</span>}
      </label>
      {children}
      {helper && (
        <p className="mt-2 text-sm leading-6 text-slate-600">{helper}</p>
      )}
    </div>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-slate-300 bg-white p-3 text-slate-950 outline-none transition focus:border-[#2f8c85] focus:ring-4 focus:ring-[#edf8f1]"
    />
  );
}

function SelectInput(props) {
  return (
    <select
      {...props}
      className="w-full rounded-2xl border border-slate-300 bg-white p-3 text-slate-950 outline-none transition focus:border-[#2f8c85] focus:ring-4 focus:ring-[#edf8f1]"
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className="min-h-28 w-full rounded-2xl border border-slate-300 bg-white p-3 text-slate-950 outline-none transition focus:border-[#2f8c85] focus:ring-4 focus:ring-[#edf8f1]"
    />
  );
}

function Checkbox({ label, checked, onChange, required = false }) {
  return (
    <label className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
      <input
        className="mt-1 accent-[#173f42]"
        type="checkbox"
        checked={checked}
        onChange={onChange}
        required={required}
      />
      <span>{label}</span>
    </label>
  );
}

function SectionCard({ number, title, intro, children }) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173f42] text-sm font-bold text-white">
          {number}
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {title}
          </h2>
          {intro && <p className="mt-2 leading-7 text-slate-600">{intro}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function InfoCard({ title, items }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <ul className="mt-4 space-y-3 text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f8c85]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CrisisModal({ onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="crisis-title"
        aria-describedby="crisis-description"
        className="w-full max-w-2xl rounded-[2rem] border border-amber-200 bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-amber-700" />
          <div>
            <h2
              id="crisis-title"
              className="text-2xl font-semibold text-slate-950"
            >
              If you may be unsafe, please seek urgent help now
            </h2>
            <p
              id="crisis-description"
              className="mt-4 text-base leading-8 text-slate-700"
            >
              This questionnaire is not monitored as an emergency service. If
              you may be in danger or need urgent help, please do not wait for a
              response from this form. Call 911, go to the nearest emergency
              room, or call/text 988 for the Suicide &amp; Crisis Lifeline. If
              you are outside the United States, contact your local emergency
              number or crisis service.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-[#173f42] px-5 py-3 font-semibold text-white"
          >
            I understand
          </button>
          <a
            href="tel:988"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-[#173f42]"
          >
            Call or text 988
          </a>
          <a
            href="tel:911"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-[#173f42]"
          >
            Call 911
          </a>
        </div>
      </div>
    </div>
  );
}

export default function GoodFitQuestionnaire() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const showAdhdQuestions = form.appointmentGoals.some((item) =>
    adhdTriggerOptions.has(item),
  );
  const showKetamineQuestions = form.appointmentGoals.some((item) =>
    ketamineTriggerOptions.has(item),
  );

  function setSafety(key, value) {
    set(key, value);
    if (
      (key === "safetyRecentSi" && value === "Active thoughts of suicide") ||
      (key === "safetySelfHarm" && value === "Yes") ||
      (key === "safetyHarmOthers" && value === "Yes") ||
      (key === "safetyHospitalization" &&
        highRiskHospitalizationValues.has(value)) ||
      (key === "safetyStaySafe" && (value === "No" || value === "Unsure"))
    ) {
      setShowCrisisModal(true);
    }
  }

  function toggleCrisis() {
    const next = !form.currentCrisis;
    set("currentCrisis", next);
    if (next) setShowCrisisModal(true);
  }

  async function submit(event) {
    event.preventDefault();
    const validationError = validate(form);
    if (validationError) {
      setStatus({ type: "error", message: validationError });
      return;
    }
    const endpoint = getSubmitUrl();
    const anonKey = getAnonKey();
    if (!endpoint || !anonKey) {
      setStatus({
        type: "error",
        message:
          "The secure questionnaire endpoint is not configured yet. Please contact the office directly.",
      });
      return;
    }
    setSubmitting(true);
    setStatus({ type: "loading", message: "Submitting questionnaire…" });
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify(payloadFor(form)),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false)
        throw new Error(data.error || "Unable to submit questionnaire.");
      setStatus({
        type: "success",
        message:
          "Thank you. Your questionnaire was received. The practice will review it and contact you about next steps. Please do not wait for a response from this form if you may be unsafe or need urgent help.",
      });
      setForm(initial);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.message ||
          "There was a problem submitting the questionnaire. Please contact the office directly.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-5xl space-y-6">
      {showCrisisModal && (
        <CrisisModal onClose={() => setShowCrisisModal(false)} />
      )}
      {status.message && (
        <div
          role="status"
          className={`rounded-[1.5rem] p-5 font-semibold ${status.type === "error" ? "border border-rose-200 bg-rose-50 text-rose-900" : "border border-emerald-200 bg-[#edf8f1] text-[#173f42]"}`}
        >
          {status.type === "success" && (
            <CheckCircle2 className="mr-2 inline h-5 w-5" />
          )}
          {status.message}
        </div>
      )}

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#2f8c85]">
          Finding the right psychiatric care matters.
        </p>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          This questionnaire helps Dr. Zelisko understand what you are looking
          for, whether this practice may be a good clinical fit, and whether
          another setting or level of care may better support you. Please answer
          as honestly as you can. There are no right or wrong answers.
        </p>
        <div className="mt-6 rounded-3xl bg-slate-50 p-5">
          <h2 className="text-xl font-semibold text-slate-950">
            What happens after I submit this?
          </h2>
          <p className="mt-3 leading-8 text-slate-700">
            After you submit this form, the practice will review your responses
            and contact you about next steps. Depending on your needs, this may
            include scheduling an evaluation, asking a few follow-up questions,
            or recommending a different level of care if that would be safer or
            more appropriate. Completing this questionnaire does not guarantee
            acceptance into care and does not establish a doctor-patient
            relationship.
          </p>
        </div>
      </div>

      <div
        className="rounded-[1.75rem] border-2 border-amber-300 bg-amber-50 p-5 text-amber-950 shadow-sm"
        role="alert"
      >
        <div className="mb-2 flex gap-2 text-lg font-semibold">
          <AlertTriangle className="h-6 w-6" /> Not for emergencies
        </div>
        <p className="leading-7">
          This questionnaire is for non-urgent fit screening only. It is not
          monitored as an emergency service. If you are in immediate danger,
          having thoughts of suicide, or need urgent help, call 911, go to the
          nearest emergency room, or call/text 988.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <InfoCard
          title="This practice may be a good fit if you are looking for:"
          items={goodFitItems}
        />
        <InfoCard
          title="This practice may not be the right fit for:"
          items={notFitItems}
        />
      </div>

      <input
        type="text"
        className="hidden"
        value={form.website}
        onChange={(event) => set("website", event.target.value)}
        tabIndex="-1"
        autoComplete="off"
        aria-hidden="true"
      />

      <SectionCard number="1" title="Basic information">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full legal name" htmlFor="fullName" required>
            <TextInput
              id="fullName"
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              required
            />
          </Field>
          <Field label="Preferred name" htmlFor="preferredName">
            <TextInput
              id="preferredName"
              value={form.preferredName}
              onChange={(e) => set("preferredName", e.target.value)}
            />
          </Field>
          <Field label="Date of birth" htmlFor="dob" required>
            <TextInput
              id="dob"
              type="date"
              value={form.dob}
              onChange={(e) => set("dob", e.target.value)}
              required
            />
          </Field>
          <Field label="Email address" htmlFor="email" required>
            <TextInput
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
            />
          </Field>
          <Field label="Mobile phone" htmlFor="mobile" required>
            <TextInput
              id="mobile"
              type="tel"
              value={form.mobile}
              onChange={(e) => set("mobile", e.target.value)}
              required
            />
          </Field>
          <Field
            label="Are you located in Connecticut for care?"
            htmlFor="currentLocation"
            required
          >
            <SelectInput
              id="currentLocation"
              value={form.currentLocation}
              onChange={(e) => set("currentLocation", e.target.value)}
              required
            >
              <option value="">Select one</option>
              <option>Yes, I am in Connecticut</option>
              <option>No</option>
              <option>Unsure / planning to be in Connecticut</option>
            </SelectInput>
          </Field>
        </div>
        {form.currentLocation === "No" && (
          <div
            className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950"
            role="status"
            aria-live="polite"
          >
            <p className="font-semibold">Location note</p>
            <p className="mt-2 leading-7">
              Dr. Zelisko’s practice is currently licensed to provide care to
              patients located in Connecticut. If you are not located in
              Connecticut, the practice may not be able to provide treatment.
              You may still submit the form if you are planning to be in
              Connecticut for care, but please note that out-of-state treatment
              may not be available.
            </p>
            <p className="mt-2 font-semibold">
              You may stop here if you are not planning to be in Connecticut for
              care.
            </p>
          </div>
        )}
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {["Phone", "Voicemail", "Text", "Email"].map((item) => (
            <Checkbox
              key={item}
              label={item}
              checked={form.contactPreference.includes(item)}
              onChange={() =>
                set(
                  "contactPreference",
                  toggleArray(form.contactPreference, item),
                )
              }
            />
          ))}
        </div>
        <div className="mt-4">
          <Checkbox
            label="I consent to being contacted by phone, voicemail, text, or email for scheduling and administrative purposes. I understand these methods may not be appropriate for emergencies."
            checked={form.communicationConsent}
            onChange={() =>
              set("communicationConsent", !form.communicationConsent)
            }
            required
          />
        </div>
        <div className="mt-4">
          <Checkbox
            label="It is okay to leave a voicemail for scheduling or administrative follow-up."
            checked={form.voicemailConsent}
            onChange={() => set("voicemailConsent", !form.voicemailConsent)}
          />
        </div>
      </SectionCard>

      <SectionCard
        number="2"
        title="What are you hoping to get help with?"
        intro="Select all that apply."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {combinedHelpOptions.map((item) => (
            <Checkbox
              key={item}
              label={item}
              checked={form.appointmentGoals.includes(item)}
              onChange={() =>
                set(
                  "appointmentGoals",
                  toggleArray(form.appointmentGoals, item),
                )
              }
            />
          ))}
        </div>
        <div className="mt-5 grid gap-5">
          <Field
            label="Briefly describe what led you to seek care now"
            htmlFor="presentingSummary"
            required
          >
            <TextArea
              id="presentingSummary"
              value={form.presentingSummary}
              onChange={(e) => set("presentingSummary", e.target.value)}
              required
            />
          </Field>
          <Field
            label="What would make treatment feel successful to you?"
            htmlFor="treatmentGoals"
          >
            <TextArea
              id="treatmentGoals"
              value={form.treatmentGoals}
              onChange={(e) => set("treatmentGoals", e.target.value)}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        number="3"
        title="Timeline, functioning, and care preferences"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="How soon are you hoping to be seen?"
            htmlFor="schedulingTimeline"
          >
            <SelectInput
              id="schedulingTimeline"
              value={form.schedulingTimeline}
              onChange={(e) => set("schedulingTimeline", e.target.value)}
            >
              <option value="">Select one</option>
              <option>First available</option>
              <option>Within 1–2 weeks</option>
              <option>Within a month</option>
              <option>Flexible</option>
              <option>I am not sure</option>
            </SelectInput>
          </Field>
          <Field
            label="Are symptoms currently affecting your ability to work, attend school, care for yourself, or maintain relationships?"
            htmlFor="functioningImpact"
          >
            <SelectInput
              id="functioningImpact"
              value={form.functioningImpact}
              onChange={(e) => set("functioningImpact", e.target.value)}
            >
              <option value="">Select one</option>
              <option>Not much</option>
              <option>Somewhat</option>
              <option>Significantly</option>
              <option>Severely</option>
              <option>Prefer to discuss directly</option>
            </SelectInput>
          </Field>
          <Field
            label="Open to non-medication options?"
            htmlFor="openToNonMedication"
          >
            <SelectInput
              id="openToNonMedication"
              value={form.openToNonMedication}
              onChange={(e) => set("openToNonMedication", e.target.value)}
            >
              <option value="">Select one</option>
              <option>Yes</option>
              <option>No</option>
              <option>Unsure</option>
            </SelectInput>
          </Field>
          <Field
            label="Interested in psychotherapy as part of care?"
            htmlFor="interestedInTherapy"
          >
            <SelectInput
              id="interestedInTherapy"
              value={form.interestedInTherapy}
              onChange={(e) => set("interestedInTherapy", e.target.value)}
            >
              <option value="">Select one</option>
              <option>Yes</option>
              <option>No</option>
              <option>Maybe</option>
              <option>Prefer to discuss directly</option>
            </SelectInput>
          </Field>
          <Field
            label="Are you currently in treatment with another clinician?"
            htmlFor="currentTreatment"
          >
            <SelectInput
              id="currentTreatment"
              value={form.currentTreatment}
              onChange={(e) => set("currentTreatment", e.target.value)}
            >
              <option value="">Select one</option>
              <option>No</option>
              <option>Therapist</option>
              <option>Psychiatrist / prescriber</option>
              <option>Primary care clinician</option>
              <option>Other</option>
            </SelectInput>
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        number="4"
        title="Safety screening"
        intro="These questions are asked so the practice can understand what level of support may be safest. Answering honestly helps us determine whether outpatient care is appropriate or whether more immediate support may be needed."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="In the past month, have you had thoughts of not wanting to be alive or thoughts of suicide?"
            htmlFor="safetyRecentSi"
          >
            <SelectInput
              id="safetyRecentSi"
              value={form.safetyRecentSi}
              onChange={(e) => setSafety("safetyRecentSi", e.target.value)}
            >
              <option value="">Select one</option>
              <option>No</option>
              <option>
                Fleeting or passive thoughts, such as wishing I would not wake
                up, but without intent or a plan
              </option>
              <option>Active thoughts of suicide</option>
              <option>Prefer to discuss directly</option>
            </SelectInput>
          </Field>
          <Field label="Thoughts of harming yourself?" htmlFor="safetySelfHarm">
            <SelectInput
              id="safetySelfHarm"
              value={form.safetySelfHarm}
              onChange={(e) => setSafety("safetySelfHarm", e.target.value)}
            >
              <option value="">Select one</option>
              <option>No</option>
              <option>Yes</option>
              <option>Prefer to discuss directly</option>
            </SelectInput>
          </Field>
          <Field
            label="Thoughts of harming someone else?"
            htmlFor="safetyHarmOthers"
          >
            <SelectInput
              id="safetyHarmOthers"
              value={form.safetyHarmOthers}
              onChange={(e) => setSafety("safetyHarmOthers", e.target.value)}
            >
              <option value="">Select one</option>
              <option>No</option>
              <option>Yes</option>
              <option>Prefer to discuss directly</option>
            </SelectInput>
          </Field>
          <Field
            label="Recent suicide attempt, psychiatric hospitalization, or serious self-harm?"
            htmlFor="safetyHospitalization"
          >
            <SelectInput
              id="safetyHospitalization"
              value={form.safetyHospitalization}
              onChange={(e) =>
                setSafety("safetyHospitalization", e.target.value)
              }
            >
              <option value="">Select one</option>
              <option>No</option>
              <option>Recent suicide attempt</option>
              <option>Recent psychiatric hospitalization</option>
              <option>Recent serious self-harm</option>
              <option>Prefer to discuss directly</option>
            </SelectInput>
          </Field>
          <Field
            label="Are you currently receiving enough support to stay safe until an outpatient appointment?"
            htmlFor="safetyStaySafe"
          >
            <SelectInput
              id="safetyStaySafe"
              value={form.safetyStaySafe}
              onChange={(e) => setSafety("safetyStaySafe", e.target.value)}
            >
              <option value="">Select one</option>
              <option>Yes</option>
              <option>No</option>
              <option>Unsure</option>
              <option>Prefer to discuss directly</option>
            </SelectInput>
          </Field>
        </div>
        <div className="mt-4">
          <Checkbox
            label="I am currently in crisis or need urgent help today."
            checked={form.currentCrisis}
            onChange={toggleCrisis}
          />
        </div>
      </SectionCard>

      <SectionCard number="5" title="Treatment history and clinical context">
        <div className="grid gap-5">
          <Field
            label="Current medications"
            htmlFor="currentMedications"
            helper="Please include psychiatric medications, non-psychiatric medications, supplements, and approximate doses if known."
          >
            <TextArea
              id="currentMedications"
              value={form.currentMedications}
              onChange={(e) => set("currentMedications", e.target.value)}
              placeholder="Please include psychiatric medications, non-psychiatric medications, supplements, and approximate doses if known."
            />
          </Field>
          <Field
            label="Past treatment or medications"
            htmlFor="pastTreatment"
            helper="Example: Lexapro in 2022 — helped slightly but caused fatigue; therapy for 6 months; Adderall previously prescribed; or no prior treatment."
          >
            <TextArea
              id="pastTreatment"
              value={form.pastTreatment}
              onChange={(e) => set("pastTreatment", e.target.value)}
              placeholder="Example: Lexapro in 2022 — helped slightly but caused fatigue; therapy for 6 months; Adderall previously prescribed; or no prior treatment."
            />
          </Field>
          <Field
            label="Medical conditions, allergies, or major health history"
            htmlFor="medicalConditions"
            helper="List any active medical conditions, major surgeries, medication allergies, heart conditions, seizure history, pregnancy status, or other health concerns that may affect treatment."
          >
            <TextArea
              id="medicalConditions"
              value={form.medicalConditions}
              onChange={(e) => set("medicalConditions", e.target.value)}
              placeholder="List any active medical conditions, major surgeries, medication allergies, heart conditions, seizure history, pregnancy status, or other health concerns that may affect treatment."
            />
          </Field>
          <Field
            label="Substance use"
            htmlFor="substanceUsePattern"
            helper="Include alcohol, cannabis, nicotine, stimulants, opioids, sedatives, or other substances. You may also write none, in recovery, or prefer to discuss."
          >
            <SelectInput
              id="substanceUsePattern"
              value={form.substanceUsePattern}
              onChange={(e) => set("substanceUsePattern", e.target.value)}
            >
              <option value="">Select one</option>
              <option>None</option>
              <option>Occasional</option>
              <option>Regular</option>
              <option>Daily</option>
              <option>In recovery</option>
              <option>Concerned about my use</option>
              <option>Prefer to discuss directly</option>
            </SelectInput>
          </Field>
          <TextArea
            aria-label="Substance use details"
            value={form.substanceUse}
            onChange={(e) => set("substanceUse", e.target.value)}
            placeholder="Include alcohol, cannabis, nicotine, stimulants, opioids, sedatives, or other substances. You may also write none, in recovery, or prefer to discuss."
          />
        </div>
      </SectionCard>

      {(showAdhdQuestions || showKetamineQuestions) && (
        <SectionCard number="6" title="Focused follow-up questions">
          {showAdhdQuestions && (
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="If ADHD or focus concerns are part of your reason for seeking care, what are you hoping to explore?"
                htmlFor="adhdInterest"
              >
                <SelectInput
                  id="adhdInterest"
                  value={form.adhdInterest}
                  onChange={(e) => set("adhdInterest", e.target.value)}
                >
                  <option value="">Select one</option>
                  <option>Diagnosis / diagnostic clarification</option>
                  <option>Medication options</option>
                  <option>Therapy or skills-based support</option>
                  <option>Second opinion</option>
                  <option>Continuation of a current prescription</option>
                  <option>I am not sure yet</option>
                  <option>Prefer to discuss directly</option>
                </SelectInput>
              </Field>
              <Field
                label="Are you currently prescribed stimulant medication or requesting continuation of a current prescription?"
                htmlFor="stimulantRequest"
              >
                <SelectInput
                  id="stimulantRequest"
                  value={form.stimulantRequest}
                  onChange={(e) => set("stimulantRequest", e.target.value)}
                >
                  <option value="">Select one</option>
                  <option>No</option>
                  <option>Yes, currently prescribed</option>
                  <option>Previously prescribed</option>
                  <option>Seeking a new stimulant prescription</option>
                  <option>Open to discussing all options</option>
                  <option>Prefer to discuss directly</option>
                </SelectInput>
              </Field>
            </div>
          )}
          {showKetamineQuestions && (
            <div
              className={`${showAdhdQuestions ? "mt-8 border-t border-slate-200 pt-8" : ""} grid gap-5`}
            >
              <Field
                label="What are you hoping ketamine-assisted psychotherapy or ketamine consultation would help with?"
                htmlFor="ketamineInterest"
                helper="Briefly share what led you to consider ketamine, if applicable."
              >
                <TextArea
                  id="ketamineInterest"
                  value={form.ketamineInterest}
                  onChange={(e) => set("ketamineInterest", e.target.value)}
                  placeholder="Briefly share what led you to consider ketamine, if applicable."
                />
              </Field>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">
                  Have you received ketamine, esketamine/Spravato, TMS, ECT, or
                  another advanced treatment before?
                </h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {[
                    "No",
                    "Ketamine-assisted psychotherapy",
                    "IV or IM ketamine",
                    "Esketamine / Spravato",
                    "TMS",
                    "ECT",
                    "Other",
                    "Prefer to discuss directly",
                  ].map((item) => (
                    <Checkbox
                      key={item}
                      label={item}
                      checked={form.ketaminePriorTreatment.includes(item)}
                      onChange={() =>
                        set(
                          "ketaminePriorTreatment",
                          toggleArray(form.ketaminePriorTreatment, item),
                        )
                      }
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">
                  Ketamine medical risk factors
                </h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {ketamineRisks.map((item) => (
                    <Checkbox
                      key={item}
                      label={item}
                      checked={form.ketamineRiskFactors.includes(item)}
                      onChange={() =>
                        set(
                          "ketamineRiskFactors",
                          toggleArray(form.ketamineRiskFactors, item),
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </SectionCard>
      )}

      <SectionCard number="7" title="Logistics and payment">
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Preferred appointment type"
            htmlFor="preferredVisitType"
          >
            <SelectInput
              id="preferredVisitType"
              value={form.preferredVisitType}
              onChange={(e) => set("preferredVisitType", e.target.value)}
            >
              <option value="">Select one</option>
              <option>In person</option>
              <option>Telehealth</option>
              <option>Either</option>
              <option>Not sure</option>
            </SelectInput>
          </Field>
          <Field
            label="Payment pathway you are hoping to use"
            htmlFor="paymentPathway"
          >
            <SelectInput
              id="paymentPathway"
              value={form.paymentPathway}
              onChange={(e) => set("paymentPathway", e.target.value)}
            >
              <option value="">Select one</option>
              <option>
                Insurance through a partner platform, if available
              </option>
              <option>Private pay</option>
              <option>Out-of-network reimbursement / superbill</option>
              <option>Not sure yet</option>
            </SelectInput>
          </Field>
          <Field
            label="Insurance carrier, if applicable"
            htmlFor="insuranceProvider"
            helper="Please list the insurance company and plan name if you know it. The practice can help clarify whether scheduling through a partner platform may be available."
          >
            <TextInput
              id="insuranceProvider"
              value={form.insuranceProvider}
              onChange={(e) => set("insuranceProvider", e.target.value)}
            />
          </Field>
        </div>
        <h3 className="mt-6 text-lg font-semibold text-slate-950">
          Availability
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          {[
            "Weekday mornings",
            "Weekday afternoons",
            "Weekday evenings",
            "First available",
          ].map((item) => (
            <Checkbox
              key={item}
              label={item}
              checked={form.availability.includes(item)}
              onChange={() =>
                set("availability", toggleArray(form.availability, item))
              }
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        number="8"
        title="Additional fit questions and acknowledgment"
      >
        <div className="grid gap-5">
          <Field
            label="Are you seeking treatment primarily for documentation, legal, court, custody, disability, forensic, workplace, school, or benefits-related purposes?"
            htmlFor="legalOrForensicRequest"
            required
            helper="This practice does not provide forensic evaluations, custody evaluations, or court-ordered evaluations through this questionnaire. Clinical letters or documentation, when appropriate, require an established treatment relationship and clinical evaluation."
          >
            <SelectInput
              id="legalOrForensicRequest"
              value={form.legalOrForensicRequest}
              onChange={(e) => set("legalOrForensicRequest", e.target.value)}
              required
            >
              <option value="">Select one</option>
              <option>No</option>
              <option>Yes</option>
              <option>Maybe</option>
              <option>Prefer to discuss directly</option>
            </SelectInput>
          </Field>
          <Field
            label="Anything else important for the practice to know?"
            htmlFor="additionalContext"
          >
            <TextArea
              id="additionalContext"
              value={form.additionalContext}
              onChange={(e) => set("additionalContext", e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-5">
          <Checkbox
            label="I understand that this questionnaire is for non-urgent fit screening only. Submitting it does not create a doctor-patient relationship, does not guarantee acceptance into care, and does not guarantee that any specific medication, letter, diagnosis, or treatment will be provided. I understand that all clinical decisions require a full evaluation. If I am experiencing an emergency or may be unsafe, I should call 911, go to the nearest emergency room, or call/text 988."
            checked={form.acknowledgment}
            onChange={() => set("acknowledgment", !form.acknowledgment)}
            required
          />
        </div>
      </SectionCard>

      <button
        disabled={submitting}
        className="w-full rounded-2xl bg-[#173f42] px-6 py-4 text-base font-bold text-white transition hover:bg-[#24565a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit Good-Fit Questionnaire"}
      </button>
    </form>
  );
}
