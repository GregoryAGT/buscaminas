export class Cell {
  col: number;
  row: number;
  isOpened = false;
  hasFlag = false;
  hasMine = false;
  minecount: number;

  constructor(row: number, col: number) {
    this.col = col;
    this.row = row;
    this.minecount = 0;
  }

  setMine(mine: boolean) {
    this.hasMine = mine || false;
  }

  setCount(count: number) {
    this.minecount = count || 0;
  }

  print() {
    if (this.hasFlag) {
      return '';
    } else if (this.isOpened) {
      if (this.hasMine) return '';
      return this.minecount > 0 ? this.minecount : '';
    }
    return '';
  }
}
