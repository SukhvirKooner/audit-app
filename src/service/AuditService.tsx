import {ThunkAction} from 'redux-thunk';
import {RootState} from '../redux/hooks';
import {AnyAction} from 'redux';
import {
  handleErrorRes,
  makeAPIRequest,
  setAuthorization,
} from '../utils/apiGlobal';
import {api, GET, POST, PUT} from '../utils/apiConstants';
import {
  GET_AUDITS,
  GET_AUDITS_DETAILS,
  IS_LOADING,
  SET_GROUP_LIST,
} from '../redux/actionTypes';
import axios from 'axios';
import {getAsyncToken} from '../utils/asyncStorageManager';
import {errorToast} from '../utils/commonFunction';

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
      url: api.audits_details_id + data,
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

export const createAudits =
  ({
    data,
    params,
    onSuccess,
    onFailure,
  }: requestProps): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    dispatch({type: IS_LOADING, payload: true});

    return makeAPIRequest({
      method: POST,
      url: api.audits_details_id,
      data: data,
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

export const editAudits =
  ({
    data,
    params,
    onSuccess,
    onFailure,
  }: requestProps): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    dispatch({type: IS_LOADING, payload: true});

    return makeAPIRequest({
      method: PUT,
      url: api.audits_details_id + data?.response_id + '/',
      data: data,
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
      url: api.templates + data?.id + '/',
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
export const getGroupsList =
  ({
    onSuccess,
    onFailure,
  }: requestProps): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    dispatch({type: IS_LOADING, payload: true});

    return makeAPIRequest({
      method: GET,
      url: api.groups,
    })
      .then(async (response: any) => {
        dispatch({type: IS_LOADING, payload: false});

        dispatch({type: SET_GROUP_LIST, payload: response.data});

        if (onSuccess) {
          onSuccess(response.data);
        }
      })
      .catch(error => {
        handleErrorRes(error, onFailure, dispatch);
        dispatch({type: IS_LOADING, payload: false});
      });
  };

export const uploadImage = async (data: any) => {
  // dispatch({type: IS_LOADING, payload: true});

  return makeAPIRequest({
    method: POST,
    url: api.upload_image,
    data: data,
  })
    .then(async (response: any) => {
      // dispatch({type: IS_LOADING, payload: false});

      return response.data;
    })
    .catch(error => {
      // handleErrorRes(error, onFailure, dispatch);
      if (error?.message) {
        errorToast(error?.message);
      } else {
        errorToast('Please try again');
      }
      // dispatch({type: IS_LOADING, payload: false});
    });
};
