import AsyncStorage from '@react-native-async-storage/async-storage';

export const asyncKeys = {
  // clear in logout time
  token: '@token',
  is_dark_theme: '@is_dark_theme',
  // no clear in logout time
  fcm_token: '@fcm_token',
  fontSize: '@fontSize',
};

export const clearAsync = async () => {
  await AsyncStorage.multiRemove([asyncKeys.token]);
};

export const setAsyncToken = async (token: string) => {
  await AsyncStorage.setItem(asyncKeys.token, JSON.stringify(token));
};

export const getAsyncToken = async () => {
  const token = await AsyncStorage.getItem(asyncKeys.token);
  if (token) {
    return 'Bearer ' + JSON.parse(token);
  } else {
    return null;
  }
};

//fontSize

export const setAsyncFontSize = async token => {
  await AsyncStorage.setItem(asyncKeys.fontSize, JSON.stringify(token));
};

export const getAsyncFontSize = async () => {
  const token = await AsyncStorage.getItem(asyncKeys.fontSize);
  if (token) {
    return JSON.parse(token);
  } else {
    return null;
  }
};
