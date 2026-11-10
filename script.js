const boardEl = document.getElementById("gameBoard");
const winModal = document.getElementById("winModal");
const allClearModal = document.getElementById("allClearModal");
const winMsgEl = document.getElementById("winMsg");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const restartAllBtn = document.getElementById("restartAllBtn");
const btnUndo = document.getElementById("btnUndo");
const btnReset = document.getElementById("btnReset");

const levels = [
  [3, 3, { r: 0, c: 0 }, { r: 2, c: 2 }, []],
  [3, 3, { r: 2, c: 2 }, { r: 0, c: 0 }, [[1, 1]]],
  [4, 3, { r: 0, c: 1 }, { r: 3, c: 0 }, [[2, 1]]],
  [4, 4, { r: 1, c: 1 }, { r: 1, c: 3 }, [[1, 2], [2, 1]]],
  [4, 4, { r: 0, c: 0 }, { r: 3, c: 3 }, [[1, 1], [1, 2], [2, 2]]],
  [5, 4, { r: 4, c: 2 }, { r: 0, c: 1 }, [[1, 1], [2, 2], [3, 1]]],
  [5, 5, { r: 2, c: 2 }, { r: 0, c: 4 }, [[0, 2], [1, 2], [2, 0], [3, 3]]],
  [5, 5, { r: 0, c: 4 }, { r: 4, c: 0 }, [[1, 3], [2, 1], [2, 2], [3, 1]]],
  [4, 5, { r: 1, c: 0 }, { r: 1, c: 4 }, [[1, 1], [1, 2], [1, 3], [2, 2]]],
  [6, 6, { r: 0, c: 0 }, { r: 5, c: 5 }, [[1, 2], [2, 4], [3, 1], [3, 3], [4, 2], [4, 4]]]
];

let currentLevel = 0;
let path = [];
let grid = [];
let rows, cols, startPos, endPos, walls;

function renderLevel() {
  if (currentLevel >= levels.length) {
    allClearModal.style.display = "flex";
    return;
  }
  const L = levels[currentLevel];
  rows = L[0];
  cols = L[1];
  startPos = L[2];
  endPos = L[3];
  walls = L[4];

  path = [{ r: startPos.r, c: startPos.c }];
  winModal.style.display = "none";
  allClearModal.style.display = "none";

  boardEl.style.gridTemplateColumns = `repeat(${cols}, 60px)`;
  boardEl.innerHTML = "";
  grid = [];

  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.r = r;
      cell.dataset.c = c;

      const isWall = walls.some(w => w[0] === r && w[1] === c);
      const isStart = r === startPos.r && c === startPos.c;
      const isEnd = r === endPos.r && c === endPos.c;

      if (isWall) { cell.classList.add("wall"); cell.innerText = "⚠"; }
      if (isStart) { cell.classList.add("start"); cell.innerText = "S"; }
      if (isEnd) { cell.classList.add("end"); cell.innerText = "E"; }

      cell.onclick = () => cellClick(r, c);
      boardEl.appendChild(cell);
      grid[r][c] = cell;
    }
  }
  drawPath();
}

function drawPath() {
  document.querySelectorAll(".cell.path, .cell.path-head")
    .forEach(el => el.classList.remove("path", "path-head"));
  for (let i = 1; i < path.length; i++) {
    const p = path[i];
    grid[p.r][p.c].classList.add("path");
  }
  const head = path[path.length - 1];
  grid[head.r][head.c].classList.add("path-head");
}

function cellClick(r, c) {
  const head = path[path.length - 1];
  const dr = Math.abs(r - head.r);
  const dc = Math.abs(c - head.c);
  if (dr + dc !== 1) return shakeCell(r, c);
  if (walls.some(w => w[0] === r && w[1] === c)) return shakeCell(r, c);
  if (path.some(p => p.r === r && p.c === c)) return shakeCell(r, c);

  path.push({ r, c });
  drawPath();

  if (r === endPos.r && c === endPos.c) {
    setTimeout(levelWin, 300);
  }
}

function shakeCell(r, c) {
  const cell = grid[r][c];
  cell.classList.add("shake");
  setTimeout(() => cell.classList.remove("shake"), 400);
}

function levelWin() {
  winMsgEl.innerText = `You solved level ${currentLevel + 1}!`;
  winModal.style.display = "flex";
}

btnUndo.onclick = () => { if (path.length > 1) path.pop(), drawPath(); };
btnReset.onclick = renderLevel;
nextLevelBtn.onclick = () => { currentLevel++; renderLevel(); };
restartAllBtn.onclick = () => { currentLevel = 0; renderLevel(); };

renderLevel();
