/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import AuditScreen from '../screens/Audits/AuditScreen';
import SettingScreen from '../screens/Settings/SettingScreen';
import {Fonts, hp} from '../theme/fonts';
import {Icons} from '../theme/images';
import CustomImage from '../components/CustomImage';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {AuditsStack} from './Navigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const {colors}: any = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}: any) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,

        tabBarLabelStyle: {
          fontSize: 15,
          fontFamily: Fonts.WorkSans_500,
        },
        tabBarActiveTintColor: colors.mainBlue,
        tabBarInactiveTintColor: colors.gray_A8,
        tabBarStyle: {
          backgroundColor: colors.white,
          height: hp(10),
          paddingVertical: hp(1),
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: hp(2),
          paddingHorizontal: hp(4),
          borderColor: colors.white,
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
                tintColor={focused ? colors.mainBlue : colors.black_29}
              />
            </View>
          );
        },
      })}>
      <Tab.Screen name={'Home'} component={HomeScreen} />
      <Tab.Screen name={'Audits'} component={AuditsStack} />
      <Tab.Screen name={'Settings'} component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
