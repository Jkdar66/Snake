export class Draw {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    }
    setStyle(style: Style) {
        this.ctx.save();
        this.ctx.fillStyle = style.backgroundColor;
        this.ctx.strokeStyle = style.borderColor;
        this.ctx.lineWidth = style.borderWidth;
        this.ctx.font = style.font;
        this.ctx.textAlign = style.textAlign;
    }
    drawShape(shape: Shape) {
        const config = shape.style;

        this.setStyle(shape.style);
        this.ctx.clip(shape.getPath());
        if(config.fill && config.border) {
            this.ctx.fill(shape.getPath());
            this.ctx.stroke(shape.getPath());
        }else if(config.fill) {
            this.ctx.fill(shape.getPath());
        }else if(config.border) {
            this.ctx.stroke(shape.getPath());
        }else{
            this.ctx.fill(shape.getPath());
        }
        this.ctx.restore();
    }
    drawText(text: Text) {
        const config = text.style;
        this.setStyle(text.style);
        if(config.fill && config.border) {
            this.ctx.fillText(text.getText(), text.position.x, text.position.y);
            this.ctx.strokeText(text.getText(), text.position.x, text.position.y);
        }else if(config.fill) {
            this.ctx.fillText(text.getText(), text.position.x, text.position.y);
        }else if(config.border) {
            this.ctx.strokeText(text.getText(), text.position.x, text.position.y);
        }else{
            this.ctx.fillText(text.getText(), text.position.x, text.position.y);
        }
        this.ctx.restore();
    }
    draw(node: Node) {
        if(node instanceof Button) {
            this.drawShape(node);
            this.drawText(node.text);
        }else if(node instanceof Shape) {
            this.drawShape(node);
        }else if(node instanceof Text) {
            this.drawText(node);
        }
    }
}

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
    oldPosition: Vector2;
    style: Style;
    constructor(position: Vector2) {
        this.position = position;
        this.oldPosition = Object.assign({}, this.position);
        this.style = new Style();
    }
    getPath(): Path2D {
        var path = new Path2D();
        return path;
    }
}
export class Shape extends Node {
    constructor(position: Vector2) {
        super(position);
    }
}
export class Rectangle extends Shape{
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
export class RoundRectangel extends Shape {
    size: Size;
    constructor(position: Vector2, size: Size) {
        super(position);
        this.size = size;
        this.style.borderRadius = 5;
    }
    getPath(): Path2D {
        const rect = new Path2D();
        var x = this.position.x + this.style.borderRadius, y = this.position.y;
        var r = this.style.borderRadius;
        var w = this.size.width - (r*2), h = this.size.height - (r*2);
        rect.moveTo(x, y);
        rect.lineTo(x + w, y);
        rect.arcTo(x + w + r, y, x + w + r, y + r, r);
        rect.lineTo(x + w + r, y + r + h);
        rect.arcTo(x + w + r, y + r + h + r, x + w, y + r + h + r, r);
        rect.lineTo(x, y + r + h + r);
        rect.arcTo(x - r, y + r + h + r, x - r, y + r + h, r);
        rect.lineTo(x - r, y + r);
        rect.arcTo(x - r, y, x, y, r);
        return rect;
    }
}
export class Circle extends Shape{
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
export class Button extends RoundRectangel {
    text: Text;
    constructor(position: Vector2, size: Size, text: string = "Click me!") {
        super(position, size);
        var style = new Style();
        style.backgroundColor = "rgba(200, 200, 200, 1)";
        style.border = true;
        style.borderWidth = 7;
        style.borderRadius = 10;
        style.borderColor = "rgba(180, 180, 180, 1)";
        style.font = "20px Arial";
        this.style = Object.assign({}, style);
        const txtPos = new Vector2(
            this.position.x + (this.size.width/2),
            this.position.y + (this.size.height/2) + 5
        );
        this.text = new Text(txtPos, text);
        style.backgroundColor = "black";
        style.borderColor = "black";
        style.border = false;
        this.text.style = Object.assign({}, style);
    }
}
export class Text extends Node{
    text: string;
    constructor(position: Vector2, text: string) {
        super(position);
        this.text = text;
    }
    getText(): string {
        return this.text;
    }
}
export class Grid extends Shape{
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
    children: Node[];
    _draw: Draw;
    isVisible: boolean;
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.children = [];
        this._draw = new Draw(this.canvas);
        this.isVisible = false;
    }
    clear() {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    add(node: Node) {
        this.children.push(node);
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
    show() {
        if(this.isVisible) {
            this.children.forEach(node => {
                this._draw.draw(node);
            });
        }
    }

    private isPointInCanvas(path: Path2D, mouseX: number, mouseY: number): boolean {
        const ctx = this.canvas.getContext("2d");
        if(ctx.isPointInPath(path, mouseX, mouseY)) {
            return true;
        }
        if(ctx.isPointInStroke(path, mouseX, mouseY)) {
            return true;
        }
        return false;
    }
    addEvent(path: Path2D, type: string, callback: CallableFunction) {
        this.canvas.addEventListener(type, (event) => {
            var e = event as MouseEvent;
            const CANVAS_POS = this.canvas.getBoundingClientRect();
            const MOUSE_POS = {
                x: e.clientX - CANVAS_POS.x,
                y: e.clientY - CANVAS_POS.y
            };
            if(this.isPointInCanvas(path, MOUSE_POS.x, MOUSE_POS.y)) {
                callback(e);
            }
        });
    }
    hover(node: Node, callback: CallableFunction) {
        const oldStyle = Object.assign({}, node.style);
        this.onEnter(node.getPath(), () => {
            this.clear();
            callback();
            this.canvas.style.cursor = "pointer";
            this.show();
        });
        this.onOut(node.getPath(), () => {
            this.clear();
            node.style = Object.assign({}, oldStyle)
            this.canvas.style.cursor = "default";
            this.show();
        });
    }
    onEnter(path: Path2D, callback: CallableFunction) {
        var entered = false;
        this.canvas.addEventListener("mousemove", (e) => {
            const CANVAS_POS = this.canvas.getBoundingClientRect();
            const MOUSE_POS = {
                x: e.clientX - CANVAS_POS.x,
                y: e.clientY - CANVAS_POS.y
            };
            if(this.isPointInCanvas(path, MOUSE_POS.x, MOUSE_POS.y)) {
                if(!entered) {
                    entered = true;
                    callback(e);
                }
            }else {
                entered = false;
            }
        });
    }
    onOut(path: Path2D, callback: CallableFunction) {
        var out = true;
        this.canvas.addEventListener("mousemove", (e) => {
            const CANVAS_POS = this.canvas.getBoundingClientRect();
            const MOUSE_POS = {
                x: e.clientX - CANVAS_POS.x,
                y: e.clientY - CANVAS_POS.y
            };
            if(this.isPointInCanvas(path, MOUSE_POS.x, MOUSE_POS.y)) {
                out = false;
            }else {
                if(!out) {
                    callback(e);
                }
                out = true;
            }
        });
    }
    onClick(path: Path2D, callback: CallableFunction) {
        this.addEvent(path, "click", callback);
    }
    onDown(path: Path2D, callback: CallableFunction) {
        this.addEvent(path, "mousedown", callback);
    }
    onUp(path: Path2D, callback: CallableFunction) {
        this.addEvent(path, "mouseup", callback);
    }
    onMove(path: Path2D, callback: CallableFunction) {
        this.addEvent(path, "mousemove", callback);
    }
}
export class Stage {
    children: Scene[];
    private animation: Animation;
    constructor() {
        this.children = [];
    }
    add(scene: Scene) {
        this.children.push(scene);
    }
    show() {
        this.children.forEach(scene => {
            if(scene.isVisible) {
                scene.clear();
                scene.show();
            }
        });
    }
    update(fps: number, callback: CallableFunction) {
        this.animation = new Animation(fps, callback);
    }
    start(): void{
        this.animation.start();
    }
    pause(): void {
        this.animation.pause();
    }
}
class Animation {
    pause: Function;
    start: Function;
    constructor(fps: number, callback: CallableFunction) {
        var id = null;
        var run = true;

        function animate() {
            function update() {
                callback();
                setTimeout(() => {
                    id = requestAnimationFrame(update);
                    if(!run) {
                        cancelAnimationFrame(id);
                    }
                }, 1000 / fps);
            }
            update();
        }

        this.pause = function() {
            run = false;
        }
        this.start = function(){
            animate();
        }
    }
}

export class Style {
    backgroundColor: string;
    borderColor: string;
    fill: boolean;
    border: boolean;
    borderWidth: number;
    borderRadius: number;
    font: string;
    textAlign: CanvasTextAlign;
    constructor() {
        this.backgroundColor = "rgb(0,0,0)";
        this.borderColor = "rgb(0,0,0)";
        this.fill = true;
        this.border = false;
        this.borderWidth = 1;
        this.borderRadius = 0;
        this.font = "30px Arial";
        this.textAlign = "center";
    }
}