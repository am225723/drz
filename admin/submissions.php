<?php
require_once __DIR__ . '/_auth.php';
require_admin();
$pdo = db();
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $id = (int)($_POST['id'] ?? 0);
    $status = $_POST['status'] ?? 'reviewed';
    if (!in_array($status, ['new','reviewed','archived'], true)) $status = 'reviewed';
    $notes = clean_string($_POST['staff_notes'] ?? '', 10000);
    $stmt = $pdo->prepare('UPDATE contact_submissions SET status = ?, staff_notes = ? WHERE id = ?');
    $stmt->execute([$status, $notes, $id]);
    $message = 'Submission updated.';
}
$selected = null;
if (isset($_GET['id'])) {
    $stmt = $pdo->prepare('SELECT * FROM contact_submissions WHERE id = ?');
    $stmt->execute([(int)$_GET['id']]);
    $selected = $stmt->fetch();
}
$statusFilter = $_GET['status'] ?? 'new';
if (!in_array($statusFilter, ['new','reviewed','archived','all'], true)) $statusFilter = 'new';
if ($statusFilter === 'all') {
    $stmt = $pdo->query('SELECT id, full_name, preferred_name, email, mobile_phone, reason_for_care, visit_type, status, created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 200');
} else {
    $stmt = $pdo->prepare('SELECT id, full_name, preferred_name, email, mobile_phone, reason_for_care, visit_type, status, created_at FROM contact_submissions WHERE status = ? ORDER BY created_at DESC LIMIT 200');
    $stmt->execute([$statusFilter]);
}
$submissions = $stmt->fetchAll();
function decode_json_field($value): string {
    if (!$value) return '';
    $decoded = json_decode($value, true);
    if (is_array($decoded)) return implode(', ', $decoded);
    return (string)$value;
}
admin_header('Contact Submissions');
?>
<?php if ($message): ?><div class="notice"><?= h($message) ?></div><?php endif; ?>
<div class="notice error"><strong>Privacy reminder:</strong> review submissions only on approved devices and networks. Do not copy PHI into unsecured email, chat, or non-BAA systems.</div>
<div class="actions" style="margin-bottom:18px">
  <a class="button <?= $statusFilter==='new'?'':'secondary' ?>" href="?status=new">New</a>
  <a class="button <?= $statusFilter==='reviewed'?'':'secondary' ?>" href="?status=reviewed">Reviewed</a>
  <a class="button <?= $statusFilter==='archived'?'':'secondary' ?>" href="?status=archived">Archived</a>
  <a class="button <?= $statusFilter==='all'?'':'secondary' ?>" href="?status=all">All</a>
</div>
<?php if ($selected): ?>
<div class="card">
  <h2>Submission #<?= (int)$selected['id'] ?></h2>
  <div class="two-col">
    <div>
      <p><strong>Name:</strong> <?= h($selected['full_name']) ?><?php if ($selected['preferred_name']): ?> (<?= h($selected['preferred_name']) ?>)<?php endif; ?></p>
      <p><strong>DOB / Age:</strong> <?= h($selected['date_of_birth']) ?> / <?= h((string)$selected['age']) ?> <?= $selected['is_minor'] ? '<span class="pill">Minor</span>' : '' ?></p>
      <p><strong>Phone:</strong> <?= h($selected['mobile_phone']) ?></p>
      <p><strong>Email:</strong> <?= h($selected['email']) ?></p>
      <p><strong>Contact preference:</strong> <?= h(decode_json_field($selected['contact_preference'])) ?></p>
      <p><strong>Voicemail consent:</strong> <?= $selected['voicemail_consent'] ? 'Yes' : 'No' ?></p>
    </div>
    <div>
      <p><strong>Visit type:</strong> <?= h($selected['visit_type']) ?></p>
      <p><strong>Availability:</strong> <?= h(decode_json_field($selected['availability'])) ?></p>
      <p><strong>Reason:</strong> <?= h($selected['reason_for_care']) ?></p>
      <p><strong>Payment:</strong> <?= h(decode_json_field($selected['payment_type'])) ?></p>
      <p><strong>Insurance:</strong> <?= h($selected['insurance_provider']) ?></p>
      <p><strong>OON acknowledgment:</strong> <?= $selected['out_of_network_acknowledgment'] ? 'Yes' : 'No' ?></p>
    </div>
  </div>
  <h3>Brief context</h3>
  <p><?= nl2br(h($selected['brief_context'])) ?></p>
  <form method="post"><input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>"><input type="hidden" name="id" value="<?= (int)$selected['id'] ?>">
    <div class="grid"><div class="row"><label>Status</label><select name="status"><option value="new" <?= $selected['status']==='new'?'selected':'' ?>>New</option><option value="reviewed" <?= $selected['status']==='reviewed'?'selected':'' ?>>Reviewed</option><option value="archived" <?= $selected['status']==='archived'?'selected':'' ?>>Archived</option></select></div></div>
    <div class="row"><label>Staff notes</label><textarea name="staff_notes"><?= h($selected['staff_notes']) ?></textarea></div>
    <button>Update Submission</button>
  </form>
</div>
<?php endif; ?>
<div class="card"><h2>Submissions</h2><table class="table"><tr><th>Created</th><th>Name</th><th>Reason</th><th>Visit</th><th>Status</th><th></th></tr><?php foreach ($submissions as $s): ?><tr><td><?= h($s['created_at']) ?></td><td><strong><?= h($s['full_name']) ?></strong><br><span class="muted"><?= h($s['email']) ?> · <?= h($s['mobile_phone']) ?></span></td><td><?= h($s['reason_for_care']) ?></td><td><?= h($s['visit_type']) ?></td><td><span class="pill"><?= h($s['status']) ?></span></td><td><a class="button secondary" href="?status=<?= h($statusFilter) ?>&id=<?= (int)$s['id'] ?>">View</a></td></tr><?php endforeach; ?></table></div>
<?php admin_footer(); ?>
