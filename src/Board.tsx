import React from 'react';
import { View, Text } from 'react-native';
import { generateSudoku, validate } from './generater';
import Cell from './Cell';
import { AppContext } from './context';

export default function Board() {
    const { settings, key, setError, error } = React.useContext(AppContext);
    const { board, setBoard, solvedBoard, setSolvedBoard } = React.useContext(AppContext);
    console.log('Board rendered');

    const playHandler = (row: number, col: number) => {
        if (!board) return;
        if (board[row][col] !== '0')
            return;
        const isValid = validate(board, settings, row, col, key);
        if (!isValid) { setError(error + 1); return; }
        const newBoard = board.map((r: string[]) => [...r]);
        newBoard[row][col] = key;
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