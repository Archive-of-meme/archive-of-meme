// Expand gallery function
function expandGallery() {
    const hiddenGallery = document.getElementById('hiddenGallery');
    const seeMoreBtn = document.getElementById('seeMoreBtn');
    const seeLessBtn = document.getElementById('seeLessBtn');

    if (hiddenGallery && seeMoreBtn && seeLessBtn) {
        // Show hidden gallery
        hiddenGallery.style.display = 'contents';

        // Hide see more button
        seeMoreBtn.style.display = 'none';

        // Show see less button
        seeLessBtn.style.display = 'flex';

        // Smooth scroll to show new content
        setTimeout(() => {
            hiddenGallery.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// Collapse gallery function
function collapseGallery() {
    const hiddenGallery = document.getElementById('hiddenGallery');
    const seeMoreBtn = document.getElementById('seeMoreBtn');
    const seeLessBtn = document.getElementById('seeLessBtn');
    const gallerySection = document.querySelector('.gallery-section');

    if (hiddenGallery && seeMoreBtn && seeLessBtn) {
        // Hide the gallery
        hiddenGallery.style.display = 'none';

        // Show see more button
        seeMoreBtn.style.display = 'flex';

        // Hide see less button
        seeLessBtn.style.display = 'none';

        // Scroll back to gallery section
        if (gallerySection) {
            gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Expand emoji gallery function
function expandEmojiGallery() {
    const hiddenEmojis = document.getElementById('hiddenEmojis');
    const seeMoreBtnEmoji = document.getElementById('seeMoreBtnEmoji');
    const seeLessBtnEmoji = document.getElementById('seeLessBtnEmoji');

    if (hiddenEmojis && seeMoreBtnEmoji && seeLessBtnEmoji) {
        // Show hidden emojis
        hiddenEmojis.style.display = 'contents';

        // Hide see more button
        seeMoreBtnEmoji.style.display = 'none';

        // Show see less button
        seeLessBtnEmoji.style.display = 'flex';

        // Smooth scroll to show new content
        setTimeout(() => {
            hiddenEmojis.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// Collapse emoji gallery function
function collapseEmojiGallery() {
    const hiddenEmojis = document.getElementById('hiddenEmojis');
    const seeMoreBtnEmoji = document.getElementById('seeMoreBtnEmoji');
    const seeLessBtnEmoji = document.getElementById('seeLessBtnEmoji');
    const emojiSection = document.querySelector('#emojis-tab');

    if (hiddenEmojis && seeMoreBtnEmoji && seeLessBtnEmoji) {
        // Hide the emojis
        hiddenEmojis.style.display = 'none';

        // Show see more button
        seeMoreBtnEmoji.style.display = 'flex';

        // Hide see less button
        seeLessBtnEmoji.style.display = 'none';

        // Scroll back to emoji section
        if (emojiSection) {
            emojiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Gallery tab switching
function switchGalleryTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.gallery-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all content
    document.querySelectorAll('.gallery-content').forEach(content => {
        content.classList.remove('active');
    });

    // Add active class to clicked tab
    if (tabName === 'gallery') {
        document.querySelector('.gallery-tab:first-child').classList.add('active');
        document.getElementById('gallery-tab').classList.add('active');
    } else if (tabName === 'emojis') {
        document.querySelector('.gallery-tab:last-child').classList.add('active');
        document.getElementById('emojis-tab').classList.add('active');
    }
}

// Image modal functions
function openImageModal(imagePath, caption) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const downloadBtn = document.getElementById('modalDownload');
    const copyBtn = document.getElementById('modalCopy');

    modal.classList.add('show');
    modalImg.src = imagePath;
    modalCaption.textContent = caption;

    // Set up download button
    downloadBtn.onclick = function() {
        const fileName = caption.replace(/\s+/g, '_') + '.png';
        downloadImage(imagePath, fileName);
    };

    // Set up copy button
    copyBtn.onclick = function() {
        copyImageToClipboard(imagePath, caption);
    };

    // Close on background click
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    };

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
}

function downloadImage(imagePath, fileName) {
    const link = document.createElement('a');
    link.href = imagePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Image downloaded!');
}

async function copyImageToClipboard(imagePath, altText) {
    try {
        const response = await fetch(imagePath);
        const blob = await response.blob();

        if (navigator.clipboard && window.ClipboardItem) {
            const item = new ClipboardItem({ [blob.type]: blob });
            await navigator.clipboard.write([item]);
            showNotification('Image copied to clipboard!');
        } else {
            const img = new Image();
            img.src = imagePath;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(async function(blob) {
                    try {
                        const item = new ClipboardItem({ 'image/png': blob });
                        await navigator.clipboard.write([item]);
                        showNotification('Image copied to clipboard!');
                    } catch (err) {
                        console.error('Failed to copy image:', err);
                        showNotification('Copy failed. Try downloading instead.');
                    }
                }, 'image/png');
            };
        }
    } catch (err) {
        console.error('Failed to copy image:', err);
        showNotification('Copy failed. Try downloading instead.');
    }
}

function showNotification(message) {
    const existingNotification = document.querySelector('.gallery-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'gallery-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--color-gold);
        color: var(--color-ink);
        padding: 15px 20px;
        border: 2px solid var(--color-ink);
        border-radius: var(--radius-sketch);
        font-family: var(--font-sketch);
        font-weight: 700;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);