// Phantom Wallet Integration for Archive of Meme
// Token: DmE9nZs4LfNCtMUHZWckstSHvHFCusBdGwjhqJuYpump

const ARCH_TOKEN_ADDRESS = 'DmE9nZs4LfNCtMUHZWckstSHvHFCusBdGwjhqJuYpump';
const MIN_ARCH_FOR_VOTING = 100; // Minimum ARCH tokens required to vote
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

let phantomWallet = {
    address: null,
    isConnected: false,
    archBalance: 0
};

// Initialize Phantom connection
async function initPhantom() {
    if (!window.solana || !window.solana.isPhantom) {
        console.log('Phantom wallet not found');
        return false;
    }

    // Check if already connected
    try {
        const resp = await window.solana.connect({ onlyIfTrusted: true });
        if (resp.publicKey) {
            phantomWallet.address = resp.publicKey.toString();
            phantomWallet.isConnected = true;
            await updateWalletUI();
            await checkArchBalance();
            return true;
        }
    } catch (err) {
        console.log('Not auto-connected:', err);
    }

    return false;
}

// Connect Phantom Wallet
async function connectPhantom() {
    if (!window.solana || !window.solana.isPhantom) {
        alert('Please install Phantom wallet from https://phantom.app');
        window.open('https://phantom.app', '_blank');
        return;
    }

    try {
        const resp = await window.solana.connect();
        phantomWallet.address = resp.publicKey.toString();
        phantomWallet.isConnected = true;

        localStorage.setItem('walletAddress', phantomWallet.address);

        await updateWalletUI();
        await checkArchBalance();

        showNotification('Wallet connected successfully!', 'success');

    } catch (err) {
        console.error('Connection failed:', err);
        showNotification('Failed to connect wallet', 'error');
    }
}

// Disconnect wallet
async function disconnectPhantom() {
    if (window.solana) {
        await window.solana.disconnect();
    }

    phantomWallet.address = null;
    phantomWallet.isConnected = false;
    phantomWallet.archBalance = 0;

    localStorage.removeItem('walletAddress');
    updateWalletUI();

    showNotification('Wallet disconnected', 'info');
}

