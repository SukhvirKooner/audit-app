import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import React, {FC, useEffect} from 'react';
import StackNavigator from './Navigator';
import {StatusBar, useColorScheme} from 'react-native';
import {dark_theme, light_theme} from '../theme/colors';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {setDarkTheme} from '../utils/commonActions';
import Loader from '../components/Loader';

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

  useEffect(() => {
    dispatch(setDarkTheme(theme === 'dark' ? true : false));
  }, [dispatch, theme]);

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
    </NavigationContainer>
  );
};
export default RootContainer;
