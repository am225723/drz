import { Brain, CheckCircle2, HeartHandshake, MessageCircle, Search, ShieldCheck } from 'lucide-react';
import { STOCK_IMAGES } from '../../../lib/visuals';
import { Button, Card, PageHero, Section, SectionHeading } from '../../../components/ui';
import { PhotoPanel } from '../../../components/visual';

export const metadata = {
  title: 'Psychotherapy | Integrative Psychiatry',
  description: 'Psychotherapy with Douglas Zelisko, MD as part of integrative psychiatric care in West Hartford, Connecticut.'
};

const therapyMayHelp = [
  'Anxiety, depression, mood concerns, grief, or life transitions',
  'Trauma-related symptoms, emotional overwhelm, or disconnection',
  'Relationship patterns, attachment concerns, or interpersonal conflict',
  'Self-esteem, identity, meaning, burnout, or difficulty feeling “stuck”',
  'A desire to understand symptoms more deeply rather than only manage them'
];

const approach = [
  ['Psychodynamic psychotherapy', 'A reflective approach that explores patterns, emotions, relationships, early experiences, defenses, conflicts, and the meanings behind symptoms.'],
  ['Collaborative treatment planning', 'Therapy goals are shaped around your concerns, pace, values, and what feels most important to understand or change.'],
  ['Integration with psychiatry', 'Because Dr. Zelisko is a psychiatrist, psychotherapy can be integrated with diagnostic assessment, medication management, and broader whole-person treatment planning when appropriate.'],
  ['Attention to the whole person', 'Sessions may consider sleep, stress, lifestyle, medical context, relationships, identity, grief, trauma history, and personal meaning.']
];

const expect = [
  'A thoughtful, private space to speak openly',
  'Careful attention to patterns that repeat over time',
  'Exploration of emotions, relationships, and internal conflict',
  'A collaborative pace that respects readiness and safety',
  'Connection between insight, daily life, and practical change'
];

export default function PsychotherapyPage() {
  return <>
    <PageHero eyebrow="Psychotherapy" title="A deeper space to understand yourself and your symptoms." subtitle="Psychotherapy can help clarify patterns, emotions, relationships, and life experiences that shape mental health and daily functioning." />
    <Section className="bg-white"><div className="grid gap-10 lg:grid-cols-[1fr_.85fr]"><div className="space-y-6 text-lg leading-8 text-slate-700"><p>Psychotherapy at this practice is grounded in curiosity, collaboration, and respect for the complexity of each person’s life. Symptoms are important, but they often have a story, a context, and a meaning.</p><p>Dr. Zelisko primarily practices psychodynamic psychotherapy while drawing from other approaches when they fit the person and the clinical moment. The work may focus on emotional patterns, relationships, grief, trauma, identity, self-understanding, and choices that support a more fulfilling life.</p><div className="flex flex-col gap-3 pt-2 sm:flex-row"><Button href="/new-patients" variant="dark">Schedule a New Patient Evaluation</Button><Button href="/services/medication-management" variant="outline">Medication Management</Button></div></div><PhotoPanel image={STOCK_IMAGES.therapyInterior} eyebrow="Therapeutic work" title="A private space for insight, reflection, and change." text="Psychotherapy can help connect symptoms with patterns, emotions, relationships, history, and the choices that shape daily life." /></div></Section>
    <Section className="bg-[#fbfaf7]"><SectionHeading eyebrow="What therapy can offer" title="A careful therapeutic frame" subtitle="Psychotherapy can support symptom relief, deeper self-understanding, and more flexible ways of relating to yourself and others." /><div className="grid gap-4 md:grid-cols-5">{expect.map((item) => <Card key={item}><div className="p-5"><CheckCircle2 className="h-5 w-5 text-[#2f8c85]" /><p className="mt-3 font-medium leading-7 text-slate-800">{item}</p></div></Card>)}</div></Section>
    <Section className="bg-white"><SectionHeading eyebrow="Who it may help" title="Psychotherapy may be helpful for" subtitle="Therapy can support people seeking symptom relief, self-understanding, relational change, and greater emotional flexibility." /><div className="grid gap-5 md:grid-cols-2">{therapyMayHelp.map((item) => <Card key={item}><div className="flex gap-4 p-6"><HeartHandshake className="mt-1 h-5 w-5 shrink-0 text-[#2f8c85]" /><p className="leading-7 text-slate-700">{item}</p></div></Card>)}</div></Section>
    <Section className="bg-[#fbfaf7]"><SectionHeading eyebrow="Approach" title="How psychotherapy is approached" subtitle="Treatment is individualized and may evolve as understanding deepens." /><div className="mx-auto max-w-5xl space-y-5">{approach.map(([title, text], index) => <Card key={title} className="overflow-hidden"><div className="grid md:grid-cols-[.18fr_1fr]"><div className="flex items-center justify-center bg-[#173f42] p-6 text-white"><span className="text-3xl font-semibold">{index + 1}</span></div><div className="p-6"><h3 className="text-2xl font-semibold text-slate-950">{title}</h3><p className="mt-3 text-lg leading-8 text-slate-700">{text}</p></div></div></Card>)}</div></Section>
    <Section className="bg-white"><div className="grid gap-8 lg:grid-cols-3"><Card><div className="p-8"><Brain className="h-8 w-8 text-[#2f8c85]" /><h2 className="mt-4 text-2xl font-semibold text-slate-950">Insight</h2><p className="mt-3 leading-7 text-slate-700">Therapy can help identify patterns that may be hard to see from inside them.</p></div></Card><Card><div className="p-8"><Search className="h-8 w-8 text-[#2f8c85]" /><h2 className="mt-4 text-2xl font-semibold text-slate-950">Meaning</h2><p className="mt-3 leading-7 text-slate-700">Symptoms can be explored in the context of your relationships, history, values, and current life.</p></div></Card><Card><div className="p-8"><ShieldCheck className="h-8 w-8 text-[#2f8c85]" /><h2 className="mt-4 text-2xl font-semibold text-slate-950">Change</h2><p className="mt-3 leading-7 text-slate-700">The goal is not only understanding, but greater freedom, flexibility, and a more grounded way of living.</p></div></Card></div></Section>
    <Section className="bg-[#173f42] text-white"><div className="mx-auto max-w-4xl text-center"><MessageCircle className="mx-auto h-10 w-10 text-[#9fcf9a]" /><h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Interested in psychotherapy as part of psychiatric care?</h2><p className="mt-6 text-lg leading-8 text-slate-100">The first step is a comprehensive evaluation to understand your concerns, goals, and whether this practice is a good fit for your needs.</p><Button href="/new-patients" variant="light" className="mt-8">Schedule a New Patient Evaluation</Button></div></Section>
  </>;
}
