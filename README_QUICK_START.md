# 🚀 Archive of Meme - Quick Start Guide

## Installation Steps

### 1️⃣ **Local Testing (XAMPP/MAMP/WAMP)**

1. Copy the entire `archive-of-meme` folder to your web server directory:
   - XAMPP: `htdocs/`
   - MAMP: `htdocs/`
   - WAMP: `www/`

2. Start Apache and MySQL

3. Open browser and go to:
   ```
   http://localhost/archive-of-meme/setup.php
   ```

4. Follow the setup wizard:
   - Test database connection
   - Import schema
   - Save configuration
   - Delete setup.php

5. Visit the site:
   ```
   http://localhost/archive-of-meme/
   ```

### 2️⃣ **Hostinger Deployment**

1. **Upload Files via FTP:**
   - Connect to your Hostinger FTP
   - Upload all files to `public_html/`

2. **Create Database:**
   - Go to Hostinger Panel → MySQL Databases
   - Create new database: `archive_of_meme`
   - Create user and grant all privileges
   - Note the credentials

3. **Run Setup:**
   - Visit: `https://yourdomain.com/setup.php`
   - Enter database credentials
   - Click "Test Connection"
   - Click "Import Schema"
   - Click "Save Configuration"

4. **Security:**
   - Delete `setup.php`
   - Delete `database/` folder
   - Set permissions:
     ```bash
     chmod 755 -R .
     chmod 777 uploads/memes/
     ```

5. **Done!** Visit your site

## 🎮 Demo Mode vs Production

### Demo Mode (Default):
- No blockchain required
- Mock wallet balances
- Anyone can nominate/vote
- Perfect for testing

### Production Mode:
1. Edit `api/config.php`:
   ```php
   define('USE_BLOCKCHAIN', true);
   define('ARCH_TOKEN_ADDRESS', 'YOUR_TOKEN_ADDRESS');
   ```

2. Implement Solana integration in wallet.js

## 📁 File Structure

```
archive-of-meme/
├── index.html          # Homepage
├── nominate.html       # Submit memes
├── vote.html          # Vote for memes
├── archive.html       # View past winners
├── profile.html       # User profile
├── whitepaper.html    # Project info
├── api/               # Backend PHP
│   ├── config.php     # Configuration
│   ├── nominate.php   # Handle nominations
│   ├── vote.php       # Handle votes
│   └── get-todays-memes.php
├── css/               # Styles
├── js/                # JavaScript
│   ├── api.js         # API connector
│   └── arch-random.js # Arch images
├── assets/img/        # Images
└── uploads/memes/     # User uploads

```

## ⚙️ Configuration Options

Edit `api/config.php`:

```php
// Database
define('DB_HOST', 'localhost');
define('DB_NAME', 'archive_of_meme');
define('DB_USER', 'your_user');
define('DB_PASS', 'your_pass');

// Uploads
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB

// Blockchain
define('USE_BLOCKCHAIN', false); // true for production
```

## 🧪 Testing Features

1. **Nomination Phase** (00:00-16:00 UTC):
   - Connect wallet (any address works in demo)
   - Submit meme with image
   - Max 3 per day

2. **Voting Phase** (16:00-20:00 UTC):
   - View today's nominations
   - Vote for favorite (1 vote per wallet)

3. **Archive Phase** (20:00-00:00 UTC):
   - Top 3 memes are winners
   - Saved to archive

## 🐛 Troubleshooting

### "Database connection failed"
- Check credentials in config.php
- Ensure MySQL is running
- Verify database exists

### "Cannot upload images"
```bash
chmod 777 uploads/memes/
```

### "Phase not working"
- Times are in UTC
- Check server timezone

### "API not responding"
- Enable CORS in .htaccess:
```apache
Header set Access-Control-Allow-Origin "*"
```

## 🎨 Adding More Arch Images

1. Add image to `assets/img/`
2. Edit `js/arch-random.js`:
```javascript
const archImages = [
    // ... existing images
    "YourNewArch.png"
];
```

## 📱 Mobile Support

Site is fully responsive. Test on:
- iPhone (Safari)
- Android (Chrome)
- Tablets

## 🔒 Security Checklist

- [ ] Delete setup.php
- [ ] Remove database/ folder
- [ ] Set secure passwords
- [ ] Enable SSL (HTTPS)
- [ ] Limit upload size
- [ ] Add rate limiting

## 📞 Support

- Create issue on GitHub
- Check error logs: `error_log`
- Enable debug mode in config.php

## 🎉 Ready!

Your Archive of Meme site is now live!

Start preserving internet culture, one meme at a time! 🚀