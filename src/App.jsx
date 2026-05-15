import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  ExternalLink,
  FileText,
  HeartPulse,
  HelpCircle,
  Home,
  Leaf,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Monitor,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  Users,
  X,
} from 'lucide-react';

const PRACTICE = {
  name: 'Integrative Psychiatry',
  doctor: 'Douglas Zelisko, MD',
  shortDoctor: 'Dr. Z',
  address: '45 South Main Street, Suite 111, West Hartford, CT 06107',
  phone: '860-615-3629',
  secondaryPhone: '959-236-5722',
  email: 'info@drzelisko.com',
  location: 'West Hartford, Connecticut',
};

const LINKS = {
  portal: 'https://drz.intakeq.com/portal',
  evaluationVirtual: 'https://link.drz.services/veval',
  evaluationOffice: 'https://link.drz.services/ieval',
  followUpOffice: 'https://link.drz.services/o',
  followUpVirtual: 'https://link.drz.services/v',
};

const PAGES = [
  { id: 'home', path: '/', label: 'Home', icon: Home },
  { id: 'about', path: '/about', label: 'About', icon: UserRound },
  { id: 'services', path: '/services', label: 'Services', icon: Stethoscope },
  { id: 'ketamine', path: '/ketamine-therapy', label: 'Ketamine Therapy', icon: Sparkles },
  { id: 'fees', path: '/fees-insurance', label: 'Fees & Insurance', icon: CreditCard },
  { id: 'new-patients', path: '/new-patients', label: 'New Patients', icon: Calendar },
  { id: 'current-patients', path: '/current-patients', label: 'Current Patients', icon: Users },
  { id: 'resources', path: '/resources', label: 'Resources', icon: BookOpen },
  { id: 'faq', path: '/faq', label: 'FAQ', icon: HelpCircle },
  { id: 'contact', path: '/contact', label: 'Contact', icon: Mail },
];

const SERVICES = [
  {
    slug: 'evaluation',
    icon: FileText,
    title: 'Comprehensive Psychiatric Evaluation',
    summary: 'An in-depth assessment of symptoms, history, medical factors, relationships, sleep, stress, medications, and goals.',
    detail:
      'A psychiatric evaluation is the foundation for thoughtful care. It may explore current symptoms, past treatment, medical history, family history, sleep, substance use, medications, supplements, trauma, relationships, work, identity, and personal goals. The result is a clearer clinical formulation and a treatment plan you can understand.',
    tags: ['Diagnostic clarity', 'Second opinions', 'Treatment planning', 'Complex symptoms'],
  },
  {
    slug: 'medication',
    icon: Stethoscope,
    title: 'Medication Management',
    summary: 'Thoughtful prescribing with ongoing review of benefits, side effects, alternatives, and larger treatment goals.',
    detail:
      'Medication can be helpful, but it should be used carefully and reviewed over time. Appointments focus on whether medication is helping, whether side effects are present, whether alternatives should be considered, and how medication fits alongside psychotherapy, lifestyle changes, and other supports.',
    tags: ['Depression', 'Anxiety', 'Mood symptoms', 'ADHD/focus concerns'],
  },
  {
    slug: 'psychotherapy',
    icon: MessageCircle,
    title: 'Psychotherapy',
    summary: 'Psychodynamic and integrative therapy for self-understanding, emotional flexibility, and meaningful change.',
    detail:
      'Psychotherapy may help illuminate emotional patterns, relationship dynamics, protective strategies, identity questions, trauma, grief, and the deeper meanings behind symptoms. The work is collaborative, reflective, and oriented toward greater freedom and self-understanding.',
    tags: ['Relationships', 'Trauma', 'Grief', 'Life transitions'],
  },
  {
    slug: 'integrative',
    icon: Leaf,
    title: 'Integrative Psychiatry',
    summary: 'Whole-person care that considers sleep, nutrition, movement, supplements, medical context, and lifestyle.',
    detail:
      'An integrative approach considers the full ecosystem of mental health. This may include sleep, nutrition, movement, medical conditions, medications, supplements, stress physiology, relationships, and environment. Recommendations are individualized and used alongside appropriate conventional psychiatric care.',
    tags: ['Whole-person care', 'Lifestyle contributors', 'Supplement review', 'Mind-body factors'],
  },
  {
    slug: 'ketamine',
    icon: Sparkles,
    title: 'Ketamine-Assisted Psychotherapy',
    summary: 'For carefully selected patients after evaluation, preparation, informed consent, and safety review.',
    detail:
      'Ketamine-assisted psychotherapy may be considered for carefully selected adults after a psychiatric evaluation, medical screening, discussion of risks and alternatives, preparation, and informed consent. It is not a universal treatment and is not appropriate for every patient.',
    tags: ['Screening', 'Preparation', 'Monitoring', 'Integration'],
  },
  {
    slug: 'second-opinion',
    icon: Search,
    title: 'Diagnostic Clarity & Second Opinions',
    summary: 'Consultation for adults who feel stuck, misdiagnosed, overmedicated, or unsure about their current plan.',
    detail:
      'A second-opinion consultation can help clarify diagnosis, review previous treatment, identify overlooked contributors, and create a more coherent path forward. This can be especially useful when symptoms overlap or treatment has felt fragmented.',
    tags: ['Medication review', 'Complex histories', 'Unclear diagnosis', 'Fresh perspective'],
  },
];

