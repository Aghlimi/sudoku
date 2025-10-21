import React from "react";
import Board from "./Board";
import Setting from "./Setting";
import { Config, Note } from "./Types";
import { Text, View, Button } from "react-native";
import Keyboard from "./Keyboard";
import { AppContext } from "./context";
import { generateSudoku } from "./generater";

export default function App() {
    const [settings, setSettings] = React.useState<Config | null>(null);
    const [key, setKey] = React.useState(settings?.symbols[0] || '1');
    const [error, setError] = React.useState<string | null>(null);
    const [board, setBoard] = React.useState<string[][] | null>(null);
    const [solvedBoard, setSolvedBoard] = React.useState<string[][] | null>(null);
    const [notes, setNotes] = React.useState<Note[][] | null>(null);
    const [not, setNot] = React.useState<Boolean>(false);

    React.useEffect(() => {
        if (settings === null) return;
        const newBoard = generateSudoku(settings);
        setBoard(newBoard.board);
        setSolvedBoard(newBoard.solvedBoard);
        setNotes(Array.from({ length: settings.n }, () => Array.from({ length: settings.n }, () => ({ contain: true, note: Array.from({ length: settings.boxSize }, () => Array.from({ length: settings.boxSize }, () => '0')) }))));
    }, [settings]);

    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <AppContext.Provider value={{ settings, setSettings, key, setKey, error, setError, board, setBoard, solvedBoard, setSolvedBoard, notes, setNotes, not }}>
                {error && <Text style={{ color: 'red' }}>{error}</Text>}
                {settings ? <View>
                    <Board />
                    <Keyboard />
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between'
                    }}>
                        <Button title={!not ? "note" : "play"} onPress={() => {
                            setNot(!not);
                        }} />
                        <Button title="Reset" onPress={() => {
                            setSettings(null);
                            setKey(settings?.symbols[0] || '1');
                            setError(null);
                            setBoard(null);
                            setSolvedBoard(null);
                            setNotes(null);
                        }} />
                    </View>
                </View>
                    : <Setting />
                }
            </AppContext.Provider>
        </View>
    );
}
