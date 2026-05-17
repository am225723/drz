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
                className="mt-3 h-auto w-1/2 max-w-[12rem]"
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