const CARE_FOR = [
  'Anxiety, panic, worry, and chronic stress',
  'Depression, grief, low motivation, or emotional numbness',
  'Adult ADHD, focus concerns, and executive functioning challenges',
  'Trauma, relationship patterns, identity questions, and life transitions',
  'Mood changes, irritability, sleep disruption, or diagnostic uncertainty',
  'People seeking a more in-depth alternative to brief medication visits',
];

const PROCESS = [
  { title: 'Choose the right appointment', text: 'New patients can schedule a psychiatric evaluation intake. Current patients can use follow-up booking or the portal.' },
  { title: 'Complete intake forms', text: 'PracticeQ / IntakeQ helps collect required information securely before the appointment.' },
  { title: 'Meet with Dr. Z', text: 'Your appointment explores symptoms, history, medical context, lifestyle, relationships, and goals.' },
  { title: 'Build a personalized plan', text: 'Care may include psychotherapy, medication management, lifestyle recommendations, referrals, or other evidence-informed options.' },
];

const FAQS = [
  { q: 'How do I book a new patient appointment?', a: 'Use the New Patients page and choose either a virtual or in-office Psychiatric Evaluation Intake Appointment. Booking is handled through the practice’s PracticeQ / IntakeQ scheduling links.' },
  { q: 'How do current patients schedule follow-ups?', a: 'Current patients can choose either the in-office or virtual follow-up booking link. The patient portal is also available for established-patient access.' },
  { q: 'Where is the patient portal?', a: 'The patient portal is hosted through PracticeQ / IntakeQ at drz.intakeq.com/portal. Use it for established patient access, forms, secure messages, and practice workflows as directed by the office.' },
  { q: 'Do you provide therapy, medication management, or both?', a: 'Care may include psychiatric evaluation, medication management, psychotherapy, or a combination of these. The right approach depends on your needs, goals, clinical history, and preferences.' },
  { q: 'Do you take insurance?', a: 'The private practice may be out-of-network and may provide superbills when appropriate. Insurance-based appointments may also be available through Headway for eligible plans. Please confirm current insurance options before scheduling.' },
  { q: 'Do you offer telehealth?', a: 'Virtual appointments may be available for eligible patients located in Connecticut. Some services may require in-person visits or additional safety considerations.' },
  { q: 'Is ketamine-assisted psychotherapy right for everyone?', a: 'No. Ketamine-assisted psychotherapy requires careful psychiatric evaluation, medical screening, informed consent, preparation, monitoring, and integration. It may not be appropriate for some medical or psychiatric histories.' },
  { q: 'Can I use the website for emergencies or refills?', a: 'No. The website is not monitored for emergencies, urgent clinical issues, or time-sensitive medication refill requests. Current patients should use the established clinical communication pathway provided by the practice.' },
];

const ARTICLES = [
  { title: 'What Is Integrative Psychiatry?', category: 'Integrative Care', excerpt: 'How integrative psychiatry combines conventional care with attention to sleep, nutrition, lifestyle, medical context, relationships, and meaning.' },
  { title: 'What to Expect at Your First Psychiatric Evaluation', category: 'Getting Started', excerpt: 'A practical guide to what happens during an in-depth psychiatric evaluation and how to prepare for your first appointment.' },
  { title: 'Medication Management and Psychotherapy: Why They Can Work Together', category: 'Treatment Planning', excerpt: 'Medication and psychotherapy often answer different questions. This article explains how they can support each other.' },
  { title: 'Ketamine-Assisted Psychotherapy: What Patients Should Know', category: 'Ketamine Therapy', excerpt: 'A careful overview of preparation, safety screening, psychotherapy integration, and why this care is not right for everyone.' },
  { title: 'Adult ADHD and Diagnostic Clarity', category: 'Assessment', excerpt: 'Focus problems can come from ADHD, anxiety, trauma, sleep disruption, depression, substances, or medical issues.' },
  { title: 'How Sleep, Stress, and Relationships Affect Mental Health', category: 'Whole-Person Psychiatry', excerpt: 'Mental health symptoms are often shaped by the body, environment, and relationships. Context matters.' },
];

