import React, { useState, useEffect, useRef, useCallback } from "react";
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { Camera } from "expo-camera";
import { Dim } from "../Constants";
import axios from "axios";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import LoadingScreen from "../components/Loading";
import SpinAnimation from "../components/SpinAnimation";

SplashScreen.preventAutoHideAsync();

export default function CameraComponent() {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [loading, setLoading] = useState(false);
    const userid = "asdfasdfas"
    const [fontsLoaded, fontError] = useFonts({
        RubikBubbles: require("../../assets/fonts/RubikBubbles.ttf"),
    });
    let camera = useRef(null);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return LoadingScreen;
    }

    const takePicture = useCallback(async () => {
        if (camera.current === null) return;
        if (loading) return
        setLoading(true)
        // if (!camera) return;
        const photo = await camera.takePictureAsync();
        
        console.log(photo)
        const formData = new FormData();
        formData.append('image', {
            uri: photo.uri,
            type: 'image/jpg',  // or your photo.type if available
            name: `${userid}_quest.jpg`  // or another dynamic name as needed
        });

        formData.append("name", "Pauley Pavilion");
        formData.append("latitude", 34.0706355);
        formData.append("longitude", -118.4469401);
        formData.append("userId", "CXbkwdUIVqax42ZAnNumXT1ETBR2");
        formData.append("quest", "Take a picture of two people.");

        await axios
            .post("http://192.168.1.158:4000/landmark/add/user", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
            }})
            .then((res)=>{
                console.log(res.data)
                // TODO: Navigate to the next page
            })
            .catch((err)=>console.log(err))
            .finally(()=>setLoading(false));
    }, [camera, loading, setLoading]);

    useEffect(()=>{

    },[])

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, [setHasPermission]);

    if (hasPermission === null) {
        return (
            <View>
                <Text>Hello World!</Text>
            </View>
        );
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <SafeAreaView
            style={{
                position: "relative",
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#CADB63",
                gap: 10,
            }}
            onLayout={onLayoutRootView}
        >
            {loading && 
                <View style={{
                    flex: 1,
                    backgroundColor: "rgba(202, 219, 99, 0.8)",
                    opacity: "50%",
                    position: "absolute",
                    zIndex: 1
                }}>
                    <View style={{
                        flexDirection: "column",
                        width: Dim.width,
                        height: Dim.height, 
                        paddingTop: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <SpinAnimation/> 
                    </View>
                </View>
            }
            <Text
                style={{
                    fontSize: 60,
                    fontFamily: "RubikBubbles",
                    alignSelf: "center",
                    color: "#C77020",
                    marginTop: 60,
                }}
            >
                SNAP!
            </Text>
            <Camera
                style={{
                    flex: 1,
                    width: "80%",
                    maxHeight: "60%",
                    height: "60%",
                }}
                ref={(r) => {
                    camera = r;
                }}
            />
            <TouchableOpacity onPress={() => {
                takePicture();
            }}>
                <View
                    style={{
                        borderRadius: 999,
                        borderColor: "white",
                        borderWidth: 5,
                        height: 70,
                        width: 70,
                        top: 15,
                    }}
                />
            </TouchableOpacity>

            <TouchableOpacity
                // TODO: Navigation for the back button
                onPress={() => {

                }}
                style={{
                    flex: 1,
                    position: "absolute",
                    top: 0.075 * Dim.height + 5,
                    backgroundColor: "#EA8E3A",
                    width: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 5,
                    borderRadius: 15,
                    left: 0.05 * Dim.width,
                }}
            >
                <View>
                    <Text
                        style={{
                            fontSize: 20,
                            fontFamily: "RubikBubbles",
                            alignSelf: "center",
                            color: "white",
                        }}
                    >
                        Back
                    </Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
}