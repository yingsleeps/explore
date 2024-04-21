import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Dim, Colors } from "../Constants";

import { useFonts } from 'expo-font';

const Button = (props) => {
    const [fontsLoaded, fontError] = useFonts({
        'RubikBubbles': require('../../assets/fonts/RubikBubbles.ttf'),
    });

    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={props.style}>
                <Text style={styles.text}>{props.text}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "white",
        paddingHorizontal: 20,
        height: 40,
        borderRadius: 10,
        marginBottom: 5,
        marginRight: 7,
        justifyContent: "center",
    },
    text: {
        textAlign: "center",
        color: Colors.text_orange,
        fontWeight: "bold",
        fontSize: 20,
        fontFamily: "RubikBubbles"
    },
});

export default Button;