const PAGE_BY_PATH = Object.fromEntries(PAGES.map((page) => [page.path, page.id]));
const PATH_BY_PAGE = Object.fromEntries(PAGES.map((page) => [page.id, page.path]));

function getPageFromPath() {
  if (typeof window === 'undefined') return 'home';
  return PAGE_BY_PATH[window.location.pathname] || 'home';
}

function runDataChecks() {
  const ids = new Set(PAGES.map((page) => page.id));
  console.assert(ids.size === PAGES.length, 'Page IDs must be unique.');
  console.assert(ids.has('home'), 'A home page is required.');
  console.assert(SERVICES.every((service) => service.title && service.summary), 'Every service needs a title and summary.');
  console.assert(Object.values(LINKS).every((link) => link.startsWith('https://')), 'All booking and portal links should use HTTPS.');
  console.assert(FAQS.every((faq) => faq.q && faq.a), 'Every FAQ needs a question and answer.');
}
runDataChecks();

function Button({ children, onClick, href, variant = 'primary', className = '', external = false }) {
  const base = 'inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';
  const styles = {
    primary: 'bg-emerald-900 text-white hover:bg-emerald-800',
    dark: 'bg-slate-950 text-white hover:bg-slate-800',
    outline: 'border border-slate-300 bg-white text-slate-950 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 shadow-none',
    light: 'border border-white/30 bg-white text-emerald-950 hover:bg-emerald-50',
  }[variant];

  if (href) {
    return (
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className={`${base} ${styles} ${className}`}>
        {children}
      </a>
    );
  }

  return <button onClick={onClick} className={`${base} ${styles} ${className}`}>{children}</button>;
}

