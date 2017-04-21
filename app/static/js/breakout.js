$(window).load(function() {

    var canvas = document.getElementById('breakout-canvas');
    var ctx = canvas.getContext('2d');

    /**
     *
     * @constructor
     */
    function Ball(speed) {
        //speed = (typeof speed !== 'undefined') ? speed : 1;
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.dx = speed || 2;
        this.dy = - (speed || 2);
        this.radius = 10;
    }

    Ball.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    };

    Ball.prototype.handleCollisions = function() {
        var nextX = this.x + this.dx;
        var nextY = this.y + this.dy;
        if (nextX > canvas.width - this.radius || nextX < this.radius) {
            this.dx = -this.dx;
        }
        if (nextY < this.radius) {  // TOP of map (stupid coord system imo)
            this.dy = -this.dy;
        } else if (nextY > canvas.height - this.radius) {
            if (paddle.x < this.x && this.x < paddle.x + paddle.width) {
                this.dy = -this.dy;
            }
        }
    };

    Ball.prototype.move = function() {
        this.x += this.dx;
        this.y += this.dy;
    }

    /**
     *
     * @constructor
     */
    function Paddle() {
        this.height = 10;
        this.width = 75;
        this.x = (canvas.width - this.width) / 2;
        this.y = (canvas.height - this.height);
        this.step = 7;
    }

    Paddle.prototype.draw = function() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    };

    /**
     * yeah das right
     * @constructor
     */
    function Bricks() {
        this.rowCount = 3;
        this.columnCount = 5;
        this.width = 75;
        this.height = 20;
        this.padding = 10;
        this.offsetTop = 30;
        this.offsetLeft =  30;
        this.items = [];
        // initialize
        for (var c = 0; c < this.columnCount; c++) {
            this.items[c] = [];
            for (var r = 0; r < this.rowCount; r++) {
                this.items[c][r] = {
                    x: (c * (this.width + this.padding)) + this.offsetLeft,
                    y: (r * (this.height + this.padding)) + this.offsetTop,
                    status: 1};
            }
        }
    }

    Bricks.prototype.drawBrick = function(brick) {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, this.width, this.height);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    };

    // draw function.
    Bricks.prototype.draw = function() {
        for (var c = 0; c < this.columnCount; c++) {
            for (var r = 0; r < this.rowCount; r++) {
                var brick = this.items[c][r];
                if (brick.status == 1) {
                    this.drawBrick(brick);
                }
            }
        }
    };

    Bricks.prototype.collision = function(brick, ball) {
        return brick.x < ball.x
                && ball.x < brick.x + this.width
                && brick.y < ball.y
                && ball.y < brick.y + this.height;
    }

    Bricks.prototype.handleCollisions = function() {
        for (var c = 0; c < this.columnCount; c++) {
            for (var r = 0; r < this.rowCount; r++) {
                var brick = this.items[c][r];
                if (brick.status == 1 && this.collision(brick, ball)) {
                        ball.dy = -ball.dy;
                        brick.status = 0;
                }
            }
        }
    };

    // Events.
    var LEFT_ARROW_KEY = 37;
    var RIGHT_ARROW_KEY = 39;
    var rightPressed = false;
    var leftPressed = false;
    $(document).on('keydown', keyDownHandler);
    $(document).on('keyup', keyUpHandler);

    function keyDownHandler(e) {
        if (e.keyCode == RIGHT_ARROW_KEY) {
            rightPressed = true;
            if (paddle.x < canvas.width - paddle.width) { paddle.x += paddle.step; }
        } else if (e.keyCode == LEFT_ARROW_KEY) {
            leftPressed = true;
            if (paddle.x > 0) { paddle.x -= paddle.step; }
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode == RIGHT_ARROW_KEY) {
            rightPressed = false;
        } else if (e.keyCode == LEFT_ARROW_KEY) {
            leftPressed = false;
        }
    }

    var bricks  = new Bricks();
    var ball    = new Ball();
    var paddle  = new Paddle();

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw objects.
        bricks.draw();
        ball.draw();
        paddle.draw();

        // Collisions.
        bricks.handleCollisions();
        ball.handleCollisions();

        // Update position(s).
        ball.move();

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);

});
