<?php
require_once __DIR__ . '/_auth.php';
$user = require_admin();
$pdo = db();
$counts = [
    'articles' => (int)$pdo->query('SELECT COUNT(*) FROM cms_articles')->fetchColumn(),
    'faqs' => (int)$pdo->query('SELECT COUNT(*) FROM cms_faqs')->fetchColumn(),
    'services' => (int)$pdo->query('SELECT COUNT(*) FROM cms_services')->fetchColumn(),
    'submissions' => (int)$pdo->query("SELECT COUNT(*) FROM contact_submissions WHERE status = 'new'")->fetchColumn(),
];
admin_header('Dashboard');
?>
<div class="notice">Welcome, <?= h($user['name'] ?: $user['email']) ?>. Use this dashboard to edit website content and review contact submissions.</div>
<div class="grid">
  <div class="card"><h2>Articles</h2><p class="muted"><?= $counts['articles'] ?> total</p><a class="button" href="/admin/articles.php">Manage Articles</a></div>
  <div class="card"><h2>FAQs</h2><p class="muted"><?= $counts['faqs'] ?> total</p><a class="button" href="/admin/faqs.php">Manage FAQs</a></div>
  <div class="card"><h2>Services</h2><p class="muted"><?= $counts['services'] ?> total</p><a class="button" href="/admin/services.php">Manage Services</a></div>
  <div class="card"><h2>New Submissions</h2><p class="muted"><?= $counts['submissions'] ?> new</p><a class="button" href="/admin/submissions.php">Review Submissions</a></div>
</div>
<div class="card"><h2>Frontend API</h2><p>The public website can fetch CMS content from <code>/api/content.php?type=all</code>.</p></div>
<?php admin_footer(); ?>