function Card({ children, className = '' }) {
  return <div className={`rounded-[1.75rem] border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

function ExternalButton({ href, children, variant = 'primary', className = '' }) {
  return (
    <Button href={href} external variant={variant} className={className}>
      {children}
      <ExternalLink className="ml-2 h-4 w-4" />
    </Button>
  );
}

function PageHero({ eyebrow, title, subtitle, icon: Icon }) {
  return (
    <section className="bg-[radial-gradient(circle_at_top_left,#ecfdf5,transparent_40%),linear-gradient(180deg,#ffffff,#f8fafc)] py-20">
      <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
        {Icon && <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-950 text-white"><Icon className="h-8 w-8" /></div>}
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">{eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-700">{subtitle}</p>}
      </div>
    </section>
  );
}

function Section({ children, className = '' }) {
  return <section className={`py-20 ${className}`}><div className="mx-auto max-w-7xl px-6 lg:px-8">{children}</div></section>;
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">{eyebrow}</p>}
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg leading-8 text-slate-700">{subtitle}</p>}
    </div>
  );
}

function BookingCard({ title, subtitle, href, icon: Icon, badge }) {
  return (
    <Card className="group overflow-hidden transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200">
      <div className="h-2 bg-gradient-to-r from-emerald-900 via-slate-800 to-emerald-600" />
      <div className="p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-900"><Icon className="h-7 w-7" /></div>
          {badge && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">{badge}</span>}
        </div>
        <h3 className="text-2xl font-semibold text-slate-950">{title}</h3>
        <p className="mt-3 leading-7 text-slate-600">{subtitle}</p>
        <ExternalButton href={href} variant="dark" className="mt-6 w-full">Book Securely</ExternalButton>
      </div>
    </Card>
  );
}

function EmbeddedBookingPanel({ defaultUrl = LINKS.evaluationVirtual }) {
  const [url, setUrl] = useState(defaultUrl);
  const options = [
    { label: 'Evaluation · Virtual', url: LINKS.evaluationVirtual },
    { label: 'Evaluation · In Office', url: LINKS.evaluationOffice },
    { label: 'Follow-Up · Virtual', url: LINKS.followUpVirtual },
    { label: 'Follow-Up · In Office', url: LINKS.followUpOffice },
  ];

  return (
    <Card className="overflow-hidden shadow-xl shadow-slate-200">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">Embedded scheduler</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-950">Book without leaving the website</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button key={option.url} onClick={() => setUrl(option.url)} className={`rounded-full px-3 py-2 text-sm font-medium transition ${url === option.url ? 'bg-slate-950 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <iframe title="PracticeQ booking scheduler" src={url} className="h-[720px] w-full border-0" />
      <div className="border-t border-slate-200 bg-white p-4 text-center text-sm text-slate-600">
        If the scheduler does not load, <a href={url} target="_blank" rel="noreferrer" className="font-semibold text-emerald-900 underline">open the secure booking page</a>.
      </div>
    </Card>
  );
}

function Header({ page, navigate }) {
  const [open, setOpen] = useState(false);
  const go = (id) => { setOpen(false); navigate(id); };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <button onClick={() => go('home')} className="flex items-center gap-3 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-950 text-white shadow-sm"><Brain className="h-5 w-5" /></div>
          <div><p className="text-sm font-semibold leading-none text-slate-950">{PRACTICE.name}</p><p className="mt-1 text-xs text-slate-600">{PRACTICE.doctor}</p></div>
        </button>
        <nav className="hidden items-center gap-5 lg:flex">
          {PAGES.slice(0, 7).map((item) => <button key={item.id} onClick={() => go(item.id)} className={`text-sm font-medium transition ${page === item.id ? 'text-emerald-900' : 'text-slate-700 hover:text-slate-950'}`}>{item.label}</button>)}
          <button onClick={() => go('contact')} className="text-sm font-medium text-slate-700 hover:text-slate-950">Contact</button>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Button href={LINKS.portal} external variant="ghost" className="rounded-xl"><LockKeyhole className="mr-2 h-4 w-4" /> Portal</Button>
          <Button onClick={() => go('new-patients')} className="rounded-xl">Book Now</Button>
        </div>
        <Button variant="outline" className="rounded-xl lg:hidden" onClick={() => setOpen((value) => !value)}>{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</Button>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white px-6 py-5 lg:hidden">
          <div className="grid gap-2">
            {PAGES.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => go(item.id)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium ${page === item.id ? 'bg-emerald-50 text-emerald-950' : 'text-slate-700'}`}><Icon className="h-4 w-4" /> {item.label}</button>; })}
            <ExternalButton href={LINKS.portal} variant="outline" className="mt-2 w-full">Open Patient Portal</ExternalButton>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 text-sm text-slate-600 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div>
          <p className="font-semibold text-slate-950">{PRACTICE.name} | {PRACTICE.doctor}</p>
          <p className="mt-2">{PRACTICE.address}</p>
          <p>{PRACTICE.phone} · {PRACTICE.email}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {PAGES.slice(0, 7).map((item) => <button key={item.id} onClick={() => navigate(item.id)} className="hover:text-slate-950">{item.label}</button>)}
            <a href={LINKS.portal} target="_blank" rel="noreferrer" className="hover:text-slate-950">Patient Portal</a>
          </div>
        </div>
        <div className="lg:text-right">
          <p>This website provides general information and is not medical advice.</p>
          <p className="mt-2">If you are in immediate danger, call 911. For mental health crisis support, call or text 988.</p>
          <p className="mt-4">© {new Date().getFullYear()} Integrative Psychiatry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function CTAButtons({ navigate, centered = false }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${centered ? 'justify-center' : ''}`}>
      <Button onClick={() => navigate('new-patients')} variant="dark">Book Evaluation <ArrowRight className="ml-2 h-4 w-4" /></Button>
      <Button onClick={() => navigate('current-patients')} variant="outline">Current Patient Follow-Up</Button>
      <Button href={LINKS.portal} external variant="ghost"><LockKeyhole className="mr-2 h-4 w-4" /> Portal</Button>
    </div>
  );
}

function HomePage({ navigate }) {
  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#ecfdf5,transparent_38%),linear-gradient(180deg,#ffffff,#f8fafc)] py-20 sm:py-28">
        <div className="absolute right-0 top-12 hidden h-72 w-72 rounded-full bg-emerald-100 blur-3xl lg:block" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-900 shadow-sm"><ShieldCheck className="h-4 w-4" /> Board-certified psychiatry in Connecticut</div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">Psychiatry that takes the time to understand the whole you.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">{PRACTICE.doctor} provides integrative psychiatric care, psychotherapy, and medication management for adults in Connecticut. Care is collaborative, in-depth, and tailored to your symptoms, story, values, and goals.</p>
            <div className="mt-8"><CTAButtons navigate={navigate} /></div>
            <div className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-3"><div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-800" /> {PRACTICE.location}</div><div className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-800" /> In-depth appointments</div><div className="flex items-center gap-2"><HeartPulse className="h-4 w-4 text-emerald-800" /> Whole-person care</div></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <Card className="overflow-hidden border-0 shadow-2xl shadow-slate-200"><div className="bg-slate-950 p-8 text-white"><p className="text-sm uppercase tracking-[0.22em] text-emerald-200">Secure online scheduling</p><h2 className="mt-4 text-3xl font-semibold">Book evaluations, follow-ups, and access the patient portal.</h2><p className="mt-4 text-slate-300">Scheduling and portal access are handled through PracticeQ / IntakeQ using secure external links.</p></div><div className="grid gap-3 bg-white p-4"><ExternalButton href={LINKS.evaluationVirtual} variant="dark" className="w-full">Book Virtual Evaluation</ExternalButton><ExternalButton href={LINKS.evaluationOffice} variant="outline" className="w-full">Book In-Office Evaluation</ExternalButton><ExternalButton href={LINKS.portal} className="w-full">Open Patient Portal</ExternalButton></div></Card>
          </motion.div>
        </div>
      </section>
      <WhoItsFor />
      <BookingOverview navigate={navigate} />
      <ServicePreview navigate={navigate} />
      <ProcessPreview navigate={navigate} />
    </>
  );
}

