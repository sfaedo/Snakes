// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

var Snakes = Snakes || {};
 
Snakes = (function(snakes) {
    'use strict';

    snakes.version = '1.0.0';
    snakes.author = 'Sebastian Faedo';
    return snakes;    
}(Snakes || {}));

/* Cell */
Snakes = (function (snakes){
    'use strict';

    var Cell = function (x, y) {
        this.x = x || 0;
        this.y = y || 0;
        this.type = 0;
        this.color = '';
    };
    
    var cell = Cell.prototype;

    cell.toString = function () {
        return '[Snakes.Cell]';
    };

    snakes.Cell = Cell;
    return snakes;    
} (Snakes || {}));

/* Fruit */
Snakes = (function (snakes) {
    'use strict';
    
    var Fruit = function (Board) {
        this.Board = Board;
    };
    
    var fruit = Fruit.prototype;
    
    fruit.addFruit = function() {
        var posX = Math.floor(Math.random() * this.Board.boardSize);
        var posY = Math.floor(Math.random() * this.Board.boardSize);
        var oPosX = posX;
        var oPosY = posY;
    
        while (this.Board.board[posX][posY].type) {
            posX++;
            if (posX == this.Board.boardSize) {
                posX = 0;
                posY = (posY + 1) % this.Board.boardSize;
            }
    
            if (oPosX == posX && oPosY == posY) {
                //clearInterval(gameLoop);
                //playing = false;
            }
        }
    
        this.Board.board[posX][posY].type = 3;        
    };
    
    fruit.toString = function () {
        return '[Snakes.Fruit]';
    };

    snakes.Fruit = Fruit;
    return snakes;      
} (Snakes || {}));

/* Board */
Snakes = (function (snakes) {
    'use strict';

    var Board = function (boardSize) {
        this.boardSize = boardSize || 30;
        this.board = [];
        this.snakes = [];
        this.createBoard();
        this.fruit = new Snakes.Fruit(this);
    };
    
    var board = Board.prototype;

    board.createBoard = function () {
        this.board = new Array(this.boardSize);
        
        for (var i = 0; i < this.boardSize; i++) {
            this.board[i] = new Array(this.boardSize);
            for (var j = 0; j < this.boardSize; j++) {
                this.board[i][j] = new Snakes.Cell(i, j);
            }
        }
    };

    board.addSnake = function(id, color) {
        var snake = new Snakes.Snake(id, color, this);
        if (snake) {
            this.snakes.push(snake);
        }
        return snake;
    };
    
    board.removeSnake = function(id) {
        // TODO
    };
    
    board.addFruit = function ()
    {
        this.fruit.addFruit();
    };
    
    board.moveSnakes = function() {
        for (var i = 0; i < this.snakes.length; i++) {
            this.snakes[i].move();
        }
    };
    
    board.toString = function () {
        return '[Snakes.Board]';
    };

    snakes.Board = Board;
    return snakes;

}(Snakes || {}));

