import { ARTICLES } from './content';
import { FAQ_GROUPS } from './faq';

export function fallbackArticles() {
  return ARTICLES.map((article, index) => ({
    id: article.title,
    slug: article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    title: article.title,
    category: article.category,
    excerpt: article.text,
    body: article.body,
    takeaways: article.takeaways || [],
    published: true,
    sort_order: index,
  }));
}

export function fallbackFaqGroups() {
  return FAQ_GROUPS;
}

export function groupFaqRows(rows) {
  const groups = [];
  const byCategory = new Map();
  rows.forEach((row) => {
    const title = row.category || 'General';
    if (!byCategory.has(title)) {
      const group = { title, items: [] };
      byCategory.set(title, group);
      groups.push(group);
    }
    byCategory.get(title).items.push([row.question, row.answer]);
  });
  return groups;
}
