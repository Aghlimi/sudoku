const n = 9;
const arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const empty = 0;
const EasyLevel = 36;
const MediumLevel = 46;
const HardLevel = 56;
const index = 0;

const grn = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const validate = (board: string[][], row: number, col: number, value: string): boolean => {
    for (let i = 0; i < n; i++) {
        if (board[row][i] === value) return false;
    }
    for (let i = 0; i < n; i++) {
        if (board[i][col] === value) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
        for (let j = boxCol; j < boxCol + 3; j++) {
            if (board[i][j] === value) return false;
        }
    }
    return true;
}

const fillvalue = (board: string[][], x: number = 0, y: number = 0) => {
    if (y == n) {
        return board;
    }
    let offset = grn(0, n - 1);
    let i = 0;
    for (i = 0; i < n; i++) {
        const value = arr[(i + offset) % n];
        if (validate(board, y, x, value)) {
            board[y][x] = value;
            if (fillvalue(board, x == n - 1 ? 0 : x + 1, x == n - 1 ? y + 1 : y)) {
                return board;
            }
            board[y][x] = '0';
        }
        offset++;
    }
    return null;
}

const generateSudoku: () => string[][] = () => {
    const board: string[][] = Array.from({ length: n }, () => Array(n).fill('0'));
    fillvalue(board);
    const solvedBoard = board.map(row => row.slice());
    for (let i = 0; i < EasyLevel;) {
        const row = grn(0, n - 1);
        const col = grn(0, n - 1) % n;
        try {
            if (board[row][col] !== '0') {
                board[row][col] = '0';
                i++;
            }
        } catch (error) {
            console.log(row + " " + col);
        }
    }
    return { board, solvedBoard };
};
export { generateSudoku };