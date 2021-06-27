import { Button, Rectangle, Scene, Size, Vector2 } from "./cool.js";
export class StartScene extends Scene {
    constructor(canvas, gameScene) {
        super(canvas);
        this.background = new Rectangle(new Vector2(0, 0), new Size(this.canvas.width, this.canvas.height));
        const bckStyle = this.background.style;
        bckStyle.backgroundColor = "rgb(0, 0, 0)";
        this.startBtn = new Button(new Vector2(100, 100), new Size(150, 50), "Start");
        this.add(this.background);
        this.add(this.startBtn);
        this.hover(this.startBtn, () => {
            this.startBtn.style.backgroundColor = "rgba(200, 200, 200, 0.8)";
        });
        this.onClick(this.startBtn.getPath(), () => {
            this.isVisible = false;
            gameScene.isVisible = true;
        });
    }
}
