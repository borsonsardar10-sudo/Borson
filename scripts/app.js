// FC Brothers Squad Builder App

// Sample Player Database
const playersDatabase = [
    // Goalkeepers
    { id: 1, name: 'Alisson', position: 'GK', ovr: 91, pace: 71, passing: 86, dribbling: 61, defense: 86, physical: 87, card: 'Gold' },
    { id: 2, name: 'Ederson', position: 'GK', ovr: 90, pace: 76, passing: 89, dribbling: 62, defense: 85, physical: 85, card: 'Gold' },
    
    // Defenders
    { id: 3, name: 'Van Dijk', position: 'CB', ovr: 92, pace: 78, passing: 78, dribbling: 45, defense: 93, physical: 86, card: 'Gold' },
    { id: 4, name: 'Rüdiger', position: 'CB', ovr: 87, pace: 78, passing: 75, dribbling: 50, defense: 89, physical: 88, card: 'Gold' },
    { id: 5, name: 'Cancelo', position: 'LB', ovr: 91, pace: 96, passing: 86, dribbling: 92, defense: 81, physical: 80, card: 'Gold' },
    { id: 6, name: 'Bellerin', position: 'RB', ovr: 84, pace: 90, passing: 73, dribbling: 78, defense: 79, physical: 77, card: 'Gold' },
    
    // Midfielders
    { id: 7, name: 'De Bruyne', position: 'CM', ovr: 94, pace: 76, passing: 93, dribbling: 95, defense: 61, physical: 78, card: 'Gold' },
    { id: 8, name: 'Rodri', position: 'CM', ovr: 89, pace: 77, passing: 91, dribbling: 83, defense: 89, physical: 83, card: 'Gold' },
    { id: 9, name: 'Benzema', position: 'ST', ovr: 94, pace: 79, passing: 82, dribbling: 87, defense: 35, physical: 79, card: 'Gold' },
    { id: 10, name: 'Haaland', position: 'ST', ovr: 89, pace: 96, passing: 68, dribbling: 86, defense: 24, physical: 94, card: 'Gold' },
    { id: 11, name: 'Messi', position: 'CF', ovr: 92, pace: 85, passing: 90, dribbling: 95, defense: 38, physical: 65, card: 'Gold' },
    { id: 12, name: 'Ronaldo', position: 'CF', ovr: 90, pace: 89, passing: 82, dribbling: 87, defense: 35, physical: 93, card: 'Gold' },
    { id: 13, name: 'Vinicius Jr', position: 'LM', ovr: 89, pace: 96, passing: 80, dribbling: 92, defense: 46, physical: 74, card: 'Gold' },
    { id: 14, name: 'Sane', position: 'RM', ovr: 86, pace: 96, passing: 79, dribbling: 88, defense: 40, physical: 68, card: 'Gold' },
];

// Formation Structures
const formations = {
    '4-3-3': {
        rows: [
            { label: 'GK', positions: ['GK'] },
            { label: 'DEF', positions: ['CB', 'CB', 'LB', 'RB'] },
            { label: 'MID', positions: ['CM', 'CM', 'CM'] },
            { label: 'ATK', positions: ['LM', 'ST', 'RM'] }
        ]
    },
    '4-2-3-1': {
        rows: [
            { label: 'GK', positions: ['GK'] },
            { label: 'DEF', positions: ['CB', 'CB', 'LB', 'RB'] },
            { label: 'MID', positions: ['CM', 'CM'] },
            { label: 'AM', positions: ['CM', 'CF', 'CM'] },
            { label: 'ATK', positions: ['ST'] }
        ]
    },
    '3-4-3': {
        rows: [
            { label: 'GK', positions: ['GK'] },
            { label: 'DEF', positions: ['CB', 'CB', 'CB'] },
            { label: 'MID', positions: ['LB', 'CM', 'CM', 'RB'] },
            { label: 'ATK', positions: ['CF', 'ST', 'CF'] }
        ]
    },
    '5-3-2': {
        rows: [
            { label: 'GK', positions: ['GK'] },
            { label: 'DEF', positions: ['CB', 'CB', 'CB', 'LB', 'RB'] },
            { label: 'MID', positions: ['CM', 'CM', 'CM'] },
            { label: 'ATK', positions: ['ST', 'ST'] }
        ]
    },
    '3-5-2': {
        rows: [
            { label: 'GK', positions: ['GK'] },
            { label: 'DEF', positions: ['CB', 'CB', 'CB'] },
            { label: 'MID', positions: ['LM', 'CM', 'CM', 'CM', 'RM'] },
            { label: 'ATK', positions: ['ST', 'ST'] }
        ]
    },
    '4-4-2': {
        rows: [
            { label: 'GK', positions: ['GK'] },
            { label: 'DEF', positions: ['CB', 'CB', 'LB', 'RB'] },
            { label: 'MID', positions: ['CM', 'CM', 'CM', 'CM'] },
            { label: 'ATK', positions: ['ST', 'ST'] }
        ]
    }
};

