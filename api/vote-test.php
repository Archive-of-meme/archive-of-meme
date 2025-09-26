<?php
// Simple test voting without phase checking
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$response = ['success' => false];

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    $memeId = isset($input['memeId']) ? intval($input['memeId']) : 0;
    $wallet = isset($input['wallet']) ? trim($input['wallet']) : '';

    if (empty($memeId) || empty($wallet)) {
        throw new Exception('Meme ID and wallet are required');
    }

    // Database connection
    $mysqli = new mysqli('localhost', 'root', '', 'archive_of_meme');

    if ($mysqli->connect_error) {
        throw new Exception('Database connection failed: ' . $mysqli->connect_error);
    }

    // Check if meme exists
    $stmt = $mysqli->prepare("SELECT id FROM memes WHERE id = ?");
    $stmt->bind_param("i", $memeId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception('Meme not found');
    }
    $stmt->close();

    // Check if user already voted for this meme today
    $today = date('Y-m-d');
    $stmt = $mysqli->prepare("SELECT id FROM votes WHERE meme_id = ? AND voter_wallet = ? AND vote_date = ?");
    $stmt->bind_param("iss", $memeId, $wallet, $today);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        throw new Exception('You already voted for this meme today');
    }
    $stmt->close();

    // Insert vote
    $stmt = $mysqli->prepare("INSERT INTO votes (meme_id, voter_wallet, vote_date, vote_time) VALUES (?, ?, CURDATE(), CURTIME())");
    $stmt->bind_param("is", $memeId, $wallet);

    if (!$stmt->execute()) {
        throw new Exception('Failed to record vote: ' . $stmt->error);
    }
    $stmt->close();

    // Get updated vote count
    $stmt = $mysqli->prepare("SELECT COUNT(*) as votes FROM votes WHERE meme_id = ?");
    $stmt->bind_param("i", $memeId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $totalVotes = $row['votes'];

    $response = [
        'success' => true,
        'message' => 'Vote recorded successfully! (TEST MODE)',
        'totalVotes' => $totalVotes
    ];

} catch (Exception $e) {
    $response = [
        'success' => false,
        'error' => $e->getMessage()
    ];
}

if (isset($mysqli)) {
    $mysqli->close();
}

echo json_encode($response);
?>