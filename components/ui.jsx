'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, ExternalLink, LockKeyhole, Menu, X } from 'lucide-react';
import { ASSETS, INTAKEQ, LINKS, NAV, PRACTICE, BOOKING_OPTIONS } from '../lib/content';

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
export function Section({ children, className = '' }) { return <section className={`py-20 ${className}`}><div className="mx-auto max-w-7xl px-6 lg:px-8">{children}</div></section>; }
export function SectionHeading({ eyebrow, title, subtitle }) { return <div className="mx-auto mb-12 max-w-3xl text-center">{eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8c85]">{eyebrow}</p>}<h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>{subtitle && <p className="mt-4 text-lg leading-8 text-slate-700">{subtitle}</p>}</div>; }
export function PageHero({ eyebrow, title, subtitle }) { return <section className="bg-[radial-gradient(circle_at_top_left,#edf8f1,transparent_40%),linear-gradient(180deg,#ffffff,#f8fafc)] py-20"><div className="mx-auto max-w-5xl px-6 text-center"><div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#173f42] text-white"><span className="text-2xl font-semibold">IP</span></div><p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8c85]">{eyebrow}</p><h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>{subtitle && <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-700">{subtitle}</p>}</div></section>; }

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"><Link href="/" className="flex items-center gap-3 text-left"><img src={ASSETS.logo} alt="Integrative Psychiatry logo" className="h-12 w-12 rounded-2xl object-contain" /><div><p className="text-sm font-semibold text-[#173f42]">{PRACTICE.name}</p><p className="text-xs text-slate-600">{PRACTICE.doctor}</p></div></Link><nav className="hidden items-center gap-4 lg:flex">{NAV.map(([href, label]) => <Link key={href} href={href} className={`text-sm font-medium ${pathname === href ? 'text-[#2f8c85]' : 'text-slate-700 hover:text-slate-950'}`}>{label}</Link>)}</nav><div className="hidden items-center gap-3 lg:flex"><Button href={LINKS.portal} external variant="ghost"><LockKeyhole className="mr-2 h-4 w-4" /> Portal</Button><Button href="/new-patients">Book Now</Button></div><Button variant="outline" className="lg:hidden" onClick={() => setOpen(!open)}>{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</Button></div>{open && <div className="border-t border-slate-200 bg-white px-6 py-5 lg:hidden"><div className="grid gap-2">{NAV.map(([href, label]) => <Link key={href} onClick={() => setOpen(false)} href={href} className="rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700">{label}</Link>)}</div></div>}</header>;
}
export function Footer() { return <footer className="border-t border-slate-200 bg-white py-10"><div className="mx-auto grid max-w-7xl gap-8 px-6 text-sm text-slate-600 lg:grid-cols-2 lg:px-8"><div><p className="font-semibold text-[#173f42]">{PRACTICE.name} | {PRACTICE.doctor}</p><p className="mt-2">{PRACTICE.address}</p><p>{PRACTICE.phone} · {PRACTICE.email}</p><div className="mt-5 flex flex-wrap gap-3">{NAV.map(([href, label]) => <Link key={href} href={href} className="hover:text-slate-950">{label}</Link>)}<a href={LINKS.portal} target="_blank" rel="noreferrer" className="hover:text-slate-950">Patient Portal</a></div></div><div className="lg:text-right"><p>This website provides general information and is not medical advice.</p><p className="mt-4">© {new Date().getFullYear()} Integrative Psychiatry. All rights reserved.</p></div></div></footer>; }

export function IntakeQWidget({ option }) {
  useEffect(() => {
    const container = document.getElementById('intakeq');
    if (container) container.innerHTML = '';
    window.intakeq = INTAKEQ.accountId;
    window.intakeqServiceId = option.serviceId;
    let script = document.querySelector(`script[src="${INTAKEQ.scriptSrc}"]`);
    if (!script) { script = document.createElement('script'); script.type = 'text/javascript'; script.async = true; script.src = INTAKEQ.scriptSrc; document.head.appendChild(script); }
  }, [option]);
  return <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl shadow-[#173f42]/20"><div className={`h-2 bg-gradient-to-r ${option.tone}`} /><div className="grid gap-0 lg:grid-cols-[0.42fr_0.58fr]"><div className="bg-[#173f42] p-8 text-white"><p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d6e7c7]">PracticeQ booking scheduler</p><h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">{option.title}</h3><p className="mt-4 leading-7 text-slate-100">Secure scheduling is powered by IntakeQ / PracticeQ.</p><ExternalButton href={option.href} variant="light" className="mt-8 w-full">Open in New Window</ExternalButton></div><div className="bg-[radial-gradient(circle_at_top,#edf8f1,transparent_35%),#ffffff] p-4 sm:p-6"><div className="mx-auto max-w-[720px] rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-inner shadow-slate-100"><div id="intakeq" style={{ maxWidth: '720px', width: '100%' }} /></div><p className="mt-4 text-center text-sm text-slate-500">If the scheduler does not load, <a href={option.href} target="_blank" rel="noreferrer" className="font-semibold text-[#173f42] underline">open the secure booking page</a>.</p></div></div></div>;
}
export function BookingExperience({ mode = 'all', defaultKey = 'evaluation-virtual' }) {
  const options = mode === 'new' ? BOOKING_OPTIONS.slice(0, 2) : mode === 'current' ? BOOKING_OPTIONS.slice(2) : BOOKING_OPTIONS;
  const [selectedKey, setSelectedKey] = useState(defaultKey);
  const selected = options.find((o) => o.key === selectedKey) || options[0];
  return <div className="relative"><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{options.map((option) => { const Icon = option.icon; return <button type="button" key={option.key} onClick={() => setSelectedKey(option.key)} className={`group relative overflow-hidden rounded-[2rem] border p-[1px] text-left shadow-xl transition hover:-translate-y-1 ${selected.key === option.key ? 'border-[#9fcf9a]' : 'border-slate-200'}`}><div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${option.tone}`} /><div className="relative h-full rounded-[1.95rem] bg-white p-6"><div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${option.tone} text-white shadow-lg`}><Icon className="h-7 w-7" /></div><h3 className="mt-6 text-2xl font-semibold text-slate-950">{option.title}</h3><p className="mt-3 leading-7 text-slate-600">{option.subtitle}</p><div className="mt-6 flex items-center justify-between text-sm font-semibold text-[#2f8c85]"><span>{selected.key === option.key ? 'Selected appointment' : 'Select appointment'}</span><ArrowRight className="h-4 w-4" /></div></div></button>; })}</div><div className="mt-8"><IntakeQWidget option={selected} /></div></div>;
}
export function CheckList({ items }) { return <div className="grid gap-4 sm:grid-cols-2">{items.map((item) => <Card key={item}><div className="p-5"><CheckCircle2 className="h-5 w-5 text-[#2f8c85]" /><h3 className="mt-3 font-semibold text-slate-950">{item}</h3></div></Card>)}</div>; }
