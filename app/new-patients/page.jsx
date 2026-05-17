import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { BookingExperience, Button, Card, PageHero, Section, SectionHeading } from '../../components/ui';

export const metadata = { title: 'Scheduling | Integrative Psychiatry' };

const fitItems = [
  'A psychiatrist who can provide both psychotherapy and medication management',
  'A deeper understanding of symptoms, patterns, relationships, and emotional history',
  'Treatment that considers sleep, stress, lifestyle, medical context, and personal meaning',
  'Care for anxiety, depression, trauma, ADHD/focus concerns, grief, or life transitions',
  'A collaborative, reflective approach to treatment planning'
];

export default function NewPatientsPage() {
  return <><PageHero eyebrow="New Patients" title="Book a Psychiatric Evaluation Intake Appointment." subtitle="Choose virtual or in-office care, then complete the official IntakeQ scheduling widget." /><Section><BookingExperience mode="new" defaultKey="evaluation-virtual" /></Section><Section className="bg-slate-50"><SectionHeading eyebrow="Fit" title="Is this practice right for me?" subtitle="This practice may be a good fit if you are looking for thoughtful, individualized psychiatric care that goes beyond a brief medication visit." /><div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">{fitItems.map((item) => <Card key={item}><div className="flex gap-3 p-5"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#2f8c85]" /><p className="leading-7 text-slate-700">{item}</p></div></Card>)}</div><div className="mx-auto mt-8 max-w-4xl rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6 text-amber-950"><div className="flex gap-3"><AlertTriangle className="mt-1 h-5 w-5 shrink-0" /><div><p>This practice may not be the right fit for urgent or emergency care, one-time medication requests, or treatment focused only on controlled substances without a broader psychiatric evaluation.</p><p className="mt-3 font-semibold">If you are experiencing a psychiatric emergency, call 911, go to the nearest emergency room, or call/text 988 for the Suicide & Crisis Lifeline.</p></div></div></div><div className="mt-8 text-center"><Button href="/new-patients">Schedule a New Patient Evaluation</Button></div></Section></>;
}
