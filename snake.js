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

// SnakeGame class to encapsulate all game logic
class SnakeGame {
    constructor(container) {
        this.container = container;
        this.unitSize = unitSize;
        this.boardBackgroundColor = boardBackgroundColor;
        this.snakeColor = snakeColor;
        this.snakeBorderColor = snakeBorderColor;
        this.foodColor = foodColor;
        this.foodBorderColor = foodBorderColor;
        
        // Game state variables
        this.score = 0;
        this.running = false;
        this.xVelocity = this.unitSize;
        this.yVelocity = 0;
        this.foodX = 0;
        this.foodY = 0;
        this.snake = [
            { x: this.unitSize * 4, y: 200 },
            { x: this.unitSize * 3, y: 200 },
            { x: this.unitSize * 2, y: 200 },
            { x: this.unitSize, y: 200 },
            { x: 0, y: 200 }
        ];
        
        // Canvas variables
        this.gameboard = null;
        this.ctx = null;
        this.gameWidth = 0;
        this.gameHeight = 0;
        
        // High scores array
        this.highScores = [];
        
        // Bind the changeDirection method to this instance
        this.changeDirection = this.changeDirection.bind(this);
    }
    
    initializeCanvas() {
        // Create controls instruction paragraph
        const controlsParagraph = document.createElement('p');
        controlsParagraph.textContent = 'Controls: W, A, S, D';
        controlsParagraph.style.textAlign = 'center';
        controlsParagraph.style.marginBottom = '1rem';
        this.container.appendChild(controlsParagraph);
        
        // Create the canvas element
        const canvas = document.createElement('canvas');
        canvas.id = 'snake-canvas';
        canvas.width = 500;
        canvas.height = 500;
        canvas.style.border = '3px solid black';
        this.container.appendChild(canvas);

        // Get canvas context after it's created
        this.gameboard = document.getElementById('snake-canvas');
        this.ctx = this.gameboard.getContext('2d');
        this.gameWidth = this.gameboard.width;
        this.gameHeight = this.gameboard.height;

        // Create score display element
        const scoreDisplay = document.createElement('p');
        scoreDisplay.id = 'score-display';
        scoreDisplay.textContent = `Score: ${this.score}`;
        this.container.appendChild(scoreDisplay);
    }
    
    gameStart() {
        this.running = true;
        this.score = 0;
        // Add event listener when game starts
        window.addEventListener('keydown', this.changeDirection);
        this.createFood();
        this.drawFood();
        this.nextTick();
    }
    
    nextTick() {
        if (this.running) {
            setTimeout(() => {
                this.clearBoard();
                this.drawFood();
                this.moveSnake();
                this.drawSnake();
                this.checkGameOver();
                this.nextTick();
            }, 100);
        }
        else {
            this.displayGameOver();
        }
    }
    
    clearBoard() {
        this.ctx.fillStyle = this.boardBackgroundColor;
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
    }
    
    createFood() {
        const randomFood = (min, max) => {
            const randNum = Math.round((Math.random() * (max - min) + min) / this.unitSize) * this.unitSize;
            return randNum;
        };
        this.foodX = randomFood(0, this.gameWidth - this.unitSize);
        this.foodY = randomFood(0, this.gameHeight - this.unitSize);
    }
    
    drawFood() {
        this.ctx.fillStyle = this.foodColor;
        this.ctx.strokeStyle = this.foodBorderColor;
        this.ctx.fillRect(this.foodX, this.foodY, this.unitSize, this.unitSize);
        this.ctx.strokeRect(this.foodX, this.foodY, this.unitSize, this.unitSize);
    }
    
    moveSnake() {
        const head = {x: this.snake[0].x + this.xVelocity, y: this.snake[0].y + this.yVelocity};

        this.snake.unshift(head);

        // Check if snake has eaten the food
        if (this.snake[0].x === this.foodX && this.snake[0].y === this.foodY) {
            this.score++;
            document.getElementById('score-display').textContent = `Score: ${this.score}`;
            this.createFood();
        }
        else {
            this.snake.pop();
        }
    }
    
    drawSnake() {
        this.ctx.fillStyle = this.snakeColor;
        this.ctx.strokeStyle = this.snakeBorderColor;
        this.snake.forEach(part => {
            this.ctx.fillRect(part.x, part.y, this.unitSize, this.unitSize);
            this.ctx.strokeRect(part.x, part.y, this.unitSize, this.unitSize);
        });
    }
    
    changeDirection(event) {
        const keyPressed = event.keyCode;
        const W = 87;
        const A = 65;
        const S = 83;
        const D = 68;

        const goingUp = (this.yVelocity === -this.unitSize);
        const goingDown = (this.yVelocity === this.unitSize);
        const goingRight = (this.xVelocity === this.unitSize);
        const goingLeft = (this.xVelocity === -this.unitSize);

        switch (true) {
            case (keyPressed === A && !goingRight):
                this.xVelocity = -this.unitSize;
                this.yVelocity = 0;
                break;
            case (keyPressed === W && !goingDown):
                this.xVelocity = 0;
                this.yVelocity = -this.unitSize;
                break;
            case (keyPressed === D && !goingLeft):
                this.xVelocity = this.unitSize;
                this.yVelocity = 0;
                break;
            case (keyPressed === S && !goingUp):
                this.xVelocity = 0;
                this.yVelocity = this.unitSize;
                break;
        }
    }
    
