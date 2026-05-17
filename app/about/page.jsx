'use client';
import { CheckCircle2 } from 'lucide-react';
import { ASSETS, PRACTICE, TRAINING } from '../../lib/content';
import { Card, PageHero, Section } from '../../components/ui';

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
                Depending on your needs, our work together may include psychotherapy, medication management, nutraceutical support, genetic insights, and lifestyle coaching. The goal is always to create a care plan that supports your unique mental health journey with clarity, compassion, and respect.
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
                src="/dzsignature.svg"
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
