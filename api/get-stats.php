<?php
require_once 'config.php';

try {
    $stats = [];

    // Get today's nominations count
    $today = date('Y-m-d');
    $query = "SELECT COUNT(*) as count FROM memes WHERE DATE(nomination_date) = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("s", $today);
    $stmt->execute();
    $result = $stmt->get_result();
    $stats['todayNominations'] = $result->fetch_assoc()['count'];

    // Get active votes (votes cast in current voting phase)
    $currentPhase = getCurrentPhase();
    if ($currentPhase === 'voting') {
        $query = "SELECT COUNT(*) as count FROM votes WHERE DATE(vote_date) = ?";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("s", $today);
        $stmt->execute();
        $result = $stmt->get_result();
        $stats['activeVotes'] = $result->fetch_assoc()['count'];
    } else {
        $stats['activeVotes'] = 0;
    }

    // Get total archived memes
    $query = "SELECT COUNT(*) as count FROM memes WHERE status = 'archived'";
    $result = $mysqli->query($query);
    $stats['totalArchived'] = $result->fetch_assoc()['count'];

    // Get active holders (this would need real blockchain integration)
    // For now, we'll simulate with unique voters as "active participants"
    if (USE_BLOCKCHAIN) {
        // In production, this would query the blockchain
        // For testing, we'll count unique wallets that have participated
        $query = "SELECT COUNT(DISTINCT wallet) as count FROM (
            SELECT nominator_wallet as wallet FROM memes
            UNION
            SELECT voter_wallet as wallet FROM votes
        ) as wallets";
        $result = $mysqli->query($query);
        $stats['activeHolders'] = $result->fetch_assoc()['count'];
    } else {
        // Demo mode - return test data
        $stats['activeHolders'] = rand(100, 500);
    }

    // Additional useful stats
    $stats['currentPhase'] = $currentPhase;
    $stats['serverTime'] = gmdate('Y-m-d H:i:s') . ' UTC';

    // Get top meme of the day if in voting/archive phase
    if ($currentPhase !== 'nomination') {
        $query = "
            SELECT m.id, m.title, COUNT(v.id) as votes
            FROM memes m
            LEFT JOIN votes v ON m.id = v.meme_id
            WHERE DATE(m.nomination_date) = ?
            GROUP BY m.id
            ORDER BY votes DESC
            LIMIT 1
        ";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("s", $today);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            $stats['leadingMeme'] = [
                'id' => $row['id'],
                'title' => $row['title'],
                'votes' => $row['votes']
            ];
        }
    }

    echo json_encode([
        'success' => true,
        'stats' => $stats,
        'timestamp' => time()
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$mysqli->close();
?>