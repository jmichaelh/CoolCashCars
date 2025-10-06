import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeIn } from 'react-native-reanimated';
import { ApiContext } from '../App';

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
      setVehicles(data || []);
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
      {loading ? <ActivityIndicator size="large" color="#007BFF" style={styles.loader} /> : null}
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <Animated.View style={[styles.card, animatedStyle]} entering={FadeIn.duration(300)}>
            <Image source={{ uri: item.image || 'https://via.placeholder.com/300x200?text=Car' }} style={styles.image} />
            <Text style={styles.title}>{item.make} {item.model} ({item.year})</Text>
            <Text style={styles.specs}>Engine: {item.engine || 'N/A'}</Text>
            <Text style={styles.price}>${item.price_estimate || 'Contact Dealer'} <Text style={styles.green}>Deal!</Text></Text>
            <TouchableOpacity onPress={() => onPressCard(item)} style={styles.buyButton}>
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        onEndReached={loadVehicles}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  searchBar: { backgroundColor: 'white', borderColor: '#007BFF', borderWidth: 1, padding: 10, borderRadius: 8, margin: 10 },
  loader: { marginVertical: 20 },
  card: { backgroundColor: '#C0C0C0', margin: 10, borderRadius: 16, padding: 10, shadowColor: '#007BFF', shadowOpacity: 0.5, shadowRadius: 5 },
  image: { width: '100%', height: 200, borderRadius: 8 },
  title: { fontSize: 18, color: 'white', fontFamily: 'Roboto', fontWeight: 'bold' },
  specs: { fontSize: 14, color: 'white' },
  price: { fontSize: 16, color: 'white', fontWeight: 'bold' },
  green: { color: '#28A745' },
  buyButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontFamily: 'Roboto' },
});

export default HomeScreen;
