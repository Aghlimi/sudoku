
import React from 'react';
import { View, Text } from 'react-native';
import { AppContext } from './context';
const Keyboard = () => {
    const { settings, key: keyc, setKey, board, solvedBoard } = React.useContext(AppContext);
    if (!settings) return null;
    const [keyboard, setKeyboard] = React.useState<string[]>([]);

    React.useEffect(() => {
        setKeyboard(settings?.symbols || []);
    }, [settings]);
    React.useEffect(() => {
        let edited = false;
        const newKeyboard: string[] = Array<string>();
        board?.forEach((row: string[], rIdx: number) => {
            row.forEach((cell: string, cIdx: number) => {
                if (cell === '0' && cell !== solvedBoard?.[rIdx][cIdx]) {
                    if (newKeyboard.includes(solvedBoard?.[rIdx][cIdx] || '')) return;
                    newKeyboard.push(solvedBoard?.[rIdx][cIdx] || '');
                    edited = true;
                }
            });
        });
        if (edited || newKeyboard.length === 0) {
            setKeyboard(newKeyboard.sort());
        }
    }, [board, solvedBoard]);

    return (<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {keyboard.map((k) => (
            <Text key={k} onPress={() => setKey(k)} style={{
                width: 20,
                height: 20,
                textAlign: 'center',
                textAlignVertical: 'center',
                borderWidth: 1,
                marginTop: 5,
                backgroundColor: k === keyc ? '#3247e8ff' : '#fff',
            }}>{k}</Text>
        ))}
    </View>);
}

export default Keyboard;