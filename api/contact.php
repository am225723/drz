<?php
/**
 * Hostinger-compatible PHP endpoint for the website contact form.
 *
 * IMPORTANT HIPAA NOTE:
 * This endpoint can receive PHI if your form collects DOB, reason for care, insurance, or clinical context.
 * Use this on Hostinger only after confirming Hostinger is acceptable for your HIPAA risk model/BAA needs.
 * The safest default is to use this as a thin relay and keep SMS/email notifications neutral.
 */

header('Content-Type: application/json; charset=utf-8');

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server config is missing.']);
    exit;
}

$config = require $configPath;
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = $config['allowed_origin'] ?? '';
if ($allowedOrigin && $origin === $allowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

function json_response(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function get_json_body(): array {
    $raw = file_get_contents('php://input');
    if (!$raw || strlen($raw) > 20000) {
        json_response(400, ['ok' => false, 'error' => 'Invalid request size.']);
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_response(400, ['ok' => false, 'error' => 'Invalid JSON.']);
    }
    return $data;
}

function clean_string($value, int $max = 600): string {
    $value = is_string($value) ? trim($value) : '';
    $value = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $value);
    return mb_substr($value, 0, $max);
}

function normalize_array($value): array {
    if (is_array($value)) return array_map(fn($v) => clean_string($v, 80), $value);
    if (is_string($value) && $value !== '') return [clean_string($value, 80)];
    return [];
}

function valid_email(string $email): bool {
    return (bool) filter_var($email, FILTER_VALIDATE_EMAIL);
}

function valid_phone(string $phone): bool {
    return (bool) preg_match('/^[0-9+().\-\s]{7,25}$/', $phone);
}

function calculate_age(?string $dob): ?int {
    if (!$dob) return null;
    try {
        $birth = new DateTime($dob);
        $today = new DateTime('today');
        return (int) $birth->diff($today)->y;
    } catch (Exception $e) {
        return null;
    }
}

function rate_limit(): void {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $safeIp = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $ip);
    $dir = sys_get_temp_dir() . '/drz_contact_rate';
    if (!is_dir($dir)) mkdir($dir, 0700, true);
    $file = $dir . '/' . $safeIp . '.json';
    $now = time();
    $windowSeconds = 3600;
    $maxRequests = 5;
    $events = [];
    if (file_exists($file)) {
        $events = json_decode(file_get_contents($file), true) ?: [];
    }
    $events = array_values(array_filter($events, fn($ts) => is_int($ts) && $ts > ($now - $windowSeconds)));
    if (count($events) >= $maxRequests) {
        json_response(429, ['ok' => false, 'error' => 'Too many requests. Please try again later.']);
    }
    $events[] = $now;
    file_put_contents($file, json_encode($events), LOCK_EX);
}

function send_quo_sms(array $config, string $to, string $body): array {
    $apiKey = $config['quo_api_key'] ?? '';
    $from = $config['quo_from'] ?? '';
    if (!$apiKey || !$from || !$to) {
        return ['ok' => false, 'error' => 'SMS configuration missing.'];
    }

    $payload = [
        'content' => $body,
        'from' => $from,
        'to' => [$to],
    ];
    if (!empty($config['quo_user_id'])) {
        $payload['userId'] = $config['quo_user_id'];
    }

    $ch = curl_init('https://api.openphone.com/v1/messages');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: ' . $apiKey,
            'Content-Type: application/json',
        ],
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_TIMEOUT => 12,
    ]);
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($response === false || $status < 200 || $status >= 300) {
        error_log('Quo/OpenPhone SMS failed: HTTP ' . $status . ' ' . $error . ' ' . $response);
        return ['ok' => false, 'error' => 'SMS failed.'];
    }
    return ['ok' => true];
}