    checkGameOver() {
        switch (true) {
            case (this.snake[0].x < 0):
            case (this.snake[0].x >= this.gameWidth):
            case (this.snake[0].y < 0):
            case (this.snake[0].y >= this.gameHeight):
                this.running = false;
                break;
        }
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) {
                this.running = false;
            }
        }
    }
    
    resetGame() {
        this.score = 0;
        this.xVelocity = this.unitSize;
        this.yVelocity = 0;
        this.snake = [
            { x: this.unitSize * 4, y: 200 },
            { x: this.unitSize * 3, y: 200 },
            { x: this.unitSize * 2, y: 200 },
            { x: this.unitSize, y: 200 },
            { x: 0, y: 200 }
        ];
        this.container.innerHTML = '';
        this.initializeCanvas();
        setTimeout(() => {
            this.gameStart();
        }, 2000);
    }
    
    displayGameOver() {
        // Remove event listener when game ends
        window.removeEventListener('keydown', this.changeDirection);
        
        // Clear the board
        this.ctx.fillStyle = this.boardBackgroundColor;
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        // Clear the game container
        this.container.innerHTML = '';
        
        // Display score
        const finalScoreDisplay = document.createElement('p');
        finalScoreDisplay.textContent = `Final Score: ${this.score}`;
        finalScoreDisplay.style.textAlign = 'center';
        finalScoreDisplay.style.fontSize = '1.5rem';
        finalScoreDisplay.style.marginBottom = '1rem';
        this.container.appendChild(finalScoreDisplay);
        
        // Create textbox for name input
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'player-name';
        nameInput.placeholder = 'Enter your name';
        nameInput.style.display = 'block';
        nameInput.style.margin = '1rem auto';
        nameInput.style.padding = '0.5rem';
        nameInput.style.textAlign = 'center';
        this.container.appendChild(nameInput);
        
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
            this.highScores.push({ name: playerName, score: this.score });
            // Sort by highest score
            this.highScores.sort((a, b) => b.score - a.score);
            // Display the high scores
            this.displayHighScores();
        });
        buttonContainer.appendChild(saveButton);
        
        // Create Play Again button
        const playAgainButton = document.createElement('button');
        playAgainButton.textContent = 'Play Again';
        playAgainButton.className = 'game-button';
        playAgainButton.addEventListener('click', () => {
            this.resetGame();
        });
        buttonContainer.appendChild(playAgainButton);
        
        // Create Exit button
        const exitButton = document.createElement('button');
        exitButton.textContent = 'Exit';
        exitButton.className = 'game-button';
        exitButton.addEventListener('click', () => {
            // Clear the game container
            this.container.innerHTML = '';
            
            // Restore the original paragraph
            const newParagraph = document.createElement('p');
            newParagraph.textContent = 'Click the button below to play snake.';
            document.querySelector('.game-snake').insertBefore(newParagraph, this.container);
            
            // Restore the play button
            const newPlayButton = document.createElement('button');
            newPlayButton.id = 'play-snake';
            newPlayButton.textContent = 'Play Snake';
            this.container.appendChild(newPlayButton);
            
            // Re-attach the click event listener to the new play button
            newPlayButton.addEventListener('click', () => {
                newParagraph.remove();
                newPlayButton.remove();
                this.resetGame();
            });
        });
        buttonContainer.appendChild(exitButton);
        
        this.container.appendChild(buttonContainer);
    }
    
    displayHighScores() {
        // Check if high scores display already exists, if so remove it
        const existingScores = document.getElementById('high-scores-display');
        if (existingScores) {
            existingScores.remove();
        }
        
        // Create high scores display
        const scoresContainer = document.createElement('div');
        scoresContainer.id = 'high-scores-display';
        scoresContainer.style.textAlign = 'center';
        scoresContainer.style.marginTop = '1rem';
        
        const scoresTitle = document.createElement('h3');
        scoresTitle.textContent = 'High Scores';
        scoresTitle.style.marginBottom = '0.5rem';
        scoresContainer.appendChild(scoresTitle);
        
        const scoresList = document.createElement('ul');
        scoresList.style.listStyle = 'none';
        scoresList.style.padding = '0';
        
        this.highScores.forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
            listItem.style.marginBottom = '0.25rem';
            scoresList.appendChild(listItem);
        });
        
        scoresContainer.appendChild(scoresList);
        
        // Insert after final score display but before buttons
        const finalScore = this.container.querySelector('p');
        if (finalScore && finalScore.nextSibling) {
            this.container.insertBefore(scoresContainer, finalScore.nextSibling);
        } else {
            this.container.insertBefore(scoresContainer, this.container.firstChild);
        }
    }
}

// Initialize game when play button is clicked
let game;

playButton.addEventListener('click', () => {
    // Remove the play button
    instructionParagraph.remove();
    playButton.remove();
    
    // Create new game instance
    game = new SnakeGame(gameContainer);
    game.initializeCanvas();

    // Start game after 2 second delay
    setTimeout(() => {
        game.gameStart();
    }, 2000);

});

