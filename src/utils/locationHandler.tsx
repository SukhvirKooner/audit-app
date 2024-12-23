import Geolocation from 'react-native-geolocation-service';
import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import {promptForEnableLocationIfNeeded} from 'react-native-android-location-enabler';
import {GOOGLE_API_KEY} from './apiConstants';

export const requestLocationPer = async (onSuccess: any, onFail: any) => {
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization('whenInUse')
      .then(() => {
        getCurrentPosition(
          data => {
            if (onSuccess) onSuccess(data);
          },
          error => {
            if (onFail) onFail(error);
            _openAppSetting();
          },
        );
      })
      .catch(error => {
        if (onFail) onFail(error);
        console.log('error', error);
        _openAppSetting();
      });
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        //@ts-ignore
        {
          title: 'Location Access Required',
          message: 'This App needs to Access your location',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await locationEnabler(
          isEnabled => {
            if (isEnabled) {
              getCurrentPosition(
                data => {
                  if (onSuccess) onSuccess(data);
                },
                error => {
                  console.log('location error', error);
                  if (onFail) onFail(error);
                },
              );
            }
          },
          err => {
            if (onFail) onFail(err);
            loactionOffModal();
          },
        );
      } else {
        if (onFail) onFail();
        _openAppSetting();
      }
    } catch (err) {
      if (onFail) onFail(err);
      _openAppSetting();
    }
  }
};

export const loactionOffModal = () => {
  Alert.alert('Location Permission', 'Please turn on location services', [
    {
      text: 'Ok',
      onPress: () => {
        locationEnabler(
          () => {},
          () => {},
        );
      },
    },
  ]);
};

// export const locationEnabler = async (onSuccess: any, onFail: any) => {
//   if (Platform.OS === 'android') {
//     await promptForEnableLocationIfNeeded()
//       .then(res => {
//         if (onSuccess) onSuccess(true);
//         // The user has accepted to enable the location services
//         // data can be :
//         //  - "already-enabled" if the location services has been already enabled
//         //  - "enabled" if user has clicked on OK button in the popup
//       })
//       .catch(err => {
//         if (onFail) onFail(err);
//         // The user has not accepted to enable the location services or something went wrong during the process
//         // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
//         // codes :
//         //  - ERR00 : The user has clicked on Cancel button in the popup
//         //  - ERR01 : If the Settings change are unavailable
//         //  - ERR02 : If the popup has failed to open
//         //  - ERR03 : Internal error
//       });
//   }
// };

export const requestLocationPermission = async (
  onSuccess: (res: any) => void,
  onFail: (err: any) => void,
) => {
  if (Platform.OS === 'ios') {
    getCurrentPosition(
      data => {
        if (onSuccess) {
          onSuccess(data);
        }
      },
      error => {
        if (onFail) {
          onFail(error);
        }
        // _openAppSetting();
      },
    );
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        // @ts-ignore
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        locationEnabler(
          isEnabled => {
            if (isEnabled) {
              getCurrentPosition(
                data => {
                  if (onSuccess) {
                    onSuccess(data);
                  }
                },
                error => {
                  if (onFail) {
                    onFail(error);
                  }
                },
              );
            }
          },
          err => {
            if (onFail) {
              onFail(err);
            }
            locationOffModal();
          },
        );
      } else {
        if (onFail) {
          onFail(true);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }
};

const getCurrentPosition = async (
  onSuccess: (res: any) => void,
  onFail: (err: any) => void,
) => {
  Geolocation.getCurrentPosition(
    async pos => {
      const crd = pos.coords;
      let position = {
        latitude: crd.latitude,
        longitude: crd.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      if (onSuccess) {
        onSuccess(position);
      }
    },
    error => {
      if (onFail) {
        onFail(error);
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 60000,
      maximumAge: 10000,
    },
  );
};

export const locationEnabler = async (
  onSuccess?: (res: any) => void,
  onFail?: (err: any) => void,
) => {
  if (Platform.OS === 'android') {
    await promptForEnableLocationIfNeeded()
      .then(() => {
        if (onSuccess) {
          onSuccess(true);
        }
        // The user has accepted to enable the location services
        // data can be :
        //  - "already-enabled" if the location services has been already enabled
        //  - "enabled" if user has clicked on OK button in the popup
      })
      .catch(err => {
        if (onFail) {
          onFail(err);
        }
        // The user has not accepted to enable the location services or something went wrong during the process
        // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
        // codes :
        //  - ERR00 : The user has clicked on Cancel button in the popup
        //  - ERR01 : If the Settings change are unavailable
        //  - ERR02 : If the popup has failed to open
        //  - ERR03 : Internal error
      });
  }
};

export const locationOffModal = () => {
  Alert.alert('Location Permission', 'Please turn on location services', [
    {
      text: 'Ok',
      onPress: () => {
        locationEnabler();
      },
    },
  ]);
};

export const _openAppSetting = () => {
  Alert.alert(
    'Location Permission',
    'Please allow app to access your location',
    [
      {
        text: 'Setting',
        onPress: () => Linking.openSettings(),
      },
      {
        text: 'cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ],
  );
};

export const getAddress = async (
  region: any,
  onSuccess?: any,
  onFailure?: any,
) => {
  const headersList = {};
  let url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${region?.latitude},${region?.longitude}&api_key=${GOOGLE_API_KEY}`;
  fetch(url, {
    method: 'GET',
    headers: headersList,
  })
    .then(function (response) {
      return response.json();
    })
    .then(async data => {
      onSuccess(data);
    })
    .catch(error => {
      onFailure(error);
    });
};
