const BASE_URL = 'https://site.docz.space';

const routes = [
  '/',
  '/about',
  '/services',
  '/services/psychotherapy',
  '/services/medication-management',
  '/resources',
  '/ketamine-therapy',
  '/fees-insurance',
  '/new-patients',
  '/current-patients',
  '/contact',
  '/privacy-policy',
  '/notice-of-privacy-practices',
  '/terms-of-use',
  '/emergency-disclaimer'
];

export default function sitemap() {
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route.includes('new-patients') || route.includes('contact') ? 0.8 : 0.7
  }));
}