function encrypt_and_store(array $config, array $data): void {
    if (empty($config['enable_encrypted_storage'])) return;
    $key = base64_decode($config['storage_key'] ?? '', true);
    if (!$key || strlen($key) !== 32) {
        error_log('Encrypted storage requested but storage key is invalid.');
        return;
    }
    $dir = __DIR__ . '/secure-submissions';
    if (!is_dir($dir)) mkdir($dir, 0700, true);
    $nonce = random_bytes(12);
    $plaintext = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $ciphertext = openssl_encrypt($plaintext, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $nonce, $tag);
    if ($ciphertext === false) {
        error_log('Encryption failed.');
        return;
    }
    $record = [
        'nonce' => base64_encode($nonce),
        'tag' => base64_encode($tag),
        'ciphertext' => base64_encode($ciphertext),
        'createdAt' => gmdate('c'),
    ];
    $filename = $dir . '/' . gmdate('Ymd_His') . '_' . bin2hex(random_bytes(6)) . '.json';
    file_put_contents($filename, json_encode($record), LOCK_EX);
    chmod($filename, 0600);
}

rate_limit();
$data = get_json_body();

$submission = [
    'fullName' => clean_string($data['fullName'] ?? '', 140),
    'preferredName' => clean_string($data['preferredName'] ?? '', 140),
    'dob' => clean_string($data['dob'] ?? '', 20),
    'mobile' => clean_string($data['mobile'] ?? '', 40),
    'email' => clean_string($data['email'] ?? '', 180),
    'contactPreference' => normalize_array($data['contactPreference'] ?? []),
    'voicemailConsent' => !empty($data['voicemailConsent']),
    'visitType' => clean_string($data['visitType'] ?? '', 40),
    'availability' => normalize_array($data['availability'] ?? []),
    'reasonForCare' => clean_string($data['reasonForCare'] ?? '', 120),
    'briefContext' => clean_string($data['briefContext'] ?? '', 600),
    'paymentType' => normalize_array($data['paymentType'] ?? []),
    'insuranceProvider' => clean_string($data['insuranceProvider'] ?? '', 140),
    'oonAcknowledgment' => !empty($data['oonAcknowledgment']),
    'age' => calculate_age(clean_string($data['dob'] ?? '', 20)),
    'submittedAt' => gmdate('c'),
    'ipHash' => hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . date('Y-m-d')),
];

$errors = [];
if ($submission['fullName'] === '') $errors[] = 'Full name is required.';
if ($submission['dob'] === '' || $submission['age'] === null) $errors[] = 'Valid date of birth is required.';
if (!valid_phone($submission['mobile'])) $errors[] = 'Valid mobile phone is required.';
if (!valid_email($submission['email'])) $errors[] = 'Valid email is required.';
if ($submission['visitType'] === '') $errors[] = 'Visit type is required.';
if ($submission['reasonForCare'] === '') $errors[] = 'Reason for care is required.';
if (empty($submission['paymentType'])) $errors[] = 'Payment type is required.';
if (!$submission['oonAcknowledgment']) $errors[] = 'Out-of-network acknowledgment is required.';

if ($errors) {
    json_response(422, ['ok' => false, 'errors' => $errors]);
}

// Optional encrypted local storage. Only enable if your hosting setup is approved for PHI.
encrypt_and_store($config, $submission);

$patientWantsText = in_array('Text', $submission['contactPreference'], true);
$smsResults = [];

if (!empty($config['send_patient_sms']) && $patientWantsText) {
    $smsResults['patient'] = send_quo_sms(
        $config,
        $submission['mobile'],
        'Integrative Psychiatry received your inquiry. Please do not reply with urgent or sensitive clinical information. If this is an emergency, call 911 or call/text 988.'
    );
}

if (!empty($config['send_staff_sms']) && !empty($config['staff_sms_to'])) {
    $smsResults['staff'] = send_quo_sms(
        $config,
        $config['staff_sms_to'],
        'New website inquiry received. Log in to the secure system to review. Do not discuss PHI by SMS.'
    );
}

json_response(200, [
    'ok' => true,
    'message' => 'Inquiry received.',
    'minor' => $submission['age'] !== null ? $submission['age'] < 18 : null,
    'sms' => $smsResults,
]);
