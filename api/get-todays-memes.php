<?php
require_once 'config.php';

$response = ['success' => false];

try {
    $sql = "SELECT m.*, COUNT(v.id) as vote_count
            FROM memes m
            LEFT JOIN votes v ON m.id = v.meme_id AND v.vote_date = CURDATE()
            WHERE m.nomination_date = CURDATE()
            GROUP BY m.id
            ORDER BY vote_count DESC, m.id ASC";

    $result = $mysqli->query($sql);

    $memes = [];
    $rank = 1;

    while ($row = $result->fetch_assoc()) {
        $imageUrl = $row['image_url'];
        if ($imageUrl && strpos($imageUrl, '/uploads/') === 0) {
            $imageUrl = '/archive-of-meme' . $imageUrl;
        }

        $memes[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'imageUrl' => $imageUrl,
            'nominator' => substr($row['nominator_wallet'], 0, 4) . '...' . substr($row['nominator_wallet'], -4),
            'votes' => intval($row['vote_count']),
            'rank' => $rank++,
            'nominationTime' => $row['nomination_time']
        ];
    }

    $response = [
        'success' => true,
        'phase' => getCurrentPhase(),
        'memes' => $memes,
        'count' => count($memes)
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