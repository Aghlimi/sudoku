import { View, Text, StyleSheet, Button } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import React from 'react';
import { AppContext } from './context';
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    label: {
        fontSize: 16,
    },
    picker: {
        height: 50,
        width: 150,
    },
});

const Setting = () => {
    const [selectedValue, setSelectedValue] = React.useState("4");
    const [level, setLevel] = React.useState("Easy");
    const { setSettings } = React.useContext(AppContext);
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 10 }}>Settings</Text>
            <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="4x4" value="4" />
                <Picker.Item label="9x9" value="9" />
                <Picker.Item label="16x16" value="16" />
            </Picker>
            <Picker
                selectedValue={level}
                onValueChange={(itemValue) => setLevel(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Easy" value="Easy" />
                <Picker.Item label="Medium" value="Medium" />
                <Picker.Item label="Hard" value="Hard" />
            </Picker>
            <Button title="Save Settings" onPress={() => setSettings({
                boxSize: parseInt(selectedValue) === 4 ? 2 : parseInt(selectedValue) === 9 ? 3 : 4,
                n: parseInt(selectedValue),
                level: level,
                symbols: ['1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G'].slice(0, parseInt(selectedValue))
            })} />
        </View>
    );
};

export default Setting;

