<?php
require_once 'config.php';
require_once 'pinata-config.php';

header('Content-Type: application/json');

$response = ['success' => false];

try {
    $currentPhase = getCurrentPhase();

    if ($currentPhase !== 'archive') {
        throw new Exception('Not in archive phase. Current phase: ' . $currentPhase);
    }

    $sql = "SELECT m.*, COUNT(v.id) as vote_count
            FROM memes m
            LEFT JOIN votes v ON m.id = v.meme_id AND v.vote_date = CURDATE()
            WHERE m.nomination_date = CURDATE()
            GROUP BY m.id
            ORDER BY vote_count DESC
            LIMIT 3";

    $result = $mysqli->query($sql);

    if ($result->num_rows === 0) {
        throw new Exception('No memes to archive today');
    }

    $archived = [];
    $rank = 1;
    $medals = ['gold', 'silver', 'bronze'];

    while ($row = $result->fetch_assoc()) {
        $localImagePath = dirname(__DIR__) . $row['image_url'];

        if (!file_exists($localImagePath)) {
            error_log("Image not found: " . $localImagePath);
            continue;
        }

        $metadata = [
            'meme_id' => $row['id'],
            'title' => $row['title'],
            'rank' => $rank,
            'medal' => $medals[$rank - 1],
            'votes' => $row['vote_count'],
            'date' => $row['nomination_date'],
            'nominator' => $row['nominator_wallet']
        ];

        $fileName = date('Y-m-d') . '_rank' . $rank . '_' . $row['id'] . '.jpg';
        $ipfsResult = uploadToPinata($localImagePath, $fileName, $metadata);

        if ($ipfsResult['success']) {
            $stmt = $mysqli->prepare("
                INSERT INTO archived_memes
                (meme_id, archive_date, rank, medal, votes, ipfs_hash, ipfs_url)
                VALUES (?, CURDATE(), ?, ?, ?, ?, ?)
            ");

            $stmt->bind_param(
                "iisiss",
                $row['id'],
                $rank,
                $medals[$rank - 1],
                $row['vote_count'],
                $ipfsResult['ipfsHash'],
                $ipfsResult['url']
            );

            if ($stmt->execute()) {
                $archived[] = [
                    'meme_id' => $row['id'],
                    'title' => $row['title'],
                    'rank' => $rank,
                    'medal' => $medals[$rank - 1],
                    'ipfs_hash' => $ipfsResult['ipfsHash'],
                    'ipfs_url' => $ipfsResult['url']
                ];
            }
            $stmt->close();
        }

        $rank++;
    }

    if (count($archived) > 0) {
        $deleteOldSql = "
            DELETE m FROM memes m
            WHERE m.nomination_date < CURDATE()
            AND m.id NOT IN (
                SELECT meme_id FROM archived_memes
            )
        ";
        $mysqli->query($deleteOldSql);

        $deleteOldFiles = glob(dirname(__DIR__) . '/uploads/memes/meme_*');
        $yesterday = strtotime('-1 day');

        foreach ($deleteOldFiles as $file) {
            if (filemtime($file) < $yesterday) {
                $fileBasename = basename($file);
                $checkSql = "SELECT id FROM memes WHERE image_url LIKE '%$fileBasename%'";
                $checkResult = $mysqli->query($checkSql);

                if ($checkResult->num_rows === 0) {
                    unlink($file);
                }
            }
        }

        $response = [
            'success' => true,
            'message' => 'Daily archive completed',
            'archived' => $archived,
            'cleaned_files' => true
        ];
    } else {
        throw new Exception('Failed to archive any memes');
    }

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