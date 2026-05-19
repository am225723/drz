'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CalendarCheck, CheckCircle2, ExternalLink, LockKeyhole, Menu, Phone, X } from 'lucide-react';
import { ASSETS, INTAKEQ, LINKS, NAV, PRACTICE, BOOKING_OPTIONS } from '../lib/content';

const desktopNav = [
  ['/about', 'About'],
  ['/services', 'Services'],
  ['/ketamine-therapy', 'Ketamine'],
  ['/resources', 'Resources & FAQ'],
  ['/fees-insurance', 'Fees']
];

const mobileMenuGroups = [
  {
    title: 'Start Care',
    description: 'For people considering the practice.',
    items: [
      ['/new-patients', 'Schedule New Patient Evaluation'],
      ['/new-patients#practice-fit', 'Is this practice right for me?'],
      ['/fees-insurance', 'Fees & Insurance']
    ]
  },
  {
    title: 'Current Patients',
    description: 'Quick access for established patients.',
    items: [
      [LINKS.portal, 'Patient Portal', true],
      ['/current-patients', 'Follow-Up Appointments']
    ]
  },
  {
    title: 'Learn',
    description: 'Understand care options and resources.',
    items: [
      ['/services', 'Services'],
      ['/ketamine-therapy', 'Ketamine-Assisted Psychotherapy'],
      ['/resources', 'Resources & FAQ']
    ]
  },
  {
    title: 'Practice',
    description: 'Office information and background.',
    items: [
      ['/about', 'About Dr. Zelisko'],
      ['/contact', 'Contact'],
      ['/emergency-disclaimer', 'Emergency Information']
    ]
  }
];

function isActivePath(pathname, href) {
  if (!href || href.startsWith('http') || href.startsWith('tel:')) return false;
  const cleanHref = href.split('#')[0];
  if (cleanHref === '/') return pathname === '/';
  return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
}

