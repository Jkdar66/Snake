import { Grid, Rectangle, Scene, Size, Style, Vector2 } from "./cool.js";
import { Snake } from "./snake.js";

var config = {
    width: innerWidth,
    height: innerHeight
}

const CORNER_SIZE = 30;
const NUM_ROWS: number = 20;
const NUM_COLUMNS: number = 20;
const START_X = CORNER_SIZE * 2;
const END_X = CORNER_SIZE * NUM_COLUMNS + START_X - CORNER_SIZE;
const START_Y = CORNER_SIZE * 3;
const END_Y = CORNER_SIZE * NUM_ROWS + START_Y - CORNER_SIZE;

var canvas: HTMLCanvasElement;
var guiScene: Scene;
var gameScene: Scene;
var bounds: Rectangle[];
var grid: Grid;
var gridBorder: Rectangle;
var snake: Snake;

function init() {
    canvas = document.createElement("canvas");
    canvas.width = config.width;
    canvas.height = config.height;
    document.body.appendChild(canvas);

    gameScene = new Scene(canvas);

    bounds = [];

    grid = new Grid(new Vector2(START_X, START_Y), new Size(CORNER_SIZE, CORNER_SIZE), NUM_ROWS, NUM_COLUMNS);
    grid.style.fill = true;
    grid.style.borderColor = "rgb(100, 100, 100)";
    grid.style.backgroundColor = "rgb(200, 200, 200)";

    gridBorder = new Rectangle(
        new Vector2(START_X - CORNER_SIZE, START_Y - CORNER_SIZE),
        new Size((NUM_COLUMNS + 2) * CORNER_SIZE, (NUM_ROWS + 2) * CORNER_SIZE)
    );
    gridBorder.style.fill = false;
    gridBorder.style.border = true;
    gridBorder.style.borderColor = "rgb(0, 0, 0)";
    gridBorder.style.borderWidth = 2;

    var style = new Style();
    style.backgroundColor = "rgb(255, 150, 150)";
    style.border = true;
    style.borderColor = "rgb(255, 255, 255)";

    for (let i = 0; i < 2; i++) {
        var size = new Size(CORNER_SIZE, CORNER_SIZE);
        
        for (let j = -1; j <= NUM_COLUMNS; j++) {
            var x = j * CORNER_SIZE + START_X;
            var y = START_Y - CORNER_SIZE;
            if(i == 1) {
                y = END_Y + CORNER_SIZE;
            }
            var rect = new Rectangle(new Vector2(x, y), size);
            rect.style = style;
            bounds.push(rect);
            gameScene.add(rect);
        }
        
        for (let j = 0; j < NUM_ROWS; j++) {
            var y = j * CORNER_SIZE + START_Y;
            var x = START_X - CORNER_SIZE;
            if(i == 1) {
                x = END_X + CORNER_SIZE;
            }
            var rect = new Rectangle(new Vector2(x, y), size);
            rect.style = style;
            bounds.push(rect);
            gameScene.add(rect);
        }
    }

    gameScene.add(grid);
    gameScene.add(gridBorder);

    snake = new Snake(gameScene, {
        startX: START_X, startY: START_Y,
        endX: END_X, endY: END_Y,
        numColumns: NUM_COLUMNS, numRows: NUM_ROWS,
        cornerSize: CORNER_SIZE
    });
}

function update() {
    gameScene.update(8, () => {
        gameScene.clear();
        gameScene.show();
        snake.collision();
        snake.move();
    });
}

function main() {
    init();
    update();
}

main();