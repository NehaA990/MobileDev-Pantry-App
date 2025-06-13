import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function EditItem() {
  const router = useRouter();
  const { itemData } = useLocalSearchParams();

  const parsedItem = useMemo(() => {
    return itemData
      ? JSON.parse(Array.isArray(itemData) ? itemData[0] : itemData)
      : null;
  }, [itemData]);

  const [item, setItem] = useState({
    name: '',
    category: '',
    quantity: '',
    purchaseDate: '',
    expirationDate: '',
  });

  useEffect(() => {
    if (parsedItem) {
      setItem({
        name: parsedItem.name,
        category: parsedItem.category,
        quantity: parsedItem.quantity.toString(),
        purchaseDate: parsedItem.purchaseDate?.slice(0, 10),
        expirationDate: parsedItem.expirationDate?.slice(0, 10),
      });
    }
  }, [parsedItem]);

  const handleChange = (key: string, value: string) => {
    setItem(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...item,
        quantity: Number(item.quantity),
      };
      await axios.put(`http://10.50.107.106:5000/edit-item/${parsedItem._id}`, payload);
      Alert.alert('Success', 'Item updated successfully');
      router.push('/GetItem');
    } catch (error) {
      Alert.alert('Error', 'Failed to update item. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Edit Pantry Item</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={item.name}
          onChangeText={text => handleChange('name', text)}
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={item.category}
          onChangeText={text => handleChange('category', text)}
        />

        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          value={item.quantity}
          onChangeText={text => handleChange('quantity', text)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Purchase Date</Text>
        <TextInput
          style={styles.input}
          value={item.purchaseDate}
          onChangeText={text => handleChange('purchaseDate', text)}
        />

        <Text style={styles.label}>Expiration Date</Text>
        <TextInput
          style={styles.input}
          value={item.expirationDate}
          onChangeText={text => handleChange('expirationDate', text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Update Item</Text>
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
