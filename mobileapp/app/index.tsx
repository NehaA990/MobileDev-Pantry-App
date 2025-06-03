import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const Home = () => (
  <>
    <Stack.Screen
      options={{
        title: '',
        headerLeft: () => null,
        headerShown: false, // Hide the header for a cleaner look
      }}
    />
    <View style={styles.container}>
      <Text style={styles.emoji}>🧺</Text>
      <Text style={styles.title}>Welcome to Pantry Pal!</Text>
      <Text style={styles.subtitle}>
        Organize your pantry, track your groceries, and never let food go to waste.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Alert.alert('Start Exploring!', 'Try adding your first item or viewing your pantry.')}
      >
        
      </TouchableOpacity>
    </View>
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    padding: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#4a5568',
    marginBottom: 32,
    textAlign: 'center',
  },
  
  
});

export default Home;