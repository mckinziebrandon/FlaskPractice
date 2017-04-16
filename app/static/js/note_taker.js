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

    var cards = document.getElementsByClassName("cardify");
    console.log(cards);
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
            cardBlock.setAttribute("class", "card-block row");
            console.log(innerHTML);
            cardBlock.innerHTML =
                "<div class='col-sm-10'>"
                + innerHTML
                + "</div>";
            console.log(cardBlock);

            // Replace the div with the new styled node.
            card.parentNode.replaceChild(titleNode, card);
            titleNode.parentNode.appendChild(cardBlock);
        }
    }

};

console.log("Calling cardify");
cardify();
