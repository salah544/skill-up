<?php
/**
 * Skillup Academy — Contact & Enrollment Handler
 *
 * Receives JSON POST from the React frontend, sends a notification email
 * via PHP mail(), and stores the enrollment (MySQL if configured,
 * otherwise a local file fallback so no lead is ever lost silently).
 *
 * Endpoint: POST /contact.php
 * Payload:  { "name": "...", "email": "...", "phone": "...", "formation": "...", "website": "" }
 * Response: { "status": "success"|"error", "message": "..." }
 *
 * Storage directory: ./data/ (protected by .htaccess — never expose it).
 */

// ══════════════════════════════════════════════════════════════════
// ─ Configuration
// ══════════════════════════════════════════════════════════════════

// MySQL (optional). Leave $db_dsn as null to use the file fallback only.
// CREATE TABLE IF NOT EXISTS `enrollments` (
//   `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//   `name`       VARCHAR(255) NOT NULL,
//   `email`      VARCHAR(255) NOT NULL,
//   `phone`      VARCHAR(50)  NOT NULL,
//   `formation`  VARCHAR(255) NOT NULL,
//   `ip_address` VARCHAR(45)  DEFAULT NULL,
//   `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
//   INDEX `idx_email` (`email`),
//   INDEX `idx_formation` (`formation`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
$db_dsn  = null; // e.g. 'mysql:host=localhost;dbname=skillup_db;charset=utf8mb4'
$db_user = null;
$db_pass = null;

// Must match the canonical domain in index.html (og:image) and the address
// published in the footer. Notifications sent To or From a domain you do not
// own get rejected by most mail servers — or, worse, delivered silently to
// whoever actually owns that domain.
$to           = 'contact@skillupacademy.ma';
$from         = 'noreply@skillupacademy.ma';
$data_dir     = __DIR__ . '/data';
$enrollments  = $data_dir . '/enrollments.jsonl';
$rate_dir     = $data_dir . '/ratelimit';
$rate_window  = 600; // seconds
$rate_max     = 5;   // requests per window per IP

$valid_formations = [
    'Customer Service Mastery',
    'Telesales & Negotiation',
    'Communication Skills',
    'Leadership & Management',
];

// Additional allowed origins for cross-origin setups (comma separated).
// Same-origin requests and the Vite dev server work out of the box.
$env_origins    = getenv('SKILLUP_ALLOWED_ORIGINS');
$allowed_origins = $env_origins
    ? array_values(array_filter(array_map('trim', explode(',', $env_origins))))
    : [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost',
        'http://127.0.0.1',
    ];

// ══════════════════════════════════════════════════════════════════
// ─ CORS (restricted: same origin, allowlist, or SKILLUP_ALLOWED_ORIGINS)
// ══════════════════════════════════════════════════════════════════
header('Content-Type: application/json; charset=utf-8');
header('Vary: Origin');

$origin        = $_SERVER['HTTP_ORIGIN'] ?? '';
$current_host  = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '');
$origin_host   = $origin !== '' ? parse_url($origin, PHP_URL_HOST) : null;
$origin_allowed = $origin === ''
    || in_array($origin, $allowed_origins, true)
    || ($origin_host !== null && $origin_host === $current_host);

if ($origin !== '' && $origin_allowed) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code($origin_allowed ? 204 : 403);
    exit;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Méthode non autorisée. Utilisez POST.',
    ]);
    exit;
}

// ══════════════════════════════════════════════════════════════════
// ─ Read Input
// ══════════════════════════════════════════════════════════════════
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Charge utile JSON invalide.',
    ]);
    exit;
}

// ── Honeypot: bots fill the hidden "website" field — drop silently ──
if (!empty($data['website'])) {
    echo json_encode([
        'status'  => 'success',
        'message' => 'Votre inscription a bien été enregistrée ! Nous vous recontactons sous 24 h.',
    ]);
    exit;
}

$client_ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

// ══════════════════════════════════════════════════════════════════
// ─ Rate Limiting (per IP, file based)
// ══════════════════════════════════════════════════════════════════
if (!is_dir($rate_dir)) {
    @mkdir($rate_dir, 0775, true);
}
if (is_dir($rate_dir)) {
    $rate_file = $rate_dir . '/' . sha1($client_ip) . '.json';
    $now       = time();
    $hits      = [];

    if (is_file($rate_file)) {
        $decoded = json_decode((string) @file_get_contents($rate_file), true);
        if (is_array($decoded)) {
            $hits = $decoded;
        }
    }

    $hits = array_values(array_filter($hits, static function ($t) use ($now, $rate_window) {
        return is_int($t) && ($now - $t) < $rate_window;
    }));

    if (count($hits) >= $rate_max) {
        http_response_code(429);
        header('Retry-After: ' . $rate_window);
        echo json_encode([
            'status'  => 'error',
            'message' => 'Trop de tentatives. Veuillez réessayer dans quelques minutes.',
        ]);
        exit;
    }

    $hits[] = $now;
    @file_put_contents($rate_file, json_encode($hits), LOCK_EX);
}

