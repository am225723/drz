'use client';
import { ArrowRight, Brain, CheckCircle2, MessageCircle, Pill, ShieldCheck } from 'lucide-react';
import { ASSETS, CONDITIONS, METHODS, PRACTICE, SERVICES } from '../lib/content';
import { DEFAULT_SERVICE_TONE, SERVICE_TONES, STOCK_IMAGES } from '../lib/visuals';
import { BookingExperience, Button, Card, CheckList, Section } from '../components/ui';
import { PhotoPanel } from '../components/visual';

const fitItems = [
  'A psychiatrist who can provide both psychotherapy and medication management',
  'A deeper understanding of symptoms, patterns, relationships, and emotional history',
  'Treatment that considers sleep, stress, lifestyle, medical context, and personal meaning',
  'Care for anxiety, depression, trauma, ADHD/focus concerns, grief, or life transitions',
  'A collaborative, reflective approach to treatment planning'
];

const credentialItems = [
  'Board-certified psychiatrist',
  'Psychiatry residency: UConn School of Medicine',
  'Medical degree: St. George’s University School of Medicine',
  'Undergraduate education: Amherst College'
];

const emphasisCards = [
  { title: 'Psychotherapy', href: '/services/psychotherapy', icon: MessageCircle, image: STOCK_IMAGES.journalDesk, text: 'A reflective space to understand patterns, emotions, relationships, history, and the meaning beneath symptoms.', accent: 'from-[#edf8f1] to-white border-[#9fcf9a]' },
  { title: 'Medication Management', href: '/services/medication-management', icon: Pill, image: STOCK_IMAGES.consultationRoom, text: 'Thoughtful prescribing, medication review, monitoring, and collaborative decision-making within a whole-person care plan.', accent: 'from-[#f3f8f8] to-white border-[#2f8c85]' }
];

