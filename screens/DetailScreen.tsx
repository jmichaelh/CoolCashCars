// ... imports
import { useRoute } from '@react-navigation/native';

const DetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const { vehicle } = route.params;
  const [vinData, setVinData] = useState<any>(null);
  const { fetchVehicles } = useContext(ApiContext)!; // Reuse for VIN

  useEffect(() => {
    if (vehicle.vin) {
      fetchVinData(vehicle.vin);
    }
  }, []);

  const fetchVinData = async (vin: string) => {
    try {
      const { data } = await apiClient.get(`/vin/decode?vin=${vin}`); // Assumed endpoint
      setVinData(data); // e.g., { make, model, year, engine, transmission }
    } catch (error) {
      console.error('VIN Decode Error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: vehicle.image }} style={styles.heroImage} />
      <Text style={styles.title}>{vehicle.make} {vehicle.model}</Text>
      {/* Tabs for Specs, VIN History */}
      <View style={styles.specSection}>
        <Text style={styles.specLabel}>Transmission: {vinData?.transmission || vehicle.transmission}</Text>
        <Text style={styles.specLabel}>Mileage: {vehicle.mileage} MPG</Text>
        {/* Green highlights for key specs */}
      </View>
      {/* Finance & Buy buttons unchanged, pass vehicle to nav */}
    </ScrollView>
  );
};