export function Button({ children, href, external = false, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition';
  const styles = { primary: 'bg-[#173f42] text-white hover:bg-[#24565a]', dark: 'bg-slate-950 text-white hover:bg-slate-800', outline: 'border border-slate-300 bg-white text-slate-950 hover:bg-slate-50', ghost: 'bg-transparent text-slate-700 hover:bg-slate-100', light: 'border border-white/30 bg-white text-[#173f42] hover:bg-[#edf8f1]' }[variant];
  if (href) {
    const cls = `${base} ${styles} ${className}`;
    return external ? <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}</a> : <Link href={href} className={cls}>{children}</Link>;
  }
  return <button className={`${base} ${styles} ${className}`} {...props}>{children}</button>;
}
export function ExternalButton({ children, ...props }) { return <Button external {...props}>{children}<ExternalLink className="ml-2 h-4 w-4" /></Button>; }
export function Card({ children, className = '' }) { return <div className={`rounded-[1.75rem] border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>; }
export function Section({ children, className = '', ...props }) { return <section className={`py-20 ${className}`} {...props}><div className="mx-auto max-w-7xl px-6 lg:px-8">{children}</div></section>; }
export function SectionHeading({ eyebrow, title, subtitle }) { return <div className="mx-auto mb-12 max-w-3xl text-center">{eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8c85]">{eyebrow}</p>}<h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>{subtitle && <p className="mt-4 text-lg leading-8 text-slate-700">{subtitle}</p>}</div>; }
export function PageHero({ eyebrow, title, subtitle }) { return <section className="bg-[radial-gradient(circle_at_top_left,#edf8f1,transparent_40%),linear-gradient(180deg,#ffffff,#f8fafc)] py-20"><div className="mx-auto max-w-5xl px-6 text-center"><div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#173f42] text-white"><span className="text-2xl font-semibold">IP</span></div><p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8c85]">{eyebrow}</p><h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>{subtitle && <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-700">{subtitle}</p>}</div></section>; }

function MobileMenuLink({ href, label, external = false, onClick, pathname }) {
  const active = isActivePath(pathname, href);
  const className = `block rounded-2xl px-4 py-3 text-base font-semibold transition ${active ? 'bg-[#edf8f1] text-[#173f42]' : 'bg-white text-slate-800 hover:bg-slate-50'}`;
  if (external) return <a href={href} target="_blank" rel="noreferrer" onClick={onClick} className={className}>{label}</a>;
  return <Link href={href} onClick={onClick} className={className}>{label}</Link>;
}

function MobileBottomBar() {
  return <nav className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-200 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:hidden" aria-label="Quick actions"><div className="mx-auto grid max-w-md grid-cols-3 gap-2"><a href="tel:+18606153629" className="flex min-h-14 flex-col items-center justify-center rounded-2xl bg-slate-50 px-3 text-xs font-semibold text-slate-700"><Phone className="mb-1 h-5 w-5 text-[#173f42]" />Call</a><Link href="/new-patients" className="flex min-h-14 flex-col items-center justify-center rounded-2xl bg-[#173f42] px-3 text-xs font-semibold text-white"><CalendarCheck className="mb-1 h-5 w-5" />Book</Link><a href={LINKS.portal} target="_blank" rel="noreferrer" className="flex min-h-14 flex-col items-center justify-center rounded-2xl bg-[#edf8f1] px-3 text-xs font-semibold text-[#173f42]"><LockKeyhole className="mb-1 h-5 w-5" />Portal</a></div></nav>;
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return <><header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"><Link href="/" className="flex items-center gap-3 text-left" onClick={() => setOpen(false)}><img src={ASSETS.logo} alt="Integrative Psychiatry logo" className="h-12 w-12 rounded-2xl object-contain" /><div><p className="text-sm font-semibold text-[#173f42]">{PRACTICE.name}</p><p className="text-xs text-slate-600">{PRACTICE.doctor}</p></div></Link><nav className="hidden items-center gap-5 lg:flex" aria-label="Primary navigation">{desktopNav.map(([href, label]) => <Link key={href} href={href} className={`rounded-full px-3 py-2 text-sm font-semibold transition ${isActivePath(pathname, href) ? 'bg-[#edf8f1] text-[#173f42]' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'}`}>{label}</Link>)}</nav><div className="hidden items-center gap-3 lg:flex"><Button href={LINKS.portal} external variant="ghost"><LockKeyhole className="mr-2 h-4 w-4" /> Patient Portal</Button><Button href="/new-patients">Schedule Evaluation</Button></div><button type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} onClick={() => setOpen(!open)} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-900 shadow-sm lg:hidden">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>{open && <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-slate-200 bg-white px-5 py-5 shadow-2xl lg:hidden"><div className="mb-5 grid grid-cols-2 gap-3"><Link href="/new-patients" onClick={() => setOpen(false)} className="rounded-2xl bg-[#173f42] px-4 py-4 text-center text-sm font-bold text-white">Schedule Evaluation</Link><a href={LINKS.portal} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className="rounded-2xl bg-[#edf8f1] px-4 py-4 text-center text-sm font-bold text-[#173f42]">Patient Portal</a></div><div className="grid gap-4">{mobileMenuGroups.map((group) => <section key={group.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"><h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#2f8c85]">{group.title}</h2><p className="mt-1 text-sm text-slate-500">{group.description}</p><div className="mt-3 grid gap-2">{group.items.map(([href, label, external]) => <MobileMenuLink key={`${group.title}-${label}`} href={href} label={label} external={Boolean(external)} onClick={() => setOpen(false)} pathname={pathname} />)}</div></section>)}</div><div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Emergency?</strong> Call 911, go to the nearest emergency room, or call/text 988.</div></div>}</header><MobileBottomBar /></>;
}

export function Footer() { const legal = [['/privacy-policy','Privacy Policy'], ['/notice-of-privacy-practices','Notice of Privacy Practices'], ['/terms-of-use','Terms of Use'], ['/emergency-disclaimer','Emergency Disclaimer']]; return <footer className="border-t border-slate-200 bg-white py-10 pb-28 lg:pb-10"><div className="mx-auto grid max-w-7xl gap-8 px-6 text-sm text-slate-600 lg:grid-cols-2 lg:px-8"><div><p className="font-semibold text-[#173f42]">{PRACTICE.name} | {PRACTICE.doctor}</p><p className="mt-2">{PRACTICE.address}</p><p>{PRACTICE.phone} · {PRACTICE.email}</p><div className="mt-5 flex flex-wrap gap-3">{NAV.map(([href, label]) => <Link key={href} href={href} className="hover:text-slate-950">{label}</Link>)}<a href={LINKS.portal} target="_blank" rel="noreferrer" className="hover:text-slate-950">Patient Portal</a></div><div className="mt-4 flex flex-wrap gap-3 border-t border-slate-200 pt-4">{legal.map(([href, label]) => <Link key={href} href={href} className="font-medium text-[#173f42] hover:text-slate-950">{label}</Link>)}</div></div><div className="lg:text-right"><p>This website is for informational purposes only and does not provide medical advice, diagnosis, or treatment. Submitting a form or sending a message does not establish a doctor-patient relationship. If you are experiencing an emergency, call 911, go to the nearest emergency room, or call/text 988.</p><p className="mt-4">© {new Date().getFullYear()} Integrative Psychiatry. All rights reserved.</p></div></div></footer>; }

function resetIntakeQGlobals(serviceId) {
  window.intakeq = INTAKEQ.accountId;
  window.intakeqServiceId = serviceId;
  delete window.IntakeQ;
  delete window.intakeQ;
}

function removeIntakeQScript() {
  document.querySelectorAll('script[src^="https://intakeq.com/js/widget.min.js"]').forEach((script) => script.remove());
}

export function IntakeQWidget({ option }) {
  const hostRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    const host = hostRef.current;
    if (!host) return undefined;

    host.innerHTML = '';
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'intakeq';
    widgetContainer.style.maxWidth = '720px';
    widgetContainer.style.width = '100%';
    widgetContainer.style.minHeight = '620px';
    host.appendChild(widgetContainer);

    resetIntakeQGlobals(option.serviceId);
    removeIntakeQScript();

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `${INTAKEQ.scriptSrc}&service=${encodeURIComponent(option.serviceId)}&t=${Date.now()}`;
    script.onload = () => {
      if (!cancelled) setStatus('loaded');
    };
    script.onerror = () => {
      if (!cancelled) setStatus('error');
    };
    document.head.appendChild(script);

    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled && widgetContainer.children.length === 0) setStatus('fallback');
    }, 3500);

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      script.remove();
      if (host) host.innerHTML = '';
    };
  }, [option.key, option.serviceId]);

  return <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl shadow-[#173f42]/20"><div className={`h-2 bg-gradient-to-r ${option.tone}`} /><div className="grid gap-0 lg:grid-cols-[0.42fr_0.58fr]"><div className="bg-[#173f42] p-8 text-white"><p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d6e7c7]">PracticeQ booking scheduler</p><h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">{option.title}</h3><p className="mt-4 leading-7 text-slate-100">Secure scheduling is powered by IntakeQ / PracticeQ. If your browser blocks embedded scheduling, the direct secure link will still work.</p><ExternalButton href={option.href} variant="light" className="mt-8 w-full">Open Secure Scheduler</ExternalButton></div><div className="bg-[radial-gradient(circle_at_top,#edf8f1,transparent_35%),#ffffff] p-4 sm:p-6"><div className="mx-auto max-w-[760px] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-inner shadow-slate-100"><div ref={hostRef} className="min-h-[620px] w-full" />{status === 'loading' && <div className="flex min-h-[220px] items-center justify-center rounded-2xl bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">Loading secure scheduler…</div>}{(status === 'error' || status === 'fallback') && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center"><p className="font-semibold text-amber-950">The embedded scheduler did not load in this browser.</p><p className="mt-2 text-sm leading-6 text-amber-900">Some privacy settings, browser extensions, or cross-site tracking restrictions can block embedded scheduling widgets.</p><ExternalButton href={option.href} variant="dark" className="mt-4">Open Secure Scheduler</ExternalButton></div>}</div><p className="mt-4 text-center text-sm text-slate-500">Trouble viewing it? <a href={option.href} target="_blank" rel="noreferrer" className="font-semibold text-[#173f42] underline">Open the secure booking page</a>.</p></div></div></div>;
}
export function BookingExperience({ mode = 'all', defaultKey = 'evaluation-virtual' }) {
  const options = mode === 'new' ? BOOKING_OPTIONS.slice(0, 2) : mode === 'current' ? BOOKING_OPTIONS.slice(2) : BOOKING_OPTIONS;
  const [selectedKey, setSelectedKey] = useState(defaultKey);
  const selected = options.find((o) => o.key === selectedKey) || options[0];
  return <div className="relative"><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{options.map((option) => { const Icon = option.icon; return <button type="button" key={option.key} onClick={() => setSelectedKey(option.key)} className={`group relative overflow-hidden rounded-[2rem] border p-[1px] text-left shadow-xl transition hover:-translate-y-1 ${selected.key === option.key ? 'border-[#9fcf9a]' : 'border-slate-200'}`}><div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${option.tone}`} /><div className="relative h-full rounded-[1.95rem] bg-white p-6"><div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${option.tone} text-white shadow-lg`}><Icon className="h-7 w-7" /></div><h3 className="mt-6 text-2xl font-semibold text-slate-950">{option.title}</h3><p className="mt-3 leading-7 text-slate-600">{option.subtitle}</p><div className="mt-6 flex items-center justify-between text-sm font-semibold text-[#2f8c85]"><span>{selected.key === option.key ? 'Selected appointment' : 'Select appointment'}</span><ArrowRight className="h-4 w-4" /></div></div></button>; })}</div><div className="mt-8"><IntakeQWidget option={selected} /></div></div>;
}
export function CheckList({ items }) { return <div className="grid gap-4 sm:grid-cols-2">{items.map((item) => <Card key={item}><div className="p-5"><CheckCircle2 className="h-5 w-5 text-[#2f8c85]" /><h3 className="mt-3 font-semibold text-slate-950">{item}</h3></div></Card>)}</div>; }
