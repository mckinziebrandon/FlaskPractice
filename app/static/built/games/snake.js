/* Logic for the game of Snake (work in progress). */
define(["require", "exports", "./snake-components", "jquery"], function (require, exports, snake_components_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    $(window).load(function () {
        var canvas = $('#snake-canvas').get(0);
        var ctx = canvas.getContext('2d');
        var DIRECTIONS = {
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        };
        // Num pixels for a single square.
        var UNIT_SIZE = function () { return $('#unit-size').val(); };
        var unit_size = UNIT_SIZE();
        // Num milliseconds per step.
        var INTERVAL = function () { return $('#interval').val(); };
        var grid = new snake_components_1.Grid(canvas, unit_size);
        $(document).on('keydown', function (e) {
            var snake = grid.snake;
            if (e.which === DIRECTIONS.LEFT && snake.dx === 0) {
                snake.dx = -snake.speed;
                snake.dy = 0;
            }
            else if (e.which === DIRECTIONS.RIGHT && snake.dx === 0) {
                snake.dx = snake.speed;
                snake.dy = 0;
            }
            else if (e.which === DIRECTIONS.DOWN && snake.dy === 0) {
                snake.dx = 0;
                snake.dy = snake.speed;
            }
            else if (e.which === DIRECTIONS.UP && snake.dy === 0) {
                snake.dx = 0;
                snake.dy = -snake.speed;
            }
            if ($.inArray(e.which, Object.keys(DIRECTIONS).map(function (k) { return DIRECTIONS[k]; })) !== -1) {
                e.preventDefault();
            }
        });
        $('#restart-btn').on('click', function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            unit_size = UNIT_SIZE();
            grid = new snake_components_1.Grid(canvas, unit_size);
        });
        var n = 3; // num seconds to wait between restarts.
        var start = null; // requestAnimationFrame will set this to timestamp.
        var waiting = false; // whether we're waiting between a game restart.
        var snakeLength = grid.snake.getLength();
        /** Draw function for RequestAnimationFrame. */
        function draw(timestamp) {
            if (!start) {
                start = timestamp;
            }
            var progress = timestamp - start;
            if (progress >= INTERVAL()) {
                // lost game
                if (grid.lostGame() && waiting === false) {
                    waiting = true;
                    showRestartMessage();
                }
                else if (grid.lostGame() === false) {
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
            var clockDiv = $('#clockdiv');
            clockDiv.css({ display: 'inline' });
            var tickTime = 0;
            ctx.font = 'small-caps bold 200% sans-serif';
            ctx.fillStyle = '#5e5e5e';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText("Restarting in " + (n - tickTime), canvas.width / 2, canvas.height / 2 + 50);
            var countInt = setInterval(function () {
                tickTime += 1;
                var message = 'Restarting in ';
                var html = (n - tickTime > 0) ? message + (n - tickTime) : 'GO!';
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillText(html, canvas.width / 2, canvas.height / 2 + 50);
                if (tickTime > n) {
                    clearInterval(countInt);
                    waiting = false;
                    $('#restart-btn').click();
                    clockDiv.css({ display: 'none' });
                }
            }, 1000);
        }
    });
});
//# sourceMappingURL=snake.js.map