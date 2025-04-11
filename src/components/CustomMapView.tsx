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
// import {commonFontStyle, hp, SCREEN_WIDTH, wp} from '../theme/fonts';
// import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
// import {GOOGLE_API_KEY} from '../utils/apiConstants';
// import Loader from './Loader';
// import {useTheme} from '@react-navigation/native';
// import MapplsGL from 'mappls-map-react-native';
// import {Icons} from '../theme/images';

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
//   const [location, setLocation] = useState(null);

//   useEffect(() => {
//     setTimeout(() => {
//       setIsMapLoaded(false);
//     }, 1500);
//   }, []);

//   const onMapLoad = () => {
//     setIsMapLoaded(false);
//     setTimeout(() => {
//       setLocation([longitude, latitude]);
//     }, 2000);
//   };

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

//   const handleMapClick = async event => {
//     if (!isEdit) return;
//     const {geometry} = event;
//     const {coordinates} = geometry;

//     handleInputChange(coordinates[1], coordinates[0]);
//     setLocation([coordinates[0], coordinates[1]]);
//     console.log('Selected Location:', coordinates);
//   };

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
//         <MapplsGL.MapView
//           onPress={handleMapClick}
//           onDidFinishLoadingMap={onMapLoad}
//           style={{flex: 1}}>
//           <MapplsGL.Camera
//             ref={mapCameraRef}
//             zoomLevel={9}
//             centerCoordinate={[longitude, latitude]}
//           />
//           {/* <MapplsGL.UserLocation animated={true} visible={true} /> */}
//           {location && (
//             <MapplsGL.PointAnnotation coordinate={[location[0], location[1]]}>
//               <Image
//                 resizeMode="contain"
//                 style={{height: wp(7), width: wp(7)}}
//                 source={Icons.ic_pin}
//               />
//             </MapplsGL.PointAnnotation>
//           )}
//         </MapplsGL.MapView>
//         // <MapView
//         //   ref={mapCameraRef}
//         //   initialRegion={{
//         //     latitude: latitude,
//         //     longitude: longitude,
//         //     latitudeDelta: 28.679079,
//         //     longitudeDelta: 77.06971,
//         //   }}
//         //   provider={PROVIDER_GOOGLE}
//         //   loadingEnabled
//         //   zoomControlEnabled
//         //   key={GOOGLE_API_KEY}
//         //   showsUserLocation={true}
//         //   moveOnMarkerPress
//         //   // onRegionChangeComplete={onRegionDidChange}
//         //   onPress={(e: any) => {
//         //     if (!isEdit) return;
//         //     const {latitude, longitude} = e.nativeEvent.coordinate;
//         //     handleInputChange(latitude, longitude);
//         //   }}
//         //   onMapReady={() => {
//         //     // setIsMapLoaded(true);
//         //     if (mapCameraRef?.current && latitude && longitude) {
//         //       mapCameraRef?.current?.setCamera({
//         //         center: {
//         //           latitude: Number(formValues[field.id]?.split(',')[0]),
//         //           longitude: Number(formValues[field.id]?.split(',')[1]),
//         //           latitudeDelta: 28.679079,
//         //           longitudeDelta: 77.06971,
//         //         },
//         //         zoom: 11, // Adjust zoom level
//         //         animation: {
//         //           duration: 1000, // Duration of the animation
//         //           easing: () => {},
//         //         },
//         //       });
//         //     }
//         //   }}
//         //   style={{flex: 1}}>
//         //   {formValues[field.id] && (
//         //     <Marker
//         //       coordinate={{
//         //         latitude: latitude,
//         //         longitude: longitude,
//         //       }}
//         //     />
//         //   )}
//         // </MapView>
//       )}
//     </>
//   );
// };

// export default CustomMapView;

// const getGlobalStyles = ({colors}: any) => {
//   return StyleSheet.create({});
// };

// // import {
// //   Image,
// //   StyleSheet,
// //   Text,
// //   ViewStyle,
// //   TouchableOpacity,
// //   View,
// // } from 'react-native';
// // import React, {useEffect, useRef, useState} from 'react';
// // import {light_theme} from '../theme/colors';
// // import {commonFontStyle, hp, SCREEN_WIDTH} from '../theme/fonts';
// // import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
// // import {GOOGLE_API_KEY} from '../utils/apiConstants';
// // import Loader from './Loader';
// // import {useTheme} from '@react-navigation/native';

// // type Props = {
// //   title: string;
// //   extraStyle?: ViewStyle;
// //   onPress?: () => void;
// //   titleColor?: any;
// //   type?: 'blue' | 'gray';
// //   disabled?: boolean;
// //   leftIcon?: any;
// // };

