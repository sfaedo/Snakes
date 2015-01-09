// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
var Snakes = (function(snakes) {
    'use strict';

    snakes.version = '0.0.1';
    snakes.author = 'Sebastian Faedo';
    return snakes;    
}(Snakes || {}));


/* BEGIN Cell */
var Cell = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.type = 0;
    this.color = '';
    this.nextX = this.x;
    this.nextY = this.y;
};

Cell.prototype.toString = function() {
    return '[Snakes.Cell]';
};
/* END Cell */

/* BEGIN Board */
var Board = function(size) {
    this.size = size || 30;
    this.board = [];
};

/* Board */
var Snakes = (function (snakes) {
    'use strict';

    var Board = function (boardSize) {
        this.initialize(boardSize);
    };
    var t = Board.prototype;
    t.initialize = function(boardSize) {
        this.boardSize = boardSize || this.boardSize;
        this.createBoard();
        //this.fruit();
        return this;
    };
    t.boardSize = 30;
    t.board = [];
    
    t.createBoard = function () {
        this.board = new Array(this.boardSize);
        for (var i = 0; i < this.boardSize; i++) {
            this.board[i] = new Array(this.boardSize);
            for (var j = 0; j < this.boardSize; j++) {
                this.board[i][j] = new Snakes.Cell(i, j);
            }
        }
    };

    t.snakes = [];
    t.addSnake = function(id, color) {
        var snake = new Snakes.Snake(id, color, this);
        if (snake) {
            this.snakes.push(snake);
        }
        return snake;
    };
    
    t.removeSnake = function(id) {
        // TODO
    };
    
    t.fruit = function() {
        var posX = Math.floor(Math.random() * this.boardSize);
        var posY = Math.floor(Math.random() * this.boardSize);
        var oPosX = posX;
        var oPosY = posY;
    
        while (this.board[posX][posY].type) {
            posX++;
            if (posX == this.boardSize) {
                posX = 0;
                posY = (posY + 1) % this.boardSize;
            }
    
            if (oPosX == posX && oPosY == posY) {
                //clearInterval(gameLoop);
                //playing = false;
            }
        }
    
        this.board[posX][posY].type = 3;        
    };
    
    t.moveSnakes = function() {
        for (var i = 0; i < this.snakes.length; i++) {
            this.snakes[i].move(this.board);
        }
    };
    
    t.toString = function () {
        return '[Snakes.Board]';
    };

    snakes.Board = Board;
    return snakes;

}(Snakes || {}));

