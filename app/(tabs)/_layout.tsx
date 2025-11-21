import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserHome from './(user)/index';

const Tab = createBottomTabNavigator();

export default function MainTabs({ route }: any) {
  const { role } = route.params || { role: 'user' };

  return (
    <Tab.Navigator>
      {role === 'user' && (
        <Tab.Screen name="UserHome" component={UserHome} options={{ title: 'Home' }} />
      )}
      {role !== 'user' && (
        <Tab.Screen name="InstHome" component={UserHome} options={{ title: 'Dashboard' }} />
      )}
    </Tab.Navigator>
  );
}
