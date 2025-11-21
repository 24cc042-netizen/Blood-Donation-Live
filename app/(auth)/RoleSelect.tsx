import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RoleSelect() {
  const navigation: any = useNavigation();
  const roles = [
    { key: 'user', label: 'A Donor / Patient' },
    { key: 'hospital', label: 'Hospital' },
    { key: 'blood_bank', label: 'Blood Bank' },
    { key: 'lab', label: 'Blood Lab' }
  ];

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 16 }}>Who are you?</Text>
      {roles.map(r => (
        <TouchableOpacity
          key={r.key}
          onPress={() => navigation.navigate('PhoneAuth', { role: r.key })}
          style={{ width: '100%', padding: 16, backgroundColor: '#ef4444', marginBottom: 12, borderRadius: 8 }}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>{r.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
