let playInterval;
let gameTimer;
const GAME_DURATION = 20000;  // 20 seconds




window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);


let level = 1;
const LEVELS = {
    1: {color: 'black', scoreRequired: 50},
    2: {color: 'green', scoreRequired: 60},
    3: {color: 'blue', scoreRequired: 70},
    4: {color: 'purple', scoreRequired: 80},
    5: {color: 'pink', scoreRequired: 100}
};


const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const CELL_SIZE = 10;
const COLS = Math.floor(CANVAS_WIDTH / CELL_SIZE);
const ROWS = Math.floor(CANVAS_HEIGHT / CELL_SIZE);
const PHOTOGRAPHER_SIZE = 2;  // 2x2 blocks

let board = [];
let isPlaying = false;
let photographer = { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 6), direction: 'up' }


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const timerElement = document.getElementById('gameTimer');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startPlay);

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', restartGame);


let score = 0;
const scoreElement = document.getElementById('scoreDisplay'); // Getting reference to the div
scoreElement.textContent = "Score: " + score;
document.body.appendChild(scoreElement);  // Appending the score element to the body of the document


initializeBoard();
drawBoard();
if (checkCollision()) {
    endGame();
}


function initializeBoard() {
    board = new Array(COLS).fill(null).map(() => new Array(ROWS).fill(0));
}

let photographedCells = [];
function initializePhotographedCells() {
    photographedCells = new Array(COLS).fill(null).map(() => new Array(ROWS).fill(false));
}
initializePhotographedCells();


function drawBoard() {
    for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
            drawCell(x, y, board[x][y]);
        }
    }
    drawPhotographer();
}


function drawCell(x, y, state) {
    ctx.fillStyle = state ? LEVELS[level].color : 'white';
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}