/* Snake */
var Snakes = (function (snakes) {
    'use strict';

    var Snake = function (id, color, board) {
        this.initialize(id, color, board);
    };
    var t = Snake.prototype;
    t.initialize = function(id, color, boardObj) {
        this.id = id;
        this.color = color;
        this.body = new Array(3);
        this.board = boardObj;
        var board = boardObj.board;
        var randX = Math.floor(Math.random() * 3);
        var randY = Math.floor(Math.random() * 3);
        var oRandX = randX;
        var oRandY = randY;
        this.x = Math.floor(board.length / 4) * (randX + 1);
        this.y = Math.floor(board.length / 4) * (randY + 1);
        while (board[this.x][this.y].type || (randX == 1 && randY == 1)) {
            randX++;
            if (randX == 3) {
                randX = 0;
                randY = (randY + 1) % 3;
            }
            this.x = Math.floor(board.length / 4) * (randX + 1);
            this.y = Math.floor(board.length / 4) * (randY + 1);
            
            if (oRandX == randX && oRandY == randY) {
                // full
                return null;
            }
        }
        board[this.x][this.y].type = 1;
        board[this.x][this.y].color = this.color;
        this.body[0] = board[this.x][this.y];
        
        var mov = ([[-1, 0], [1, 0], [0, -1], [0, 1]])[Math.floor(Math.random() * 4)];
        var movX = mov[0];
        var movY = mov[1];

        this.movX = movX;
        this.movY = movY;
        for (var i = 2; i < 4; i++) {
            board[this.x + movX][this.y + movY].type = 2;
            board[this.x + movX][this.y + movY].color = color;
            this.body[i - 1] = board[this.x + movX][this.y + movY];
            movX = this.movX * i;
            movY = this.movY * i;
        }
        
        this.movX *= -1;
        this.movY *= -1;
        return this;
    };
    
    t.x = 0;
    t.y = 0;
    t.id = 0;
    t.speed = 150;
    t.step = 1000;
    t.distance = 0;
    t.movX = 0;
    t.movY = 0;
    t.grow = 0;
    t.body = [];
    
    t.pressed = false;
    t.actions = function(actions) {
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
    
    t.move = function(board) {
        this.distance = this.distance + this.speed;
        if (this.distance - this.step >= 0) {
            this.distance -= this.step;
            this.pressed = false;
            
            var head = [this.body[0].x + this.movX, this.body[0].y + this.movY];
            if (head[0] < 0 || head[0] >= board.length || head[1] < 0 || head[1] >= board.length || (board[head[0]][head[1]].type && board[head[0]][head[1]].type != 3)) {
                // hit something
            }
            else {
                if (board[head[0]][head[1]].type == 3) {
                    // eat apple
                    this.grow++;
                    this.board.fruit();
                }
                // move it
                board[head[0]][head[1]].type = 1;
                board[head[0]][head[1]].color = this.color;
                
                var last = [this.body[this.body.length - 1].x, this.body[this.body.length - 1].y];
                for (var i = this.body.length - 1; i > 0; i--) {
                    this.body[i] = board[this.body[i - 1].x][this.body[i - 1].y];
                    this.body[i].type = 2;
                }
                
                this.body[0] = board[head[0]][head[1]];

                if (this.grow) {
                    this.grow--;
                    this.body.push(board[last[0]][last[1]]);
                }
                else {
                    board[last[0]][last[1]].type = 0;
                }
            }
        }
    };
    
    t.toString = function () {
        return '[Snakes.Snake]';
    };

    snakes.Snake = Snake;
    return snakes;

}(Snakes || {}));    

/* Interface */
var Snakes = (function (snakes) {
    'use strict';

    var Interface = function () {
        this.initialize();
    };
    var t = Interface.prototype;
    t.initialize = function() {
        return this;
    };

    t.squareSize = 20;
    t.canvasBackground = document.getElementById('canvas-board');
    t.canvasBackground.width = window.innerWidth;
    t.canvasBackground.height = window.innerHeight;
    t.canvasElements = document.getElementById('canvas-game');
    t.canvasElements.width = window.innerWidth;
    t.canvasElements.height = window.innerHeight;
    t.point = new window.obelisk.Point(window.innerWidth/2, 50);

    t.drawBoard = function (board) {
        var pixelView = new window.obelisk.PixelView(this.canvasBackground,  this.point);
        var dimension = new window.obelisk.CubeDimension(this.squareSize, this.squareSize, this.squareSize);    
        var colorBG = new window.obelisk.SideColor().getByInnerColor(window.obelisk.ColorPattern.GRAY);
        pixelView.clear();

        for (var i = 0; i < board.length; i++) {
            var sideY1 = new window.obelisk.SideY(dimension, colorBG);
            var p3dY1 = new window.obelisk.Point3D(0 * this.squareSize, i * this.squareSize, 0);
            pixelView.renderObject(sideY1, p3dY1);
    
            var sideX1 = new window.obelisk.SideX(dimension, colorBG);
            var p3dX1 = new window.obelisk.Point3D(this.squareSize * i, 0 * this.squareSize, 0);
            pixelView.renderObject(sideX1, p3dX1);
    
            for (var j = 0; j < board.length; j++) {
                var p3d = new window.obelisk.Point3D(i * this.squareSize, j * this.squareSize, 0);
                var brick = new window.obelisk.Brick(dimension, colorBG);
                pixelView.renderObject(brick, p3d);
            }

            var sideX0 = new window.obelisk.SideX(dimension, colorBG);
            var p3dX0 = new window.obelisk.Point3D(this.squareSize * i, board.length * this.squareSize, -this.squareSize);
            pixelView.renderObject(sideX0, p3dX0);
    
            var sideY0 = new window.obelisk.SideY(dimension, colorBG);
            var p3dY0 = new window.obelisk.Point3D(board.length * this.squareSize, i * this.squareSize, -this.squareSize);
            pixelView.renderObject(sideY0, p3dY0);
        }
    
    };
    
    t.drawElements = function (board) {
        var pixelView = new window.obelisk.PixelView(this.canvasElements,  this.point);
        var dimension = new window.obelisk.CubeDimension(this.squareSize, this.squareSize, this.squareSize);    
        // var colorBG = new window.obelisk.SideColor().getByInnerColor(window.obelisk.ColorPattern.GRAY);
        pixelView.clear();
        
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board.length; j++) {
                var p3d = new window.obelisk.Point3D(i * this.squareSize, j * this.squareSize, 0);
                var color;
                var cube;
                var pyramid;
                switch (board[i][j].type) {
                    case 1:
                        // draw head snake
                        color = new window.obelisk.CubeColor().getByHorizontalColor(window.obelisk.ColorGeom.applyBrightness(board[i][j].color, -75));
                        cube = new window.obelisk.Cube(dimension, color);
                        pixelView.renderObject(cube, p3d);
                        break;
                    case 2:
                        // draw body snake
                        color = new window.obelisk.CubeColor().getByHorizontalColor(board[i][j].color);
                        cube = new window.obelisk.Cube(dimension, color);
                        pixelView.renderObject(cube, p3d);
                        break;
                    case 3:
                        // draw apple
                        color = new window.obelisk.PyramidColor().getByRightColor(window.obelisk.ColorPattern.WINE_RED);
                        pyramid = new window.obelisk.Pyramid(dimension, color);
                        pixelView.renderObject(pyramid, p3d);
                        break;
                    default:
                        break;
                }
            }
        }        
    };
    
    t.toString = function () {
        return '[Snakes.Interface]';
    };

    snakes.Interface = Interface;
    return snakes;

}(Snakes || {}));    

/* Game */
var Snakes = (function (snakes) {
    'use strict';

    var Game = function () {
        this.initialize();
    };
    var t = Game.prototype;
    
    t.initialize = function() {
        this.board = new Snakes.Board(this.boardSize);
        this.interface = new Snakes.Interface(this.squareSize);
        
        this.interface.drawBoard(this.board.board);

        //this.addSnake('toto');
        //this.addSnake('tito');
        //this.addSnake('toto');
        //this.addSnake('toto');
        //this.addSnake('tito');
        //this.addSnake('toto');
        //this.addSnake('tito');

        this.interface.drawElements(this.board.board);
        return this;
    };
    
    t.fps = 60;
    
    t.addSnake = function(id, color) {
        var snake = this.board.addSnake(id, color);
        this.interface.drawElements(this.board.board);
        return snake;
    };

    t.moveSnakes = function() {
        this.board.moveSnakes();
        this.interface.drawElements(this.board.board);
    };

    t.boardSize = 30;
    t.squareSize = 20;
    
    t.toString = function () {
        return '[Snakes.Game]';
    };

    snakes.Game = Game;
    return snakes;

}(Snakes || {}));    
