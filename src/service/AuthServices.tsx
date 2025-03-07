import {ThunkAction} from 'redux-thunk';
import {dispatchAction, RootState} from '../redux/hooks';
import {AnyAction} from 'redux';
import {IS_LOADING, SET_USER_INFO} from '../redux/actionTypes';
import {
  handleErrorRes,
  handleSuccessRes,
  makeAPIRequest,
  setAuthorization,
} from '../utils/apiGlobal';
import {api, GET, POST} from '../utils/apiConstants';
import {
  getAsyncToken,
  setAsyncToken,
  setAsyncUserInfo,
} from '../utils/asyncStorageManager';
import {resetNavigation, successToast} from '../utils/commonFunction';
import {SCREENS} from '../navigation/screenNames';
import {navigationRef} from '../navigation/RootContainer';

interface requestProps {
  data?: any;
  params?: any;
  onSuccess?: (res: any) => void;
  onFailure?: (res: any) => void;
}

export const onUserLogin =
  ({
    data,
    params,
    onSuccess,
    onFailure,
  }: requestProps): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true);
    return makeAPIRequest({method: POST, url: api.login, data: data})
      .then(async (response: any) => {
        dispatchAction(dispatch, IS_LOADING, false);
        if (response?.status === 200) {
          console.log('response-->', response?.data);
          await setAuthorization(response?.data?.access);
          await setAsyncToken(response?.data?.access);
          // await setAsyncUserInfo(response?.data?.user);
          // dispatchAction(dispatch, SET_USER_INFO, response?data?.user);
          resetNavigation(SCREENS.HomeScreen, undefined);
        }
        // handleSuccessRes(response, onSuccess, onFailure, dispatch, async () => {
        //   await setAuthorization(response?.data?.data?.authToken);
        //   await setAsyncToken(response?.data?.data?.authToken);
        //   await setAsyncUserInfo(response?.data?.data?.user);
        //   dispatchAction(dispatch, SET_USER_INFO, response?.data?.data?.user);
        //   resetNavigation(SCREENS.HomeScreen, undefined);
        // });
      })
      .catch(error => {
        handleErrorRes(error, onFailure, dispatch);
      });
  };

export const onUserRegister =
  ({
    data,
    params,
    onSuccess,
    onFailure,
  }: requestProps): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true);
    return makeAPIRequest({method: POST, url: api.register, data: data})
      .then(async (response: any) => {
        dispatchAction(dispatch, IS_LOADING, false);
        console.log('response', response);
        if (response?.status === 200 || response?.status === 201) {
          successToast('Successfully Registered');
          navigationRef.navigate(SCREENS.LoginScreen);
        }
      })
      .catch(error => {
        handleErrorRes(error, onFailure, dispatch);
      });
  };

export const getUserDetails =
  ({
    data,
    params,
    onSuccess,
    onFailure,
  }: requestProps): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let header = {
      Authorization: await getAsyncToken(),
      Cookie: 'csrftoken=2etmNDs2TbhR9edMb7POwYsXxW6eVPPS',
    };

    return makeAPIRequest({
      method: GET,
      url: api.user,
      headers: header,
    })
      .then(async (response: any) => {
        dispatch({type: IS_LOADING, payload: false});
        dispatch({type: SET_USER_INFO, payload: response.data});
        if (onSuccess) {
          onSuccess(response.data);
        }
      })
      .catch(error => {
        handleErrorRes(error, onFailure, dispatch);
        dispatch({type: IS_LOADING, payload: false});
      });
  };
