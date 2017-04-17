/**
 * Program a text field (an <input type="text"> tag) that Q, W, and X
 * cannot be typed into.
 */

var forbiddenKeys = {
    Q: 81,
    W: 87,
    X: 88
};

// Get the target input element by id.
var inputElement = $("#censored_keyboard"); //.get(0);
$(inputElement).on("keydown", function(event) {
    var key = event.which;
    if ($.inArray(key, Object.values(forbiddenKeys)) != -1) {
        console.log("Censoring " + key);
        event.preventDefault();
        var nope = document.createElement("p");
        $(nope).text("NOPE.");
        $(inputElement).after(nope);
    }
});

