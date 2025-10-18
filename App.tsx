import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { generateSudoku } from './generater';
import config from './config';
const Keyboard = ({ setKey }: { setKey: (key: string) => void }) => {
    return (
        <View style={{ flexDirection: 'row', width: 240 }}>
            {config.symbols.map((key) => (
                <TouchableOpacity key={key} style={{ width: 15, height: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1 }}
                    onPress={() => setKey(key)}
                >
                    <Text >{key}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

export default function App() {
    const [solvedBoard, setSolvedBoard] = React.useState<string[][] | null>(null);
    const [error, setError] = React.useState<number>(0);
    const [key, setKey] = React.useState<string | null>(null);
    const [board, setBoard] = React.useState<string[][] | null>(null);
    React.useEffect(() => {
        const { board: boarde, solvedBoard }: { board: string[][], solvedBoard: string[][] } = generateSudoku('hard');
        setBoard(boarde);
        setSolvedBoard(solvedBoard);
    }, []);

    const clickHandler = (x: number, y: number) => {
        if (board && board[y][x] == '0' && key != null) {
            if (solvedBoard && solvedBoard[y][x] == key) {
                board[y][x] = key.toString();
                setBoard([...board]);
            } else {
                setError(error + 1);
            }
        }
    }
    return (<View>
        <Text>Error Count: {error}</Text>
        {board?.map((row: string[], rowIndex: number) => (
            <View key={rowIndex} style={{ flexDirection: 'row' }} >
                {row?.map((value, colIndex) => (
                    <TouchableOpacity onLongPress={() => alert('long press')} key={colIndex} style={{
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
                        {value != '0' && <Text style={{ textAlign: 'center' }}>{value}</Text>}
                    </TouchableOpacity>
                ))}
            </View>
        ))}
        <Keyboard setKey={setKey} />
    </View>
    );
}