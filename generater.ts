import config from './config';
const { n, boxSize, symbols, EasyLevel, MediumLevel, HardLevel } = config;

const grn = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const validate = (board: string[][], row: number, col: number, value: string): boolean => {
    for (let i = 0; i < n; i++) {
        if (board[row][i] === value) return false;
        if (board[i][col] === value) return false;
    }
    const boxRow = Math.floor(row / boxSize) * boxSize;
    const boxCol = Math.floor(col / boxSize) * boxSize;
    for (let i = boxRow; i < boxRow + boxSize; i++) {
        for (let j = boxCol; j < boxCol + boxSize; j++) {
            if (board[i][j] === value) return false;
        }
    }
    return true;
};

const fillvalue = (board: string[][], x = 0, y = 0): string[][] | null => {
    if (y === n) return board;

    const nextX = (x + 1) % n;
    const nextY = nextX === 0 ? y + 1 : y;
    const shuffled = [...symbols].sort(() => Math.random() - 0.5);
    for (const value of shuffled) {
        if (validate(board, y, x, value)) {
            board[y][x] = value;
            if (fillvalue(board, nextX, nextY)) return board;
            board[y][x] = '0';
        }
    }

    return null;
};

const generateSudoku = (level: 'easy' | 'medium' | 'hard' = 'easy') => {
    const board: string[][] = Array.from({ length: n }, () => Array(n).fill('0'));
    fillvalue(board);

    const solvedBoard = board.map(row => [...row]);
    let removeCount =
        level === 'easy' ? EasyLevel :
            level === 'medium' ? MediumLevel : HardLevel;

    console.log(removeCount);
    while (removeCount > 0) {
        const row = grn(0, n - 1);
        const col = grn(0, n - 1);
        if (board[row][col] !== '0') {
            board[row][col] = '0';
            removeCount--;
        }
    }
    console.log(removeCount);
    return { board, solvedBoard };
};

export { generateSudoku, validate };
// console.log('[');
// for (let index = 0; index < 100; index++) {
//     console.log(`[${JSON.stringify(generateSudoku('hard').solvedBoard)}],`);
    
// }
// console.log(']');