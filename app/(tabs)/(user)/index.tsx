import React from 'react';
import { View, Text, Button } from 'react-native';
import FindScreen from './find';
import MapScreen from './map';

export default function UserHome({ navigation }: any) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>User Dashboard (scaffold)</Text>
      <Button title="Find Blood" onPress={() => navigation.navigate('Find')} />
    </View>
  );
}
