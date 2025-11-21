import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import { auth, db } from '../../../lib/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import useInstitution from '../../../hooks/useInstitution';

export default function InventoryScreen() {
  const uid = auth.currentUser ? auth.currentUser.uid : null;
  const inst = useInstitution(uid);
  const [bloodType, setBloodType] = useState('O+');
  const [componentName, setComponentName] = useState('Whole Blood');
  const [units, setUnits] = useState('1');
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      if (!inst) return;
      try {
        const q = query(collection(db, `institutions/${inst.id}/inventory`));
        const snap = await getDocs(q);
        const arr: any[] = [];
        snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
        setItems(arr);
      } catch (e) { console.warn(e); }
    }
    load();
  }, [inst]);

  async function addItem() {
    if (!inst) { Alert.alert('No institution found'); return; }
    try {
      const ref = collection(db, `institutions/${inst.id}/inventory`);
      const payload = { bloodType, component: componentName, units: Number(units), expiryDate: null, institutionId: inst.id, institutionName: inst.name, contactPhone: inst.contactPhone };
      await addDoc(ref, payload);
      Alert.alert('Added');
      setUnits('1');
    } catch (e) { console.warn(e); Alert.alert('Failed to add'); }
  }

  async function removeItem(itemId: string) {
    try {
      await deleteDoc(doc(db, `institutions/${inst.id}/inventory/${itemId}`));
      setItems(items.filter(i => i.id !== itemId));
    } catch (e) { console.warn(e); }
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 18 }}>Manage Inventory</Text>
      <TextInput value={bloodType} onChangeText={setBloodType} style={{ borderWidth: 1, padding: 8, marginTop: 8 }} />
      <TextInput value={componentName} onChangeText={setComponentName} style={{ borderWidth: 1, padding: 8, marginTop: 8 }} />
      <TextInput value={units} onChangeText={setUnits} keyboardType="number-pad" style={{ borderWidth: 1, padding: 8, marginTop: 8 }} />
      <View style={{ height: 8 }} />
      <Button title="Add Item" onPress={addItem} />

      <FlatList data={items} keyExtractor={i => i.id} renderItem={({ item }) => (
        <View style={{ padding: 8, borderBottomWidth: 1 }}>
          <Text>{item.bloodType} • {item.component} • {item.units} units</Text>
          <Button title="Remove" onPress={() => removeItem(item.id)} />
        </View>
      )} />
    </View>
  );
}
