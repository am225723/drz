'use client';
import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ARTICLES, FAQ_GROUPS } from '../lib/content';
import { PageHero, Section, SectionHeading, Button } from './ui';

function isNumberedHeading(text) {
  return /^\d+\.\s+/.test(text);
}

function isSectionHeading(text) {
  const trimmed = text.trim();
  return trimmed.length < 95 && (trimmed.endsWith(':') || /^(What is|Key Principles|What to Expect|Is It Just|Core Components|Medication in|The Approach)$/i.test(trimmed));
}

function ArticleBody({ body }) {
  const blocks = body.split('\n\n').map((block) => block.trim()).filter(Boolean);
  let afterHeading = false;

  return <div className="space-y-5">
    {blocks.map((block) => {
      const numbered = isNumberedHeading(block);
      const heading = !numbered && isSectionHeading(block);
      const indented = afterHeading && !heading && !numbered;
      afterHeading = heading || numbered;

      if (numbered) {
        const [number, ...rest] = block.split(' ');
        return <h3 key={block} className="mt-10 flex gap-3 rounded-2xl bg-[#edf8f1] px-5 py-4 text-xl font-semibold leading-8 text-[#173f42]"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#173f42] text-sm font-bold text-white">{number.replace('.', '')}</span><span>{rest.join(' ')}</span></h3>;
      }

      if (heading) {
        return <h3 key={block} className="mt-9 border-l-4 border-[#9fcf9a] pl-4 text-2xl font-semibold tracking-tight text-slate-950">{block}</h3>;
      }

      return <p key={block} className={`${indented ? 'ml-0 rounded-2xl border-l-4 border-slate-200 bg-slate-50 py-4 pl-5 pr-4 sm:ml-5' : ''} text-lg leading-8 text-slate-700`}>{block}</p>;
    })}
  </div>;
}

function ArticlePanel({ article, onBack }) {
  return <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200"><div className="bg-[#173f42] p-8 text-white"><button onClick={onBack} className="mb-6 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15">← Back to resources</button><p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9fcf9a]">{article.category}</p><h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{article.title}</h2><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-100">{article.text}</p></div><div className="grid gap-8 p-8 lg:grid-cols-[1fr_.38fr]"><main><ArticleBody body={article.body} /><div className="mt-8 rounded-[1.5rem] bg-[#edf8f1] p-6"><h3 className="text-xl font-semibold text-[#173f42]">A note about care</h3><p className="mt-2 leading-7 text-slate-700">This resource is educational and does not replace individualized medical advice.</p></div></main><aside className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6"><h3 className="text-lg font-semibold text-slate-950">Key takeaways</h3><div className="mt-4 space-y-3">{article.takeaways.map((t) => <div key={t} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2f8c85]" />{t}</div>)}</div><Button onClick={onBack} variant="outline" className="mt-6 w-full">Choose another article</Button></aside></div></article>;
}

export default function ResourcesClient() {
  const [article, setArticle] = useState(null);
  return <><PageHero eyebrow="Resources & FAQ" title="Learn, prepare, and get answers." subtitle="Educational resources and frequently asked questions in one place." /><Section><SectionHeading eyebrow="Commentary" title="Featured resources" subtitle="Click any resource to read the full article." />{article ? <ArticlePanel article={article} onBack={() => setArticle(null)} /> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{ARTICLES.map((a) => <button key={a.title} onClick={() => setArticle(a)} className="group h-full rounded-[1.75rem] border border-slate-200 bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2f8c85]">{a.category}</p><h3 className="mt-4 text-xl font-semibold text-slate-950">{a.title}</h3><p className="mt-3 leading-7 text-slate-600">{a.text}</p><div className="mt-6 inline-flex items-center text-sm font-semibold text-[#173f42]">Read full article <ArrowRight className="ml-2 h-4 w-4" /></div></button>)}</div>}</Section><Section className="bg-slate-50"><SectionHeading eyebrow="FAQ" title="Frequently asked questions" subtitle="These answers are visible on the page so patients and search engines can read them clearly." /><div className="mx-auto max-w-5xl space-y-10">{FAQ_GROUPS.map((group) => <div key={group.title}><h2 className="mb-4 text-2xl font-semibold text-[#173f42]">{group.title}</h2><div className="space-y-4">{group.items.map(([q, a]) => <article key={q} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="text-lg font-semibold text-slate-950">{q}</h3><p className="mt-3 leading-7 text-slate-700">{a}</p></article>)}</div></div>)}</div></Section></>;
}
