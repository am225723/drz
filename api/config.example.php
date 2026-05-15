<?php
/**
 * Copy this file to api/config.php on Hostinger and fill in real values.
 * Do not commit real secrets to GitHub.
 */
return [
    'allowed_origin' => 'https://drzelisko.com',

    // Hostinger MySQL credentials
    'db_host' => 'localhost',
    'db_name' => 'YOUR_DATABASE_NAME',
    'db_user' => 'YOUR_DATABASE_USER',
    'db_pass' => 'YOUR_DATABASE_PASSWORD',

    // Admin setup token used once by /admin/setup.php.
    // Generate with: php -r "echo bin2hex(random_bytes(32));"
    'admin_setup_token' => 'PASTE_LONG_RANDOM_SETUP_TOKEN_HERE',

    // Contact form token is optional. Leave blank unless you also add it to the JS fetch header.
    'contact_form_token' => '',

    // Hash salt for IP hashing in contact submissions.
    // Generate with: php -r "echo bin2hex(random_bytes(32));"
    'ip_hash_salt' => 'PASTE_LONG_RANDOM_SALT_HERE',

    // Quo/OpenPhone API settings. Keep SMS content neutral and avoid PHI.
    'quo_api_key' => 'YOUR_OPENPHONE_API_KEY',
    'quo_from' => '+1XXXXXXXXXX',
    'quo_user_id' => '',
    'staff_sms_to' => '+1XXXXXXXXXX',
    'send_patient_sms' => false,
    'send_staff_sms' => false,
];
