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