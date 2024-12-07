import {ThunkAction} from 'redux-thunk';
import {RootState} from '../redux/hooks';
import {AnyAction} from 'redux';
import {handleErrorRes, makeAPIRequest} from '../utils/apiGlobal';
import {api, GET} from '../utils/apiConstants';
import {GET_AUDITS, GET_AUDITS_DETAILS, IS_LOADING} from '../redux/actionTypes';

interface requestProps {
  data?: any;
  params?: any;
  onSuccess?: (res: any) => void;
  onFailure?: (res: any) => void;
}

export const getAudits =
  ({
    data,
    params,
    onSuccess,
    onFailure,
  }: requestProps): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    dispatch({type: IS_LOADING, payload: true});

    return makeAPIRequest({
      method: GET,
      url: api.audits,
    })
      .then(async (response: any) => {
        dispatch({type: IS_LOADING, payload: false});

        dispatch({type: GET_AUDITS, payload: response.data});
        if (onSuccess) {
          onSuccess(response.data);
        }
        // handleSuccessRes(response, onSuccess, onFailure, dispatch, async () => {
        // //   dispatchAction(
        // //     dispatch,
        // //     SET_USER_WISE_CHAT_SETTINGS,
        // //     response?.data?.data,
        // //   );
        // });
      })
      .catch(error => {
        handleErrorRes(error, onFailure, dispatch);
        dispatch({type: IS_LOADING, payload: false});
      });
  };

export const getAuditsDetails =
  ({
    data,
    params,
    onSuccess,
    onFailure,
  }: requestProps): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    dispatch({type: IS_LOADING, payload: true});

    return makeAPIRequest({
      method: GET,
      url: api.audits + data?.id + api.audits_details,
    })
      .then(async (response: any) => {
        dispatch({type: IS_LOADING, payload: false});

        dispatch({type: GET_AUDITS_DETAILS, payload: response.data});
        if (onSuccess) {
          onSuccess(response.data);
        }
      })
      .catch(error => {
        handleErrorRes(error, onFailure, dispatch);
        dispatch({type: IS_LOADING, payload: false});
      });
  };

export const getAuditsDetailsByID =
  ({
    data,
    params,
    onSuccess,
    onFailure,
  }: requestProps): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    dispatch({type: IS_LOADING, payload: true});

    return makeAPIRequest({
      method: GET,
      url: api.audits_details_id + data?.id,
    })
      .then(async (response: any) => {
        dispatch({type: IS_LOADING, payload: false});

        if (onSuccess) {
          onSuccess(response.data);
        }
      })
      .catch(error => {
        handleErrorRes(error, onFailure, dispatch);
        dispatch({type: IS_LOADING, payload: false});
      });
  };

export const getTemplate =
  ({
    data,
    params,
    onSuccess,
    onFailure,
  }: requestProps): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    dispatch({type: IS_LOADING, payload: true});

    return makeAPIRequest({
      method: GET,
      url: api.templates + data?.id,
    })
      .then(async (response: any) => {
        dispatch({type: IS_LOADING, payload: false});

        if (onSuccess) {
          onSuccess(response.data);
        }
      })
      .catch(error => {
        handleErrorRes(error, onFailure, dispatch);
        dispatch({type: IS_LOADING, payload: false});
      });
  };
