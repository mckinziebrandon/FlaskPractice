$(window).load(function() {

    // Create the trump object.
    var trump = new Image();
    var width = 100;
    var height = 100;
    var shouldAnimate = false;

    function draw() {
        var ctx = document.getElementById('trump-animation').getContext('2d');
        var idkSize = 150;
        var rotationPeriod = 2;
        var radius = 0;

        // "New shapes are drawn behind the existing canvas content."
        ctx.globalCompositeOperation = 'destination-over';
        ctx.clearRect(0, 0, 300, 300); // clear canvas

        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        // Saves the entire state of the canvas.
        ctx.save();
        // translate(x, y): move the canvas and its origin by vect (x, y).
        ctx.translate(idkSize, idkSize);

        var time = new Date();

        // ---------- Translate then rotate ----------
        // Rotates canvas clockwise around the current origin (radians).
        ctx.rotate(((2 * Math.PI) / rotationPeriod) * time.getSeconds()
                + ((2 * Math.PI) / (rotationPeriod * 1000)) * time.getMilliseconds());
        ctx.translate(idkSize, 0);

        var x = radius - width - ~~(width/2);
        var y = radius - height - ~~(height/2);
        ctx.drawImage(trump, x, y, width, height);

        // Restores the most recently saved canvas state.
        ctx.restore();
        if (shouldAnimate == true) {
            window.requestAnimationFrame(draw);
        }
    }

    function init() {
        trump.src = 'http://inthesetimes.com/images/articles/trump_flicker_face_yess.jpg'
        trump.className = "img-responsive img-circle"
        shouldAnimate = true;
        window.requestAnimationFrame(draw);
    }

    $("#trump-animation").on('mouseover', init);
    $("#trump-animation").on('mouseout', function() {shouldAnimate = false;});
});
