import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#e11d48' },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  button: { padding: 12, backgroundColor: '#ef4444', marginBottom: 8, borderRadius: 6 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12, borderRadius: 6 },
  card: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  cardTitle: { fontWeight: '600', marginBottom: 4 },
});

export default function AppDemo() {
  const [screen, setScreen] = useState('roles');
  const [role, setRole] = useState('');
  const [bloodType, setBloodType] = useState('O-');
  const [searchResults, setSearchResults] = useState([
    { id: 1, name: 'City General Hospital', distance: '2.5 km', units: 5 },
    { id: 2, name: 'Red Cross Blood Bank', distance: '5.2 km', units: 8 },
    { id: 3, name: 'Central Blood Lab', distance: '3.1 km', units: 3 },
  ]);

  const roles = [
    { key: 'user', label: 'Donor / Patient' },
    { key: 'hospital', label: 'Hospital' },
    { key: 'bank', label: 'Blood Bank' },
    { key: 'lab', label: 'Blood Lab' },
  ];

  if (screen === 'roles') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>BloodConnect Demo</Text>
        <Text style={styles.subtitle}>Who are you?</Text>
        {roles.map(r => (
          <TouchableOpacity
            key={r.key}
            onPress={() => { setRole(r.key); setScreen(r.key === 'user' ? 'search' : 'dashboard'); }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{r.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  if (screen === 'search') {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setScreen('roles')} style={{ marginBottom: 12 }}>
          <Text style={{ color: '#0066cc' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Search Blood</Text>
        <TextInput
          placeholder="Search blood type (e.g., O-)"
          value={bloodType}
          onChangeText={setBloodType}
          style={styles.input}
        />
        <Text style={styles.subtitle}>Results:</Text>
        <FlatList
          scrollEnabled={true}
          data={searchResults}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text>{item.units} units • {item.distance}</Text>
              <Button title="Contact" onPress={() => alert('Call: +1 555 1234')} />
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setScreen('roles')} style={{ marginBottom: 12 }}>
        <Text style={{ color: '#0066cc' }}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{role.toUpperCase()} Dashboard</Text>
      <Button title="Manage Inventory" onPress={() => alert('Inventory management')} />
      <View style={{ height: 8 }} />
      <Button title="Post Request" onPress={() => alert('Post urgent blood request')} />
      <View style={{ height: 8 }} />
      <Button title="View Events" onPress={() => alert('Blood drives & events')} />
    </View>
  );
}
