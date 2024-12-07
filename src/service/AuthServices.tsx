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
import {api, POST} from '../utils/apiConstants';
import {setAsyncToken, setAsyncUserInfo} from '../utils/asyncStorageManager';
import {resetNavigation} from '../utils/commonFunction';
import {SCREENS} from '../navigation/screenNames';

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
