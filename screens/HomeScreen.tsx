import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import LottieView from 'lottie-react-native'; // For shimmer loading

const cars = [ // Mock data from Edmunds API
  { id: 1, name: 'Toyota Camry', price: 25000, image: 'https://example.com/camry.jpg' },
  // Add more...
];

const HomeScreen: React.FC = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Fetch from Edmunds: fetch('https://api.edmunds.com/api/vehicle/v2/toyota/camry?fmt=json&api_key=YOUR_KEY')
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  const onPressCard = () => {
    scale.value = 0.95; // Spring bounce
    setTimeout(() => scale.value = 1, 150);
    navigation.navigate('Detail');
  };

  return (
    <View style={styles.container}>
      {loading ? <LottieView source={require('../assets/shimmer.json')} autoPlay loop /> : null}
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Animated.View style={[styles.card, animatedStyle]}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.price}>${item.price} <Text style={styles.green}>Deal!</Text></Text>
            <TouchableOpacity onPress={onPressCard} style={styles.buyButton}>
              <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        onScroll={() => { /* Infinite scroll logic */ }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  card: { backgroundColor: '#C0C0C0', margin: 10, borderRadius: 16, padding: 10, shadowColor: '#007BFF', shadowOpacity: 0.5 },
  image: { width: '100%', height: 200, borderRadius: 8 },
  price: { fontSize: 18, color: 'white', fontWeight: 'bold' },
  green: { color: '#28A745' },
  buyButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white' },
});

export default HomeScreen;
