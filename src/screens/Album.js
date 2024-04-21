import { useCallback, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { Colors, Dim } from '../Constants';
import Button  from '../components/Button.js';

import LoadingScreen from '../components/Loading';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Polaroid from '../components/Polaroid'

SplashScreen.preventAutoHideAsync();


const AlbumScreen = () => {
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

    data = [
        {photo: "https://static.wikia.nocookie.net/phineasandferb/images/c/ca/Profile_-_Ferb_Fletcher.PNG/revision/latest?cb=20200401182236"},
        {photo: "https://static.wikia.nocookie.net/phineasandferb/images/c/ca/Profile_-_Ferb_Fletcher.PNG/revision/latest?cb=20200401182236"},
        {photo: "https://static.wikia.nocookie.net/phineasandferb/images/c/ca/Profile_-_Ferb_Fletcher.PNG/revision/latest?cb=20200401182236"},
        {photo: "https://static.wikia.nocookie.net/phineasandferb/images/c/ca/Profile_-_Ferb_Fletcher.PNG/revision/latest?cb=20200401182236"},
        {photo: "https://static.wikia.nocookie.net/phineasandferb/images/c/ca/Profile_-_Ferb_Fletcher.PNG/revision/latest?cb=20200401182236"},
        {photo: "https://static.wikia.nocookie.net/phineasandferb/images/c/ca/Profile_-_Ferb_Fletcher.PNG/revision/latest?cb=20200401182236"},
        {photo: "https://static.wikia.nocookie.net/phineasandferb/images/c/ca/Profile_-_Ferb_Fletcher.PNG/revision/latest?cb=20200401182236"},
    ]

    return (
        <SafeAreaView style={styles.big_container} onLayout={onLayoutRootView}>
            <View style={styles.container}> 
                <Text style={styles.name}>Photo Album</Text>
                <View style={styles.list_container}>
                    <FlatList
                        style={{ width: "90%", height: "73%"}}
                        data={data}
                        horizontal={false}
                        numColumns={2}
                        renderItem={({ item }) => {
                            return (
                                <Polaroid 
                                    photo={item.photo} />
                            );
                        }}
                    />
                </View>
                <View style={{top: 40}}> 
                    <Button 
                        onPress={() => { navigation.goBack() }}
                        text = "Back"
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
    list_container: {
        width: Dim.width, 
        alignItems: "center", 
        top: 20,
        left: 5
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
})

export default AlbumScreen;