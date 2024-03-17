import "./styles.css";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSequence() {
  const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

  while (sequence.length) {
    const rand = getRandomInt(0, sequence.length - 1);
    const name = sequence.splice(rand, 1)[0];
    tetrominoSequence.push(name);
  }
}

//get the next tetromino in tetromino in sequence
function getNextTetromino() {
  if (tetrominoSequence.length === 0) {
    generateSequence();
  }

  const name = tetrominoSequence.pop();
  const matrix = tetrominos[name];

  //I and O start centered, all others start in the left-middle
  const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

  //I starts on row 21 (-1), all others row 22 (-2)
  const row = name === 'I' ? -1 : -2;

  return {
    name: name,
    matrix: matrix,
    row: row,
    col: col,
  };
}

//rotate an NxN matrix 90deg
function rotate(matrix) {
  const N = matrix.length - 1;
  const result = matrix.map((row, i) =>
    row.map((val, j) => matrix[N - j][i]));

  return result;
}

// check to see if the new matris/row/col is valid
function isValidMove(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] && (
        cellCol + col < 0 ||
        cellCol + col >= playfield[0].length ||
        cellRow + row >= playfield.length ||
        playfield[cellRow + row][cellCol + col])
      ) {
        return false;
      }
    }
  }

  return true;
}

//place the tetromino on the playfield
function placeTetromino() {
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {
        //game over if piece has any part offscreen
        if (tetromino.row + row < 0) {
          return showGameOver();
        }

        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
  }

  //check for line clears starting from the bottom and working way up
  for (let row = playfield.length - 1; row >= 0;) {
    if (playfield[row].every(cell => !!cell)) {
      //drop every row above
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < playfield[r].length; c++) {
          playfield[r][c] = playfield[r - 1][c];
        }
      }
    } else {
      row--;
    }
  }

  tetromino = getNextTetromino();
}


//show the game over screen
function showGameOver() {
  cancelAnimationFrame(rAF);
  gameOver = true;

  AudioContext.fillStyle = 'black';
  AudioContext.globalAlpha = 0.75;
  AudioContext.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

  AudioContext.globalAlpha = 1;
  AudioContext.fillStyle = 'white';
  AudioContext.font = '36px monospace';
  AudioContext.textAlign = 'center';
  AudioContext.textBaseline = 'middle';
  AudioContext.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2)
}

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 32;
const tetrominoSequence = [];

//keep track of what is in every cell of the game using a 2d array
//tetris playfield is 10x20
const playfield = [];

// populate the empty playfield
for (let row = -2; row < 20; row++) {
  playfield[row] = [];

  for (let col = 0; col < 10; col++) {
    playfield[row][col] = 0;
  }
}

const tetrominos = {
  'I': [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],

  'J': [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],

  'L': [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],

  'O': [
    [1, 1],
    [1, 1],
  ],

  'S': [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],

  'Z': [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],

  'T': [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ]
};

// color of tetrominos

const colors = {
  'I': 'cyan',
  'O': 'yellow',
  'T': 'purple',
  'S': 'green',
  'Z': 'red',
  'J': 'blue',
  'L': 'orange',
};

let count = 0;
let tetromino = getNextTetromino();
let rAF = null;
let gameOver = false;

// game loop
function loop() {
  rAF = requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  //draw the playfield
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      if (playfield[row][col]) {
        const name = playfield[row][col];
        context.fillStyle = colors[name];

        //drawing 1px smaller then grid creates grid effect
        context.fillRect(col * grid, row * grid, grid - 1, grid - 1);
      }
    }
  }

  //draw the active tetromino 
  if (tetromino) {
    if (++count > 35) {
      tetromino.row++;
      count = 0;

      //place piece if it runs into anything
      if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
        tetromino.row--;
        placeTetromino();
      }
    }

    context.fillStyle = colors[tetromino.name];

    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {

          //drawing 1px smaller
          context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid - 1, grid - 1);
        }
      }
    }
  }
}

document.addEventListener('keydown', function (e) {
  if (gameOver) return;

  if (e.code === 'ArrowLeft') {
    const col = tetromino.col - 1;

    if (isValidMove(tetromino.matrix, tetromino.row, col)) {
      tetromino.col = col;
    }
  }

  if (e.code === 'ArrowRight') {
    const col = tetromino.col + 1;


    if (isValidMove(tetromino.matrix, tetromino.row, col)) {
      tetromino.col = col;
    }
  }

  if (e.code === 'ArrowUp') {
    const matrix = rotate(tetromino.matrix);
    if(isValidMove(matrix, tetromino.row, tetromino.col)) {
      tetromino.matrix = matrix;
    }
  }

  if(e.code === 'ArrowDown') {
    const row = tetromino.row + 1;

    if(!isValidMove(tetromino.matrix, row, tetromino.col)) {
      tetromino.row = row -1;

      placeTetromino();
      return;
    }

    tetromino.row = row;
  }
})


//start

rAF = requestAnimationFrame(loop);