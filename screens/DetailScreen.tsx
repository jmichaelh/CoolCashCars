import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ApiContext } from '../App';

const DetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const { vehicle } = route.params;
  const [vinData, setVinData] = useState<any>(null);
  const { fetchVinData } = useContext(ApiContext)!;
  const navigation = useNavigation();

  useEffect(() => {
    if (vehicle.vin) {
      fetchVinData(vehicle.vin).then(setVinData).catch((error) => console.error('VIN Error:', error));
    }
  }, [vehicle.vin]);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: vehicle.image || 'https://via.placeholder.com/400x200?text=Car' }} style={styles.heroImage} />
      <Text style={styles.title}>{vehicle.make} {vehicle.model} ({vehicle.year})</Text>
      <View style={styles.specSection}>
        <Text style={styles.specLabel}>Engine: {vinData?.engine || vehicle.engine || 'N/A'}</Text>
        <Text style={styles.specLabel}>Transmission: {vinData?.transmission || 'N/A'}</Text>
        <Text style={styles.specLabel}>Mileage: {vehicle.mileage || 'N/A'} MPG</Text>
      </View>
      <TouchableOpacity style={styles.arButton} onPress={() => navigation.navigate('ARTestDrive', { vehicle })}>
        <Text style={styles.buttonText}>AR Test Drive</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buyButton} onPress={() => navigation.navigate('Purchase', { vehicle })}>
        <Text style={styles.buttonText}>Buy Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#343A40' },
  heroImage: { width: '100%', height: 300, borderRadius: 8, marginBottom: 10 },
  title: { fontSize: 24, color: 'white', fontFamily: 'Roboto', fontWeight: 'bold', margin: 10 },
  specSection: { padding: 10 },
  specLabel: { fontSize: 16, color: '#28A745', marginVertical: 5 },
  arButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, margin: 10, alignItems: 'center' },
  buyButton: { backgroundColor: '#28A745', padding: 15, borderRadius: 8, margin: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontFamily: 'Roboto', fontWeight: 'bold' },
});

export default DetailScreen;
