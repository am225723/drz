import { PageHero, Section } from '../../components/ui';

export const metadata = { title: 'Notice of Privacy Practices | Integrative Psychiatry' };

export default function NoticeOfPrivacyPracticesPage() {
  return <><PageHero eyebrow="Legal" title="Notice of Privacy Practices" subtitle="This page should be finalized with HIPAA counsel before publication." /><Section><div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8 text-lg leading-8 text-slate-700 shadow-sm"><p>This Notice of Privacy Practices page is reserved for the practice’s HIPAA Notice. It should be replaced with the official attorney-reviewed notice describing how protected health information may be used and disclosed and how patients may exercise their privacy rights.</p><p className="mt-6 font-semibold text-slate-950">Patients should use secure PracticeQ / IntakeQ workflows for clinical forms, secure messaging, and protected health information.</p></div></Section></>;
}
