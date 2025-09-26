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

function connectWallet() {
    const connectButton = document.getElementById('connectWallet');
    connectButton.textContent = 'Connecting...';

    setTimeout(() => {
        const testWallet = prompt('Enter test wallet address (or press OK for random):');

        if (testWallet !== null) {
            currentWallet = testWallet || 'ARCH' + Math.random().toString(36).substr(2, 34).toUpperCase();
            localStorage.setItem('testWallet', currentWallet);
            showConnectedState();
        } else {
            connectButton.textContent = 'Connect Wallet';
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
}

function showDisconnectedState() {
    const connectButton = document.getElementById('connectWallet');
    if (!connectButton) return;

    connectButton.textContent = 'Connect Wallet';
    connectButton.classList.remove('connected');
}

document.addEventListener('DOMContentLoaded', initSimpleWallet);