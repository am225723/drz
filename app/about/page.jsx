'use client';
import { CheckCircle2 } from 'lucide-react';
import { ASSETS, PRACTICE, TRAINING } from '../../lib/content';
import { Card, PageHero, Section } from '../../components/ui';

const signatureImage = 'data:image/png;base64,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';

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Meet Dr. Z"
        title="A letter from Dr. Z."
        subtitle="A personal welcome from Dr. Douglas Zelisko on his approach to holistic, individualized psychiatric care."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <Card className="bg-slate-50">
            <div className="p-8">
              <div className="mx-auto max-w-sm overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
                <img
                  src={ASSETS.headshot}
                  alt="Dr. Douglas Zelisko"
                  className="h-auto w-full object-contain object-center"
                />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-slate-950">
                {PRACTICE.doctor}
              </h3>
              <p className="mt-2 text-slate-600">
                Board-certified psychiatrist
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-700">
                {TRAINING.map((item) => (
                  <p key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#2f8c85]" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </Card>
          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100 sm:p-10">
            <div className="mb-8 border-l-4 border-[#9fcf9a] pl-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8c85]">
                From Dr. Zelisko
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Welcome.
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-slate-700">
              <p>
                Welcome. I’m Dr. Douglas Zelisko—though many of my patients know me simply as Dr. Z. I’m a board-certified psychiatrist, and my passion is helping people find meaningful, lasting improvement through thoughtful, holistic mental health care.
              </p>
              <p>
                My path to psychiatry began with my studies at Amherst College and continued at St. George’s University School of Medicine, followed by psychiatry residency training at the UConn School of Medicine. Throughout my career, I’ve remained committed to learning, growing, and bringing the most current, integrative approaches into the care I provide.
              </p>
              <p>
                I believe each person deserves to be understood as a whole individual—not reduced to a diagnosis or a list of symptoms. My approach is collaborative, personalized, and grounded in the belief that mental health is shaped by many interconnected factors.
              </p>
              <p>
                Depending on your needs, our work together may include psychotherapy, medication management, genetic insights, and lifestyle coaching. The goal is always to create a care plan that supports your unique mental health journey with clarity, compassion, and respect.
              </p>
              <p>
                Outside of my clinical work, I enjoy road biking, running, and searching for mid-century modern design treasures. I value balance, curiosity, and a fulfilling life—and I try to bring those same principles into the work I do with my patients.
              </p>
              <p>
                I’m glad you’re here, and I look forward to helping you take the next step in your care.
              </p>
            </div>
            <div className="mt-10 rounded-[1.5rem] bg-[#edf8f1] p-6">
              <p className="text-lg font-medium text-[#173f42]">Warmly,</p>
              <img
                src={signatureImage}
                alt="Dr. Douglas Zelisko signature"
                className="mt-3 h-auto w-full max-w-sm"
              />
              <p className="mt-2 text-base font-semibold text-slate-950">Dr. Douglas Zelisko</p>
              <p className="text-sm text-slate-600">“Dr. Z”</p>
            </div>
          </article>
        </div>
      </Section>
    </>
  );
}
