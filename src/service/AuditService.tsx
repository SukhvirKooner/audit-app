import {ThunkAction} from 'redux-thunk';
import {RootState} from '../redux/hooks';
import {AnyAction} from 'redux';
import {
  handleErrorRes,
  makeAPIRequest,
  makeAPIRequestNew,
  setAuthorization,
} from '../utils/apiGlobal';
import {api, GET, POST, PUT} from '../utils/apiConstants';
import {
  GET_AUDITS,
  GET_AUDITS_DETAILS,
  GET_AUDITS_DETAILS_DATA,
  GET_TEMPLATE,
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
    let header = {
      Authorization: await getAsyncToken(),
      Cookie: 'csrftoken=2etmNDs2TbhR9edMb7POwYsXxW6eVPPS',
    };
    return makeAPIRequest({
      method: GET,
      url: api.audits,
      headers: header,
    })
      .then(async (response: any) => {
        dispatch({type: IS_LOADING, payload: false});
        const filterList = response.data.filter((i: any) => {
          return i?.assigned_group === 1;
        });

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
    let header = {
      Authorization: await getAsyncToken(),
      Cookie: 'csrftoken=2etmNDs2TbhR9edMb7POwYsXxW6eVPPS',
    };

    return makeAPIRequest({
      method: GET,
      url: api.audits + data?.id + api.audits_details,
      headers: header,
    })
      .then(async (response: any) => {
        dispatch({type: IS_LOADING, payload: false});

        dispatch({type: GET_AUDITS_DETAILS, payload: response.data});
        if (onSuccess) {
          onSuccess(response.data);
        }
      })
      .catch(error => {
        // handleErrorRes(error, onFailure, dispatch);
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
    // dispatch({type: IS_LOADING, payload: true});
    let header = {
      Authorization: await getAsyncToken(),
      Cookie: 'csrftoken=2etmNDs2TbhR9edMb7POwYsXxW6eVPPS',
    };
    return makeAPIRequest({
      method: GET,
      url: api.audits_details_id + data,
      headers: header,
    })
      .then(async (response: any) => {
        dispatch({type: IS_LOADING, payload: false});

        dispatch({type: GET_AUDITS_DETAILS_DATA, payload: response.data});

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
    let header = {
      Authorization: await getAsyncToken(),
      Cookie: 'csrftoken=2etmNDs2TbhR9edMb7POwYsXxW6eVPPS',
    };
    console.log('datadatadatadatadatadata', data);

    return makeAPIRequest({
      method: POST,
      url: api.audits_details_id,
      data: data,
      headers: header,
    })
      .then(async (response: any) => {
        dispatch({type: IS_LOADING, payload: false});

        if (onSuccess) {
          onSuccess(response.data);
        }
      })
      .catch(error => {
        console.log('error', error);

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
    let header = {
      Authorization: await getAsyncToken(),
      Cookie: 'csrftoken=2etmNDs2TbhR9edMb7POwYsXxW6eVPPS',
    };
    return makeAPIRequest({
      method: PUT,
      url: api.audits_details_id + data?.response_id + '/',
      data: data,
      headers: header,
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
    let header = {
      Authorization: await getAsyncToken(),
      Cookie: 'csrftoken=2etmNDs2TbhR9edMb7POwYsXxW6eVPPS',
    };
    return makeAPIRequest({
      method: GET,
      url: api.templates + data?.id + '/',
      headers: header,
    })
      .then(async (response: any) => {
        dispatch({type: IS_LOADING, payload: false});

        dispatch({type: GET_TEMPLATE, payload: response.data?.fields});

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
    let header = {
      Authorization: await getAsyncToken(),
      Cookie: 'csrftoken=2etmNDs2TbhR9edMb7POwYsXxW6eVPPS',
    };
    return makeAPIRequest({
      method: GET,
      url: api.groups,
      headers: header,
    })
      .then(async (response: any) => {
        dispatch({type: IS_LOADING, payload: false});

        dispatch({type: SET_GROUP_LIST, payload: response.data});

        if (onSuccess) {
          onSuccess(response.data);
        }
      })
      .catch(error => {
        // handleErrorRes(error, onFailure, dispatch);
        dispatch({type: IS_LOADING, payload: false});
      });
  };

export const uploadImage = async (data: any) => {
  // dispatch({type: IS_LOADING, payload: true});
  console.log('uploadImagedata', data);
  let header = {
    Authorization: await getAsyncToken(),
    Cookie: 'csrftoken=2etmNDs2TbhR9edMb7POwYsXxW6eVPPS',
  };
  return makeAPIRequest({
    method: POST,
    url: api.upload_image,
    data: data,
    headers: header,
  })
    .then(async (response: any) => {
      // dispatch({type: IS_LOADING, payload: false});

      return response.data;
    })
    .catch(error => {
      // handleErrorRes(error, onFailure, dispatch);
      console.log('errorerrorerrorerror', error?.response);

      if (error?.message) {
        errorToast(error?.message);
      } else {
        errorToast('Please try again');
      }
      // dispatch({type: IS_LOADING, payload: false});
    });
};

export const tokenDropDownListAction =
  ({
    data,
    onSuccess,
    onFailure,
  }: requestProps): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    console.log('tokenDropDownListAction');

    return makeAPIRequestNew({
      method: POST,
      url: data?.endpoint,
      data: data?.body,
      headers: data?.header,
    })
      .then(async (response: any) => {
        if (onSuccess) {
          onSuccess(response.data);
        }
      })
      .catch(error => {});
  };

export const getDropDownListAction =
  ({
    params,
    data,
    onSuccess,
    onFailure,
  }: requestProps): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    console.log('tokenDropDownListAction111');

    return makeAPIRequestNew({
      method: GET,
      url: data?.endpoint,
      params: params,
    })
      .then(async (response: any) => {
        if (onSuccess) {
          onSuccess(response.data);
        }
      })
      .catch(error => {});
  };
