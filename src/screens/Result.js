import { useCallback, useState,  } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Colors, Dim } from '../Constants';
import Button  from '../components/Button.js';


import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import LoadingScreen from '../components/Loading';

SplashScreen.preventAutoHideAsync();

const ResultScreen = ({ route }) => {
    const { photo } = route.params;

    const [fontsLoaded, fontError] = useFonts({
        'RubikBubbles': require('../../assets/fonts/RubikBubbles.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
          await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);
    
    if (!fontsLoaded && !fontError) {
        return LoadingScreen;
    }
    

    return (
        <SafeAreaView style={styles.big_container} onLayout={onLayoutRootView}>
            <View style={styles.container}> 
                <Text style={styles.name}>SCORE</Text>
                <Text style={styles.name}>10/10 CARROTS </Text>
                <View style={styles.image_container}>
                    <Image 
                        source={{uri: photo}}
                        style={styles.image}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    big_container: {
        flex: 1,
        backgroundColor: Colors.background_green,
    },
    container: {
        flexDirection: "column",
        width: Dim.width,
        height: Dim.height, 
        paddingTop: 20,
        position: "relative",
        alignItems: "center"
    },
    name: {
        fontSize: 40,
        fontFamily: "RubikBubbles",
        alignSelf: "center",
        color: "white"
    },
    image_container: {
        backgroundColor: "white",
        width: Dim.width * 0.8,
        height: Dim.height * 0.55,
        top: 20
    },
    image: {
        width: Dim.width * 0.7,
        height: Dim.height * 0.4,
        zIndex: 100,
        alignSelf: 'center',
        top: 20
    }
    
})

export default ResultScreen;