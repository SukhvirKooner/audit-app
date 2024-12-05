/* eslint-disable react/no-unstable-nested-components */
import {LogBox, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import store from './src/redux';
import Toast from 'react-native-toast-message';
import {commonFontStyle, SCREEN_WIDTH} from './src/theme/fonts';
import RootContainer from './src/navigation/RootContainer';
import {light_theme} from './src/theme/colors';
import {I18nextProvider} from 'react-i18next';
import i18n from './src/i18n/i18n';

type Props = {};

const App = ({}: Props) => {
  LogBox.ignoreAllLogs();

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <SafeAreaView style={styles.container}>
          <RootContainer />
        </SafeAreaView>
      </I18nextProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: light_theme.background,
  },
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
    ...commonFontStyle(500, 14, light_theme.white),
    textAlign: 'center',
  },
});
