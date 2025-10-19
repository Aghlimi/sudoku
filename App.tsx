import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { generateSudoku, validate } from './generater';
import config from './config';

const checkNotempty = (board: string[][] | null, solvedBoard: string[][] | null, value: string) => {
    if (!board || !solvedBoard) return true;
    try {
        solvedBoard?.map((row, rowIndex) => row.map((col, colIndex) => {

            if (col == value && board[rowIndex][colIndex] != value)throw Error('foundone');

        }));
    }
    catch {
        console.log("catched");
        return true;
    }
    return false;
}


const Keyboard = ({ setKey, board, solvedBoard }: { setKey: (key: string) => void, board: string[][] | null, solvedBoard: string[][] | null }) => {
    return (
        <View style={{ flexDirection: 'row', width: 240 }}>
            {config.symbols.map((key) => checkNotempty(board, solvedBoard, key) && (
                <TouchableOpacity key={key} style={{ width: 15, height: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1 }}
                    onPress={() => setKey(key)}
                >
                    <Text >{key}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

interface Node {
    contain: boolean;
    note: string[][];
}


const Notes = ({ notes, keyb }: { notes: Node | null, keyb: string }) => {
    if (!notes) return null;
    return (
        <View style={{ flexDirection: 'column', flexWrap: 'wrap', width: '100%', height: '100%' }}>
            {notes?.note?.map((row, rowIndex) => (
                <View key={rowIndex} style={{ width: '33.33%' }}>
                    {row?.map((note, colIndex) => {
                        return (
                            <Text key={colIndex} style={{ fontSize: 5, textAlign: 'center', backgroundColor: note == keyb ? 'red' : 'transparent' }}>
                                {note}
                            </Text>
                        )
                    })}
                </View>
            ))
            }
        </View >
    );
}

const clearFromNotes = (board: Node, key: string) => {
    const index = config.symbols.indexOf(key);
    const nx = index % config.boxSize;
    const ny = Math.floor(index / config.boxSize);
    board.note[ny][nx] = '';
    console.log(key, nx, ny, 'cleared');
}

const clear = (board: Node[][], row: number, col: number, value: string): void => {
    for (let i = 0; i < config.n; i++) {
        clearFromNotes(board[row][i], value);
        clearFromNotes(board[i][col], value);
    }
    const boxRow = Math.floor(row / config.boxSize) * config.boxSize;
    const boxCol = Math.floor(col / config.boxSize) * config.boxSize;

    for (let i = boxRow; i < boxRow + config.boxSize; i++) {
        for (let j = boxCol; j < boxCol + config.boxSize; j++) {
            clearFromNotes(board[i][j], value);
        }
    }
};

export default function App() {
    const [solvedBoard, setSolvedBoard] = React.useState<string[][] | null>(null);
    const [notes, setNotes] = React.useState<Node[][]>(Array.from({ length: config.n }, () =>
        Array.from({ length: config.n }, () => ({
            contain: true,
            note: Array.from({
                length: config.boxSize
            },
                () => Array.from({
                    length: config.boxSize
                },
                    () => '1'
                ))
        }))
    ));
    const [error, setError] = React.useState<number>(0);
    const [key, setKey] = React.useState<string>('1');
    const [board, setBoard] = React.useState<string[][] | null>(null);
    React.useEffect(() => {
        const { board: boarde, solvedBoard }: { board: string[][], solvedBoard: string[][] } = generateSudoku('hard');
        setBoard(boarde);
        setSolvedBoard(solvedBoard);
    }, []);

    React.useEffect(() => {
        setNotes(Array.from({ length: config.n }, () =>
            Array.from({ length: config.n }, () => ({
                contain: true,
                note: Array.from({
                    length: config.boxSize
                },
                    () => Array.from({
                        length: config.boxSize
                    },
                        () => ''
                    ))
            }))));
    }, [solvedBoard]);
    const clickHandler = (x: number, y: number) => {
        if (board && board[y][x] == '0' && key != null) {
            if (solvedBoard && solvedBoard[y][x] == key) {
                board[y][x] = key.toString();
                clear(notes, y, x, key);
                setBoard([...board]);
            } else {
                setError(error + 1);
            }
        }
        else if(board && board[y][x] != '0')
            setKey(board[y][x]);
    }
    const noteHandler = (x: number, y: number) => {
        if (board && board[y][x] == '0' && key != null) {
            const newNotes = [...notes];
            const index = config.symbols.indexOf(key);
            const nx = index % config.boxSize;
            const ny = Math.floor(index / config.boxSize);
            if (!validate(board, y, x, key)) {
                return;
            }
            if (newNotes[y][x].note[ny][nx] != '') {
                newNotes[y][x].note[ny][nx] = '';
            } else {
                newNotes[y][x].note[ny][nx] = key;
                newNotes[y][x].contain = true;
            }
            setNotes(newNotes);
        }
    }
    return (<View>
        <Text>Error Count: {error}</Text>
        {board?.map((row: string[], rowIndex: number) => (
            <View key={rowIndex} style={{ flexDirection: 'row' }} >
                {row?.map((value, colIndex) => (
                    <TouchableOpacity onLongPress={() => noteHandler(colIndex, rowIndex)} delayLongPress={200} key={colIndex} style={{
                        borderBottomWidth: (rowIndex + 1) % config.boxSize === 0 ? 3 : 1,
                        borderRightWidth: (colIndex + 1) % config.boxSize === 0 ? 3 : 1,
                        borderBottomColor: (rowIndex + 1) % config.boxSize === 0 ? 'black' : 'transparent',
                        borderRightColor: (colIndex + 1) % config.boxSize === 0 ? 'black' : 'transparent',
                        borderTopWidth: rowIndex === 0 ? 3 : 1,
                        borderLeftWidth: colIndex === 0 ? 3 : 1,
                        width: 20,
                        height: 20,
                        backgroundColor: value == key ? 'red' : 'none',
                        borderWidth: 1
                    }} onPress={() => clickHandler(colIndex, rowIndex)}>
                        {
                            value != '0' &&
                            <Text style={{ textAlign: 'center' }}>{value}</Text> || notes &&
                            notes[rowIndex][colIndex].contain && <Notes notes={notes[rowIndex][colIndex]} keyb={key} />
                        }
                    </TouchableOpacity>
                ))}
            </View>
        ))}
        <Keyboard setKey={setKey} board={board} solvedBoard={solvedBoard} />
    </View>
    );
}