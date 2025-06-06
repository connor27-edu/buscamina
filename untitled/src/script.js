const correctUser = "admin";
const correctPass = "1234";

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const error = document.getElementById("loginError");

  if (user === correctUser && pass === correctPass) {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    initGame();
  } else {
    error.textContent = "Usuario o contraseña incorrectos.";
  }
}

const size = 8;
const mines = 10;
let board = [];
let revealed = 0;
let gameOver = false;

function initGame() {
  const boardElem = document.getElementById("board");
  boardElem.innerHTML = "";
  board = [];
  revealed = 0;
  gameOver = false;

  for (let i = 0; i < size; i++) {
    board[i] = [];
    for (let j = 0; j < size; j++) {
      board[i][j] = { mine: false, revealed: false, count: 0 };
    }
  }

  let placed = 0;
  while (placed < mines) {
    let x = Math.floor(Math.random() * size);
    let y = Math.floor(Math.random() * size);
    if (!board[x][y].mine) {
      board[x][y].mine = true;
      placed++;
    }
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!board[i][j].mine) {
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = i + dx;
            const ny = j + dy;
            if (nx >= 0 && nx < size && ny >= 0 && ny < size && board[nx][ny].mine) {
              count++;
            }
          }
        }
        board[i][j].count = count;
      }
    }
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = i;
      cell.dataset.y = j;
      cell.onclick = () => revealCell(i, j, cell);
      boardElem.appendChild(cell);
    }
  }
}

function revealCell(x, y, cellElem) {
  if (gameOver || board[x][y].revealed) return;

  board[x][y].revealed = true;
  cellElem.classList.add("revealed");

  if (board[x][y].mine) {
    cellElem.classList.add("mine");
    cellElem.textContent = "💣";
    document.getElementById("gameStatus").textContent = "¡Perdiste!";
    gameOver = true;
    revealAll();
    return;
  }

  revealed++;
  const count = board[x][y].count;
  if (count > 0) {
    cellElem.textContent = count;
  } else {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
          const neighborElem = document.querySelector(`.cell[data-x="${nx}"][data-y="${ny}"]`);
          revealCell(nx, ny, neighborElem);
        }
      }
    }
  }

  if (revealed === size * size - mines) {
    document.getElementById("gameStatus").textContent = "¡Ganaste!";
    gameOver = true;
  }
}

function revealAll() {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cellElem = document.querySelector(`.cell[data-x="${i}"][data-y="${j}"]`);
      if (board[i][j].mine) {
        cellElem.classList.add("revealed", "mine");
        cellElem.textContent = "💣";
      }
    }
  }
}
