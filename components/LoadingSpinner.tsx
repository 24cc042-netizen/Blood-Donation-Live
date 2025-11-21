import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function LoadingSpinner({ size = 'large' }: any) {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 12 }}>
      <ActivityIndicator size={size} color="#ef4444" />
    </View>
  );
}
