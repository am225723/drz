import { AlertTriangle, CheckCircle2, ClipboardCheck, LockKeyhole, MousePointerClick } from 'lucide-react';
import { BookingExperience, Button, Card, PageHero, Section, SectionHeading } from '../../components/ui';

export const metadata = { title: 'Scheduling | Integrative Psychiatry' };

const fitItems = [
  'A psychiatrist who can provide both psychotherapy and medication management',
  'A deeper understanding of symptoms, patterns, relationships, and emotional history',
  'Treatment that considers sleep, stress, lifestyle, medical context, and personal meaning',
  'Care for anxiety, depression, trauma, ADHD/focus concerns, grief, or life transitions',
  'A collaborative, reflective approach to treatment planning'
];

const steps = [
  ['Choose visit type', 'Select virtual or in-office evaluation.'],
  ['Schedule securely', 'Complete the official IntakeQ booking widget.'],
  ['Receive next steps', 'Follow the instructions sent through the secure system.']
];

export default function NewPatientsPage() {
  return <>
    <PageHero eyebrow="New Patients" title="Book a Psychiatric Evaluation Intake Appointment." subtitle="Choose virtual or in-office care, then complete the official IntakeQ scheduling widget." />
    <Section className="bg-white"><div className="grid gap-6 md:grid-cols-3">{steps.map(([title, text], index) => { const icons = [MousePointerClick, LockKeyhole, ClipboardCheck]; const Icon = icons[index]; return <Card key={title}><div className="p-6"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf8f1] text-[#173f42]"><Icon className="h-6 w-6" /></div><p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f8c85]">Step {index + 1}</p><h2 className="mt-2 text-2xl font-semibold text-slate-950">{title}</h2><p className="mt-3 leading-7 text-slate-700">{text}</p></div></Card>; })}</div></Section>
    <Section className="bg-[#173f42] text-white"><div className="mx-auto mb-12 max-w-3xl text-center"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#9fcf9a]">Appointments</p><h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Schedule a psychiatric evaluation securely.</h2><p className="mt-4 text-lg leading-8 text-slate-100">Choose an appointment type, then complete scheduling through the secure IntakeQ booking system.</p></div><BookingExperience mode="new" defaultKey="evaluation-virtual" /></Section>
    <Section className="bg-slate-50"><SectionHeading eyebrow="Fit" title="Is this practice right for me?" subtitle="This practice may be a good fit if you are looking for thoughtful, individualized psychiatric care that goes beyond a brief medication visit." /><div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">{fitItems.map((item) => <Card key={item}><div className="flex gap-3 p-5"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#2f8c85]" /><p className="leading-7 text-slate-700">{item}</p></div></Card>)}</div><div className="mx-auto mt-8 max-w-4xl rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6 text-amber-950"><div className="flex gap-3"><AlertTriangle className="mt-1 h-5 w-5 shrink-0" /><div><p>This practice may not be the right fit for urgent or emergency care, one-time medication requests, or treatment focused only on controlled substances without a broader psychiatric evaluation.</p><p className="mt-3 font-semibold">If you are experiencing a psychiatric emergency, call 911, go to the nearest emergency room, or call/text 988 for the Suicide & Crisis Lifeline.</p></div></div></div><div className="mt-8 text-center"><Button href="/new-patients">Schedule a New Patient Evaluation</Button></div></Section>
  </>;
}
