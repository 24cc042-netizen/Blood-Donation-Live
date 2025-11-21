import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AppHelloWorld() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, Expo World! 🎉</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 28,
    color: '#e11d48',
    fontWeight: 'bold',
  },
});
