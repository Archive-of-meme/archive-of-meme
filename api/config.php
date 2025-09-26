<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

define('DB_HOST', 'localhost');
define('DB_NAME', 'archive_of_meme');
define('DB_USER', 'root');
define('DB_PASS', '');

define('UPLOAD_DIR', '../uploads/memes/');
define('UPLOAD_URL', '/uploads/memes/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_TYPES', ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']);

define('USE_BLOCKCHAIN', false);
define('ARCH_TOKEN_ADDRESS', 'DEMO_MODE');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if ($mysqli->connect_error) {
        throw new Exception('Database connection failed: ' . $mysqli->connect_error);
    }

    $mysqli->set_charset("utf8mb4");
} catch (Exception $e) {
    die(json_encode(['success' => false, 'error' => $e->getMessage()]));
}

function isValidWallet($wallet) {
    return preg_match('/^[A-Za-z0-9]{32,44}$/', $wallet);
}

function getUserBalance($wallet) {
    if (!USE_BLOCKCHAIN) {
        return rand(100, 10000);
    }
    return 0;
}

function getCurrentPhase() {
    // Check for test mode
    @session_start();
    if (isset($_SESSION['test_phase'])) {
        return $_SESSION['test_phase'];
    }

    // Normal phase calculation
    $hour = intval(gmdate('H'));

    if ($hour < 16) {
        return 'nomination';
    } else if ($hour < 20) {
        return 'voting';
    } else {
        return 'archive';
    }
}

function canUserVote($wallet) {
    global $mysqli;

    $today = date('Y-m-d');
    $stmt = $mysqli->prepare("SELECT id FROM votes WHERE voter_wallet = ? AND vote_date = ?");
    $stmt->bind_param("ss", $wallet, $today);
    $stmt->execute();
    $result = $stmt->get_result();

    return $result->num_rows === 0;
}

function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0777, true);
}
?>