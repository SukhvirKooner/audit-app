/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import CustomHeader from '../../components/CustomHeader';
import {useRoute, useTheme} from '@react-navigation/native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Loader from '../../components/Loader';
import {navigationRef} from '../../navigation/RootContainer';
import {GOOGLE_API_KEY} from '../../utils/apiConstants';
import {requestLocationPermission} from '../../utils/locationHandler';
import {errorToast} from '../../utils/commonFunction';
import {useTranslation} from 'react-i18next';
import {commonFontStyle, hp} from '../../theme/fonts';
import {useSelector} from 'react-redux';

const MapScreen = () => {
  const {params}: any = useRoute();
  const mapCameraRef = useRef<any>(null);
  const {t} = useTranslation();

  const {colors} = useTheme();
  const {fontValue} = useSelector((state: any) => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );
  const [markerList, setMarkerList] = useState<any>([]);
  const [isLocationFetch, setIsLocationFetch] = useState(true);

  const [isMapLoaded, setIsMapLoaded] = useState(true);

  useEffect(() => {
    if (params?.listData?.length > 0) {
      setTimeout(() => {
        setIsMapLoaded(false);
      }, 300);

      const newList = params?.listData?.map((item: any) => {
        return {
          latitude: Number(item?.value?.split(',')[0] || 0),
          longitude: Number(item?.value?.split(',')[1] || 0),
        };
      });
      setMarkerList(newList);
      if (mapCameraRef?.current) {
        mapCameraRef?.current?.setCamera({
          center: {
            latitude: Number(newList[0]?.latitude || 0),
            longitude: Number(newList[0]?.longitude || 0),
          },
          zoom: 11, // Adjust zoom level
          animation: {
            duration: 1000, // Duration of the animation
            easing: () => {},
          },
        });
      }
    }
  }, [params?.listData, params?.listData]);

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    await requestLocationPermission(
      () => {
        // const {latitude, longitude} = position;

        setIsLocationFetch(false);
      },
      () => {
        setIsLocationFetch(false);
        errorToast('Please enable location');
      },
    );
  };

  const onMapLoad = () => {
    console.log('onMapLoad');
    setIsMapLoaded(false);

    const newList = params?.listData?.map((item: any) => {
      return {
        latitude: Number(item?.value?.split(',')[0] || 0),
        longitude: Number(item?.value?.split(',')[1] || 0),
      };
    });
    setMarkerList(newList);
    if (mapCameraRef?.current) {
      mapCameraRef?.current?.setCamera({
        center: {
          latitude: Number(newList[0]?.latitude || 0),
          longitude: Number(newList[0]?.longitude || 0),
        },
        zoom: 11, // Adjust zoom level
        animation: {
          duration: 1000, // Duration of the animation
          easing: () => {},
        },
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <CustomHeader
        title={params?.headerTitle}
        subTitle={'SSC KR Circle'}
        downloadIcon
        listIcon
        refreshIcon
        onListPress={() => {
          navigationRef.goBack();
        }}
      />
      <View style={{flex: 1}}>
        {isLocationFetch ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={'large'} color={colors.white} />
            <Text style={styles.fetchTextStyle}>{t('Fetching Location')}</Text>
          </View>
        ) : (
          <>
            {isMapLoaded && <Loader />}

            <MapView
              ref={mapCameraRef}
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={{flex: 1}}
              zoomControlEnabled
              showsUserLocation
              initialRegion={{
                latitude: 0,
                longitude: 0,
                latitudeDelta: 28.679079,
                longitudeDelta: 77.06971,
              }}
              onMapReady={onMapLoad}
              onMapLoaded={onMapLoad}
              key={GOOGLE_API_KEY}>
              {markerList.map((item: any) => {
                return (
                  <Marker
                    coordinate={{
                      latitude: parseFloat(item?.latitude) || 0,
                      longitude: parseFloat(item?.longitude) || 0,
                    }}
                  />
                );
              })}
            </MapView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MapScreen;

const getGlobalStyles = ({colors, fontValue}: any) => {
  return StyleSheet.create({
    fetchTextStyle: {
      marginTop: hp(2),
      ...commonFontStyle(500, fontValue + 16, colors.gray),
    },
    loaderContainer: {
      height: hp(85),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.backgroundColor,
    },
  });
};
