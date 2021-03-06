import { Rectangle, Scene, Size, Vector2 } from "./cool.js";

export class Snake {
    head: Rectangle;
    tails: Rectangle[];
    food: Rectangle;
    foodX: number;
    foodY: number;
    config: GameConfig;
    CORNER_SIZE: Size;
    dir: number;
    scene: Scene;
    wall: Rectangle[];

    constructor(scene: Scene, config: GameConfig, wall: Rectangle[]) {
        this.scene = scene;
        this.config = config;
        this.wall = wall;
        this.dir = Dir.RIGHT;

        this.tails = [];

        const cfg = this.config;
        this.CORNER_SIZE = new Size(cfg.cornerSize, cfg.cornerSize);

        var headPos = new Vector2(cfg.startX, cfg.startY);
        this.head = new Rectangle(headPos, this.CORNER_SIZE);
        this.head.style.borderColor = "rgb(0, 255, 0)";
        this.head.style.border = true;
        this.head.style.backgroundColor = "rgb(0, 100, 0)";
        this.head.style.borderWidth = 3;

        this.foodX = this.getRandomInt(0, cfg.numColumns - 1) * cfg.cornerSize + cfg.startX;
        this.foodY = this.getRandomInt(0, cfg.numRows - 1) * cfg.cornerSize + cfg.startY;
        this.food = new Rectangle(new Vector2(this.foodX, this.foodY), this.CORNER_SIZE);
        this.food.style.backgroundColor = "rgb(255, 0, 0)";

        this.scene.add(this.food);
        this.scene.add(this.head);

        this.handel();
    }

    getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    addNewTail() {
        var position: Vector2 = new Vector2(0, 0);
        const len = this.tails.length;
        if (len == 0) {
            position.x = this.head.position.x;
            position.y = this.head.position.y;
        } else {
            position.x = this.tails[len - 1].position.x;
            position.y = this.tails[len - 1].position.y;
        }
        var tail = new Rectangle(position, this.CORNER_SIZE);
        tail.style.backgroundColor = "rgba(0, 255, 0, 0.5)"
        this.tails.push(tail);
        this.scene.add(tail);
    }
    collision() {
        if(this.colliedWall() || this.colliedSelf()) {
            this.tails.forEach(tail => {
                tail.position = Object.assign({}, tail.oldPosition);
            });
            this.head.position = Object.assign({}, this.head.oldPosition);
            this.scene.clear();
            this.scene.show();
            // this.scene.pause();
            this.dir = null;
            console.log("GAME OVER");
        }

        this.colliedFood();
    }

    colliedFood(): void {
        var cfg = this.config;
        var headPos = this.head.position;
        var foodPos = this.food.position;
        var floor = Math.floor;
        if (floor(headPos.x) == floor(foodPos.x) && floor(headPos.y) == floor(foodPos.y)) {
            this.addNewTail();
            this.foodX = this.getRandomInt(0, cfg.numColumns - 1) * cfg.cornerSize + cfg.startX;
            this.foodY = this.getRandomInt(0, cfg.numRows - 1) * cfg.cornerSize + cfg.startY;
            this.food.position = new Vector2(this.foodX, this.foodY);
        }
    }
    colliedSelf(): boolean {
        const headPos = this.head.position;
        const tails = this.tails;
        for (let i = 0; i < tails.length; i++) {
            const tail = tails[i];
            const tailPos = tail.position;
            if(headPos.x == tailPos.x && headPos.y == tailPos.y) {
                console.log(true);
                return true;
            }
        }
        return false;
    }
    colliedWall(): boolean{
        const headPos = this.head.position;
        const wall = this.wall;
        for (let i = 0; i < wall.length; i++) {
            const block = wall[i];
            const blockPos = block.position;
            if(headPos.x == blockPos.x && headPos.y == blockPos.y) {
                return true;
            }
        }
        return false;
    }

    update() {
        this.collision();
        this.move();
    }

    move() {
        const len = this.tails.length;
        if (len >= 2) {
            for (let i = len - 1; i >= 1; i--) {
                this.tails[i].oldPosition = Object.assign({}, this.tails[i].position);
                this.tails[i].position.x = this.tails[i - 1].position.x;
                this.tails[i].position.y = this.tails[i - 1].position.y;
            }
        }
    
        if (len >= 1) {
            this.tails[0].oldPosition = Object.assign({}, this.tails[0].position);
            this.tails[0].position.x = this.head.position.x;
            this.tails[0].position.y = this.head.position.y;
        }
    
        
        this.head.oldPosition = Object.assign({}, this.head.position);        

        switch (this.dir) {
            case Dir.RIGHT:
                this.head.position.x += this.config.cornerSize;
                break;
            case Dir.LEFT:
                this.head.position.x -= this.config.cornerSize;
                break;
            case Dir.UP:
                this.head.position.y -= this.config.cornerSize;
                break;
            case Dir.DOWN:
                this.head.position.y += this.config.cornerSize;
                break;
        }
    }
    handel() {
        var isDown = false;
        window.addEventListener("keydown", (e) => {
            e.preventDefault();
            if(!isDown) {
                switch (e.code) {
                    case "ArrowRight":
                        if (this.dir != Dir.LEFT) {
                            this.dir = Dir.RIGHT;
                        }
                        break;
                    case "ArrowLeft":
                        if (this.dir != Dir.RIGHT) {
                            this.dir = Dir.LEFT;
                        }
                        break;
                    case "ArrowUp":
                        if (this.dir != Dir.DOWN) {
                            this.dir = Dir.UP;
                        }
                        break;
                    case "ArrowDown":
                        if (this.dir != Dir.UP) {
                            this.dir = Dir.DOWN;
                        }
                        break;
                }
            }
            isDown = true;
        });
        window.addEventListener("keyup", (e) => {
            isDown = false;
        });
    }
}

export interface GameConfig {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    numRows: number;
    numColumns: number;
    cornerSize: number;
}

enum Dir {
    RIGHT, LEFT, UP, DOWN
}
