import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HospitalDashboard({ navigation }: any) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Hospital Dashboard (scaffold)</Text>
      <Button title="Manage Inventory" onPress={() => navigation.navigate('Inventory')} />
    </View>
  );
}
