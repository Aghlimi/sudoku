import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Config, Note } from './Types';
import React from 'react';
import { AppContext } from './context';
import { validate } from './generater';
import { useWindowDimensions } from 'react-native';
const styles = StyleSheet.create({
    cell: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 0,
        borderWidth: 1,
    },
});

const CellContent = ({ cell, note, size }: { cell: string, note: Note | null, size: number }) => {
    const { key } = React.useContext(AppContext);
    return (
        <View style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%'
        }}>

            {cell === '0' ? (
                note?.contain ?
                    note?.note.map((row, index) => (
                        <View key={index} style={{
                            display: 'flex',
                            flexDirection: 'row',
                        }}>{
                                row.map((c: string, ind: number) =>
                                (<Text key={ind} style={{
                                    fontSize: 5,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: key == c ? '#5b6be6ff' : '#fff'
                                }}>{c != '0' ? c : null}</Text>)
                                )
                            }</View>
                    ))
                    : null
            ) :
                <Text
                    style={{
                        height: size,
                        fontSize: size *0.05,
                        textAlign: 'center'
                    }}
                >{cell}</Text>}
        </View>
    )
}

const Cell = ({ onPress, cell, rowIndex, cellIndex }: { onPress: () => void, cell: string, rowIndex: number, cellIndex: number }) => {
    const { settings, key: key, notes, setNotes, board, not }: { settings: Config, key: string, notes: Note[][], setNotes: any, board: string[][], not: boolean } = React.useContext(AppContext);
    if (!settings) return null;
    const handleNote = () => {
        let newNote = notes.map((row: Note[]) => [...row]);
        const nex = settings.symbols.indexOf(key) % settings.boxSize;
        const ney = Math.floor(settings.symbols.indexOf(key) / settings.boxSize);
        if (newNote[rowIndex][cellIndex].note[ney][nex] === key) {
            newNote[rowIndex][cellIndex].note[ney][nex] = '0';
        } else if (validate(board, settings, rowIndex, cellIndex, key)) {
            newNote[rowIndex][cellIndex].note[ney][nex] = key;
        }
        setNotes(newNote);
    };
    const { width, height } = useWindowDimensions();
    const size = (width > height ? height : width) - 100;
    return (
        <TouchableOpacity onLongPress={handleNote} onPress={() => {
            if (not) handleNote();
            else onPress()
        }} key={`${rowIndex}-${cellIndex}`} style={{
            ...styles.cell,
            backgroundColor: cell === key ? '#5b6be6ff' : '#fff',
            borderBottomWidth: (rowIndex + 1) % settings.boxSize === 0 ? 3 : 1,
            borderRightWidth: (cellIndex + 1) % settings.boxSize === 0 ? 3 : 1,
            width: size / settings.n,
            height: size / settings.n,
        }}>
            <CellContent key={`${rowIndex}-${cellIndex}`} cell={cell} size={size} note={notes && notes[rowIndex][cellIndex]} />
        </TouchableOpacity>
    );
};
export default Cell;