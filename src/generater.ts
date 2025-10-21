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

const fillBoard = (board: string[][], settings: Config, row = 0, col = 0): boolean => {
    if (row === settings.n) return true;

    const nextRow = col === settings.n - 1 ? row + 1 : row;
    const nextCol = (col + 1) % settings.n;

    const shuffled = [...settings.symbols].sort(() => Math.random() - 0.5);
    for (const value of shuffled) {
        if (validate(board, settings, row, col, value)) {
            board[row][col] = value;
            if (fillBoard(board, settings, nextRow, nextCol)) return true;
            board[row][col] = '0';
        }
    }
    return false;
};

const countSolutions = (board: string[][], settings: Config, row = 0, col = 0, limit = 2): number => {
    if (row === settings.n) return 1;

    const nextRow = col === settings.n - 1 ? row + 1 : row;
    const nextCol = (col + 1) % settings.n;

    if (board[row][col] !== '0') return countSolutions(board, settings, nextRow, nextCol, limit);

    let count = 0;
    for (const value of settings.symbols) {
        if (validate(board, settings, row, col, value)) {
            board[row][col] = value;
            count += countSolutions(board, settings, nextRow, nextCol, limit);
            if (count >= limit) {
                board[row][col] = '0';
                return count;
            }
            board[row][col] = '0';
        }
    }
    return count;
};

const removeCells = (board: string[][], settings: Config): string[][] => {
    const puzzle = board.map(row => [...row]);
    let removeCount = Math.floor(settings.n * settings.n * (
        settings.level === 'Easy' ? 0.3 :
        settings.level === 'Medium' ? 0.45 : 0.55
    ));

    while (removeCount > 0) {
        const row = grn(0, settings.n - 1);
        const col = grn(0, settings.n - 1);
        if (puzzle[row][col] !== '0') {
            const backup = puzzle[row][col];
            puzzle[row][col] = '0';

            if (countSolutions(puzzle, settings) !== 1) {
            } else {
                removeCount--;
            }
        }
    }

    return puzzle;
};

const generateSudoku = (settings: Config) => {
    const board: string[][] = Array.from({ length: settings.n }, () => Array(settings.n).fill('0'));

    if (!fillBoard(board, settings)) {
        throw new Error("Failed to generate Sudoku solution");
    }

    const solvedBoard = board.map(row => [...row]);
    const puzzleBoard = removeCells(board, settings);

    return { board: puzzleBoard, solvedBoard };
};

export { generateSudoku, validate };
