import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Colors, Dim } from '../Constants.js' 
import Ranger from '../../assets/landing/Ranger_Landing.png'
import Logo from '../../assets/landing/Logo_Landing.png'

const LandingScreen = () => {
    return (
        <SafeAreaView style={styles.big_container}>
            <ScrollView>
                <View>
                    <Image
                        source={Ranger}
                        style={styles.ranger}
                    />
                    <View style={styles.text}>
                    <Image
                        source={Logo}
                    />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    big_container: {
        display: "flex",
        flex: 1,
        backgroundColor: Colors.landing_orange,
        justifyContent: "center",
        alignContent: "center",
        // alignItems: 'center',
        width: Dim.width,
        height: Dim.height,
    },
    ranger: {
        position: "absolute",
        zIndex: 0,
    },
    text: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        width: Dim.width,
        height: 0.8 * Dim.height,
    },
});

export default LandingScreen;