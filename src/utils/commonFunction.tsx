/* eslint-disable no-useless-escape */
// import Snackbar from 'react-native-snackbar';
import piexif from 'piexifjs';

import Toast from 'react-native-toast-message';
import {navigationRef} from '../navigation/RootContainer';
import {getUserDetails} from '../service/AuthServices';
import {getAudits, getGroupsList} from '../service/AuditService';

export const emailCheck = (email: string) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(email) === false) {
    return false;
  } else {
    return true;
  }
};

export const numberCheck = (string: string) => {
  let reg = /^(?=.*[0-9]).+$/;
  return reg.test(string);
};

export const specialCarCheck = (string: string) => {
  let reg = /^(?=.*[!@#$%^&*()]).+$/;
  return reg.test(string);
};

export const UpperCaseCheck = (string: string) => {
  let reg = /^(?=.*[A-Z]).+$/;
  return reg.test(string);
};

export const nameCheck = (name: string) => {
  let reg = /^([a-zA-Z ]){2,30}$/;
  if (reg.test(name) === false) {
    return false;
  } else {
    return true;
  }
};

export const passwordCheck = (string: string) => {
  let reg = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  return reg.test(string);
};

export const resetNavigation = (name: string, _undefined: undefined) => {
  navigationRef.reset({
    index: 0,
    routes: [{name: name}],
  });
};

export const navigateTo = (name: string, params?: any | undefined) => {
  navigationRef.navigate(name, params);
};

export const successToast = (message: string) => {
  Toast.show({type: 'success', text1: message});
};

export const errorToast = (message: string) => {
  Toast.show({type: 'error', text1: message});
};
export const editEnableToast = (message: string) => {
  Toast.show({type: 'enable', text1: message});
};

export const editDisableToast = (message: string) => {
  Toast.show({type: 'disable', text1: message});
};

// export const successToast = (message: string) => {
//   Snackbar.show({
//     text: message,
//     duration: Snackbar.LENGTH_SHORT,
//     backgroundColor: 'green',
//   });
// };

// export const errorToast = (message: string) => {
//   Snackbar.show({
//     text: message,
//     duration: Snackbar.LENGTH_SHORT,
//     backgroundColor: '#FF0000',
//   });
// };

// export const infoToast = (message: string) => {
//   // Toast.show({type: 'info', text1: message});
//   Snackbar.show({
//     text: message,
//     duration: Snackbar.LENGTH_SHORT,
//     backgroundColor: '#000',
//   });
// };

export const homeScreenList = [
  {
    title: 'Active Audits',
    subtitle: 'Ongoing',
    progress: '40',
    status: 'Complete',
  },
  // {
  //   title: 'Critical Alerts',
  //   subtitle: '112 Ongoing',
  //   progress: '10',
  //   status: 'Complete',
  // },
  // {
  //   title: 'Deadlines',
  //   subtitle: '3 Today',
  //   progress: '90',
  //   status: 'Complete',
  // },
  // {
  //   title: 'Issues',
  //   subtitle: '3 Raised Today',
  //   progress: '10',
  //   status: 'Complete',
  // },
];

export const commonApiCall = (dispatch: any) => {
  dispatch(getUserDetails({}));
  dispatch(getAudits({}));
  dispatch(getGroupsList({}));
};

import {Alert, NativeModules} from 'react-native';

const {ImageMetadataModule} = NativeModules;

export const openImagePicker1 = async ({params, onSucess, onFail}) => {
  try {
    const result = await ImageMetadataModule.openGooglePhotos();
    const data = JSON.parse(result);
    console.log('openImagePicker1', data);

    let obj = {
      ...data,
      uri: data?.uri,
      name: data?.fileName,
      type: data?.fileType,
      base64: data?.base64,
    };

    onSucess(obj);
  } catch (error) {
    onFail();
    Alert.alert('Error', error.message);
  }
};

// export const addMetadataToBase64 = (base64, {latitude, longitude}) => {
//   try {
//     // Decode base64 to binary
//     let binaryData = atob(base64);

//     // Create EXIF metadata
//     let exifObj = {
//       GPS: {
//         [piexif.GPSIFD.GPSLatitudeRef]: latitude >= 0 ? 'N' : 'S',
//         [piexif.GPSIFD.GPSLatitude]: convertToDMS(latitude),
//         [piexif.GPSIFD.GPSLongitudeRef]: longitude >= 0 ? 'E' : 'W',
//         [piexif.GPSIFD.GPSLongitude]: convertToDMS(longitude),
//       },
//     };

//     // Insert EXIF data into the image
//     let exifBytes = piexif.dump(exifObj);
//     let newBase64 = piexif.insert(
//       exifBytes,
//       'data:image/jpeg;base64,' + base64,
//     );

//     return newBase64.split(',')[1]; // Remove the data URI prefix
//   } catch (error) {
//     console.error('Error updating EXIF metadata:', error);
//     return base64;
//   }
// };

// // Helper function: Convert decimal coordinates to DMS format
// const convertToDMS = decimal => {
//   decimal = Math.abs(decimal);
//   let degrees = Math.floor(decimal);
//   let minutes = Math.floor((decimal - degrees) * 60);
//   let seconds = (decimal - degrees - minutes / 60) * 3600 * 100;
//   return [
//     [degrees, 1],
//     [minutes, 1],
//     [seconds, 100],
//   ];
// };

export const addMetadataToBase64 = (
  base64,
  exifData,
  {latitude, longitude, timestamp},
  additionalExif,
) => {
  try {
    // Load existing EXIF or create a new one
    let exifObj;
    if (exifData && typeof exifData === 'string') {
      try {
        exifObj = piexif.load(exifData);
      } catch (e) {
        console.warn('EXIF load failed, creating new EXIF metadata.');
        exifObj = {'0th': {}, Exif: {}, GPS: {}};
      }
    } else {
      exifObj = {'0th': {}, Exif: {}, GPS: {}};
    }

    // Ensure GPS and Exif sections exist
    if (!exifObj['GPS']) exifObj['GPS'] = {};
    if (!exifObj['Exif']) exifObj['Exif'] = {};
    if (!exifObj['0th']) exifObj['0th'] = {};

    // 🛰️ Add GPS Data
    exifObj['GPS'][piexif.GPSIFD.GPSLatitudeRef] = latitude >= 0 ? 'N' : 'S';
    exifObj['GPS'][piexif.GPSIFD.GPSLatitude] = convertToDMS(latitude);
    exifObj['GPS'][piexif.GPSIFD.GPSLongitudeRef] = longitude >= 0 ? 'E' : 'W';
    exifObj['GPS'][piexif.GPSIFD.GPSLongitude] = convertToDMS(longitude);
    exifObj['GPS'][piexif.GPSIFD.GPSAltitude] = [0, 1];
    exifObj['GPS'][piexif.GPSIFD.GPSMapDatum] = 'WGS-84';

    // 🕒 Add Timestamp
    const dateString = formatExifDate(timestamp);
    exifObj['Exif'][piexif.ExifIFD.DateTimeOriginal] = dateString;
    exifObj['GPS'][piexif.GPSIFD.GPSDateStamp] = dateString.split(' ')[0];
    exifObj['GPS'][piexif.GPSIFD.GPSTimeStamp] = convertToDMS(
      new Date(timestamp).getUTCHours(),
    );

    // 📷 Add Additional EXIF Data
    if (additionalExif) {
      if (additionalExif.ImageWidth)
        exifObj['0th'][piexif.ImageIFD.ImageWidth] = parseInt(
          additionalExif.ImageWidth,
        );
      if (additionalExif.ImageHeight)
        exifObj['0th'][piexif.ImageIFD.ImageLength] = parseInt(
          additionalExif.ImageHeight,
        );
      if (additionalExif.Make)
        exifObj['0th'][piexif.ImageIFD.Make] = additionalExif.Make;
      if (additionalExif.Model)
        exifObj['0th'][piexif.ImageIFD.Model] = additionalExif.Model;
      if (additionalExif.FNumber)
        exifObj['Exif'][piexif.ExifIFD.FNumber] = parseFraction(
          additionalExif.FNumber,
        );
      if (additionalExif.ExposureTime)
        exifObj['Exif'][piexif.ExifIFD.ExposureTime] = parseFraction(
          additionalExif.ExposureTime,
        );
      if (additionalExif.ISOSpeedRatings)
        exifObj['Exif'][piexif.ExifIFD.ISOSpeedRatings] = parseInt(
          additionalExif.ISOSpeedRatings,
        );
      if (additionalExif.FocalLength)
        exifObj['Exif'][piexif.ExifIFD.FocalLength] = parseFraction(
          additionalExif.FocalLength,
        );
      if (additionalExif.Orientation)
        exifObj['0th'][piexif.ImageIFD.Orientation] = parseInt(
          additionalExif.Orientation,
        );
      if (additionalExif.DateTime)
        exifObj['0th'][piexif.ImageIFD.DateTime] = additionalExif.DateTime;
    }

    console.log('Updated EXIF:', exifObj);

    // Convert EXIF data to binary format
    let exifBytes = piexif.dump(exifObj);

    // Insert updated EXIF into the base64 image
    let newBase64 = piexif.insert(
      exifBytes,
      'data:image/jpeg;base64,' + base64,
    );

    return newBase64.split(',')[1]; // Remove `data:image/jpeg;base64,` prefix
  } catch (error) {
    console.error('Error updating EXIF metadata:', error);
    return base64;
  }
};

// 📌 Convert decimal coordinates to DMS format
const convertToDMS = decimal => {
  decimal = Math.abs(decimal);
  let degrees = Math.floor(decimal);
  let minutes = Math.floor((decimal - degrees) * 60);
  let seconds = (decimal - degrees - minutes / 60) * 3600 * 100;
  return [
    [degrees, 1],
    [minutes, 1],
    [seconds, 100],
  ];
};

// 📌 Convert Timestamp to EXIF Format
const formatExifDate = timestamp => {
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
};

// 📌 Convert Fraction String to EXIF Rational Format
const parseFraction = value => {
  if (typeof value === 'string' && value.includes('/')) {
    const parts = value.split('/');
    return [parseInt(parts[0]), parseInt(parts[1])];
  }
  return [parseInt(value), 1];
};
