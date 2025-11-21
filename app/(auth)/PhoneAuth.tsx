import React, { useRef, useState } from 'react';
import { View, TextInput, Button, Text, Platform } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { auth } from '../../lib/firebase';
import { signInWithPhoneNumber } from 'firebase/auth';

export default function PhoneAuth({ route, navigation }: any) {
  const { role } = route.params || { role: 'user' };
  const [phone, setPhone] = useState('');
  const recaptchaVerifier = useRef<any>(null);

  async function startPhoneAuth() {
    try {
      // expo-firebase-recaptcha provides a cross-platform recaptcha flow for Web and native when using Firebase Phone Auth
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaVerifier.current);
      // navigate to OTP confirm to enter the verification code
      navigation.navigate('OTPConfirm', { role, confirmation });
    } catch (err) {
      console.warn('Phone auth failed', err);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={{}} />
      <Text style={{ marginBottom: 8 }}>Signing in as: {role}</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="+1 555 555 5555"
        keyboardType="phone-pad"
        style={{ borderWidth: 1, padding: 12, borderRadius: 6, marginBottom: 12 }}
      />
      <Button title="Send OTP" onPress={startPhoneAuth} />
      <View style={{ height: 12 }} />
      <Text style={{ color: '#666', fontSize: 12 }}>Phone auth: uses expo-firebase-recaptcha. Replace firebaseConfig in the Recaptcha modal and implement confirmation flow in production.</Text>
    </View>
  );
}
