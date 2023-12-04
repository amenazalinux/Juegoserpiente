const boardSize = 20;
const board = document.getElementById('board');
const playerCountSelect = document.getElementById('playerCount');
const rollDiceButton = document.getElementById('rollDice');
const diceResultDisplay = document.getElementById('diceResult');

const players = [];
let currentPlayerIndex = 0;

let traps;

function createBoard() {
    for (let i = 0; i < boardSize * boardSize; i++) {
        const square = document.createElement('div');
        square.className = 'square';
        square.dataset.position = i + 1;

        if (traps.includes(i + 1)) {
            square.classList.add('trap');
            const trapButtons = document.createElement('div');
            trapButtons.className = 'trap-buttons';
            const noPenaltyButton = document.createElement('button');
            noPenaltyButton.textContent = 'Verdad';
            noPenaltyButton.addEventListener('click', () => handleTrapDecision(i + 1, false));
            const penaltyButton = document.createElement('button');
            penaltyButton.textContent = 'Reto';
            penaltyButton.addEventListener('click', () => handleTrapDecision(i + 1, true));
            trapButtons.appendChild(noPenaltyButton);
            trapButtons.appendChild(penaltyButton);
            square.appendChild(trapButtons);
        } else {
            square.classList.add('path');
        }

        board.appendChild(square);
    }
}

function createPlayers(count) {
    const playerColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
    for (let i = 0; i < count; i++) {
        const player = document.createElement('div');
        player.className = 'player';
        player.style.backgroundColor = playerColors[i % playerColors.length];
        players.push({ position: 1, element: player, penalty: false });
        document.querySelector(`[data-position="1"]`).appendChild(player);
    }
}

function updatePlayers() {
    players.forEach(player => {
        const newPosition = player.position;
        const newSquare = document.querySelector(`[data-position="${newPosition}"]`);
        newSquare.appendChild(player.element);
        if (player.penalty) {
            player.element.style.opacity = 0.5;
        } else {
            player.element.style.opacity = 1;
        }
    });
}

function lanzarDado() {
    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer.penalty) {
        currentPlayer.penalty = false;
        nextTurn();
        return;
    }

    const dado = Math.floor(Math.random() * 6) + 1;
    diceResultDisplay.textContent = `Dado: ${dado}`;

    currentPlayer.position += dado;

    if (traps.includes(currentPlayer.position)) {
        showTrapButtons(currentPlayer.position);
        rollDiceButton.disabled = true;
    }

    if (currentPlayer.position >= boardSize * boardSize) {
        alert(`¡Felicidades, el jugador ${currentPlayerIndex + 1} ha ganado!`);
        currentPlayer.position = 1;
    }

    updatePlayers();
    nextTurn();
}

function handleTrapDecision(position, penalty) {
    hideTrapButtons(position);
    const currentPlayer = players[currentPlayerIndex];
    currentPlayer.penalty = penalty;
    rollDiceButton.disabled = false;

    if (penalty) {
        const previousPlayerIndex = currentPlayerIndex;
        nextTurn();
        currentPlayerIndex = previousPlayerIndex;
    }
}

function showTrapButtons(position) {
    const square = document.querySelector(`[data-position="${position}"]`);
    const trapButtons = square.querySelector('.trap-buttons');
    trapButtons.style.display = 'flex';
}

function hideTrapButtons(position) {
    const square = document.querySelector(`[data-position="${position}"]`);
    const trapButtons = square.querySelector('.trap-buttons');
    trapButtons.style.display = 'none';
}

function nextTurn() {
    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer.penalty) {
        currentPlayer.penalty = false;
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    } else {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        updatePlayers();
    }
}

function generateRandomTraps(count) {
    const traps = [];
    for (let i = 0; i < count; i++) {
        let trapPosition;
        do {
            trapPosition = Math.floor(Math.random() * (boardSize * boardSize)) + 1;
        } while (traps.includes(trapPosition));
        traps.push(trapPosition);
    }
    return traps;
}

playerCountSelect.addEventListener('change', () => {
    players.forEach(player => player.element.remove());
    players.length = 0;
    createPlayers(Number(playerCountSelect.value));
    updatePlayers();
});

rollDiceButton.addEventListener('click', lanzarDado);

traps = generateRandomTraps(50);
createBoard();
createPlayers(1);
updatePlayers();