// // const CustomMapView = ({
// //   titleColor,
// //   title,
// //   extraStyle,
// //   onPress,
// //   type = 'blue',
// //   leftIcon,
// //   disabled = false,
// //   latitude,
// //   longitude,
// //   formValues,
// //   field,
// //   handleInputChange,
// //   isEdit,
// // }: Props) => {
// //   const mapCameraRef = useRef<any>(null);
// //   const {colors}: any = useTheme();
// //   const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
// //   const [isMapLoaded, setIsMapLoaded] = useState(true);

// //   useEffect(() => {
// //     setTimeout(() => {
// //       setIsMapLoaded(false);
// //     }, 1500);
// //   }, []);

// //   useEffect(() => {
// //     if (mapCameraRef?.current && latitude && longitude) {
// //       mapCameraRef?.current?.setCamera({
// //         center: {
// //           latitude: latitude,
// //           longitude: longitude,
// //           latitudeDelta: 28.679079,
// //           longitudeDelta: 77.06971,
// //         },
// //         zoom: 10, // Adjust zoom level
// //         animation: {
// //           duration: 1000, // Duration of the animation
// //           easing: () => {},
// //         },
// //       });
// //     }
// //   }, [latitude, longitude]);

// //   return (
// //     <>
// //       {isMapLoaded ? (
// //         <View
// //           style={{
// //             width: SCREEN_WIDTH * 0.9,
// //             height: hp(25),
// //             justifyContent: 'center',
// //             alignItems: 'center',
// //             backgroundColor: colors.white,
// //           }}>
// //           <Loader />
// //         </View>
// //       ) : (
// //         <MapView
// //           ref={mapCameraRef}
// //           initialRegion={{
// //             latitude: latitude,
// //             longitude: longitude,
// //             latitudeDelta: 28.679079,
// //             longitudeDelta: 77.06971,
// //           }}
// //           provider={PROVIDER_GOOGLE}
// //           loadingEnabled
// //           zoomControlEnabled
// //           key={GOOGLE_API_KEY}
// //           showsUserLocation={true}
// //           moveOnMarkerPress
// //           // onRegionChangeComplete={onRegionDidChange}
// //           onPress={(e: any) => {
// //             if (!isEdit) return;
// //             const {latitude, longitude} = e.nativeEvent.coordinate;
// //             handleInputChange(latitude, longitude);
// //           }}
// //           onMapReady={() => {
// //             // setIsMapLoaded(true);
// //             if (mapCameraRef?.current && latitude && longitude) {
// //               mapCameraRef?.current?.setCamera({
// //                 center: {
// //                   latitude: Number(formValues[field.id]?.split(',')[0]),
// //                   longitude: Number(formValues[field.id]?.split(',')[1]),
// //                   latitudeDelta: 28.679079,
// //                   longitudeDelta: 77.06971,
// //                 },
// //                 zoom: 11, // Adjust zoom level
// //                 animation: {
// //                   duration: 1000, // Duration of the animation
// //                   easing: () => {},
// //                 },
// //               });
// //             }
// //           }}
// //           style={{flex: 1}}>
// //           {formValues[field.id] && (
// //             <Marker
// //               coordinate={{
// //                 latitude: latitude,
// //                 longitude: longitude,
// //               }}
// //             />
// //           )}
// //         </MapView>
// //       )}
// //     </>
// //   );
// // };

// // export default CustomMapView;

// // const getGlobalStyles = ({colors}: any) => {
// //   return StyleSheet.create({});
// // };





























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
import Loader from './Loader';
import {useTheme} from '@react-navigation/native';
import MapplsGL from 'mappls-map-react-native';
import {Icons} from '../theme/images';

