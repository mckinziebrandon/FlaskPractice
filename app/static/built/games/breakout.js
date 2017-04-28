define(["require", "exports", "jquery", "./breakout-components"], function (require, exports, $, breakout_components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    $(window).load(function () {
        var canvas = $('#breakout-canvas').get(0);
        var ctx = canvas.getContext('2d');
        // Events.
        var LEFT_ARROW_KEY = 37;
        var RIGHT_ARROW_KEY = 39;
        var rightPressed = false;
        var leftPressed = false;
        var shouldAnimate = false;
        $(document).on('keydown', keyDownHandler);
        $(document).on('keyup', keyUpHandler);
        var bricks = new breakout_components_1.Bricks();
        var ball = new breakout_components_1.Ball(1, canvas);
        var paddle = new breakout_components_1.Paddle(canvas);
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