// App State
let appState = {
    selectedFormation: null,
    squad: {},
    currentFilter: {
        search: '',
        position: '',
        minOvr: 0
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadPlayersFromStorage();
    showToast('Welcome to FC Brothers! 🎮', 'success');
});

// Event Listeners
function initializeEventListeners() {
    document.getElementById('formationSelect').addEventListener('change', selectFormation);
    document.getElementById('playerSearch').addEventListener('input', filterPlayers);
    document.getElementById('positionFilter').addEventListener('change', filterPlayers);
    document.getElementById('ovrFilter').addEventListener('input', filterPlayers);
    document.getElementById('saveBtn').addEventListener('click', saveSquad);
    document.getElementById('shareBtn').addEventListener('click', shareSquad);
    document.getElementById('clearBtn').addEventListener('click', clearSquad);
    document.getElementById('randomBtn').addEventListener('click', randomSquad);
    
    // Modal close
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('playerModal');
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Formation Selection
function selectFormation(e) {
    const selectedFormation = e.target.value;
    if (!selectedFormation) return;
    
    appState.selectedFormation = selectedFormation;
    appState.squad = {};
    renderFormation();
    showToast(`Formation changed to ${selectedFormation}`, 'info');
}

// Render Formation
function renderFormation() {
    const formation = formations[appState.selectedFormation];
    const display = document.getElementById('formationDisplay');
    
    if (!formation) {
        display.innerHTML = '<p>Select a formation to start</p>';
        return;
    }
    
    let formationHTML = '<div class="formation-display">';
    let slotIndex = 0;
    
    formation.rows.forEach((row, rowIndex) => {
        formationHTML += '<div class="formation-row">';
        row.positions.forEach((pos, posIndex) => {
            const slotId = `slot-${slotIndex}`;
            const player = appState.squad[slotId];
            formationHTML += `
                <div class="player-slot ${player ? 'filled' : ''}" 
                     id="${slotId}" 
                     onclick="openPlayerSelector('${slotId}', '${pos}')"
                     title="${pos}">
                    ${player ? `
                        <img src="https://via.placeholder.com/70?text=${player.name.charAt(0)}" alt="${player.name}">
                        <div class="player-slot-ovr">${player.ovr}</div>
                    ` : `<div class="player-slot-label">${pos}</div>`}
                </div>
            `;
            slotIndex++;
        });
        formationHTML += '</div>';
    });
    
    formationHTML += '</div>';
    display.innerHTML = formationHTML;
    updateTeamStats();
}

// Filter Players
function filterPlayers() {
    appState.currentFilter.search = document.getElementById('playerSearch').value.toLowerCase();
    appState.currentFilter.position = document.getElementById('positionFilter').value;
    appState.currentFilter.minOvr = parseInt(document.getElementById('ovrFilter').value) || 0;
    
    const filtered = playersDatabase.filter(player => {
        const matchName = player.name.toLowerCase().includes(appState.currentFilter.search);
        const matchPos = !appState.currentFilter.position || player.position === appState.currentFilter.position;
        const matchOvr = player.ovr >= appState.currentFilter.minOvr;
        
        return matchName && matchPos && matchOvr;
    });
    
    displayPlayerList(filtered);
}

// Display Player List
function displayPlayerList(players) {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    
    players.forEach(player => {
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';
        playerItem.innerHTML = `
            <div class="player-item-name">${player.name}</div>
            <div class="player-item-info">${player.position} | OVR: ${player.ovr} | ${player.card}</div>
        `;
        playerItem.addEventListener('click', () => addPlayerToTemp(player));
        playerList.appendChild(playerItem);
    });
}

// Open Player Selector
let selectedSlotId = null;
let selectedPosition = null;

function openPlayerSelector(slotId, position) {
    if (!appState.selectedFormation) {
        showToast('Please select a formation first!', 'warning');
        return;
    }
    
    selectedSlotId = slotId;
    selectedPosition = position;
    
    const filtered = playersDatabase.filter(p => 
        p.position === position || 
        (position === 'ST' && (p.position === 'ST' || p.position === 'CF')) ||
        (position === 'CF' && (p.position === 'ST' || p.position === 'CF'))
    );
    
    displayModalPlayers(filtered);
    document.getElementById('playerModal').style.display = 'block';
}

// Display Modal Players
function displayModalPlayers(players) {
    const modalList = document.getElementById('modalPlayerList');
    modalList.innerHTML = '';
    
    players.forEach(player => {
        const card = document.createElement('div');
        card.className = 'modal-player-card';
        card.innerHTML = `
            <div style="font-weight: bold; color: #2a5298;">${player.name}</div>
            <div style="font-size: 0.9em; color: #666;">${player.position}</div>
            <div style="font-size: 1.2em; color: #ffd700; font-weight: bold;">OVR ${player.ovr}</div>
            <div style="font-size: 0.8em; margin-top: 5px;">${player.card}</div>
        `;
        card.addEventListener('click', () => selectPlayer(player));
        modalList.appendChild(card);
    });
}

// Add Player to Temp (from sidebar)
function addPlayerToTemp(player) {
    if (!appState.selectedFormation) {
        showToast('Please select a formation first!', 'warning');
        return;
    }
    showToast(`Added ${player.name} to your selection!`, 'success');
}

// Select Player from Modal
function selectPlayer(player) {
    if (selectedSlotId) {
        appState.squad[selectedSlotId] = player;
        renderFormation();
        closeModal();
        showToast(`${player.name} added to squad!`, 'success');
    }
}

// Close Modal
function closeModal() {
    document.getElementById('playerModal').style.display = 'none';
    selectedSlotId = null;
    selectedPosition = null;
}

// Update Team Statistics
function updateTeamStats() {
    const squad = Object.values(appState.squad);
    const squadCount = squad.length;
    const totalOVR = squad.reduce((sum, p) => sum + p.ovr, 0);
    const avgOVR = squadCount > 0 ? Math.round(totalOVR / squadCount) : 0;
    
    document.getElementById('teamOVR').textContent = squadCount > 0 ? avgOVR : '--';
    document.getElementById('squadDepth').textContent = `${squadCount}/11`;
    document.getElementById('chemistry').textContent = calculateChemistry(squad);
    document.getElementById('rankBoost').textContent = calculateRankBoost(squad);
    
    updateSquadSummary(squad);
}

// Calculate Chemistry (Simple: based on card types)
function calculateChemistry(squad) {
    if (squad.length === 0) return '--';
    const chemistry = Math.min(100, (squad.length / 11) * 100);
    return Math.round(chemistry) + '%';
}

// Calculate Rank Boost (Simple: based on average OVR)
function calculateRankBoost(squad) {
    if (squad.length === 0) return '--';
    const avgOVR = squad.reduce((sum, p) => sum + p.ovr, 0) / squad.length;
    
    if (avgOVR >= 90) return '5★';
    if (avgOVR >= 85) return '4★';
    if (avgOVR >= 80) return '3★';
    return '2★';
}

// Update Squad Summary
function updateSquadSummary(squad) {
    const summary = document.getElementById('squadSummary');
    summary.innerHTML = '';
    
    squad.forEach(player => {
        const item = document.createElement('div');
        item.className = 'squad-player';
        item.innerHTML = `
            <div class="squad-player-name">${player.name}</div>
            <div class="squad-player-ovr">${player.position} ${player.ovr}</div>
        `;
        item.addEventListener('click', () => removePlayer(player.id));
        summary.appendChild(item);
    });
}

// Remove Player from Squad
function removePlayer(playerId) {
    const slotToRemove = Object.keys(appState.squad).find(
        slot => appState.squad[slot].id === playerId
    );
    if (slotToRemove) {
        delete appState.squad[slotToRemove];
        renderFormation();
        showToast('Player removed from squad', 'info');
    }
}

// Clear Squad
function clearSquad() {
    if (confirm('Are you sure you want to clear the squad?')) {
        appState.squad = {};
        renderFormation();
        showToast('Squad cleared!', 'warning');
    }
}

// Random Squad
function randomSquad() {
    if (!appState.selectedFormation) {
        showToast('Please select a formation first!', 'warning');
        return;
    }
    
    const formation = formations[appState.selectedFormation];
    appState.squad = {};
    let slotIndex = 0;
    
    formation.rows.forEach(row => {
        row.positions.forEach(pos => {
            const slotId = `slot-${slotIndex}`;
            const matchingPlayers = playersDatabase.filter(p => 
                p.position === pos || 
                (pos === 'ST' && (p.position === 'ST' || p.position === 'CF')) ||
                (pos === 'CF' && (p.position === 'ST' || p.position === 'CF'))
            );
            
            if (matchingPlayers.length > 0) {
                const randomPlayer = matchingPlayers[Math.floor(Math.random() * matchingPlayers.length)];
                appState.squad[slotId] = randomPlayer;
            }
            slotIndex++;
        });
    });
    
    renderFormation();
    showToast('Random squad generated!', 'success');
}

// Save Squad
function saveSquad() {
    if (Object.keys(appState.squad).length === 0) {
        showToast('Please add players to your squad first!', 'warning');
        return;
    }
    
    localStorage.setItem('fcBrothersSquad', JSON.stringify(appState));
    showToast('Squad saved successfully! 💾', 'success');
}

// Load Squad from Storage
function loadPlayersFromStorage() {
    const saved = localStorage.getItem('fcBrothersSquad');
    if (saved) {
        try {
            appState = JSON.parse(saved);
            if (appState.selectedFormation) {
                document.getElementById('formationSelect').value = appState.selectedFormation;
                renderFormation();
            }
        } catch (e) {
            console.error('Failed to load squad:', e);
        }
    }
}

// Share Squad
function shareSquad() {
    if (Object.keys(appState.squad).length === 0) {
        showToast('Please add players to your squad first!', 'warning');
        return;
    }
    
    const squadData = btoa(JSON.stringify(appState));
    const shareLink = `${window.location.origin}?squad=${squadData}`;
    
    navigator.clipboard.writeText(shareLink).then(() => {
        showToast('Squad link copied to clipboard! 📤', 'success');
    }).catch(() => {
        showToast('Failed to copy link', 'error');
    });
}

// Toast Notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