const CustomMapView = ({
  extraStyle,
  onPress,
  titleColor,
  type,
  disabled,
  leftIcon,
  latitude,
  longitude,
  formValues,
  field,
  handleInputChange,
  isEdit = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const mapCameraRef = useRef(null);
  const mapRef = useRef(null);
  const {colors} = useTheme();

  // Constants for default location (Delhi)
  const DEFAULT_LONGITUDE = 77.06971;
  const DEFAULT_LATITUDE = 28.679079;

  // Helper to check if coordinates are valid numbers
  const isValidCoordinate = (coord) => {
    return coord !== undefined && coord !== null && !isNaN(coord);
  };

  // Function to determine if we have valid coordinates
  const hasValidCoordinates = () => {
    return isValidCoordinate(latitude) && isValidCoordinate(longitude);
  };

  useEffect(() => {
    // Initial loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Update location state whenever latitude/longitude props change
  useEffect(() => {
    console.log("Props changed - lat:", latitude, "lng:", longitude);
    
    if (isValidCoordinate(latitude) && isValidCoordinate(longitude)) {
      const newLocation = [longitude, latitude];
      console.log("Setting new location:", newLocation);
      setLocation(newLocation);
    } else {
      console.log("Invalid coordinates, not updating location state");
    }
  }, [latitude, longitude]);

  // Handle map becoming ready
  const handleMapReady = () => {
    console.log("Map is ready");
    setMapReady(true);
    
    // If we have valid coordinates, ensure location is set
    if (hasValidCoordinates()) {
      setLocation([longitude, latitude]);
    }
  };

  // Effect to update camera when location changes and map is ready
  useEffect(() => {
    if (mapReady && mapCameraRef.current && location) {
      console.log("Moving camera to:", location);
      try {
        mapCameraRef.current.setCamera({
          centerCoordinate: location,
          zoomLevel: 11,
          animationDuration: 1000,
        });
      } catch (error) {
        console.error("Error setting camera:", error);
      }
    }
  }, [location, mapReady]);

  const handleMarkerDragEnd = async (event) => {
    try {
      if (!event || !event.geometry || !event.geometry.coordinates) {
        console.error('Invalid marker drag event structure:', event);
        return;
      }
      
      const newCoordinates = event.geometry.coordinates;
      console.log("Marker dragged to:", newCoordinates);
      
      setLocation(newCoordinates);
      
      if (handleInputChange && Array.isArray(newCoordinates) && newCoordinates.length >= 2) {
        // Convert from [longitude, latitude] to separate latitude and longitude values
        handleInputChange(newCoordinates[1], newCoordinates[0]);
      }
    } catch (error) {
      console.error('Error in handleMarkerDragEnd:', error);
    }
  };

  const handleMapPress = (event) => {
    try {
      if (!isEdit) return;
      
      // Safely extract coordinates from the event object
      let coordinates;
      
      // Check for different possible structures of the event
      if (event && event.geometry && event.geometry.coordinates) {
        coordinates = event.geometry.coordinates;
      } else if (event && event.coordinates) {
        coordinates = event.coordinates;
      } else if (event && event.features && event.features.length > 0) {
        coordinates = event.features[0].geometry.coordinates;
      } else if (event && event.nativeEvent && event.nativeEvent.coordinate) {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        coordinates = [longitude, latitude];
      }
      
      if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
        console.error('Could not extract valid coordinates from map press event:', event);
        return;
      }
      
      console.log("Map pressed at:", coordinates);
      setLocation(coordinates);
      
      if (handleInputChange) {
        // Convert from [longitude, latitude] to separate latitude and longitude values
        handleInputChange(coordinates[1], coordinates[0]);
      }
    } catch (error) {
      console.error('Error in handleMapPress:', error);
    }
  };

  const getGlobalStyles = () => {
    return {
      container: {
        flex: 1,
        minHeight: hp(25),
      },
      loadingContainer: {
        width: SCREEN_WIDTH * 0.9,
        height: hp(25),
        backgroundColor: light_theme.white,
        justifyContent: 'center',
        alignItems: 'center',
      },
      markerImage: {
        height: wp(7),
        width: wp(7),
        resizeMode: 'contain',
      },
    };
  };

  const styles = getGlobalStyles();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loader />
      </View>
    );
  }

  // Determine center coordinates for the map
  const centerCoordinate = location || 
    (hasValidCoordinates() ? [longitude, latitude] : [DEFAULT_LONGITUDE, DEFAULT_LATITUDE]);

  console.log("Rendering map with center:", centerCoordinate, "and marker at:", location);

  return (
    <View style={[styles.container, extraStyle]}>
      <MapplsGL.MapView
        ref={mapRef}
        style={{ flex: 1 }}
        onPress={handleMapPress}
        zoomEnabled={true}
        showsUserLocation={true}
        onDidFinishLoadingMap={handleMapReady}
      >
        <MapplsGL.Camera
          ref={mapCameraRef}
          zoomLevel={11}
          centerCoordinate={centerCoordinate}
          animationMode="flyTo"
          animationDuration={1000}
        />
        
        {/* Always render the marker if we have a location */}
        {location && (
          <MapplsGL.PointAnnotation
            key={`marker-${location[0]}-${location[1]}`} // Add key to force re-render
            id="locationMarker"
            coordinate={location}
            draggable={isEdit}
            onDragEnd={handleMarkerDragEnd}
          >
            <Image 
              source={Icons.ic_pin}
              style={styles.markerImage}
            />
          </MapplsGL.PointAnnotation>
        )}
      </MapplsGL.MapView>
    </View>
  );
};

export default CustomMapView;