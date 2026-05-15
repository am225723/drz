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


describe('package dependency versions', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  const postcssConfig = fs.readFileSync(path.join(process.cwd(), 'postcss.config.js'), 'utf8');

  it('pins Tailwind CSS to v3 so the PostCSS plugin configuration works', () => {
    expect(packageJson.devDependencies.tailwindcss).toBe('3.4.17');
    expect(postcssConfig).toContain('tailwindcss');
    expect(postcssConfig).not.toContain('@tailwindcss/postcss');
  });
});
