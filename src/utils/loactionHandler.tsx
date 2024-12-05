// import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
// import Geolocation from '@react-native-community/geolocation';

// export const requestLocationPermission = async (
//   onSucess: (res: any) => void,
//   onFail: (err: any) => void,
// ) => {
//   if (Platform.OS === 'ios') {
//     getCurrentPosition(
//       data => {
//         if (onSucess) onSucess(data);
//       },
//       error => {
//         if (onFail) onFail(error);
//         _openAppSetting();
//       },
//     );
//   } else {
//     try {
//       const granted = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
//       ]);
//       if (
//         granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
//           PermissionsAndroid.RESULTS.GRANTED &&
//         granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
//           PermissionsAndroid.RESULTS.GRANTED
//       ) {
//         getCurrentPosition(
//           data => {
//             if (onSucess) onSucess(data);
//           },
//           error => {
//             if (onFail) onFail(error);
//           },
//         );
//       } else {
//         _openAppSetting();
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   }
// };

// const getCurrentPosition = async (
//   onSucess: (res: any) => void,
//   onFail: (err: any) => void,
// ) => {
//   Geolocation.getCurrentPosition(
//     async pos => {
//       const crd = pos.coords;
//       let position = {
//         latitude: crd.latitude,
//         longitude: crd.longitude,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//       };
//       if (onSucess) onSucess(position);
//     },
//     error => {
//       if (onFail) onFail(error);
//     },
//     {
//       enableHighAccuracy: true,
//       timeout: 15000,
//       maximumAge: 1000,
//     },
//   );
// };

// export const _openAppSetting = () => {
//   Alert.alert(
//     'Location Permission',
//     'Please allow app to access your location',
//     [
//       {
//         text: 'Setting',
//         onPress: () => Linking.openSettings(),
//       },
//       {
//         text: 'cancel',
//         onPress: () => console.log('Cancel Pressed'),
//         style: 'cancel',
//       },
//     ],
//   );
// };
