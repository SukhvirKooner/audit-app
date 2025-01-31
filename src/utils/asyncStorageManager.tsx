import AsyncStorage from '@react-native-async-storage/async-storage';

export const asyncKeys = {
  // clear in logout time
  token: '@token',
  is_dark_theme: '@is_dark_theme',
  user_info: '@user_info',

  // no clear in logout time
  fcm_token: '@fcm_token',
  fontSize: '@fontSize',

  audits_list: '@audits_list',
  template_data: '@template_data',
  template_fill_data: '@template_fill_data',

  create_template_data: '@create_template_data',
};

export const clearAsync = async () => {
  await AsyncStorage.multiRemove([
    asyncKeys.token,
    asyncKeys.user_info,
    asyncKeys.is_dark_theme,
    // asyncKeys.fcm_token,
    // asyncKeys.fontSize,
  ]);
};

export const clearOfflineAsync = async () => {
  await AsyncStorage.multiRemove([
    asyncKeys.audits_list,
    asyncKeys.template_data,
    asyncKeys.template_fill_data,
  ]);
};

export const setAsyncCreateTemplateData = async (data: any) => {
  console.log('dasdsadasdasdasdd', data);

  await AsyncStorage.setItem(
    asyncKeys.create_template_data,
    JSON.stringify(data),
  );
};

export const setAsyncGetTemplateData = async () => {
  const data = await AsyncStorage.getItem(asyncKeys.create_template_data);
  if (data) {
    return JSON.parse(data);
  } else {
    return [];
  }
};

export const setAsyncAudit = async (data: string) => {
  await AsyncStorage.setItem(asyncKeys.audits_list, JSON.stringify(data));
};

export const getAsyncAudit = async () => {
  const data = await AsyncStorage.getItem(asyncKeys.audits_list);
  if (data) {
    return JSON.parse(data);
  } else {
    return [];
  }
};

export const setAsyncTemplate = async (data: any) => {
  await AsyncStorage.setItem(asyncKeys.template_data, JSON.stringify(data));
};

export const getAsyncTemplate = async () => {
  const data = await AsyncStorage.getItem(asyncKeys.template_data);
  if (data) {
    return JSON.parse(data);
  } else {
    return [];
  }
};

export const setAsyncTemplateFillData = async (data: any) => {
  await AsyncStorage.setItem(
    asyncKeys.template_fill_data,
    JSON.stringify(data),
  );
};

export const getAsyncTemplateFillData = async () => {
  const data = await AsyncStorage.getItem(asyncKeys.template_fill_data);
  if (data) {
    return JSON.parse(data);
  } else {
    return [];
  }
};

export const setAsyncToken = async (token: string) => {
  await AsyncStorage.setItem(asyncKeys.token, JSON.stringify(token));
};

export const setAsyncUserInfo = async (user: any) => {
  await AsyncStorage.setItem(asyncKeys.user_info, JSON.stringify(user));
};

export const getAsyncUserInfo = async () => {
  const userInfo = await AsyncStorage.getItem(asyncKeys.user_info);
  if (userInfo) {
    return JSON.parse(userInfo);
  } else {
    return null;
  }
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

export const setAsyncFontSize = async (token: any) => {
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
