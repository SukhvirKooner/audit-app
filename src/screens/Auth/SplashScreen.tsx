import {View} from 'react-native';
import React, {useEffect} from 'react';
import {getAsyncToken, getAsyncUserInfo} from '../../utils/asyncStorageManager';
import {dispatchAction, useAppDispatch} from '../../redux/hooks';
import {SET_USER_INFO} from '../../redux/actionTypes';
import {setAuthorization} from '../../utils/apiGlobal';
import {navigateTo, resetNavigation} from '../../utils/commonFunction';
import {SCREENS} from '../../navigation/screenNames';

const SplashScreen = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    let token = await getAsyncToken();

    if (token) {
      let userData = await getAsyncUserInfo();
      dispatchAction(dispatch, SET_USER_INFO, userData);
      await setAuthorization(token?.split(' ')[1]);
      resetNavigation(SCREENS.HomeScreen, undefined);
    } else {
      navigateTo(SCREENS.LoginScreen);
      // setTimeout(() => {
      //   SplashScreen.hide();
      //   setloading(false);
      // }, 2000);
    }
  };

  return <View></View>;
};

export default SplashScreen;
