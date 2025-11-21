import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { db } from '../../lib/firebase';
import { doc, setDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../../lib/firebase';
import * as Location from 'expo-location';

export default function ProfileSetup({ route, navigation }: any) {
  const { role, uid } = route.params || { role: 'user' };
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [instName, setInstName] = useState('');
  const [licenseId, setLicenseId] = useState('');

  async function saveProfile() {
    try {
      // Use provided uid (from OTP confirm) or current auth user
      const currentUid = uid || (auth.currentUser ? auth.currentUser.uid : null);
      if (!currentUid) throw new Error('User not signed in');

      const { coords } = await Location.getCurrentPositionAsync({});

      if (role === 'user') {
        const userDoc = doc(db, 'users', currentUid);
        await setDoc(userDoc, {
          fullName,
          email,
          bloodType,
          role,
          location: { latitude: coords.latitude, longitude: coords.longitude },
          isAvailableToDonate: true,
          lastDonationDate: null
        });
        Alert.alert('Saved', 'Profile saved.');
        navigation.replace('MainTabs', { role });
        return;
      }

      // Institution registration (hospital, bank, lab)
      const instRef = collection(db, 'institutions');
      const data = {
        name: instName,
        verificationId: licenseId,
        contactEmail: email,
        contactPhone: auth.currentUser ? auth.currentUser.phoneNumber : '',
        address: '',
        location: { latitude: coords.latitude, longitude: coords.longitude },
        isVerified: false,
        type: role,
        ownerUid: currentUid
      };
      const docRef = await addDoc(instRef, data);
      // create a minimal users/{uid} entry as well
      await setDoc(doc(db, 'users', currentUid), { fullName, email, role, ownerOf: docRef.id });
      Alert.alert('Registered', 'Institution registered. Await verification.');
      navigation.replace('MainTabs', { role });
    } catch (err: any) {
      console.warn('Profile save failed', err);
      Alert.alert('Error', err.message || 'Failed to save profile');
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Complete your profile ({role})</Text>
      <TextInput placeholder="Full name" value={fullName} onChangeText={setFullName} style={{ borderWidth: 1, padding: 10, marginBottom: 12 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 10, marginBottom: 12 }} />
      {role === 'user' ? (
        <TextInput placeholder="Blood Type" value={bloodType} onChangeText={setBloodType} style={{ borderWidth: 1, padding: 10, marginBottom: 12 }} />
      ) : (
        <>
          <TextInput placeholder="Institution Name" value={instName} onChangeText={setInstName} style={{ borderWidth: 1, padding: 10, marginBottom: 12 }} />
          <TextInput placeholder="License / Registration ID" value={licenseId} onChangeText={setLicenseId} style={{ borderWidth: 1, padding: 10, marginBottom: 12 }} />
        </>
      )}
      <Button title="Save" onPress={saveProfile} />
    </View>
  );
}
