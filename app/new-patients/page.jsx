import { BookingExperience, PageHero, Section } from '../../components/ui';
export const metadata = { title: 'Scheduling | Integrative Psychiatry' };
export default function NewPatientsPage() {
  return <><PageHero eyebrow="New Patients" title="Book a Psychiatric Evaluation Intake Appointment." subtitle="Choose virtual or in-office care, then complete the official IntakeQ scheduling widget." /><Section><BookingExperience mode="new" defaultKey="evaluation-virtual" /></Section></>;
}
