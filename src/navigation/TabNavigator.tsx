import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import AuditScreen from '../screens/Audits/AuditScreen';
import SettingScreen from '../screens/Settings/SettingScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={'Home'}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen name={'Home'} component={HomeScreen} />
      <Tab.Screen name={'Audits'} component={AuditScreen} />
      <Tab.Screen name={'Settings'} component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