export default function HomePage() {
  return <>
    <section className="relative isolate overflow-hidden bg-[#fbfaf7] py-16 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,#edf8f1,transparent_32%),radial-gradient(circle_at_86%_18%,rgba(232,216,184,.42),transparent_26%),linear-gradient(180deg,#fbfaf7,#ffffff)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.36fr_.64fr] lg:gap-16">
          <div className="flex justify-center lg:justify-end">
            <img src={ASSETS.logo} alt="Integrative Psychiatry logo" className="h-44 w-44 object-contain sm:h-52 sm:w-52 lg:h-64 lg:w-64" />
          </div>
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">Holistic psychiatry rooted in you.</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-700 lg:mx-0">Personalized mental health care with depth and discretion. {PRACTICE.doctor} provides in-depth assessment, psychotherapy, thoughtful medication management, and collaborative treatment planning.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"><Button href="/new-patients" variant="primary">Book Evaluation <ArrowRight className="ml-2 h-4 w-4" /></Button><Button href="/services" variant="outline">Explore Services</Button></div>
          </div>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl items-center gap-8 lg:grid-cols-[.82fr_1.18fr]">
          <div className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/70"><img src={ASSETS.headshot} alt="Dr. Douglas Zelisko portrait" className="mx-auto max-h-[410px] rounded-[1.75rem] object-cover" /></div>
          <Card className="overflow-hidden shadow-xl"><div className="grid gap-0 md:grid-cols-[.48fr_.52fr]"><div className="bg-[#173f42] p-8 text-white"><p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d6e7c7]">Meet Douglas Zelisko, MD</p><h2 className="mt-3 text-3xl font-semibold text-white">Board-certified integrative psychiatric care.</h2><p className="mt-4 leading-7 text-slate-100">Dr. Douglas Zelisko is a board-certified psychiatrist offering integrative psychiatric care for adults. His work combines psychiatric evaluation, psychotherapy, medication management, and whole-person treatment planning.</p><Button href="/about" variant="light" className="mt-6">Learn More About Dr. Zelisko</Button></div><div className="p-8"><h3 className="text-xl font-semibold text-slate-950">Credentials</h3><div className="mt-4 space-y-3 text-slate-700">{credentialItems.map((item) => <p key={item} className="flex gap-2"><ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-[#2f8c85]" />{item}</p>)}</div></div></div></Card>
        </div>
      </div>
    </section>

    <Section className="bg-white"><div className="mx-auto mb-12 max-w-3xl text-center"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8c85]">Featured services</p><h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Therapy and medication management, thoughtfully integrated</h2><p className="mt-4 text-lg leading-8 text-slate-700">Reflective therapeutic work and careful psychiatric medication decisions can be held together in one clinical relationship.</p></div><div className="grid gap-6 md:grid-cols-2">{emphasisCards.map((card) => { const Icon = card.icon; return <Card key={card.title} className={`overflow-hidden border bg-gradient-to-br ${card.accent} transition hover:-translate-y-1 hover:shadow-xl`}><div className="relative h-52 overflow-hidden bg-[#173f42]"><div className="absolute inset-0 bg-cover bg-center opacity-62" style={{ backgroundImage: `url(${card.image})` }} /><div className="absolute inset-0 bg-gradient-to-br from-[#173f42]/88 via-[#173f42]/48 to-transparent" /><div className="relative z-10 flex h-full items-end p-7"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#173f42] shadow-lg"><Icon className="h-7 w-7" /></div></div></div><div className="p-8"><h2 className="text-3xl font-semibold text-slate-950">{card.title}</h2><p className="mt-4 text-lg leading-8 text-slate-700">{card.text}</p><Button href={card.href} variant="outline" className="mt-6">Learn more <ArrowRight className="ml-2 h-4 w-4" /></Button></div></Card>; })}</div></Section>

    <Section className="bg-white"><div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]"><PhotoPanel image={STOCK_IMAGES.journalDesk} eyebrow="Whole-person care" title="Psychiatric care with time to understand the full picture." text="Care considers symptoms, history, relationships, lifestyle, medical context, and goals for treatment." /><div><p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8c85]">The practice</p><h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Thoughtful psychiatric care that goes beyond a brief medication visit.</h2><p className="mt-6 text-lg leading-8 text-slate-700">Care focuses on adults navigating anxiety, depression, grief, relationship issues, trauma, focus concerns, physical health challenges, and complex life transitions. Dr. Z primarily practices psychodynamic psychotherapy while drawing from other modalities when they better fit the person and the moment.</p><div className="mt-8"><CheckList items={METHODS.slice(0, 6)} /></div></div></div></Section>

    <Section id="practice-fit" className="bg-[#fbfaf7]"><div className="mx-auto mb-12 max-w-3xl text-center"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8c85]">Fit</p><h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Is this practice right for me?</h2><p className="mt-4 text-lg leading-8 text-slate-700">This practice may be a good fit if you are looking for thoughtful, individualized psychiatric care with therapy and medication management integrated thoughtfully.</p></div><div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">{fitItems.map((item) => <Card key={item} className="transition hover:-translate-y-1 hover:shadow-xl"><div className="flex gap-3 p-5"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#2f8c85]" /><p className="leading-7 text-slate-700">{item}</p></div></Card>)}</div><div className="mx-auto mt-8 max-w-4xl rounded-[1.5rem] border border-[#e8d8b8] bg-[#fff8ec] p-6 text-[#5a3b1e]"><p>This practice may not be the right fit for urgent or emergency care, one-time medication requests, or treatment focused only on controlled substances without a broader psychiatric evaluation.</p><p className="mt-3 font-semibold">If you are experiencing a psychiatric emergency, call 911, go to the nearest emergency room, or call/text 988 for the Suicide & Crisis Lifeline.</p></div><div className="mt-8 text-center"><Button href="/new-patients">Schedule a New Patient Evaluation</Button></div></Section>

    <Section className="bg-[#173f42] text-white"><div className="mx-auto mb-12 max-w-3xl text-center"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#9fcf9a]">Appointments</p><h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Schedule a psychiatric evaluation securely.</h2><p className="mt-4 text-lg leading-8 text-slate-100">Choose an appointment type, then complete scheduling through the secure IntakeQ booking system.</p></div><BookingExperience /></Section>

    <Section className="bg-white"><div className="mx-auto mb-12 max-w-3xl text-center"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8c85]">Services</p><h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Comprehensive care solutions.</h2><p className="mt-4 text-lg leading-8 text-slate-700">Psychotherapy and medication management are emphasized, with evaluation and integrative planning supporting the full clinical picture.</p></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{SERVICES.map((s) => { const Icon = s.icon; return <Card key={s.title} className="transition hover:-translate-y-1 hover:shadow-xl"><div className="p-7"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${SERVICE_TONES[s.title] || DEFAULT_SERVICE_TONE}`}><Icon className="h-6 w-6" /></div><h3 className="mt-5 text-xl font-semibold text-slate-950">{s.title}</h3><p className="mt-3 leading-7 text-slate-600">{s.text}</p></div></Card>; })}</div><div className="mt-12 rounded-[2rem] bg-[#173f42] p-8 text-white shadow-xl"><div className="flex items-center gap-3"><Brain className="h-7 w-7 text-[#9fcf9a]" /><h3 className="text-2xl font-semibold text-white">Common areas of care</h3></div><div className="mt-5 flex flex-wrap gap-2">{CONDITIONS.map((c) => <span key={c} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white">{c}</span>)}</div></div></Section>
  </>;
}
