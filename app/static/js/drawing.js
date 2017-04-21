$(window).load(function() {

    function trumpStuff() {
        var trumpCanvas = document.querySelector("#trump-home");
        var imgSrc = $("#trump-image").attr("src");
        var div = document.createElement("div");

        $(div).css({
            position: "absolute"
            /*left: "10px"*/
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
        var toggleFollowMouse = function(event) {
            if (bool == true) {
                $(div).css({
                    left: event.pageX - imgSize/2,
                    top: event.pageY - imgSize/2,
                });
            } else {
                $(trumpCanvas).append(div);
            }
        };

        $(div).on("click", function() {
            bool = !bool;
            $(document).on("mousemove", toggleFollowMouse);
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
                + " id=id"
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
        console.log('uh hey');
        console.log('Canvas width:' + canvasWidth);
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

    /*-----------------------------------------------------
     * Actual execution of stuff.
     * ----------------------------------------------------- */

    // do the trump stuff
    trumpStuff();

    var canvasWidth = 150;
    var canvasHeight = 200;

    var drawerOne = new ShapeDrawer('shape-canvas-1', canvasWidth, canvasHeight);
    $("#triangle-btn").on('click', function() { drawerOne.drawTriangle(); });
    $("#grid-btn").on('click', function() { drawerOne.drawGrid(); });

    var drawerTwo = new ShapeDrawer('shape-canvas-2', canvasWidth, canvasHeight);
    $("#arcs-btn").on('click', function() { drawerTwo.drawArcs(); });

    // get a context
    var canvas = document.querySelector("#tutorial");
    var context = drawSquares(canvas);
    //$("body").append(canvas);


});


