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