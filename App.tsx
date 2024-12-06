import {LogBox} from 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import store from './src/redux';
import RootContainer from './src/navigation/RootContainer';
import {I18nextProvider} from 'react-i18next';
import i18n from './src/i18n/i18n';

type Props = {};

const App = ({}: Props) => {
  LogBox.ignoreAllLogs();

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <RootContainer />
      </I18nextProvider>
    </Provider>
  );
};

export default App;
