const playButton = document.getElementById('play-snake');
const instructionParagraph = document.querySelector('.game-snake p');
const gameContainer = document.getElementById('snake-game-container');

// Game constants
const unitSize = 20;
const boardBackgroundColor = '#686666';
const snakeColor = '#00FF00';
const snakeBorderColor = '#000000';
const foodColor = '#FF0000';
const foodBorderColor = '#000000';

// Game variables
let score = 0;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let snake = [
    { x: unitSize * 4, y: 200 },
    { x: unitSize * 3, y: 200 },
    { x: unitSize * 2, y: 200 },
    { x: unitSize, y: 200 },
    { x: 0, y: 200 }
];

// Canvas variables (initialized after canvas is created)
let gameboard;
let ctx;
let gameWidth;
let gameHeight;

window.addEventListener('keydown', changeDirection);


playButton.addEventListener('click', () => {
    // Remove the play button
    instructionParagraph.remove();
    playButton.remove();
    // Create the canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'snake-canvas';
    canvas.width = 500;
    canvas.height = 500;
    canvas.style.border = '3px solid black';
    document.getElementById('snake-game-container').appendChild(canvas);

    // Get canvas context after it's created
    gameboard = document.getElementById('snake-canvas');
    ctx = gameboard.getContext('2d');
    gameWidth = gameboard.width;
    gameHeight = gameboard.height;


    // Create score display element
    const scoreDisplay = document.createElement('p');
    scoreDisplay.id = 'score-display';
    scoreDisplay.textContent = `Score: ${score}`;
    document.getElementById('snake-game-container').appendChild(scoreDisplay);

    // Start game after 2 second delay
    setTimeout(() => {
        gameStart();
    }, 2000);

});

function gameStart() {
    running = true;
    score = 0;
    createFood();
    drawFood();
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 100);
    }
    else {
        displayGameOver();
    }
}

function clearBoard() {
    ctx.fillStyle = boardBackgroundColor;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

function createFood() {
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};

function moveSnake() {
    const head = {x: snake[0].x + xVelocity, y: snake[0].y + yVelocity};

    snake.unshift(head);

    // Check if snake has eaten the food
    if (snake[0].x === foodX && snake[0].y === foodY) {
        score++;
        document.getElementById('score-display').textContent = `Score: ${score}`;
        createFood();
    }
    else {
        snake.pop();
    }
};

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorderColor;
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, unitSize, unitSize);
        ctx.strokeRect(part.x, part.y, unitSize, unitSize);
    })
};

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const W = 87;
    const A = 65;
    const S = 83;
    const D = 68;

    const goingUp = (yVelocity === -unitSize);
    const goingDown = (yVelocity === unitSize);
    const goingRight = (xVelocity === unitSize);
    const goingLeft = (xVelocity === -unitSize);

    switch (true) {
        case (keyPressed === A && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === W && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case (keyPressed === D && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === S && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
};

function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
        case (snake[0].x >= gameWidth):
        case (snake[0].y < 0):
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
        }
}
};

