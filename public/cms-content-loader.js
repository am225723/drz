(() => {
  let cmsData = null;
  let loading = false;

  function escapeHtml(text) {
    return String(text ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  async function loadCms() {
    if (cmsData || loading) return cmsData;
    loading = true;
    try {
      const response = await fetch('/api/content.php?type=all', { credentials: 'same-origin' });
      const result = await response.json();
      if (result && result.ok) cmsData = result.data;
    } catch (error) {
      console.info('CMS content API unavailable; using bundled site content.', error);
    } finally {
      loading = false;
    }
    return cmsData;
  }

  function pageTitleMatches(pattern) {
    return Array.from(document.querySelectorAll('h1')).some((node) => pattern.test(node.textContent || ''));
  }

  function updateTextIfFound(selector, value) {
    if (!value) return;
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function applyHomepage(data) {
    if (!pageTitleMatches(/Holistic psychiatry rooted/i)) return;
    const home = data.content && data.content.homepage;
    if (!home) return;
    const json = home.json || {};
    const h1 = document.querySelector('h1');
    if (h1 && home.title) h1.textContent = home.title;
    const heroP = h1 && h1.parentElement ? h1.parentElement.querySelector('p.mt-6') : null;
    if (heroP && home.body) heroP.textContent = home.body;
    if (json.heroEyebrow) {
      const eyebrow = Array.from(document.querySelectorAll('div, p')).find((node) => /Board-certified psychiatry/i.test(node.textContent || ''));
      if (eyebrow) eyebrow.textContent = json.heroEyebrow;
    }
    const practiceHeading = Array.from(document.querySelectorAll('h2')).find((node) => /A wider lens/i.test(node.textContent || ''));
    if (practiceHeading && json.practiceTitle) practiceHeading.textContent = json.practiceTitle;
    if (practiceHeading && json.practiceBody) {
      const p = practiceHeading.parentElement && practiceHeading.parentElement.querySelector('p');
      if (p) p.textContent = json.practiceBody;
    }
  }

  function applySettings(data) {
    const settings = data.content && data.content.settings && data.content.settings.json;
    if (!settings) return;
    document.querySelectorAll('footer p, header p').forEach((node) => {
      node.textContent = node.textContent
        .replace(/Integrative Psychiatry/g, settings.practiceName || 'Integrative Psychiatry')
        .replace(/Douglas Zelisko, MD/g, settings.doctor || 'Douglas Zelisko, MD')
        .replace(/860-615-3629/g, settings.phone || '860-615-3629')
        .replace(/support@drzelisko.com/g, settings.email || 'support@drzelisko.com')
        .replace(/45 South Main Street, Suite 111, West Hartford, CT 06107/g, settings.address || '45 South Main Street, Suite 111, West Hartford, CT 06107');
    });
  }

  function applyServices(data) {
    if (!pageTitleMatches(/Comprehensive care solutions/i) && !pageTitleMatches(/Holistic psychiatry rooted/i)) return;
    if (!data.services || !data.services.length) return;
    const serviceHeading = Array.from(document.querySelectorAll('h2')).find((node) => /Comprehensive care solutions/i.test(node.textContent || ''));
    const section = serviceHeading && serviceHeading.closest('section');
    if (!section || section.dataset.cmsServicesApplied === 'true') return;
    const grid = section.querySelector('.grid');
    if (!grid) return;
    section.dataset.cmsServicesApplied = 'true';
    grid.innerHTML = data.services.map((service) => `
      <div class="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
        <div class="p-7">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf8f1] text-[#173f42]">✓</div>
          <h3 class="mt-5 text-xl font-semibold text-slate-950">${escapeHtml(service.title)}</h3>
          <p class="mt-3 leading-7 text-slate-600">${escapeHtml(service.description)}</p>
        </div>
      </div>
    `).join('');
  }

  function renderArticles(data) {
    if (!pageTitleMatches(/Learn, prepare, and get answers/i)) return;
    if (!data.articles || !data.articles.length) return;
    const featured = Array.from(document.querySelectorAll('h2')).find((node) => /Featured resources/i.test(node.textContent || ''));
    const section = featured && featured.closest('section');
    if (!section || section.dataset.cmsArticlesApplied === 'true') return;
    const grid = section.querySelector('.grid');
    if (!grid) return;
    section.dataset.cmsArticlesApplied = 'true';
    grid.innerHTML = data.articles.map((article) => `
      <div class="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm p-7 rz-resource-clickable" role="button" tabindex="0" data-cms-article="${escapeHtml(article.slug)}">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#2f8c85]">${escapeHtml(article.category)}</p>
        <h3 class="mt-4 text-xl font-semibold text-slate-950">${escapeHtml(article.title)}</h3>
        <p class="mt-3 leading-7 text-slate-600">${escapeHtml(article.summary)}</p>
      </div>
    `).join('');
    grid.querySelectorAll('[data-cms-article]').forEach((card) => {
      card.addEventListener('click', () => openCmsArticle(data.articles.find((a) => a.slug === card.dataset.cmsArticle)));
      card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCmsArticle(data.articles.find((a) => a.slug === card.dataset.cmsArticle)); } });
    });
  }

  function openCmsArticle(article) {
    if (!article) return;
    const overlay = document.createElement('div');
    const takeaways = Array.isArray(article.takeaways) ? article.takeaways : [];
    overlay.className = 'rz-article-overlay';
    overlay.innerHTML = `<div class="rz-article-panel"><div class="rz-article-hero"><button class="rz-article-close" type="button">← Back to resources</button><p class="rz-article-kicker">${escapeHtml(article.category)}</p><h2>${escapeHtml(article.title)}</h2><p>${escapeHtml(article.summary)}</p></div><div class="rz-article-body"><main><section><p>${escapeHtml(article.body).replace(/\n/g, '<br>')}</p></section><div class="rz-care-note"><h3>A note about care</h3><p>This resource is educational and does not replace individualized medical advice.</p></div></main><aside><h3>Key takeaways</h3>${takeaways.map((item) => `<div class="rz-takeaway"><span>✓</span><p>${escapeHtml(item)}</p></div>`).join('')}</aside></div></div>`;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    const close = () => { overlay.remove(); document.body.style.overflow = ''; };
    overlay.querySelector('.rz-article-close').addEventListener('click', close);
    overlay.addEventListener('click', (event) => { if (event.target === overlay) close(); });
  }

  function renderFaqs(data) {
    if (!pageTitleMatches(/Learn, prepare, and get answers/i)) return;
    if (!data.faqGroups || !data.faqGroups.length) return;
    const faqHeading = Array.from(document.querySelectorAll('h2')).find((node) => /Frequently asked questions/i.test(node.textContent || ''));
    const section = faqHeading && faqHeading.closest('section');
    if (!section || section.dataset.cmsFaqsApplied === 'true') return;
    const container = section.querySelector('.mx-auto.max-w-5xl');
    if (!container) return;
    section.dataset.cmsFaqsApplied = 'true';
    container.innerHTML = data.faqGroups.map((group, gi) => `<div><h2 class="mb-4 text-2xl font-semibold text-[#173f42]">${escapeHtml(group.title)}</h2><div class="space-y-3">${group.items.map((item, i) => `<div class="rounded-2xl border border-slate-200 bg-white shadow-sm"><button class="cms-faq-button flex w-full items-center justify-between gap-4 p-5 text-left" type="button"><span class="text-lg font-semibold text-slate-950">${escapeHtml(item.question)}</span><span>⌄</span></button><p class="cms-faq-answer px-5 pb-5 leading-7 text-slate-700" style="display:${gi === 0 && i === 0 ? 'block' : 'none'}">${escapeHtml(item.answer)}</p></div>`).join('')}</div></div>`).join('');
    container.querySelectorAll('.cms-faq-button').forEach((button) => button.addEventListener('click', () => {
      const answer = button.parentElement.querySelector('.cms-faq-answer');
      answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
    }));
  }

  async function applyCms() {
    const data = await loadCms();
    if (!data) return;
    applySettings(data);
    applyHomepage(data);
    applyServices(data);
    renderArticles(data);
    renderFaqs(data);
  }

  const observer = new MutationObserver(() => applyCms());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyCms);
  else applyCms();
})();
