import React, { createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './screens/HomeScreen';
// ... other imports

interface ApiContextType {
  fetchVehicles: (params: any) => Promise<any>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const apiClient = axios.create({ baseURL: 'https://carapi.app/api/v1' });

const fetchVehicles = async (params: any) => {
  const cacheKey = `vehicles_${JSON.stringify(params)}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  const { data } = await apiClient.get('/vehicles/search', { params });
  await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
};

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ApiContext.Provider value={{ fetchVehicles }}>{children}</ApiContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <ApiProvider>
      <NavigationContainer>
        {/* Stack.Navigator unchanged */}
      </NavigationContainer>
    </ApiProvider>
  );
};

export default App;
