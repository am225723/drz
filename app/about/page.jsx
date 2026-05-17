'use client';
import { CheckCircle2 } from 'lucide-react';
import { ASSETS, PRACTICE, TRAINING } from '../../lib/content';
import { Card, PageHero, Section } from '../../components/ui';
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Meet Dr. Z"
        title="Your partner in healing."
        subtitle="Dr. Douglas Zelisko, affectionately known as Dr. Z, is a board-certified psychiatrist with a deep commitment to holistic, personalized mental health care."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <Card className="bg-slate-50">
            <div className="p-8">
              <div className="mx-auto w-1/2 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
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
          <div className="space-y-6 text-lg leading-8 text-slate-700">
            <p>
              Leading our practice is Dr. Douglas Zelisko, affectionately known
              as Dr. Z. As a board-certified psychiatrist, Dr. Z brings a
              profound passion for holistic mental health care and a wealth of
              expertise to every patient interaction.
            </p>
            <p>
              Dr. Zelisko&apos;s academic foundation includes degrees from
              Amherst College and St. George’s University School of Medicine,
              followed by his Psychiatry residency at UConn School of Medicine.
              His extensive background and commitment to continuous learning
              ensure that you receive care at the forefront of integrative
              psychiatry. Dr. Z&apos;s patient-centric approach means he treats
              you as a whole individual, not just a list of symptoms.
            </p>
            <p>
              He seamlessly integrates a variety of therapeutic modalities, from
              psychotherapy and medication management to nutraceuticals, genetic
              insights, and comprehensive lifestyle coaching, all designed to
              support your unique mental health journey.
            </p>
            <p>
              Beyond his professional dedication, Dr. Z enjoys road biking,
              running, and discovering mid-century modern design treasures,
              reflecting his commitment to a balanced and fulfilling life—a
              principle he encourages in his patients as well.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
