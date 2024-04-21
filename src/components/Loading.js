import { useCallback } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Colors, Dim } from '../Constants';
import Button  from '../components/Button.js';


import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();


const LoadingScreen = () => {

    return (
        <SafeAreaView style={styles.big_container} >
            <View style={styles.container}> 
                    
            </View>
                    
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    big_container: {
        flex: 1,
        backgroundColor: Colors.background_orange,
    },
    container: {
        flexDirection: "column",
        width: Dim.width,
        height: Dim.height, 
        paddingTop: 20,
    },
    name: {
        fontSize: 40,
        fontFamily: "RubikBubbles",
        alignSelf: "center",
        color: "white"
    },
    profile: {
        alignSelf: "center",
    },
    picContainer: {
        margin: 20,
    },
    button: {
        alignSelf: "center",
        margin: 20, 
    },
    achievements: {

    }
})

export default LoadingScreen;