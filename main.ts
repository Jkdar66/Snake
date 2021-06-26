import { Game, Grid, Rectangle, Scene, Size, Vector2 } from "./cool.js";

var config = {
    width: innerWidth,
    height: innerHeight
}

const CORNER_SIZE = 30;
const NUM_ROWS: number = 20;
const NUM_COLUMNS: number = 20;

var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var game: Game;
var scene: Scene;
var head: Rectangle;
var tails: Rectangle[];
var food: Rectangle;
var grid: Grid;
var foodX: number;
var foodY: number;
var dir: number;

enum Dir{
    RIGHT, LEFT, UP, DOWN
}

function init() {
    canvas = document.createElement("canvas");
    canvas.width = config.width;
    canvas.height = config.height;
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");

    dir = Dir.RIGHT;
    
    scene = new Scene(canvas);
    game = new Game(scene);

    tails = [];
    
    head = new Rectangle(new Vector2(0, 0), new Size(CORNER_SIZE, CORNER_SIZE));
    head.style.backgroundColor = "rgb(0, 255, 0)";

    foodX = getRandomInt(0, NUM_COLUMNS - 1) * CORNER_SIZE;
    foodY = getRandomInt(0, NUM_ROWS - 1) * CORNER_SIZE;
    food = new Rectangle(new Vector2(foodX, foodY), new Size(CORNER_SIZE, CORNER_SIZE));
    food.style.backgroundColor = "rgb(255, 0, 0)";

    grid = new Grid(new Vector2(0, 0), new Size(CORNER_SIZE, CORNER_SIZE), NUM_ROWS, NUM_COLUMNS);
    grid.style.fill = true;
    grid.style.backgroundColor = "rgb(150, 150, 150)";
    
    game.add(grid);
    game.add(food);
    game.add(head);
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function update() {
    scene.update(8, () => {
        scene.clear();
        game.draw();
        collision();
        move();
    });
}

function collision() {
    var headPos = head.position;
    var foodPos = food.position;
    var floor = Math.floor;
    if(floor(headPos.x) == floor(foodPos.x) && floor(headPos.y) == floor(foodPos.y)) {
        addNewTail();
        foodX = getRandomInt(0, NUM_COLUMNS - 1) * CORNER_SIZE;
        foodY = getRandomInt(0, NUM_ROWS - 1) * CORNER_SIZE;
        food.position = new Vector2(foodX, foodY);
    }
}

function addNewTail() {
    var position: Vector2 = new Vector2(0, 0);
    if(tails.length == 0) {
        position.x = head.position.x;
        position.y = head.position.y;
    }else {
        position.x = tails[tails.length-1].position.x;
        position.y = tails[tails.length-1].position.y;
    }
    var tail = new Rectangle(position, new Size(CORNER_SIZE, CORNER_SIZE));
    tail.style.backgroundColor = "rgba(0, 255, 0, 0.5)"
    tails.push(tail);
    game.add(tail);
}

function move() {

    if(tails.length >= 2) {
        for (let i = tails.length - 1; i >= 1; i--) {
            tails[i].position.x = tails[i-1].position.x;
            tails[i].position.y = tails[i-1].position.y;
        }
    }

    if(tails.length >= 1) {
        tails[0].position.x = head.position.x;
        tails[0].position.y = head.position.y;
    }

    switch(dir) {
        case Dir.RIGHT:
            if(head.position.x < CORNER_SIZE*(NUM_COLUMNS-1)) {
                head.position.x += CORNER_SIZE;
            }
            break;
        case Dir.LEFT:
            if(head.position.x > 0) {
                head.position.x -= CORNER_SIZE;
            }
            break;
        case Dir.UP:
            if(head.position.y > 0) {
                head.position.y -= CORNER_SIZE;
            }
            break;
        case Dir.DOWN:
            if(head.position.y < CORNER_SIZE*(NUM_ROWS-1)) {
                head.position.y += CORNER_SIZE;
            }
            break;
    }
}

function handel() {
    window.addEventListener("keydown", (e) => {
        e.preventDefault();
        switch(e.code) {
            case "ArrowRight":
                if(dir != Dir.LEFT) {
                    dir = Dir.RIGHT;
                }
                break;
            case "ArrowLeft":
                if(dir != Dir.RIGHT) {
                    dir = Dir.LEFT;
                }
                break;
            case "ArrowUp":
                if(dir != Dir.DOWN) {
                    dir = Dir.UP;
                }
                break;
            case "ArrowDown":
                if(dir != Dir.UP) {
                    dir = Dir.DOWN;
                }
                break;
        }
    });
}


function main() {
    init();
    handel();
    update();
}

main();