import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentMethodsScreen() {
  const [selectedMethod, setSelectedMethod] = useState('credit-card');

  const paymentMethods = [
    {
      id: 'credit-card',
      name: 'Credit Card',
      icon: 'card-outline',
      description: 'Visa, Mastercard, Amex',
      color: '#007AFF',
    },
    {
      id: 'debit-card',
      name: 'Debit Card',
      icon: 'card-outline',
      description: 'Direct bank payment',
      color: '#10B981',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'logo-paypal',
      description: 'Pay with PayPal account',
      color: '#0070BA',
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      icon: 'logo-apple',
      description: 'Quick payment with Apple Pay',
      color: '#000',
    },
    // {
    //   id: 'google-pay',
    //   name: 'Google Pay',
    //   icon: 'logo-google',
    //   description: 'Quick payment with Google Pay',
    //   color: '#4285F4',
    // },
    {
      id: 'cash',
      name: 'Cash on Delivery',
      icon: 'cash-outline',
      description: 'Pay when you receive',
      color: '#F59E0B',
    },
  ];

  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
    Alert.alert(
      'Payment Method Selected',
      `You selected ${paymentMethods.find(m => m.id === methodId)?.name}`,
      [{ text: 'OK' }]
    );
  };

  const handleSave = () => {
    Alert.alert(
      'Saved',
      `${paymentMethods.find(m => m.id === selectedMethod)?.name} set as your preferred payment method`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={24} color="#2D4F2B" />
          <Text style={styles.infoText}>
            This is a dummy feature. No actual payment processing is implemented.
          </Text>
        </View>

        {/* Current Selection */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          <Text style={styles.sectionSubtitle}>Choose your preferred payment option</Text>
        </View>

        {/* Payment Methods List */}
        <View style={styles.methodsContainer}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected,
              ]}
              onPress={() => handleSelectMethod(method.id)}
              activeOpacity={0.7}
            >
              <View style={styles.methodLeft}>
                <View style={[styles.iconContainer, { backgroundColor: method.color + '15' }]}>
                  <Ionicons name={method.icon} size={28} color={method.color} />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodDescription}>{method.description}</Text>
                </View>
              </View>

              <View style={styles.radioButton}>
                {selectedMethod === method.id ? (
                  <View style={styles.radioButtonSelected}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                ) : (
                  <View style={styles.radioButtonUnselected} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Security Info */}
        <View style={styles.securitySection}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
          <Text style={styles.securityText}>
            All transactions are secure and encrypted
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Why choose our payment system?</Text>
          
          <View style={styles.featureItem}>
            <Ionicons name="lock-closed" size={20} color="#2D4F2B" />
            <Text style={styles.featureText}>Secure 256-bit SSL encryption</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="time" size={20} color="#2D4F2B" />
            <Text style={styles.featureText}>Instant payment confirmation</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="card" size={20} color="#2D4F2B" />
            <Text style={styles.featureText}>All major cards accepted</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={20} color="#2D4F2B" />
            <Text style={styles.featureText}>Buyer protection guarantee</Text>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Preference</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef9ebff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#2D4F2B',
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  methodsContainer: {
    paddingHorizontal: 16,
  },
  methodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  methodCardSelected: {
    borderColor: '#2D4F2B',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 13,
    color: '#999',
  },
  radioButton: {
    marginLeft: 12,
  },
  radioButtonUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  radioButtonSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#708A58',
    justifyContent: 'center',
    alignItems: 'center',
  },
  securitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  securityText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  featuresSection: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 16,
  },
  saveButton: {
    backgroundColor: '#2D4F2B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});