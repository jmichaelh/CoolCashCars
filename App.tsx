import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Animated, Easing } from 'react-native-reanimated'; // For smooth transitions
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import FinanceScreen from './screens/FinanceScreen';
import PurchaseScreen from './screens/PurchaseScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }), // Fade animation
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Finance" component={FinanceScreen} />
        <Stack.Screen name="Purchase" component={PurchaseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
