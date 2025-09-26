<?php
// IMPORTANT: Copy this file to pinata-config.php and add your real keys
// NEVER commit pinata-config.php to GitHub!

define('PINATA_API_KEY', 'YOUR_PINATA_API_KEY_HERE');
define('PINATA_SECRET_KEY', 'YOUR_PINATA_SECRET_KEY_HERE');
define('PINATA_JWT', 'YOUR_PINATA_JWT_HERE');

define('PINATA_API_URL', 'https://api.pinata.cloud');
define('PINATA_GATEWAY', 'https://gateway.pinata.cloud/ipfs/');

function uploadToPinata($filePath, $fileName, $metadata = []) {
    $url = PINATA_API_URL . '/pinning/pinFileToIPFS';

    $headers = [
        'pinata_api_key: ' . PINATA_API_KEY,
        'pinata_secret_api_key: ' . PINATA_SECRET_KEY
    ];

    $file = new CURLFile($filePath, mime_content_type($filePath), $fileName);

    $data = [
        'file' => $file,
        'pinataMetadata' => json_encode([
            'name' => $fileName,
            'keyvalues' => $metadata
        ]),
        'pinataOptions' => json_encode([
            'cidVersion' => 1
        ])
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode == 200) {
        $result = json_decode($response, true);
        return [
            'success' => true,
            'ipfsHash' => $result['IpfsHash'],
            'pinSize' => $result['PinSize'],
            'url' => PINATA_GATEWAY . $result['IpfsHash']
        ];
    } else {
        return [
            'success' => false,
            'error' => 'Failed to upload to IPFS',
            'response' => $response
        ];
    }
}

function unpinFromPinata($ipfsHash) {
    $url = PINATA_API_URL . '/pinning/unpin/' . $ipfsHash;

    $headers = [
        'pinata_api_key: ' . PINATA_API_KEY,
        'pinata_secret_api_key: ' . PINATA_SECRET_KEY
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode == 200;
}
?>