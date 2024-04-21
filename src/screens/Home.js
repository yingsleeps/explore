import { SafeAreaView, StyleSheet, Text, View, Image, Button } from 'react-native';
import { Colors } from '../Constants.js' 
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import axios from 'axios';

import MapView, { PROVIDER_GOOGLE, Polygon, Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import GrahamScan from 'graham_scan';
// import Button from '../components/Button.js';
// import {Dim} from '../Constants.js'

import { fetchLandmarks, fetchPrompt } from '../api'; 
import Popup from '../components/Popup';

const MarkerItem = memo(({ detail, onPress }) => (
    <Marker
        coordinate={{ latitude: detail.latitude, longitude: detail.longitude }}
        title={detail.name}
        onPress={() => onPress(detail)}
    >
        <Image
            source={require('../../assets/place_icon.png')}
            style={{ width: 60, height: 60 }}
            resizeMode="cover"
        />
    </Marker>
));

export default function HomeScreen() {    
    const [camera, setCamera] = useState({
        center: {
            latitude: 34.0702,
            longitude: -118.4467,
        },
        pitch: 45,
        heading: 0,
        altitude: 0,
        zoom: 18
    });

    const mapRef = useRef(null);
    const [points, setPoints] = useState([]);
    const [hullPoints, setHullPoints] = useState([]);
    const [places, setPlaces] = useState([]);

    const [lockModeEnabled, setLockModeEnabled] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentQuest, setCurrentQuest] = useState('');
//     useEffect(() => {
//         let lastPosition = { latitude: null, longitude: null };

//         const watchId = Geolocation.watchPosition(
//             (pos) => {
//                 const { latitude, longitude } = pos.coords;
//                 const newPosition = {latitude, longitude};
//                 const newRectangle = getRectanglePoints({ latitude, longitude });

//                 // if (getDistance(lastPosition.latitude, lastPosition.longitude, latitude, longitude) > 2) { // meters
//                 //     const newHeading = lastPosition.latitude ? calculateBearing(
//                 //         lastPosition.latitude,
//                 //         lastPosition.longitude,
//                 //         latitude,
//                 //         longitude
//                 //     ) : camera.heading;
    
//                 //     const newCamera = {
//                 //         ...camera,
//                 //         center: newPosition,
//                 //         heading: newHeading  // maintain the old heading initially
//                 //     };
//                 //     setCamera(newCamera);

//                 //     // Animate camera smoothly to the new position and heading
//                 //     if (mapRef.current) {
//                 //         mapRef.current.animateCamera(newCamera, { duration: 1000 });
//                 //     }
//                 // }

//                 // if (camera.pitch != 45) {
//                 //     setCamera(prevCamera => ({
//                 //         ...prevCamera,
//                 //         pitch: 45
//                 //     }));
//                 // }

                if (lockModeEnabled) {
                    const newHeading = lastPosition.latitude ? calculateBearing(
                        lastPosition.latitude,
                        lastPosition.longitude,
                        latitude,
                        longitude
                    ) : camera.heading;
    
                    const newCamera = {
                        ...camera,
                        center: newPosition,
                        heading: newHeading  // maintain the old heading initially
                    };
    
                    setCamera(newCamera);
    
                    // Animate camera smoothly to the new position and heading
                    if (mapRef.current) {
                        mapRef.current.animateCamera(newCamera, { duration: 1000 });
                    }
                }


                fetchLandmarks(latitude, longitude).then(data => {
                    setPlaces(data);
                });
                // getPlaceDetailsByCoordinates(latitude, longitude)
                //     .then(place => setPlaces(currentPlaces => [...currentPlaces, {
                //         ...place,
                //         latitude, longitude
                //     }]))
                //     .catch(error => console.error('Error fetching place details:', error));
                
//                 // setPlaces([...places, {latitude, longitude}])


                if (isPointOutsideHull(newPosition, hullPoints)) {
                    const newPoints = [...points, ...newRectangle];
                    setPoints(newPoints);
                    updateHull(newPoints);
                }

                lastPosition = newPosition;
            },
            (error) => console.log(error),
            { enableHighAccuracy: true, distanceFilter: 1 }
        );

        return () => Geolocation.clearWatch(watchId);
    }, [hullPoints, lockModeEnabled]);

//     function calculateBearing(startLat, startLng, destLat, destLng) {
//         startLat = degreesToRadians(startLat);
//         startLng = degreesToRadians(startLng);
//         destLat = degreesToRadians(destLat);
//         destLng = degreesToRadians(destLng);
    
//         const y = Math.sin(destLng - startLng) * Math.cos(destLat);
//         const x = Math.cos(startLat) * Math.sin(destLat) -
//                   Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
//         const bearing = Math.atan2(y, x);
//         return radiansToDegrees(bearing);
//     }
    
//     function degreesToRadians(degrees) {
//         return degrees * (Math.PI / 180);
//     }
    
//     function radiansToDegrees(radians) {
//         return radians * (180 / Math.PI);
//     }

//     // Returns rectangle buffer around location
//     function getRectanglePoints(center, size = 0.0005) {
//         const { latitude, longitude } = center;
//         return [
//             { latitude: latitude + size, longitude: longitude + size },
//             { latitude: latitude - size, longitude: longitude + size },
//             { latitude: latitude - size, longitude: longitude - size },
//             { latitude: latitude + size, longitude: longitude - size },
//         ];
//     }