/* Snake */
Snakes = (function (snakes) {
    'use strict';

    var Snake = function (id, color, Board) {
        this.id = id;
        this.color = color;
        this.Board = Board;
        this.speed = 150;
        this.step = 1000;
        this.distance = 0;
        this.movX = 0;
        this.movY = 0;
        this.grow = 0;
        this.pressed = false;
        this.body = [];
        this.points = 0;

        var randX = Math.floor(Math.random() * 3);
        var randY = Math.floor(Math.random() * 3);
        var oRandX = randX;
        var oRandY = randY;
        var board = this.Board.board;
        
        var x = Math.floor(board.length / 4) * (randX + 1);
        var y = Math.floor(board.length / 4) * (randY + 1);

        while (board[x][y].type || (randX == 1 && randY == 1)) {
            randX++;
            if (randX == 3) {
                randX = 0;
                randY = (randY + 1) % 3;
            }
            x = Math.floor(board.length / 4) * (randX + 1);
            y = Math.floor(board.length / 4) * (randY + 1);
            
            if (oRandX == randX && oRandY == randY) {
                // full
                return null;
            }
        }

        board[x][y].type = 1;
        board[x][y].color = this.color;
        this.body.push(board[x][y]);

        var mov = ([[-1, 0], [1, 0], [0, -1], [0, 1]])[Math.floor(Math.random() * 4)];

        this.movX = mov[0];
        this.movY = mov[1];
        
        for (var i = 2; i < 4; i++) {
            x += this.movX;
            y += this.movY;

            board[x][y].type = 2;
            board[x][y].color = color;
            this.body.push(board[x][y]);
        }
        
        this.movX *= -1;
        this.movY *= -1;
    };
    
    var snake = Snake.prototype;
    
    snake.actions = function(actions) {
        if (!this.pressed) {
            this.pressed = true;
            if (actions.x) {
                if (actions.x < 0) {
                    if (this.movY) {
                        this.movX = this.movY;
                        this.movY = 0;
                    }
                    else {
                        this.movY = -this.movX;
                        this.movX = 0;
                    }                    
                }
                else {
                    if (this.movY) {
                        this.movX = -this.movY;
                        this.movY = 0;
                    }
                    else {
                        this.movY = this.movX;
                        this.movX = 0;
                    }                    
                }
            }
        }
    };
    
    snake.move = function() {
        
        this.distance = this.distance + this.speed;
        if (this.distance - this.step >= 0) {
            this.distance -= this.step;
            this.pressed = false;

            if (!this.dead) {

                var x = this.body[0].x + this.movX;
                var y = this.body[0].y + this.movY;
                var board = this.Board.board;
                if (x < 0 || x >= board.length || y < 0 || y >= board.length || (board[x][y].type && board[x][y].type != 3)) {
                    // hit something
                    /*this.dead = true;
                    this.speed = this.speed / 2;
                    this.grow = 10;
                    for (var i = 0; i < this.body.length; i++) {
                        this.body[i].type = 4;
                    }
                    if (typeof this.deadCallback === 'function') {
                        this.deadCallback(this);
                    }*/
                }
                else {
                    if (board[x][y].type == 3) {
                        // eat apple
                        this.grow++;
                        this.points++;
                        if (typeof this.eatCallback === 'function') {
                            this.eatCallback();
                        }
                        this.Board.addFruit();
                    }

                    // move it
                    this.body[0].type = 2;

                    board[x][y].type = 1;
                    board[x][y].color = this.color;
                    this.body.unshift(board[x][y]);
                    if (this.grow) {
                        this.grow--;
                    }
                    else {
                        var tail = this.body.pop();
                        tail.type = 0;
                    }
                }
            }

        }
    };
    
    snake.toString = function () {
        return '[Snakes.Snake]';
    };

    snakes.Snake = Snake;
    return snakes;

}(Snakes || {}));    

