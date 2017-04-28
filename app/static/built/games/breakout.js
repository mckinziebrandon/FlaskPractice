define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Paddle for breakout.
     * @constructor
     */
    class Paddle {
        constructor(canvas) {
            this.height = 10;
            this.width = 75;
            this.x = (canvas.width - this.width) / 2;
            this.y = (canvas.height - this.height);
            this.step = 10;
        }
        draw(ctx) {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();
        }
    }
    exports.Paddle = Paddle;
    /**
     * Ball for breakout.
     * @constructor
     */
    class Ball {
        constructor(speed, canvas) {
            this.canvas = canvas;
            this.x = canvas.width / 2;
            this.y = canvas.height - 30;
            this.dx = speed;
            this.dy = -speed;
            this.radius = 10;
        }
        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();
        }
        handleCollisions(paddle) {
            let nextX = this.x + this.dx;
            let nextY = this.y + this.dy;
            if (nextX > this.canvas.width - this.radius || nextX < this.radius) {
                this.dx = -this.dx;
            }
            if (nextY < this.radius) {
                this.dy = -this.dy;
            }
            else if (nextY > this.canvas.height - this.radius) {
                if (paddle.x < this.x && this.x < paddle.x + paddle.width) {
                    this.dy = -this.dy;
                }
            }
        }
        move() {
            this.x += this.dx;
            this.y += this.dy;
        }
    }
    exports.Ball = Ball;
    /**
     * Bricks for breakout game.
     * @constructor
     */
    class Bricks {
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
        drawBrick(brick, ctx) {
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
    exports.Bricks = Bricks;
    $(window).load(function () {
        let canvas = $('#breakout-canvas').get(0);
        let ctx = canvas.getContext('2d');
        // Events.
        const LEFT_ARROW_KEY = 37;
        const RIGHT_ARROW_KEY = 39;
        let rightPressed = false;
        let leftPressed = false;
        let shouldAnimate = false;
        $(document).on('keydown', keyDownHandler);
        $(document).on('keyup', keyUpHandler);
        let bricks = new Bricks();
        let ball = new Ball(3, canvas);
        let paddle = new Paddle(canvas);
        function keyDownHandler(e) {
            if (e.keyCode === RIGHT_ARROW_KEY) {
                rightPressed = true;
                if (paddle.x < canvas.width - paddle.width) {
                    paddle.x += paddle.step;
                }
            }
            else if (e.keyCode === LEFT_ARROW_KEY) {
                leftPressed = true;
                if (paddle.x > 0) {
                    paddle.x -= paddle.step;
                }
            }
        }
        function keyUpHandler(e) {
            if (e.keyCode === RIGHT_ARROW_KEY) {
                rightPressed = false;
            }
            else if (e.keyCode === LEFT_ARROW_KEY) {
                leftPressed = false;
            }
        }
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw objects.
            bricks.draw(ctx);
            ball.draw(ctx);
            paddle.draw(ctx);
            // Collisions.
            bricks.handleCollisions(ball);
            ball.handleCollisions(paddle);
            // Update position(s).
            ball.move();
            if (shouldAnimate) {
                requestAnimationFrame(draw);
            }
        }
        $(canvas).on('mouseover', function () {
            shouldAnimate = true;
            requestAnimationFrame(draw);
        });
        $(canvas).on('mouseout', function () {
            shouldAnimate = false;
        });
    });
});
//# sourceMappingURL=breakout.js.map