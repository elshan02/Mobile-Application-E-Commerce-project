import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HelpScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Help & Support</Text>

        <Text style={styles.question}>How do I place an order?</Text>
        <Text style={styles.answer}>
          Browse products → Add items to cart → Go to checkout → Choose address & payment → Place order.
        </Text>

        <Text style={styles.question}>How do I edit my addresses?</Text>
        <Text style={styles.answer}>
          Go to Profile → Address Management → Add, edit, delete, or set a default address.
        </Text>

        <Text style={styles.question}>Where can I see my past orders?</Text>
        <Text style={styles.answer}>
          Go to Profile → Order History to view your previous purchases.
        </Text>

        <Text style={styles.question}>How do I log out?</Text>
        <Text style={styles.answer}>
          In the Profile tab, scroll down and press the “Logout” button.
        </Text>

        <Text style={styles.footer}>If you need more help, contact support@click-pick.com</Text>
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
    marginBottom: 20,
  },
  question: {
    fontSize: 17,
    fontWeight: '600',
    color: '#708A58',
    marginTop: 15,
  },
  answer: {
    fontSize: 15,
    color: '#444',
    marginTop: 5,
    lineHeight: 22,
  },
  footer: {
    marginTop: 30,
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
  },
});
