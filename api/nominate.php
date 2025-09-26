<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['success' => false, 'error' => 'Method not allowed']));
}

if (getCurrentPhase() !== 'nomination') {
    die(json_encode(['success' => false, 'error' => 'Nominations closed. Only available 00:00-16:00 UTC']));
}

$response = ['success' => false];

try {
    $title = isset($_POST['title']) ? sanitizeInput($_POST['title']) : '';
    $wallet = isset($_POST['wallet']) ? sanitizeInput($_POST['wallet']) : '';
    $imageUrl = '';

    if (empty($title) || empty($wallet)) {
        throw new Exception('Title and wallet are required');
    }

    if (!isValidWallet($wallet)) {
        throw new Exception('Invalid wallet address');
    }

    $stmt = $mysqli->prepare("SELECT id FROM users WHERE wallet_address = ?");
    $stmt->bind_param("s", $wallet);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $balance = getUserBalance($wallet);
        $stmt = $mysqli->prepare("INSERT INTO users (wallet_address, arch_balance) VALUES (?, ?)");
        $stmt->bind_param("sd", $wallet, $balance);
        $stmt->execute();
    }

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadedFile = $_FILES['image'];

        if ($uploadedFile['size'] > MAX_FILE_SIZE) {
            throw new Exception('File too large. Maximum size is 5MB');
        }

        if (!in_array($uploadedFile['type'], ALLOWED_TYPES)) {
            throw new Exception('Invalid file type. Only images allowed');
        }

        $fileExtension = pathinfo($uploadedFile['name'], PATHINFO_EXTENSION);
        $newFileName = uniqid('meme_') . '.' . $fileExtension;
        $uploadPath = UPLOAD_DIR . $newFileName;

        if (!move_uploaded_file($uploadedFile['tmp_name'], $uploadPath)) {
            throw new Exception('Failed to upload file');
        }

        $imageUrl = UPLOAD_URL . $newFileName;
    } else if (isset($_POST['imageUrl'])) {
        $imageUrl = filter_var($_POST['imageUrl'], FILTER_VALIDATE_URL);
        if (!$imageUrl) {
            throw new Exception('Invalid image URL');
        }
    } else {
        throw new Exception('Image is required');
    }

    $today = date('Y-m-d');
    $stmt = $mysqli->prepare("SELECT COUNT(*) as count FROM memes WHERE nominator_wallet = ? AND nomination_date = ?");
    $stmt->bind_param("ss", $wallet, $today);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    if ($row['count'] >= 3) {
        throw new Exception('You can only nominate 3 memes per day');
    }

    $stmt = $mysqli->prepare("INSERT INTO memes (title, image_url, nominator_wallet, nomination_date, nomination_time) VALUES (?, ?, ?, CURDATE(), CURTIME())");
    $stmt->bind_param("sss", $title, $imageUrl, $wallet);

    if (!$stmt->execute()) {
        throw new Exception('Failed to save nomination');
    }

    $response = [
        'success' => true,
        'memeId' => $stmt->insert_id,
        'message' => 'Meme nominated successfully!'
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