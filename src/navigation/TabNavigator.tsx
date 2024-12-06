/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import AuditScreen from '../screens/Audits/AuditScreen';
import SettingScreen from '../screens/Settings/SettingScreen';
import {light_theme} from '../theme/colors';
import {Fonts, hp} from '../theme/fonts';
import {Icons} from '../theme/images';
import CustomImage from '../components/CustomImage';
import {View} from 'react-native';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
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
        tabBarStyle: {
          backgroundColor: light_theme.white,
          height: hp(10),
          paddingVertical: hp(1),
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: hp(2),
          paddingHorizontal: hp(4),
          borderColor: light_theme.white,
        },

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
            <View style={{}}>
              <CustomImage
                disabled={true}
                source={iconName}
                size={hp(3)}
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
};

export default TabNavigator;
