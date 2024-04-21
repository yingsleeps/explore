import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../Constants.js' 
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef } from "react";

import MapView, { PROVIDER_GOOGLE, Polygon, Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import GrahamScan from 'graham_scan';

import axios from 'axios';

const googleApiKey = 'YOUR_GOOGLE_PLACES_API_KEY';  // Replace with your actual API key

export default function App() {    
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

    const mapRef = useRef(camera);
    const [points, setPoints] = useState([]);
    const [hullPoints, setHullPoints] = useState([]);
    const [places, setPlaces] = useState([{ latitude: 34.0702, longitude: -118.4467 }]);

    useEffect(() => {
        let lastPosition = { latitude: null, longitude: null };

        const watchId = Geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const newPosition = {latitude, longitude};
                const newRectangle = getRectanglePoints({ latitude, longitude });

                // if (getDistance(lastPosition.latitude, lastPosition.longitude, latitude, longitude) > 10) { // meters
                //     const newHeading = calculateBearing(lastPosition.latitude, lastPosition.longitude, latitude, longitude);
                //     cameraRef.current.heading = newHeading;
                // }

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
                
                lastPosition = newPosition;

                // getPlaceDetailsByCoordinates(latitude, longitude)
                //     .then(place => setPlaces(currentPlaces => [...currentPlaces, {
                //         ...place,
                //         latitude, longitude
                //     }]))
                //     .catch(error => console.error('Error fetching place details:', error));
                
                // setPlaces([...places, {latitude, longitude}])

                if (isPointOutsideHull(newPosition, hullPoints)) {
                    const newPoints = [...points, ...newRectangle];
                    setPoints(newPoints);
                    updateHull(newPoints);
                }
            },
            (error) => console.log(error),
            { enableHighAccuracy: true, distanceFilter: 1 }
        );

        return () => Geolocation.clearWatch(watchId);
    }, [hullPoints]);

    function calculateBearing(startLat, startLng, destLat, destLng) {
        startLat = degreesToRadians(startLat);
        startLng = degreesToRadians(startLng);
        destLat = degreesToRadians(destLat);
        destLng = degreesToRadians(destLng);
    
        const y = Math.sin(destLng - startLng) * Math.cos(destLat);
        const x = Math.cos(startLat) * Math.sin(destLat) -
                  Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
        const bearing = Math.atan2(y, x);
        return radiansToDegrees(bearing);
    }
    
    function degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    function radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    // Returns rectangle buffer around location
    function getRectanglePoints(center, size = 0.0005) {
        const { latitude, longitude } = center;
        return [
            { latitude: latitude + size, longitude: longitude + size },
            { latitude: latitude - size, longitude: longitude + size },
            { latitude: latitude - size, longitude: longitude - size },
            { latitude: latitude + size, longitude: longitude - size },
        ];
    }

    // Checks if current location is outside visited polygon
    function isPointOutsideHull(point, hullPoints) {
        const x = point.longitude, y = point.latitude;
        let isInside = false;
        for (let i = 0, j = hullPoints.length - 1; i < hullPoints.length; j = i++) {
            const xi = hullPoints[i].longitude, yi = hullPoints[i].latitude;
            const xj = hullPoints[j].longitude, yj = hullPoints[j].latitude;
    
            const intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) isInside = !isInside;
        }
        return !isInside;
    }
    
    // Updates visited polygon
    function updateHull(points) {
        const convexHull = new GrahamScan();
        points.forEach(point => {
            convexHull.addPoint(point.latitude, point.longitude);
        });
        const hull = convexHull.getHull().map(h => ({ latitude: h.x, longitude: h.y }));
        setHullPoints(hull);
    }

    // function renderMarkers(places) {
    //     return places.map((place, index) => (
    //         <Marker
    //             key={index}
    //             coordinate={{ latitude: place.latitude, longitude: place.longitude }}
    //             title={place.name}
    //             description={`Rating: ${place.rating} (${place.user_ratings_total} reviews)`}
    //             onPress={() => handleMarkerPress(place)}
    //         >
    //             <Callout>
    //                 <View>
    //                     <Text>{place.name}</Text>
    //                     <Text>Rating: {place.rating} ({place.user_ratings_total} reviews)</Text>
    //                 </View>
    //             </Callout>
    //         </Marker>
    //     ))
    // }

    function renderMarkers(places) {
        return places.map((place, index) => (
            <Marker
                key={index}
                coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                onPress={() => handleMarkerPress(place)}
                title="Hello World"
                description="Welcome to UCLA."
            >
                <Callout>
                    <View>
                        <Text>{"HEY"}</Text>
                    </View>
                </Callout>
            </Marker>
        ));
    }

    // Returns place details given coordinates
    function getPlaceDetailsByCoordinates(latitude, longitude) {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=10&key=${googleApiKey}`;

        return axios.get(url).then(response => {
            const { results } = response.data;
            if (results.length > 0) {
                return results[0];  // returning the first result
            }
            throw new Error('No places found');
        }).catch(error => {
            console.error('Failed to fetch places', error);
            throw error;
        });
    }

    function handleMarkerPress(place) {
        console.log("Marker pressed");
        // console.log("Marker pressed", place);
        // Here, you can display a modal or navigate to a detail screen
        // Example: navigation.navigate('PlaceDetail', { place });
    }
    
    return (
        <View style={styles.container}>        
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialCamera={camera}
                // camera={camera}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsBuildings={true}
                followsUserLocation={true}
                showsCompass={true}
                scrollEnabled={true}
                zoomEnabled={true}
                pitchEnabled={true}
                rotateEnabled={true}
            >
                {hullPoints.length > 0 && (
                    <Polygon
                        coordinates={hullPoints}
                        strokeColor="#ADD8E6"  // outline color
                        fillColor="rgba(0, 0, 255, 0.2)"  // semi-transparent blue fill
                        strokeWidth={1}
                    />
                )}
                {renderMarkers(places)}
            </MapView>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,  // Make the view 100% of screen
        justifyContent: 'center',
        alignItems: 'center',
    },

    map: {
        ...StyleSheet.absoluteFillObject
    },
});
