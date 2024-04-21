import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Dim, Colors } from "../Constants";

const Button = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={styles.button}>
                <Text style={styles.text}>{props.text}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "white",
        width: Dim.width * 0.45,
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
        fontSize: 15,
    },
});

export default Button;