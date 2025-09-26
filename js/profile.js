let isConnected = false;
let currentTab = 'nominations';

function init() {
    // Force all values to 0 on page load to prevent cached data
    resetAllValues();
    setupEventListeners();
    checkWalletConnection();
}

function resetAllValues() {
    // Force reset all values to 0 on page load
    const balanceElement = document.getElementById('archBalance');
    if (balanceElement) {
        balanceElement.textContent = '0';
    }

    // Reset all stat numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        stat.textContent = '0';
    });

    // Ensure all badges are locked
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        if (!badge.classList.contains('locked')) {
            badge.classList.add('locked');
        }
        // Change icon to lock if not already
        const icon = badge.querySelector('.badge-icon');
        if (icon && icon.textContent !== '🔒') {
            icon.textContent = '🔒';
        }
    });
}

function setupEventListeners() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
}

function checkWalletConnection() {
    const walletAddress = localStorage.getItem('testWallet');
    if (walletAddress) {
        showProfile(walletAddress);
    }
}


// Make showProfile global so wallet-simple.js can call it
window.showProfile = function(walletAddress) {
    isConnected = true;

    const notConnected = document.getElementById('notConnected');
    const profileContent = document.getElementById('profileContent');

    if (notConnected) {
        notConnected.style.display = 'none';
    }
    if (profileContent) {
        profileContent.style.display = 'block';
    }

    const profileWallet = document.getElementById('profileWallet');
    if (profileWallet && walletAddress) {
        const shortAddress = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
        profileWallet.textContent = shortAddress;
    }

    loadProfileData(walletAddress);
}

async function loadProfileData(walletAddress) {
    // In production, this would fetch real data from the backend
    // For now, ALWAYS show 0 values - no mock data
    const balanceElement = document.getElementById('archBalance');
    if (balanceElement) {
        balanceElement.textContent = '0';
        balanceElement.innerHTML = '0'; // Force update
    }

    // Show current date as member since (new member)
    const joinDate = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const memberSince = `${monthNames[joinDate.getMonth()]} ${joinDate.getFullYear()}`;
    const memberElement = document.getElementById('memberSince');
    if (memberElement) {
        memberElement.textContent = memberSince;
    }

    // Also update any stat cards to ensure they show 0
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        if (stat.id !== 'memberSince') {
            stat.textContent = '0';
            stat.innerHTML = '0';
        }
    });

    // Don't unlock any badges randomly - keep them locked until user actually earns them
    // updateBadges(walletAddress); // Commented out - no random unlocking
    loadActivityData();
}

function updateBadges(walletAddress) {
    // In production, this would check real achievements from the backend
    // For now, keep all badges locked until user actually earns them
    const badges = document.querySelectorAll('.badge');

    // Don't randomly unlock badges - they should be earned
    badges.forEach((badge) => {
        badge.classList.add('locked'); // Ensure all remain locked
    });
}

function loadActivityData() {
    console.log('Loading user activity data...');
}

function switchTab(tabName) {
    currentTab = tabName;

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
}


document.addEventListener('DOMContentLoaded', init);