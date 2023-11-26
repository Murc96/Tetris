class TetrisBoard {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.board = [];
        this.createGameboard();
    }

    createGameboard() {

        for (let x = 0; x < this.rows; x++) {
            let innerArray = [];
            for (let y = 0; y < this.cols; y++) {
                const tile = {
                    x,
                    y,
                    marked: false,
                }
                innerArray.push(tile);
            }
            this.board.push(innerArray);
        }
    }

    isValidMove(tetromino, rowOffset, colOffset) {
        // Überprüfen, ob der Tetromino an der neuen Position gültig ist
        for (let row = 0; row < tetromino.shape.length; row++) {
            for (let col = 0; col < tetromino.shape[row].length; col++) {
                const currentRow = row + rowOffset;
                const currentCol = col + colOffset;

                if (
                    tetromino.shape[row][col].marked &&
                    (this.board[currentRow] && this.board[currentRow][currentCol]) &&
                    this.board[currentRow][currentCol].marked
                ) {
                    // Kollision mit anderen Blöcken
                    return false;
                }
            }
        }
        return true;
    }

    placeTetromino(tetromino, row, col) {
        if (this.isValidMove(tetromino, row, col)) {
            for (let tetrominoRow = 0; tetrominoRow < tetromino.shape.length; tetrominoRow++) {
                for (let tetrominoCol = 0; tetrominoCol < tetromino.shape[tetrominoRow].length; tetrominoCol++) {
                    const currentRow = row + tetrominoRow;
                    const currentCol = col + tetrominoCol;

                    if (tetromino.shape[tetrominoRow][tetrominoCol].marked) {
                        this.board[currentRow][currentCol].marked = true;
                    }
                }
            }
        }
    }

    clearLines() {
        // Überprüfe und lösche vollständige Linien auf dem Spielfeld
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.board[row].every((cell) => cell.marked)) {
                // Die Linie ist vollständig
                this.board.splice(row, 1);
                this.board.unshift(Array(this.cols).fill({ x: 0, y: 0, marked: false }));
            }
        }
    }
}


class Tetromino {
    constructor(shape, color) {
      this.shape = shape.map(row => row.map(cell => ({ marked: cell.marked })));
      this.color = color;
      this.rotation = 0;
      this.currentShape = this.shape[this.rotation];
      this.row = 0;
      this.col = 0;
    }
  
    rotate() {
    }
  
    moveDown() {
      if (this.isValidMove(this.row + 1, this.col)) {
        this.row++;
      } else {
        // Wenn der Tetromino nicht weiter nach unten bewegt werden kann,
        // platziere ihn auf dem Spielfeld und generiere einen neuen Tetromino
        gameboard.placeTetromino(this, this.row, this.col);
        this.reset();
      }
    }
  
    moveLeft() {
      if (this.isValidMove(this.row, this.col - 1)) {
        this.col--;
      }
    }
  
    moveRight() {
      if (this.isValidMove(this.row, this.col + 1)) {
        this.col++;
      }
    }
  
    isValidMove(row, col) {
      return gameboard.isValidMove(this, row, col);
    }
  
  
    reset() {
      this.row = 0;
      this.col = 0;
      this.rotation = 0;
      this.currentShape = this.shape[this.rotation];
    }
  }
  
  tetrominoShapes = {
    I: [
      [{ marked: true }, { marked: true }, { marked: true }, { marked: true }],
    ],
    J: [
      [{ marked: true }, { marked: false }, { marked: false }],
      [{ marked: true }, { marked: true }, { marked: true }],
    ],
    L: [
      [{ marked: false }, { marked: false }, { marked: true }],
      [{ marked: true }, { marked: true }, { marked: true }],
    ],
    O: [
      [{ marked: true }, { marked: true }],
      [{ marked: true }, { marked: true }],
    ],
    S: [
      [{ marked: false }, { marked: true }, { marked: true }],
      [{ marked: true }, { marked: true }, { marked: false }],
    ],
    T: [
      [{ marked: false }, { marked: true }, { marked: false }],
      [{ marked: true }, { marked: true }, { marked: true }],
    ],
    Z: [
      [{ marked: true }, { marked: true }, { marked: false }],
      [{ marked: false }, { marked: true }, { marked: true }],
    ],
};


  
const tetrominoI = new Tetromino(tetrominoShapes.I, /* color */);
const tetrominoJ = new Tetromino(tetrominoShapes.J, /* color */);


let gameboard = new TetrisBoard(10, 20);
console.log(gameboard)





console.log(gameboard)

document.addEventListener('keydown', (event) => handleKeyPress(event, tetrominoJ));

function handleKeyPress(event, tetromino) {
  switch (event.code) {
    case 'ArrowUp':
      tetromino.rotate();
      break;
    case 'ArrowDown':
      tetromino.moveDown();
      gameboard.placeTetromino(tetromino, tetromino.row, tetromino.col);
      console.log(gameboard);
      break;
    case 'ArrowLeft':
      tetromino.moveLeft();
      gameboard.placeTetromino(tetromino, tetromino.row, tetromino.col);
      console.log(gameboard);
      break;
    case 'ArrowRight':
      tetromino.moveRight();
      gameboard.placeTetromino(tetromino, tetromino.row, tetromino.col);
      console.log(gameboard);
      break;
    default:
      break;
  }
}