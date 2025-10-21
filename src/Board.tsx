import React from 'react';
import { View, Text } from 'react-native';
import { generateSudoku, validate } from './generater';
import Cell from './Cell';
import { AppContext } from './context';
import { Config, Note } from './Types';

const clearFromNotes = (settings: Config, board: Note, key: string) => {
    const index = settings.symbols.indexOf(key);
    const nx = index % settings.boxSize;
    const ny = Math.floor(index / settings.boxSize);
    board.note[ny][nx] = '';
}

const clear = (settings: Config, board: Note[][], row: number, col: number, value: string): void => {
    for (let i = 0; i < settings.n; i++) {
        clearFromNotes(settings, board[row][i], value);
        clearFromNotes(settings, board[i][col], value);
    }
    const boxRow = Math.floor(row / settings.boxSize) * settings.boxSize;
    const boxCol = Math.floor(col / settings.boxSize) * settings.boxSize;

    for (let i = boxRow; i < boxRow + settings.boxSize; i++) {
        for (let j = boxCol; j < boxCol + settings.boxSize; j++) {
            clearFromNotes(settings, board[i][j], value);
        }
    }
};

export default function Board() {
    const { settings, key, setError, error, notes, setNotes,setKey } = React.useContext(AppContext);
    const { board, setBoard, solvedBoard, setSolvedBoard } = React.useContext(AppContext);

    const playHandler = (row: number, col: number) => {
        if (!board) return;
        if (board[row][col] !== '0') {
            setKey(board[row][col]);
            return;
        }
        const isValid = validate(board, settings, row, col, key);
        if (!isValid) { setError(error + 1); return; }
        const newBoard = board.map((r: string[]) => [...r]);
        newBoard[row][col] = key;
        clear(settings, notes, row, col, key);
        setNotes(notes);
        setBoard(newBoard);
    };

    return (<View>
        <Text>Sudoku Game</Text>
        {board && board.map((row: string[], rowIndex: number) => (
            <View key={rowIndex} style={{ flexDirection: 'row' }}>
                {row.map((cell: string, cellIndex: number) => (
                    <Cell key={cellIndex} onPress={() => playHandler(rowIndex, cellIndex)} cell={cell} rowIndex={rowIndex} cellIndex={cellIndex} />
                ))}
            </View>
        ))}
    </View>);
}