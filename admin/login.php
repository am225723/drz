<?php
declare(strict_types=1);
require_once __DIR__ . '/_auth.php';
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $password = (string)($_POST['password'] ?? '');
    if ($email && $password) {
        $stmt = db()->prepare('SELECT id, email, name, password_hash FROM admin_users WHERE email = ? AND is_active = 1 LIMIT 1');
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        if ($user && password_verify($password, $user['password_hash'])) {
            session_regenerate_id(true);
            $_SESSION['admin_user'] = ['id' => (int)$user['id'], 'email' => $user['email'], 'name' => $user['name']];
            db()->prepare('UPDATE admin_users SET last_login_at = NOW() WHERE id = ?')->execute([$user['id']]);
            header('Location: /admin/dashboard.php');
            exit;
        }
    }
    $error = 'Invalid login.';
}
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>CMS Login</title><link rel="stylesheet" href="/admin/admin.css"></head><body><main style="max-width:620px;margin:60px auto"><h1>Website CMS Login</h1><?php if ($error): ?><div class="notice error"><?= h($error) ?></div><?php endif; ?><div class="card"><form method="post"><div class="row"><label>Email</label><input type="email" name="email" required></div><div class="row"><label>Password</label><input type="password" name="password" required></div><button>Log in</button></form></div></main></body></html>
