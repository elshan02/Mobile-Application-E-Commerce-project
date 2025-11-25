import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { collection, getDocs, query, addDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { useCart } from '../../context/CartContext';

export default function CheckoutScreen({ navigation }) {
  const { cart, getCartTotal, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const userId = auth.currentUser.uid;
      const addressesRef = collection(db, 'users', userId, 'addresses');
      const querySnapshot = await getDocs(query(addressesRef));
      
      const fetchedAddresses = [];
      querySnapshot.forEach((doc) => {
        fetchedAddresses.push({ id: doc.id, ...doc.data() });
      });
      
      setAddresses(fetchedAddresses);
      
      // Auto-select default address if exists
      const defaultAddr = fetchedAddresses.find(addr => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      } else if (fetchedAddresses.length > 0) {
        setSelectedAddress(fetchedAddresses[0]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      Alert.alert('Error', 'Failed to load addresses');
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }

    setPlacingOrder(true);

    try {
      const userId = auth.currentUser.uid;
      const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
      
      // Save order to Firestore
      await addDoc(collection(db, 'users', userId, 'orders'), {
        orderNumber,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: total,
        subtotal: subtotal,
        tax: tax,
        shipping: shipping,
        address: {
          label: selectedAddress.label,
          fullName: selectedAddress.fullName,
          streetAddress: selectedAddress.streetAddress,
          city: selectedAddress.city,
          province: selectedAddress.province,
          zipCode: selectedAddress.zipCode,
          phoneNumber: selectedAddress.phoneNumber,
        },
        paymentMethod: paymentMethod,
        status: 'Processing',
        createdAt: new Date(),
      });

      clearCart();
      navigation.navigate('Confirmation', { orderNumber });
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loadingAddresses) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.checkoutContainer}>
        {/* Shipping Address Section */}
        <View style={styles.checkoutSection}>
          <Text style={styles.checkoutSectionTitle}>Delivery Address</Text>
          
          {addresses.length === 0 ? (
            <View style={styles.noAddressContainer}>
              <Text style={styles.noAddressText}>No saved addresses</Text>
              <TouchableOpacity
                style={styles.addAddressButton}
                onPress={() => {
                  // Navigate to Profile > Address Management
                  Alert.alert(
                    'Add Address',
                    'Please add a delivery address from your Profile section',
                    [{ text: 'OK' }]
                  );
                }}
              >
                <Text style={styles.addAddressButtonText}>+ Add Address</Text>
              </TouchableOpacity>
            </View>
          ) : (
            addresses.map((address) => (
              <TouchableOpacity
                key={address.id}
                style={[
                  styles.addressCard,
                  selectedAddress?.id === address.id && styles.addressCardSelected
                ]}
                onPress={() => setSelectedAddress(address)}
              >
                <View style={styles.radioButton}>
                  {selectedAddress?.id === address.id ? (
                    <View style={styles.radioButtonSelected} />
                  ) : (
                    <View style={styles.radioButtonUnselected} />
                  )}
                </View>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressLabel}>
                    {address.label}
                    {address.isDefault && (
                      <Text style={styles.defaultBadge}> (Default)</Text>
                    )}
                  </Text>
                  <Text style={styles.addressName}>{address.fullName}</Text>
                  <Text style={styles.addressText}>{address.streetAddress}</Text>
                  <Text style={styles.addressText}>
                    {address.city}, {address.state} {address.zipCode}
                  </Text>
                  <Text style={styles.addressPhone}>{address.phoneNumber}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Payment Method Section */}
        <View style={styles.checkoutSection}>
          <Text style={styles.checkoutSectionTitle}>Payment Method</Text>
          {['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.paymentOption,
                paymentMethod === method && styles.paymentOptionSelected
              ]}
              onPress={() => setPaymentMethod(method)}
            >
              <View style={styles.radioButton}>
                {paymentMethod === method ? (
                  <View style={styles.radioButtonSelected} />
                ) : (
                  <View style={styles.radioButtonUnselected} />
                )}
              </View>
              <Text style={styles.paymentMethodText}>{method}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary Section */}
        <View style={styles.checkoutSection}>
          <Text style={styles.checkoutSectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (10%):</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping:</Text>
            <Text style={styles.summaryValue}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.summaryTotalLabel}>Total:</Text>
            <Text style={styles.summaryTotalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.confirmButton, placingOrder && styles.confirmButtonDisabled]}
          onPress={handleConfirmOrder}
          disabled={placingOrder || addresses.length === 0}
        >
          {placingOrder ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Place Order</Text>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutContainer: {
    flex: 1,
    padding: 16,
  },
  checkoutSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkoutSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  noAddressContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noAddressText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  addAddressButton: {
    backgroundColor: '#FFB823',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addAddressButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  addressCard: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 12,
  },
  addressCardSelected: {
    borderColor: '#708A58',
    backgroundColor: '#fff6dfbd',
  },
  radioButton: {
    marginRight: 12,
    marginTop: 2,
  },
  radioButtonUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  radioButtonSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 6,
    borderColor: '#708A58',
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  defaultBadge: {
    fontSize: 12,
    color: '#708A58',
  },
  addressName: {
    fontSize: 14,
    color: '#2D4F2B',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 8,
  },
  paymentOptionSelected: {
    borderColor: '#708A58',
    backgroundColor: '#fff6dfbd',
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    marginTop: 4,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#708A58',
  },
  bottomBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
  },
  confirmButton: {
    backgroundColor: '#2D4F2B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});