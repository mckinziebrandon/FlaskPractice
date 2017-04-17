/**
 * Create a purty card row.
 *
 * Behavior:
 * - Before HTML:
 *      <div class="cardify" title="Heckin Title">
 *          muh content (anythin)
 *      </div>
 *
 * - After HTML:
 *      <h4>Heckin Title</h4>
 *      <div class="card-block row">
 *          <div class="col-sm-10">
 *              muh content (anythin)
 *          </div>
 *      </div>
 */
function cardify() {

    console.log("are you shitting me rn");
    // Get (jQuery element containing) all elements with class="cardify".
    var cards = $(".cardify");
    for (var i = cards.length - 1; i >= 0; i--) {

        var card = cards[i];

        // Replace the div with <h4>titleString</h4>.
        if (card.getAttribute("title")) {

            // Extraction.
            var titleString = card.getAttribute("title");
            var innerHTML = card.innerHTML;

            // Creation.
            var titleNode = document.createElement("h4");
            titleNode.appendChild(document.createTextNode(titleString));

            var cardBlock = document.createElement("div");
            if (card.getAttribute("cols")) {
                var numCols = parseInt(card.getAttribute("cols"));
                console.log("cols found = " + numCols);
            } else {
                var numCols = 10;
                console.log("cols not found = " + numCols);
            }
            cardBlock.setAttribute("class", "card-block row");
            // Set the innerHTML of cardBlock (using jQuery).
            $(cardBlock).html(
                "<div class='col-sm-" + numCols + "'>"
                + innerHTML
                + "</div>");

            // Replace the div with the new styled node.
            card.parentNode.replaceChild(titleNode, card);
            // Place the contents of the card after the <h4> title node.
            $(titleNode).after(cardBlock);
        }
    }

};

function newCard() {

    console.log("HAY MOTHERFUCKER");
    // Get (jQuery element containing) all elements with class="new-card".
    var cards = $(".new-card");
    console.log("cards", cards);
    for (var i = cards.length - 1; i >= 0; i--) {

        // Extraction.
        var card        = cards[i];
        var innerHTML   = card.innerHTML;
        var idString    = card.getAttribute("id");

        // Creation.
        var cardRoot = $("<div class=card></div>");
        var header = $("<div/>", {
            id: idString,
            "class": "card-header",
            role: "tab"
        });
        var headerTitle = $("<h2 class=\"mb-0\"></h2>");
        $(headerTitle).append($("<a/>", {
            html: card.getAttribute("title"),
            "data-toggle": "collapse",
            "data-parent": "#accordian",
            "aria-expanded": "true",
            "aria-controls": "#" + idString + "-content",
            href: "#" + idString + "-content",
        }));
        var content = $("<div/>", {
            id: idString + "-content",
            "class": "collapse",
            role: "tabpanel",
            "aria-labelledby": idString
        });

        // Insert header within cardRoot.
        $(header).appendTo(cardRoot);
        // Insert headerTitle within header.
        $(headerTitle).appendTo(header);
        // Insert content within cardRoot (after the header).
        $(content).appendTo(cardRoot);
        // Finally, place the original HTML within cardRoot.
        $(innerHTML).appendTo(content);

        // Replace the div with the new styled node.
        $(card).replaceWith(cardRoot);
    }
}

// TODO: stop being such a js noob.
newCard();
cardify();

