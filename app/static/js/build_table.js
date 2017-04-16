/**
 * Write a function buildTable that, given an array of objects that all have
 * the same set of properties, builds up a DOM structure representing a table.
 *
 * The table should have a header row with the property names wrapped in <th>
 * elements and should have one subsequent row per object in the array,
 * with its property values in <td> elements.
 */
function buildTable(objArray) {
    var table = document.createElement("table");
    var headers = Object.keys(objArray[0]);
    console.log(headers);

    // Create the first row of header elements/titles.
    var headerRow = document.createElement("tr");
    for (var i = 0; i < headers.length; i++) {
        var header = headers[i];
        console.log(header);
        var element = document.createElement("th");
        element.appendChild(document.createTextNode(header));
        headerRow.appendChild(element);
        console.log(element);
    }
    table.appendChild(headerRow);

    // Insert the data values.
    for (var i = 0; i < objArray.length; i++) {
        var obj = objArray[i];
        var row = document.createElement("tr");
        for (var j = 0; j < headers.length; j++) {
            var element = document.createElement("td");
            element.appendChild(document.createTextNode(obj[headers[j]]));
            row.appendChild(element);
        }
        table.appendChild(row);
    }

    return table;
}

// The data.
var MOUNTAINS = [
    {name: "Kilimanjaro", height: 5895, country: "Tanzania"},
    {name: "Everest", height: 8848, country: "Nepal"},
    {name: "Mount Fuji", height: 3776, country: "Japan"},
    {name: "Mont Blanc", height: 4808, country: "Italy/France"},
    {name: "Vaalserberg", height: 323, country: "Netherlands"},
    {name: "Denali", height: 6168, country: "United States"},
    {name: "Popocatepetl", height: 5465, country: "Mexico"}
];

var table = buildTable(MOUNTAINS);
document.getElementById("mountains_table").appendChild(table);
