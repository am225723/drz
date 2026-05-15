<?php
declare(strict_types=1);
require_once __DIR__ . '/_auth.php';

$message = '';
$error = '';
try {
    $config = app_config();
    $pdo = db();
    $count = (int)$pdo->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $token = $_POST['setup_token'] ?? '';
        if (!hash_equals((string)$config['admin_setup_token'], (string)$token)) {
            $error = 'Invalid setup token.';
        } elseif ($count > 0) {
            $error = 'An admin user already exists. Delete this file or keep it inaccessible.';
        } else {
            $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
            $name = clean_string((string)($_POST['name'] ?? ''), 180);
            $password = (string)($_POST['password'] ?? '');
            if (!$email || strlen($password) < 12) {
                $error = 'Use a valid email and a password of at least 12 characters.';
            } else {
                $stmt = $pdo->prepare('INSERT INTO admin_users (email, name, password_hash) VALUES (?, ?, ?)');
                $stmt->execute([$email, $name, password_hash($password, PASSWORD_DEFAULT)]);
                $message = 'Admin user created. You can now log in.';
            }
        }
    }
} catch (Throwable $e) {
    $error = $e->getMessage();
}
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>CMS Setup</title><link rel="stylesheet" href="/admin/admin.css"></head><body><main style="max-width:760px;margin:40px auto"><h1>CMS Setup</h1><?php if ($message): ?><div class="notice"><?= h($message) ?></div><p><a class="button" href="/admin/login.php">Log in</a></p><?php endif; ?><?php if ($error): ?><div class="notice error"><?= h($error) ?></div><?php endif; ?><div class="card"><form method="post"><div class="row"><label>Setup token from api/config.php</label><input name="setup_token" required></div><div class="row"><label>Name</label><input name="name"></div><div class="row"><label>Email</label><input type="email" name="email" required></div><div class="row"><label>Password</label><input type="password" name="password" required minlength="12"></div><button>Create Admin</button></form></div><p class="muted">After creating your admin user, remove or protect <code>/admin/setup.php</code>.</p></main></body></html>
