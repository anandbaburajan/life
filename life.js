const canvas = document.querySelector("canvas");

const resize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

resize();

window.addEventListener("resize", resize);

class Cell {
  static width = 10;
  static height = 10;

  constructor(context, gridX, gridY) {
    this.context = context;

    this.gridX = gridX;
    this.gridY = gridY;

    this.alive = Math.random() > 0.9;
  }

  draw() {
    this.context.fillStyle = this.alive ? "#fff" : "#000";
    this.context.fillRect(
      this.gridX * Cell.width,
      this.gridY * Cell.height,
      Cell.width,
      Cell.height
    );
  }
}

class World {
  static numRows = window.innerHeight;
  static numColumns = window.innerHeight;

  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.grid = [];

    this.createGrid();

    window.requestAnimationFrame(() => this.gameLoop());
  }

  createGrid() {
    for (let i = 0; i < World.numRows; i++)
      for (let j = 0; j < World.numColumns; j++)
        this.grid.push(new Cell(this.context, i, j));
  }

  gridToIndex(i, j) {
    return i + j * World.numColumns;
  }

  isAlive(i, j) {
    if (i < 0 || i >= World.numRows || j < 0 || j >= World.numColumns)
      return false;

    return this.grid[this.gridToIndex(i, j)].alive ? 1 : 0;
  }

  checkSurrounding() {
    for (let i = 0; i < World.numRows; i++) {
      for (let j = 0; j < World.numColumns; j++) {
        const numAlive =
          this.isAlive(i - 1, j - 1) +
          this.isAlive(i, j - 1) +
          this.isAlive(i + 1, j - 1) +
          this.isAlive(i - 1, j) +
          this.isAlive(i + 1, j) +
          this.isAlive(i - 1, j + 1) +
          this.isAlive(i, j + 1) +
          this.isAlive(i + 1, j + 1);

        let currentCell = this.gridToIndex(i, j);

        if (numAlive == 2) {
          this.grid[currentCell].nextAlive = this.grid[currentCell].alive;
        } else if (numAlive == 3) {
          this.grid[currentCell].nextAlive = true;
        } else {
          this.grid[currentCell].nextAlive = false;
        }
      }
    }

    for (let i = 0; i < this.grid.length; i++)
      this.grid[i].alive = this.grid[i].nextAlive;
  }

  gameLoop() {
    this.checkSurrounding();

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.grid.length; i++) this.grid[i].draw();

    setTimeout(() => {
      window.requestAnimationFrame(() => this.gameLoop());
    }, 100);
  }
}

window.onload = () => {
  let gameWorld = new World("canvas");
};
