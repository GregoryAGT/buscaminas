import { Component, OnInit } from '@angular/core';
import { Cell } from "./interfaces/cell.interface";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {

  constructor() {}

  lost = false;
  rows: number= 0;
  cols: number= 0;
  bombs: number= 0;
  bombsLeft: number= 0;
  discovered = 0;

  cells: Cell[][] = [];
  searchPositions = [
    { row: -1, col: -1 },
    { row: -1, col: 0 },
    { row: -1, col: 1 },
    { row: 0, col: 1 },
    { row: 0, col: -1 },
    { row: 1, col: -1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 }
  ];

  ngOnInit() {
    this.setGame(10, 10, 10);
  }

  newGame() {
    this.cells = [];
    this.setGame(10, 10, 10);
    this.lost = false;
  }

  setGame(rows: number, cols: number, bombs: number) {
    this.rows = rows, this.cols = cols;

    for (let row = 0; row < rows; row++) {
      this.cells.push([]);
      for (let col = 0; col < cols; col++) {
        this.cells[row].push(new Cell(row, col));
      }
    }


    for (let i = 0; i < bombs; i++) {
      let row = this.randNumber(rows-1), col = this.randNumber(cols-1);
      let randCell = this.cells[row][col];
      while (randCell.hasMine) {
        row = this.randNumber(rows-1), col = this.randNumber(cols-1);
        randCell = this.cells[row][col];
      }
      randCell.setMine(true);
    }

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        this.cells[row][col].setCount(this.countMines(row, col));
      }
    }
    this.bombsLeft = bombs, this.bombs = bombs;
  }

  checkWin() {
    let allOpened = this.discovered === ((this.rows * this.cols) - this.bombs);
    let allFlags = this.bombsLeft === 0;
    return allOpened && allFlags;
  }

  countMines(row: number, col: number): number {
    return (this.hasMineCount(row - 1, col - 1)) +
    (this.hasMineCount(row - 1, col)) +
    (this.hasMineCount(row - 1, col + 1)) +
    (this.hasMineCount(row, col + 1)) +
    (this.hasMineCount(row, col - 1)) +
    (this.hasMineCount(row + 1, col - 1)) +
    (this.hasMineCount(row + 1, col)) +
    (this.hasMineCount(row + 1, col + 1));
  }

  hasMineCount(row: number, col: number): number {
    let validPos = (row >= 0 && col >= 0) && (row < this.rows && col < this.cols);
    return validPos ? this.cells[row][col].hasMine ? 1 : 0 : 0;
  }

  openMine(cell: Cell): boolean {
    if (this.lost || this.checkWin()) return false;
    if (cell.isOpened || cell.hasFlag) return true;
    cell.isOpened = true;
    this.discovered += 1;
    if (cell.hasMine) {
      this.lost = true;
      return false;
    } else if (cell.minecount === 0)  {
      let neighbours = this.getNotMineNeighbours(cell);
      for (let neighbour of neighbours) {
        this.openMine(neighbour);
      }
    }
    return true;
  }

  setFlag(cell: Cell) {
    if (this.lost || this.checkWin()) return false;
    if (cell.isOpened) return false;
    if (this.bombsLeft === 0 && !cell.hasFlag) return false;
    cell.hasFlag = !cell.hasFlag;
    this.bombsLeft += cell.hasFlag ? -1 : 1;
    return false;
  }

  getNotMineNeighbours(cell: Cell): Cell[] {
    let row = cell.row, col = cell.col;
    let arr: Cell[] = [];
    for (let pos of this.searchPositions) {
      let validPos = ((row + pos.row) >= 0 && (col + pos.col) >= 0) && ((row + pos.row) < this.rows && (col + pos.col) < this.cols);
      if (!validPos) continue;
      let neighbour = this.cells[row + pos.row][col + pos.col];
      if (!neighbour.hasMine) {
        arr = [ ...arr, neighbour ];
      }
    }
    return arr;
  }

  randNumber(max: number, min?: number) {
    return Math.floor(Math.random() * max) + (min || 0);
  }
}
