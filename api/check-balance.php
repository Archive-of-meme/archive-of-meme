<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['success' => false, 'error' => 'Method not allowed']));
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['wallet']) || !isset($input['token'])) {
    http_response_code(400);
    die(json_encode(['success' => false, 'error' => 'Missing wallet or token address']));
}

$wallet = $input['wallet'];
$token = $input['token'];

// Validate wallet address
if (!isValidWallet($wallet)) {
    http_response_code(400);
    die(json_encode(['success' => false, 'error' => 'Invalid wallet address']));
}

// Validate token address matches our ARCH token
if ($token !== ARCH_TOKEN_ADDRESS) {
    http_response_code(400);
    die(json_encode(['success' => false, 'error' => 'Invalid token address']));
}

// For now, since we're using frontend Phantom integration,
// we'll return a default balance for testing
// The real balance check happens in the frontend via Solana Web3.js
$response = [
    'success' => true,
    'wallet' => $wallet,
    'token' => $token,
    'balance' => 100.0, // Default balance for testing
    'message' => 'Balance check via frontend Phantom integration'
];

// Log the balance check
error_log("Balance check for wallet: $wallet");

echo json_encode($response);
?>