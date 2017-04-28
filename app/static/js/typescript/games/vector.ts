/**
 * General Vector class useful for many applications.
 */
export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    plus(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    set(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    equals(other: Vector): boolean {
        return (this.x === other.x) && (this.y === other.y);
    }

    copy(): Vector {
        return new Vector(this.x, this.y);
    }

}

