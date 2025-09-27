<?php
require_once 'config.php';

try {
    // Get optional date parameter
    $date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');

    // Query to get archived memes (top 3 from each day)
    $query = "
        SELECT
            m.id,
            m.title,
            m.image_url,
            m.nominator_wallet,
            m.nomination_date,
            m.ipfs_hash,
            m.archive_date,
            COUNT(v.id) as vote_count,
            RANK() OVER (PARTITION BY DATE(m.archive_date) ORDER BY COUNT(v.id) DESC) as daily_rank
        FROM memes m
        LEFT JOIN votes v ON m.id = v.meme_id
        WHERE m.status = 'archived'
        GROUP BY m.id
        HAVING daily_rank <= 3
        ORDER BY m.archive_date DESC, daily_rank ASC
        LIMIT 30
    ";

    $result = $mysqli->query($query);

    if (!$result) {
        throw new Exception("Database query failed: " . $mysqli->error);
    }

    $archives = [];
    $currentDate = null;
    $dailyArchive = null;

    while ($row = $result->fetch_assoc()) {
        $archiveDate = date('Y-m-d', strtotime($row['archive_date']));

        // Group by date
        if ($currentDate !== $archiveDate) {
            if ($dailyArchive !== null) {
                $archives[] = $dailyArchive;
            }

            $currentDate = $archiveDate;
            $dailyArchive = [
                'date' => $archiveDate,
                'formattedDate' => date('F j, Y', strtotime($archiveDate)),
                'capsuleId' => 'ARCH-' . str_replace('-', '', $archiveDate),
                'memes' => []
            ];
        }

        // Add meme to current day's archive
        $dailyArchive['memes'][] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'image_url' => $row['image_url'],
            'nominator' => substr($row['nominator_wallet'], 0, 4) . '...' . substr($row['nominator_wallet'], -4),
            'nominator_full' => $row['nominator_wallet'],
            'votes' => $row['vote_count'],
            'rank' => $row['daily_rank'],
            'ipfs_hash' => $row['ipfs_hash']
        ];
    }

    // Add the last daily archive
    if ($dailyArchive !== null) {
        $archives[] = $dailyArchive;
    }

    // If no archives exist, return empty array with message
    if (empty($archives)) {
        echo json_encode([
            'success' => true,
            'archives' => [],
            'message' => 'No archives yet. Check back after the first voting phase!'
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'archives' => $archives,
            'total' => count($archives)
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$mysqli->close();
?>