<?php
declare(strict_types=1);
require_once __DIR__ . '/../api/db.php';

session_name('drz_admin');
session_start([
    'cookie_httponly' => true,
    'cookie_secure' => !empty($_SERVER['HTTPS']),
    'cookie_samesite' => 'Lax',
]);

function admin_user(): ?array
{
    return $_SESSION['admin_user'] ?? null;
}

function require_admin(): array
{
    $user = admin_user();
    if (!$user) {
        header('Location: /admin/login.php');
        exit;
    }
    return $user;
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf(): void
{
    $token = $_POST['csrf_token'] ?? '';
    if (!is_string($token) || !hash_equals(csrf_token(), $token)) {
        http_response_code(403);
        exit('Invalid CSRF token');
    }
}

function h(?string $value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}

function admin_header(string $title): void
{
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>' . h($title) . '</title><link rel="stylesheet" href="/admin/admin.css"></head><body><div class="layout"><aside><div class="brand">Integrative Psychiatry CMS</div><nav><a href="/admin/dashboard.php">Dashboard</a><a href="/admin/homepage.php">Homepage</a><a href="/admin/services.php">Services</a><a href="/admin/articles.php">Articles</a><a href="/admin/faqs.php">FAQs</a><a href="/admin/settings.php">Settings</a><a href="/admin/submissions.php">Submissions</a><a href="/admin/logout.php">Log out</a></nav></aside><main><h1>' . h($title) . '</h1>';
}

function admin_footer(): void
{
    echo '</main></div></body></html>';
}
