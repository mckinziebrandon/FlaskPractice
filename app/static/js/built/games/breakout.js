define(["require", "exports", "./breakout-components.js"], function (require, exports, breakout_components_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        let bricks = new breakout_components_js_1.Bricks();
        let ball = new breakout_components_js_1.Ball(3, canvas);
        let paddle = new breakout_components_js_1.Paddle(canvas);
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