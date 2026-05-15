import { Stethoscope } from 'lucide-react';
import { METHODS, SERVICES } from '../../lib/content';
import { Card, CheckList, PageHero, Section, SectionHeading } from '../../components/ui';

export const metadata = { title: 'Services | Integrative Psychiatry' };
export default function ServicesPage() {
  return <><PageHero icon={Stethoscope} eyebrow="Services" title="Comprehensive care solutions." subtitle="Personalized care for a broad spectrum of concerns, delivered through an integrative, whole-person lens." /><Section><SectionHeading eyebrow="Services" title="Care options" subtitle="Psychotherapy, medication management, evaluations, lifestyle recommendations, and other integrative options." /><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{SERVICES.map((s) => { const Icon = s.icon; return <Card key={s.title}><div className="p-7"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf8f1] text-[#173f42]"><Icon className="h-6 w-6" /></div><h3 className="mt-5 text-xl font-semibold text-slate-950">{s.title}</h3><p className="mt-3 leading-7 text-slate-600">{s.text}</p></div></Card>; })}</div></Section><Section className="bg-slate-50"><SectionHeading eyebrow="Methods" title="A wider lens for mental health" /><CheckList items={METHODS} /></Section></>;
}
