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

    this.alive = Math.random() > 0.92;
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
  static numRows = Math.ceil(window.innerHeight / 10);
  static numColumns = Math.ceil(window.innerWidth / 10);

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
        this.grid.push(new Cell(this.context, j, i));
  }

  createGlider(x, y) {
    this.grid[this.gridToIndex(x, y)].alive = true;
    this.grid[this.gridToIndex(x + 1, y + 1)].alive = true;
    this.grid[this.gridToIndex(x + 2, y + 1)].alive = true;
    this.grid[this.gridToIndex(x + 2, y)].alive = true;
    this.grid[this.gridToIndex(x + 2, y - 1)].alive = true;
  }

  gridToIndex(x, y) {
    return x + y * World.numColumns;
  }

  isAlive(x, y) {
    if (x < 0 || x >= World.numColumns || y < 0 || y >= World.numRows)
      return false;

    return this.grid[this.gridToIndex(x, y)].alive ? 1 : 0;
  }

  checkSurrounding() {
    for (let i = 0; i < World.numColumns; i++) {
      for (let j = 0; j < World.numRows; j++) {
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

  canvas.addEventListener("click", (event) => {
    const x = Math.round(event.pageX / Cell.width);
    const y = Math.round(event.pageY / Cell.width);

    gameWorld.createGlider(x, y);
  });
};
