import './globals.css';
import { Header, Footer } from '../components/ui';

export const metadata = {
  title: 'Integrative Psychiatry | Douglas Zelisko, MD',
  description: 'Integrative psychiatric care, psychotherapy, medication management, and secure online booking with Douglas Zelisko, MD in West Hartford, Connecticut.',
  metadataBase: new URL('https://drzelisko.com'),
};

export default function RootLayout({ children }) {
  return <html lang="en"><body className="min-h-screen bg-white font-sans text-slate-950"><Header /><main>{children}</main><Footer /></body></html>;
}
