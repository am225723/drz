import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

function read(file) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8');
}

const content = read('lib/content.js');
const ui = read('components/ui.jsx');
const contactForm = read('components/ContactForm.jsx');
const packageJson = JSON.parse(read('package.json'));

describe('Next.js migration', () => {
  it('uses Next.js scripts and dependency', () => {
    expect(packageJson.scripts.dev).toBe('next dev');
    expect(packageJson.scripts.build).toBe('next build');
    expect(packageJson.dependencies.next).toBeTruthy();
  });

  it('has app router pages', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'app', 'layout.jsx'))).toBe(true);
    expect(fs.existsSync(path.join(process.cwd(), 'app', 'page.jsx'))).toBe(true);
    expect(fs.existsSync(path.join(process.cwd(), 'app', 'contact', 'page.jsx'))).toBe(true);
    expect(fs.existsSync(path.join(process.cwd(), 'app', 'resources', 'page.jsx'))).toBe(true);
  });
});

describe('website content integrations', () => {
  it('includes the IntakeQ / PracticeQ patient portal link', () => {
    expect(content).toContain('https://drz.intakeq.com/portal');
  });

  it('includes all four booking links and official IntakeQ service IDs', () => {
    expect(content).toContain('https://link.drz.services/veval');
    expect(content).toContain('https://link.drz.services/ieval');
    expect(content).toContain('https://link.drz.services/o');
    expect(content).toContain('https://link.drz.services/v');
    expect(content).toContain('58193299-cfce-4354-b509-ce89f4aec3dc');
    expect(content).toContain('f5586c2c-2dbd-4a55-878a-df83394ce608');
    expect(content).toContain('20ee08a2-0586-4719-83fa-599c5aea1fc2');
    expect(content).toContain('57f67047-59ad-4edf-8ab1-db9f0c072bad');
  });

  it('includes top navigation routes', () => {
    expect(content).toContain("'/new-patients'");
    expect(content).toContain("'/current-patients'");
    expect(content).toContain("'Resources & FAQ'");
  });
});

describe('native React components', () => {
  it('has a React contact form instead of relying only on public DOM mutation scripts', () => {
    expect(contactForm).toContain('export default function ContactForm');
    expect(contactForm).toContain("fetch('/api/contact.php'");
    expect(contactForm).toContain('This form is not monitored 24/7');
  });

  it('has a reusable IntakeQ widget component with script de-duplication', () => {
    expect(ui).toContain('function IntakeQWidget');
    expect(ui).toContain('querySelector(`script[src=');
  });
});

describe('brand and content', () => {
  it('uses brand colors and asset references', () => {
    expect(content).toContain("deep: '#173f42'");
    expect(content).toContain("teal: '#2f8c85'");
    expect(content).toContain("mint: '#9fcf9a'");
    expect(content).toContain("logo: '/logo.png'");
    expect(content).toContain("headshot: '/headshot.jpeg'");
  });

  it('removes the Nutraceutical Support service card', () => {
    expect(content).not.toContain("title: 'Nutraceutical Support'");
    expect(content).not.toContain('Supplement and lifestyle review when clinically appropriate.');
  });

  it('includes practice methods and common care areas', () => {
    expect(content).toContain('Psychodynamic psychotherapy');
    expect(content).toContain('Ketamine-assisted therapy');
    expect(content).toContain('Trauma-focused care');
    expect(content).toContain('ADHD and focus concerns');
  });

  it('includes Dr. Z training and personal details', () => {
    expect(content).toContain('Amherst College');
    expect(content).toContain('St. George’s University School of Medicine');
    expect(read('app/about/page.jsx')).toContain('mid-century modern design');
  });
});

describe('package dependency versions', () => {
  const postcssConfig = read('postcss.config.js');

  it('pins Tailwind CSS to v3 so the PostCSS plugin configuration works', () => {
    expect(packageJson.devDependencies.tailwindcss).toBe('3.4.17');
    expect(postcssConfig).toContain('tailwindcss');
    expect(postcssConfig).not.toContain('@tailwindcss/postcss');
  });
});