function WhoItsFor() {
  return <section className="bg-slate-950 py-20 text-white"><div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8"><div><p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-200">Who this helps</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">You may be here because treatment has only addressed part of the problem.</h2><p className="mt-6 text-lg leading-8 text-slate-300">Many people seek care after trying therapy, medication, lifestyle changes, or self-help and still feeling stuck. A more complete psychiatric evaluation can help clarify what has been missed and what might help next.</p></div><div className="grid gap-4 sm:grid-cols-2">{CARE_FOR.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-100"><div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-300/15 text-emerald-100">✓</div>{item}</div>)}</div></div></section>;
}

function BookingOverview({ navigate }) {
  return <Section className="bg-slate-50"><SectionHeading eyebrow="Appointments" title="Choose the right secure scheduling path." subtitle="New evaluations, follow-ups, and portal access are now built directly into the site experience." /><div className="grid gap-6 lg:grid-cols-3"><BookingCard title="Virtual Evaluation" subtitle="Schedule a new Psychiatric Evaluation Intake Appointment by telehealth." href={LINKS.evaluationVirtual} icon={Monitor} badge="New patient" /><BookingCard title="In-Office Evaluation" subtitle="Schedule a new Psychiatric Evaluation Intake Appointment in West Hartford." href={LINKS.evaluationOffice} icon={MapPin} badge="New patient" /><Card className="border-emerald-200 bg-emerald-950 text-white shadow-xl"><div className="p-7"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10"><LockKeyhole className="h-7 w-7" /></div><h3 className="mt-6 text-2xl font-semibold">Patient Portal</h3><p className="mt-3 leading-7 text-emerald-50">Access the PracticeQ / IntakeQ portal for established-patient workflows, forms, and secure practice communication.</p><ExternalButton href={LINKS.portal} variant="light" className="mt-6 w-full">Open Portal</ExternalButton></div></Card></div><div className="mt-8 text-center"><Button onClick={() => navigate('current-patients')} variant="outline">View Follow-Up Booking Options</Button></div></Section>;
}

