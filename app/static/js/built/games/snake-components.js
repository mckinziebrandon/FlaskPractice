define(["require", "exports", "./vector.js"], function (require, exports, vector_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Square {
        constructor(x, y, unit_size, color = '#5e5e5e', id = undefined) {
            if (unit_size === undefined) {
                console.log('WARNING: Square.unit_size undefined!');
            }
            this.id = id;
            this.size = unit_size;
            this.color = color;
            this.pos = new vector_js_1.Vector(x || 0, y || 0);
        }
        getX() {
            return this.pos.x;
        }
        getY() {
            return this.pos.y;
        }
        draw(ctx) {
            ctx.fillStyle = this.color;
            this.roundedRect(ctx);
            if (this.id !== undefined) {
                ctx.fillStyle = 'white';
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                if (this.id !== 0) {
                    ctx.fillText(this.id.toString(), this.getX() + this.size / 2, this.getY() + this.size / 2);
                }
                else {
                    ctx.font = this.size / 3 + 'px serif';
                    ctx.fillText('SNEK', this.getX() + this.size / 2, this.getY() + this.size / 2);
                }
            }
            ctx.closePath();
        }
        /** A utility function to draw a rectangle with rounded corners. */
        roundedRect(ctx) {
            let x = this.getX();
            let y = this.getY();
            let width = Number(this.size);
            let height = Number(this.size);
            let radius = width / 10;
            ctx.beginPath();
            ctx.moveTo(x, y + radius);
            ctx.lineTo(x, y + height - radius);
            ctx.arcTo(x, y + height, x + radius, y + height, radius);
            ctx.lineTo(x + width - radius, y + height);
            ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
            ctx.lineTo(x + width, y + radius);
            ctx.arcTo(x + width, y, x + width - radius, y, radius);
            ctx.lineTo(x + radius, y);
            ctx.arcTo(x, y, x, y + radius, radius);
            ctx.fill();
        }
        getPos() {
            return this.pos;
        }
        setPos(x, y) {
            this.pos.set(x, y);
        }
        plus(dx, dy) {
            return this.pos.plus(new vector_js_1.Vector(dx, dy));
        }
        equals(other) {
            return this.getX() === other.getX()
                && this.getY() === other.getY();
        }
    }
    exports.Square = Square;
    /**
     *
     * Assumptions:
     * - Snake.squares[i] is 'in front of' Snake.squares[i+1].
     * @constructor
     */
    class Snake {
        constructor(color, canvas, unit_size) {
            // Location of the "head" square.
            this.canvas = canvas;
            this.unit_size = unit_size;
            this.head = new Square(this.canvas.width / 4, this.canvas.height / 4, this.unit_size, color, 0);
            this.squares = [this.head];
            this.speed = 1 * unit_size;
            this.dx = this.speed;
            this.dy = 0;
            this.justAte = false;
        }
        draw(ctx) {
            for (let i = 0; i < this.squares.length; i++) {
                let square = this.squares[i];
                square.draw(ctx);
            }
        }
        move() {
            // This is needed to halt if the head hits a wall.
            if (this.dx === 0 && this.dy === 0) {
                return;
            }
            let prevPosition = this.head.getPos().copy();
            let { x, y } = this.head.plus(this.dx, this.dy);
            this.head.setPos(x, y);
            // Sequentially move squares by one to their leaders prev position.
            for (let i = 1; i < this.squares.length; i++) {
                let tmp = this.squares[i].getPos().copy();
                this.squares[i].setPos(prevPosition.x, prevPosition.y);
                prevPosition = tmp;
            }
            if (this.justAte === true) {
                this.squares.push(new Square(prevPosition.x, prevPosition.y, this.unit_size, 'darkblue', this.getLength()));
                this.justAte = false;
            }
        }
        eat() {
            this.justAte = true;
        }
        getLength() {
            return this.squares.length;
        }
        getPos() {
            return this.head.getPos().copy();
        }
    }
    exports.Snake = Snake;
    /**
     *
     * @param foodSquare
     * @param snake
     * @constructor
     */
    class Grid {
        constructor(canvas, unit_size) {
            this.unit_size = unit_size;
            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d');
            this.snake = new Snake('lightseagreen', this.canvas, this.unit_size);
            this.foodSquare = new Square(4 * unit_size, 4 * unit_size, unit_size);
            this.width = this.canvas.width / unit_size;
            this.height = this.canvas.height / unit_size;
        }
        handleCollisions() {
            let nextPos = this.snake.head.plus(this.snake.dx, this.snake.dy);
            // Out of bounds check.
            if (nextPos.x < 0 || nextPos.y < 0 || nextPos.x > this.canvas.width - this.unit_size
                || nextPos.y > this.canvas.height - this.unit_size) {
                // just hit the wall for now.
                this.snake.speed = this.snake.dx = this.snake.dy = 0;
            }
            // food quare check.
            if (nextPos.equals(this.foodSquare.getPos())) {
                this.snake.eat();
                this.generateNewFoodSquare();
            }
        }
        touchesSnake(pos) {
            for (let i = 0; i < this.snake.squares.length; i++) {
                let squarePos = this.snake.squares[i].getPos();
                if (squarePos.equals(pos)) {
                    return true;
                }
            }
            return false;
        }
        generateNewFoodSquare() {
            let newX = this.unit_size * Math.floor(Math.random() * this.width);
            let newY = this.unit_size * Math.floor(Math.random() * this.height);
            while (this.touchesSnake(new vector_js_1.Vector(newX, newY)) === true) {
                newX = this.unit_size * Math.floor(Math.random() * this.width);
                newY = this.unit_size * Math.floor(Math.random() * this.height);
            }
            this.foodSquare = new Square(newX, newY, this.unit_size);
        }
        draw() {
            this.foodSquare.draw(this.ctx);
            this.snake.draw(this.ctx);
        }
        update() {
            this.snake.move();
        }
        lostGame() {
            return this.snake.dx === 0 && this.snake.dy === 0;
        }
    }
    exports.Grid = Grid;
});
//# sourceMappingURL=snake-components.js.map