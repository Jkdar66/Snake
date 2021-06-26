export class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
export class Size {
    width: number;
    height: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}
export class Node {
    position: Vector2;
    style: Style;
    constructor(position: Vector2) {
        this.position = position;
        this.style = new Style();
    }
    getPath(): Path2D {
        var path = new Path2D();
        return path;
    }
}
export class Rectangle extends Node{
    size: Size;
    constructor(position: Vector2, size: Size) {
        super(position);
        this.size = size;
    }
    getPath(): Path2D{
        const rect = new Path2D();
        rect.rect(this.position.x, this.position.y, this.size.width, this.size.height);
        return rect;
    }
}
export class Circle extends Node{
    radius: number;
    constructor(position: Vector2, radius: number) {
        super(position);
        this.radius = radius;
    }
    getPath(): Path2D{
        const circ = new Path2D();
        circ.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false);
        return circ;
    }
}
export class Grid extends Node{
    cellSize: Size;
    column: number;
    row: number;
    constructor(position: Vector2, cellSize: Size, column: number, row: number) {
        super(position);
        this.cellSize = cellSize;
        this.column = column;
        this.row = row;
        this.style.fill = false;
        this.style.border = true;
    }
    getPath(): Path2D{
        const grid = new Path2D();
        for (let x = 0; x < this.column; x++) {
            for (let y = 0; y < this.row; y++) {
                const _x = this.position.x + (x * this.cellSize.width);
                const _y = this.position.y + (y * this.cellSize.height);
                grid.rect(_x, _y, this.cellSize.width, this.cellSize.height);
            }
        }
        return grid;
    }
}
export class Scene {
    canvas: HTMLCanvasElement;
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }
    update(fps: number, callback: CallableFunction) {

        var	delay = 1000 / fps,
            time = null,
            frame = -1,
            tref: number;
    
        function loop(timestamp: number) {
            if (time === null) time = timestamp;
            var seg = Math.floor((timestamp - time) / delay);
            if (seg > frame) {
                frame = seg;
                callback({
                    time: timestamp,
                    frame: frame
                })
            }
            tref = requestAnimationFrame(loop)
        }
    
        var isPlaying = false;
        
        var frameRate = function(newfps: number) {
            if (!arguments.length) return fps;
            fps = newfps;
            delay = 1000 / fps;
            frame = -1;
            time = null;
        };
        
        var start = function() {
            if (!isPlaying) {
                isPlaying = true;
                tref = requestAnimationFrame(loop);
            }
        };
        
        var pause = function() {
            if (isPlaying) {
                cancelAnimationFrame(tref);
                isPlaying = false;
                time = null;
                frame = -1;
            }
        };
        start();
    }
    clear() {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    draw(path2d: Path2D, config: Style) {
        const ctx = this.canvas.getContext("2d");
        ctx.save();
        ctx.fillStyle = config.backgroundColor;
        ctx.strokeStyle = config.borderColor;
        if(config.fill && config.border) {
            ctx.fill(path2d);
            ctx.stroke(path2d);
        }else if(config.fill) {
            ctx.fill(path2d);
        }else if(config.border) {
            ctx.stroke(path2d);
        }else{
            ctx.fill(path2d);
        }
        ctx.restore();
    }
}
export class Game {
    scene: Scene;
    children: Node[];
    constructor(scene: Scene) {
        this.scene = scene;
        this.children = [];
    }
    add(node: Node) {
        this.children.push(node);
    }
    draw() {
        this.children.forEach(node => {
            this.scene.draw(node.getPath(), node.style);
        });
    }
    remove(node: Node) {
        for (let i = 0; i < this.children.length; i++) {
            const elem = this.children[i];
            if(elem == node) {
                this.children.splice(i, 1);
                break;
            }
        }
    }
}

class Style {
    backgroundColor: string;
    borderColor: string;
    fill: boolean;
    border: boolean;
    constructor() {
        this.backgroundColor = "rgb(0,0,0)";
        this.borderColor = "rgb(0,0,0)";
        this.fill = true;
        this.border = false;
        Date.now
    }
}