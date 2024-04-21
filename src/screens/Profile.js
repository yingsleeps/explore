import { useCallback } from 'react';
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

    return (
        <SafeAreaView style={styles.big_container} onLayout={onLayoutRootView}>
            <View style={styles.container}> 
                <Text style={styles.name}>Ranger</Text>
                <Text style={styles.name}>Sid</Text>
                <View style={styles.picContainer}> 
                    <Image 
                        source={require("../../assets/BunnyProfile.png")}
                        style={styles.profile}
                    />
                </View> 
                <Text style={styles.name}>Achievements</Text>
                <View style={styles.button}>
                    <Button 
                        onPress={() => {console.log("hi")}}
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

export default ProfileScreen;