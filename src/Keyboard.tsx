
import React from 'react';
import { View, Text } from 'react-native';
import { AppContext } from './context';
import { Key, Config } from './Types';

const Keyboard = () => {
    const { settings, key, setKey, board, solvedBoard }: { settings: Config; key: string; setKey: (key: string) => void; board: string[][]; solvedBoard: string[][] } = React.useContext(AppContext);
    if (!settings) return null;
    const [keyboard, setKeyboard] = React.useState<Key[]>([]);

    React.useEffect(() => {
        let newKeyboard = settings.symbols.map(r => ({
            value: r,
            numberof: 0
        }));

        board?.forEach((row: string[], rIdx: number) => {
            row.forEach((cell: string, cIdx: number) => {
                if (cell === '0' && cell !== solvedBoard?.[rIdx][cIdx]) {
                    const index = settings.symbols.indexOf(solvedBoard?.[rIdx][cIdx]);
                    newKeyboard[index].numberof += 1;

                }
            });
        });
        setKeyboard(newKeyboard);
        if(newKeyboard[settings.symbols.indexOf(key)].numberof == 0)
        {
            for(let i = 0;i < settings.n;i++)
            {
                if(newKeyboard[(i + settings.symbols.indexOf(key) )% settings.n].numberof != 0)
                {
                    setKey(newKeyboard[(i + settings.symbols.indexOf(key) )% settings.n].value);
                    break;
                }
            }
        }
    }, [board, solvedBoard]);

    return (<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {keyboard.map((k) => (k.numberof !== 0 ? (
            <Text key={k.value} onPress={() => { setKey(k.value) }} style={{
                width: 20,
                height: 30,
                textAlign: 'center',
                textAlignVertical: 'center',
                borderWidth: 1,
                marginTop: 5,
                backgroundColor: k.value === key ? '#5b6be6ff' : '#fff',
            }}>{k.value + '\n'}
                <Text style={{
                    fontSize: 10,
                    position: 'relative',
                    top: '-7px'
                }}>
                    {k.numberof}
                </Text>
            </Text>
        ) : null)

        )}
    </View>);
}

export default Keyboard;