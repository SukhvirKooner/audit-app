import {
  Image,
  StyleSheet,
  Text,
  ViewStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {light_theme} from '../theme/colors';
import {commonFontStyle, hp, SCREEN_WIDTH, wp} from '../theme/fonts';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GOOGLE_API_KEY} from '../utils/apiConstants';
import Loader from './Loader';
import {useTheme} from '@react-navigation/native';
import MapplsGL from 'mappls-map-react-native';
import {Icons} from '../theme/images';

type Props = {
  title: string;
  extraStyle?: ViewStyle;
  onPress?: () => void;
  titleColor?: any;
  type?: 'blue' | 'gray';
  disabled?: boolean;
  leftIcon?: any;
};

const CustomMapView = ({
  titleColor,
  title,
  extraStyle,
  onPress,
  type = 'blue',
  leftIcon,
  disabled = false,
  latitude,
  longitude,
  formValues,
  field,
  handleInputChange,
  isEdit,
}: Props) => {
  const mapCameraRef = useRef<any>(null);
  const {colors}: any = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const [isMapLoaded, setIsMapLoaded] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setIsMapLoaded(false);
    }, 1500);
  }, []);

  const onMapLoad = () => {
    setIsMapLoaded(false);
    setTimeout(() => {
      setLocation([longitude, latitude]);
    }, 2000);
  };

  useEffect(() => {
    if (mapCameraRef?.current && latitude && longitude) {
      mapCameraRef?.current?.setCamera({
        center: {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 28.679079,
          longitudeDelta: 77.06971,
        },
        zoom: 10, // Adjust zoom level
        animation: {
          duration: 1000, // Duration of the animation
          easing: () => {},
        },
      });
    }
  }, [latitude, longitude]);

  const handleMapClick = async event => {
    if (!isEdit) return;
    const {geometry} = event;
    const {coordinates} = geometry;

    handleInputChange(coordinates[1], coordinates[0]);
    setLocation([coordinates[0], coordinates[1]]);
    console.log('Selected Location:', coordinates);
  };

  return (
    <>
      {isMapLoaded ? (
        <View
          style={{
            width: SCREEN_WIDTH * 0.9,
            height: hp(25),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.white,
          }}>
          <Loader />
        </View>
      ) : (
        <MapplsGL.MapView
          onPress={handleMapClick}
          onDidFinishLoadingMap={onMapLoad}
          style={{flex: 1}}>
          <MapplsGL.Camera
            ref={mapCameraRef}
            zoomLevel={9}
            centerCoordinate={[longitude, latitude]}
          />
          {/* <MapplsGL.UserLocation animated={true} visible={true} /> */}
          {location && (
            <MapplsGL.PointAnnotation coordinate={[location[0], location[1]]}>
              <Image
                resizeMode="contain"
                style={{height: wp(7), width: wp(7)}}
                source={Icons.ic_pin}
              />
            </MapplsGL.PointAnnotation>
          )}
        </MapplsGL.MapView>
        // <MapView
        //   ref={mapCameraRef}
        //   initialRegion={{
        //     latitude: latitude,
        //     longitude: longitude,
        //     latitudeDelta: 28.679079,
        //     longitudeDelta: 77.06971,
        //   }}
        //   provider={PROVIDER_GOOGLE}
        //   loadingEnabled
        //   zoomControlEnabled
        //   key={GOOGLE_API_KEY}
        //   showsUserLocation={true}
        //   moveOnMarkerPress
        //   // onRegionChangeComplete={onRegionDidChange}
        //   onPress={(e: any) => {
        //     if (!isEdit) return;
        //     const {latitude, longitude} = e.nativeEvent.coordinate;
        //     handleInputChange(latitude, longitude);
        //   }}
        //   onMapReady={() => {
        //     // setIsMapLoaded(true);
        //     if (mapCameraRef?.current && latitude && longitude) {
        //       mapCameraRef?.current?.setCamera({
        //         center: {
        //           latitude: Number(formValues[field.id]?.split(',')[0]),
        //           longitude: Number(formValues[field.id]?.split(',')[1]),
        //           latitudeDelta: 28.679079,
        //           longitudeDelta: 77.06971,
        //         },
        //         zoom: 11, // Adjust zoom level
        //         animation: {
        //           duration: 1000, // Duration of the animation
        //           easing: () => {},
        //         },
        //       });
        //     }
        //   }}
        //   style={{flex: 1}}>
        //   {formValues[field.id] && (
        //     <Marker
        //       coordinate={{
        //         latitude: latitude,
        //         longitude: longitude,
        //       }}
        //     />
        //   )}
        // </MapView>
      )}
    </>
  );
};

export default CustomMapView;

const getGlobalStyles = ({colors}: any) => {
  return StyleSheet.create({});
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
