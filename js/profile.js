let isConnected = false;
let currentTab = 'nominations';

function init() {
    setupEventListeners();
    checkWalletConnection();
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


function showProfile(walletAddress) {
    isConnected = true;

    document.getElementById('notConnected').style.display = 'none';
    document.getElementById('profileContent').style.display = 'block';

    const shortAddress = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
    document.getElementById('profileWallet').textContent = shortAddress;

    loadProfileData(walletAddress);
}

async function loadProfileData(walletAddress) {
    const mockBalance = Math.floor(Math.random() * 10000);
    document.getElementById('archBalance').textContent = mockBalance.toLocaleString();

    const joinDate = new Date();
    joinDate.setDate(joinDate.getDate() - Math.floor(Math.random() * 365));
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const memberSince = `${monthNames[joinDate.getMonth()]} ${joinDate.getFullYear()}`;
    document.getElementById('memberSince').textContent = memberSince;

    updateBadges(walletAddress);
    loadActivityData();
}

function updateBadges(walletAddress) {
    const badges = document.querySelectorAll('.badge');
    const unlockedBadges = Math.floor(Math.random() * 3) + 1;

    badges.forEach((badge, index) => {
        if (index < unlockedBadges) {
            badge.classList.remove('locked');
        }
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