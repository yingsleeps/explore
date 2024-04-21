import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useFonts } from 'expo-font';
import { Colors } from "../Constants.js";

import HomeScreen from '../screens/Home';
import LoadingScreen from '../components/Loading.js';
import ProfileScreen from '../screens/Profile.js';

const Tab = createBottomTabNavigator();

export default function NavBar() {
  const [fontsLoaded, fontError] = useFonts({
    'RubikBubbles': require('../../assets/fonts/RubikBubbles.ttf'),
  });

  if (!fontsLoaded && !fontError) {
    return <LoadingScreen/>;
  }

  return (
      <Tab.Navigator 
        screenOptions={{ 
          headerShown: false,
          tabBarStyle: { 
            position: 'absolute',
            bottom: 25,
            left: 60,
            right: 60,
            elevation: 0,
            borderRadius: 30,
            height: 60,
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.38,
            shadowRadius: 10.0,
          }, 
          tabBarShowLabel: false,
        }}>
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                focused ? (
                  <View style={styles.focused_profile}> 
                    <Image 
                      resizeMode='contain'
                      source={require("../../assets/profile_icon.png")}
                    />
                    <Text style={styles.text}>Ranger</Text>
                  </View>
                  
                ) : (
                  <View style={styles.icon_container}> 
                    <Image 
                      resizeMode='contain'
                      source={require("../../assets/profile_icon.png")}
                    />
                    
                  </View>
                )
              );
            },
          }}
        />
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                focused ? (
                  <View style={styles.focused_quest}> 
                    <Image 
                      resizeMode='contain'
                      source={require("../../assets/explore_icon.png")}
                    />
                    <Text style={styles.text}>Quest</Text>
                  </View>
                  
                ) : (
                  <View style={styles.icon_container}> 
                    <Image 
                      resizeMode='contain'
                      source={require("../../assets/explore_icon.png")}
                    />
                    
                  </View>
                )
              );
            },
          }}
        />
      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'left',
    top: 15,
  },
  focused_quest: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'left',
    top: 15,
    right: 10,
    backgroundColor: Colors.brown,
    margin: -8,
    paddingHorizontal: 13,
    borderRadius: 30
  },
  focused_profile: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'left',
    top: 15,
    left: 15,
    backgroundColor: Colors.yellow,
    margin: -8,
    paddingHorizontal: 13,
    borderRadius: 30
  },
  text: {
    fontFamily: "RubikBubbles",
    fontSize: 25,
    left: 3,
    color: "white", 
  }
});
