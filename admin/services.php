<?php
require_once __DIR__ . '/_auth.php';
require_admin();
$pdo = db();
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? '';
    if ($action === 'delete') {
        $pdo->prepare('DELETE FROM cms_services WHERE id = ?')->execute([(int)$_POST['id']]);
        $message = 'Service deleted.';
    } else {
        $id = (int)($_POST['id'] ?? 0);
        $data = [
            clean_string($_POST['title'] ?? '', 255),
            clean_string($_POST['description'] ?? '', 5000),
            clean_string($_POST['icon'] ?? '', 80),
            isset($_POST['is_published']) ? 1 : 0,
            (int)($_POST['sort_order'] ?? 0),
        ];
        if ($id > 0) {
            $stmt = $pdo->prepare('UPDATE cms_services SET title=?, description=?, icon=?, is_published=?, sort_order=? WHERE id=?');
            $stmt->execute([...$data, $id]);
            $message = 'Service updated.';
        } else {
            $stmt = $pdo->prepare('INSERT INTO cms_services (title, description, icon, is_published, sort_order) VALUES (?,?,?,?,?)');
            $stmt->execute($data);
            $message = 'Service added.';
        }
    }
}
$edit = null;
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare('SELECT * FROM cms_services WHERE id = ?');
    $stmt->execute([(int)$_GET['edit']]);
    $edit = $stmt->fetch();
}
$services = $pdo->query('SELECT * FROM cms_services ORDER BY sort_order ASC, id ASC')->fetchAll();
admin_header('Services');
?>
<?php if ($message): ?><div class="notice"><?= h($message) ?></div><?php endif; ?>
<div class="card"><h2><?= $edit ? 'Edit Service' : 'Add Service' ?></h2><form method="post"><input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>"><input type="hidden" name="id" value="<?= h((string)($edit['id'] ?? 0)) ?>">
<div class="grid"><div class="row"><label>Title</label><input name="title" required value="<?= h($edit['title'] ?? '') ?>"></div><div class="row"><label>Icon</label><input name="icon" value="<?= h($edit['icon'] ?? '') ?>" placeholder="FileText, Stethoscope, Leaf"></div></div>
<div class="row"><label>Description</label><textarea name="description" required><?= h($edit['description'] ?? '') ?></textarea></div>
<div class="grid"><div class="row"><label>Sort Order</label><input type="number" name="sort_order" value="<?= h((string)($edit['sort_order'] ?? 0)) ?>"></div><div class="row"><label><input type="checkbox" name="is_published" <?= (($edit['is_published'] ?? 1) ? 'checked' : '') ?>> Published</label></div></div>
<div class="actions"><button>Save Service</button><?php if ($edit): ?><a class="button secondary" href="/admin/services.php">Cancel</a><?php endif; ?></div></form></div>
<div class="card"><h2>All Services</h2><table class="table"><tr><th>Title</th><th>Status</th><th>Order</th><th></th></tr><?php foreach ($services as $s): ?><tr><td><strong><?= h($s['title']) ?></strong><br><span class="muted"><?= h(mb_substr($s['description'],0,120)) ?></span></td><td><span class="pill"><?= $s['is_published'] ? 'Published' : 'Draft' ?></span></td><td><?= h((string)$s['sort_order']) ?></td><td><a class="button secondary" href="?edit=<?= (int)$s['id'] ?>">Edit</a><form method="post" style="display:inline" onsubmit="return confirm('Delete this service?')"><input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>"><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$s['id'] ?>"><button class="danger">Delete</button></form></td></tr><?php endforeach; ?></table></div>
<?php admin_footer(); ?>
