class Cell {
    x: number = 0;
    y: number = 0;
    value: string = '0';
    left: Cell | null = null;
    right: Cell | null = null;
    bottom: Cell | null = null;
    top: Cell | null = null;
    constructor(x: number, y: number) {
        console.log(`Creating cell at (${x},${y})`);
        this.x = x;
        this.y = y;
    }
}
let t = 0;
let passwd: string[] = [];
type direction = "top" | "left" | "right" | "bottom";
class Board {
    size: number = 0;
    boxWidth: number = 0;
    boxHeight: number = 0;
    head: Cell | null = null;

    constructor(size: number) {
        let s = Math.sqrt(size);
        if (s * s != size) {
            this.boxWidth = Math.floor(s) + 1;
            this.boxHeight = Math.floor(s);
        } else {
            this.boxWidth = s;
            this.boxHeight = s;
        }
        this.size = size;
        this.head = this.createBoard();
        try {
            this.linkBoard(this.head);
        } catch (error) {
            console.error(error);
        }
    }
    private createBoard(): (Cell | null) {
        let cell: Cell | null = null;
        for (let y = 0; y < this.size; y++) {
            let newCell = new Cell(y, y);
            if (cell) {
                if (newCell && cell?.left)
                    cell.left.bottom = newCell;
                if (newCell && cell?.bottom)
                    cell.bottom.left = newCell;
            } else {
                console.log("Setting head", newCell?.x, newCell?.y);
                this.head = newCell;
            }

            cell = newCell;

            console.log(`Creating row ${y}`);
            cell.left = this.createLeftCells(y + 1, y) || null;
            cell.bottom = this.createBottomCells(y, y + 1) || null;
        }
        return this.head;
    }
    private createLeftCells(x: number, y: number): Cell | null {
        if (x >= this.size || y >= this.size || y < 0 || x < 0)
            return null;
        // console.log("createLeftCells", x, y);

        let newCell: Cell = new Cell(x, y);
        // let TopCell = this.get(x, y - 1);
        // if (TopCell)
        //     TopCell.bottom = newCell;
        newCell.left = this.createLeftCells(x + 1, y);
        return newCell;
    }
    private createBottomCells(x: number, y: number): Cell | null {
        if (x >= this.size || y >= this.size || y < 0 || x < 0)
            return null;
        let newCell: Cell = new Cell(x, y);
        // let leftCell = this.get(x - 1, y);
        // if (leftCell)
        //     leftCell.right = newCell;
        newCell.bottom = this.createBottomCells(x, y + 1);
        return newCell;
    }
    private linkBoard(cell: Cell | null): void {
        if (cell == null) return;
        t++;
        // console.log(`Linking cell at (${cell.x},${cell.y})`);
        // if (passwd.includes(`${cell.x},${cell.y}`)) {throw Error(`cell already linked at (${cell.x},${cell.y})`);}
        // passwd.push(`${cell.x},${cell.y}`);
        // cell.right = this.get(cell.x - 1, cell.y);
        // cell.top = this.get(cell.x, cell.y - 1);
        // if (cell.right === null &&  cell.x > 0) {throw Error(`right cell not found at (${cell.x + 1},${cell.y})`);}
        // if (cell.top === null &&  cell.y > 0) {throw Error(`top cell not found at (${cell.x},${cell.y - 1})`);}
        this.linkBoard(cell.left);
        this.linkBoard(cell.bottom);
        // this.linkBoard(cell.right);
        // this.linkBoard(cell.top);
    }
    get(x: number, y: number): Cell | null {
        if (x == this.size || y == this.size || y < 0 || x < 0)
            return null;
        let cell: Cell | null = this.head;
        let a = 0;
        for ( a = 0; a < x && a < y && cell; a++) {
            cell = cell?.left?.bottom || null;
        }
        for (let i = a; i < y && cell; i++) {
            cell = cell?.bottom || null;
        }
        for (let i = a; i < x && cell; i++) {
            cell = cell?.left || null;
        }
        if (cell?.x != x || cell?.y != y) {
            throw Error("Board.get:cell not found" + JSON.stringify({ x: x, y: y } as { x: number, y: number }));
        }
        return cell;
    }
    private async searchDirection(cell: Cell | null, value: string, where: direction): Promise<boolean> {
        if (cell == null) return false;
        while (cell) {
            if (cell?.value == value) { return true; }
            cell = where == "top" ?
                cell?.top : where == "left" ?
                    cell?.left : where == "right" ?
                        cell?.right : cell?.bottom || null;
        }
        return false;
    }
    private async searchBox(cell: Cell | null, value: string): Promise<boolean> {
        if (cell == null) return false;
        let xd = Math.floor(cell.x / this.boxWidth) * this.boxWidth;
        let yd = Math.floor(cell.y / this.boxHeight) * this.boxHeight;

        cell = this.get(xd, yd);

        if (!cell) throw Error("something worrng" + JSON.stringify({ xd: xd, yd: yd } as { xd: number, yd: number }));

        let celly: Cell | null = cell;

        for (let y = 0; y < this.boxHeight && celly; y++) {
            let cellx: Cell | null = celly;
            for (let x = 0; x < this.boxWidth && cellx; x++) {
                if (cellx.value == value) return true;
                cellx = cellx?.left || null;
            }
            celly = celly?.bottom || null;
        }
        return false;
    }
    public search(cell: Cell | null, value: string): boolean {
        if (cell == null) throw Error("Board.search:cell = null");

        try {
            this.searchDirection(cell, value, "top").then(e => { if (e) throw Error("founded") });
            this.searchDirection(cell, value, "left").then(e => { if (e) throw Error("founded") });
            this.searchDirection(cell, value, "bottom").then(e => { if (e) throw Error("founded") });
            this.searchDirection(cell, value, "right").then(e => { if (e) throw Error("founded") });
            this.searchBox(cell, value).then(e => { if (e) throw Error("founded") });
        } catch (e) { return true; }
        return false;
    }
    public printBoard(): void {
        let cell: Cell | null = this.head;
        for (let y = 0; y < this.size; y++) {
            let cellx: Cell | null = cell;
            let line: string = "";
            for (let x = 0; x < this.size; x++) {
                if ((cellx?.bottom || cellx?.y == this.size - 1) && (cellx.top || cellx.y == 0) && (cellx.right || cellx.x == 0) && (cellx.left || cellx.x == this.size - 1)) {
                    cellx.value = "X";
                }
                line += cellx?.value ? cellx.value + " " : ". ";
                cellx = cellx?.left || null;
            }
            console.log(line);
            cell = cell?.bottom || null;
        }
    }
}
// get args from command line
const args = process.argv.slice(2);
const size = parseInt(args[0]) || 6;

let board = new Board(size);
board.printBoard();
// console.log(board.get(4, 10)?.x, board.get(4, 10)?.y);
// console.log("t=", t);

for (let index = 0; index < board.size; index++) {
    const element = array[index];
    
}