//     // Checks if current location is outside visited polygon
//     function isPointOutsideHull(point, hullPoints) {
//         const x = point.longitude, y = point.latitude;
//         let isInside = false;
//         for (let i = 0, j = hullPoints.length - 1; i < hullPoints.length; j = i++) {
//             const xi = hullPoints[i].longitude, yi = hullPoints[i].latitude;
//             const xj = hullPoints[j].longitude, yj = hullPoints[j].latitude;
    
//             const intersect = ((yi > y) !== (yj > y))
//                 && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
//             if (intersect) isInside = !isInside;
//         }
//         return !isInside;
//     }
    
//     // Updates visited polygon
//     function updateHull(points) {
//         const convexHull = new GrahamScan();
//         points.forEach(point => {
//             convexHull.addPoint(point.latitude, point.longitude);
//         });
//         const hull = convexHull.getHull().map(h => ({ latitude: h.x, longitude: h.y }));
//         setHullPoints(hull);
//     }

    function renderMarkers() {
        return places.map((place, index) => (
            <MarkerItem key={index} detail={place} onPress={handleMarkerPress} />
        ))
    }

    const handleMarkerPress = async (landmark) => {
        try {
            const prompt = await fetchPrompt(landmark);
            setCurrentQuest(prompt); 
            setModalVisible(true); 
        } catch (error) {
            console.error("Error in fetching prompt:", error);
            alert("Failed to fetch prompt. See console for details.");
        }
    };
    
    return (
        <View style={styles.container}>  
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialCamera={camera}
                showsUserLocation={true}
                showsMyLocationButton={!lockModeEnabled}
                showsBuildings={true}
                followsUserLocation={lockModeEnabled}
                showsCompass={!lockModeEnabled}
                scrollEnabled={!lockModeEnabled}
                pitchEnabled={!lockModeEnabled}
                rotateEnabled={true}
                zoomEnabled={true}
            >
                {hullPoints.length > 0 && (
                    <Polygon
                        coordinates={hullPoints}
                        strokeColor="#ADD8E6"  // outline color
                        fillColor="rgba(0, 0, 255, 0.2)"  // semi-transparent blue fill
                        strokeWidth={1}
                    />
                )}
                {renderMarkers()}
            </MapView>
            <View style={styles.buttonContainer}>
                <Button
                    title={lockModeEnabled ? "Unlock Camera" : "Lock Camera"}
                    onPress={() => setLockModeEnabled(!lockModeEnabled)}
                    color="#841584"
                />
            </View>
            <Popup visible={modalVisible} setVisible={setModalVisible} quest={currentQuest} />
            <StatusBar style="auto" />
        </View>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         ...StyleSheet.absoluteFillObject,
//         flex: 1,  // Make the view 100% of screen
//         justifyContent: 'center',
//         alignItems: 'center',
//     },

    map: {
        ...StyleSheet.absoluteFillObject
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 100,
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: 100,
        padding: 10,
    },
});


// [HULL UPDATE IS SOMEHOW WRONG]
// useEffect(() => {
//     (async () => {
//         try {
//             let { status } = await Location.requestForegroundPermissionsAsync();
//             if (status !== 'granted') {
//                 console.error('Permission to access location was denied');
//                 return;
//             }

//             Location.watchPositionAsync({
//                 accuracy: Location.Accuracy.BestForNavigation,
//                 timeInterval: 5000,
//                 distanceInterval: 1,
//             }, (location) => {
//                 const { latitude, longitude } = location.coords;
//                 const newPosition = { latitude, longitude };
//                 const newRectangle = getRectanglePoints(newPosition);

//                 const newHeading = lastPosition.latitude ? calculateBearing(
//                     lastPosition.latitude,
//                     lastPosition.longitude,
//                     latitude,
//                     longitude
//                 ) : camera.heading;
        
//                 const newCamera = {
//                     ...camera,
//                     center: newPosition,
//                     heading: newHeading  // maintain the old heading initially
//                 };
        
//                 setCamera(newCamera);
        
//                 // Animate camera smoothly to the new position and heading
//                 if (mapRef.current) {
//                     mapRef.current.animateCamera(newCamera, { duration: 1000 });
//                 }
        
//                 if (isPointOutsideHull(newPosition, hullPoints)) {
//                     const newPoints = [...points, ...newRectangle];
//                     setPoints(newPoints);
//                     updateHull(newPoints);
//                 }

//                 lastPosition = newPosition;
        
//                 // getPlaceDetailsByCoordinates(latitude, longitude)
//                 //     .then(place => setPlaces(currentPlaces => [...currentPlaces, {
//                 //         ...place,
//                 //         latitude, longitude
//                 //     }]))
//                 //     .catch(error => console.error('Error fetching place details:', error));
                
//                 // setPlaces([...places, {latitude, longitude}])
//             });
//         } catch (error) {
//             console.error("Failed to start location tracking", error);
//         }

//         return () => subscription.remove();
//     })();
// }, [points, hullPoints]);
