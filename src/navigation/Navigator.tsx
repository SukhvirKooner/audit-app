import React, {useEffect} from 'react';
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
import {getAsyncToken, getAsyncUserInfo} from '../utils/asyncStorageManager';
import {dispatchAction, useAppDispatch} from '../redux/hooks';
import {setAuthorization} from '../utils/apiGlobal';
import {SET_USER_INFO} from '../redux/actionTypes';
import TemplateScreen from '../screens/Audits/TemplateScreen';

const Stack = createStackNavigator();

const Navigator = () => {
  const dispatch = useAppDispatch();
  const [accessToken, setAccessToken] = React.useState<any>(null);

  useEffect(() => {
    (async () => {
      let token = await getAsyncToken();

      if (token) {
        setAccessToken(SCREENS.HomeScreen);
        let userData = await getAsyncUserInfo();
        dispatchAction(dispatch, SET_USER_INFO, userData);
        await setAuthorization(token?.split(' ')[1]);
        // setTimeout(() => {
        //   SplashScreen.hide();
        //   setloading(false);
        // }, 2000);
      } else {
        setAccessToken(SCREENS.LoginScreen);

        // setTimeout(() => {
        //   SplashScreen.hide();
        //   setloading(false);
        // }, 2000);
      }
    })();
  }, [dispatch]);

  return (
    <Stack.Navigator
      initialRouteName={accessToken}
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
      <Stack.Screen name={SCREENS.TemplateScreen} component={TemplateScreen} />
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
