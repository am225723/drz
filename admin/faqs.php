<?php
require_once __DIR__ . '/_auth.php';
require_admin();
$pdo = db();
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? '';
    if ($action === 'delete') {
        $pdo->prepare('DELETE FROM cms_faqs WHERE id = ?')->execute([(int)$_POST['id']]);
        $message = 'FAQ deleted.';
    } else {
        $id = (int)($_POST['id'] ?? 0);
        $data = [
            clean_string($_POST['faq_group'] ?? '', 190),
            clean_string($_POST['question'] ?? '', 255),
            clean_string($_POST['answer'] ?? '', 10000),
            isset($_POST['is_published']) ? 1 : 0,
            (int)($_POST['sort_order'] ?? 0),
        ];
        if ($id > 0) {
            $stmt = $pdo->prepare('UPDATE cms_faqs SET faq_group=?, question=?, answer=?, is_published=?, sort_order=? WHERE id=?');
            $stmt->execute([...$data, $id]);
            $message = 'FAQ updated.';
        } else {
            $stmt = $pdo->prepare('INSERT INTO cms_faqs (faq_group, question, answer, is_published, sort_order) VALUES (?,?,?,?,?)');
            $stmt->execute($data);
            $message = 'FAQ added.';
        }
    }
}
$edit = null;
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare('SELECT * FROM cms_faqs WHERE id = ?');
    $stmt->execute([(int)$_GET['edit']]);
    $edit = $stmt->fetch();
}
$faqs = $pdo->query('SELECT * FROM cms_faqs ORDER BY sort_order ASC, id ASC')->fetchAll();
admin_header('FAQs');
?>
<?php if ($message): ?><div class="notice"><?= h($message) ?></div><?php endif; ?>
<div class="card"><h2><?= $edit ? 'Edit FAQ' : 'Add FAQ' ?></h2><form method="post"><input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>"><input type="hidden" name="id" value="<?= h((string)($edit['id'] ?? 0)) ?>">
<div class="grid"><div class="row"><label>FAQ Group</label><input name="faq_group" required value="<?= h($edit['faq_group'] ?? '') ?>" placeholder="Holistic Care for Mental Wellness"></div><div class="row"><label>Sort Order</label><input type="number" name="sort_order" value="<?= h((string)($edit['sort_order'] ?? 0)) ?>"></div></div>
<div class="row"><label>Question</label><input name="question" required value="<?= h($edit['question'] ?? '') ?>"></div>
<div class="row"><label>Answer</label><textarea name="answer" required><?= h($edit['answer'] ?? '') ?></textarea></div>
<div class="row"><label><input type="checkbox" name="is_published" <?= (($edit['is_published'] ?? 1) ? 'checked' : '') ?>> Published</label></div>
<div class="actions"><button>Save FAQ</button><?php if ($edit): ?><a class="button secondary" href="/admin/faqs.php">Cancel</a><?php endif; ?></div></form></div>
<div class="card"><h2>All FAQs</h2><table class="table"><tr><th>FAQ</th><th>Group</th><th>Status</th><th></th></tr><?php foreach ($faqs as $f): ?><tr><td><strong><?= h($f['question']) ?></strong><br><span class="muted"><?= h(mb_substr($f['answer'],0,140)) ?></span></td><td><?= h($f['faq_group']) ?></td><td><span class="pill"><?= $f['is_published'] ? 'Published' : 'Draft' ?></span></td><td><a class="button secondary" href="?edit=<?= (int)$f['id'] ?>">Edit</a><form method="post" style="display:inline" onsubmit="return confirm('Delete this FAQ?')"><input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>"><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$f['id'] ?>"><button class="danger">Delete</button></form></td></tr><?php endforeach; ?></table></div>
<?php admin_footer(); ?>
