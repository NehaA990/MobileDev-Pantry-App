import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BASE_URL = 'http://10.50.107.106:5000'; // Change to your ngrok URL if needed

type Item = {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  expirationDate: string;
};

export default function GetItem() {
  const [items, setItems] = useState<Item[]>([]);
  const router = useRouter();

  const fetchItems = () => {
    axios
      .get(`${BASE_URL}/getItems`)
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching items:', error));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (item: Item) => {
    router.push({
      pathname: '/EditItem',
      params: {
        itemData: JSON.stringify(item),
      },
    });
  };

  const handleDelete = (item: Item) => {
    Alert.alert('Delete Item', `Are you sure you want to delete "${item.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${BASE_URL}/delete-item/${item._id}`);
            Alert.alert('Deleted', `"${item.name}" has been deleted.`);
            fetchItems(); // Refresh after delete
          } catch (error) {
            Alert.alert('Error', 'Failed to delete item. Please try again.');
            console.error('Error deleting item:', error);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Item }) => {
    const today = new Date();
    const expiration = new Date(item.expirationDate);
    const daysDiff = Math.ceil(
      (expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
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
            name={isExpired ? 'error-outline' : isExpiringSoon ? 'warning-amber' : 'check-circle'}
            size={32}
            color={isExpired ? '#dc3545' : isExpiringSoon ? '#ffb300' : '#43cea2'}
          />
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemMeta}>
            Category: <Text style={styles.metaValue}>{item.category}</Text>
          </Text>
          <Text style={styles.itemMeta}>
            Quantity: <Text style={styles.metaValue}>{item.quantity}</Text>
          </Text>
          <Text
            style={[
              styles.itemMeta,
              isExpired && styles.expiredText,
              isExpiringSoon && styles.soonText,
            ]}
          >
            Expiration: {expiration.toDateString()}
            {isExpired ? ' (Expired)' : isExpiringSoon ? ' (Expiring Soon)' : ''}
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(item)}
            activeOpacity={0.8}
          >
            <FontAwesome name="edit" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}
            activeOpacity={0.8}
          >
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
        keyboardShouldPersistTaps="handled" // KEEP this → avoids common FlatList bug
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
    flex: 1,
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
    justifyContent: 'flex-end',
    flexShrink: 0,
    marginLeft: 8,
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
