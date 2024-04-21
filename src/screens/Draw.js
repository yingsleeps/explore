import { useCallback, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { Canvas, Path, useCanvasRef } from "@shopify/react-native-skia";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, LayoutAnimation } from 'react-native';
import { Colors, Dim } from '../Constants';
import Button  from '../components/Button.js';
// import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";



import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import LoadingScreen from '../components/Loading';

SplashScreen.preventAutoHideAsync();

const DrawScreen = ({ route }) => {
    // const { location, latitude, longitude, quest } = route.params;
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

    const navigation = useNavigation();

    const [paths, setPaths] = useState([]);

    // for sc canvas
    const [capturedImage, setCapturedImage] = useState(null);
    const canvasRef = useCanvasRef(null);

    const captureCanvas = async () => {
        if (!canvasRef.current) {
          return;
        }
      
        try {
          const image = await canvasRef.current?.makeImageSnapshotAsync();
          if (image) { 
            const bytes = image.encodeToBase64();
            const uri = `data:image/png;base64,${bytes}`
            setCapturedImage(uri)

            // const formData = new FormData();
            // formData.append('image', { uri: uri, type: 'image/jpg', name: "aha.jpg" })

            // formData.append("name", location);
            // formData.append("latitude", latitude);
            // formData.append("longitude", longitude);
            // formData.append("userId", "CXbkwdUIVqax42ZAnNumXT1ETBR2");
            // formData.append("quest", quest);

            // await axios.post("http://localhost:4000/landmark/add/user", formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            // }})

            }
        } catch (error) {
          console.error('Error capturing canvas:', error);
        }
    };

    const pan = Gesture.Pan()
    .onStart((g) => {
        const newPaths = [...paths];
        newPaths[paths.length] = {
            segments: [],
            color: "#000000",
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
                            <Canvas style={{ flex: 8 }} ref={canvasRef}>
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
                    onPress={() => {
                        captureCanvas();
                        if (capturedImage) {
                            console.log(capturedImage)
                            navigation.navigate("Result", {photo: capturedImage})
                        }
                    }}
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