// Check ARCH token balance
async function checkArchBalance() {
    if (!phantomWallet.address) return 0;

    try {
        // Create connection
        const { Connection, PublicKey } = window.solanaWeb3 || {};
        if (!Connection || !PublicKey) {
            console.error('Solana Web3 not loaded');
            return 0;
        }

        const connection = new Connection(SOLANA_RPC);
        const walletPubkey = new PublicKey(phantomWallet.address);
        const tokenPubkey = new PublicKey(ARCH_TOKEN_ADDRESS);

        // Get token accounts
        const response = await connection.getParsedTokenAccountsByOwner(
            walletPubkey,
            { mint: tokenPubkey }
        );

        if (response.value.length > 0) {
            const balance = response.value[0].account.data.parsed.info.tokenAmount.uiAmount;
            phantomWallet.archBalance = balance || 0;
        } else {
            phantomWallet.archBalance = 0;
        }

        updateBalanceDisplay();
        return phantomWallet.archBalance;

    } catch (error) {
        console.error('Error checking balance:', error);

        // Fallback: Check using API
        try {
            const response = await fetch(`/api/check-balance.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    wallet: phantomWallet.address,
                    token: ARCH_TOKEN_ADDRESS
                })
            });

            const data = await response.json();
            phantomWallet.archBalance = data.balance || 0;
            updateBalanceDisplay();

        } catch (apiError) {
            console.error('API balance check failed:', apiError);
            phantomWallet.archBalance = 0;
        }
    }

    return phantomWallet.archBalance;
}

// Update wallet UI
function updateWalletUI() {
    const connectBtn = document.getElementById('connectWallet');
    if (!connectBtn) return;

    if (phantomWallet.isConnected && phantomWallet.address) {
        // Show connected state
        const shortAddress = phantomWallet.address.slice(0, 4) + '...' + phantomWallet.address.slice(-4);
        connectBtn.textContent = shortAddress;
        connectBtn.classList.add('connected');
        connectBtn.onclick = showWalletMenu;

    } else {
        // Show disconnected state
        connectBtn.textContent = 'Connect Wallet';
        connectBtn.classList.remove('connected');
        connectBtn.onclick = connectPhantom;
    }
}

// Update balance display (now only updates internal state, no visual display)
function updateBalanceDisplay() {
    // Remove any existing balance display
    const existingDisplay = document.getElementById('archBalanceDisplay');
    if (existingDisplay) {
        existingDisplay.remove();
    }

    // Just update feature access based on balance
    if (phantomWallet.isConnected && phantomWallet.address) {
        updateFeatureAccess();
    }
}

// Update feature access based on ARCH balance
function updateFeatureAccess() {
    // Nomination: Anyone with a wallet can nominate (no ARCH required)
    const nominateElements = document.querySelectorAll('.nominate-btn, #submitBtn');
    nominateElements.forEach(el => {
        el.disabled = !phantomWallet.isConnected;
        el.title = phantomWallet.isConnected ?
            'Nominate meme' :
            'Connect wallet to nominate';
    });

    // Voting: Requires MIN_ARCH_FOR_VOTING tokens
    const voteElements = document.querySelectorAll('.vote-btn');
    const canVote = phantomWallet.archBalance >= MIN_ARCH_FOR_VOTING;

    voteElements.forEach(el => {
        // Don't disable button here, let them click to find out if they have enough
        el.disabled = false;
        el.title = 'Vote for this meme';
    });

    // Don't show voting power - keep balance private
}

// Show wallet menu (for disconnect option)
function showWalletMenu(event) {
    event.preventDefault();

    // Create menu if doesn't exist
    let menu = document.getElementById('walletMenu');
    if (!menu) {
        menu = document.createElement('div');
        menu.id = 'walletMenu';
        menu.className = 'wallet-menu';
        menu.innerHTML = `
            <div class="wallet-menu-item">
                <strong>Wallet:</strong> ${phantomWallet.address.slice(0, 6)}...${phantomWallet.address.slice(-4)}
            </div>
            <button class="wallet-menu-btn" onclick="disconnectPhantom()">Disconnect</button>
            <button class="wallet-menu-btn" onclick="window.open('https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${ARCH_TOKEN_ADDRESS}', '_blank')">Get $ARCH</button>
        `;
        document.body.appendChild(menu);
    }

    // Position menu near button
    const btnRect = event.target.getBoundingClientRect();
    menu.style.top = (btnRect.bottom + 10) + 'px';
    menu.style.right = (window.innerWidth - btnRect.right) + 'px';
    menu.style.display = 'block';

    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', closeWalletMenu);
    }, 100);
}

function closeWalletMenu() {
    const menu = document.getElementById('walletMenu');
    if (menu) {
        menu.style.display = 'none';
    }
    document.removeEventListener('click', closeWalletMenu);
}

// Show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await initPhantom();

    // Set up connect button
    const connectBtn = document.getElementById('connectWallet');
    if (connectBtn) {
        connectBtn.addEventListener('click', (e) => {
            if (phantomWallet.isConnected) {
                showWalletMenu(e);
            } else {
                connectPhantom();
            }
        });
    }

    // Listen for account changes
    if (window.solana) {
        window.solana.on('accountChanged', (publicKey) => {
            if (publicKey) {
                phantomWallet.address = publicKey.toString();
                checkArchBalance();
                updateWalletUI();
            } else {
                disconnectPhantom();
            }
        });
    }
});

// Export for use in other scripts
window.phantomWallet = phantomWallet;
window.connectPhantom = connectPhantom;
window.disconnectPhantom = disconnectPhantom;
window.checkArchBalance = checkArchBalance;