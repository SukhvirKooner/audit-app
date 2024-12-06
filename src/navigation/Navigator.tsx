/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import {SCREENS} from './screenNames';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AuditScreen from '../screens/Audits/AuditScreen';
import SettingScreen from '../screens/Settings/SettingScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import {light_theme} from '../theme/colors';
import {Fonts, hp} from '../theme/fonts';
import {View} from 'react-native';
import {Icons} from '../theme/images';
import CustomImage from '../components/CustomImage';

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
    <Tab.Navigator
      screenOptions={({route}: any) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,

        tabBarLabelStyle: {
          fontSize: 15,
          fontFamily: Fonts.WorkSans_500,
        },
        tabBarActiveTintColor: light_theme.mainBlue,
        tabBarInactiveTintColor: light_theme.gray_A8,

        tabBarIcon: ({focused}) => {
          let iconName = Icons.home;
          if (route.name === 'Home') {
            iconName = Icons.home;
          } else if (route.name === 'Audits') {
            iconName = Icons.audits;
          } else if (route.name === 'Settings') {
            iconName = Icons.settings;
          }
          return (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CustomImage
                disabled={true}
                source={iconName}
                size={hp(2.5)}
                tintColor={
                  focused ? light_theme.mainBlue : light_theme.black_29
                }
              />
            </View>
          );
        },
      })}>
      <Tab.Screen name={'Home'} component={HomeScreen} />
      <Tab.Screen name={'Audits'} component={AuditScreen} />
      <Tab.Screen name={'Settings'} component={SettingScreen} />
    </Tab.Navigator>
  );
}
