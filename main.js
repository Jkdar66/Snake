import { Button, RoundRectangel, Scene, Size, Stage, Vector2 } from "./cool.js";
import { GameBorder } from "./gameborder.js";
import { StartScene } from "./gui.js";
import { Snake } from "./snake.js";
var config = {
    width: innerWidth,
    height: innerHeight
};
const CORNER_SIZE = 30;
const NUM_ROWS = 15;
const NUM_COLUMNS = 22;
const START_X = CORNER_SIZE * 2;
const END_X = CORNER_SIZE * NUM_COLUMNS + START_X - CORNER_SIZE;
const START_Y = CORNER_SIZE * 3;
const END_Y = CORNER_SIZE * NUM_ROWS + START_Y - CORNER_SIZE;
const GAME_CONFIG = {
    startX: START_X, startY: START_Y,
    endX: END_X, endY: END_Y,
    numColumns: NUM_COLUMNS, numRows: NUM_ROWS,
    cornerSize: CORNER_SIZE
};
var canvas;
var startScene;
var gameScene;
var snake;
var gameBorder;
var btn;
var rect;
var stage;
function init() {
    canvas = document.createElement("canvas");
    canvas.width = config.width;
    canvas.height = config.height;
    document.body.appendChild(canvas);
    stage = new Stage();
    gameScene = new Scene(canvas);
    startScene = new StartScene(canvas, gameScene);
    startScene.isVisible = true;
    stage.add(gameScene);
    stage.add(startScene);
    gameBorder = new GameBorder(gameScene, GAME_CONFIG);
    snake = new Snake(gameScene, GAME_CONFIG, gameBorder.wall);
    btn = new Button(new Vector2(START_X, 700), new Size(200, 80));
    rect = new RoundRectangel(new Vector2(START_X, 650), new Size(150, 150));
    rect.style.borderRadius = 5;
    gameScene.hover(btn, () => {
        btn.style.backgroundColor = "rgba(200, 200, 200, 0.8)";
    });
    gameScene.add(btn);
}
function update() {
    stage.update(5, () => {
        stage.show();
    });
    stage.start();
}
function main() {
    init();
    update();
}
main();
