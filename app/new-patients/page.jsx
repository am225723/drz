import { Calendar } from 'lucide-react';
import { BookingExperience, PageHero, Section } from '../../components/ui';
export const metadata = { title: 'New Patients | Integrative Psychiatry' };
export default function NewPatientsPage() { return <><PageHero icon={Calendar} eyebrow="New Patients" title="Book a Psychiatric Evaluation Intake Appointment." subtitle="Choose virtual or in-office care, then complete the official IntakeQ scheduling widget." /><Section><BookingExperience mode="new" defaultKey="evaluation-virtual" /></Section></>; }
