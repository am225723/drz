'use client';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Stethoscope } from 'lucide-react';
import { METHODS, SERVICES } from '../../lib/content';
import { DEFAULT_SERVICE_TONE, SERVICE_TONES, STOCK_IMAGES } from '../../lib/visuals';
import { Button, Card, CheckList, PageHero, Section, SectionHeading } from '../../components/ui';
import { PhotoPanel } from '../../components/visual';

const featuredServices = [
  {
    href: '/services/psychotherapy',
    icon: MessageCircle,
    title: 'Psychotherapy',
    text: 'A deeper space to understand patterns, emotions, relationships, history, and the meaning beneath symptoms.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85',
    tone: 'from-[#edf8f1] to-white border-[#9fcf9a]'
  },
  {
    href: '/services/medication-management',
    icon: Stethoscope,
    title: 'Medication Management',
    text: 'Thoughtful prescribing, medication review, monitoring, and collaborative decision-making within a whole-person care plan.',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1600&q=85',
    tone: 'from-[#f3f8f8] to-white border-[#2f8c85]'
  }
];

export default function ServicesPage() {
  return <>
    <PageHero eyebrow="Services" title="Comprehensive care solutions." subtitle="Personalized care for a broad spectrum of concerns, delivered through an integrative, whole-person lens." />
    <Section className="bg-white"><SectionHeading eyebrow="Featured services" title="Therapy and medication management, thoughtfully integrated" subtitle="Reflective therapeutic work and careful psychiatric medication decisions can be held together in one clinical relationship." /><div className="grid gap-6 md:grid-cols-2">{featuredServices.map((service) => { const Icon = service.icon; return <Link key={service.href} href={service.href} className="group block"><Card className={`h-full overflow-hidden border bg-gradient-to-br ${service.tone} transition hover:-translate-y-1 hover:shadow-xl`}><div className="relative h-60 overflow-hidden bg-slate-950"><img src={service.image} alt={`${service.title} visual`} loading="eager" decoding="async" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/78 via-black/42 to-transparent" /><div className="relative z-10 flex h-full items-end p-5"><div className="flex items-center gap-4 rounded-[1.5rem] border border-white/25 bg-black/72 p-4 pr-5 text-white shadow-2xl ring-1 ring-black/35 backdrop-blur-[1px]"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#173f42] shadow-lg"><Icon className="h-7 w-7" /></div><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-white">Featured service</p><h3 className="mt-1 text-xl font-semibold text-white drop-shadow-lg">{service.title}</h3></div></div></div></div><div className="p-8"><h2 className="text-2xl font-semibold text-slate-950">{service.title}</h2><p className="mt-3 text-lg leading-8 text-slate-700">{service.text}</p><div className="mt-6 inline-flex items-center text-sm font-semibold text-[#173f42]">Read more <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" /></div></div></Card></Link>; })}</div></Section>
    <Section className="bg-[#fbfaf7]"><div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]"><PhotoPanel image={STOCK_IMAGES.therapyInterior} eyebrow="Coordinated care" title="Psychiatric treatment that connects insight, diagnosis, and medication decisions." text="Care is designed to support a clearer understanding of your symptoms and a treatment plan that fits your life." /><div><SectionHeading eyebrow="Services" title="Care options" subtitle="Psychotherapy, medication management, evaluations, lifestyle recommendations, and other integrative options." /><div className="grid gap-5 md:grid-cols-2">{SERVICES.map((s) => { const Icon = s.icon; return <Card key={s.title} className="transition hover:-translate-y-1 hover:shadow-xl"><div className="p-7"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${SERVICE_TONES[s.title] || DEFAULT_SERVICE_TONE}`}><Icon className="h-6 w-6" /></div><h3 className="mt-5 text-xl font-semibold text-slate-950">{s.title}</h3><p className="mt-3 leading-7 text-slate-600">{s.text}</p></div></Card>; })}</div><div className="mt-10"><Button href="/new-patients">Schedule a New Patient Evaluation</Button></div></div></div></Section>
    <Section className="bg-white"><SectionHeading eyebrow="Methods" title="A wider lens for mental health" /><CheckList items={METHODS} /></Section>
  </>;
}
