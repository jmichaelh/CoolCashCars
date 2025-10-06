import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import FinanceScreen from './screens/FinanceScreen';
import PurchaseScreen from './screens/PurchaseScreen';
import Icon from 'react-native-vector-icons/MaterialIcons'; // New import

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#007BFF' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackImage: () => <Icon name="arrow-back" size={24} color="#FFFFFF" />,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Cool Cash Cars' }} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Finance" component={FinanceScreen} />
        <Stack.Screen name="Purchase" component={PurchaseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
