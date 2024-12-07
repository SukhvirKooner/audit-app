/* eslint-disable no-useless-escape */
// import Snackbar from 'react-native-snackbar';

import Toast from 'react-native-toast-message';
import {navigationRef} from '../navigation/RootContainer';

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

export const successToast = (message: string) => {
  Toast.show({type: 'success', text1: message});
};

export const errorToast = (message: string) => {
  Toast.show({type: 'error', text1: message});
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
    subtitle: '112 Ongoing',
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
