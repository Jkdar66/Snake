import { Node, RoundRectangel, Shape, Style } from "./cool.js";
export class Button extends RoundRectangel {
    constructor(position, size, text) {
        super(position, size);
        var style = new Style();
        style.backgroundColor = "rgba(200, 200, 200, 1)";
        style.border = true;
        style.borderWidth = 7;
        style.borderRadius = 10;
        style.borderColor = "rgba(180, 180, 180, 1)";
        this.style = Object.assign({}, style);
        this.text = text;
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
        if (node instanceof Shape) {
            this.drawShape(node);
        }
        else if (node instanceof Text) {
            this.drawText(node);
        }
    }
}
