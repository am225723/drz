import { PageHero, Section } from '../../components/ui';

export const metadata = { title: 'Privacy Policy | Integrative Psychiatry' };

export default function PrivacyPolicyPage() {
  return <><PageHero eyebrow="Legal" title="Privacy Policy" subtitle="This page is a placeholder for attorney-reviewed privacy language." /><Section><div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8 text-lg leading-8 text-slate-700 shadow-sm"><p>This website should use a healthcare attorney-reviewed Privacy Policy before final publication. The policy should describe how website information is collected, used, protected, retained, and shared, including analytics, contact forms, scheduling links, and third-party services.</p><p className="mt-6 font-semibold text-slate-950">Submitting a form or sending a message through this website does not establish a doctor-patient relationship.</p></div></Section></>;
}
