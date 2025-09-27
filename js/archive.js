let currentPage = 1;
const itemsPerPage = 9;
let allArchives = [];
let filteredArchives = [];

// Archives will be loaded from the API
const sampleArchives = [];

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

async function loadArchives() {
    try {
        // Fetch real archives from API
        const response = await fetch('/api/get-archives.php');
        const data = await response.json();

        if (data.success) {
            allArchives = data.archives || [];
        } else {
            console.error('Archives API error:', data.error);
            allArchives = [];
        }

        filteredArchives = [...allArchives];
        renderArchives();

        // Show message if no archives yet
        if (allArchives.length === 0) {
            const grid = document.getElementById('archiveGrid');
            grid.innerHTML = `
                <div class="loading-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <p style="font-size: 1.3rem; color: var(--color-ink); font-family: var(--font-heading); margin-bottom: 20px;">
                        🚀 No archives yet!
                    </p>
                    <p style="color: var(--color-ink-light); font-family: var(--font-body);">
                        The first time capsule will be created at 20:00 UTC today.
                    </p>
                    <p style="color: var(--color-ink-light); font-family: var(--font-body); margin-top: 10px;">
                        Come back after the first voting cycle!
                    </p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading archives:', error);
        const grid = document.getElementById('archiveGrid');
        grid.innerHTML = '<div class="loading-state"><p>Error loading archives</p></div>';
    }
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