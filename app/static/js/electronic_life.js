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

/**
 * The world Grid of string elements.
 * @param width
 * @param height
 * @constructor
 */
function Grid(width, height) {
    this.space = new Array(width * height);
    this.width = width;
    this.height = height;
}

/** Returns true if vector is inside this grid, else false. */
Grid.prototype.isInside = function(vector) {
    return vector.x >= 0 && vector.x < this.width &&
           vector.y >= 0 && vector.y < this.height;
};

Grid.prototype.get = function(vector) {
    return this.space[vector.x + this.width * vector.y];
};

Grid.prototype.set = function(vector, value) {
    this.space[vector.x + this.width * vector.y] = value;
}

// Map from direction names to coordinate offsets (for critters).
var directions = {
    "n":    new Vector(0, -1),
    "ne":   new Vector(1, -1),
    "e":    new Vector(1, 0),
    "se":   new Vector(1, 1),
    "s":    new Vector(0, 1),
    "sw":   new Vector(-1, 1),
    "w":    new Vector(-1, 0),
    "nw":   new Vector(-1, -1)
}

/** Get a random element of 'array'. */
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

var directionNames = "n ne e se s sw w nw".split(" ");

function BouncingCritter() {
    this.direction = randomElement(directionNames);
}

BouncingCritter.prototype.act = function(view) {
    if (view.look(this.direction) != " ") {
        this.direction = view.find(" ") || "s";
    }
    return {type: "move", direction: this.direction};
}
