import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function ConfirmationScreen({ route, navigation }) {
  const { orderNumber } = route.params;

  const handleContinueShopping = () => {
    // Navigate back to Home tab
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleViewOrders = () => {
    // Navigate to Profile tab > Order History
    navigation.navigate('Profile', {
      screen: 'OrderHistory',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.confirmationContainer}>
        <Text style={styles.checkmark}>✓</Text>
        <Text style={styles.confirmationTitle}>Order Confirmed!</Text>
        <Text style={styles.confirmationText}>
          Thank you for your purchase. Your order has been successfully placed.
        </Text>
        <View style={styles.orderNumberContainer}>
          <Text style={styles.orderNumberLabel}>Order Number</Text>
          <Text style={styles.orderNumber}>{orderNumber}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.viewOrdersButton}
          onPress={handleViewOrders}
        >
          <Text style={styles.viewOrdersButtonText}>View My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueShopping}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  checkmark: {
    fontSize: 80,
    color: '#2D4F2B',
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  confirmationText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  orderNumberContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  orderNumberLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#708A58',
    textAlign: 'center',
  },
  viewOrdersButton: {
    backgroundColor: '#FFB823',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
  },
  viewOrdersButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#2D4F2B',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});