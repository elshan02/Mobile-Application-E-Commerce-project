import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>About This App</Text>
        <Text style={styles.text}>
          Click & Pick is a modern mobile e-commerce application designed for a seamless shopping experience. 
          Users can browse products, manage their cart, save delivery addresses, and place orders securely.
        </Text>
        <Text style={styles.text}>
          This project was developed as part of the Mobile Applications course, showcasing skills in React Native, 
          Firebase Authentication, Firestore, and mobile UI/UX best practices.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <Text style={styles.listItem}>• User Authentication (Login & Register)</Text>
          <Text style={styles.listItem}>• Product Catalog with Search & Categories</Text>
          <Text style={styles.listItem}>• Shopping Cart & Checkout</Text>
          <Text style={styles.listItem}>• Address Management</Text>
          <Text style={styles.listItem}>• Order History</Text>
          <Text style={styles.listItem}>• Profile & Account Settings</Text>
        </View>

        <Text style={styles.footer}>Version 1.0.0 • © 2025 Click & Pick</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7DD',
  },
  card: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D4F2B',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 24,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#708A58',
    marginBottom: 8,
  },
  listItem: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 13,
    color: '#777',
  },
});
