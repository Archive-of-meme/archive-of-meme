let currentPage = 1;
const itemsPerPage = 9;
let allArchives = [];
let filteredArchives = [];

const sampleArchives = [
    {
        date: '2024-09-24',
        memes: [
            { title: 'Wojak Thinking', votes: 567, nominator: '0x1234...5678', rank: 1 },
            { title: 'Pepe Hands', votes: 445, nominator: '0xabcd...efgh', rank: 2 },
            { title: 'Doge Wow', votes: 312, nominator: '0x9876...5432', rank: 3 }
        ],
        totalVotes: 1324,
        participants: 89
    },
    {
        date: '2024-09-23',
        memes: [
            { title: 'Galaxy Brain', votes: 689, nominator: '0xaaaa...bbbb', rank: 1 },
            { title: 'Drake Format', votes: 523, nominator: '0xcccc...dddd', rank: 2 },
            { title: 'Stonks', votes: 412, nominator: '0xeeee...ffff', rank: 3 }
        ],
        totalVotes: 1624,
        participants: 112
    },
    {
        date: '2024-09-22',
        memes: [
            { title: 'This is Fine', votes: 789, nominator: '0x1111...2222', rank: 1 },
            { title: 'Distracted Boyfriend', votes: 623, nominator: '0x3333...4444', rank: 2 },
            { title: 'Woman Yelling at Cat', votes: 456, nominator: '0x5555...6666', rank: 3 }
        ],
        totalVotes: 1868,
        participants: 145
    },
    {
        date: '2024-09-21',
        memes: [
            { title: 'Surprised Pikachu', votes: 912, nominator: '0x7777...8888', rank: 1 },
            { title: 'Expanding Brain', votes: 734, nominator: '0x9999...aaaa', rank: 2 },
            { title: 'Mock SpongeBob', votes: 543, nominator: '0xbbbb...cccc', rank: 3 }
        ],
        totalVotes: 2189,
        participants: 167
    },
    {
        date: '2024-09-20',
        memes: [
            { title: 'Big Brain Time', votes: 654, nominator: '0xdddd...eeee', rank: 1 },
            { title: 'Always Has Been', votes: 543, nominator: '0xffff...0000', rank: 2 },
            { title: 'Panik Kalm Panik', votes: 432, nominator: '0x1122...3344', rank: 3 }
        ],
        totalVotes: 1629,
        participants: 98
    }
];

function init() {
    loadArchives();
    setupEventListeners();
}

function setupEventListeners() {
    document.getElementById('monthFilter').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', applyFilters);
    document.getElementById('searchArchive').addEventListener('input', applyFilters);
    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));

    const modal = document.getElementById('capsuleModal');
    const closeModal = document.querySelector('.close-modal');

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function loadArchives() {
    allArchives = sampleArchives;
    filteredArchives = [...allArchives];
    renderArchives();
}

function applyFilters() {
    const monthFilter = document.getElementById('monthFilter').value;
    const searchTerm = document.getElementById('searchArchive').value.toLowerCase();
    const sortBy = document.getElementById('sortBy').value;

    filteredArchives = allArchives.filter(archive => {
        const date = new Date(archive.date);
        const month = String(date.getMonth() + 1).padStart(2, '0');

        if (monthFilter && month !== monthFilter) {
            return false;
        }

        if (searchTerm) {
            const hasMatch = archive.memes.some(meme =>
                meme.title.toLowerCase().includes(searchTerm)
            );
            if (!hasMatch) return false;
        }

        return true;
    });

    switch(sortBy) {
        case 'date-desc':
            filteredArchives.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-asc':
            filteredArchives.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'votes':
            filteredArchives.sort((a, b) => b.totalVotes - a.totalVotes);
            break;
    }

    currentPage = 1;
    renderArchives();
}

function renderArchives() {
    const grid = document.getElementById('archiveGrid');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageArchives = filteredArchives.slice(startIndex, endIndex);

    if (pageArchives.length === 0) {
        grid.innerHTML = '<div class="loading-state"><p>No archives found</p></div>';
        updatePagination();
        return;
    }

    grid.innerHTML = pageArchives.map(archive => `
        <div class="archive-card" onclick="showCapsuleDetail('${archive.date}')">
            <div class="archive-date">${formatDate(archive.date)}</div>
            <div class="archive-capsule">
                <div class="meme-thumbnail">
                    <div class="meme-thumb gold">🏆</div>
                    <div class="meme-thumb silver">🥈</div>
                    <div class="meme-thumb bronze">🥉</div>
                </div>
                <div class="archive-stats">
                    <span class="stat-item">📊 ${archive.totalVotes} votes</span>
                    <span class="stat-item">👥 ${archive.participants} voters</span>
                </div>
            </div>
            <button class="view-capsule-btn">View Time Capsule</button>
        </div>
    `).join('');

    updatePagination();
}

function showCapsuleDetail(date) {
    const archive = allArchives.find(a => a.date === date);
    if (!archive) return;

    const modal = document.getElementById('capsuleModal');
    const detail = document.getElementById('capsuleDetail');

    detail.innerHTML = `
        <h2>Time Capsule - ${formatDate(date)}</h2>
        ${archive.memes.map(meme => `
            <div class="meme-detail">
                <div class="meme-rank">${getMedalEmoji(meme.rank)}</div>
                <h3>${meme.title}</h3>
                <div class="meme-image-placeholder">🖼️</div>
                <div class="meme-info">
                    <span>Nominated by: ${meme.nominator}</span>
                    <span>${meme.votes} votes</span>
                </div>
            </div>
        `).join('')}
        <div class="archive-stats" style="margin-top: 2rem;">
            <span class="stat-item">Total Votes: ${archive.totalVotes}</span>
            <span class="stat-item">Participants: ${archive.participants}</span>
        </div>
    `;

    modal.classList.add('active');
}

function getMedalEmoji(rank) {
    switch(rank) {
        case 1: return '🥇 Gold';
        case 2: return '🥈 Silver';
        case 3: return '🥉 Bronze';
        default: return '';
    }
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredArchives.length / itemsPerPage);
    const newPage = currentPage + direction;

    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderArchives();
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredArchives.length / itemsPerPage);
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

document.addEventListener('DOMContentLoaded', init);