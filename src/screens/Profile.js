import { useCallback, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Colors, Dim } from '../Constants';
import Button  from '../components/Button.js';

import LoadingScreen from '../components/Loading';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();


const ProfileScreen = () => {
    const [fontsLoaded, fontError] = useFonts({
        'RubikBubbles': require('../../assets/fonts/RubikBubbles.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
          await SplashScreen.hideAsync();
        }
      }, [fontsLoaded, fontError]);
    
    if (!fontsLoaded && !fontError) {
        return <LoadingScreen/>;
    }

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.big_container} onLayout={onLayoutRootView}>
            <View style={styles.container}> 
                <Text style={styles.name}>Ranger Sid</Text>
                <View style={styles.picContainer}> 
                    <Image 
                        source={require("../../assets/BunnyProfile.png")}
                        style={styles.profile}
                    />
                </View> 
                <Text style={styles.text}>Achievements</Text>
                <View style={styles.achievement}>

                </View>
                <View style={styles.button_container}>
                    <Button 
                        onPress={() => { navigation.navigate("Draw"); }}
                        text = "View Album"
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
        backgroundColor: Colors.background_orange,
    },
    container: {
        flexDirection: "column",
        width: Dim.width,
        height: Dim.height, 
        paddingTop: 10,
        alignItems: "center",
    },
    name: {
        fontSize: 40,
        fontFamily: "RubikBubbles",
        alignSelf: "center",
        color: "white"
    },
    text: {
        fontSize: 30,
        fontFamily: "RubikBubbles",
        alignSelf: "flex-start",
        left: 30,
        color: "white"
    },
    profile: {
        alignSelf: "center",
    },
    picContainer: {
        margin: 20,
    },
    button: {
        backgroundColor: "white",
        paddingHorizontal: 20,
        height: 50,
        borderRadius: 10,
        marginBottom: 5,
        marginRight: 7,
        justifyContent: "center", 

    },
    button_container: {
        flexDirection: "row", 
        justifyContent: 'center',
        margin: 8,
    },
    achievement: {
        backgroundColor: "#FFF2D9",
        height: "30%",
        width: "85%",
        margin: 15,
        borderRadius: 20,
    }

})

export default ProfileScreen;