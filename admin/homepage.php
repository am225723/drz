<?php
require_once __DIR__ . '/_auth.php';
$user = require_admin();
$pdo = db();
$key = 'homepage';
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $title = clean_string($_POST['title'] ?? '', 255);
    $body = clean_string($_POST['body'] ?? '', 20000);
    $json = json_encode([
        'heroEyebrow' => clean_string($_POST['heroEyebrow'] ?? '', 255),
        'practiceTitle' => clean_string($_POST['practiceTitle'] ?? '', 255),
        'practiceBody' => clean_string($_POST['practiceBody'] ?? '', 20000),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $stmt = $pdo->prepare('INSERT INTO cms_content (content_key,title,body,content_json,updated_by) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE title=VALUES(title), body=VALUES(body), content_json=VALUES(content_json), updated_by=VALUES(updated_by)');
    $stmt->execute([$key, $title, $body, $json, $user['id']]);
    $message = 'Homepage updated.';
}
$stmt = $pdo->prepare('SELECT * FROM cms_content WHERE content_key = ?');
$stmt->execute([$key]);
$row = $stmt->fetch() ?: ['title'=>'','body'=>'','content_json'=>'{}'];
$json = $row['content_json'] ? json_decode($row['content_json'], true) : [];
admin_header('Edit Homepage');
?>
<?php if ($message): ?><div class="notice"><?= h($message) ?></div><?php endif; ?>
<div class="card"><form method="post"><input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>">
<div class="row"><label>Hero Eyebrow</label><input name="heroEyebrow" value="<?= h($json['heroEyebrow'] ?? '') ?>"></div>
<div class="row"><label>Hero Title</label><input name="title" value="<?= h($row['title']) ?>"></div>
<div class="row"><label>Hero Body</label><textarea name="body"><?= h($row['body']) ?></textarea></div>
<div class="row"><label>Practice Section Title</label><input name="practiceTitle" value="<?= h($json['practiceTitle'] ?? '') ?>"></div>
<div class="row"><label>Practice Section Body</label><textarea name="practiceBody"><?= h($json['practiceBody'] ?? '') ?></textarea></div>
<button>Save Homepage</button></form></div>
<?php admin_footer(); ?>
