 import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeIn } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { ApiContext } from '../App'; // From above

const HomeScreen: React.FC = () => {
  const [searchParams, setSearchParams] = useState({ make: '', model: '', year: '' });
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { fetchVehicles } = useContext(ApiContext)!;
  const navigation = useNavigation();
  const scale = useSharedValue(1);

  useEffect(() => {
    loadVehicles();
  }, [searchParams]);

  const loadVehicles = async () => {
    if (!searchParams.make) return;
    setLoading(true);
    try {
      const data = await fetchVehicles(searchParams);
      setVehicles(data || []); // Assumes array response, e.g., [{ id, make, model, year, price_estimate, specs }]
    } catch (error) {
      console.error('CarAPI Error:', error);
    }
    setLoading(false);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  const onPressCard = (vehicle: any) => {
    scale.value = 0.95;
    setTimeout(() => { scale.value = 1; navigation.navigate('Detail', { vehicle }); }, 150);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Make/Model/Year"
        onChangeText={(text) => setSearchParams({ ...searchParams, make: text.split('/')[0] || '' })}
        placeholderTextColor="#007BFF"
      />
      {loading ? <LottieView source={require('../assets/shimmer.json')} autoPlay loop style={styles.loader} /> : null}
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <Animated.View style={[styles.card, animatedStyle]} entering={FadeIn.duration(300)}>
            <Image source={{ uri: item.image || 'https://via.placeholder.com/300x200?text=Car' }} style={styles.image} />
            <Text style={styles.title}>{item.make} {item.model} ({item.year})</Text>
            <Text style={styles.specs}>Engine: {item.engine || 'N/A'}</Text> {/* From CarAPI specs */}
            <Text style={styles.price}>${item.price_estimate || 'Contact Dealer'} <Text style={styles.green}>Deal!</Text></Text>
            <TouchableOpacity onPress={() => onPressCard(item)} style={styles.buyButton}>
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        onEndReached={loadVehicles} // Pagination via CarAPI params (e.g., page=1)
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

// Styles unchanged, with blue searchBar: { backgroundColor: 'white', borderColor: '#007BFF', borderWidth: 1, padding: 10, borderRadius: 8 }
export default HomeScreen;
