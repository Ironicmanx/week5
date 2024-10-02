
/*
Requirements for the app are as follows.
• Map is displayed.
• User’s location is retrieved, and map is opened at that location.
• User can add marker(s) by pressing map (longpress event), there is no need to
provide title or other information, or save markers (e.g. AsyncStorage).
*/


import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    (async () => { //async function to get the location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      console.log("Location retrieved:", loc.coords); 
      setLocation(loc.coords);
    })();
  }, []); 

  const handleLongPress = (event) => { // to add marker on long press
    const newMarker = {
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    };
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };

  const ifMarkerExistsDeleteItOnPress = (marker) => {
    setMarkers((prevMarkers) => prevMarkers.filter((m) => m !== marker)); // to delete marker on press
  }


  return (
    <>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0920,
            longitudeDelta: 0.0420,
          }}
          onLongPress={handleLongPress}
        >
          {markers.map((marker, index) => (
            <Marker 
              key={index}
              coordinate={marker}
              onPress={() => ifMarkerExistsDeleteItOnPress(marker)}
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Loading map...</Text>
        </View>
        
      )}
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
