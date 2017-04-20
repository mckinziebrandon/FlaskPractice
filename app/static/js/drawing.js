$(document).ready(function() {

    var trumpCanvas = document.querySelector("#trump-home");
    var imgSrc = $("#trump-image").attr("src").toString();

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

});


