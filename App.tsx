import React from 'react';
import { View, Text } from 'react-native';
import { generateSudoku } from './generater';

const clickHandler = () => {
    
}

export default function App() {
    const { board, solvedBoard }: { board: number[][], solvedBoard: number[][] } = generateSudoku();
    return (
        <View>
            {board.map((row: number[], rowIndex: number) => (
                <View key={rowIndex} style={{ flexDirection: 'row' }}>
                    {row.map((value, colIndex) => (
                        <Text key={colIndex} style={{ width: 40, height: 40, textAlign: 'center', borderWidth: 1 }}>
                            {value}
                        </Text>
                    ))}
                </View>
            ))}
        </View>
    );
}