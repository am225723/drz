import { PageHero, Section } from '../../components/ui';

export const metadata = {
  title: 'Website Privacy Policy | Integrative Psychiatry',
  description: 'Website Privacy Policy for Integrative Psychiatry.'
};

const sections = [
  {
    title: '1. Information We Collect',
    body: [
      'We do not require you to provide sensitive clinical information to browse our website. We may collect information you voluntarily provide, such as your name, email address, phone number, appointment preferences, insurance/payment information, and information you choose to include when you submit a contact form, good-fit questionnaire, email us, or initiate booking.',
      'When you click links to access our patient portal, schedule appointments, or fill out intake paperwork, you are directed to our secure, HIPAA-compliant partner platform, PracticeQ.',
      'We may also collect technical data such as your IP address, browser type, device information, and pages visited on our site.'
    ]
  },
  {
    title: '2. How We Use Your Information',
    body: [
      'We use the information we collect to respond to your inquiries, answer questions, coordinate administrative follow-up, communicate important updates regarding our practice, and operate, maintain, and optimize our website functionality and user experience.',
      'We will never sell, rent, or lease your personal information to third parties.'
    ]
  },
  {
    title: '3. SMS/Text Messaging Disclosures',
    body: [
      'If you opt in to receive SMS text messages from us, such as appointment reminders, scheduling updates, or transactional messages via PracticeQ, we will only text you if you explicitly provide your mobile number and consent to receive text messages.',
      'You can opt out of text alerts at any time by replying STOP to any text message you receive from us.',
      'Your mobile phone number, SMS consent status, and text messaging data will never be shared, sold, or rented to any third parties, affiliates, or marketing partners for promotional purposes.'
    ]
  },
  {
    title: '4. Cookies and Analytics Tracking',
    body: [
      'Our website may use cookies and tracking technologies to enhance your browsing experience. We may use Google Analytics to collect anonymous website traffic data, such as browser type, time of visit, and pages viewed. This helps us analyze how visitors interact with our site so we can improve its performance.',
      'Google Analytics does not track, collect, or link your personally identifiable clinical information or Protected Health Information.',
      'You can disable cookies through your web browser settings or opt out of Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on.'
    ]
  },
  {
    title: '5. Third-Party Portals, Vendors, and Security',
    body: [
      'We implement administrative, technical, and physical security measures to protect personal information submitted to us. Our website uses secure encryption, including SSL/TLS, to protect basic data transmissions.',
      'Any health data, intake forms, or sensitive communications for established clinical care are handled via PracticeQ, which utilizes encrypted, role-based access controls to safeguard data under a signed HIPAA Business Associate Agreement.',
      'We may use trusted third-party vendors for website hosting, database services, secure forms, email delivery, analytics, scheduling links, and patient portal workflows. These vendors are used only as needed to operate the website and practice workflows.'
    ]
  },
  {
    title: '6. Website Forms and Questionnaires',
    body: [
      'If the practice provides a designated website form, such as a contact form or good-fit questionnaire, information submitted through that form may be used for administrative screening and follow-up. Submitting a form or questionnaire does not establish a doctor-patient relationship.',
      'Please do not use website forms for emergencies or urgent clinical concerns. Existing patients should use the patient portal for clinical communication whenever possible.'
    ]
  },
  {
    title: '7. Data Retention',
    body: [
      'We retain website inquiries and related administrative records for as long as reasonably necessary for administrative, legal, compliance, and practice-management purposes.'
    ]
  },
  {
    title: '8. Your Connecticut Privacy Rights',
    body: [
      'In accordance with Connecticut data privacy laws, you may have the right to request access to personal data, request correction of inaccuracies, request deletion of personal data provided by or obtained about you, and opt out of certain processing such as targeted advertising or profiling. We do not sell your data or use it for targeted marketing.',
      'To exercise any of these rights, please contact us using the information below.'
    ]
  },
  {
    title: '9. Children’s Privacy',
    body: ['Our practice and website are not directed to or intended for individuals under the age of 18. We do not knowingly collect personal information from minors via this website.']
  },
  {
    title: '10. Changes to This Privacy Policy',
    body: ['We may update this Website Privacy Policy from time to time to maintain compliance with changing laws or practice operations. We will post changes on this page with an updated Effective Date.']
  },
  {
    title: '11. Contact Us',
    body: ['If you have questions about this Website Privacy Policy or wish to exercise your data privacy rights, please contact us at Integrative Psychiatry, 45 South Main Street, Suite 111, West Hartford, CT 06107. Phone: 860.615.3629. Email: support@drzelisko.com. Website: drzelisko.com.']
  }
];

function LegalSection({ section }) {
  return <section className="border-t border-slate-200 py-7 first:border-t-0 first:pt-0"><h2 className="text-2xl font-semibold tracking-tight text-slate-950">{section.title}</h2><div className="mt-4 space-y-4 text-lg leading-8 text-slate-700">{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>;
}

export default function PrivacyPolicyPage() {
  return <><PageHero eyebrow="Legal" title="Website Privacy Policy" subtitle="How website information is collected, used, and protected." /><Section><article className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"><p className="mb-4 rounded-2xl bg-[#edf8f1] p-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#173f42]">Effective Date: May 18, 2026</p><p className="mb-8 text-lg leading-8 text-slate-700">Welcome to Integrative Psychiatry. Your privacy is critically important to us. This Website Privacy Policy describes how we collect, use, and protect your information when you visit our website, drzelisko.com. This Website Privacy Policy is separate from our clinical Notice of Privacy Practices, which outlines how we handle Protected Health Information under HIPAA once you establish a clinical relationship with us.</p>{sections.map((section) => <LegalSection key={section.title} section={section} />)}</article></Section></>;
}
