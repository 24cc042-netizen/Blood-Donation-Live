import React from 'react';
import { View, Text, Linking } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function NearbyMap({ institutions = [] }: any) {
  const openDirections = (lat: number, lon: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    Linking.openURL(url);
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} provider={PROVIDER_GOOGLE} initialRegion={{ latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.1, longitudeDelta: 0.1 }}>
        {institutions.map((inst: any) => (
          <Marker key={inst.id} coordinate={{ latitude: inst.location.latitude, longitude: inst.location.longitude }} title={inst.name} description={inst.address} onCalloutPress={() => openDirections(inst.location.latitude, inst.location.longitude)} />
        ))}
      </MapView>
    </View>
  );
}
