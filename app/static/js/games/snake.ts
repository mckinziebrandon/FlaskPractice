/**
 * General Vector class useful for many applications.
 */
export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    plus(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    set(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    equals(other: Vector): boolean {
        return (this.x === other.x) && (this.y === other.y);
    }

    copy(): Vector {
        return new Vector(this.x, this.y);
    }

}


export class Square {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    pos: Vector;

    constructor(x: number, y: number,
                unit_size: number, color = '#5e5e5e', id: number = undefined) {

        if (unit_size === undefined) {
            console.log('WARNING: Square.unit_size undefined!');
        }

        this.id = id;
        this.size = unit_size;
        this.color = color;
        this.pos = new Vector(x || 0, y || 0);

    }

    getX(): number {
        return this.pos.x;
    }

    getY(): number {
        return this.pos.y;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        this.roundedRect(ctx);

        if (this.id !== undefined) {
            ctx.fillStyle = 'white';

            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            if (this.id !== 0) {
                ctx.fillText(this.id.toString(), this.getX() + this.size / 2, this.getY() + this.size / 2);
            } else {
                ctx.font = this.size / 3 + 'px serif';
                ctx.fillText('SNEK', this.getX() + this.size / 2, this.getY() + this.size / 2);
            }
        }
        ctx.closePath();
    }

    /** A utility function to draw a rectangle with rounded corners. */
    roundedRect(ctx: CanvasRenderingContext2D): void {
        let x: number = this.getX();
        let y: number = this.getY();
        let width: number = Number(this.size);
        let height: number = Number(this.size);
        let radius: number = width / 10;

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

    getPos(): Vector {
        return this.pos;
    }

    setPos(x: number, y: number): void {
        this.pos.set(x, y);
    }

    plus(dx: number, dy: number): Vector {
        return this.pos.plus(new Vector(dx, dy));
    }

    equals(other: Square): boolean {
        return this.getX() === other.getX()
                && this.getY() === other.getY();
    }
}


/**
 *
 * Assumptions:
 * - Snake.squares[i] is 'in front of' Snake.squares[i+1].
 * @constructor
 */
export class Snake {
    canvas: HTMLCanvasElement;
    unit_size: number;
    head: Square;
    squares: Square[];
    speed: number;
    dx: number;
    dy: number;
    justAte: boolean;

    constructor(color: string, canvas: HTMLCanvasElement, unit_size: number) {
        // Location of the "head" square.
        this.canvas = canvas;
        this.unit_size = unit_size;
        this.head = new Square(
                this.canvas.width / 4,
                this.canvas.height / 4,
                this.unit_size, color, 0);
        this.squares = [this.head];
        this.speed = 1 * unit_size;
        this.dx = this.speed;
        this.dy = 0;
        this.justAte = false;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.squares.length; i++) {
            let square = this.squares[i];
            square.draw(ctx);
        }
    }


    move(): void {
        // This is needed to halt if the head hits a wall.
        if (this.dx === 0 && this.dy === 0) {
            return;
        }

        let prevPosition = this.head.getPos().copy();
        let {x, y} = this.head.plus(this.dx, this.dy);
        this.head.setPos(x, y);

        // Sequentially move squares by one to their leaders prev position.
        for (let i = 1; i < this.squares.length; i++) {
            let tmp = this.squares[i].getPos().copy();
            this.squares[i].setPos(prevPosition.x, prevPosition.y);
            prevPosition = tmp;
        }

        if (this.justAte === true) {
            this.squares.push(new Square(
                    prevPosition.x,
                    prevPosition.y,
                    this.unit_size,
                    'darkblue',
                    this.getLength()
            ));
            this.justAte = false;
        }
    }

    eat(): void {
        this.justAte = true;
    }

    getLength(): number {
        return this.squares.length;
    }

    getPos(): Vector {
        return this.head.getPos().copy();
    }
}

/**
 *
 * @param foodSquare
 * @param snake
 * @constructor
 */
export class Grid {
    unit_size: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    snake: Snake;
    foodSquare: Square;
    width: number;
    height: number;

    constructor(canvas: HTMLCanvasElement, unit_size: number) {
        this.unit_size = unit_size;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.snake = new Snake('lightseagreen', this.canvas, this.unit_size);
        this.foodSquare = new Square(
            4 * unit_size,
            4 * unit_size,
            unit_size);
        this.width = this.canvas.width / unit_size;
        this.height = this.canvas.height / unit_size;
    }

    handleCollisions(): void {
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

    touchesSnake(pos: Vector): boolean {
        for (let i = 0; i < this.snake.squares.length; i++) {
            let squarePos = this.snake.squares[i].getPos();
            if (squarePos.equals(pos)) {
                return true;
            }
        }
        return false;
    }

    generateNewFoodSquare(): void {
        let newX = this.unit_size * Math.floor(Math.random() * this.width);
        let newY = this.unit_size * Math.floor(Math.random() * this.height);
        while (this.touchesSnake(new Vector(newX, newY)) === true) {
            newX = this.unit_size * Math.floor(Math.random() * this.width);
            newY = this.unit_size * Math.floor(Math.random() * this.height);
        }
        this.foodSquare = new Square(newX, newY, this.unit_size);
    }

    draw(): void {
        this.foodSquare.draw(this.ctx);
        this.snake.draw(this.ctx);
    }

    update(): void {
        this.snake.move();
    }

    lostGame(): boolean {
        return this.snake.dx === 0 && this.snake.dy === 0;
    }
}

$(window).load(function () {

    let canvas = <HTMLCanvasElement> $('#snake-canvas').get(0);
    let ctx = <CanvasRenderingContext2D> canvas.getContext('2d');
    let DIRECTIONS = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
    };

    // Num pixels for a single square.
    let UNIT_SIZE = function () {
        return $('#unit-size').val();
    };
    let unit_size = UNIT_SIZE();
    // Num milliseconds per step.
    let INTERVAL = function () {
        return $('#interval').val();
    };

    let grid = new Grid(canvas, unit_size);

    $(document).on('keydown', function (e) {
        let snake = grid.snake;
        if (e.which === DIRECTIONS.LEFT && snake.dx === 0) {
            snake.dx = -snake.speed;
            snake.dy = 0;
        } else if (e.which === DIRECTIONS.RIGHT && snake.dx === 0) {
            snake.dx = snake.speed;
            snake.dy = 0;
        } else if (e.which === DIRECTIONS.DOWN && snake.dy === 0) {
            snake.dx = 0;
            snake.dy = snake.speed;
        } else if (e.which === DIRECTIONS.UP && snake.dy === 0) {
            snake.dx = 0;
            snake.dy = -snake.speed;
        }

        if ($.inArray(e.which, Object.keys(DIRECTIONS).map(k => DIRECTIONS[k])) !== -1) {
            e.preventDefault();
        }
    });

    $('#restart-btn').on('click', function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        unit_size = UNIT_SIZE();
        grid = new Grid(canvas, unit_size);
    });

    let n = 3;  // num seconds to wait between restarts.
    let start = null;  // requestAnimationFrame will set this to timestamp.
    let waiting = false;  // whether we're waiting between a game restart.
    let snakeLength = grid.snake.getLength();

    /** Draw function for RequestAnimationFrame. */
    function draw(timestamp) {
        if (!start) {
            start = timestamp;
        }
        let progress = timestamp - start;

        if (progress >= INTERVAL()) {
            // lost game
            if (grid.lostGame() && waiting === false) {
                waiting = true;
                showRestartMessage();
            } else if (grid.lostGame() === false) {
                start = timestamp;
                // clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Re-draw the updated game.
                grid.draw();
                // Update vectors if collisions.
                grid.handleCollisions();
                // Update position(s).
                grid.update();
                if (snakeLength !== grid.snake.getLength()) {
                    snakeLength = grid.snake.getLength();
                }
            }
        }
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);

    function showRestartMessage() {
        let clockDiv = $('#clockdiv');
        clockDiv.css({display: 'inline'});
        let tickTime = 0;
        ctx.font = 'small-caps bold 200% sans-serif';
        ctx.fillStyle = '#5e5e5e';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(`Restarting in ${ n - tickTime }`,
            canvas.width / 2,
            canvas.height / 2 + 50);

        let countInt = setInterval(function () {
            tickTime += 1;
            let message = 'Restarting in ';
            let html = (n - tickTime > 0) ? message + (n - tickTime) : 'GO!';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillText(html, canvas.width / 2, canvas.height / 2 + 50);

            if (tickTime > n) {
                clearInterval(countInt);
                waiting = false;
                $('#restart-btn').click();
                clockDiv.css({display: 'none'});
            }
        }, 1000);
    }

});
