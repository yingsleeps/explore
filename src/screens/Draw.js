import { useCallback, useState,  } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Colors, Dim } from '../Constants';
import Button  from '../components/Button.js';

import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Canvas, Path } from "@shopify/react-native-skia";


import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import LoadingScreen from '../components/Loading';

SplashScreen.preventAutoHideAsync();

const DrawScreen = () => {
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

    const [paths, setPaths] = useState([]);

    const pan = Gesture.Pan()
    .onStart((g) => {
        const newPaths = [...paths];
        newPaths[paths.length] = {
            segments: [],
            color: "#06d6a0",
        };
        newPaths[paths.length].segments.push(`M ${g.x} ${g.y}`);
        setPaths(newPaths);
    })
    .onUpdate((g) => {
        const index = paths.length - 1;
        const newPaths = [...paths];
        if (newPaths?.[index]?.segments) {
            newPaths[index].segments.push(`L ${g.x} ${g.y}`);
            setPaths(newPaths);
        }
    })
    .minDistance(1);

    return (
        <SafeAreaView style={styles.big_container} onLayout={onLayoutRootView}>
            <View style={styles.container}> 
                <Text style={styles.name}>Draw</Text>
                <GestureHandlerRootView style={{ flex: 1, maxHeight: "80%", height: "70%", margin: 0 }}>
                    <GestureDetector gesture={pan}>
                        <View style={styles.draw}>
                            <Canvas style={{ flex: 8 }}>
                                {paths.map((p, index) => (
                                <Path
                                    key={index}
                                    path={p.segments.join(" ")}
                                    strokeWidth={5}
                                    style="stroke"
                                    color={p.color}
                                />
                                ))}
                            </Canvas>
                        </View>
                    </GestureDetector>
                </GestureHandlerRootView>
                <View style={styles.button_container}> 
                <Button 
                    onPress={() => {console.log("hi")}}
                    text = "OK"
                    style={styles.button}
                />
                <Button 
                    onPress={() => {setPaths([])}}
                    text = "Clear"
                    style={styles.button}
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
    },
    name: {
        fontSize: 70,
        fontFamily: "RubikBubbles",
        alignSelf: "center",
        color: "white"
    },
    draw: {
        width: "80%",
        height: "70%", 
        backgroundColor: "white", 
        alignSelf: "center", 
        top: 20
    },
    button: {
        backgroundColor: "white",
        width: 135,
        height: 50,
        borderRadius: 10,
        marginBottom: 5,
        marginRight: 7,
        justifyContent: "center",
    },
    button_container: {
        position: "relative", 
        top: -130, 
        width: Dim.width, 
        display: 'flex', 
        flexDirection: "row", 
        justifyContent: 'center',
        gap: 25
    }
})

export default DrawScreen;