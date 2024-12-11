/* eslint-disable react/no-unstable-nested-components */
import {
  NavigationContainer,
  createNavigationContainerRef,
  useTheme,
} from '@react-navigation/native';
import React, {FC, useEffect} from 'react';
import StackNavigator from './Navigator';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
} from 'react-native';
import {dark_theme, light_theme} from '../theme/colors';
import {dispatchAction, useAppDispatch, useAppSelector} from '../redux/hooks';
import {setDarkTheme} from '../utils/commonActions';
import Loader from '../components/Loader';
import {commonFontStyle, SCREEN_WIDTH} from '../theme/fonts';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {
  getAsyncToken,
  getAsyncUserInfo,
  setAsyncUserInfo,
} from '../utils/asyncStorageManager';
import {SET_USER_INFO} from '../redux/actionTypes';
import {setAuthorization} from '../utils/apiGlobal';
import {SCREENS} from './screenNames';
import {resetNavigation} from '../utils/commonFunction';

export const navigationRef = createNavigationContainerRef();

let DarkThemeColors = {
  colors: {
    ...dark_theme,
  },
  isDark: true,
};

let DefaultThemeColor = {
  colors: {
    ...light_theme,
  },
  isDark: false,
};

const RootContainer: FC = () => {
  const theme = useColorScheme();
  const {isDarkTheme, isLoading} = useAppSelector(state => state.common);
  const dispatch = useAppDispatch();

  const {colors} = useTheme();
  const {fontValue} = useSelector((state: any) => state.common);

  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  useEffect(() => {
    dispatch(setDarkTheme(theme === 'dark' ? true : false));
  }, [dispatch, theme]);

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
      // setTimeout(() => {
      //   SplashScreen.hide();
      //   setloading(false);
      // }, 2000);
    }
  };

  const toastConfig = {
    success: ({text1, type}: any) =>
      type === 'success' && (
        <SafeAreaView>
          <View style={styles.textStyleToastSuccess}>
            <Text style={styles.textStyleToast}>{text1}</Text>
          </View>
        </SafeAreaView>
      ),
    error: ({text1, type}: any) => {
      if (type === 'error') {
        return (
          <SafeAreaView>
            <View style={styles.toastStyle}>
              <Text style={styles.textStyleToast}>{text1}</Text>
            </View>
          </SafeAreaView>
        );
      }
    },
  };

  return (
    <NavigationContainer
      theme={isDarkTheme ? DarkThemeColors : DefaultThemeColor}
      ref={navigationRef}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={light_theme.background}
      />
      <StackNavigator />
      {isLoading && <Loader />}
      <Toast config={toastConfig} position="top" topOffset={0} />
    </NavigationContainer>
  );
};
export default RootContainer;

const getGlobalStyles = (props: any) => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    toastStyle: {
      backgroundColor: 'red',
      paddingVertical: 10,
      paddingHorizontal: 30,
      width: SCREEN_WIDTH,
    },
    textStyleToastSuccess: {
      backgroundColor: 'green',
      paddingVertical: 10,
      paddingHorizontal: 30,
      width: SCREEN_WIDTH,
    },
    textStyleToast: {
      ...commonFontStyle(500, fontValue + 14, '#FFFF'),
      textAlign: 'center',
    },
  });
};
