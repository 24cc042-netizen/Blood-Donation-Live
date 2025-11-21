import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { auth, db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import useInstitution from '../../../hooks/useInstitution';

export default function RequestsScreen() {
  const uid = auth.currentUser ? auth.currentUser.uid : null;
  const inst = useInstitution(uid);
  const [bloodType, setBloodType] = useState('O-');
  const [component, setComponent] = useState('Platelets');
  const [units, setUnits] = useState('1');
  const [urgency, setUrgency] = useState('critical');

  async function postRequest() {
    if (!inst) { Alert.alert('No institution found'); return; }
    if (!inst.isVerified) { Alert.alert('Not Verified', 'Your institution is not verified yet. You cannot post urgent requests.'); return; }
    try {
      const ref = collection(db, 'bloodRequests');
      await addDoc(ref, {
        institutionId: inst.id,
        institutionName: inst.name,
        bloodType,
        component,
        unitsNeeded: Number(units),
        urgency,
        status: 'open',
        createdAt: new Date(),
        location: inst.location
      });
      Alert.alert('Posted', 'Urgent request posted.');
    } catch (e) { console.warn(e); Alert.alert('Failed', 'Could not post request'); }
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 18 }}>Post Urgent Request</Text>
      <TextInput value={bloodType} onChangeText={setBloodType} style={{ borderWidth: 1, padding: 8, marginTop: 8 }} />
      <TextInput value={component} onChangeText={setComponent} style={{ borderWidth: 1, padding: 8, marginTop: 8 }} />
      <TextInput value={units} onChangeText={setUnits} keyboardType="number-pad" style={{ borderWidth: 1, padding: 8, marginTop: 8 }} />
      <TextInput value={urgency} onChangeText={setUrgency} style={{ borderWidth: 1, padding: 8, marginTop: 8 }} />
      <View style={{ height: 8 }} />
      <Button title="Post Request" onPress={postRequest} />
    </View>
  );
}
