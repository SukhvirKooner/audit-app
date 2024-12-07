import {SafeAreaView, StyleSheet, View} from 'react-native';
import React from 'react';
import CustomHeader from '../../components/CustomHeader';
import {useRoute, useTheme} from '@react-navigation/native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {useSelector} from 'react-redux';
import MapSideList from '../../components/Home/MapSideList';
import {GOOGLE_API_KEY} from '../../utils/apiConstants';

const MapScreen = () => {
  const {params}: any = useRoute();
  const {colors} = useTheme();
  const {fontValue} = useSelector((state: any) => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={params?.headerTitle}
        subTitle={'SSC KR Circle'}
        downloadIcon
        listIcon
        refreshIcon
      />
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          key={GOOGLE_API_KEY}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        />
        <MapSideList />
      </View>
    </SafeAreaView>
  );
};

export default MapScreen;

const getGlobalStyles = (props: any) => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
    },
  });
};
