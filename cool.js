export class Draw {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    }
    setStyle(style) {
        this.ctx.save();
        this.ctx.fillStyle = style.backgroundColor;
        this.ctx.strokeStyle = style.borderColor;
        this.ctx.lineWidth = style.borderWidth;
        this.ctx.font = style.font;
        this.ctx.textAlign = style.textAlign;
    }
    drawShape(shape) {
        const config = shape.style;
        this.setStyle(shape.style);
        this.ctx.clip(shape.getPath());
        if (config.fill && config.border) {
            this.ctx.fill(shape.getPath());
            this.ctx.stroke(shape.getPath());
        }
        else if (config.fill) {
            this.ctx.fill(shape.getPath());
        }
        else if (config.border) {
            this.ctx.stroke(shape.getPath());
        }
        else {
            this.ctx.fill(shape.getPath());
        }
        this.ctx.restore();
    }
    drawText(text) {
        const config = text.style;
        this.setStyle(text.style);
        if (config.fill && config.border) {
            this.ctx.fillText(text.getText(), text.position.x, text.position.y);
            this.ctx.strokeText(text.getText(), text.position.x, text.position.y);
        }
        else if (config.fill) {
            this.ctx.fillText(text.getText(), text.position.x, text.position.y);
        }
        else if (config.border) {
            this.ctx.strokeText(text.getText(), text.position.x, text.position.y);
        }
        else {
            this.ctx.fillText(text.getText(), text.position.x, text.position.y);
        }
        this.ctx.restore();
    }
    draw(node) {
        if (node instanceof Button) {
            this.drawShape(node);
            this.drawText(node.text);
        }
        else if (node instanceof Shape) {
            this.drawShape(node);
        }
        else if (node instanceof Text) {
            this.drawText(node);
        }
    }
}
export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
export class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}
export class Node {
    constructor(position) {
        this.position = position;
        this.oldPosition = Object.assign({}, this.position);
        this.style = new Style();
    }
    getPath() {
        var path = new Path2D();
        return path;
    }
}
export class Shape extends Node {
    constructor(position) {
        super(position);
    }
}
export class Rectangle extends Shape {
    constructor(position, size) {
        super(position);
        this.size = size;
    }
    getPath() {
        const rect = new Path2D();
        rect.rect(this.position.x, this.position.y, this.size.width, this.size.height);
        return rect;
    }
}
export class RoundRectangel extends Shape {
    constructor(position, size) {
        super(position);
        this.size = size;
        this.style.borderRadius = 5;
    }
    getPath() {
        const rect = new Path2D();
        var x = this.position.x + this.style.borderRadius, y = this.position.y;
        var r = this.style.borderRadius;
        var w = this.size.width - (r * 2), h = this.size.height - (r * 2);
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
export class Circle extends Shape {
    constructor(position, radius) {
        super(position);
        this.radius = radius;
    }
    getPath() {
        const circ = new Path2D();
        circ.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        return circ;
    }
}
export class Button extends RoundRectangel {
    constructor(position, size, text = "Click me!") {
        super(position, size);
        var style = new Style();
        style.backgroundColor = "rgba(200, 200, 200, 1)";
        style.border = true;
        style.borderWidth = 7;
        style.borderRadius = 10;
        style.borderColor = "rgba(180, 180, 180, 1)";
        style.font = "20px Arial";
        this.style = Object.assign({}, style);
        const txtPos = new Vector2(this.position.x + (this.size.width / 2), this.position.y + (this.size.height / 2) + 5);
        this.text = new Text(txtPos, text);
        style.backgroundColor = "black";
        style.borderColor = "black";
        style.border = false;
        this.text.style = Object.assign({}, style);
    }
}
export class Text extends Node {
    constructor(position, text) {
        super(position);
        this.text = text;
    }
    getText() {
        return this.text;
    }
}
export class Grid extends Shape {
    constructor(position, cellSize, column, row) {
        super(position);
        this.cellSize = cellSize;
        this.column = column;
        this.row = row;
        this.style.fill = false;
        this.style.border = true;
    }
    getPath() {
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
    constructor(canvas) {
        this.canvas = canvas;
        this.children = [];
        this._draw = new Draw(this.canvas);
        this.isVisible = false;
    }
    clear() {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    add(node) {
        this.children.push(node);
    }
    remove(node) {
        for (let i = 0; i < this.children.length; i++) {
            const elem = this.children[i];
            if (elem == node) {
                this.children.splice(i, 1);
                break;
            }
        }
    }
    show() {
        if (this.isVisible) {
            this.children.forEach(node => {
                this._draw.draw(node);
            });
        }
    }
    isPointInCanvas(path, mouseX, mouseY) {
        const ctx = this.canvas.getContext("2d");
        if (ctx.isPointInPath(path, mouseX, mouseY)) {
            return true;
        }
        if (ctx.isPointInStroke(path, mouseX, mouseY)) {
            return true;
        }
        return false;
    }
    addEvent(path, type, callback) {
        this.canvas.addEventListener(type, (event) => {
            var e = event;
            const CANVAS_POS = this.canvas.getBoundingClientRect();
            const MOUSE_POS = {
                x: e.clientX - CANVAS_POS.x,
                y: e.clientY - CANVAS_POS.y
            };
            if (this.isPointInCanvas(path, MOUSE_POS.x, MOUSE_POS.y)) {
                callback(e);
            }
        });
    }
    hover(node, callback) {
        const oldStyle = Object.assign({}, node.style);
        this.onEnter(node.getPath(), () => {
            this.clear();
            callback();
            this.canvas.style.cursor = "pointer";
            this.show();
        });
        this.onOut(node.getPath(), () => {
            this.clear();
            node.style = Object.assign({}, oldStyle);
            this.canvas.style.cursor = "default";
            this.show();
        });
    }
    onEnter(path, callback) {
        var entered = false;
        this.canvas.addEventListener("mousemove", (e) => {
            const CANVAS_POS = this.canvas.getBoundingClientRect();
            const MOUSE_POS = {
                x: e.clientX - CANVAS_POS.x,
                y: e.clientY - CANVAS_POS.y
            };
            if (this.isPointInCanvas(path, MOUSE_POS.x, MOUSE_POS.y)) {
                if (!entered) {
                    entered = true;
                    callback(e);
                }
            }
            else {
                entered = false;
            }
        });
    }
    onOut(path, callback) {
        var out = true;
        this.canvas.addEventListener("mousemove", (e) => {
            const CANVAS_POS = this.canvas.getBoundingClientRect();
            const MOUSE_POS = {
                x: e.clientX - CANVAS_POS.x,
                y: e.clientY - CANVAS_POS.y
            };
            if (this.isPointInCanvas(path, MOUSE_POS.x, MOUSE_POS.y)) {
                out = false;
            }
            else {
                if (!out) {
                    callback(e);
                }
                out = true;
            }
        });
    }
    onClick(path, callback) {
        this.addEvent(path, "click", callback);
    }
    onDown(path, callback) {
        this.addEvent(path, "mousedown", callback);
    }
    onUp(path, callback) {
        this.addEvent(path, "mouseup", callback);
    }
    onMove(path, callback) {
        this.addEvent(path, "mousemove", callback);
    }
}
export class Stage {
    constructor() {
        this.children = [];
    }
    add(scene) {
        this.children.push(scene);
    }
    show() {
        this.children.forEach(scene => {
            if (scene.isVisible) {
                scene.clear();
                scene.show();
            }
        });
    }
    update(fps, callback) {
        this.animation = new Animation(fps, callback);
    }
    start() {
        this.animation.start();
    }
    pause() {
        this.animation.pause();
    }
}
class Animation {
    constructor(fps, callback) {
        var id = null;
        var run = true;
        function animate() {
            function update() {
                callback();
                setTimeout(() => {
                    id = requestAnimationFrame(update);
                    if (!run) {
                        cancelAnimationFrame(id);
                    }
                }, 1000 / fps);
            }
            update();
        }
        this.pause = function () {
            run = false;
        };
        this.start = function () {
            animate();
        };
    }
}
export class Style {
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
