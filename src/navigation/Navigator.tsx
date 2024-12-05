import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import {SCREENS} from './screenNames';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AuditScreen from '../screens/Audits/AuditScreen';
import SettingScreen from '../screens/Settings/SettingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Navigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.LoginScreen}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={SCREENS.LoginScreen} component={LoginScreen} />
      <Stack.Screen name={SCREENS.HomeScreen} component={MyTabs} />
    </Stack.Navigator>
  );
};

export default Navigator;

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name={'Home'} component={LoginScreen} />
      <Tab.Screen name={'Audits'} component={AuditScreen} />
      <Tab.Screen name={'Settings'} component={SettingScreen} />
    </Tab.Navigator>
  );
}
