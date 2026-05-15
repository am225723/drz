<?php
declare(strict_types=1);
require __DIR__ . '/db.php';

try {
    $pdo = db();
    $type = $_GET['type'] ?? 'all';

    $payload = [];
    if ($type === 'all' || $type === 'content') {
        $stmt = $pdo->query('SELECT content_key, title, body, content_json, updated_at FROM cms_content ORDER BY content_key ASC');
        $content = [];
        foreach ($stmt->fetchAll() as $row) {
            $content[$row['content_key']] = [
                'title' => $row['title'],
                'body' => $row['body'],
                'json' => $row['content_json'] ? json_decode($row['content_json'], true) : null,
                'updatedAt' => $row['updated_at'],
            ];
        }
        $payload['content'] = $content;
    }

    if ($type === 'all' || $type === 'articles') {
        $stmt = $pdo->query('SELECT slug, title, category, summary, body, takeaways, updated_at FROM cms_articles WHERE is_published = 1 ORDER BY sort_order ASC, updated_at DESC');
        $payload['articles'] = array_map(fn($row) => [
            'slug' => $row['slug'],
            'title' => $row['title'],
            'category' => $row['category'],
            'summary' => $row['summary'],
            'body' => $row['body'],
            'takeaways' => $row['takeaways'] ? json_decode($row['takeaways'], true) : [],
            'updatedAt' => $row['updated_at'],
        ], $stmt->fetchAll());
    }

    if ($type === 'all' || $type === 'faqs') {
        $stmt = $pdo->query('SELECT faq_group, question, answer FROM cms_faqs WHERE is_published = 1 ORDER BY sort_order ASC, id ASC');
        $groups = [];
        foreach ($stmt->fetchAll() as $row) {
            $group = $row['faq_group'];
            if (!isset($groups[$group])) $groups[$group] = ['title' => $group, 'items' => []];
            $groups[$group]['items'][] = ['question' => $row['question'], 'answer' => $row['answer']];
        }
        $payload['faqGroups'] = array_values($groups);
    }

    if ($type === 'all' || $type === 'services') {
        $stmt = $pdo->query('SELECT title, description, icon FROM cms_services WHERE is_published = 1 ORDER BY sort_order ASC, id ASC');
        $payload['services'] = $stmt->fetchAll();
    }

    json_response(['ok' => true, 'data' => $payload]);
} catch (Throwable $error) {
    error_log('Content API error: ' . $error->getMessage());
    json_response(['ok' => false, 'error' => 'Unable to load content'], 500);
}
