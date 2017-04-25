$(window).load(function() {

    var canvas = document.getElementById('snake-canvas');
    var ctx = canvas.getContext('2d');

    // Num pixels for a single square.
    var UNIT_SIZE = function() { return $('#unit-size').val(); };
    var unit_size = UNIT_SIZE();
    // Num milliseconds per step.
    var INTERVAL = function() { return $('#interval').val(); };

    /* -------------------------------------------------------------------
     * VECTOR
     * ------------------------------------------------------------------- */

    /**
     * Represents coordinate pairs.
     * @param x
     * @param y
     * @constructor
     */
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }

    Vector.prototype.plus = function(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    };

    Vector.prototype.set = function(x, y) {
        this.x = x;
        this.y = y;
    };

    Vector.prototype.equals = function(otherVector) {
        return (this.x == otherVector.x) && (this.y == otherVector.y);
    };

    Vector.prototype.copy = function() {
        return new Vector(this.x, this.y);
    };

    /**
     *
     * @param x
     * @param y
     * @constructor
     */
    function Square(x, y, color, number) {
        this.number = number;
        this.size = unit_size;
        this.color = color || "#5e5e5e";
        this.pos = new Vector(x || 0, y || 0);
        this.getX = function() { return this.pos.x; };
        this.getY = function() { return this.pos.y; };
    }

    Square.prototype.draw = function() {
        ctx.fillStyle = this.color;
        this.roundedRect();

        if (this.number != undefined) {
            ctx.fillStyle = 'white';
            ctx.font = unit_size / 2 + 'px serif';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            if (this.number != 0) {
                ctx.fillText(this.number.toString(), this.getX() + unit_size / 2, this.getY() + unit_size / 2);
            } else {
                ctx.font = unit_size / 3 + 'px serif';
                ctx.fillText("SNEK", this.getX() + unit_size / 2, this.getY() + unit_size / 2);
            }
        }
        ctx.closePath();
    };


    /** A utility function to draw a rectangle with rounded corners. */
    Square.prototype.roundedRect = function() {
        var x = this.getX();
        var y = this.getY();
        var width = parseInt(this.size);
        var height = parseInt(this.size);
        var radius = width / 10;

        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.arcTo(x, y + height, x + radius, y + height, radius);
        ctx.lineTo(x + width - radius, y + height);
        ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
        ctx.lineTo(x + width, y + radius);
        ctx.arcTo(x + width, y, x + width - radius, y, radius);
        ctx.lineTo(x + radius, y);
        ctx.arcTo(x, y, x, y + radius, radius);
        ctx.fill();
    }


    Square.prototype.getPos = function() {
        return this.pos;
    };

    Square.prototype.setPos = function(x, y) {
        if (y == undefined) {  // assume that x is a position obj.
            var pos = x;
            this.pos.set(pos.x, pos.y);
        } else {
            this.pos.set(x, y);
        }
    };

    Square.prototype.plus = function(dx, dy) {
        return this.pos.plus(new Vector(dx, dy));
    };

    Square.prototype.equals = function(otherSquare) {
        return this.getX() == otherSquare.getX()
                && this.getY() == otherSquare.getY();

    };

    /**
     *
     * Assumptions:
     * - Snake.squares[i] is 'in front of' Snake.squares[i+1].
     * @constructor
     */
    function Snake(color) {
        // Location of the "head" square.
        this.head = new Square(
                canvas.width / 2,
                canvas.height / 2,
                color, 0);
        this.squares = [this.head];
        this.speed = 1 * unit_size;
        this.dx = this.speed;
        this.dy = 0;
        this.justAte = false;
    }

    Snake.prototype.draw = function() {
        for (var i = 0; i < this.squares.length; i++) {
            var square = this.squares[i];
            square.draw();
        }
    };

    Snake.prototype.move = function() {

        // This is needed to halt if the head hits a wall.
        if (this.dx == 0 && this.dy == 0) { return; }

        var prevPosition = this.head.getPos().copy();
        this.head.setPos(this.head.plus(this.dx, this.dy));

        // Sequentially move squares by one to their leaders prev position.
        for (var i = 1; i < this.squares.length; i++) {
            var tmp = this.squares[i].getPos().copy();
            this.squares[i].setPos(prevPosition.x, prevPosition.y);
            prevPosition = tmp;
        }

        if (this.justAte == true) {
            this.squares.push(new Square(
                    prevPosition.x,
                    prevPosition.y,
                    "darkblue",
                    this.getLength()
            ));
            this.justAte = false;
        }
    };

    Snake.prototype.eat = function() {
        this.justAte = true;
    };

    Snake.prototype.getLength = function() {
        return this.squares.length;
    };

    Snake.prototype.getPos = function() {
        return this.head.getPos().copy();
    };

    /**
     *
     * @param foodSquare
     * @param snake
     * @constructor
     */
    function Grid() {
        this.snake = new Snake('lightseagreen');
        this.foodSquare = new Square(4*unit_size, 4*unit_size);
        this.width = canvas.width / unit_size;
        this.height = canvas.height / unit_size;
    }

    Grid.prototype.handleCollisions = function() {
        var nextPos = this.snake.head.plus(this.snake.dx, this.snake.dy);
        // Out of bounds check.

        if (nextPos.x < 0 || nextPos.y < 0 || nextPos.x > canvas.width - unit_size
                || nextPos.y > canvas.height - unit_size) {
            // just hit the wall for now.
            this.snake.speed = this.snake.dx = this.snake.dy = 0;
        }

        // food quare check.
        if (nextPos.equals(this.foodSquare.getPos())) {
            this.snake.eat();
            this.generateNewFoodSquare();
        }
    };

    Grid.prototype.touchesSnake = function(pos) {
        for (var i = 0; i < this.snake.squares.length; i++) {
            var squarePos = this.snake.squares[i].getPos();
            if (squarePos.equals(pos)) {
                return true;
            }
        }
        return false;
    };

    Grid.prototype.generateNewFoodSquare = function() {
        var newX = unit_size * Math.floor(Math.random() * this.width);
        var newY = unit_size * Math.floor(Math.random() * this.height);
        while (this.touchesSnake(new Vector(newX, newY)) == true) {
            newX = unit_size * Math.floor(Math.random() * this.width);
            newY = unit_size * Math.floor(Math.random() * this.height);
        }
        this.foodSquare = new Square(newX, newY);
    };

    Grid.prototype.draw = function() {
        this.foodSquare.draw();
        this.snake.draw();
    };

    Grid.prototype.update = function() {
        this.snake.move();
    };

    Grid.prototype.lostGame = function() {
        return this.snake.dx == 0 && this.snake.dy == 0;
    };

    var grid = new Grid();

    var LEFT = 37;
    var UP = 38;
    var RIGHT = 39;
    var DOWN = 40;
    var DIRECTIONS = [LEFT, UP, RIGHT, DOWN];
    $(document).on('keydown', function(e) {
        var snake = grid.snake;
        if (e.which == LEFT && snake.dx == 0) {
            snake.dx = - snake.speed;
            snake.dy = 0;
        } else if (e.which == RIGHT && snake.dx == 0) {
            snake.dx = snake.speed;
            snake.dy = 0;
        } else if (e.which == DOWN && snake.dy == 0) {
            snake.dx = 0;
            snake.dy = snake.speed;
        } else if (e.which == UP && snake.dy == 0) {
            snake.dx = 0;
            snake.dy = - snake.speed;
        }

        if ($.inArray(e.which, DIRECTIONS) != -1) {
            e.preventDefault();
        }
    });

    $('#restart-btn').on('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        unit_size = UNIT_SIZE();
        grid = new Grid();
    });

    var n = 3;  // num seconds to wait between restarts.
    var start = null;  // requestAnimationFrame will set this to timestamp.
    var waiting = false;  // whether we're waiting between a game restart.
    var snakeLength = grid.snake.getLength();

    /** draw */
    function draw(timestamp) {

        if (!start) { start = timestamp; }
        var progress = timestamp - start;

        if (progress >= INTERVAL()) {

            // lost game
            if (grid.lostGame() && waiting == false) {
                waiting = true;
                showRestartMessage();
            } else if (grid.lostGame() == false) {
                start = timestamp;
                // clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Re-draw the updated game.
                grid.draw();
                // Update vectors if collisions.
                grid.handleCollisions();
                // Update position(s).
                grid.update();
                if (snakeLength != grid.snake.getLength()) {
                    snakeLength = grid.snake.getLength();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);

    function showRestartMessage() {
        var clockDiv = $('#clockdiv');
        clockDiv.css({display: 'inline'});
        var tickTime = 0;
        ctx.font = 'small-caps bold 200% sans-serif';
        ctx.fillStyle = "#5e5e5e";
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText("HA! YOU SUCK!", canvas.width / 2, canvas.height / 2);
        ctx.fillText("Restarting in " + (n - tickTime),
                canvas.width / 2,
                canvas.height / 2 + 50);

        var countInt = setInterval(function () {
            tickTime += 1;
            var message = "Restarting in ";
            var html = (n - tickTime > 0) ? message + (n - tickTime) : 'GO!';
            ctx.clearRect(canvas.width / 4, canvas.height / 2 + 20, canvas.width / 2, canvas.height / 4);
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