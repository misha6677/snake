class Snake {
    constructor() {
        this.body = [{ x: 10, y: 10 }, { x: 9, y: 10 }];
        this.direction = "right";
        this.newDirection = "right";
    }

    move() {
        const head = this.body[0];
        let newHead;

        switch (this.newDirection) {
            case "up":
                newHead = { x: head.x, y: (head.y + 19) % 20 };
                break;
            case "down":
                newHead = { x: head.x, y: (head.y + 1) % 20 };
                break;
            case "left":
                newHead = { x: (head.x + 19) % 20, y: head.y };
                break;
            case "right":
                newHead = { x: (head.x + 1) % 20, y: head.y };
                break;
        }

        if (this.isCollidingWithBody(newHead)) {
            throw new Error("Game Over");
        }

        this.body.unshift(newHead);
        this.body.pop();
        this.direction = this.newDirection;
    }

    grow() {
        const tail = this.body[this.body.length - 1];
        this.body.push({ ...tail });
    }

    isCollidingWithBody(cell) {
        return this.body.some(segment => segment.x === cell.x && segment.y === cell.y);
    }

    changeDirection(newDirection) {
        const oppositeDirection = {
            up: "down",
            down: "up",
            left: "right",
            right: "left",
        };

        if (this.direction !== oppositeDirection[newDirection]) {
            this.newDirection = newDirection;
        }
    }
}

class Apple {
    constructor() {
        this.position = this.generatePosition();
    }

    generatePosition(snakeBody = []) {
        let newPosition;

        do {
            newPosition = {
                x: Math.floor(Math.random() * 20),
                y: Math.floor(Math.random() * 20),
            };
        } while (snakeBody.some(segment => segment.x === newPosition.x && segment.y === newPosition.y));

        return newPosition;
    }
}

class Game {
    constructor() {
        this.field = document.getElementById("gameField");
        this.snake = new Snake();
        this.apple = new Apple();
        this.score = 0;
        this.highScore = localStorage.getItem("highScore") || 0;
        this.timer = null;
        this.isRunning = false;

        this.init();
    }

    init() {
        this.createGrid();
        this.updateHighScoreDisplay();
        this.render();
        this.attachEventListeners();
    }

    createGrid() {
        this.field.innerHTML = "";

        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 20; x++) {
                const cell = document.createElement("div");
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.className = "cell";
                this.field.appendChild(cell);
            }
        }
    }

    render() {
        const cells = this.field.querySelectorAll(".cell");
        cells.forEach(cell => cell.className = "cell");

        this.snake.body.forEach(segment => {
            const cell = this.getCell(segment.x, segment.y);
            cell.classList.add("snake");
        });

        const appleCell = this.getCell(this.apple.position.x, this.apple.position.y);
        appleCell.classList.add("apple");
    }

    getCell(x, y) {
        return this.field.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    }

    updateHighScoreDisplay() {
        document.getElementById("highscore").textContent = this.highScore > 0 ? `Рекорд: ${this.highScore}` : "";
    }

    start() {
        document.getElementById("start").classList.add("hidden");
        this.isRunning = true;

        this.timer = setInterval(() => {
            try {
                this.snake.move();
                this.checkAppleCollision();
                this.render();
            } catch (e) {
                this.endGame();
            }
        }, 500);
    }

    checkAppleCollision() {
        const head = this.snake.body[0];

        if (head.x === this.apple.position.x && head.y === this.apple.position.y) {
            this.snake.grow();
            this.apple.position = this.apple.generatePosition(this.snake.body);
            this.updateScore();
        }
    }

    updateScore() {
        this.score++;
        document.getElementById("score").textContent = `Счёт: ${this.score}`;

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem("highScore", this.highScore);
            this.updateHighScoreDisplay();
        }
    }

    attachEventListeners() {
        document.getElementById("start").addEventListener("click", () => this.start());

        document.addEventListener("keydown", (e) => {
            const directionMap = {
                ArrowUp: "up",
                ArrowDown: "down",
                ArrowLeft: "left",
                ArrowRight: "right",
            };

            if (directionMap[e.key]) {
                this.snake.changeDirection(directionMap[e.key]);

                if (!this.isRunning) {  // Запуск игры при первом нажатии на стрелку
                    this.start();
                }
            }
        });

        document.getElementById("restart").addEventListener("click", () => location.reload());
    }

    endGame() {
        clearInterval(this.timer);
        document.getElementById("restart").classList.remove("hidden");
        this.isRunning = false;
    }
}

const game = new Game();