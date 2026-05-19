'use client';
import { AlertTriangle, Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from '../../components/ContactForm';
import { LINKS, PRACTICE } from '../../lib/content';
import { Button, Card, ExternalButton, PageHero, Section } from '../../components/ui';

export default function ContactPage() {
  return <>
    <PageHero eyebrow="Contact" title="Start with the right next step." subtitle="Book directly, open the patient portal, or contact the practice for administrative questions." />
    <ContactForm />
    <Section className="bg-[#173f42] text-white">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/5 text-white">
          <div className="p-8">
            <h3 className="text-2xl font-semibold text-white">Office information</h3>
            <div className="mt-6 space-y-4 text-white">
              <p className="flex gap-3"><MapPin className="mt-1 h-5 w-5 text-[#9fcf9a]" /> {PRACTICE.address}</p>
              <p className="flex gap-3"><Phone className="mt-1 h-5 w-5 text-[#9fcf9a]" /> {PRACTICE.phone}</p>
              <p className="flex gap-3"><Mail className="mt-1 h-5 w-5 text-[#9fcf9a]" /> {PRACTICE.email}</p>
            </div>
            <div className="mt-6 grid gap-3">
              <Button href="/new-patients" variant="light">Book New Patient Evaluation</Button>
              <Button href="/current-patients" variant="light">Current Patient Links</Button>
              <ExternalButton href={LINKS.portal} variant="light" className="w-full">Open Patient Portal</ExternalButton>
            </div>
          </div>
        </Card>
        <div className="rounded-[2rem] border border-amber-200/30 bg-white/5 p-8">
          <AlertTriangle className="h-6 w-6 text-amber-100" />
          <h3 className="mt-4 text-2xl font-semibold text-white">For urgent needs</h3>
          <p className="mt-3 leading-7 text-white">This website and online booking are not monitored for urgent clinical needs. Use emergency or crisis resources when needed.</p>
        </div>
      </div>
    </Section>
  </>;
}
