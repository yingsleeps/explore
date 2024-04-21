import { Modal, StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useCallback } from "react";
import { useFonts } from 'expo-font';
import { Dim } from "../Constants";
import * as SplashScreen from 'expo-splash-screen';

import Ranger from '../../assets/popup/ranger_popup.png'

SplashScreen.preventAutoHideAsync();

export default Popup = (props) => {
    const [fontsLoaded, fontError] = useFonts({
        'RubikBubbles': require('../../assets/fonts/RubikBubbles.ttf'),
    });
    
    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
          await SplashScreen.hideAsync();
        }
      }, [fontsLoaded, fontError]);
    
      if (!fontsLoaded && !fontError) {
        return null;
    };
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={()=>{
                props.setVisible(false);
            }}
            onLayout={onLayoutRootView}
        >
            <View style={styles.bigContainer}>
                <View style={styles.landmark}>
                    <Text style={styles.landmarkText}>Landmark Discovered</Text>
                </View>
                <View style={styles.questBox}>
                    <Text style={styles.questTitle}>Quest</Text>
                    <Text style={styles.questText}>{props.quest}</Text>
                </View>
                <View style={{width: .875*Dim.width}}>
                    <Text style={styles.choiceQuestion}>DO YOU ACCEPT QUEST?</Text>
                </View>
                <View
                    style={{
                        width: .85*Dim.width,
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        marginLeft: 40,
                    }}
                >
                    <View style={styles.choiceContainer}>
                        <TouchableOpacity
                            // TODO: Add a press function
                        >
                        <View style={styles.yesBox}>
                                <Text style={styles.choiceText}>Yes</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>props.setVisible(false)}
                        >
                            <View style={styles.noBox}>
                                <Text style={styles.choiceText}>No</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Ranger */}
                <View
                    style={{
                        position: "absolute",
                        left: 20,
                        bottom: -35,
                    }}
                >
                    <Image source={Ranger}/>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    bigContainer: {
        position: "relative",
        display: 'flex',
        flexDirection: "column",
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        paddingTop: 0,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: Dim.width*0.85,
        justifyContent: 'center',
        gap: 10,
    },
    landmarkText: {
        fontSize: 40,
        fontFamily: "RubikBubbles",
        alignSelf: "center",
        color: "#CA7C34",
        paddingVertical: 20
    },
    landmark: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "#FFE381",
        width: .85*Dim.width
    },
    questTitle: {
        fontSize: 36,
        fontFamily: "RubikBubbles",
        alignSelf: "center",
        color: "#845830",
        textAlign: "center"
    },
    questText:{
        fontSize: 18,
        fontFamily: "RubikBubbles",
        alignSelf: "center",
        color: "#845830",
        textAlign: 'center'
    },
    questBox: {
        display: 'flex',
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'evenly',
        gap: 20,
        paddingVertical: 10,
        minHeight: 200,
        textAlign: "center"
    },
    choiceQuestion : {
        fontSize: 24,
        fontFamily: "RubikBubbles",
        alignSelf: "center",
        color: "#C77020",
        textAlign: 'center'
    },
    choiceContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    choiceText: {
        fontSize: 30,
        fontFamily: "RubikBubbles",
        alignSelf: "center",
        color: "white",
    },
    yesBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center",
        width: 140,
        paddingVertical: 10,
        fontSize: 30,
        fontFamily: "RubikBubbles",
        alignSelf: "center",
        color: "white",
        backgroundColor: "#91993A",
        borderRadius: 20,
        textAlign: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    noBox: {
        backgroundColor: "#EA8E3A",
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center",
        width: 140,
        paddingVertical: 10,
        fontSize: 30,
        fontFamily: "RubikBubbles",
        alignSelf: "center",
        color: "white",
        borderRadius: 20,
        textAlign: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
    }
})