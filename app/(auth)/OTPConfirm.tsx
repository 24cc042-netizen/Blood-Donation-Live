import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';

export default function OTPConfirm({ route, navigation }: any) {
  const { confirmation, role } = route.params || {};
  const [code, setCode] = useState('');

  async function confirmCode() {
    try {
      if (!confirmation) {
        Alert.alert('Error', 'No confirmation object found. Please restart phone auth.');
        return;
      }
      // confirmation.confirm is the standard web/compat method
      const result = await confirmation.confirm(code);
      // result.user is the signed-in user
      navigation.replace('ProfileSetup', { role, uid: result.user.uid });
    } catch (e: any) {
      console.warn('OTP confirmation failed', e);
      Alert.alert('OTP Error', e.message || 'Failed to confirm code');
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text style={{ marginBottom: 8 }}>Enter the verification code</Text>
      <TextInput value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="123456" style={{ borderWidth: 1, padding: 12, marginBottom: 12 }} />
      <Button title="Confirm" onPress={confirmCode} />
    </View>
  );
}