/* Graphics */
Snakes = (function (snakes) {
    'use strict';

    var Graphics = function (squareSize, Board) {
        this.squareSize = squareSize || 20;
        this.canvasBackground = document.getElementById('canvas-board');
        this.canvasBackground.width = window.innerWidth;
        this.canvasBackground.height = window.innerHeight;
        this.canvasElements = document.getElementById('canvas-game');
        this.canvasElements.width = window.innerWidth;
        this.canvasElements.height = window.innerHeight;
        this.point = new window.obelisk.Point(window.innerWidth/2, 50);
        this.pixelView = new window.obelisk.PixelView(this.canvasElements,  this.point);
        this.dimension = new window.obelisk.CubeDimension(this.squareSize, this.squareSize, this.squareSize);    
        
        this.cubes = {};
        this.apple = new window.obelisk.Pyramid(this.dimension, new window.obelisk.PyramidColor().getByRightColor(window.obelisk.ColorPattern.WINE_RED));
        this.dead = new window.obelisk.Cube(this.dimension, new window.obelisk.CubeColor().getByHorizontalColor(window.obelisk.ColorPattern.BLACK));

        this.Board = Board;

        var board = this.Board.board;
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board.length; j++) {
                board[i][j].p3d = new window.obelisk.Point3D(i * this.squareSize, j * this.squareSize, 0);
            }
        }
    };
    
    var graphics = Graphics.prototype;
    
    graphics.addColor = function (color) {
        var cHead = new window.obelisk.CubeColor().getByHorizontalColor(window.obelisk.ColorGeom.applyBrightness(color, -75)); 
        this.cubes[color - 75] = new window.obelisk.Cube(this.dimension, cHead);
        var cBody  = new window.obelisk.CubeColor().getByHorizontalColor(color);
        this.cubes[color] = new window.obelisk.Cube(this.dimension, cBody);
   };

    graphics.drawBoard = function () {
        var board = this.Board.board;
        var pixelView = new window.obelisk.PixelView(this.canvasBackground,  this.point);
        var colorBG = new window.obelisk.SideColor().getByInnerColor(window.obelisk.ColorPattern.GRAY);
        pixelView.clear();

        for (var i = 0; i < board.length; i++) {
            var sideY1 = new window.obelisk.SideY(this.dimension, colorBG);
            var p3dY1 = new window.obelisk.Point3D(0 * this.squareSize, i * this.squareSize, 0);
            pixelView.renderObject(sideY1, p3dY1);
    
            var sideX1 = new window.obelisk.SideX(this.dimension, colorBG);
            var p3dX1 = new window.obelisk.Point3D(this.squareSize * i, 0 * this.squareSize, 0);
            pixelView.renderObject(sideX1, p3dX1);
    
            for (var j = 0; j < board.length; j++) {
                var p3d = new window.obelisk.Point3D(i * this.squareSize, j * this.squareSize, 0);
                var brick = new window.obelisk.Brick(this.dimension, colorBG);
                pixelView.renderObject(brick, p3d);
            }

            var sideX0 = new window.obelisk.SideX(this.dimension, colorBG);
            var p3dX0 = new window.obelisk.Point3D(this.squareSize * i, board.length * this.squareSize, -this.squareSize);
            pixelView.renderObject(sideX0, p3dX0);
    
            var sideY0 = new window.obelisk.SideY(this.dimension, colorBG);
            var p3dY0 = new window.obelisk.Point3D(board.length * this.squareSize, i * this.squareSize, -this.squareSize);
            pixelView.renderObject(sideY0, p3dY0);
        }
    
    };
    
    graphics.drawElements = function () {
        var board = this.Board.board;
        this.pixelView.clear();
        
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board.length; j++) {
                switch (board[i][j].type) {
                    case 1:
                        // draw head snake
                        this.pixelView.renderObject(this.cubes[board[i][j].color - 75], board[i][j].p3d);
                        break;
                    case 2:
                        // draw body snake
                        this.pixelView.renderObject(this.cubes[board[i][j].color], board[i][j].p3d);
                        break;
                    case 3:
                        // draw apple
                        this.pixelView.renderObject(this.apple, board[i][j].p3d);
                        break;
                    case 4:
                        // dead snake
                        this.pixelView.renderObject(this.dead, board[i][j].p3d);
                        break;
                    default:
                         break;
                }
            }
        }   
    };
    
    graphics.toString = function () {
        return '[Snakes.Graphics]';
    };

    snakes.Graphics = Graphics;
    return snakes;

}(Snakes || {}));    

/* Game */
Snakes = (function (snakes) {
    'use strict';

    var Game = function () {
        this.fps = 60;
        this.boardSize = 30;
        this.squareSize = 20;

        this.Board = new Snakes.Board(this.boardSize);
        this.Graphics = new Snakes.Graphics(this.squareSize, this.Board);

        this.Graphics.drawBoard();
    };

    var game = Game.prototype;

    game.addSnake = function(id, color) {
        var snake = this.Board.addSnake(id, color);
        this.Graphics.addColor(color);
        this.Graphics.drawElements();
        return snake;
    };

    game.moveSnakes = function() {
        this.Board.moveSnakes();
    };
    
    game.addFruit = function() {
        this.Board.addFruit();
    };

    game.toString = function () {
        return '[Snakes.Game]';
    };

    snakes.Game = Game;
    return snakes;

}(Snakes || {}));    
