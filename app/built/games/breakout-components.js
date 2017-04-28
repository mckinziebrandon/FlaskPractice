define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Paddle for breakout.
     * @constructor
     */
    var Paddle = (function () {
        function Paddle(canvas) {
            this.height = 10;
            this.width = 75;
            this.x = (canvas.width - this.width) / 2;
            this.y = (canvas.height - this.height);
            this.step = 7;
        }
        Paddle.prototype.draw = function (ctx) {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();
        };
        return Paddle;
    }());
    exports.Paddle = Paddle;
    /**
     * Ball for breakout.
     * @constructor
     */
    var Ball = (function () {
        function Ball(speed, canvas) {
            this.canvas = canvas;
            this.x = canvas.width / 2;
            this.y = canvas.height - 30;
            this.dx = speed || 2;
            this.dy = -(speed || 2);
            this.radius = 10;
        }
        Ball.prototype.draw = function (ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();
        };
        Ball.prototype.handleCollisions = function (paddle) {
            var nextX = this.x + this.dx;
            var nextY = this.y + this.dy;
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
        };
        Ball.prototype.move = function () {
            this.x += this.dx;
            this.y += this.dy;
        };
        return Ball;
    }());
    exports.Ball = Ball;
    /**
     * Bricks for breakout game.
     * @constructor
     */
    var Bricks = (function () {
        function Bricks() {
            this.rowCount = 3;
            this.columnCount = 5;
            this.width = 75;
            this.height = 20;
            this.padding = 10;
            this.offsetTop = 30;
            this.offsetLeft = 30;
            this.items = [];
            // initialize
            for (var c = 0; c < this.columnCount; c++) {
                this.items[c] = [];
                for (var r = 0; r < this.rowCount; r++) {
                    this.items[c][r] = {
                        x: (c * (this.width + this.padding)) + this.offsetLeft,
                        y: (r * (this.height + this.padding)) + this.offsetTop,
                        status: 1
                    };
                }
            }
        }
        Bricks.prototype.drawBrick = function (brick, ctx) {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, this.width, this.height);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();
        };
        Bricks.prototype.draw = function (ctx) {
            for (var c = 0; c < this.columnCount; c++) {
                for (var r = 0; r < this.rowCount; r++) {
                    var brick = this.items[c][r];
                    if (brick.status === 1) {
                        this.drawBrick(brick, ctx);
                    }
                }
            }
        };
        Bricks.prototype.collision = function (brick, ball) {
            return brick.x < ball.x
                && ball.x < brick.x + this.width
                && brick.y < ball.y
                && ball.y < brick.y + this.height;
        };
        Bricks.prototype.handleCollisions = function (ball) {
            for (var c = 0; c < this.columnCount; c++) {
                for (var r = 0; r < this.rowCount; r++) {
                    var brick = this.items[c][r];
                    if (brick.status === 1 && this.collision(brick, ball)) {
                        ball.dy = -ball.dy;
                        brick.status = 0;
                    }
                }
            }
        };
        return Bricks;
    }());
    exports.Bricks = Bricks;
});
//# sourceMappingURL=breakout-components.js.map