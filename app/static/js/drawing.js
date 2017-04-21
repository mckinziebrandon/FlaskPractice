$(window).load(function() {

    function trumpStuff() {
        var trumpCanvas = document.querySelector("#trump-home");
        var imgSrc = $("#trump-image").attr("src");
        var div = document.createElement("div");

        $(div).css({
            position: "absolute",
            left: "10px"
        })

        var imgSize = 100;
        var img = $("<img/>", {
            src: imgSrc,
            "class": "img-responsive img-circle",
            alt: "Mr Prez",
            width: imgSize,
            height: imgSize
        }).get(0);

        $(div).append(img);
        $(trumpCanvas).append(div);

        var bool = false;
        var followMouse = function(event) {
            $(div).css({
                left: event.pageX - 3 * imgSize/2,
                top: event.pageY - 3 * imgSize / 2});
        };

        $(div).on("click", function() {
            bool = !bool;
            if (bool == true) {
                $(document).on("mousemove", followMouse);
            } else {
                $(document).off("mousemove", followMouse);
            }
        });
    }

    /** Draws two partially overlapping squares of different color. */
    function drawSquares(canvas) {
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = 'rgb(200, 0, 0)';
            ctx.fillRect(20, 20, 60, 60);
            ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
            ctx.fillRect(40, 40, 60, 60);
            console.log(ctx);
        }
        return ctx;
    }

    /** ShapeDrawer constructor. */
    function ShapeDrawer(id, canvasWidth, canvasHeight) {
        // Create a canvas.
        this.canvas = $("<canvas"
                + " id=" + id
                + " width=" + canvasWidth
                + " height=" + canvasHeight
                + "></canvas>")
                .appendTo('.canvas-column')
                .get(0);
    }

    /**
     * Draw a triangle
     * @param fill - If true, fill shape with color, else stroke only (default).
     */
    ShapeDrawer.prototype.drawTriangle = function(fill) {
        // If this browser supports <canvas> (i.e. getContext method exists) . . .
        if (this.canvas.getContext) {
            var ctx = this.canvas.getContext('2d');
            // Create a new path.
            // Future commands are directed into this path.
            ctx.beginPath();
            ctx.moveTo(75, 50);
            ctx.lineTo(100, 75);
            ctx.lineTo(100, 25);
            if (fill) {
                // Darws a solid shape by filling the path's content area.
                ctx.fill();
            } else {
                ctx.closePath();
                ctx.stroke();
            }
        } else {
            $('<p>Get a new browser yo.</p>').appendTo(this.canvas);
        }
    };

    /** Integer division in JS. */
    function intDivide(a, b) {
        return ~~(a/b);
    }

    ShapeDrawer.prototype.drawArcs = function() {
        var ctx = this.canvas.getContext('2d');
        var canvasWidth = $(this.canvas).attr('width');
        var canvasHeight = $(this.canvas).attr('height');

        var stepSize = intDivide(canvasHeight, 4);
        var startPoint = 25;
        // Based on example from MDN tutorial.
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                ctx.beginPath();
                var x = startPoint + j * stepSize;  // x-coordinate
                var y = startPoint + i * stepSize;  // y-coordinate
                var radius = 20;  // Arc radius.
                var startAngle = 0;  // Starting point on circle.
                var endAngle = Math.PI * (1 + j / 2);
                var anticlockwise = (i % 2 == 0) ? false : true;
                ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

                if (i > 1) {
                    ctx.fill()
                } else {
                    ctx.stroke();
                }
            }
        }
    }

    /** Draw a grid of lines. */
    ShapeDrawer.prototype.drawGrid = function() {
        var ctx = this.canvas.getContext('2d');
        var canvasWidth = $(this.canvas).attr('width');
        var canvasHeight = $(this.canvas).attr('height');
        // How many units to draw line.
        var stepSize = 50;
        ctx.beginPath();
        for (var x = 0; x < canvasWidth; x += stepSize) {
            console.log('x = ' + x);
            // Top of the (vertical) line.
            ctx.moveTo(x, 0);
            // to the bottom of the line.
            ctx.lineTo(x, canvasHeight);
        }
        // Draw it.
        ctx.stroke();
    }


    /* ---------------------------------------------------------------------- *
     * Ridiculous pacman drawing, keeping for reference and comic relief.
     * ---------------------------------------------------------------------- */

    function drawPacman(canvas) {
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            roundedRect(ctx, 12, 12, 150, 150, 15);
            roundedRect(ctx, 19, 19, 150, 150, 9);
            roundedRect(ctx, 53, 53, 49, 33, 10);
            roundedRect(ctx, 53, 119, 49, 16, 6);
            roundedRect(ctx, 135, 53, 49, 33, 10);
            roundedRect(ctx, 135, 119, 25, 49, 10);
            ctx.beginPath();
            ctx.arc(37, 37, 13, Math.PI / 7, -Math.PI / 7, false);
            ctx.lineTo(31, 37);
            ctx.fill();
            for (var i = 0; i < 8; i++) { ctx.fillRect(51 + i * 16, 35, 4, 4); }
            for (i = 0; i < 6; i++) { ctx.fillRect(115, 51 + i * 16, 4, 4); }
            for (i = 0; i < 8; i++) { ctx.fillRect(51 + i * 16, 99, 4, 4); }

            ctx.beginPath();
            ctx.moveTo(83, 116);
            ctx.lineTo(83, 102);
            ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
            ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);
            ctx.lineTo(111, 116);
            ctx.lineTo(106.333, 111.333);
            ctx.lineTo(101.666, 116);
            ctx.lineTo(97, 111.333);
            ctx.lineTo(92.333, 116);
            ctx.lineTo(87.666, 111.333);
            ctx.lineTo(83, 116);
            ctx.fill();

            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.moveTo(91, 96);
            ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);
            ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);
            ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);
            ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);
            ctx.moveTo(103, 96);
            ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);
            ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);
            ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);
            ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);
            ctx.fill();

            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(101, 102, 2, 0, Math.PI * 2, true);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(89, 102, 2, 0, Math.PI * 2, true);
            ctx.fill();
        }
    }

    /** A utility function to draw a rectangle with rounded corners. */
    function roundedRect(ctx, x, y, width, height, radius) {
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
        ctx.stroke();
    }

    /* ---------------------------------------------------------------------- *
     * Miter demo.
     * ---------------------------------------------------------------------- */

    function miterDemo(canvas) {

        var ctx = canvas.getContext('2d');
        var canvasWidth = $(canvas).attr('width');
        var canvasHeight = $(canvas).attr('height');

        // Clear canvas.
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw that guide box thingy.
        ctx.strokeStyle = "#09f";
        ctx.lineWidth = 2;
        ctx.strokeRect(-5, 50, 160, 50);

        // Lin style.
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 10;

        // Check input.
        if (document.getElementById('miter-limit').value.match(/\d+(\.\d+)?/)) {
            ctx.miterLimit = parseFloat($('#miter-limit').val());
        } else {
            alert('Value must be a positive number.');
        }

        // Draw lines.
        ctx.beginPath();
        ctx.moveTo(0, 100);
        for (var i = 0; i < 24; i++) {
            var dy = (i % 2 == 0) ? 25 : -25;
            ctx.lineTo(Math.pow(i, 1.5) * 2, 75 + dy);
        }
        ctx.stroke();
    }

    /*-----------------------------------------------------
     * Actual execution of stuff.
     * ----------------------------------------------------- */

    // do the trump stuff
    trumpStuff();

    var canvasWidth = 200;
    var canvasHeight = 250;

    // One
    var drawerOne = new ShapeDrawer('shape-canvas-1', canvasWidth, canvasHeight);
    $("#triangle-btn").on('click', function() { drawerOne.drawTriangle(); });
    $("#grid-btn").on('click', function() { drawerOne.drawGrid(); });

    // Two
    var drawerTwo = new ShapeDrawer('shape-canvas-2', canvasWidth, canvasHeight);
    $("#arcs-btn").on('click', function() { drawerTwo.drawArcs(); });

    // Three
    var pacmanCanvas = $("<canvas"
            + " id=pacman-canvas"
            + " width=" + canvasWidth
            + " height=" + canvasHeight
            + "></canvas>")
            .appendTo('.canvas-column')
            .get(0);

    $("#pacman-btn").on('click', function() {
        drawPacman(pacmanCanvas);
    });

    // Miter
    canvasWidth = 150;
    canvasHeight = 150;
    var miterCanvas = $("<canvas"
            + " id=miter-canvas"
            + " width=" + canvasWidth
            + " height=" + canvasHeight
            + "></canvas>")
            .appendTo('.miter-canvas-column')
            .get(0);
    miterDemo(miterCanvas);
    $("#miter-btn").on('click', function() {
        miterDemo(miterCanvas);
    });

    // Squares from "basic usage".
    var canvas = document.querySelector("#tutorial");
    var context = drawSquares(canvas);
});


