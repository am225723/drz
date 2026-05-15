(() => {
  const articles = {
    'What Is Holistic Psychiatry?': {
      category: 'Whole-person care',
      intro: 'A practical guide to psychiatry that considers mind, body, lifestyle, medical context, values, and meaning.',
      sections: [
        ['A broader lens', 'Holistic psychiatry begins with the idea that mental health symptoms are real, important, and worthy of careful treatment, while also recognizing that symptoms rarely exist in isolation. Mood, focus, anxiety, sleep, nutrition, movement, relationships, medical history, trauma, and personal meaning can all shape how someone feels and functions.'],
        ['What treatment can include', 'Care may include psychotherapy, medication management, lifestyle recommendations, supplement review, sleep work, stress-reduction strategies, and collaboration with other clinicians. The goal is not to replace evidence-based psychiatry, but to place it within a more complete understanding of the person.'],
        ['Why it matters', 'A whole-person approach can be especially helpful when treatment has felt fragmented, overly brief, or too focused on symptoms alone. The aim is a treatment plan that is clinically grounded, practical, and connected to the life you are trying to build.']
      ],
      takeaways: ['Looks beyond symptoms alone', 'Combines conventional and complementary tools when appropriate', 'Emphasizes individualized treatment planning']
    },
    'Beyond Medication: A Holistic View on Treating ADHD': {
      category: 'ADHD',
      intro: 'A whole-person view of ADHD that looks beyond the pill to sleep, nutrition, exercise, gut health, and behavioral strategies.',
      sections: [
        ['ADHD is more than attention', 'Adult ADHD can affect organization, motivation, emotional regulation, time management, sleep, self-esteem, and relationships. A careful evaluation also considers anxiety, trauma, depression, substance use, sleep disruption, and medical factors that can mimic or worsen attention problems.'],
        ['Medication and context', 'Medication may be useful for some people, but it works best when it is part of a broader plan. Sleep, movement, nutrition, structure, behavioral strategies, and therapy can all influence how manageable ADHD symptoms feel day to day.'],
        ['Building a realistic plan', 'Treatment often focuses on reducing shame, creating workable systems, improving emotional flexibility, and identifying the supports that make follow-through easier. The goal is not perfection; it is a life that works better.']
      ],
      takeaways: ['Clarify diagnosis before treating', 'Address sleep and stress alongside medication decisions', 'Create practical systems for daily life']
    },
    'Feeling Anxious? 5 Integrative Approaches to Find Calm': {
      category: 'Anxiety',
      intro: 'Education on integrative strategies that may support calm alongside appropriate psychiatric care.',
      sections: [
        ['Understand the signal', 'Anxiety is not just a problem to suppress. It can be a signal from the nervous system, a response to stress, a learned protective pattern, a medical issue, or a reflection of unresolved emotional conflict. Understanding what anxiety is doing is often the first step.'],
        ['Five supportive approaches', 'Integrative care may explore breathing and nervous-system regulation, sleep consistency, movement, nutrition and caffeine intake, mindfulness practices, therapy, and medication when appropriate. These tools are strongest when matched to the individual rather than used as generic advice.'],
        ['When to seek help', 'If anxiety is interfering with relationships, work, sleep, decision-making, or your ability to feel present, a comprehensive psychiatric evaluation can help clarify what is driving it and what kind of support may help.']
      ],
      takeaways: ['Anxiety has context', 'Regulation skills and lifestyle changes can support treatment', 'Medication and therapy may both have a role']
    },
    'What to Expect at Your First Psychiatric Evaluation': {
      category: 'Getting started',
      intro: 'How an in-depth intake explores your story, symptoms, health context, and treatment goals.',
      sections: [
        ['The purpose of the first visit', 'A psychiatric evaluation is a chance to understand the full picture before making treatment decisions. It is not only about assigning a diagnosis; it is about learning your history, current concerns, medical context, past treatment, relationships, lifestyle, and goals.'],
        ['What may be discussed', 'Topics may include symptoms, sleep, appetite, energy, mood, anxiety, focus, trauma history, substance use, medications, supplements, family history, therapy history, medical conditions, and what you hope will be different.'],
        ['What happens next', 'After the evaluation, treatment planning may include psychotherapy, medication options, lifestyle recommendations, lab or medical follow-up, referrals, or additional assessment. The plan should be understandable and collaborative.']
      ],
      takeaways: ['Expect depth and context', 'Bring medication and treatment history if possible', 'The goal is a personalized treatment plan']
    },
    'Medication and Psychotherapy Together': {
      category: 'Treatment planning',
      intro: 'Why medication management and therapy can complement each other in a thoughtful plan.',
      sections: [
        ['Different tools, different jobs', 'Medication can help reduce symptom intensity, improve sleep, stabilize mood, or increase the capacity to engage in life. Psychotherapy can help explore patterns, meanings, relationships, grief, trauma, and the internal conflicts that often sit beneath symptoms.'],
        ['Why integration helps', 'When medication management and psychotherapy are disconnected, care can feel fragmented. An integrated approach allows medication decisions to be informed by the person’s lived experience, not just symptom checklists.'],
        ['A collaborative process', 'Treatment is adjusted over time based on what helps, what causes side effects, what feels meaningful, and what goals are most important. The best plan is both clinically sound and personally workable.']
      ],
      takeaways: ['Medication and therapy can work together', 'Treatment should evolve over time', 'Symptom relief and deeper change can both matter']
    },
    'Ketamine-Assisted Psychotherapy: What Patients Should Know': {
      category: 'Ketamine therapy',
      intro: 'A careful overview of screening, preparation, safety, and integration.',
      sections: [
        ['Not a one-size-fits-all treatment', 'Ketamine-assisted psychotherapy may be considered for selected patients after careful psychiatric evaluation, medical screening, informed consent, and discussion of risks, alternatives, and expectations. It is not appropriate for everyone.'],
        ['Preparation and monitoring', 'Responsible care includes preparation before treatment, monitoring during treatment, and clear follow-up. Safety, medical history, psychiatric history, medications, and support systems all matter.'],
        ['Integration matters', 'The psychotherapy component helps patients make sense of the experience and connect insights to daily life. Without integration, the experience may feel powerful but disconnected from lasting change.']
      ],
      takeaways: ['Requires careful screening', 'Preparation and monitoring are essential', 'Integration connects the experience to real life']
    }
  };

  function escapeHtml(text) {
    return String(text).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function buildArticle(title, article) {
    return `
      <div class="rz-article-overlay" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
        <div class="rz-article-panel">
          <div class="rz-article-hero">
            <button class="rz-article-close" type="button">← Back to resources</button>
            <p class="rz-article-kicker">${escapeHtml(article.category)}</p>
            <h2>${escapeHtml(title)}</h2>
            <p>${escapeHtml(article.intro)}</p>
          </div>
          <div class="rz-article-body">
            <main>
              ${article.sections.map(([heading, body]) => `<section><h3>${escapeHtml(heading)}</h3><p>${escapeHtml(body)}</p></section>`).join('')}
              <div class="rz-care-note"><h3>A note about care</h3><p>This resource is educational and does not replace individualized medical advice. A comprehensive evaluation can help determine what approach fits your specific history, risks, and goals.</p></div>
            </main>
            <aside>
              <h3>Key takeaways</h3>
              ${article.takeaways.map((item) => `<div class="rz-takeaway"><span>✓</span><p>${escapeHtml(item)}</p></div>`).join('')}
            </aside>
          </div>
        </div>
      </div>`;
  }

  function ensureStyles() {
    if (document.getElementById('rz-resource-expander-styles')) return;
    const style = document.createElement('style');
    style.id = 'rz-resource-expander-styles';
    style.textContent = `
      .rz-resource-clickable{cursor:pointer;position:relative;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}.rz-resource-clickable:hover{transform:translateY(-5px);box-shadow:0 24px 50px rgba(15,23,42,.14);border-color:#9fcf9a}.rz-resource-clickable:after{content:'Read full article →';display:inline-flex;margin-top:1rem;font-weight:700;color:#173f42}.rz-resource-clickable:focus{outline:3px solid #9fcf9a;outline-offset:4px}.rz-article-overlay{position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,.55);padding:24px;overflow:auto;backdrop-filter:blur(10px)}.rz-article-panel{max-width:1120px;margin:0 auto;background:white;border-radius:32px;overflow:hidden;box-shadow:0 35px 80px rgba(15,23,42,.35)}.rz-article-hero{background:#173f42;color:white;padding:36px}.rz-article-close{border:0;background:rgba(255,255,255,.12);color:white;border-radius:999px;padding:10px 16px;font-weight:700;margin-bottom:24px;cursor:pointer}.rz-article-close:hover{background:rgba(255,255,255,.18)}.rz-article-kicker{text-transform:uppercase;letter-spacing:.22em;color:#9fcf9a;font-size:.8rem;font-weight:800}.rz-article-hero h2{font-size:clamp(2rem,4vw,3.25rem);line-height:1.05;margin:12px 0 16px}.rz-article-hero p{max-width:760px;font-size:1.08rem;line-height:1.75;color:#f8fafc}.rz-article-body{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:32px;padding:36px}.rz-article-body section{margin-bottom:30px}.rz-article-body h3{color:#0f172a;font-size:1.45rem;margin:0 0 10px}.rz-article-body p{color:#475569;line-height:1.8;font-size:1.04rem}.rz-care-note{background:#edf8f1;border-radius:24px;padding:24px}.rz-article-body aside{background:#f8fafc;border:1px solid #e2e8f0;border-radius:24px;padding:24px;height:max-content;position:sticky;top:24px}.rz-takeaway{display:flex;gap:12px;margin-top:14px;color:#475569}.rz-takeaway span{display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:999px;background:#e5f5e7;color:#173f42;font-weight:900;flex:0 0 24px}@media(max-width:900px){.rz-article-body{grid-template-columns:1fr;padding:24px}.rz-article-body aside{position:static}.rz-article-overlay{padding:12px}.rz-article-hero{padding:28px}}
    `;
    document.head.appendChild(style);
  }

  function enhanceCards() {
    ensureStyles();
    const headings = Array.from(document.querySelectorAll('h3'));
    headings.forEach((heading) => {
      const title = heading.textContent && heading.textContent.trim();
      const article = articles[title];
      if (!article) return;
      const card = heading.closest('.rounded-\\[1\\.75rem\\]') || heading.closest('[class*="rounded"]');
      if (!card || card.dataset.resourceEnhanced === 'true') return;
      card.dataset.resourceEnhanced = 'true';
      card.classList.add('rz-resource-clickable');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Read full article: ${title}`);
      const open = () => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = buildArticle(title, article);
        document.body.appendChild(wrapper.firstElementChild);
        document.body.style.overflow = 'hidden';
        const overlay = document.querySelector('.rz-article-overlay');
        const close = () => { overlay.remove(); document.body.style.overflow = ''; };
        overlay.querySelector('.rz-article-close').addEventListener('click', close);
        overlay.addEventListener('click', (event) => { if (event.target === overlay) close(); });
        document.addEventListener('keydown', function esc(event) { if (event.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
      };
      card.addEventListener('click', open);
      card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
    });
  }

  const observer = new MutationObserver(enhanceCards);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhanceCards);
  else enhanceCards();
})();
