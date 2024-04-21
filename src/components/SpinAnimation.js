import React, { useEffect, useRef } from 'react';
import Ranger from '../../assets/loader/ranger_icon.png';
import Loader from '../../assets/loader/loader.png';
import { Animated, View, StyleSheet, Image } from 'react-native';


const SpinAnimation = () => {
    const spinValue = useRef(new Animated.Value(0)).current; // Initial value for rotation

    useEffect(() => {
        Animated.loop(
            Animated.timing(
                spinValue,
                {
                    toValue: 1, // The final value of the rotation
                    duration: 2000, // Can adjust the speed
                    useNativeDriver: false // Uses native driver for better performance
                }
            )
        ).start();
    }, [spinValue]);

    // Interpolate beginning and end values
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'] // 0 degrees to 360 degrees
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
                <Image
                    source={Loader}
                />
            </Animated.View>
            <Image
                source={Ranger}
                style={{position: 'absolute'}}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SpinAnimation;