function displayGameOver() {
    // Clear the board
    ctx.fillStyle = boardBackgroundColor;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
    
    // Clear the game container
    gameContainer.innerHTML = '';
    
    // Display score
    const finalScoreDisplay = document.createElement('p');
    finalScoreDisplay.textContent = `Final Score: ${score}`;
    finalScoreDisplay.style.textAlign = 'center';
    finalScoreDisplay.style.fontSize = '1.5rem';
    finalScoreDisplay.style.marginBottom = '1rem';
    gameContainer.appendChild(finalScoreDisplay);
    
    // Create textbox for name input
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'player-name';
    nameInput.placeholder = 'Enter your name';
    nameInput.style.display = 'block';
    nameInput.style.margin = '1rem auto';
    nameInput.style.padding = '0.5rem';
    nameInput.style.textAlign = 'center';
    gameContainer.appendChild(nameInput);
    
    // Create buttons container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '1rem';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.marginTop = '1rem';
    
    // Create Save Score button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Score';
    saveButton.className = 'game-button';
    saveButton.addEventListener('click', () => {
        const playerName = nameInput.value.trim();
        
        // Validate name - only letters and spaces allowed
        const nameRegex = /^[a-zA-Z\s]+$/;
        
        if (playerName === '') {
            alert('Please enter your name!');
            return;
        }
        
        if (!nameRegex.test(playerName)) {
            alert('Error: Name can only contain letters and spaces. No numbers or special characters allowed!');
            return;
        }
        
        // If validation passes, save the score
        console.log(`Saving score: ${playerName} - ${score}`);
        // Add score saving logic here
    });
    buttonContainer.appendChild(saveButton);
    
    // Create Play Again button
    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play Again';
    playAgainButton.className = 'game-button';
    playAgainButton.addEventListener('click', () => {
        // Reset game variables
        score = 0;
        xVelocity = unitSize;
        yVelocity = 0;
        snake = [
            { x: unitSize * 4, y: 200 },
            { x: unitSize * 3, y: 200 },
            { x: unitSize * 2, y: 200 },
            { x: unitSize, y: 200 },
            { x: 0, y: 200 }
        ];
        
        // Clear the game container (removes final score, textbox, and all buttons)
        gameContainer.innerHTML = '';
        
        // Recreate the game UI
        const canvas = document.createElement('canvas');
        canvas.id = 'snake-canvas';
        canvas.width = 500;
        canvas.height = 500;
        canvas.style.border = '3px solid black';
        gameContainer.appendChild(canvas);

        // Get canvas context after it's created
        gameboard = document.getElementById('snake-canvas');
        ctx = gameboard.getContext('2d');
        gameWidth = gameboard.width;
        gameHeight = gameboard.height;

        // Create score display element
        const scoreDisplay = document.createElement('p');
        scoreDisplay.id = 'score-display';
        scoreDisplay.textContent = `Score: ${score}`;
        gameContainer.appendChild(scoreDisplay);

        // Start game after 2 second delay
        setTimeout(() => {
            gameStart();
        }, 2000);
    });
    buttonContainer.appendChild(playAgainButton);
    
    // Create Exit button
    const exitButton = document.createElement('button');
    exitButton.textContent = 'Exit';
    exitButton.className = 'game-button';
    exitButton.addEventListener('click', () => {
        // Clear the game container
        gameContainer.innerHTML = '';
        
        // Restore the original paragraph
        const newParagraph = document.createElement('p');
        newParagraph.textContent = 'Click the button below to play snake.';
        document.querySelector('.game-snake').insertBefore(newParagraph, gameContainer);
        
        // Restore the play button
        const newPlayButton = document.createElement('button');
        newPlayButton.id = 'play-snake';
        newPlayButton.textContent = 'Play Snake';
        gameContainer.appendChild(newPlayButton);
        
        // Re-attach the click event listener to the new play button
        newPlayButton.addEventListener('click', () => {
            newParagraph.remove();
            newPlayButton.remove();
            
            const canvas = document.createElement('canvas');
            canvas.id = 'snake-canvas';
            canvas.width = 500;
            canvas.height = 500;
            canvas.style.border = '3px solid black';
            gameContainer.appendChild(canvas);
            
            gameboard = document.getElementById('snake-canvas');
            ctx = gameboard.getContext('2d');
            gameWidth = gameboard.width;
            gameHeight = gameboard.height;
            
            const scoreDisplay = document.createElement('p');
            scoreDisplay.id = 'score-display';
            scoreDisplay.textContent = `Score: ${score}`;
            gameContainer.appendChild(scoreDisplay);
            
            setTimeout(() => {
                gameStart();
            }, 2000);
        });
    });
    buttonContainer.appendChild(exitButton);
    
    gameContainer.appendChild(buttonContainer);
};
