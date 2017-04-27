
var example_plan = [
        "############################",
        "#      #    #      o      ##",
        "#                          #",
        "#          #####           #",
        "##         #   #    ##     #",
        "###           ##     #     #",
        "#           ###      #     #",
        "#   ####                   #",
        "#   ##       o             #",
        "# o  #         o       ### #",
        "#    #                     #",
        "############################"
];


/* ---------------------------------------------------------------------------
 * VECTOR
 * ------------------------------------------------------------------------- */

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

/* ---------------------------------------------------------------------------
 * GRID
 * ------------------------------------------------------------------------- */

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

/**
 * Calls a function 'f' for each element on the grid that isn't
 * null or undefined.
 */
Grid.prototype.forEach = function(f, context) {
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var value = this.get(new Vector(x, y));
            if (value != null) {
                f.call(context, value, new Vector(x, y));
            }
        }
    }
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

/* ---------------------------------------------------------------------------
 * CRITTER(S)
 * ------------------------------------------------------------------------- */

function BouncingCritter() {
    this.direction = randomElement(directionNames);
}

BouncingCritter.prototype.act = function(view) {
    if (view.look(this.direction) != " ") {
        // Move to an empty nearby space, or go south.
        this.direction = view.find(" ") || "s";
    }
    return {type: "move", direction: this.direction};
};


/* ---------------------------------------------------------------------------
 * WORLD
 * ------------------------------------------------------------------------- */

/**
 * Use legend, a map from char -> element ctor.
 */
function elementFromChar(legend, ch) {
    // Define the empty space to refer to null.
    if (ch == " ") {
        return null;
    }
    // Invoke the element constructor.
    var element = new legend[ch]();
    element.originChar = ch;
    return element;
}

/**
 * World
 */
function World(map, legend) {
    // Create the grid as a normal local var so it can be accessed
    // inside the assignForEach loop below.
    var grid = new Grid(map[0].length, map.length);
    this.grid = grid;
    this.legend = legend;

    map.assignForEach(function(line, y) {
        for(var x = 0; x < line.length; x++) {
            grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
        }
    })
}

function charFromElement(element) {
    if (element == null) {
        return " ";
    } else {
        return element.originChar;
    }
}

// TODO: why does this feel like i'm runnin in circles? . . .
World.prototype.toString = function() {
    var output = "";
    for (var y = 0; y < this.grid.height; y++) {
        for (var x = 0; x < this.grid.width; x++) {
            var element = this.grid.get(new Vector(x, y));
            output += charFromElement(element);
        }
        output += "\n";
    }
    return output;
};

/**
 * Give the critters to take a turn (i.e. step/move/etc) in the world.
 */
World.prototype.turn = function() {
    var acted = [];
    this.grid.assignForEach(function(critter, vector) {
        if (critter.act && acted.indexOf(critter) != -1) {
            acted.push(critter);
            this.letAct(critter, vector);
        }
    }, this);
};

/** Man screw comments am i right? */
World.prototype.letAct = function(critter, vector) {
    var action = critter.act(new View(this, vector));
    if (action && action.type == "move") {
        var dest = this.checkDestination(action, vector);
        // If we good to go that way . . .
        if (dest && this.grid.get(dest) == null) {
            // Mark that direction as open . . .
            this.grid.set(vector, null);
            // Put the critter at the dest . . .
            this.grid.set(dest, critter);
        }
    }
};

World.prototype.checkDestination = function(action, vector) {
    if (directions.hasOwnProperty(action.destination)) {
        var dest = vector.plus(directions[action.direction]);
        if (this.grid.isInside(dest)) {
            return dest;
        }
    };
}

/** ok... */
function Wall() {}

/* ---------------------------------------------------------------------------
 * VIEW
 * ------------------------------------------------------------------------- */

function View(world, vector) {
    this.world = world;
    this.vector = vector;
}

View.prototype.look = function(dir) {
    var target = this.vector.plus(directions[dir]);
    if (this.world.grid.isInside(target)) {
        return charFromElement(this.world.grid.get(target));
    } else {
        return "#";
    }
};

View.prototype.findAll = function(ch) {
    var found = [];
    for (var dir in directions)
        if (this.look(dir) == ch)
            found.push(dir);
    return found;
};

View.prototype.find = function(ch) {
    var found = this.findAll(ch);
    if (found.length == 0) return null;
    return randomElement(found);
};


var world = new World(example_plan, 
                     {
    "#": Wall,
    "o": BouncingCritter
});

animateWorld(world);










