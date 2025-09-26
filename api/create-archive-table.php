<?php
require_once 'config.php';

$sql = "CREATE TABLE IF NOT EXISTS archived_memes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meme_id INT NOT NULL,
    archive_date DATE NOT NULL,
    rank INT NOT NULL,
    medal ENUM('gold', 'silver', 'bronze') NOT NULL,
    votes INT DEFAULT 0,
    ipfs_hash VARCHAR(100) NOT NULL,
    ipfs_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meme_id) REFERENCES memes(id),
    INDEX idx_archive_date (archive_date),
    INDEX idx_ipfs_hash (ipfs_hash)
)";

if ($mysqli->query($sql) === TRUE) {
    echo "Table 'archived_memes' created successfully\n";
} else {
    echo "Error creating table: " . $mysqli->error . "\n";
}

$mysqli->close();
?>