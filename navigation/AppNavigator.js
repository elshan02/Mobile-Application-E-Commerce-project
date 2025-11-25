import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

// Main Tab Navigator
import MainTabNavigator from './MainTabNavigator';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// ============================================
// INTEGRATION: MainTabNavigator contains all screens
// - Home Tab: Product Catalog (Person 1)
// - Cart Tab: Shopping Cart (Person 1)  
// - Profile Tab: User Account (Person 2)
// ============================================

const MainApp = () => <MainTabNavigator />;

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  console.log('🚀 AppNavigator rendered!');
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    console.log('Setting up auth listener...');
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth State Changed:', currentUser ? 'User logged in' : 'No user');
      console.log('User details:', currentUser?.email);
      setUser(currentUser);
      if (initializing) setInitializing(false);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [initializing]);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        // User is logged in - Show main app
        <Stack.Navigator>
          <Stack.Screen 
            name="MainApp" 
            component={MainApp}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        // User is not logged in - Show auth screens
        <Stack.Navigator 
          screenOptions={{
            headerStyle: { backgroundColor: '#FFB823' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            headerShown: true,
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ 
              title: 'Create Account',
              headerBackTitle: 'Back'
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',

  },
});