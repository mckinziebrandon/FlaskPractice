define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * General Vector class useful for many applications.
     */
    var Vector = (function () {
        function Vector(x, y) {
            this.x = x;
            this.y = y;
        }
        Vector.prototype.plus = function (other) {
            return new Vector(this.x + other.x, this.y + other.y);
        };
        Vector.prototype.set = function (x, y) {
            this.x = x;
            this.y = y;
        };
        Vector.prototype.equals = function (other) {
            return (this.x === other.x) && (this.y === other.y);
        };
        Vector.prototype.copy = function () {
            return new Vector(this.x, this.y);
        };
        return Vector;
    }());
    exports.Vector = Vector;
});
//# sourceMappingURL=vector.js.map