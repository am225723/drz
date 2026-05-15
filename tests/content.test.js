import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const appPath = path.join(process.cwd(), 'src', 'App.jsx');
const app = fs.readFileSync(appPath, 'utf8');

describe('website content integrations', () => {
  it('includes the IntakeQ / PracticeQ patient portal link', () => {
    expect(app).toContain('https://drz.intakeq.com/portal');
  });

  it('includes all four booking links and official IntakeQ service IDs', () => {
    expect(app).toContain('https://link.drz.services/veval');
    expect(app).toContain('https://link.drz.services/ieval');
    expect(app).toContain('https://link.drz.services/o');
    expect(app).toContain('https://link.drz.services/v');
    expect(app).toContain('58193299-cfce-4354-b509-ce89f4aec3dc');
    expect(app).toContain('f5586c2c-2dbd-4a55-878a-df83394ce608');
    expect(app).toContain('20ee08a2-0586-4719-83fa-599c5aea1fc2');
    expect(app).toContain('57f67047-59ad-4edf-8ab1-db9f0c072bad');
  });

  it('includes both new-patient and current-patient routes', () => {
    expect(app).toContain("path: '/new-patients'");
    expect(app).toContain("path: '/current-patients'");
  });

  it('routes legacy FAQ and commentary paths to the combined resources page', () => {
    expect(app).toContain("'/faq': 'resources'");
    expect(app).toContain("'/commentary': 'resources'");
    expect(app).toContain("label: 'Resources & FAQ'");
  });
});

describe('brand and visual updates', () => {
  it('uses brand colors and asset references', () => {
    expect(app).toContain("deep: '#173f42'");
    expect(app).toContain("teal: '#2f8c85'");
    expect(app).toContain("mint: '#9fcf9a'");
    expect(app).toContain("logo: '/logo.png'");
    expect(app).toContain("headshot: '/headshot.jpeg'");
  });

  it('removes the Nutraceutical Support service card', () => {
    expect(app).not.toContain("title: 'Nutraceutical Support'");
    expect(app).not.toContain('Supplement and lifestyle review when clinically appropriate.');
  });
});

describe('homepage practice expansion', () => {
  it('includes practice methods and common care areas', () => {
    expect(app).toContain('A wider lens for mental health');
    expect(app).toContain('Psychodynamic psychotherapy');
    expect(app).toContain('Ketamine-assisted therapy');
    expect(app).toContain('Trauma-focused care');
    expect(app).toContain('Common areas of care');
    expect(app).toContain('ADHD and focus concerns');
  });
});

describe('About Dr. Z content from the original site', () => {
  it('includes Dr. Z training and credentials', () => {
    expect(app).toContain('Board-certified psychiatrist');
    expect(app).toContain('Amherst College');
    expect(app).toContain('St. George’s University School of Medicine');
    expect(app).toContain('UConn School of Medicine');
  });

  it('includes Dr. Z personal details', () => {
    expect(app).toContain('road biking');
    expect(app).toContain('running');
    expect(app).toContain('mid-century modern design');
  });
});

describe('combined Resources & FAQ content', () => {
  it('includes resource article topics and FAQ groups', () => {
    expect(app).toContain('What Is Holistic Psychiatry?');
    expect(app).toContain('Beyond Medication: A Holistic View on Treating ADHD');
    expect(app).toContain('Feeling Anxious? 5 Integrative Approaches to Find Calm');
    expect(app).toContain('Holistic Care for Mental Wellness');
    expect(app).toContain('Services & Conditions Treated');
    expect(app).toContain('Getting Started & Logistics');
    expect(app).toContain('What should I expect during my first full appointment?');
  });
});

describe('package dependency versions', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  const postcssConfig = fs.readFileSync(path.join(process.cwd(), 'postcss.config.js'), 'utf8');

  it('pins Tailwind CSS to v3 so the PostCSS plugin configuration works', () => {
    expect(packageJson.devDependencies.tailwindcss).toBe('3.4.17');
    expect(postcssConfig).toContain('tailwindcss');
    expect(postcssConfig).not.toContain('@tailwindcss/postcss');
  });
});
