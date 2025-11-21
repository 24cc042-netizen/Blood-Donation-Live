import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: '600', marginBottom: 16, color: '#1f2937' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#d1d5db', padding: 12, marginBottom: 12, borderRadius: 6, fontSize: 14 },
  card: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: '#fff' },
  cardTitle: { fontWeight: '600', fontSize: 14, color: '#1f2937', marginBottom: 4 },
  cardText: { fontSize: 13, color: '#6b7280', marginBottom: 2 },
  button: { backgroundColor: '#ef4444', padding: 12, borderRadius: 6, marginBottom: 12, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});

// Mock data
const mockInstitutions = [
  { id: '1', name: 'City General Hospital', bloodType: 'O-', component: 'Whole Blood', units: 12, phone: '+1 555-0100' },
  { id: '2', name: 'Red Cross Blood Bank', bloodType: 'O-', component: 'Platelets', units: 8, phone: '+1 555-0200' },
  { id: '3', name: 'Central Blood Lab', bloodType: 'A+', component: 'Plasma', units: 5, phone: '+1 555-0300' },
  { id: '4', name: 'Emergency Care Hospital', bloodType: 'B+', component: 'Whole Blood', units: 15, phone: '+1 555-0400' },
];

export default function FindScreen() {
  const [bloodType, setBloodType] = useState('O-');
  const [component, setComponent] = useState('All');
  const [results, setResults] = useState(mockInstitutions);

  const handleSearch = () => {
    const filtered = mockInstitutions.filter(
      item => item.bloodType === bloodType && (component === 'All' || item.component === component)
    );
    setResults(filtered);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔍 Find Blood & Platelets</Text>

      <Text style={styles.label}>Blood Type</Text>
      <TextInput
        style={styles.input}
        placeholder="O-, A+, B-, AB+, etc."
        value={bloodType}
        onChangeText={setBloodType}
      />

      <Text style={styles.label}>Component</Text>
      <TextInput
        style={styles.input}
        placeholder="All, Whole Blood, Platelets, Plasma"
        value={component}
        onChangeText={setComponent}
      />

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Results ({results.length})</Text>

      <FlatList
        scrollEnabled={false}
        data={results}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardText}>{item.bloodType} • {item.component} • {item.units} units</Text>
            <TouchableOpacity onPress={() => Alert.alert('Contact', `Call ${item.phone}`)}>
              <Text style={{ color: '#0066cc', marginTop: 8, fontWeight: '600', fontSize: 13 }}>📞 {item.phone}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
