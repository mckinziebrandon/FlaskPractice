$(window).load(function() {

    var canvas = document.getElementById('snake-canvas');
    var ctx = canvas.getContext('2d');
    
    // Num pixels for a single square.
    var UNIT_SIZE = 10;

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
    }

    Vector.prototype.equals = function(otherVector) {
        return (this.x == otherVector.x) && (this.y == otherVector.y);
    }

    Vector.prototype.copy = function() {
        return new Vector(this.x, this.y);
    }

    /**
     *
     * @param x
     * @param y
     * @constructor
     */
    function Square(x, y, color) {
        this.size = UNIT_SIZE;
        this.color = color || "#5e5e5e";
        this.pos = new Vector(x || 0, y || 0);
        this.getX = function() { return this.pos.x; }
        this.getY = function() { return this.pos.y; }
    }

    Square.prototype.draw = function() {
        ctx.beginPath();
        ctx.rect(this.getX(), this.getY(), this.size, this.size);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    Square.prototype.getPos = function() {
        return this.pos;
    }

    Square.prototype.setPos = function(x, y) {
        if (y == undefined) {  // assume that x is a position obj.
            var pos = x;
            this.pos.set(pos.x, pos.y);
        } else {
            this.pos.set(x, y);
        }
    }

    Square.prototype.plus = function(dx, dy) {
        return this.pos.plus(new Vector(dx, dy));
    }

    Square.prototype.equals = function(otherSquare) {
        return this.getX() == otherSquare.getX()
                && this.getY() == otherSquare.getY();

    }

    /**
     *
     * Assumptions:
     * - Snake.squares[i] is 'in front of' Snake.squares[i+1].
     * @constructor
     */
    function Snake(color) {
        // Location of the "head" square.
        this.head = new Square(canvas.width / 2, canvas.height / 2, color);
        this.squares = [this.head];
        this.speed = 1 * UNIT_SIZE;
        this.dx = this.speed;
        this.dy = 0;
        this.justAte = false;
    }

    Snake.prototype.draw = function() {
        for (var i = 0; i < this.squares.length; i++) {
            var square = this.squares[i];
            square.draw();
        }
    }

    Snake.prototype.move = function() {
        var prevPosition = this.head.getPos().copy();
        this.head.setPos(this.head.plus(this.dx, this.dy));

        // Sequentially move squares by one to their leaders prev position.
        for (var i = 1; i < this.squares.length; i++) {
            var tmp = this.squares[i].getPos().copy();
            this.squares[i].setPos(prevPosition.x, prevPosition.y);
            prevPosition = tmp;
        }

        if (this.justAte == true) {
            this.squares.push(new Square(prevPosition.x, prevPosition.y));
            this.justAte = false;
        }
    }

    Snake.prototype.eat = function() {
        this.justAte = true;
    }

    Snake.prototype.getLength = function() {
        return this.squares.length;
    }

    Snake.prototype.getPos = function() {
        return this.head.getPos();
    }

    /**
     *
     * @param foodSquare
     * @param snake
     * @constructor
     */
    function Grid() {
        this.snake = new Snake('darkgreen');
        this.foodSquare = new Square(4*UNIT_SIZE, 4*UNIT_SIZE);
        this.width = canvas.width / UNIT_SIZE;
        this.height = canvas.height / UNIT_SIZE;
    }

    Grid.prototype.handleCollisions = function() {
        var nextPos = this.snake.head.plus(this.snake.dx, this.snake.dy);
        // Out of bounds check.
        if (nextPos.x < 0
            || nextPos.y < 0
            || nextPos.x > canvas.width - UNIT_SIZE
            || nextPos.y > canvas.height - UNIT_SIZE) {
            // just hit the wall for now.
            this.snake.dx = this.snake.dy = 0;
        }

        // food quare check.
        if (nextPos.equals(this.foodSquare.getPos())) {
           this.snake.eat();
           this.generateNewFoodSquare();
        }
    }

    Grid.prototype.touchesSnake = function(pos) {
        for (var i = 0; i < this.snake.squares.length; i++) {
            var squarePos = this.snake.squares[i].getPos();
            if (squarePos.x <= pos.x
                && pos.x <= squarePos.x + UNIT_SIZE
                && squarePos.y <= pos.y
                && pos.y <= squarePos.y + UNIT_SIZE) {
                return true;
            }
        }
        return false;
    }

    Grid.prototype.generateNewFoodSquare = function() {
        var newX = UNIT_SIZE * Math.floor(Math.random() * this.width);
        var newY = UNIT_SIZE * Math.floor(Math.random() * this.height);
        while (this.touchesSnake(new Vector(newX, newY)) == true) {
            newX = UNIT_SIZE * Math.floor(Math.random() * this.width);
            newY = UNIT_SIZE * Math.floor(Math.random() * this.height);
        }
        this.foodSquare = new Square(newX, newY);
    }

    Grid.prototype.draw = function() {
        this.foodSquare.draw();
        this.snake.draw();
    }

    Grid.prototype.update = function() {
        this.snake.move();
    }

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
    })

    function draw() {
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

    var snakeLength = grid.snake.getLength();
    setInterval(draw, 150);

});