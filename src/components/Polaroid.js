import React from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
} from "react-native";
import { Dim, Colors } from "../Constants";

const Polaroid = (props) => {
    return (
        <View style={styles.container}>
            <Image
                source={{
                    uri: props.photo,
                }}
                style={styles.picture}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        marginLeft: 10,
        width: Dim.width * 0.4,
        height: Dim.width * 0.55,
        backgroundColor: "white",
    },
    picture: {
        width: Dim.width * 0.35,
        height: Dim.width * 0.40,
        zIndex: 100,
        alignSelf: 'center',
        top: 10
    },
});

export default Polaroid;