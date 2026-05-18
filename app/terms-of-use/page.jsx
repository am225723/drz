import { PageHero, Section } from '../../components/ui';

export const metadata = { title: 'Terms of Use | Integrative Psychiatry' };

export default function TermsOfUsePage() {
  return <><PageHero eyebrow="Legal" title="Terms of Use" subtitle="General terms for using this website." /><Section><div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8 text-lg leading-8 text-slate-700 shadow-sm"><p>This website is for informational purposes only and does not provide medical advice, diagnosis, or treatment. Using this website, submitting a form, or sending a message does not establish a doctor-patient relationship.</p><p className="mt-6">Website content may change over time and should not be relied upon as a substitute for individualized care from a qualified clinician.</p></div></Section></>;
}
