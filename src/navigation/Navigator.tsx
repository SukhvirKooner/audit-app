import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import {screenNames, SCREENS} from './screenNames';
import TabNavigator from './TabNavigator';
import AuditScreen from '../screens/Audits/AuditScreen';
import AuditDetailsScreen from '../screens/Audits/AuditDetailsScreen';
import EditProfile from '../screens/Settings/SettingNotification';
import NotificationScreen from '../screens/Home/NotificationScreen';
import MapScreen from '../screens/Home/MapScreen';
import MyAccount from '../screens/Settings/MyAccount';
import SettingNotification from '../screens/Settings/SettingNotification';
import HelpScreen from '../screens/Settings/HelpScreen';

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
      <Stack.Screen name={SCREENS.EditProfile} component={EditProfile} />
      <Stack.Screen
        name={SCREENS.NotificationScreen}
        component={NotificationScreen}
      />
      <Stack.Screen name={SCREENS.MapScreen} component={MapScreen} />
      <Stack.Screen
        name={SCREENS.SettingNotification}
        component={SettingNotification}
      />
      <Stack.Screen name={SCREENS.HelpScreen} component={HelpScreen} />
      <Stack.Screen name={SCREENS.MyAccount} component={MyAccount} />
    </Stack.Navigator>
  );
};

export const AuditsStack = () => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={'Audits'}>
        <Stack.Screen name={'Audits'} component={AuditScreen} />
        <Stack.Screen
          name={screenNames.AuditDetailsScreen}
          component={AuditDetailsScreen}
        />
      </Stack.Navigator>
    </>
  );
};

export default Navigator;
