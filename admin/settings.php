<?php
require_once __DIR__ . '/_auth.php';
$user = require_admin();
$pdo = db();
$message = '';
$key = 'settings';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $settings = [
        'practiceName' => clean_string($_POST['practiceName'] ?? '', 255),
        'doctor' => clean_string($_POST['doctor'] ?? '', 255),
        'address' => clean_string($_POST['address'] ?? '', 255),
        'phone' => clean_string($_POST['phone'] ?? '', 80),
        'email' => clean_string($_POST['email'] ?? '', 190),
        'portalUrl' => clean_string($_POST['portalUrl'] ?? '', 255),
    ];
    $stmt = $pdo->prepare('INSERT INTO cms_content (content_key,title,body,content_json,updated_by) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE title=VALUES(title), body=VALUES(body), content_json=VALUES(content_json), updated_by=VALUES(updated_by)');
    $stmt->execute([$key, 'Practice Settings', '', json_encode($settings, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), $user['id']]);
    $message = 'Settings updated.';
}
$stmt = $pdo->prepare('SELECT * FROM cms_content WHERE content_key = ?');
$stmt->execute([$key]);
$row = $stmt->fetch() ?: ['content_json'=>'{}'];
$s = $row['content_json'] ? json_decode($row['content_json'], true) : [];
admin_header('Practice Settings');
?>
<?php if ($message): ?><div class="notice"><?= h($message) ?></div><?php endif; ?>
<div class="card"><form method="post"><input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>">
<div class="grid">
<div class="row"><label>Practice Name</label><input name="practiceName" value="<?= h($s['practiceName'] ?? '') ?>"></div>
<div class="row"><label>Doctor Name</label><input name="doctor" value="<?= h($s['doctor'] ?? '') ?>"></div>
<div class="row"><label>Phone</label><input name="phone" value="<?= h($s['phone'] ?? '') ?>"></div>
<div class="row"><label>Email</label><input name="email" value="<?= h($s['email'] ?? '') ?>"></div>
</div>
<div class="row"><label>Address</label><input name="address" value="<?= h($s['address'] ?? '') ?>"></div>
<div class="row"><label>Patient Portal URL</label><input name="portalUrl" value="<?= h($s['portalUrl'] ?? '') ?>"></div>
<button>Save Settings</button></form></div>
<?php admin_footer(); ?>
