import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export default function AddressManagementScreen({ navigation }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    label: '', // e.g., "Home", "Work", "Office"
    fullName: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    province: '',
    zipCode: '',
    country: '',
    isDefault: false,
  });

  // Fetch addresses from Firestore
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const userId = auth.currentUser.uid;
      const addressesRef = collection(db, 'users', userId, 'addresses');
      const querySnapshot = await getDocs(query(addressesRef));
      
      const fetchedAddresses = [];
      querySnapshot.forEach((doc) => {
        fetchedAddresses.push({ id: doc.id, ...doc.data() });
      });
      
      setAddresses(fetchedAddresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      Alert.alert('Error', 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      label: '',
      fullName: '',
      phoneNumber: '',
      streetAddress: '',
      city: '',
      province: '',
      zipCode: '',
      country: '',
      isDefault: false,
    });
    setEditingAddress(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      streetAddress: address.streetAddress,
      city: address.city,
      province: address.province,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault || false,
    });
    setModalVisible(true);
  };

  const validateForm = () => {
    if (!formData.label.trim()) {
      Alert.alert('Validation Error', 'Please enter an address label (e.g., Home, Work)');
      return false;
    }
    if (!formData.fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter your phone number');
      return false;
    }
    if (!formData.streetAddress.trim()) {
      Alert.alert('Validation Error', 'Please enter your street address');
      return false;
    }
    if (!formData.city.trim()) {
      Alert.alert('Validation Error', 'Please enter your city');
      return false;
    }
    if (!formData.zipCode.trim()) {
      Alert.alert('Validation Error', 'Please enter your ZIP code');
      return false;
    }
    return true;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    try {
      const userId = auth.currentUser.uid;
      const addressesRef = collection(db, 'users', userId, 'addresses');

      // If setting as default, remove default from other addresses
      if (formData.isDefault) {
        const querySnapshot = await getDocs(query(addressesRef));
        const updatePromises = [];
        querySnapshot.forEach((document) => {
          if (document.data().isDefault) {
            updatePromises.push(
              updateDoc(doc(db, 'users', userId, 'addresses', document.id), {
                isDefault: false,
              })
            );
          }
        });
        await Promise.all(updatePromises);
      }

      if (editingAddress) {
        // Update existing address
        await updateDoc(doc(db, 'users', userId, 'addresses', editingAddress.id), formData);
        Alert.alert('Success', 'Address updated successfully');
      } else {
        // Add new address
        await addDoc(addressesRef, {
          ...formData,
          createdAt: new Date().toISOString(),
        });
        Alert.alert('Success', 'Address added successfully');
      }

      setModalVisible(false);
      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address');
    }
  };

  const handleDeleteAddress = (address) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const userId = auth.currentUser.uid;
              await deleteDoc(doc(db, 'users', userId, 'addresses', address.id));
              Alert.alert('Success', 'Address deleted successfully');
              fetchAddresses();
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Error', 'Failed to delete address');
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (address) => {
    try {
      const userId = auth.currentUser.uid;
      const addressesRef = collection(db, 'users', userId, 'addresses');

      // Remove default from all addresses
      const querySnapshot = await getDocs(query(addressesRef));
      const updatePromises = [];
      querySnapshot.forEach((document) => {
        updatePromises.push(
          updateDoc(doc(db, 'users', userId, 'addresses', document.id), {
            isDefault: false,
          })
        );
      });
      await Promise.all(updatePromises);

      // Set this address as default
      await updateDoc(doc(db, 'users', userId, 'addresses', address.id), {
        isDefault: true,
      });

      Alert.alert('Success', 'Default address updated');
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      Alert.alert('Error', 'Failed to set default address');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No addresses saved</Text>
            <Text style={styles.emptySubtext}>Add your first delivery address</Text>
          </View>
        ) : (
          addresses.map((address) => (
            <View key={address.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <View style={styles.labelContainer}>
                  <Text style={styles.addressLabel}>{address.label}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                    </View>
                  )}
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditModal(address)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteAddress(address)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.addressName}>{address.fullName}</Text>
              <Text style={styles.addressText}>{address.streetAddress}</Text>
              <Text style={styles.addressText}>
                {address.city}, {address.province} {address.zipCode}
              </Text>
              {address.country && (
                <Text style={styles.addressText}>{address.country}</Text>
              )}
              <View style={styles.phoneContainer}>
                <Ionicons name="call-outline" size={16} color="#666" />
                <Text style={styles.addressPhone}>{address.phoneNumber}</Text>
              </View>

              {!address.isDefault && (
                <TouchableOpacity
                  style={styles.setDefaultButton}
                  onPress={() => handleSetDefault(address)}
                >
                  <Text style={styles.setDefaultText}>Set as Default</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Ionicons name="add" size={24} color="#fff" style={styles.addIcon} />
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>

      {/* Add/Edit Address Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Address Label *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Home, Work, Office"
              value={formData.label}
              onChangeText={(text) => setFormData({ ...formData, label: text })}
            />

            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            />

            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Street Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter street address"
              value={formData.streetAddress}
              onChangeText={(text) => setFormData({ ...formData, streetAddress: text })}
            />

            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>City *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  value={formData.city}
                  onChangeText={(text) => setFormData({ ...formData, city: text })}
                />
              </View>

              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Province</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Province"
                  value={formData.province}
                  onChangeText={(text) => setFormData({ ...formData, province: text })}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>ZIP Code *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ZIP"
                  value={formData.zipCode}
                  onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
                  keyboardType="default"
                />
              </View>

              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Country</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Country"
                  value={formData.country}
                  onChangeText={(text) => setFormData({ ...formData, country: text })}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
            >
              <View style={[styles.checkbox, formData.isDefault && styles.checkboxChecked]}>
                {formData.isDefault && (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Set as default address</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
              <Text style={styles.saveButtonText}>
                {editingAddress ? 'Update Address' : 'Save Address'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
  scrollView: {
    flex: 1,
    padding: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D4F2B', // dark green
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#708A58', // olive
  },

  addressCard: {
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

  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  addressLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D4F2B', // dark green
    marginRight: 8,
  },

  defaultBadge: {
    backgroundColor: '#FFB823', // gold
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },

  defaultBadgeText: {
    color: '#2D4F2B', // dark green
    fontSize: 10,
    fontWeight: 'bold',
  },

  actionButtons: {
    flexDirection: 'row',
  },

  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },

  editButtonText: {
    color: '#2D4F2B', // dark green
    fontSize: 14,
    fontWeight: '600',
  },

  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  deleteButtonText: {
    color: '#FF3B30', // keep red for delete
    fontSize: 14,
    fontWeight: '600',
  },

  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D4F2B',
    marginBottom: 4,
  },

  addressText: {
    fontSize: 14,
    color: '#708A58', // olive
    marginBottom: 2,
  },

  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  addressPhone: {
    fontSize: 14,
    color: '#708A58', // olive
    marginLeft: 6,
  },

  setDefaultButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF7DD', // soft warm highlight
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  setDefaultText: {
    color: '#2D4F2B', // green
    fontSize: 14,
    fontWeight: '600',
  },

  addButton: {
    backgroundColor: '#2D4F2B', // green
    margin: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addIcon: {
    marginRight: 8,
  },

  addButtonText: {
    color: '#FFF1CA', // cream
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#f9fafb', // cream
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DAC17D', // soft gold line
    paddingTop: 60,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D4F2B', // green
  },

  modalContent: {
    flex: 1,
    padding: 16,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D4F2B',
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#DAC17D', // soft gold
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2D4F2B',
  },

  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  inputHalf: {
    width: '48%',
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#DAC17D', // gold border
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxChecked: {
    backgroundColor: '#2D4F2B', // dark green
    borderColor: '#2D4F2B',
  },

  checkboxLabel: {
    fontSize: 16,
    color: '#2D4F2B',
  },

  saveButton: {
    backgroundColor: '#2D4F2B', // green button
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },

  saveButtonText: {
    color: '#FFF1CA', // cream
    fontSize: 16,
    fontWeight: 'bold',
  },
});
