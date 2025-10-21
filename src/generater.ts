
import { Config } from './Types';
const grn = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const validate = (board: string[][], settings: Config, row: number, col: number, value: string): boolean => {
    for (let i = 0; i < settings.n; i++) {
        if (board[row][i] === value) return false;
        if (board[i][col] === value) return false;
    }
    const boxRow = Math.floor(row / settings.boxSize) * settings.boxSize;
    const boxCol = Math.floor(col / settings.boxSize) * settings.boxSize;
    for (let i = boxRow; i < boxRow + settings.boxSize; i++) {
        for (let j = boxCol; j < boxCol + settings.boxSize; j++) {
            if (board[i][j] === value) return false;
        }
    }
    return true;
};

const fillvalue = (board: string[][], settings: Config, x = 0, y = 0): string[][] | null => {
    if (y === settings.n) return board;

    const nextX = (x + 1) % settings.n;
    const nextY = nextX === 0 ? y + 1 : y;
    const shuffled = [...settings.symbols].sort(() => Math.random() - 0.5);
    for (const value of shuffled) {
        if (validate(board, settings, y, x, value)) {
            board[y][x] = value;
            if (fillvalue(board, settings, nextX, nextY)) return board;
            board[y][x] = '0';
        }
    }

    return null;
};

const generateSudoku = (settings: Config) => {
    const board: string[][] = Array.from({ length: settings.n }, () => Array(settings.n).fill('0'));
    fillvalue(board,settings);

    const solvedBoard = board.map(row => [...row]);
    let removeCount = settings.n * settings.n * (
        settings.level === 'Easy' ? 0.3 :
            settings.level === 'Medium' ? 0.45 : 0.55);

    while (removeCount > 0) {
        const row = grn(0, settings.n - 1);
        const col = grn(0, settings.n - 1);
        if (board[row][col] !== '0') {
            board[row][col] = '0';
            removeCount--;
        }
    }
    return { board, solvedBoard };
};

export { generateSudoku, validate };
// console.log('[');
// for (let index = 0; index < 100; index++) {
//     console.log(`[${JSON.stringify(generateSudoku('hard').solvedBoard)}],`);
    
// }
// console.log(']');