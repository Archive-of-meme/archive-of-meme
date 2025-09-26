<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['success' => false, 'error' => 'Method not allowed']));
}

if (getCurrentPhase() !== 'voting') {
    die(json_encode(['success' => false, 'error' => 'Voting closed. Only available 16:00-20:00 UTC']));
}

$data = json_decode(file_get_contents('php://input'), true);

$memeId = isset($data['memeId']) ? intval($data['memeId']) : 0;
$wallet = isset($data['wallet']) ? sanitizeInput($data['wallet']) : '';

$response = ['success' => false];

try {
    if (empty($memeId) || empty($wallet)) {
        throw new Exception('Meme ID and wallet are required');
    }

    if (!isValidWallet($wallet)) {
        throw new Exception('Invalid wallet address');
    }

    $balance = getUserBalance($wallet);
    if ($balance < 1 && USE_BLOCKCHAIN) {
        throw new Exception('You need at least 1 $ARCH token to vote');
    }

    if (!canUserVote($wallet)) {
        throw new Exception('You have already voted today');
    }

    $stmt = $mysqli->prepare("SELECT id FROM memes WHERE id = ? AND nomination_date = CURDATE()");
    $stmt->bind_param("i", $memeId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception('Invalid meme or not from today');
    }

    $stmt = $mysqli->prepare("INSERT INTO votes (meme_id, voter_wallet, vote_date, vote_time) VALUES (?, ?, CURDATE(), CURTIME())");
    $stmt->bind_param("is", $memeId, $wallet);

    if (!$stmt->execute()) {
        if ($mysqli->errno === 1062) {
            throw new Exception('You have already voted for this meme');
        }
        throw new Exception('Failed to record vote');
    }

    $stmt = $mysqli->prepare("SELECT COUNT(*) as votes FROM votes WHERE meme_id = ?");
    $stmt->bind_param("i", $memeId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    $response = [
        'success' => true,
        'message' => 'Vote recorded successfully!',
        'totalVotes' => $row['votes']
    ];

} catch (Exception $e) {
    $response = [
        'success' => false,
        'error' => $e->getMessage()
    ];
}

$mysqli->close();
echo json_encode($response);
?>