// ══════════════════════════════════════════════════════════════════
// ─ Sanitize & Validate
// ══════════════════════════════════════════════════════════════════
// Output is plain text / JSON — no HTML escaping here (JSON encoding
// and the mail body handle that). Strip tags as defense in depth.
$name      = isset($data['name'])      ? trim(strip_tags((string) $data['name']))      : '';
$email     = isset($data['email'])     ? filter_var(trim((string) $data['email']), FILTER_SANITIZE_EMAIL) : '';
$phone     = isset($data['phone'])     ? trim(strip_tags((string) $data['phone']))     : '';
$formation = isset($data['formation']) ? trim(strip_tags((string) $data['formation'])) : '';

$errors = [];

if (mb_strlen($name) < 2) {
    $errors[] = 'Le nom complet est requis (2 caractères minimum).';
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Une adresse email valide est requise.';
}

$phone_digits = preg_replace('/\D/', '', $phone);
if ($phone_digits === '' || strlen($phone_digits) < 7) {
    $errors[] = 'Un numéro de téléphone valide est requis.';
}

if ($formation === '' || !in_array($formation, $valid_formations, true)) {
    $errors[] = 'Veuillez sélectionner une formation valide.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'status'  => 'error',
        'message' => implode(' ', $errors),
    ]);
    exit;
}

// ══════════════════════════════════════════════════════════════════
// ─ Send Email Notification
// ══════════════════════════════════════════════════════════════════
$subject = "Nouvelle inscription — $formation";

$body  = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$body .= "  SKILLUP ACADEMY — NOUVELLE INSCRIPTION\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
$body .= "Nom:        $name\n";
$body .= "Email:      $email\n";
$body .= "Téléphone:  $phone\n";
$body .= "Formation:  $formation\n\n";
$body .= "Envoyé le:  " . date('Y-m-d H:i:s') . " (heure serveur)\n";
$body .= "Adresse IP: " . $client_ip . "\n";
$body .= "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

$headers  = "From: $from\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: SkillupAcademy/1.0\r\n";

$mail_sent = false;
if (function_exists('mail')) {
    $mail_sent = @mail($to, $subject, $body, $headers);
}
if (!$mail_sent) {
    error_log('Skillup: mail() failed for enrollment from ' . $email);
}

// ══════════════════════════════════════════════════════════════════
// ─ Storage (MySQL if configured, otherwise local file fallback)
// ══════════════════════════════════════════════════════════════════
$stored = false;

if ($db_dsn !== null) {
    try {
        $pdo = new PDO($db_dsn, $db_user, $db_pass, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);

        $stmt = $pdo->prepare(
            'INSERT INTO enrollments (name, email, phone, formation, ip_address)
             VALUES (:name, :email, :phone, :formation, :ip)'
        );

        $stored = (bool) $stmt->execute([
            ':name'      => $name,
            ':email'     => $email,
            ':phone'     => $phone,
            ':formation' => $formation,
            ':ip'        => $client_ip,
        ]);
    } catch (Throwable $e) {
        // Never expose DB errors to the client
        error_log('Skillup DB Error: ' . $e->getMessage());
    }
}

if (!$stored) {
    if (!is_dir($data_dir)) {
        @mkdir($data_dir, 0775, true);
    }
    $record = json_encode([
        'name'         => $name,
        'email'        => $email,
        'phone'        => $phone,
        'formation'    => $formation,
        'ip_address'   => $client_ip,
        'mail_sent'    => $mail_sent,
        'submitted_at' => gmdate('c'),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    $stored = @file_put_contents($enrollments, $record . PHP_EOL, FILE_APPEND | LOCK_EX) !== false;
    if (!$stored) {
        error_log('Skillup: unable to write enrollment file: ' . $enrollments);
    }
}

// ══════════════════════════════════════════════════════════════════
// ─ Response
// ══════════════════════════════════════════════════════════════════
if ($stored) {
    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => 'Votre inscription a bien été enregistrée ! Nous vous recontactons sous 24 h.',
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => "Impossible d'enregistrer votre inscription pour le moment. Veuillez réessayer plus tard.",
    ]);
}
