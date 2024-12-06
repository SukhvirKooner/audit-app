import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import {SCREENS} from './screenNames';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.LoginScreen}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={SCREENS.LoginScreen} component={LoginScreen} />
      <Stack.Screen name={SCREENS.HomeScreen} component={TabNavigator} />
    </Stack.Navigator>
  );
};

export default Navigator;
