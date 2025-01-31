// Game state
let players = [];
let currentPlayerIndex = 0;
let currentSet = 1;
let gameInProgress = false;
let maxSets = 0;

// DOM Elements
const playerNameInput = document.getElementById('playerName');
const numSetsInput = document.getElementById('numSets');
const playersListDiv = document.getElementById('playersList');
const gameStatusDiv = document.getElementById('gameStatus');
const pointsInput = document.getElementById('points');
const submitButton = document.getElementById('submitButton');
const startButton = document.getElementById('startButton');

// Player class
class Player {
    constructor(name) {
        this.name = name;
        this.points = [];
        this.total = 0;
    }

    addPoints(points) {
        this.points.push(points);
        this.total += points;
    }
}

// Add player function
function addPlayer() {
    const name = playerNameInput.value.trim();
    if (name === '') {
        alert('Please enter a player name');
        return;
    }
    
    if (players.some(player => player.name === name)) {
        alert('Player already exists!');
        return;
    }

    players.push(new Player(name));
    playerNameInput.value = '';
    updatePlayersList();
}

// Update players list display
function updatePlayersList() {
    playersListDiv.innerHTML = players.map(player => {
        const pointsDisplay = player.points.length > 0 
            ? ` - Points: ${player.points.join(', ')} (Total: ${player.total})`
            : '';
        return `<div>${player.name}${pointsDisplay}</div>`;
    }).join('');
}

// Start game function
function startGame() {
    if (players.length < 2) {
        alert('Add at least 2 players to start the game');
        return;
    }

    maxSets = parseInt(numSetsInput.value);

    if (!maxSets || maxSets <= 0) {
        alert('Please enter a valid number for sets');
        return;
    }

    gameInProgress = true;
    currentPlayerIndex = 0;
    currentSet = 1;
    
    // Disable inputs and enable game controls
    playerNameInput.disabled = true;
    numSetsInput.disabled = true;
    startButton.disabled = true;
    pointsInput.disabled = false;
    submitButton.disabled = false;

    updateGameStatus();
}

// Submit points function
function submitPoints() {
    const points = parseInt(pointsInput.value);
    
    if (isNaN(points) || points < 0) {
        alert('Please enter a valid number of points');
        return;
    }

    const currentPlayer = players[currentPlayerIndex];
    currentPlayer.addPoints(points);
    pointsInput.value = '';
    
    // Move to next player or set
    currentPlayerIndex++;
    if (currentPlayerIndex >= players.length) {
        currentPlayerIndex = 0;
        currentSet++;
    }

    // Check if game is over
    if (currentSet > maxSets) {
        endGame();
    } else {
        updateGameStatus();
    }
    
    updatePlayersList();
}

// Update game status display
function updateGameStatus() {
    const currentPlayer = players[currentPlayerIndex];
    gameStatusDiv.textContent = `Set ${currentSet}/${maxSets} - ${currentPlayer.name}'s turn`;
}

// End game function
function endGame() {
    gameInProgress = false;
    pointsInput.disabled = true;
    submitButton.disabled = true;
    
    // Find winner(s) - player with least points wins
    const minTotal = Math.min(...players.map(p => p.total));
    const winners = players.filter(p => p.total === minTotal);
    
    const winnerText = winners.length > 1 
        ? `It's a tie between ${winners.map(w => w.name).join(' and ')}!`
        : `${winners[0].name} wins with the lowest score of ${minTotal} points!`;
        
    gameStatusDiv.innerHTML = `Game Over! ${winnerText}<br>
        Click refresh to start a new game`;
}

// Event listeners for Enter key
playerNameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addPlayer();
});

pointsInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !submitButton.disabled) submitPoints();
});
