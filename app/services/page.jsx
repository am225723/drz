'use client';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Stethoscope } from 'lucide-react';
import { METHODS, SERVICES } from '../../lib/content';
import { Button, Card, CheckList, PageHero, Section, SectionHeading } from '../../components/ui';

const featuredServices = [
  {
    href: '/services/psychotherapy',
    icon: MessageCircle,
    title: 'Psychotherapy',
    text: 'A deeper space to understand patterns, emotions, relationships, history, and the meaning beneath symptoms.'
  },
  {
    href: '/services/medication-management',
    icon: Stethoscope,
    title: 'Medication Management',
    text: 'Thoughtful prescribing, medication review, monitoring, and collaborative decision-making within a whole-person care plan.'
  }
];

export default function ServicesPage() {
  return <><PageHero eyebrow="Services" title="Comprehensive care solutions." subtitle="Personalized care for a broad spectrum of concerns, delivered through an integrative, whole-person lens." /><Section><SectionHeading eyebrow="Featured services" title="Explore care in more detail" subtitle="Learn more about psychotherapy and medication management at this practice." /><div className="grid gap-6 md:grid-cols-2">{featuredServices.map((service) => { const Icon = service.icon; return <Link key={service.href} href={service.href} className="group block"><Card className="h-full transition hover:-translate-y-1 hover:shadow-xl"><div className="p-8"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf8f1] text-[#173f42]"><Icon className="h-7 w-7" /></div><h2 className="mt-6 text-2xl font-semibold text-slate-950">{service.title}</h2><p className="mt-3 text-lg leading-8 text-slate-700">{service.text}</p><div className="mt-6 inline-flex items-center text-sm font-semibold text-[#173f42]">Read more <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" /></div></div></Card></Link>; })}</div></Section><Section className="bg-slate-50"><SectionHeading eyebrow="Services" title="Care options" subtitle="Psychotherapy, medication management, evaluations, lifestyle recommendations, and other integrative options." /><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{SERVICES.map((s) => { const Icon = s.icon; return <Card key={s.title}><div className="p-7"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf8f1] text-[#173f42]"><Icon className="h-6 w-6" /></div><h3 className="mt-5 text-xl font-semibold text-slate-950">{s.title}</h3><p className="mt-3 leading-7 text-slate-600">{s.text}</p></div></Card>; })}</div><div className="mt-10 text-center"><Button href="/new-patients">Schedule a New Patient Evaluation</Button></div></Section><Section><SectionHeading eyebrow="Methods" title="A wider lens for mental health" /><CheckList items={METHODS} /></Section></>;
}
