/**
 * Paddle for breakout.
 * @constructor
 */
export class Paddle {
    height: number;
    width: number;
    x: number;
    y: number;
    step: number;

    constructor(canvas) {
        this.height = 10;
        this.width = 75;
        this.x = (canvas.width - this.width) / 2;
        this.y = (canvas.height - this.height);
        this.step = 7;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
    }
}

/**
 * Ball for breakout.
 * @constructor
 */
export class Ball {
    canvas: HTMLCanvasElement;
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;

    constructor(speed, canvas) {
        this.canvas = canvas;
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.dx = speed || 2;
        this.dy = -(speed || 2);
        this.radius = 10;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
    }

    handleCollisions(paddle: Paddle): void {
        let nextX = this.x + this.dx;
        let nextY = this.y + this.dy;
        if (nextX > this.canvas.width - this.radius || nextX < this.radius) {
            this.dx = -this.dx;
        }
        if (nextY < this.radius) {  // TOP of map (stupid coord system imo)
            this.dy = -this.dy;
        } else if (nextY > this.canvas.height - this.radius) {
            if (paddle.x < this.x && this.x < paddle.x + paddle.width) {
                this.dy = -this.dy;
            }
        }
    }

    move(): void {
        this.x += this.dx;
        this.y += this.dy;
    }

}


/**
 * Bricks for breakout game.
 * @constructor
 */
export class Bricks {
    rowCount: number;
    columnCount: number;
    width: number;
    height: number;
    padding: number;
    offsetTop: number;
    offsetLeft: number;
    items: Object[];

    constructor() {
        this.rowCount = 3;
        this.columnCount = 5;
        this.width = 75;
        this.height = 20;
        this.padding = 10;
        this.offsetTop = 30;
        this.offsetLeft = 30;
        this.items = [];
        // initialize
        for (let c = 0; c < this.columnCount; c++) {
            this.items[c] = [];
            for (let r = 0; r < this.rowCount; r++) {
                this.items[c][r] = {
                    x: (c * (this.width + this.padding)) + this.offsetLeft,
                    y: (r * (this.height + this.padding)) + this.offsetTop,
                    status: 1
                };
            }
        }
    }

    drawBrick(brick, ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, this.width, this.height);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
    }

    draw(ctx) {
        for (let c = 0; c < this.columnCount; c++) {
            for (let r = 0; r < this.rowCount; r++) {
                let brick = this.items[c][r];
                if (brick.status === 1) {
                    this.drawBrick(brick, ctx);
                }
            }
        }
    }

    collision(brick, ball) {
        return brick.x < ball.x
                && ball.x < brick.x + this.width
                && brick.y < ball.y
                && ball.y < brick.y + this.height;
    }

    handleCollisions(ball) {
        for (let c = 0; c < this.columnCount; c++) {
            for (let r = 0; r < this.rowCount; r++) {
                let brick = this.items[c][r];
                if (brick.status === 1 && this.collision(brick, ball)) {
                    ball.dy = -ball.dy;
                    brick.status = 0;
                }
            }
        }
    }
}

