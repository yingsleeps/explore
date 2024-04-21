import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, View, Image } from 'react-native';
import { useFonts } from 'expo-font';
import { Colors } from "./src/Constants.js";

import LoadingScreen from './src/components/Loading.js';

import NavBar from './src/navigation/NavBar.js';
import DrawScreen from './src/screens/Draw.js';
import AlbumScreen from './src/screens/Album.js';


const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'RubikBubbles': require('./assets/fonts/RubikBubbles.ttf'),
  });

  if (!fontsLoaded && !fontError) {
    return <LoadingScreen/>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
          screenOptions={{
              headerShown: false,
          }}
      >
          <Stack.Screen name="NavBar" component={NavBar} />
          <Stack.Screen
                name="Album"
                component={AlbumScreen}
                options={{ headerShown: false }}
          />
          <Stack.Screen
                name="Draw"
                component={DrawScreen}
                options={{ headerShown: false }}
          />
      </Stack.Navigator>
    </NavigationContainer>
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
