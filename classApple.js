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

