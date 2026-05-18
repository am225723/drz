import { PageHero, Section } from '../../components/ui';

export const metadata = { title: 'Emergency Disclaimer | Integrative Psychiatry' };

export default function EmergencyDisclaimerPage() {
  return <><PageHero eyebrow="Emergency Disclaimer" title="This practice does not provide emergency services." subtitle="Use emergency and crisis resources immediately if you are in danger or need urgent help." /><Section><div className="mx-auto max-w-4xl rounded-[2rem] border border-red-200 bg-red-50 p-8 text-lg leading-8 text-red-950 shadow-sm"><p>If you are experiencing a psychiatric emergency, are in immediate danger, or may harm yourself or someone else, do not use this website, the contact form, email, or online scheduling.</p><p className="mt-6 font-semibold">Call 911, go to the nearest emergency room, or call/text 988 for the Suicide & Crisis Lifeline.</p></div></Section></>;
}
