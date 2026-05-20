import ResourcesClient from '../../components/ResourcesClient';
import { FAQ_GROUPS } from '../../lib/faq';
import { fallbackArticles, groupFaqRows } from '../../lib/contentFallbacks';
import { getSupabaseServerClient } from '../../lib/supabasePublic';

export const metadata = { title: 'Resources & FAQ | Integrative Psychiatry' };
export const revalidate = 300;

async function loadResourcesContent() {
  const supabase = getSupabaseServerClient();
  const fallback = { articles: fallbackArticles(), faqGroups: FAQ_GROUPS };
  if (!supabase) return fallback;

  try {
    const [{ data: articleRows, error: articleError }, { data: faqRows, error: faqError }] = await Promise.all([
      supabase.from('articles').select('id,slug,title,category,excerpt,body,takeaways,sort_order').eq('published', true).order('sort_order', { ascending: true }).order('updated_at', { ascending: false }),
      supabase.from('faqs').select('id,category,question,answer,sort_order').eq('published', true).order('category', { ascending: true }).order('sort_order', { ascending: true }),
    ]);

    const articles = !articleError && articleRows?.length ? articleRows.map((row) => ({
      ...row,
      text: row.excerpt || '',
      takeaways: Array.isArray(row.takeaways) ? row.takeaways : [],
    })) : fallback.articles;

    const faqGroups = !faqError && faqRows?.length ? groupFaqRows(faqRows) : fallback.faqGroups;
    return { articles, faqGroups };
  } catch {
    return fallback;
  }
}

function buildFaqSchema(faqGroups) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqGroups.flatMap((group) => group.items).map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

export default async function ResourcesPage() {
  const { articles, faqGroups } = await loadResourcesContent();
  return <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(faqGroups)) }}
    />
    <ResourcesClient articles={articles} faqGroups={faqGroups} />
  </>;
}