function drawPhotographer() {
    ctx.fillStyle = 'blue';
    for (let i = 0; i < PHOTOGRAPHER_SIZE; i++) {
        for (let j = 0; j < PHOTOGRAPHER_SIZE; j++) {
            ctx.fillRect((photographer.x + i) * CELL_SIZE, (photographer.y + j) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }


function endGame() {
    clearInterval(playInterval);
    clearInterval(gameTimer);
    isPlaying = false;
    if (photographer.x === -1) {
        alert("You've been caught!");
        level = 1;  // Reset level to 1 if player dies
    } else {
        alert("Time's up!");
        if (score >= LEVELS[level].scoreRequired && level < 5) {
            level++;
            alert("Great pictures! You've made it to Level " + level);
        } else if (level == 5 && score >= LEVELS[level].scoreRequired) {
            alert("Congratulations! Your pictures are a SENSATION - you've won the game!");
        }
    }
    restartGame();
}

    }
    drawCamera();
}

function isPhotographerPosition(x, y) {
    if (x >= photographer.x && x < photographer.x + PHOTOGRAPHER_SIZE &&
        y >= photographer.y && y < photographer.y + PHOTOGRAPHER_SIZE) {
        return true;
    }
    return false;
}


function drawCamera() {
    ctx.fillStyle = 'orange';
    switch (photographer.direction) {
        case "up":
            ctx.fillRect(photographer.x * CELL_SIZE, (photographer.y - 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            break;
        case "down":
            ctx.fillRect((photographer.x + 1) * CELL_SIZE, (photographer.y + PHOTOGRAPHER_SIZE) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            break;
        case "left":
            ctx.fillRect((photographer.x - 1) * CELL_SIZE, (photographer.y + 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            break;
        case "right":
            ctx.fillRect((photographer.x + PHOTOGRAPHER_SIZE) * CELL_SIZE, photographer.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            break;
    }
}

function movePhotographer(event) {
    // Don't allow movement if the game is not active
    if (!isPlaying) return;

    switch (event.keyCode) {
        case 37:  // Arrow Left
            if (photographer.x > 0) photographer.x--;
            photographer.direction = "left";
            break;
        case 38:  // Arrow Up
            if (photographer.y > 0) photographer.y--;
            photographer.direction = "up";
            break;
        case 39:  // Arrow Right
            if (photographer.x < COLS - PHOTOGRAPHER_SIZE) photographer.x++;
            photographer.direction = "right";
            break;
        case 40:  // Arrow Down
            if (photographer.y < ROWS - PHOTOGRAPHER_SIZE) photographer.y++;
            photographer.direction = "down";
            break;
        case 32:  // Spacebar
            flashCamera();
            return;
    }
    
    if (checkCollision()) {
        endGame("Oh no! An animal caught the photographer!");
        return;
    }

    drawBoard();
}


function checkCollision() {
    for (let i = 0; i < PHOTOGRAPHER_SIZE; i++) {
        for (let j = 0; j < PHOTOGRAPHER_SIZE; j++) {
            if (board[photographer.x + i][photographer.y + j] === 1) {
                return true;
            }
        }
    }
    return false;
}




function flashCamera() {
    let cameraX = photographer.x;
    let cameraY = photographer.y;

    // Adjusting the origin based on the direction photographer is facing
    switch (photographer.direction) {
        case "up":
            cameraY = photographer.y - 1;
            break;
        case "down":
            cameraY = photographer.y + 1;
            break;
        case "left":
            cameraX = photographer.x - 1;
            break;
        case "right":
            cameraX = photographer.x + 1;
            break;
    }

    const checkAndScore = (x, y) => {
        if (x >= 0 && x < COLS && y >= 0 && y < ROWS && board[x][y] === 1 && !photographedCells[x][y]) {
            score++;
            photographedCells[x][y] = true;
        }
    };

    // Emitting flash from the camera's position
    switch (photographer.direction) {
        case "up":
            for (let i = 1; i <= 5; i++) {
                for (let j = -i; j <= i; j++) {
                    ctx.fillStyle = 'yellow';
                    ctx.fillRect((cameraX + j) * CELL_SIZE, (cameraY - i) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    checkAndScore(cameraX + j, cameraY - i);
                }
            }
            break;
        case "down":
            for (let i = 1; i <= 5; i++) {
                for (let j = -i; j <= i; j++) {
                    ctx.fillStyle = 'yellow';
                    ctx.fillRect((cameraX + j) * CELL_SIZE, (cameraY + i) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    checkAndScore(cameraX + j, cameraY + i);
                }
            }
            break;
        case "left":
            for (let i = 1; i <= 5; i++) {
                for (let j = -i; j <= i; j++) {
                    ctx.fillStyle = 'yellow';
                    ctx.fillRect((cameraX - i) * CELL_SIZE, (cameraY + j) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    checkAndScore(cameraX - i, cameraY + j);
                }
            }
            break;
        case "right":
            for (let i = 1; i <= 5; i++) {
                for (let j = -i; j <= i; j++) {
                    ctx.fillStyle = 'yellow';
                    ctx.fillRect((cameraX + i) * CELL_SIZE, (cameraY + j) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    checkAndScore(cameraX + i, cameraY + j);
                }
            }
            break;
    }

    scoreElement.textContent = "Score: " + score;
    setTimeout(drawBoard, 100);  // Clear the flash after a short duration
}



function populateWithAnimals() {
    // Start from the upper 1/3 of the board
    const startY = Math.floor(ROWS / 3);

    for (let x = 0; x < COLS; x++) {
        for (let y = startY; y < ROWS; y++) {
            board[x][y] = Math.random() < 0.5 ? 1 : 0;  // Randomly assign black squares
        }
    }
}

ctx.fillStyle = LEVELS[level].color;


function restartGame() {
    clearInterval(playInterval);
    clearInterval(gameTimer);
    isPlaying = false;
    timeLeft = 20;  // Reset the timer to 20 seconds
    timerElement.textContent = "Time: " + timeLeft;
    initializeBoard();
    populateWithAnimals();
    photographer = { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 6), direction: 'up' };  // Reset photographer's position
    drawBoard();
    score = 0;
    scoreElement.textContent = "Score: " + score;
    
    // Reset photographedCells array
    photographedCells = Array(COLS).fill().map(() => Array(ROWS).fill(false));
}







function startPlay() {
    if (!isPlaying) {
        isPlaying = true;
        playInterval = setInterval(nextGen, 100);

        // Clear any existing timers to ensure there's no overlap
        clearInterval(gameTimer);

        // Reset the timer to 20 seconds
        timeLeft = 20; 
        timerElement.textContent = "Time: " + timeLeft;

        // Start the timer
        gameTimer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timerElement.textContent = "Time: " + timeLeft;
            } else {
                clearInterval(gameTimer);
                endGame("Time's up!");
            }
        }, 1000);
    } else {
        return;
    }
}




function buildEmptyBoard() {
    return new Array(COLS).fill(null).map(() => new Array(ROWS).fill(0));
}

function getAliveNeighbors(x, y) {
    const directions = [
        [-1, -1], [0, -1], [1, -1],
        [-1, 0],           [1, 0],
        [-1, 1], [0, 1], [1, 1]
    ];

    let count = 0;

    for (let dir of directions) {
        const newX = x + dir[0];
        const newY = y + dir[1];
        if (newX >= 0 && newY >= 0 && newX < COLS && newY < ROWS) {
            if (isPhotographerPosition(newX, newY)) {
                // If it's a photographer's position, ignore it.
                continue;
            }
            if (board[newX][newY]) {
                count++;
            }
        }
    }

    return count;
}



function nextGen() {
    let newBoard = buildEmptyBoard();

    for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
            const neighbors = getAliveNeighbors(x, y);
            
            if (board[x][y] && (neighbors === 2 || neighbors === 3)) {
                newBoard[x][y] = 1;
            } else if (!board[x][y] && neighbors === 3) {
                newBoard[x][y] = 1;
            }
        }
    }

    board = newBoard;

    for (let px = photographer.x; px < photographer.x + PHOTOGRAPHER_SIZE; px++) {
        for (let py = photographer.y; py < photographer.y + PHOTOGRAPHER_SIZE; py++) {
            if (board[px][py] == 1) { 
                endGame("You were caught by an animal!");
                return;
            }
        }
    }

    drawBoard();
}


function startTimer() {
    let timeRemaining = GAME_DURATION / 1000;  // in seconds
    timerElement.textContent = timeRemaining + " seconds left";

    let timerInterval = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = timeRemaining + " seconds left";
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}



function endGame(message) {
    clearInterval(playInterval);
    clearInterval(gameTimer);
    isPlaying = false;
    const currentLevelData = LEVELS[level];
if (score >= currentLevelData.scoreRequired) {
    if (level < 5) {
        level++;
        alert("Great pictures! You've completed Level " + (level - 1) + ". Welcome to Level " + level + ".");
        restartGame();
    } else {
        alert("Congratulations! Your pictures are a SENSATION - you've won the game!");
        level = 1; // Resetting the game to Level 1 after winning
        restartGame();
    }
} else {
    alert(message || "Time's up!");
    level = 1; // Resetting the game to Level 1 if score is not sufficient to progress
    restartGame();
}

}






document.addEventListener('keydown', movePhotographer);
