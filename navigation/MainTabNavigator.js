import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
// import { View, Text, StyleSheet } from 'react-native';

// ============================================
// 🔵 Mayra's SCREENS - Product & Cart Screens
// ============================================
import HomeScreen from '../screens/products/HomeScreen';
import ProductDetailScreen from '../screens/products/ProductDetailScreen';
import CartScreen from '../screens/products/CartScreen';
import CheckoutScreen from '../screens/products/CheckoutScreen';
import ConfirmationScreen from '../screens/products/ConfirmationScreen';

// ============================================
// 🟢 Hadeel's SCREENS - Profile & Account Screens
// ============================================
import ProfileScreen from '../profile/ProfileScreen';
import AddressManagementScreen from '../profile/AddressManagementScreen';
import OrderHistoryScreen from '../profile/OrderHistoryScreen';
import PaymentMethodsScreen from '../profile/PaymentMethodsScreen';
import AboutScreen from '../screens/static/AboutScreen';
import HelpScreen from '../screens/static/HelpScreen';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack (Products + Product Details)
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFB823' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="ProductListing" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
}

// Cart Stack (Cart + Checkout + Confirmation)
function CartStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFB823' },   
        headerTintColor: '#2D4F2B',                  
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="CartView" 
        component={CartScreen}
        options={{ title: 'Shopping Cart' }}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
      <Stack.Screen 
        name="Confirmation" 
        component={ConfirmationScreen}
        options={{ 
          title: 'Order Confirmed',
          headerLeft: () => null, // Prevent going back
        }}
      />
    </Stack.Navigator>
  );
}

// Profile Stack (Profile + Address + Orders + Payment)
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFB823' },   
        headerTintColor: '#2D4F2B',                  
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
      <Stack.Screen 
        name="AddressManagement" 
        component={AddressManagementScreen}
        options={{ title: 'My Addresses' }}
      />
      <Stack.Screen 
        name="OrderHistory" 
        component={OrderHistoryScreen}
        options={{ title: 'Order History' }}
      />
      <Stack.Screen 
        name="PaymentMethods" 
        component={PaymentMethodsScreen}
        options={{ title: 'Payment Methods' }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
        options={{ title: 'About' }}
        />

        <Stack.Screen 
        name="Help" 
        component={HelpScreen}
        options={{ title: 'Help & Support' }}
        />
    </Stack.Navigator>
  );
}



// Main Tab Navigator
export default function MainTabNavigator() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

    return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFB823',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{ title: 'Products' }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartStack}
        options={{ 
          title: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : null,
          tabBarBadgeStyle: {
            backgroundColor: '#2D4F2B',
            color: '#fff',
          },
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}