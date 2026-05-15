(() => {
  const REASON_OPTIONS = ['Anxiety', 'Depression', 'ADHD', 'Medication Management', 'Psychotherapy', 'Ketamine-Assisted Psychotherapy', 'Trauma / PTSD', 'Sleep Concerns', 'Substance Use / Relapse Prevention', 'Relationship Concerns', 'Diagnostic Clarification / Second Opinion', 'Other'];
  const INSURANCE_OPTIONS = ['Aetna', 'Anthem / Blue Cross Blue Shield', 'Cigna', 'ConnectiCare', 'Harvard Pilgrim', 'Optum / UnitedHealthcare', 'Oxford', 'Medicaid / HUSKY', 'Medicare', 'Private Pay', 'Other / Not Sure'];

  function ensureStyles() {
    if (document.getElementById('rz-contact-form-styles')) return;
    const style = document.createElement('style');
    style.id = 'rz-contact-form-styles';
    style.textContent = `
      .rz-contact-shell{margin:40px auto 0;max-width:1120px;border-radius:34px;overflow:hidden;background:white;color:#0f172a;box-shadow:0 28px 70px rgba(15,23,42,.28);border:1px solid rgba(255,255,255,.2)}
      .rz-contact-head{background:radial-gradient(circle at top left,rgba(159,207,154,.35),transparent 35%),#173f42;color:white;padding:34px}.rz-contact-head p{color:#e2f3df;line-height:1.75;max-width:820px}.rz-contact-head h2{font-size:clamp(1.9rem,4vw,3rem);line-height:1.08;margin:8px 0 12px}.rz-contact-kicker{text-transform:uppercase;letter-spacing:.22em;color:#9fcf9a;font-weight:800;font-size:.8rem}.rz-emergency{margin-top:22px;border:1px solid rgba(252,211,77,.45);background:rgba(251,191,36,.12);border-radius:22px;padding:18px;color:#fff7ed;line-height:1.65}.rz-form{padding:30px;display:grid;gap:28px}.rz-fieldset{border:1px solid #e2e8f0;border-radius:26px;padding:24px;background:#fff}.rz-fieldset legend{padding:0 10px;color:#173f42;font-weight:800;font-size:1.08rem}.rz-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.rz-field label,.rz-checkgroup-label{display:block;font-weight:700;color:#1e293b;margin-bottom:8px}.rz-field small{display:block;color:#64748b;margin-top:6px;line-height:1.45}.rz-field input,.rz-field select,.rz-field textarea{width:100%;border:1px solid #cbd5e1;border-radius:16px;padding:13px 14px;font:inherit;background:white;color:#0f172a;outline:none}.rz-field input:focus,.rz-field select:focus,.rz-field textarea:focus{border-color:#2f8c85;box-shadow:0 0 0 4px rgba(47,140,133,.14)}.rz-field textarea{min-height:112px;resize:vertical}.rz-check-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.rz-check{display:flex;gap:10px;align-items:flex-start;border:1px solid #e2e8f0;border-radius:16px;padding:12px;background:#f8fafc;color:#334155}.rz-check input{margin-top:3px;accent-color:#173f42}.rz-radio-pills{display:flex;flex-wrap:wrap;gap:10px}.rz-radio{display:flex;align-items:center;gap:9px;border:1px solid #cbd5e1;border-radius:999px;padding:11px 15px;background:white;font-weight:700;color:#334155}.rz-radio input{accent-color:#173f42}.rz-submit-row{display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between;border-top:1px solid #e2e8f0;padding-top:24px}.rz-submit{border:0;border-radius:18px;background:#173f42;color:white;font-weight:800;padding:14px 22px;cursor:pointer}.rz-submit:hover{background:#24565a}.rz-secondary-link{border:1px solid #cbd5e1;border-radius:18px;background:white;color:#173f42;font-weight:800;padding:13px 18px;text-decoration:none}.rz-note{max-width:660px;color:#64748b;font-size:.94rem;line-height:1.55}.rz-form-status{display:none;border-radius:18px;padding:14px 16px;background:#edf8f1;color:#173f42;font-weight:700}.rz-form-status.show{display:block}.rz-required{color:#b91c1c}.rz-admin-note{margin-top:18px;border-radius:18px;background:#f8fafc;color:#475569;padding:14px 16px;line-height:1.55;font-size:.94rem}@media(max-width:850px){.rz-grid,.rz-check-grid{grid-template-columns:1fr}.rz-contact-head,.rz-form{padding:22px}.rz-submit-row{align-items:stretch}.rz-submit,.rz-secondary-link{width:100%;justify-content:center;text-align:center}}
    `;
    document.head.appendChild(style);
  }

  function options(list) {
    return list.map((item) => `<option value="${item}">${item}</option>`).join('');
  }

  function buildForm() {
    return `
      <section class="rz-contact-shell" id="secure-contact-form">
        <div class="rz-contact-head">
          <div class="rz-contact-kicker">Secure inquiry request</div>
          <h2>Contact the practice</h2>
          <p>Use this form for non-urgent appointment and administrative requests. A production version should submit to IntakeQ/PracticeQ or another HIPAA-covered form endpoint with a signed BAA.</p>
          <div class="rz-emergency"><strong>Emergencies:</strong> This form is not monitored 24/7 and must not be used for mental health emergencies or urgent clinical matters. If you are experiencing a crisis, having thoughts of suicide, or facing a medical emergency, please do not use this form. Call or text 988 to reach the Suicide & Crisis Lifeline, dial 911, or go directly to the nearest hospital emergency room.</div>
        </div>
        <form class="rz-form" id="rz-secure-contact-form" data-secure-endpoint="">
          <fieldset class="rz-fieldset">
            <legend>Essential Information</legend>
            <div class="rz-grid">
              <div class="rz-field"><label for="fullName">Full legal name <span class="rz-required">*</span></label><input id="fullName" name="fullName" autocomplete="name" required /></div>
              <div class="rz-field"><label for="preferredName">Preferred name</label><input id="preferredName" name="preferredName" autocomplete="nickname" /></div>
              <div class="rz-field"><label for="dob">Date of birth <span class="rz-required">*</span></label><input id="dob" name="dob" type="date" required /><small>Used to determine adult/minor status.</small></div>
              <div class="rz-field"><label for="mobile">Mobile phone <span class="rz-required">*</span></label><input id="mobile" name="mobile" type="tel" autocomplete="tel" required /></div>
              <div class="rz-field"><label for="email">Email address <span class="rz-required">*</span></label><input id="email" name="email" type="email" autocomplete="email" required /></div>
              <div class="rz-field"><span class="rz-checkgroup-label">Preferred contact method</span><div class="rz-check-grid"><label class="rz-check"><input type="checkbox" name="contactPreference" value="Text" /> Text</label><label class="rz-check"><input type="checkbox" name="contactPreference" value="Call" /> Call</label><label class="rz-check"><input type="checkbox" name="contactPreference" value="Email" /> Email</label></div></div>
            </div>
            <div style="margin-top:18px"><label class="rz-check"><input type="checkbox" name="voicemailConsent" value="Yes" /> I give permission for the practice to leave voicemail messages at the number provided.</label></div>
          </fieldset>

          <fieldset class="rz-fieldset">
            <legend>Appointment Details</legend>
            <div class="rz-grid">
              <div class="rz-field"><span class="rz-checkgroup-label">Visit type <span class="rz-required">*</span></span><div class="rz-radio-pills"><label class="rz-radio"><input type="radio" name="visitType" value="Telehealth" required /> Telehealth</label><label class="rz-radio"><input type="radio" name="visitType" value="In-person" /> In-person</label></div></div>
              <div class="rz-field"><span class="rz-checkgroup-label">Availability</span><div class="rz-check-grid"><label class="rz-check"><input type="checkbox" name="availability" value="Mornings" /> Mornings</label><label class="rz-check"><input type="checkbox" name="availability" value="Afternoons" /> Afternoons</label><label class="rz-check"><input type="checkbox" name="availability" value="Evenings" /> Evenings</label></div></div>
              <div class="rz-field"><label for="reasonForCare">Reason for care <span class="rz-required">*</span></label><select id="reasonForCare" name="reasonForCare" required><option value="">Select one</option>${options(REASON_OPTIONS)}</select></div>
              <div class="rz-field"><label for="briefContext">Any brief context you wish to share</label><textarea id="briefContext" name="briefContext" maxlength="600" placeholder="Optional. Please keep this brief and avoid urgent details."></textarea><small>Limit: 600 characters. Do not use this for emergencies or urgent clinical matters.</small></div>
            </div>
          </fieldset>

          <fieldset class="rz-fieldset">
            <legend>Financial Screening</legend>
            <div class="rz-grid">
              <div class="rz-field"><span class="rz-checkgroup-label">Payment type <span class="rz-required">*</span></span><div class="rz-check-grid"><label class="rz-check"><input type="checkbox" name="paymentType" value="Using Insurance" /> Using Insurance</label><label class="rz-check"><input type="checkbox" name="paymentType" value="Private Pay" /> Private Pay</label></div></div>
              <div class="rz-field"><label for="insuranceProvider">Insurance provider</label><select id="insuranceProvider" name="insuranceProvider"><option value="">Select or choose Other</option>${options(INSURANCE_OPTIONS)}</select></div>
            </div>
            <div style="margin-top:18px"><label class="rz-check"><input type="checkbox" name="oonAcknowledgment" value="Yes" /> I understand that if my plan is not accepted or services are out-of-network, I may be responsible for the practice’s private-pay rates and/or may need to seek reimbursement from my insurer.</label></div>
          </fieldset>

          <div class="rz-form-status" id="rz-form-status"></div>
          <div class="rz-submit-row">
            <p class="rz-note">This front-end form is ready for a HIPAA-compliant backend. Do not route submissions to regular email. Connect it to IntakeQ/PracticeQ or another BAA-covered endpoint before accepting patient information.</p>
            <div style="display:flex;gap:12px;flex-wrap:wrap"><a class="rz-secondary-link" href="https://drz.intakeq.com/portal" target="_blank" rel="noreferrer">Open Patient Portal</a><button class="rz-submit" type="submit">Submit Secure Inquiry</button></div>
          </div>
          <div class="rz-admin-note"><strong>Admin setup note:</strong> add your secure IntakeQ/PracticeQ form endpoint to <code>data-secure-endpoint</code> on this form. Until then, submissions are intentionally blocked to avoid sending PHI through an insecure channel.</div>
        </form>
      </section>`;
  }

  function calculateAge(dobString) {
    const dob = new Date(dobString);
    if (Number.isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDelta = today.getMonth() - dob.getMonth();
    if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate())) age -= 1;
    return age;
  }

  function serializeForm(form) {
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      if (data[key]) data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
      else data[key] = value;
    }
    data.age = calculateAge(data.dob);
    data.isMinor = typeof data.age === 'number' ? data.age < 18 : null;
    data.submittedAt = new Date().toISOString();
    return data;
  }

  function attachFormBehavior(root) {
    const form = root.querySelector('#rz-secure-contact-form');
    const status = root.querySelector('#rz-form-status');
    if (!form || form.dataset.behaviorAttached === 'true') return;
    form.dataset.behaviorAttached = 'true';
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const endpoint = form.dataset.secureEndpoint;
      const data = serializeForm(form);
      if (!endpoint) {
        status.textContent = 'This form is designed but not connected yet. Please use the Patient Portal or booking links until a HIPAA-compliant endpoint is configured.';
        status.classList.add('show');
        console.info('Secure inquiry form payload preview. Do not send this to regular email:', data);
        return;
      }
      try {
        const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!response.ok) throw new Error('Submission failed');
        status.textContent = 'Thank you. Your inquiry was submitted through the secure form endpoint.';
        status.classList.add('show');
        form.reset();
      } catch (error) {
        status.textContent = 'There was a problem submitting the form. Please use the Patient Portal or call the office.';
        status.classList.add('show');
      }
    });
  }

  function enhanceContactPage() {
    ensureStyles();
    const contactTitle = Array.from(document.querySelectorAll('h1')).find((node) => /start with the right next step|contact/i.test(node.textContent || ''));
    if (!contactTitle || document.getElementById('secure-contact-form')) return;
    const main = document.querySelector('main') || document.body;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildForm();
    const contactSection = Array.from(document.querySelectorAll('section')).find((section) => section.textContent && section.textContent.includes('Office information'));
    if (contactSection) contactSection.insertAdjacentElement('afterend', wrapper.firstElementChild);
    else main.appendChild(wrapper.firstElementChild);
    attachFormBehavior(document);
  }

  const observer = new MutationObserver(enhanceContactPage);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhanceContactPage);
  else enhanceContactPage();
})();
