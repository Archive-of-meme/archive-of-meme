<?php
// Simple test version without phase checking
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$response = ['success' => false];

try {
    // Database connection
    $mysqli = @new mysqli('localhost', 'root', '', 'archive_of_meme');

    if ($mysqli->connect_error) {
        throw new Exception('Database connection failed: ' . $mysqli->connect_error);
    }

    // Get form data
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $wallet = isset($_POST['wallet']) ? trim($_POST['wallet']) : '';

    if (empty($title) || empty($wallet)) {
        throw new Exception('Title and wallet are required');
    }

    // Handle image upload
    $imageUrl = '';

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = dirname(__DIR__) . '/uploads/memes/';

        // Create directory if it doesn't exist
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $file = $_FILES['image'];

        // Check file size (5MB max)
        if ($file['size'] > 5 * 1024 * 1024) {
            throw new Exception('File too large. Maximum size is 5MB');
        }

        // Check file type
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file['type'], $allowedTypes)) {
            throw new Exception('Invalid file type. Only images allowed');
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $newFileName = 'meme_' . time() . '_' . rand(1000, 9999) . '.' . $extension;
        $uploadPath = $uploadDir . $newFileName;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
            throw new Exception('Failed to upload file');
        }

        $imageUrl = '/uploads/memes/' . $newFileName;
    } else {
        throw new Exception('No image uploaded');
    }

    // Check if user exists, if not create
    $stmt = $mysqli->prepare("SELECT id FROM users WHERE wallet_address = ?");
    $stmt->bind_param("s", $wallet);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        // Create user
        $balance = rand(100, 10000); // Random balance for testing
        $stmt = $mysqli->prepare("INSERT INTO users (wallet_address, arch_balance) VALUES (?, ?)");
        $stmt->bind_param("sd", $wallet, $balance);
        $stmt->execute();
    }
    $stmt->close();

    // Insert meme
    $stmt = $mysqli->prepare("INSERT INTO memes (title, image_url, nominator_wallet, nomination_date, nomination_time) VALUES (?, ?, ?, CURDATE(), CURTIME())");
    $stmt->bind_param("sss", $title, $imageUrl, $wallet);

    if (!$stmt->execute()) {
        throw new Exception('Failed to save nomination: ' . $stmt->error);
    }

    $memeId = $stmt->insert_id;
    $stmt->close();

    $response = [
        'success' => true,
        'message' => 'Meme nominated successfully! (TEST MODE)',
        'memeId' => $memeId,
        'imageUrl' => $imageUrl
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