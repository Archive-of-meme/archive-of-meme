# Archive of Meme - Hostinger Installation Guide

## Prerequisites

- Hostinger hosting account with PHP 8.0+ support
- MySQL database access
- SSL certificate enabled (for wallet connections)
- FTP/File Manager access

## Step 1: Database Setup

1. Log into your Hostinger control panel
2. Navigate to **Databases → MySQL Databases**
3. Create a new database named `archive_of_meme`
4. Create a database user with full privileges
5. Note down the following credentials:
   - Database name
   - Username
   - Password
   - Host (usually localhost)

6. Access phpMyAdmin from your control panel
7. Select the `archive_of_meme` database
8. Import the `database/schema.sql` file

## Step 2: File Upload

1. Connect to your hosting via FTP or use File Manager
2. Navigate to your public_html directory
3. Upload all files from the `archive-of-meme` folder:
   ```
   /public_html/
   ├── index.html
   ├── nominate.html
   ├── vote.html
   ├── archive.html
   ├── profile.html
   ├── whitepaper.html
   ├── css/
   │   ├── styles.css
   │   ├── nominate.css
   │   ├── vote.css
   │   ├── archive.css
   │   └── profile.css
   ├── js/
   │   ├── main.js
   │   ├── wallet.js
   │   ├── nominate.js
   │   ├── vote.js
   │   ├── archive.js
   │   └── profile.js
   ├── assets/
   │   └── img/
   │       ├── Logo.png
   │       └── ArchPlayingWithBooks.png
   └── api/
       └── (backend files - see Step 3)
   ```

## Step 3: Backend Configuration

1. Create an `api` folder in your public_html directory
2. Create `config.php` file:

```php
<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');

define('ARCH_TOKEN_ADDRESS', 'YOUR_SOLANA_TOKEN_ADDRESS');
define('SOLANA_RPC_URL', 'https://api.mainnet-beta.solana.com');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($mysqli->connect_error) {
    die(json_encode(['error' => 'Database connection failed']));
}

$mysqli->set_charset("utf8mb4");
```

3. Create API endpoints:

**api/nominate.php**
```php
<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Method not allowed']));
}

$data = json_decode(file_get_contents('php://input'), true);

$title = $mysqli->real_escape_string($data['title']);
$image_url = $mysqli->real_escape_string($data['imageUrl']);
$wallet = $mysqli->real_escape_string($data['walletAddress']);

$stmt = $mysqli->prepare("INSERT INTO memes (title, image_url, nominator_wallet, nomination_date, nomination_time) VALUES (?, ?, ?, CURDATE(), CURTIME())");
$stmt->bind_param("sss", $title, $image_url, $wallet);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'memeId' => $stmt->insert_id]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to save meme']);
}

$stmt->close();
$mysqli->close();
```

**api/vote.php**
```php
<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Method not allowed']));
}

$data = json_decode(file_get_contents('php://input'), true);

$meme_id = intval($data['memeId']);
$wallet = $mysqli->real_escape_string($data['walletAddress']);

$stmt = $mysqli->prepare("INSERT INTO votes (meme_id, voter_wallet, vote_date, vote_time) VALUES (?, ?, CURDATE(), CURTIME())");
$stmt->bind_param("is", $meme_id, $wallet);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Already voted or error']);
}

$stmt->close();
$mysqli->close();
```

**api/getToday.php**
```php
<?php
require_once 'config.php';

$result = $mysqli->query("SELECT * FROM current_nominations");
$memes = [];

while ($row = $result->fetch_assoc()) {
    $memes[] = $row;
}

echo json_encode(['memes' => $memes]);
$mysqli->close();
```

**api/stats.php**
```php
<?php
require_once 'config.php';

$stats = [];

$result = $mysqli->query("SELECT COUNT(*) as today FROM memes WHERE nomination_date = CURDATE()");
$stats['todayNominations'] = $result->fetch_assoc()['today'];

$result = $mysqli->query("SELECT COUNT(DISTINCT voter_wallet) as active FROM votes WHERE vote_date = CURDATE()");
$stats['activeVotes'] = $result->fetch_assoc()['active'];

$result = $mysqli->query("SELECT COUNT(*) as total FROM daily_archives");
$stats['totalArchived'] = $result->fetch_assoc()['total'] * 3;

$result = $mysqli->query("SELECT COUNT(DISTINCT wallet_address) as holders FROM users WHERE arch_balance > 0");
$stats['activeHolders'] = $result->fetch_assoc()['holders'];

echo json_encode($stats);
$mysqli->close();
```

## Step 4: Environment Configuration

1. Update JavaScript files to point to your API:
   - Edit `js/main.js`, line 1:
   ```javascript
   const API_BASE = 'https://yourdomain.com/api';
   ```

2. Create `.htaccess` file in root directory:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>
```

## Step 5: Cron Jobs Setup

1. In Hostinger control panel, go to **Advanced → Cron Jobs**
2. Add daily archive job (runs at 20:00 UTC):
```bash
0 20 * * * /usr/bin/php /home/username/public_html/api/daily_archive.php
```

3. Create `api/daily_archive.php`:
```php
<?php
require_once 'config.php';
$mysqli->query("CALL archive_daily_winners()");
$mysqli->close();
```

## Step 6: Testing

1. Visit your domain to check if the site loads
2. Test wallet connection (Phantom wallet required)
3. Check browser console for any errors
4. Test each feature:
   - Nomination submission
   - Voting
   - Archive viewing
   - Profile page

## Step 7: Security

1. Update file permissions:
   - Set folders to 755
   - Set files to 644
   - Set config.php to 600

2. Enable Hostinger's security features:
   - Enable CloudFlare CDN
   - Enable SSL certificate
   - Enable DDoS protection

## Troubleshooting

### Common Issues:

**Database connection error:**
- Verify credentials in config.php
- Check if database exists
- Ensure user has proper privileges

**API not working:**
- Check PHP version (needs 8.0+)
- Verify .htaccess is uploaded
- Check error logs in Hostinger panel

**Wallet connection failing:**
- Ensure HTTPS is enabled
- Check browser console for errors
- Verify Phantom wallet is installed

## Support

For technical issues:
- Check Hostinger documentation
- Contact Hostinger support
- Review error logs in hosting panel

## Next Steps

After installation:
1. Update Solana token address in database
2. Configure social media links
3. Set up monitoring tools
4. Create backup schedule
5. Test all features thoroughly