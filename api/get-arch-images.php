<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$imageDir = '../assets/img/';
$allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
$excludedFiles = ['Logo.png', '.DS_Store'];

$archImages = [];

if (is_dir($imageDir)) {
    $files = scandir($imageDir);

    foreach ($files as $file) {
        // Saltar archivos excluidos
        if (in_array($file, $excludedFiles) || $file[0] === '.') {
            continue;
        }

        // Verificar si el archivo contiene "Arch" en el nombre
        if (stripos($file, 'Arch') !== false) {
            $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));

            if (in_array($extension, $allowedExtensions)) {
                $archImages[] = $file;
            }
        }
    }
}

echo json_encode([
    'success' => true,
    'images' => $archImages,
    'count' => count($archImages)
]);
?>