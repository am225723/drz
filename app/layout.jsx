import './globals.css';
import { Header, Footer } from '../components/ui';

export const metadata = {
  title: 'Integrative Psychiatry | Douglas Zelisko, MD',
  description: 'Integrative psychiatric care, psychotherapy, medication management, and secure online booking with Douglas Zelisko, MD in West Hartford, Connecticut.',
  metadataBase: new URL('https://drzelisko.com'),
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' }
    ],
    shortcut: ['/logo.png'],
    apple: [
      { url: '/logo.png', type: 'image/png' }
    ]
  }
};

const physicianSchema = {
  '@context': 'https://schema.org',
  '@type': 'Physician',
  name: 'Douglas Zelisko, MD',
  medicalSpecialty: 'Psychiatry',
  url: 'https://drzelisko.com/',
  image: 'https://drzelisko.com/headshot.jpg',
  telephone: '+1-860-615-3629',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '45 South Main Street, Suite 111',
    addressLocality: 'West Hartford',
    addressRegion: 'CT',
    postalCode: '06107',
    addressCountry: 'US'
  },
  areaServed: { '@type': 'State', name: 'Connecticut' },
  availableService: [
    { '@type': 'MedicalTherapy', name: 'Psychiatric Evaluation' },
    { '@type': 'MedicalTherapy', name: 'Medication Management' },
    { '@type': 'MedicalTherapy', name: 'Psychotherapy' },
    { '@type': 'MedicalTherapy', name: 'Ketamine-Assisted Psychotherapy' }
  ]
};

const clinicSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalClinic',
  name: 'Integrative Psychiatry',
  url: 'https://drzelisko.com/',
  telephone: '+1-860-615-3629',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '45 South Main Street, Suite 111',
    addressLocality: 'West Hartford',
    addressRegion: 'CT',
    postalCode: '06107',
    addressCountry: 'US'
  },
  medicalSpecialty: 'Psychiatry',
  areaServed: ['West Hartford', 'Hartford', 'Connecticut']
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Do you accept insurance?', acceptedAnswer: { '@type': 'Answer', text: 'Insurance availability may vary by appointment type and booking pathway. Some appointments may be private-pay or out-of-network, while insurance-based appointments may be available through partner platforms. Please review the Fees & Insurance page or contact the office for current details.' } },
    { '@type': 'Question', name: 'Do you provide therapy?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Dr. Zelisko provides psychotherapy as part of psychiatric care when clinically appropriate. Treatment may include psychotherapy, medication management, lifestyle recommendations, and broader integrative treatment planning.' } },
    { '@type': 'Question', name: 'Do you prescribe medication?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Medication may be recommended when appropriate after a psychiatric evaluation. Medication decisions are made collaboratively and are based on symptoms, diagnosis, treatment history, risks, benefits, and patient goals.' } },
    { '@type': 'Question', name: 'Do you offer ketamine-assisted psychotherapy?', acceptedAnswer: { '@type': 'Answer', text: 'Ketamine-assisted psychotherapy may be considered for selected patients after a full psychiatric evaluation, screening, and informed consent process. It is not appropriate for everyone and is not offered as a stand-alone quick intervention.' } }
  ]
};

export default function RootLayout({ children }) {
  return <html lang="en"><body className="min-h-screen bg-white font-sans text-slate-950"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchema) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /><Header /><main>{children}</main><Footer /></body></html>;
}
