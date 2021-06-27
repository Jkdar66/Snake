import { Grid, Rectangle, Size, Style, Vector2 } from "./cool.js";
export class GameBorder {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.wall = [];
        const CORNER_SIZE = this.config.cornerSize;
        const NUM_ROWS = this.config.numRows;
        const NUM_COLUMNS = this.config.numColumns;
        const START_X = this.config.startX;
        const START_Y = this.config.startY;
        const END_X = this.config.endX;
        const END_Y = this.config.endY;
        this.grid = new Grid(new Vector2(START_X, START_Y), new Size(CORNER_SIZE, CORNER_SIZE), NUM_COLUMNS, NUM_ROWS);
        this.grid.style.fill = true;
        this.grid.style.borderColor = "rgb(100, 100, 100)";
        this.grid.style.backgroundColor = "rgb(200, 200, 200)";
        this.gridBorder = new Rectangle(new Vector2(START_X - CORNER_SIZE, START_Y - CORNER_SIZE), new Size((NUM_COLUMNS + 2) * CORNER_SIZE, (NUM_ROWS + 2) * CORNER_SIZE));
        this.gridBorder.style.fill = false;
        this.gridBorder.style.border = true;
        this.gridBorder.style.borderColor = "rgb(0, 0, 0)";
        this.gridBorder.style.borderWidth = 2;
        this.scene.add(this.grid);
        this.scene.add(this.gridBorder);
        var style = new Style();
        style.backgroundColor = "rgb(150, 0, 0)";
        style.border = true;
        style.borderColor = "rgb(255, 255, 255)";
        for (let i = 0; i < 2; i++) {
            var size = new Size(CORNER_SIZE, CORNER_SIZE);
            for (let j = -1; j <= NUM_COLUMNS; j++) {
                var x = j * CORNER_SIZE + START_X;
                var y = START_Y - CORNER_SIZE;
                if (i == 1) {
                    y = END_Y + CORNER_SIZE;
                }
                var rect = new Rectangle(new Vector2(x, y), size);
                rect.style = style;
                this.wall.push(rect);
                this.scene.add(rect);
            }
            for (let j = 0; j < NUM_ROWS; j++) {
                var y = j * CORNER_SIZE + START_Y;
                var x = START_X - CORNER_SIZE;
                if (i == 1) {
                    x = END_X + CORNER_SIZE;
                }
                var rect = new Rectangle(new Vector2(x, y), size);
                rect.style = style;
                this.wall.push(rect);
                this.scene.add(rect);
            }
        }
    }
}
