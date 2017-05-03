define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * General Vector class useful for many applications.
     */
    class Vector {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        plus(other) {
            return new Vector(this.x + other.x, this.y + other.y);
        }
        set(x, y) {
            this.x = x;
            this.y = y;
        }
        equals(other) {
            return (this.x === other.x) && (this.y === other.y);
        }
        copy() {
            return new Vector(this.x, this.y);
        }
    }
    exports.Vector = Vector;
});
//# sourceMappingURL=vector.js.map