function ServicePreview({ navigate }) {
  return <Section><SectionHeading eyebrow="Services" title="Psychiatric care that looks at the full picture." /><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{SERVICES.map((service) => { const Icon = service.icon; return <Card key={service.slug} className="transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200"><div className="p-7"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-900"><Icon className="h-6 w-6" /></div><h3 className="mt-5 text-xl font-semibold text-slate-950">{service.title}</h3><p className="mt-3 leading-7 text-slate-600">{service.summary}</p></div></Card>; })}</div><div className="mt-10 text-center"><Button onClick={() => navigate('services')} variant="outline">View All Services</Button></div></Section>;
}

function ProcessPreview({ navigate }) {
  return <Section className="bg-slate-50"><SectionHeading eyebrow="Getting Started" title="A simple, thoughtful path into care." /><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{PROCESS.map((step, index) => <Card key={step.title}><div className="p-7"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">{index + 1}</div><h3 className="text-lg font-semibold text-slate-950">{step.title}</h3><p className="mt-3 leading-7 text-slate-600">{step.text}</p></div></Card>)}</div><div className="mt-10 text-center"><Button onClick={() => navigate('new-patients')}>Begin as a New Patient</Button></div></Section>;
}

function AboutPage() {
  return <><PageHero icon={UserRound} eyebrow="About" title="In-depth psychiatric care with clinical rigor and human warmth." subtitle="Dr. Douglas Zelisko works with adults seeking a more thoughtful, personalized approach to mental health care." /><Section><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><Card className="bg-slate-50"><div className="p-8"><div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-emerald-950 text-white"><UserRound className="h-12 w-12" /></div><h3 className="mt-6 text-2xl font-semibold text-slate-950">{PRACTICE.doctor}</h3><p className="mt-2 text-slate-600">Board-certified psychiatrist</p><div className="mt-6 space-y-3 text-sm text-slate-700"><p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 text-emerald-800" /> {PRACTICE.address}</p><p className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 text-emerald-800" /> {PRACTICE.phone}</p><p className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 text-emerald-800" /> {PRACTICE.email}</p></div></div></Card><div className="space-y-6 text-lg leading-8 text-slate-700"><p>Dr. Zelisko’s approach begins with the belief that psychiatric symptoms deserve careful attention, context, and respect. Rather than reducing care to a diagnosis or a quick medication adjustment, he works to understand each person’s emotional life, relationships, medical background, stressors, values, and goals.</p><p>Treatment may include psychotherapy, medication management, integrative recommendations, diagnostic clarification, and collaboration with other clinicians. The aim is to create a plan that is clinically sound, personally meaningful, and flexible enough to evolve as life changes.</p><p>The practice is especially well-suited for adults who want more time, more depth, and a treatment relationship that can hold complexity.</p><div className="grid gap-4 sm:grid-cols-2">{['Collaborative treatment planning', 'Psychotherapy-informed psychiatry', 'Careful medication review', 'Whole-person assessment'].map((item) => <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 text-base font-medium text-slate-800 shadow-sm">{item}</div>)}</div></div></div></Section></>;
}

function ServicesPage({ navigate }) {
  return <><PageHero icon={Stethoscope} eyebrow="Services" title="Psychiatric care that looks at the full picture." subtitle="Services may include evaluation, medication management, psychotherapy, integrative treatment planning, and ketamine-assisted psychotherapy when clinically appropriate." /><Section><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{SERVICES.map((service) => { const Icon = service.icon; return <Card key={service.slug}><div className="p-7"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-900"><Icon className="h-6 w-6" /></div><h3 className="mt-5 text-xl font-semibold text-slate-950">{service.title}</h3><p className="mt-3 leading-7 text-slate-600">{service.summary}</p></div></Card>; })}</div></Section><Section className="bg-slate-50"><SectionHeading eyebrow="Care Details" title="What each service can include" /><div className="space-y-6">{SERVICES.map((service) => { const Icon = service.icon; return <Card key={service.slug}><div className="grid gap-8 p-8 lg:grid-cols-[.7fr_1.3fr]"><div><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-900"><Icon className="h-6 w-6" /></div><h3 className="mt-5 text-2xl font-semibold text-slate-950">{service.title}</h3></div><div><p className="text-lg leading-8 text-slate-700">{service.detail}</p><div className="mt-5 flex flex-wrap gap-2">{service.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{tag}</span>)}</div></div></div></Card>; })}</div><div className="mt-10 text-center"><Button onClick={() => navigate('new-patients')} variant="dark">Book an Evaluation</Button></div></Section></>;
}

function KetaminePage({ navigate }) {
  return <><PageHero icon={Sparkles} eyebrow="Ketamine-Assisted Psychotherapy" title="A careful, clinically guided option for selected patients." subtitle="Ketamine-assisted psychotherapy may be considered only after evaluation, screening, preparation, informed consent, and safety review." /><Section><div className="grid gap-8 lg:grid-cols-[1fr_.8fr]"><div className="space-y-6 text-lg leading-8 text-slate-700"><p>Ketamine-assisted psychotherapy may be considered for carefully selected adults after a psychiatric evaluation, medical screening, discussion of risks and alternatives, preparation, and informed consent. It is not a universal treatment and is not appropriate for every patient.</p><p>The psychotherapy component matters. Preparation and integration can help patients make sense of the experience, connect insights to daily life, and continue the work beyond the treatment session itself.</p><p>Because ketamine treatment has specific medical and psychiatric considerations, the decision to proceed should be individualized and made within a clear clinical relationship.</p><div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-base leading-7 text-amber-950"><div className="mb-3 flex items-center gap-2 font-semibold"><AlertTriangle className="h-5 w-5" /> Important note</div>Ketamine treatment decisions require individualized medical and psychiatric review. This website is educational and does not determine whether ketamine is appropriate for you.</div></div><Card className="bg-slate-950 text-white shadow-xl"><div className="p-8"><h3 className="text-2xl font-semibold">A responsible process includes:</h3><div className="mt-6 space-y-4">{['Clinical evaluation', 'Medical and medication review', 'Informed consent', 'Preparation', 'Monitoring', 'Psychotherapy integration'].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/5 p-4"><CheckCircle2 className="h-5 w-5 text-emerald-200" /> <span>{item}</span></div>)}</div></div></Card></div><div className="mt-10 text-center"><Button onClick={() => navigate('new-patients')}>Book an Evaluation</Button></div></Section></>;
}

function FeesPage({ navigate }) {
  return <><PageHero icon={CreditCard} eyebrow="Fees & Insurance" title="Clear payment information before you begin." subtitle="Insurance and payment pathways should be confirmed before scheduling so there are no surprises." /><Section><div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"><div className="grid gap-8 md:grid-cols-2"><div><h3 className="text-2xl font-semibold text-slate-950">Private practice care</h3><p className="mt-3 leading-7 text-slate-700">The private practice may operate out-of-network and may provide superbills when appropriate. Patients are encouraged to confirm benefits directly with their insurance plan.</p></div><div><h3 className="text-2xl font-semibold text-slate-950">Insurance-based options</h3><p className="mt-3 leading-7 text-slate-700">Insurance-based appointments may be available through Headway for eligible plans. Current plan participation should be verified before scheduling.</p></div></div><div className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-600"><strong className="text-slate-900">To verify before launch:</strong> exact fees, accepted insurance plans, superbill policy, cancellation policy, payment methods, Good Faith Estimate language, and which scheduling link belongs to each care pathway.</div><div className="mt-8 flex flex-wrap gap-3"><ExternalButton href={LINKS.evaluationVirtual} variant="dark">Book Virtual Evaluation</ExternalButton><Button onClick={() => navigate('contact')} variant="outline">Ask About Payment Options</Button></div></div></Section></>;
}

function NewPatientsPage() {
  return <><PageHero icon={Calendar} eyebrow="New Patients" title="Book a Psychiatric Evaluation Intake Appointment." subtitle="Choose the appointment format that fits best. Scheduling is handled through secure PracticeQ / IntakeQ booking links." /><Section><div className="grid gap-6 lg:grid-cols-2"><BookingCard title="Virtual Psychiatric Evaluation Intake" subtitle="Schedule a new patient psychiatric evaluation by telehealth." href={LINKS.evaluationVirtual} icon={Monitor} badge="Virtual" /><BookingCard title="In-Office Psychiatric Evaluation Intake" subtitle="Schedule a new patient psychiatric evaluation at the West Hartford office." href={LINKS.evaluationOffice} icon={MapPin} badge="In office" /></div><div className="mt-10"><EmbeddedBookingPanel defaultUrl={LINKS.evaluationVirtual} /></div><div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-950"><strong>Important:</strong> Online booking is not for emergencies or urgent clinical concerns. If you are in immediate danger, call 911 or go to the nearest emergency department. For mental health crisis support, call or text 988.</div></Section></>;
}

function CurrentPatientsPage() {
  return <><PageHero icon={Users} eyebrow="Current Patients" title="Follow-up appointments and patient portal access." subtitle="Use secure PracticeQ / IntakeQ links for follow-up scheduling and established-patient portal access." /><Section><div className="grid gap-6 lg:grid-cols-3"><BookingCard title="Virtual Follow-Up" subtitle="Schedule an established-patient follow-up appointment by telehealth." href={LINKS.followUpVirtual} icon={Monitor} badge="Follow-up" /><BookingCard title="In-Office Follow-Up" subtitle="Schedule an established-patient follow-up appointment in West Hartford." href={LINKS.followUpOffice} icon={MapPin} badge="Follow-up" /><Card className="border-emerald-200 bg-emerald-950 text-white shadow-xl"><div className="p-7"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10"><LockKeyhole className="h-7 w-7" /></div><h3 className="mt-6 text-2xl font-semibold">Patient Portal</h3><p className="mt-3 leading-7 text-emerald-50">Open the PracticeQ / IntakeQ portal for established patient access, forms, secure messages, and office workflows.</p><ExternalButton href={LINKS.portal} variant="light" className="mt-6 w-full">Open Portal</ExternalButton></div></Card></div><div className="mt-10"><EmbeddedBookingPanel defaultUrl={LINKS.followUpVirtual} /></div><div className="mt-10 rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm leading-7 text-red-950"><strong>Urgent concerns:</strong> Do not use online scheduling or the portal for emergencies. Call 911, go to the nearest emergency department, or call/text 988 for mental health crisis support.</div></Section></>;
}

function ResourcesPage() {
  return <><PageHero icon={BookOpen} eyebrow="Resources" title="Education for thoughtful mental health decisions." subtitle="A future article library to answer common questions and support informed, grounded care decisions." /><Section><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{ARTICLES.map((article) => <Card key={article.title}><div className="p-7"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">{article.category}</p><h3 className="mt-4 text-xl font-semibold text-slate-950">{article.title}</h3><p className="mt-3 leading-7 text-slate-600">{article.excerpt}</p><p className="mt-5 text-sm font-semibold text-slate-400">Draft article placeholder</p></div></Card>)}</div></Section></>;
}

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);
  return <><PageHero icon={HelpCircle} eyebrow="FAQ" title="Common questions before beginning care." subtitle="Practical answers about booking, portal access, services, payment, telehealth, and communication." /><Section className="bg-slate-50"><div className="mx-auto max-w-4xl space-y-3">{FAQS.map((faq, index) => <div key={faq.q} className="rounded-2xl border border-slate-200 bg-white shadow-sm"><button className="flex w-full items-center justify-between gap-4 p-5 text-left" onClick={() => setOpenIndex(openIndex === index ? -1 : index)}><span className="text-lg font-semibold text-slate-950">{faq.q}</span><ChevronDown className={`h-5 w-5 shrink-0 text-slate-500 transition ${openIndex === index ? 'rotate-180' : ''}`} /></button>{openIndex === index && <p className="px-5 pb-5 leading-7 text-slate-700">{faq.a}</p>}</div>)}</div></Section></>;
}

function ContactPage({ navigate }) {
  const [form, setForm] = useState({ name: '', email: '', patientType: 'New patient', message: '' });
  const mailto = useMemo(() => {
    const subject = encodeURIComponent(`${form.patientType} inquiry from ${form.name || 'website visitor'}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPatient type: ${form.patientType}\n\nMessage:\n${form.message}`);
    return `mailto:${PRACTICE.email}?subject=${subject}&body=${body}`;
  }, [form]);

  return <><PageHero icon={Mail} eyebrow="Contact" title="Start with the right next step." subtitle="Book directly, open the patient portal, or contact the practice for non-urgent administrative questions." /><Section className="bg-slate-950 text-white"><div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]"><div className="space-y-6"><Card className="border-white/10 bg-white/5 text-white"><div className="p-8"><h3 className="text-2xl font-semibold">Office information</h3><div className="mt-6 space-y-4 text-slate-200"><p className="flex gap-3"><MapPin className="mt-1 h-5 w-5 text-emerald-200" /> {PRACTICE.address}</p><p className="flex gap-3"><Phone className="mt-1 h-5 w-5 text-emerald-200" /> {PRACTICE.phone}</p><p className="flex gap-3"><Mail className="mt-1 h-5 w-5 text-emerald-200" /> {PRACTICE.email}</p></div><div className="mt-6 grid gap-3"><Button onClick={() => navigate('new-patients')} variant="light">Book New Patient Evaluation</Button><Button onClick={() => navigate('current-patients')} variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">Current Patient Links</Button><ExternalButton href={LINKS.portal} variant="light" className="w-full">Open Patient Portal</ExternalButton></div></div></Card><div className="rounded-[2rem] border border-red-300/30 bg-red-50/10 p-6 text-sm leading-7 text-red-50"><div className="mb-2 flex items-center gap-2 font-semibold"><AlertTriangle className="h-5 w-5" /> Crisis and emergency notice</div>This website is not monitored for emergencies. If you are in immediate danger, call 911 or go to the nearest emergency department. If you are experiencing a mental health crisis, call or text 988.</div></div><Card className="border-0 bg-white text-slate-950 shadow-2xl shadow-black/20"><div className="p-8"><h3 className="text-2xl font-semibold">Non-urgent inquiry form draft</h3><p className="mt-2 leading-7 text-slate-600">This demo form opens an email draft. A production version should use a secure, HIPAA-conscious workflow.</p><div className="mt-6 grid gap-4"><input className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-800" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><input className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-800" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /><select className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-800" value={form.patientType} onChange={(event) => setForm({ ...form, patientType: event.target.value })}><option>New patient</option><option>Current patient</option><option>Referring clinician</option><option>Other inquiry</option></select><textarea className="min-h-32 rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-800" placeholder="Brief reason for inquiry. Please do not include urgent or highly sensitive clinical details here." value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /><label className="flex gap-3 text-sm leading-6 text-slate-600"><input type="checkbox" className="mt-1" /> I understand this form is not for emergencies, urgent clinical issues, or time-sensitive medication requests.</label><Button href={mailto}>Send Inquiry <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div></Card></div></Section></>;
}

function AppContent({ page, navigate }) {
  const content = {
    home: <HomePage navigate={navigate} />,
    about: <AboutPage />,
    services: <ServicesPage navigate={navigate} />,
    ketamine: <KetaminePage navigate={navigate} />,
    fees: <FeesPage navigate={navigate} />,
    'new-patients': <NewPatientsPage />,
    'current-patients': <CurrentPatientsPage />,
    resources: <ResourcesPage />,
    faq: <FAQPage />,
    contact: <ContactPage navigate={navigate} />,
  };
  return content[page] || content.home;
}

export default function App() {
  const [page, setPage] = useState(getPageFromPath);

  useEffect(() => {
    const handlePopState = () => setPage(getPageFromPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function navigate(id) {
    const path = PATH_BY_PAGE[id] || '/';
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setPage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-950">
      <Header page={page} navigate={navigate} />
      <main><AppContent page={page} navigate={navigate} /></main>
      <Footer navigate={navigate} />
    </div>
  );
}
