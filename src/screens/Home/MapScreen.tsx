/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import CustomHeader from '../../components/CustomHeader';
import {useIsFocused, useRoute, useTheme} from '@react-navigation/native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Loader from '../../components/Loader';
import {navigationRef} from '../../navigation/RootContainer';
import {GOOGLE_API_KEY} from '../../utils/apiConstants';
import {
  requestLocationPer,
  requestLocationPermission,
} from '../../utils/locationHandler';
import {errorToast} from '../../utils/commonFunction';
import {useTranslation} from 'react-i18next';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {useSelector} from 'react-redux';
import {IS_LOADING} from '../../redux/actionTypes';
import {useAppDispatch} from '../../redux/hooks';
import MapplsGL from 'mappls-map-react-native';
import {Icons} from '../../theme/images';
import {point, points} from '@turf/helpers';

const MapScreen = () => {
  const {params}: any = useRoute();
  const mapCameraRef = useRef<any>(null);
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const {colors} = useTheme();
  const {fontValue} = useSelector((state: any) => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );
  const [markerList, setMarkerList] = useState<any>([]);
  const [isLocationFetch, setIsLocationFetch] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [currentLatLang, setCurrentLatLang] = useState([77.5946, 12.9716]);
  const [isMapLoaded, setIsMapLoaded] = useState(true);
  console.log('currentLocation', markerList);
  const mapCamera = useRef(null);

  useEffect(() => {
    if (params?.listData?.length > 0) {
      setTimeout(() => {
        setIsMapLoaded(false);
      }, 300);

      const newList =
        params?.listData &&
        params?.listData?.map((item: any) => {
          console.log('params?.listData', item);

          return {
            latitude: Number(item?.latitude || 0),
            longitude: Number(item?.longitude || 0),
          };
        });
      setTimeout(() => {
        // setMarkerList(newList);
      }, 2000);
    }
  }, [params?.listData]);

  const isFocused = useIsFocused();

  useEffect(() => {
    fetchLocation();
  }, [isFocused]);

  const fetchLocation = async () => {
    console.log('dadasda');

    await requestLocationPer(
      position => {
        const {latitude, longitude} = position;
        console.log('dasdasdasdasd', latitude);

        setCurrentLocation({
          latitude: latitude,
          longitude: longitude,
        });
        setIsMapLoaded(false);
        setIsLocationFetch(false);
      },
      () => {
        setIsLocationFetch(true);
        errorToast('Please enable location');
      },
    );
  };

  const onMapLoad = () => {
    console.log('onMapLoad');
    setIsMapLoaded(false);
    const newList = params?.listData?.map((item: any) => {
      return {
        latitude: Number(item?.latitude || 0),
        longitude: Number(item?.longitude || 0),
      };
    });
    if (params?.location?.latitude && params?.location?.longitude) {
      setTimeout(() => {
        setMarkerList([
          {
            latitude: params?.location?.latitude,
            longitude: params?.location?.longitude,
          },
        ]);
      }, 1500);
    } else {
      setTimeout(() => {
        setMarkerList(newList);
      }, 1500);
    }
  };

  console.log('params?.location', params?.location?.latitude);
  console.log('params?.location', params?.location?.longitude);

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
            {/* {isMapLoaded && <Loader />} */}

            <MapplsGL.MapView
              onDidFinishLoadingMap={onMapLoad}
              style={{flex: 1}}>
              <MapplsGL.Camera
                ref={mapCamera}
                zoomLevel={5}
                centerCoordinate={currentLatLang}
              />
              <MapplsGL.UserLocation
                visible={true}
                showsUserHeadingIndicator={true}
              />

              {params?.location?.longitude && params?.location?.latitude && (
                <MapplsGL.PointAnnotation
                  coordinate={[
                    Number(params?.location?.longitude) || 0,
                    Number(params?.location?.latitude) || 0,
                  ]}>
                  <Image
                    resizeMode="contain"
                    style={{height: wp(7), width: wp(7)}}
                    source={Icons.ic_pin}
                  />
                </MapplsGL.PointAnnotation>
              )}

              {markerList?.map((point: any, index: any) => {
                return (
                  <MapplsGL.PointAnnotation
                    key={index}
                    id={`marker-${index}`}
                    coordinate={[
                      Number(point?.longitude),
                      Number(point?.latitude),
                    ]}>
                    <Image
                      resizeMode="contain"
                      style={{height: wp(7), width: wp(7)}}
                      source={Icons.ic_pin}
                    />
                  </MapplsGL.PointAnnotation>
                );
              })}
            </MapplsGL.MapView>
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

// import {
//   Image,
//   StyleSheet,
//   Text,
//   ViewStyle,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import {light_theme} from '../theme/colors';
// import {commonFontStyle, hp, SCREEN_WIDTH} from '../theme/fonts';
// import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
// import {GOOGLE_API_KEY} from '../utils/apiConstants';
// import Loader from './Loader';
// import {useTheme} from '@react-navigation/native';

// type Props = {
//   title: string;
//   extraStyle?: ViewStyle;
//   onPress?: () => void;
//   titleColor?: any;
//   type?: 'blue' | 'gray';
//   disabled?: boolean;
//   leftIcon?: any;
// };

// const CustomMapView = ({
//   titleColor,
//   title,
//   extraStyle,
//   onPress,
//   type = 'blue',
//   leftIcon,
//   disabled = false,
//   latitude,
//   longitude,
//   formValues,
//   field,
//   handleInputChange,
//   isEdit,
// }: Props) => {
//   const mapCameraRef = useRef<any>(null);
//   const {colors}: any = useTheme();
//   const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
//   const [isMapLoaded, setIsMapLoaded] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       setIsMapLoaded(false);
//     }, 1500);
//   }, []);

//   useEffect(() => {
//     if (mapCameraRef?.current && latitude && longitude) {
//       mapCameraRef?.current?.setCamera({
//         center: {
//           latitude: latitude,
//           longitude: longitude,
//           latitudeDelta: 28.679079,
//           longitudeDelta: 77.06971,
//         },
//         zoom: 10, // Adjust zoom level
//         animation: {
//           duration: 1000, // Duration of the animation
//           easing: () => {},
//         },
//       });
//     }
//   }, [latitude, longitude]);

//   return (
//     <>
//       {isMapLoaded ? (
//         <View
//           style={{
//             width: SCREEN_WIDTH * 0.9,
//             height: hp(25),
//             justifyContent: 'center',
//             alignItems: 'center',
//             backgroundColor: colors.white,
//           }}>
//           <Loader />
//         </View>
//       ) : (
//         <MapView
//           ref={mapCameraRef}
//           initialRegion={{
//             latitude: latitude,
//             longitude: longitude,
//             latitudeDelta: 28.679079,
//             longitudeDelta: 77.06971,
//           }}
//           provider={PROVIDER_GOOGLE}
//           loadingEnabled
//           zoomControlEnabled
//           key={GOOGLE_API_KEY}
//           showsUserLocation={true}
//           moveOnMarkerPress
//           // onRegionChangeComplete={onRegionDidChange}
//           onPress={(e: any) => {
//             if (!isEdit) return;
//             const {latitude, longitude} = e.nativeEvent.coordinate;
//             handleInputChange(latitude, longitude);
//           }}
//           onMapReady={() => {
//             // setIsMapLoaded(true);
//             if (mapCameraRef?.current && latitude && longitude) {
//               mapCameraRef?.current?.setCamera({
//                 center: {
//                   latitude: Number(formValues[field.id]?.split(',')[0]),
//                   longitude: Number(formValues[field.id]?.split(',')[1]),
//                   latitudeDelta: 28.679079,
//                   longitudeDelta: 77.06971,
//                 },
//                 zoom: 11, // Adjust zoom level
//                 animation: {
//                   duration: 1000, // Duration of the animation
//                   easing: () => {},
//                 },
//               });
//             }
//           }}
//           style={{flex: 1}}>
//           {formValues[field.id] && (
//             <Marker
//               coordinate={{
//                 latitude: latitude,
//                 longitude: longitude,
//               }}
//             />
//           )}
//         </MapView>
//       )}
//     </>
//   );
// };

// export default CustomMapView;

// const getGlobalStyles = ({colors}: any) => {
//   return StyleSheet.create({});
// };
