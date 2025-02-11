import {LogBox} from 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import store from './src/redux';
import RootContainer from './src/navigation/RootContainer';
import {I18nextProvider} from 'react-i18next';
import i18n from './src/i18n/i18n';
import MapplsGL from 'mappls-map-react-native';

type Props = {};

MapplsGL.setMapSDKKey('236866cde2288d1cea916c0c188cf654'); //place your mapsdkKey
MapplsGL.setRestAPIKey('236866cde2288d1cea916c0c188cf654'); //your restApiKey
MapplsGL.setAtlasClientId(
  '96dHZVzsAuvRT1MO5l9idZ38thQac5AQunTEHJPMvUPsqkBTlYNUMTzkCsUpx1o-CV3kvw9fOS9HBAPV7at8XQ==',
); //your atlasClientId key
MapplsGL.setAtlasClientSecret(
  'lrFxI-iSEg8u1HRaLngEtYbmTXyUiCHB7A4BiA2nFTAV9ZakuGQOeopRIjeIyTkGg2w9T9Jo9bxQd1d1xbyS8zqHMlMor3sr',
);
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
