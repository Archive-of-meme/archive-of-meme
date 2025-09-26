let currentWallet = localStorage.getItem('testWallet') || null;

function initSimpleWallet() {
    const connectButton = document.getElementById('connectWallet');
    if (!connectButton) return;

    if (currentWallet) {
        showConnectedState();
    }

    connectButton.addEventListener('click', handleWalletClick);
}

function handleWalletClick() {
    if (currentWallet) {
        disconnectWallet();
    } else {
        connectWallet();
    }
}

// Make connectWallet global so it can be called from onclick in HTML
window.connectWallet = function() {
    const connectButton = document.getElementById('connectWallet');
    if (connectButton) {
        connectButton.textContent = 'Connecting...';
    }

    setTimeout(() => {
        const testWallet = prompt('Enter test wallet address (or press OK for random):');

        if (testWallet !== null) {
            currentWallet = testWallet || 'ARCH' + Math.random().toString(36).substr(2, 34).toUpperCase();
            localStorage.setItem('testWallet', currentWallet);
            showConnectedState();

            // If we're on the profile page and there's a connect button in the profile, hide it
            const connectPrompt = document.getElementById('notConnected');
            const profileContent = document.getElementById('profileContent');
            if (connectPrompt && profileContent) {
                connectPrompt.style.display = 'none';
                profileContent.style.display = 'block';
                // Update the profile immediately
                if (typeof showProfile === 'function') {
                    showProfile(currentWallet);
                }
            }
        } else {
            if (connectButton) {
                connectButton.textContent = 'Connect Wallet';
            }
        }
    }, 100);
}

function disconnectWallet() {
    currentWallet = null;
    localStorage.removeItem('testWallet');
    showDisconnectedState();
}

function showConnectedState() {
    const connectButton = document.getElementById('connectWallet');
    if (!connectButton) return;

    connectButton.textContent = currentWallet.substr(0, 4) + '...' + currentWallet.substr(-4);
    connectButton.classList.add('connected');

    // If we're on the profile page, update the profile display
    if (window.location.pathname.includes('profile.html')) {
        updateProfileDisplay();
    }
}

function showDisconnectedState() {
    const connectButton = document.getElementById('connectWallet');
    if (!connectButton) return;

    connectButton.textContent = 'Connect Wallet';
    connectButton.classList.remove('connected');

    // If we're on the profile page, hide the profile display
    if (window.location.pathname.includes('profile.html')) {
        hideProfileDisplay();
    }
}

function updateProfileDisplay() {
    // Call the profile.js functions to update the display
    if (typeof showProfile === 'function' && currentWallet) {
        showProfile(currentWallet);
    }
}

function hideProfileDisplay() {
    // Hide the profile content and show the connect prompt
    const notConnected = document.getElementById('notConnected');
    const profileContent = document.getElementById('profileContent');

    if (notConnected) {
        notConnected.style.display = 'block';
    }
    if (profileContent) {
        profileContent.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', initSimpleWallet);