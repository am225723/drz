import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const appPath = path.join(process.cwd(), 'src', 'App.jsx');
const app = fs.readFileSync(appPath, 'utf8');

describe('website content integrations', () => {
  it('includes the IntakeQ / PracticeQ patient portal link', () => {
    expect(app).toContain('https://drz.intakeq.com/portal');
  });

  it('includes all four booking links', () => {
    expect(app).toContain('https://link.drz.services/veval');
    expect(app).toContain('https://link.drz.services/ieval');
    expect(app).toContain('https://link.drz.services/o');
    expect(app).toContain('https://link.drz.services/v');
  });

  it('includes both new-patient and current-patient routes', () => {
    expect(app).toContain("path: '/new-patients'");
    expect(app).toContain("path: '/current-patients'");
  });

  it('includes iframe fallback language for embedded booking', () => {
    expect(app).toContain('If the scheduler does not load');
    expect(app).toContain('PracticeQ booking scheduler');
  });
});

describe('About Dr. Z content from the original site', () => {
  it('includes Dr. Z training and credentials', () => {
    expect(app).toContain('Board-certified psychiatrist');
    expect(app).toContain('Amherst College');
    expect(app).toContain('St. George’s University School of Medicine');
    expect(app).toContain('UConn School of Medicine');
  });

  it('includes Dr. Z holistic modalities and personal details', () => {
    expect(app).toContain('psychotherapy');
    expect(app).toContain('medication management');
    expect(app).toContain('nutraceutical');
    expect(app).toContain('genetic insights');
    expect(app).toContain('lifestyle coaching');
    expect(app).toContain('road biking');
    expect(app).toContain('running');
    expect(app).toContain('mid-century modern design');
  });

  it('includes the original whole-person positioning language', () => {
    expect(app).toContain('mind, body, and spirit');
    expect(app).toContain('whole individual');
    expect(app).toContain('Your partner in healing');
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
