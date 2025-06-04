import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal, Pressable, Animated } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [bellAnim] = useState(new Animated.Value(0));
  const [expiringItems, setExpiringItems] = useState([]);

  // ✅ Fetch and filter expired items
  useEffect(() => {
    fetch('http://10.30.16.64:5000/expired-items')
      .then(res => res.json())
      .then(data => {
        const today = new Date();
        const expired = data.filter(item => new Date(item.expirationDate) < today);
        setExpiringItems(expired.map(item => item.name));
      })
      .catch(err => console.error('Error fetching expired items:', err));
  }, []);

  // 🔔 Animate bell when there are expired items
  useEffect(() => {
    if (expiringItems.length > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bellAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
          Animated.timing(bellAnim, { toValue: -1, duration: 150, useNativeDriver: true }),
          Animated.timing(bellAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [expiringItems.length]);

  const handleBellPress = () => {
    if (expiringItems.length > 0) {
      setShowModal(true);
    } else {
      router.push('/Recipe');
    }
  };

  const closeModalAndNavigate = () => {
    setShowModal(false);
    router.push('/Recipe');
  };

  const isActive = (route) => pathname === route;

  return (
    <LinearGradient
      colors={['#43cea2', '#185a9d']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <View style={styles.safeArea}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navbar}>
          {/* Home */}
          <TouchableOpacity style={[styles.navItem, isActive('/') && styles.activeNavItem]} onPress={() => router.push('/')}>
            <Entypo name="home" size={28} color={isActive('/') ? 'black' : 'white'} />
            <Text style={[styles.navText, isActive('/') && styles.activeNavText]}>Home</Text>
          </TouchableOpacity>

          {/* View Items */}
          <TouchableOpacity style={[styles.navItem, isActive('/GetItem') && styles.activeNavItem]} onPress={() => router.push('/GetItem')}>
            <MaterialIcons name="inventory" size={28} color={isActive('/GetItem') ? 'black' : 'white'} />
            <Text style={[styles.navText, isActive('/GetItem') && styles.activeNavText]}>View Items</Text>
          </TouchableOpacity>

          {/* Add Item */}
          <TouchableOpacity style={[styles.navItem, isActive('/AddItem') && styles.activeNavItem]} onPress={() => router.push('/AddItem')}>
            <FontAwesome name="plus" size={28} color={isActive('/AddItem') ? 'black' : 'white'} />
            <Text style={[styles.navText, isActive('/AddItem') && styles.activeNavText]}>Add Item</Text>
          </TouchableOpacity>

          {/* Edit Item */}
          <TouchableOpacity style={[styles.navItem, isActive('/EditItem') && styles.activeNavItem]} onPress={() => router.push('/EditItem')}>
            <FontAwesome name="edit" size={28} color={isActive('/EditItem') ? 'black' : 'white'} />
            <Text style={[styles.navText, isActive('/EditItem') && styles.activeNavText]}>Edit Item</Text>
          </TouchableOpacity>

          {/* Alerts */}
          <TouchableOpacity style={styles.navItem} onPress={handleBellPress}>
            <Animated.View style={{ transform: [{ rotate: bellAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-15deg', '15deg'] }) }] }}>
              <FontAwesome name="bell" size={28} color={expiringItems.length > 0 ? '#ff5252' : 'white'} />
            </Animated.View>
            <Text style={[styles.navText, expiringItems.length > 0 && { color: '#ff5252', fontWeight: 'bold' }]}>Alerts</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Modal popup */}
      <Modal visible={showModal} transparent={true} animationType="fade" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Expired Items:</Text>
            {expiringItems.length === 0 ? (
              <Text style={styles.modalItem}>No expired items.</Text>
            ) : (
              expiringItems.map((item, index) => (
                <Text key={index} style={styles.modalItem}>• {item}</Text>
              ))
            )}
            <Pressable style={styles.modalButton} onPress={closeModalAndNavigate}>
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  safeArea: {
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  navItem: {
    alignItems: 'center',
    marginHorizontal: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  activeNavItem: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#43cea2',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  navText: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  activeNavText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
    color: '#185a9d',
  },
  modalItem: {
    fontSize: 16,
    marginVertical: 2,
    color: '#222',
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#43cea2',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
