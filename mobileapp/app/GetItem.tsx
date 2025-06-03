import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

type Item = {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  expirationDate: string;
};

export default function GetItem() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    axios.get('http://1.1.1.1:5000/getItems')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  const handleEdit = (item: Item) => {
    Alert.alert('Edit', `Edit item: ${item.name}`);
    // navigation or modal logic here
  };

  const handleDelete = (item: Item) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {/* delete logic here */} }
      ]
    );
  };

  const renderItem = ({ item }: { item: Item }) => {
    const today = new Date();
    const expiration = new Date(item.expirationDate);
    const daysDiff = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isExpired = expiration < today;
    const isExpiringSoon = daysDiff <= 2 && daysDiff >= 0;

    const boxStyle = [
      styles.itemBox,
      isExpired ? styles.expiredBox : isExpiringSoon ? styles.soonBox : styles.freshBox,
    ];

    return (
      <View style={boxStyle}>
        <View style={styles.iconSection}>
          <MaterialIcons
            name={isExpired ? "error-outline" : isExpiringSoon ? "warning-amber" : "check-circle"}
            size={32}
            color={isExpired ? "#dc3545" : isExpiringSoon ? "#ffb300" : "#43cea2"}
          />
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemMeta}>Category: <Text style={styles.metaValue}>{item.category}</Text></Text>
          <Text style={styles.itemMeta}>Quantity: <Text style={styles.metaValue}>{item.quantity}</Text></Text>
          <Text style={[
            styles.itemMeta,
            isExpired && styles.expiredText,
            isExpiringSoon && styles.soonText
          ]}>
            Expiration: {expiration.toDateString()}
            {isExpired ? ' (Expired)' : isExpiringSoon ? ' (Expiring Soon)' : ''}
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
            <FontAwesome name="edit" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
            <FontAwesome name="trash" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantry Items</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items found. Add something to your pantry!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#185a9d',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  itemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#185a9d',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  iconSection: {
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 2,
  },
  itemMeta: {
    fontSize: 15,
    color: '#4a5568',
    marginBottom: 1,
  },
  metaValue: {
    color: '#185a9d',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    gap: 8,
  },
  editButton: {
    backgroundColor: '#43cea2',
    padding: 8,
    borderRadius: 8,
    marginRight: 6,
    elevation: 1,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 8,
    elevation: 1,
  },
  expiredBox: {
    borderWidth: 1.5,
    borderColor: '#dc3545',
    backgroundColor: '#ffe6e6',
  },
  soonBox: {
    borderWidth: 1.5,
    borderColor: '#ffb300',
    backgroundColor: '#fff8cc',
  },
  freshBox: {
    borderWidth: 1.5,
    borderColor: '#43cea2',
    backgroundColor: '#e6fff7',
  },
  expiredText: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  soonText: {
    color: '#ffb300',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 40,
  },
});