import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Platform } from 'react-native';
import axios from 'axios';

export default function AddItem() {
  const [item, setItem] = useState({
    name: '',
    category: '',
    quantity: '',
    purchaseDate: '',
    expirationDate: '',
  });

  const handleChange = (key: string, value: string) => {
    setItem(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...item,
        quantity: Number(item.quantity),
      };
      await axios.post('http://1.1.1.1:5000/add-item', payload);
      Alert.alert('Success', 'Item added successfully');
      setItem({ name: '', category: '', quantity: '', purchaseDate: '', expirationDate: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to add item. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Add New Pantry Item</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Milk"
          value={item.name}
          onChangeText={text => handleChange('name', text)}
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Dairy"
          value={item.category}
          onChangeText={text => handleChange('category', text)}
        />

        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2"
          value={item.quantity}
          onChangeText={text => handleChange('quantity', text)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Purchase Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={item.purchaseDate}
          onChangeText={text => handleChange('purchaseDate', text)}
        />

        <Text style={styles.label}>Expiration Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={item.expirationDate}
          onChangeText={text => handleChange('expirationDate', text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#185a9d',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#185a9d',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 15,
    color: '#4a5568',
    marginBottom: 4,
    marginTop: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  button: {
    backgroundColor: '#43cea2',
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#185a9d',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
  },
});