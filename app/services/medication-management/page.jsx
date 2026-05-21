import { AlertTriangle, CheckCircle2, ClipboardCheck, HeartPulse, Pill, ShieldCheck } from 'lucide-react';
import { STOCK_IMAGES } from '../../../lib/visuals';
import { Button, Card, PageHero, Section, SectionHeading } from '../../../components/ui';
import { PhotoPanel } from '../../../components/visual';

export const metadata = {
  title: 'Medication Management | Integrative Psychiatry',
  description: 'Thoughtful psychiatric medication management with Douglas Zelisko, MD in West Hartford, Connecticut.'
};

const appropriateFor = [
  'Depression, anxiety, mood symptoms, trauma-related symptoms, or sleep concerns',
  'ADHD and focus-related concerns after careful diagnostic evaluation',
  'Medication questions, side effects, or uncertainty about your current regimen',
  'A desire to combine medication decisions with psychotherapy and whole-person treatment planning'
];

const process = [
  ['Comprehensive evaluation', 'Medication decisions begin with a careful psychiatric evaluation that reviews symptoms, history, diagnosis, medical context, current medications, prior medication trials, substance use, sleep, stress, and treatment goals.'],
  ['Collaborative planning', 'Recommendations are discussed clearly, including potential benefits, risks, side effects, alternatives, and what to monitor over time.'],
  ['Ongoing monitoring', 'Medication management is not just prescribing. Follow-up visits help assess response, tolerability, functioning, safety, and whether the plan still fits your needs.'],
  ['Integration with therapy and lifestyle', 'When appropriate, medication is integrated with psychotherapy, sleep support, stress reduction, lifestyle changes, and broader psychiatric care.']
];

const principles = [
  'Use medication thoughtfully, not automatically',
  'Review benefits, risks, alternatives, and side effects',
  'Consider the whole person, not just the symptom checklist',
  'Avoid one-size-fits-all prescribing',
  'Reassess the plan as your life and symptoms change'
];

export default function MedicationManagementPage() {
  return <>
    <PageHero eyebrow="Medication Management" title="Thoughtful prescribing within a broader care plan." subtitle="Medication may be helpful for many people, but it works best when decisions are individualized, carefully monitored, and connected to the larger picture of your mental health." />
    <Section className="bg-white"><div className="grid gap-10 lg:grid-cols-[1fr_.85fr]"><div className="space-y-6 text-lg leading-8 text-slate-700"><p>Medication management at this practice is collaborative and careful. Dr. Zelisko considers your symptoms, diagnosis, treatment history, medical context, goals, values, and concerns before making recommendations.</p><p>The goal is not simply to prescribe medication, but to understand whether medication is appropriate, which options make sense, how to monitor response, and how medication fits into the rest of your care.</p><div className="flex flex-col gap-3 pt-2 sm:flex-row"><Button href="/new-patients" variant="dark">Schedule a New Patient Evaluation</Button><Button href="/contact" variant="outline">Ask a Non-Urgent Question</Button></div></div><PhotoPanel image={STOCK_IMAGES.abstractLight} eyebrow="Medication decisions" title="Medication decisions made with care and clarity." text="Treatment planning includes your symptoms, history, goals, preferences, medication response, and safety considerations." /></div></Section>
    <Section className="bg-[#fbfaf7]"><SectionHeading eyebrow="Medication management may include" title="A careful prescribing philosophy" subtitle="Medication can be one part of a thoughtful psychiatric treatment plan when clinically appropriate." /><div className="grid gap-4 md:grid-cols-5">{principles.map((item) => <Card key={item}><div className="p-5"><CheckCircle2 className="h-5 w-5 text-[#2f8c85]" /><p className="mt-3 font-medium leading-7 text-slate-800">{item}</p></div></Card>)}</div></Section>
    <Section className="bg-white"><SectionHeading eyebrow="Who it may help" title="Who medication management may be for" subtitle="Medication decisions are strongest when they are paired with diagnostic clarity and whole-person planning." /><div className="grid gap-5 md:grid-cols-2">{appropriateFor.map((item) => <Card key={item}><div className="flex gap-4 p-6"><HeartPulse className="mt-1 h-5 w-5 shrink-0 text-[#2f8c85]" /><p className="leading-7 text-slate-700">{item}</p></div></Card>)}</div></Section>
    <Section className="bg-[#fbfaf7]"><SectionHeading eyebrow="Process" title="What to expect" subtitle="A clear process helps make medication decisions safer, more personalized, and easier to understand." /><div className="mx-auto max-w-5xl space-y-5">{process.map(([title, text], index) => <Card key={title} className="overflow-hidden"><div className="grid md:grid-cols-[.18fr_1fr]"><div className="flex items-center justify-center bg-[#173f42] p-6 text-white"><span className="text-3xl font-semibold">{index + 1}</span></div><div className="p-6"><h3 className="text-2xl font-semibold text-slate-950">{title}</h3><p className="mt-3 text-lg leading-8 text-slate-700">{text}</p></div></div></Card>)}</div></Section>
    <Section className="bg-white"><div className="grid gap-8 lg:grid-cols-2"><Card><div className="p-8"><ClipboardCheck className="h-8 w-8 text-[#2f8c85]" /><h2 className="mt-4 text-3xl font-semibold text-slate-950">About controlled substances</h2><p className="mt-4 text-lg leading-8 text-slate-700">Requests for a specific medication do not guarantee that it will be prescribed. Stimulants, benzodiazepines, and other controlled medications are considered only after a comprehensive evaluation and when clinically appropriate.</p></div></Card><Card className="border-[#e8d8b8] bg-[#fff8ec]"><div className="p-8"><AlertTriangle className="h-8 w-8 text-[#8a5a2b]" /><h2 className="mt-4 text-3xl font-semibold text-[#5a3b1e]">Medication safety</h2><p className="mt-4 text-lg leading-8 text-[#5a3b1e]">Medication changes should be made under clinical supervision. Do not stop, start, or change psychiatric medications based only on website information.</p></div></Card></div></Section>
    <Section className="bg-[#173f42] text-white"><div className="mx-auto max-w-4xl text-center"><ShieldCheck className="mx-auto h-10 w-10 text-[#9fcf9a]" /><h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Considering psychiatric medication or a medication review?</h2><p className="mt-6 text-lg leading-8 text-slate-100">The first step is a comprehensive psychiatric evaluation so recommendations can be made safely and thoughtfully.</p><Button href="/new-patients" variant="light" className="mt-8">Schedule a New Patient Evaluation</Button></div></Section>
  </>;
}
