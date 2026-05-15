<?php
require_once __DIR__ . '/_auth.php';
require_admin();
$pdo = db();
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? '';
    if ($action === 'delete') {
        $pdo->prepare('DELETE FROM cms_articles WHERE id = ?')->execute([(int)$_POST['id']]);
        $message = 'Article deleted.';
    } else {
        $id = (int)($_POST['id'] ?? 0);
        $title = clean_string($_POST['title'] ?? '', 255);
        $slug = clean_string($_POST['slug'] ?? '', 190) ?: slugify($title);
        $takeaways = array_values(array_filter(array_map('trim', explode("\n", (string)($_POST['takeaways'] ?? '')))) ;
        $data = [
            $slug,
            $title,
            clean_string($_POST['category'] ?? '', 190),
            clean_string($_POST['summary'] ?? '', 2000),
            clean_string($_POST['body'] ?? '', 50000),
            json_encode($takeaways, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            isset($_POST['is_published']) ? 1 : 0,
            (int)($_POST['sort_order'] ?? 0),
        ];
        if ($id > 0) {
            $stmt = $pdo->prepare('UPDATE cms_articles SET slug=?, title=?, category=?, summary=?, body=?, takeaways=?, is_published=?, sort_order=? WHERE id=?');
            $stmt->execute([...$data, $id]);
            $message = 'Article updated.';
        } else {
            $stmt = $pdo->prepare('INSERT INTO cms_articles (slug,title,category,summary,body,takeaways,is_published,sort_order) VALUES (?,?,?,?,?,?,?,?)');
            $stmt->execute($data);
            $message = 'Article added.';
        }
    }
}
$edit = null;
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare('SELECT * FROM cms_articles WHERE id = ?');
    $stmt->execute([(int)$_GET['edit']]);
    $edit = $stmt->fetch();
}
$takeawaysText = '';
if ($edit && $edit['takeaways']) {
    $decoded = json_decode($edit['takeaways'], true);
    $takeawaysText = is_array($decoded) ? implode("\n", $decoded) : '';
}
$articles = $pdo->query('SELECT * FROM cms_articles ORDER BY sort_order ASC, updated_at DESC')->fetchAll();
admin_header('Articles');
?>
<?php if ($message): ?><div class="notice"><?= h($message) ?></div><?php endif; ?>
<div class="card"><h2><?= $edit ? 'Edit Article' : 'Add Article' ?></h2><form method="post"><input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>"><input type="hidden" name="id" value="<?= h((string)($edit['id'] ?? 0)) ?>">
<div class="grid"><div class="row"><label>Title</label><input name="title" required value="<?= h($edit['title'] ?? '') ?>"></div><div class="row"><label>Slug</label><input name="slug" value="<?= h($edit['slug'] ?? '') ?>" placeholder="auto-generated if blank"></div></div>
<div class="grid"><div class="row"><label>Category</label><input name="category" required value="<?= h($edit['category'] ?? '') ?>"></div><div class="row"><label>Sort Order</label><input type="number" name="sort_order" value="<?= h((string)($edit['sort_order'] ?? 0)) ?>"></div></div>
<div class="row"><label>Summary</label><textarea name="summary" required><?= h($edit['summary'] ?? '') ?></textarea></div>
<div class="row"><label>Full Article Body</label><textarea name="body" required style="min-height:300px"><?= h($edit['body'] ?? '') ?></textarea></div>
<div class="row"><label>Takeaways — one per line</label><textarea name="takeaways"><?= h($takeawaysText) ?></textarea></div>
<div class="row"><label><input type="checkbox" name="is_published" <?= (($edit['is_published'] ?? 1) ? 'checked' : '') ?>> Published</label></div>
<div class="actions"><button>Save Article</button><?php if ($edit): ?><a class="button secondary" href="/admin/articles.php">Cancel</a><?php endif; ?></div></form></div>
<div class="card"><h2>All Articles</h2><table class="table"><tr><th>Article</th><th>Status</th><th>Order</th><th></th></tr><?php foreach ($articles as $a): ?><tr><td><strong><?= h($a['title']) ?></strong><br><span class="muted"><?= h($a['category']) ?> · <?= h($a['slug']) ?></span></td><td><span class="pill"><?= $a['is_published'] ? 'Published' : 'Draft' ?></span></td><td><?= h((string)$a['sort_order']) ?></td><td><a class="button secondary" href="?edit=<?= (int)$a['id'] ?>">Edit</a><form method="post" style="display:inline" onsubmit="return confirm('Delete this article?')"><input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>"><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$a['id'] ?>"><button class="danger">Delete</button></form></td></tr><?php endforeach; ?></table></div>
<?php admin_footer(); ?>
