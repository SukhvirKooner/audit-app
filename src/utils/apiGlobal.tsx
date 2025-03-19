/* eslint-disable curly */
import axios from 'axios';
import {api} from './apiConstants';
import {clearAsync, getAsyncToken} from './asyncStorageManager';
import {SCREENS} from '../navigation/screenNames';
import {navigationRef} from '../navigation/RootContainer';
import {dispatchAction} from '../redux/hooks';
import {IS_LOADING} from '../redux/actionTypes';
import {errorToast} from './commonFunction';

interface makeAPIRequestProps {
  method?: any;
  url?: any;
  data?: any;
  headers?: any;
  params?: any;
}

export const makeAPIRequest = ({
  method,
  url,
  data,
  headers,
  params,
}: makeAPIRequestProps) =>
  new Promise((resolve, reject) => {
    const option = {
      method,
      baseURL: api.BASE_URL,
      url,
      data,
      headers,
      params,
    };
    console.log('<===option==>', JSON.stringify(option));
    axios(option)
      .then((response: any) => {
        // console.log('response-->', response);
        if (response.status === 200 || response.status === 201) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch((error: any) => {
        console.log('error?.response?', error?.response);
        if (error?.response?.status === 401) {
          clearAsync();
          // errorToast(error?.response?.data?.message);
          navigationRef?.current?.reset({
            index: 1,
            routes: [{name: SCREENS.LoginScreen}],
          });
        } else {
          // infoToast("Something went wrong, please try again.");
        }
        reject(error);
      });
  });

export const makeAPIRequestNew = ({
  method,
  url,
  data,
  headers,
  params,
}: makeAPIRequestProps) =>
  new Promise((resolve, reject) => {
    const option = {
      method,
      url,
      data,
      headers,
      params,
    };
    console.log('<===option==>', option);
    axios(option)
      .then((response: any) => {
        // console.log('response-->', response);
        if (response.status === 200 || response.status === 201) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch((error: any) => {
        console.log('error?.response?', error?.response);
        reject(error);
      });
  });

export const setAuthorization = async (authToken: any) => {
  // const token = await getAsyncToken();
  // console.log('token', token);
  // console.log('authToken', authToken);
  // if (authToken === '') {
  //   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // } else {
  //   axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  // }
  // axios.defaults.headers.common['Cookie'] =
  //   'csrftoken=2etmNDs2TbhR9edMb7POwYsXxW6eVPPS';
};

export const removeAuthorization = async () => {
  await clearAsync();
  delete axios.defaults.headers.common.Authorization;
};

export const handleSuccessRes = (
  res: any,
  onSuccess: any,
  onFailure: any,
  dispatch: any,
  fun?: () => void,
) => {
  if (res?.status === 200 || res?.status === 201) {
    dispatchAction(dispatch, IS_LOADING, false);
    if (res?.data.status) {
      if (fun) fun();
      if (onSuccess) onSuccess(res?.data);
    } else {
      if (onFailure) onFailure(res?.data);
      errorToast(res?.data?.message);
    }
  }
};

export const handleErrorRes = (
  err: any,
  onFailure: any,
  dispatch: any,
  fun?: () => void,
) => {
  if (err?.response?.status === 401) {
    dispatchAction(dispatch, IS_LOADING, false);
    removeAuthorization();
    navigationRef.reset({
      index: 0,
      routes: [{name: SCREENS.LoginScreen}],
    });
    errorToast('Please login again');
  } else {
    dispatchAction(dispatch, IS_LOADING, false);
    if (err?.response?.data?.errors) {
      errorToast(err?.response?.data?.message);
    } else if (err?.response?.data?.detail) {
      errorToast(err?.response?.data?.detail);
    } else if (err?.response?.data?.username) {
      errorToast(err?.response?.data?.username);
    } else if (err?.response?.data?.message) {
      errorToast(err?.response?.data?.message);
    } else if (err?.response?.data?.error) {
      errorToast(err?.response?.data?.error?.message);
    } else if (err?.message) {
      errorToast(err?.message);
    } else {
      errorToast('Something went wrong! Please try again');
    }
    if (fun) {
      fun();
    }
    if (onFailure) {
      onFailure(err?.response);
    }
  }
};
