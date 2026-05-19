import ResourcesClient from '../../components/ResourcesClient';
import { FAQ_GROUPS } from '../../lib/faq';

export const metadata = { title: 'Resources & FAQ | Integrative Psychiatry' };

function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_GROUPS.flatMap((group) => group.items).map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer
      }
    }))
  };
}

export default function ResourcesPage() {
  return <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema()) }}
    />
    <ResourcesClient />
  </>;
}
